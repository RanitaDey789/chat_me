"use client";

import { Database, Cpu, Zap, Layers, Server, FileText } from "lucide-react";
import { useEffect, useState } from "react";

interface KBStats {
  chunks: number;
  sources: string[];
  byCategory: Record<string, number>;
  provider: { name: string; model: string };
  embeddingModel: string;
  embeddingDimensions: number;
}

export function ArchitecturePanel() {
  const [stats, setStats] = useState<KBStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/knowledge")
      .then((r) => r.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="h-full overflow-y-auto p-5 space-y-5">
      <div>
        <div className="text-[11px] uppercase tracking-wider text-[var(--color-accent-2)] font-semibold mb-1">
          System Architecture
        </div>
        <h2 className="text-lg font-semibold text-white">RAG Pipeline</h2>
      </div>

      {/* Pipeline visualization */}
      <div className="space-y-2">
        <PipelineStep
          icon={<FileText className="h-3.5 w-3.5" />}
          num="1"
          title="Query"
          desc="Your question → embedded locally via BGE-small"
        />
        <PipelineStep
          icon={<Database className="h-3.5 w-3.5" />}
          num="2"
          title="Retrieval"
          desc="Cosine similarity over dense vectors (top-k=5)"
        />
        <PipelineStep
          icon={<Layers className="h-3.5 w-3.5" />}
          num="3"
          title="Augmentation"
          desc="Chunks injected into system prompt with citations"
        />
        <PipelineStep
          icon={<Cpu className="h-3.5 w-3.5" />}
          num="4"
          title="Generation"
          desc="Streaming chat completion, grounded in context"
        />
      </div>

      {/* Live stats */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-2)] p-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--color-text-dim)] mb-3">
          <Zap className="h-3 w-3 text-[var(--color-accent-2)]" />
          Live System
        </div>
        {loading ? (
          <div className="text-xs text-[var(--color-text-mute)]">Loading knowledge base…</div>
        ) : stats ? (
          <dl className="space-y-2 text-sm">
            <Row label="Chunks indexed" value={stats.chunks.toString()} />
            <Row label="Documents" value={stats.sources.length.toString()} />
            <Row label="Embedding model" value="BGE-small-en (384d)" mono />
            <Row label="Embedding runtime" value="Local (ONNX)" />
            <Row label="LLM provider" value={stats.provider.name} />
            <Row label="LLM model" value={stats.provider.model} mono />
          </dl>
        ) : null}
      </div>

      {/* Categories breakdown */}
      {stats && Object.keys(stats.byCategory).length > 0 && (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-2)] p-4">
          <div className="text-xs uppercase tracking-wider text-[var(--color-text-dim)] mb-3">
            Knowledge Coverage
          </div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(stats.byCategory).map(([cat, n]) => (
              <span
                key={cat}
                className="text-xs px-2 py-1 rounded-md bg-[var(--color-panel)] border border-[var(--color-border)] text-[var(--color-text)]"
              >
                {cat} <span className="text-[var(--color-text-mute)]">· {n}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Architecture principles */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel-2)] p-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--color-text-dim)] mb-3">
          <Server className="h-3 w-3" />
          Design Principles
        </div>
        <ul className="space-y-2 text-xs text-[var(--color-text)]">
          <li className="flex gap-2">
            <span className="text-[var(--color-accent-2)]">→</span>
            <span>
              <strong className="text-white">Zero-cost embeddings</strong> — BGE-small runs locally
              via ONNX, no API calls.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--color-accent-2)]">→</span>
            <span>
              <strong className="text-white">In-memory vector store</strong> — for a small corpus,
              brute-force beats a managed vector DB.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--color-accent-2)]">→</span>
            <span>
              <strong className="text-white">Provider-agnostic LLM</strong> — OpenAI-compatible API,
              defaults to free tiers (Groq, OpenRouter).
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--color-accent-2)]">→</span>
            <span>
              <strong className="text-white">Streaming + citations</strong> — fast time-to-first-token,
              full transparency on sources.
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-[var(--color-accent-2)]">→</span>
            <span>
              <strong className="text-white">Grounded refusal</strong> — never fabricates; redirects
              off-topic queries.
            </span>
          </li>
        </ul>
      </div>

      {/* Setup hint */}
      <div className="rounded-xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-bg)] p-4 text-xs">
        <div className="font-semibold text-white mb-2">Deploy to Netlify</div>
        <ol className="space-y-1 list-decimal list-inside text-[var(--color-text-dim)]">
          <li>Push this repo to GitHub</li>
          <li>Import on Netlify (auto-detects Next.js)</li>
          <li>Add env vars: <code className="text-[var(--color-accent-2)]">GROQ_API_KEY</code></li>
          <li>Deploy — done. First request warms the embedding model.</li>
        </ol>
      </div>
    </div>
  );
}

function PipelineStep({
  icon,
  num,
  title,
  desc,
}: {
  icon: React.ReactNode;
  num: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-panel)] border border-[var(--color-border)]">
      <div className="h-7 w-7 rounded-md bg-[var(--color-accent)] flex items-center justify-center text-white text-xs font-bold shrink-0">
        {num}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-white">
          <span className="text-[var(--color-accent-2)]">{icon}</span>
          {title}
        </div>
        <div className="text-xs text-[var(--color-text-dim)] mt-0.5">{desc}</div>
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-[var(--color-text-dim)]">{label}</dt>
      <dd className={`text-[var(--color-text)] ${mono ? "font-mono text-xs" : ""} truncate`}>
        {value}
      </dd>
    </div>
  );
}
