"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageBubble, type Message, type SourceRef } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { Bot } from "lucide-react";

export function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (isStreaming) return;

      const userMsg: Message = {
        id: `u-${Date.now()}`,
        role: "user",
        content: text,
      };

      const assistantId = `a-${Date.now()}`;
      const placeholder: Message = {
        id: assistantId,
        role: "assistant",
        content: "",
        streaming: true,
      };

      const nextHistory = [...messages, userMsg];
      setMessages([...nextHistory, placeholder]);
      setIsStreaming(true);

      const history = messages
        .filter((m) => !m.streaming)
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        abortRef.current = new AbortController();
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, history }),
          signal: abortRef.current.signal,
        });

        if (!res.ok || !res.body) {
          throw new Error(`HTTP ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let sources: SourceRef[] = [];
        let retrievalMs = 0;
        let currentEvent = "";
        let accumulated = "";

        const updateAssistant = (patch: Partial<Message>) => {
          setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, ...patch } : m)));
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // parse SSE
          const parts = buffer.split("\n\n");
          buffer = parts.pop() || "";

          for (const part of parts) {
            if (!part.trim()) continue;
            const lines = part.split("\n");
            for (const line of lines) {
              if (line.startsWith("event:")) {
                currentEvent = line.slice(6).trim();
              } else if (line.startsWith("data:")) {
                const data = line.slice(5);
                if (currentEvent === "sources") {
                  try {
                    const parsed = JSON.parse(data);
                    sources = parsed.chunks || [];
                    retrievalMs = parsed.timingMs || 0;
                    updateAssistant({ sources, retrievalMs });
                  } catch {}
                } else if (currentEvent === "delta") {
                  accumulated += data.startsWith(" ") ? data : data;
                  // SSE collapses leading spaces; reconstruct by re-joining with newline when needed
                  updateAssistant({ content: accumulated });
                } else if (currentEvent === "error") {
                  try {
                    const parsed = JSON.parse(data);
                    updateAssistant({ content: `⚠️ ${parsed.message}` });
                  } catch {
                    updateAssistant({ content: `⚠️ ${data}` });
                  }
                }
              }
            }
          }
        }

        updateAssistant({ streaming: false });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Request failed";
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: `⚠️ ${errorMessage}`, streaming: false }
              : m
          )
        );
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, isStreaming]
  );

  const clearChat = () => {
    abortRef.current?.abort();
    setMessages([]);
    setIsStreaming(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#7c5cff] to-[#4ecdc4] flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-white">Portfolio Assistant</div>
            <div className="text-xs text-[var(--color-text-dim)] flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent-2)] animate-pulse" />
              RAG-powered · grounded in my knowledge base
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="text-xs text-[var(--color-text-dim)] hover:text-white px-3 py-1.5 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)] transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-6">
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">
                <span className="gradient-text">Ask me anything</span>
              </h1>
              <p className="text-[var(--color-text-dim)] max-w-md mx-auto">
                I'm an AI assistant trained on my portfolio, projects, and engineering decisions.
                Try a question below.
              </p>
            </div>
            <SuggestedQuestions onSelect={sendMessage} />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-5 pb-5 pt-2 border-t border-[var(--color-border)] bg-[var(--color-bg)]/50 backdrop-blur">
        <div className="max-w-3xl mx-auto">
          <ChatInput onSend={sendMessage} disabled={isStreaming} />
        </div>
      </div>
    </div>
  );
}
