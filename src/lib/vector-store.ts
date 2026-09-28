import type { KnowledgeChunk } from "./knowledge";
import { cosineSimilarity } from "./embeddings";

export interface ScoredChunk extends KnowledgeChunk {
  score: number;
}

export interface RetrievalResult {
  chunks: ScoredChunk[];
  query: string;
  timingMs: number;
}

interface CachedChunk extends KnowledgeChunk {
  vector: number[];
}

export interface EmbeddingsCache {
  chunks: CachedChunk[];
  generatedAt: string;
  model: string;
  dimensions: number;
  isFallback?: boolean;
}

// @ts-ignore - generated at build time
import cache from "./embeddings-cache.json";

function lexicalScore(query: string, text: string): number {
  const qTokens = Array.from(new Set(query.toLowerCase().split(/\W+/).filter((t) => t.length > 1)));
  if (qTokens.length === 0) return 0;
  const tLower = text.toLowerCase();
  let hits = 0;
  for (const t of qTokens) {
    if (tLower.includes(t)) hits++;
  }
  return hits / qTokens.length;
}

export class VectorStore {
  private chunks: CachedChunk[] = ((cache as unknown as EmbeddingsCache)?.chunks) || [];

  async init(): Promise<void> {
    if (this.chunks.length === 0) {
      try {
        const { loadKnowledgeBase } = await import("./knowledge");
        const rawChunks = await loadKnowledgeBase();
        const { generateFallbackVector, DEFAULT_EMBEDDING_DIMENSIONS } = await import("./embeddings");
        this.chunks = rawChunks.map((c) => ({
          ...c,
          vector: generateFallbackVector(c.text, DEFAULT_EMBEDDING_DIMENSIONS),
        }));
      } catch (err) {
        console.error("[vector-store] Failed to load knowledge base on the fly:", err);
      }
    }
  }

  async search(query: string, topK = 5): Promise<RetrievalResult> {
    if (this.chunks.length === 0) {
      await this.init();
    }
    if (!this.chunks.length) return { chunks: [], query, timingMs: 0 };

    const t0 = Date.now();
    let qVec: number[] | null = null;
    try {
      qVec = await this.embedQuery(query);
    } catch (err) {
      console.warn("[vector-store] Query embedding error, falling back to lexical:", err);
    }

    const scored: ScoredChunk[] = this.chunks.map((chunk) => {
      const hasVector = qVec && chunk.vector && qVec.length === chunk.vector.length;
      const dense = hasVector ? cosineSimilarity(qVec!, chunk.vector) : 0;
      const lexical = lexicalScore(query, chunk.text);
      const score = hasVector ? dense * 0.75 + lexical * 0.25 : lexical;
      return { ...chunk, score };
    });

    scored.sort((a, b) => b.score - a.score);

    const threshold = qVec ? 0.2 : 0.05;
    let top = scored.slice(0, topK).filter((c) => c.score > threshold);

    // If threshold filtered everything out but top chunk has positive lexical hit, return top matches
    if (top.length === 0 && scored.length > 0 && scored[0].score > 0) {
      top = scored.slice(0, Math.min(topK, 3));
    }

    return { chunks: top, query, timingMs: Date.now() - t0 };
  }

  private async embedQuery(query: string): Promise<number[]> {
    const { embedQuery } = await import("./embeddings");
    return embedQuery(query);
  }

  size(): number {
    return this.chunks.length;
  }

  getModelInfo(): { model: string; dimensions: number } {
    const c = cache as unknown as EmbeddingsCache;
    return {
      model: c?.model || "nvidia/llama-nemotron-embed-vl-1b-v2",
      dimensions: c?.dimensions || 2048,
    };
  }
}

let storePromise: Promise<VectorStore> | null = null;

export async function warmUp(): Promise<{ chunks: number; ready: boolean }> {
  if (storePromise) {
    const store = await storePromise;
    return { chunks: store.size(), ready: true };
  }
  storePromise = (async () => {
    const store = new VectorStore();
    await store.init();
    return store;
  })();
  const store = await storePromise;
  return { chunks: store.size(), ready: true };
}

export async function getVectorStore(): Promise<VectorStore> {
  if (!storePromise) await warmUp();
  return storePromise as Promise<VectorStore>;
}
