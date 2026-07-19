/**
 * In-memory vector store with cosine similarity search.
 *
 * For a portfolio-sized corpus (< 500 chunks), brute-force search over
 * dense vectors is faster than a network hop to a managed vector DB
 * and has zero infrastructure cost. We index once at server startup
 * (or lazily on first request) and hold the result in process memory.
 *
 * If the corpus grows past ~10k chunks, migrate to pgvector or Qdrant.
 */

import { cosineSimilarity, embedOne } from "./embeddings";
import type { KnowledgeChunk } from "./knowledge";

export interface ScoredChunk extends KnowledgeChunk {
  score: number;
}

export interface RetrievalResult {
  chunks: ScoredChunk[];
  query: string;
  timingMs: number;
}

/** Simple BM25-ish lexical score for hybrid retrieval fallback. */
function lexicalScore(query: string, text: string): number {
  const qTokens = new Set(query.toLowerCase().split(/\W+/).filter(Boolean));
  const tLower = text.toLowerCase();
  let hits = 0;
  for (const t of qTokens) if (tLower.includes(t)) hits++;
  return qTokens.size ? hits / qTokens.size : 0;
}

export class VectorStore {
  private chunks: KnowledgeChunk[] = [];
  private embeddings: number[][] = [];

  async index(chunks: KnowledgeChunk[]): Promise<void> {
    this.chunks = chunks;
    // Embed in batches to avoid OOM on very large corpora
    const BATCH = 32;
    const all: number[][] = [];
    for (let i = 0; i < chunks.length; i += BATCH) {
      const batch = chunks.slice(i, i + BATCH).map((c) => c.text);
      const { embed } = await import("./embeddings");
      const vecs = await embed(batch);
      all.push(...vecs);
    }
    this.embeddings = all;
  }

  async search(query: string, topK = 5): Promise<RetrievalResult> {
    if (!this.chunks.length) {
      return { chunks: [], query, timingMs: 0 };
    }
    const t0 = Date.now();
    const qVec = await embedOne(query);

    const scored: ScoredChunk[] = this.chunks.map((chunk, i) => {
      const dense = cosineSimilarity(qVec, this.embeddings[i]);
      const lexical = lexicalScore(query, chunk.text) * 0.15; // small lexical boost
      return { ...chunk, score: dense + lexical };
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, topK).filter((c) => c.score > 0.35); // relevance floor

    return { chunks: top, query, timingMs: Date.now() - t0 };
  }

  size(): number {
    return this.chunks.length;
  }
}

// Singleton — knowledge base is static across requests.
let storePromise: Promise<VectorStore> | null = null;

/**
 * Warm up the embedding model and index the knowledge base.
 * This downloads the ONNX model (~130MB) on first call, then caches.
 * Call this eagerly (e.g. when the user opens the chat modal) so the
 * first real question feels instant instead of waiting 2-3 minutes.
 */
export async function warmUp(): Promise<{ chunks: number; ready: boolean }> {
  if (storePromise) {
    const store = await storePromise;
    return { chunks: store.size(), ready: true };
  }
  storePromise = (async () => {
    const { loadKnowledgeBase } = await import("./knowledge");
    const chunks = await loadKnowledgeBase();
    const store = new VectorStore();
    await store.index(chunks);
    console.log(`[rag] indexed ${chunks.length} chunks`);
    return store;
  })();
  const store = await storePromise;
  return { chunks: store.size(), ready: true };
}

export async function getVectorStore(): Promise<VectorStore> {
  if (!storePromise) {
    // If not warmed up yet, do it now (lazy fallback)
    await warmUp();
  }
  return storePromise as Promise<VectorStore>;
}