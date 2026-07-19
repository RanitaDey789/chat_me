"use client";

import { Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "Tell me about yourself",
  "What's your strongest technical skill?",
  "Walk me through your RAG chatbot project",
  "Why did you choose YOLOv8 for your vision pipeline?",
  "What did you learn from your internships?",
  "Why should we hire you?",
  "What are your hobbies outside tech?",
  "Tell me about your publications",
];

export function SuggestedQuestions({ onSelect }: { onSelect: (q: string) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--color-text-dim)] px-1">
        <Sparkles className="h-3 w-3 text-[var(--color-accent-2)]" />
        Try asking
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {SUGGESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => onSelect(q)}
            className="text-left px-3.5 py-2.5 rounded-xl bg-[var(--color-panel)] hover:bg-[var(--color-panel-2)] border border-[var(--color-border)] hover:border-[var(--color-accent)] text-sm text-[var(--color-text)] transition-all"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
