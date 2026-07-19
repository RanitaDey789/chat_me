"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Bot, User, Copy, Check } from "lucide-react";
import { useState } from "react";

export interface SourceRef {
  id: string;
  source: string;
  headingPath: string[];
  score: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceRef[];
  retrievalMs?: number;
  streaming?: boolean;
}

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={`msg-in flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center ${
          isUser ? "bg-[var(--color-user)]" : "bg-gradient-to-br from-[#7c5cff] to-[#4ecdc4]"
        }`}
      >
        {isUser ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
      </div>
      <div className={`flex flex-col gap-1 max-w-[85%] ${isUser ? "items-end" : ""}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-[var(--color-user)] text-white"
              : "bg-[var(--color-panel)] border border-[var(--color-border)]"
          }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : message.content ? (
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          ) : (
            <TypingIndicator />
          )}
          {message.streaming && message.content && (
            <span className="inline-block w-1.5 h-4 bg-[var(--color-accent)] ml-0.5 align-middle animate-pulse" />
          )}
        </div>
        {!isUser && message.content && !message.streaming && (
          <div className="flex items-center gap-2 px-1 text-xs text-[var(--color-text-mute)]">
            <button
              onClick={copy}
              className="flex items-center gap-1 hover:text-[var(--color-text)] transition-colors"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
            {message.retrievalMs !== undefined && (
              <span>· retrieved in {message.retrievalMs}ms</span>
            )}
          </div>
        )}
        {!isUser && message.sources && message.sources.length > 0 && (
          <SourceList sources={message.sources} />
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center h-5">
      <span className="typing-dot h-2 w-2 rounded-full bg-[var(--color-text-dim)]" />
      <span className="typing-dot h-2 w-2 rounded-full bg-[var(--color-text-dim)]" />
      <span className="typing-dot h-2 w-2 rounded-full bg-[var(--color-text-dim)]" />
    </div>
  );
}

function SourceList({ sources }: { sources: SourceRef[] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="text-xs">
      <button
        onClick={() => setExpanded(!expanded)}
        className="text-[var(--color-text-dim)] hover:text-[var(--color-text)] transition-colors flex items-center gap-1"
      >
        <span className="text-[var(--color-accent-2)]">●</span>
        {sources.length} source{sources.length !== 1 ? "s" : ""} retrieved
        <span className="text-[10px]">{expanded ? "▾" : "▸"}</span>
      </button>
      {expanded && (
        <div className="mt-2 space-y-1.5">
          {sources.map((s, i) => (
            <div
              key={s.id}
              className="flex items-start gap-2 px-2.5 py-1.5 rounded-lg bg-[var(--color-panel-2)] border border-[var(--color-border)]"
            >
              <span className="text-[var(--color-accent)] font-mono shrink-0">[{i + 1}]</span>
              <div className="flex-1 min-w-0">
                <div className="text-[var(--color-text)] truncate font-medium">{s.source}</div>
                {s.headingPath.length > 0 && (
                  <div className="text-[var(--color-text-mute)] truncate">
                    {s.headingPath.join(" › ")}
                  </div>
                )}
              </div>
              <span className="text-[var(--color-text-mute)] font-mono shrink-0">
                {s.score.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
