"use client";

/**
 * <ChatWidget /> — drop-in floating chat button + modal.
 * <ChatWindow /> — exported standalone chat interface for embed mode (/embed).
 *
 * Usage (in your portfolio):
 *
 *   import { ChatWidget } from "@/components/ChatWidget";
 *   ...
 *   return <><YourPortfolio /><ChatWidget ownerName="Your Name" /></>;
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Bot, Send, Loader2, Sparkles, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface SourceRef {
  id: string;
  source: string;
  headingPath: string[];
  score: number;
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceRef[];
  retrievalMs?: number;
  streaming?: boolean;
}

interface ChatWidgetProps {
  ownerName?: string;
  apiBase?: string;
}

// ─── Floating widget ───────────────────────────────────────────────────────

export function ChatWidget({ ownerName = "Ranita Dey", apiBase = "" }: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [warm, setWarm] = useState(false);
  const [unread, setUnread] = useState(0);

  // When the modal opens, start warming the model in the background.
  // This downloads the ~130MB ONNX embedding model on first open so that
  // the user's first question feels instant instead of waiting 2-3 minutes.
  useEffect(() => {
    if (!open || warm) return;
    (async () => {
      try {
        await fetch(`${apiBase}/api/warmup`, { method: "POST" });
        setWarm(true);
      } catch {
        // If warmup fails (server not ready, network issue), the chat
        // still works — the first question will trigger lazy warmup.
        setWarm(true);
      }
    })();
  }, [open, warm, apiBase]);

  const handleNewAssistantMessage = useCallback(() => {
    if (!open) setUnread((n) => n + 1);
  }, [open]);

  const handleOpen = () => {
    setOpen(true);
    setUnread(0);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        aria-label="Open chat"
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-2xl shadow-[#7c5cff]/30 bg-gradient-to-br from-[#7c5cff] to-[#4ecdc4] hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
      >
        <MessageCircle className="h-6 w-6 text-white" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
            {unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-[420px] h-[70vh] max-h-[700px] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-[var(--color-border)] flex flex-col bg-[var(--color-bg)]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 10%, rgba(124, 92, 255, 0.15), transparent 40%)",
            }}
          >
            {warm ? (
              <ChatWindow
                ownerName={ownerName}
                apiBase={apiBase}
                onClose={() => setOpen(false)}
                onNewAssistantMessage={handleNewAssistantMessage}
              />
            ) : (
              <WarmupScreen ownerName={ownerName} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Chat window (exported; used in widget modal + /embed page) ────────────

export function ChatWindow({
  ownerName,
  apiBase,
  onClose,
  onNewAssistantMessage,
}: {
  ownerName: string;
  apiBase: string;
  onClose?: () => void;
  onNewAssistantMessage?: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = useCallback(
    async (text: string) => {
      if (isStreaming) return;
      const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: text };
      const assistantId = `a-${Date.now()}`;
      const placeholder: Message = { id: assistantId, role: "assistant", content: "", streaming: true };

      const nextHistory = [...messages, userMsg];
      setMessages([...nextHistory, placeholder]);
      setIsStreaming(true);

      const history = messages.filter((m) => !m.streaming).map((m) => ({ role: m.role, content: m.content }));

      try {
        abortRef.current = new AbortController();
        const res = await fetch(`${apiBase}/api/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, history }),
          signal: abortRef.current.signal,
        });
        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let currentEvent = "";
        let accumulated = "";
        let sources: SourceRef[] = [];
        let retrievalMs = 0;
        let notified = false;

        const patch = (p: Partial<Message>) => {
          setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, ...p } : m)));
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() || "";
          for (const part of parts) {
            if (!part.trim()) continue;
            for (const line of part.split("\n")) {
              if (line.startsWith("event:")) currentEvent = line.slice(6).trim();
              else if (line.startsWith("data:")) {
                const data = line.slice(5);
                if (currentEvent === "sources") {
                  try {
                    const p = JSON.parse(data);
                    sources = p.chunks || [];
                    retrievalMs = p.timingMs || 0;
                    patch({ sources, retrievalMs });
                  } catch {}
                } else if (currentEvent === "delta") {
                  accumulated += data;
                  patch({ content: accumulated });
                  if (!notified && accumulated.length > 0) {
                    onNewAssistantMessage?.();
                    notified = true;
                  }
                } else if (currentEvent === "error") {
                  try {
                    const p = JSON.parse(data);
                    patch({ content: `⚠️ ${p.message}` });
                  } catch {
                    patch({ content: `⚠️ ${data}` });
                  }
                }
              }
            }
          }
        }
        patch({ streaming: false });
      } catch (err) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: `⚠️ ${err instanceof Error ? err.message : "Request failed"}`, streaming: false }
              : m
          )
        );
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, isStreaming, apiBase, onNewAssistantMessage]
  );

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-panel)]/80 backdrop-blur">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#7c5cff] to-[#4ecdc4] flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white leading-tight">Ask {ownerName}</div>
            <div className="text-[10px] text-[var(--color-text-dim)] flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-2)] animate-pulse" />
              AI assistant
            </div>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close chat"
            className="h-8 w-8 rounded-lg hover:bg-[var(--color-panel-2)] text-[var(--color-text-dim)] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <WelcomeScreen ownerName={ownerName} onSelect={send} />
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <Bubble key={m.id} message={m} />
            ))}
          </div>
        )}
      </div>

      <div className="px-3 pb-3 pt-2 border-t border-[var(--color-border)] bg-[var(--color-bg)]/50">
        <Input onSend={send} disabled={isStreaming} />
      </div>
    </>
  );
}

// ─── Welcome screen ────────────────────────────────────────────────────────

const SUGGESTIONS = [
  "Tell me about yourself",
  "What projects have you worked on?",
  "What's your strongest technical skill?",
  "Why should we hire you?",
];

function WelcomeScreen({ ownerName, onSelect }: { ownerName: string; onSelect: (q: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-2 gap-4">
      <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#7c5cff] to-[#4ecdc4] flex items-center justify-center">
        <Sparkles className="h-6 w-6 text-white" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-white mb-1">Hi, I&apos;m {ownerName}&apos;s AI assistant</h3>
        <p className="text-xs text-[var(--color-text-dim)] max-w-xs leading-relaxed">
          I&apos;ve read {ownerName}&apos;s portfolio, projects, and engineering notes. Ask me anything.
        </p>
      </div>
      <div className="w-full space-y-1.5 mt-2">
        {SUGGESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="w-full text-left px-3 py-2 rounded-lg bg-[var(--color-panel)] hover:bg-[var(--color-panel-2)] border border-[var(--color-border)] hover:border-[var(--color-accent)] text-xs text-[var(--color-text)] transition-all"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Message bubble ────────────────────────────────────────────────────────

function Bubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [showSources, setShowSources] = useState(false);

  return (
    <div className={`msg-in flex gap-2 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex-shrink-0 h-7 w-7 rounded-lg flex items-center justify-center text-[10px] font-bold ${
          isUser ? "bg-[var(--color-user)]" : "bg-gradient-to-br from-[#7c5cff] to-[#4ecdc4]"
        } text-white`}
      >
        {isUser ? "YOU" : "AI"}
      </div>
      <div className={`flex flex-col gap-1 max-w-[82%] ${isUser ? "items-end" : ""}`}>
        <div
          className={`rounded-xl px-3 py-2 text-sm ${
            isUser
              ? "bg-[var(--color-user)] text-white"
              : "bg-[var(--color-panel)] border border-[var(--color-border)] text-[var(--color-text)]"
          }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : message.content ? (
            <div className="markdown-content text-[13px]">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          ) : (
            <div className="flex gap-1 items-center h-4">
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--color-text-dim)]" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--color-text-dim)]" />
              <span className="typing-dot h-1.5 w-1.5 rounded-full bg-[var(--color-text-dim)]" />
            </div>
          )}
          {message.streaming && message.content && (
            <span className="inline-block w-1 h-3.5 bg-[var(--color-accent)] ml-0.5 align-middle animate-pulse" />
          )}
        </div>
        {!isUser && message.content && !message.streaming && (
          <div className="flex items-center gap-2 px-1 text-[10px] text-[var(--color-text-mute)]">
            <button
              onClick={() => {
                navigator.clipboard.writeText(message.content);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="flex items-center gap-1 hover:text-[var(--color-text)] transition-colors"
            >
              {copied ? <Check className="h-2.5 w-2.5" /> : <Copy className="h-2.5 w-2.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
            {message.sources && message.sources.length > 0 && (
              <>
                <span>·</span>
                <button
                  onClick={() => setShowSources((s) => !s)}
                  className="hover:text-[var(--color-text)] transition-colors flex items-center gap-1"
                >
                  <span className="text-[var(--color-accent-2)]">●</span>
                  {message.sources.length} source{message.sources.length !== 1 ? "s" : ""}
                  <span>{showSources ? "▾" : "▸"}</span>
                </button>
              </>
            )}
          </div>
        )}
        {showSources && message.sources && (
          <div className="space-y-1 w-full">
            {message.sources.map((s, i) => (
              <div
                key={s.id}
                className="px-2 py-1.5 rounded-md bg-[var(--color-panel-2)] border border-[var(--color-border)] text-[10px]"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[var(--color-accent)] font-mono">[{i + 1}]</span>
                  <span className="text-[var(--color-text)] truncate">{s.source}</span>
                </div>
                {s.headingPath.length > 0 && (
                  <div className="text-[var(--color-text-mute)] truncate pl-6">
                    {s.headingPath.join(" › ")}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Input ─────────────────────────────────────────────────────────────────

function Input({ onSend, disabled }: { onSend: (m: string) => void; disabled?: boolean }) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = Math.min(ref.current.scrollHeight, 100) + "px";
    }
  }, [value]);

  const submit = () => {
    const t = value.trim();
    if (!t || disabled) return;
    onSend(t);
    setValue("");
  };

  return (
    <div className="flex items-end gap-1.5 p-1.5 rounded-xl bg-[var(--color-panel)] border border-[var(--color-border)] focus-within:border-[var(--color-accent)] transition-colors">
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        placeholder="Ask anything..."
        rows={1}
        disabled={disabled}
        className="flex-1 bg-transparent resize-none outline-none py-2 px-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-mute)]"
        style={{ maxHeight: 100 }}
      />
      <button
        onClick={submit}
        disabled={!value.trim() || disabled}
        className="h-8 w-8 rounded-lg bg-[var(--color-accent)] hover:bg-[#8b6fff] disabled:bg-[var(--color-border)] disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
        aria-label="Send"
      >
        {disabled ? <Loader2 className="h-3.5 w-3.5 text-white animate-spin" /> : <Send className="h-3.5 w-3.5 text-white" />}
      </button>
    </div>
  );
}

// ─── Warmup screen (shown while embedding model downloads) ──────────────────

function WarmupScreen({ ownerName }: { ownerName: string }) {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Animate a progress bar over 6 seconds (warmup usually takes 30-120s)
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 95) {
          setDone(true);
          return 95;
        }
        // Slow down as we approach 95%
        const step = Math.max(0.3, 3 / (p + 1));
        return Math.min(95, p + step);
      });
    }, 300);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-5">
      {/* Animated icon */}
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-[var(--color-border)]" />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-[var(--color-accent)] animate-spin"
          style={{ borderTopColor: "#7c5cff" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Bot className="h-6 w-6 text-[var(--color-accent)]" />
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-white mb-1">
          Loading {ownerName}&apos;s AI assistant
        </h3>
        <p className="text-xs text-[var(--color-text-dim)] max-w-[280px] leading-relaxed">
          Downloading the language model for the first time. This only happens once — future
          visits will be instant.
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-[260px] space-y-2">
        <div className="h-2 rounded-full bg-[var(--color-panel-2)] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#7c5cff] to-[#4ecdc4] transition-all duration-500 ease-out"
            style={{ width: `${Math.round(progress)}%` }}
          />
        </div>
        <div className="text-[10px] text-[var(--color-text-mute)] font-mono">
          {done ? "Almost ready…" : `Loading model… ${Math.round(progress)}%`}
        </div>
      </div>

      {/* Fun fact while waiting */}
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-panel)] p-3 text-left max-w-[300px]">
        <div className="text-[10px] uppercase tracking-wider text-[var(--color-accent-2)] mb-1">
          How it works
        </div>
        <p className="text-[11px] text-[var(--color-text-dim)] leading-relaxed">
          This chatbot reads {ownerName}&apos;s portfolio notes, embeds them into a local vector
          index, and uses a 120B-parameter LLM to answer your questions — all grounded in
          real data, never fabricated.
        </p>
      </div>
    </div>
  );
}
