import type { KnowledgeChunk } from "./knowledge";

export interface ScoredChunk extends KnowledgeChunk { score: number; }
export interface RetrievalResult { chunks: ScoredChunk[]; query: string; timingMs: number; }

interface CachedChunk extends KnowledgeChunk { vector: number[]; }
interface EmbeddingsCache { chunks: CachedChunk[]; generatedAt: string; model: string; dimensions: number; }

// @ts-ignore - generated at build time
import cache from "./embeddings-cache.json";

function cosineSimilarity(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

function lexicalScore(query: string, text: string): number {
  const qTokens = new Set(query.toLowerCase().split(/\W+/).filter(Boolean));
  const tLower = text.toLowerCase();
  let hits = 0;
  for (const t of qTokens) if (tLower.includes(t)) hits++;
  return qTokens.size ? hits / qTokens.size : 0;
}

export class VectorStore {
  private chunks: CachedChunk[] = (cache as EmbeddingsCache).chunks;

  async search(query: string, topK = 5): Promise<RetrievalResult> {
    if (!this.chunks.length) return { chunks: [], query, timingMs: 0 };
    const t0 = Date.now();
    const qVec = await this.embedQuery(query);
    const scored: ScoredChunk[] = this.chunks.map((chunk) => {
      const dense = cosineSimilarity(qVec, chunk.vector);
      const lexical = lexicalScore(query, chunk.text) * 0.15;
      return { ...chunk, score: dense + lexical };
    });
    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, topK).filter((c) => c.score > 0.35);
    return { chunks: top, query, timingMs: Date.now() - t0 };
  }

  private async embedQuery(query: string): Promise<number[]> {
    const { embedOne } = await import("./embeddings");
    return embedOne(query);
  }

  size(): number { return this.chunks.length; }
}

let storePromise: Promise<VectorStore> | null = null;

export async function warmUp(): Promise<{ chunks: number; ready: boolean }> {
  if (storePromise) {
    const store = await storePromise;
    return { chunks: store.size(), ready: true };
  }
  storePromise = (async () => new VectorStore())();
  const store = await storePromise;
  return { chunks: store.size(), ready: true };
}

export async function getVectorStore(): Promise<VectorStore> {
  if (!storePromise) await warmUp();
  return storePromise as Promise<VectorStore>;
}