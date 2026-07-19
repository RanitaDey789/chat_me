"use client";

import { Send, Loader2, Sparkles } from "lucide-react";
import { useState, useRef, useEffect, type FormEvent, type KeyboardEvent } from "react";

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [value]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <form onSubmit={submit} className="relative">
      <div className="flex items-end gap-2 p-2 rounded-2xl bg-[var(--color-panel)] border border-[var(--color-border)] focus-within:border-[var(--color-accent)] transition-colors">
        <Sparkles className="h-4 w-4 text-[var(--color-accent)] ml-2 mb-3 shrink-0" />
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask me about my projects, skills, or engineering decisions..."
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent resize-none outline-none py-2.5 px-1 text-[var(--color-text)] placeholder:text-[var(--color-text-mute)]"
          style={{ maxHeight: 160 }}
        />
        <button
          type="submit"
          disabled={!value.trim() || disabled}
          className="h-9 w-9 rounded-xl bg-[var(--color-accent)] hover:bg-[#8b6fff] disabled:bg-[var(--color-border)] disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0"
          aria-label="Send message"
        >
          {disabled ? (
            <Loader2 className="h-4 w-4 text-white animate-spin" />
          ) : (
            <Send className="h-4 w-4 text-white" />
          )}
        </button>
      </div>
      <div className="text-center text-[11px] text-[var(--color-text-mute)] mt-2">
        Answers are generated from the portfolio knowledge base. Verify important details directly.
      </div>
    </form>
  );
}
