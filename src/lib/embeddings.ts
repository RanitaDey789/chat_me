import OpenAI from "openai";

const NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1";
export const DEFAULT_NVIDIA_EMBED_MODEL = "nvidia/llama-nemotron-embed-vl-1b-v2";
export const DEFAULT_EMBEDDING_DIMENSIONS = 2048;

export interface EmbedOptions {
  inputType?: "query" | "passage";
  allowFallback?: boolean;
}

export interface EmbeddingModelInfo {
  provider: "nvidia" | "openai" | "fallback";
  model: string;
  dimensions: number;
}

/**
 * Normalizes NVIDIA model IDs so shorthand names like "llama-nemotron-embed-vl-1b-v2"
 * correctly get the required "nvidia/" prefix for the NIM API.
 */
export function normalizeNvidiaModel(model?: string): string {
  const chosen = (model || DEFAULT_NVIDIA_EMBED_MODEL).trim();
  if (chosen.includes("/")) return chosen;
  return `nvidia/${chosen}`;
}

export function getEmbeddingModelInfo(): EmbeddingModelInfo {
  if (process.env.NVIDIA_API_KEY) {
    const model = normalizeNvidiaModel(process.env.NVIDIA_EMBEDDING_MODEL);
    return {
      provider: "nvidia",
      model,
      dimensions: DEFAULT_EMBEDDING_DIMENSIONS,
    };
  }

  if (process.env.OPENAI_API_KEY) {
    return {
      provider: "openai",
      model: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small",
      dimensions: 1536,
    };
  }

  return {
    provider: "fallback",
    model: "lexical-hash-2048",
    dimensions: DEFAULT_EMBEDDING_DIMENSIONS,
  };
}

/**
 * Deterministic local feature-hashing vectorizer.
 * Provides normalized embeddings even when no cloud API key is configured,
 * ensuring cosine similarity and hybrid search function during local dev or demo mode.
 */
export function generateFallbackVector(text: string, dimensions = DEFAULT_EMBEDDING_DIMENSIONS): number[] {
  const vector = new Float32Array(dimensions);
  const tokens = text.toLowerCase().split(/\W+/).filter((t) => t.length > 1);

  if (tokens.length === 0) {
    vector[0] = 1;
    return Array.from(vector);
  }

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    // Hash 1-gram
    let h = 0x811c9dc5;
    for (let j = 0; j < token.length; j++) {
      h ^= token.charCodeAt(j);
      h = Math.imul(h, 0x01000193);
    }
    const idx = Math.abs(h) % dimensions;
    const sign = (h & 0x8000) === 0 ? 1 : -1;
    vector[idx] += sign;

    // Hash bi-gram if available for phrase context
    if (i < tokens.length - 1) {
      const bigram = `${token}_${tokens[i + 1]}`;
      let bh = 0x811c9dc5;
      for (let j = 0; j < bigram.length; j++) {
        bh ^= bigram.charCodeAt(j);
        bh = Math.imul(bh, 0x01000193);
      }
      const bIdx = Math.abs(bh) % dimensions;
      vector[bIdx] += 1.5;
    }
  }

  // L2 normalize
  let norm = 0;
  for (let i = 0; i < dimensions; i++) norm += vector[i] * vector[i];
  norm = Math.sqrt(norm);
  if (norm > 0) {
    for (let i = 0; i < dimensions; i++) vector[i] /= norm;
  }

  return Array.from(vector);
}

let warnedFallback = false;

/**
 * Generate embeddings using the configured embedding model (NVIDIA NIM primary).
 * Falls back to local deterministic vectors if keys are missing or when allowFallback is true.
 */
export async function embed(texts: string[], options: EmbedOptions = {}): Promise<number[][]> {
  if (texts.length === 0) return [];
  const inputType = options.inputType || "passage";

  // 1. NVIDIA NIM primary embedding
  if (process.env.NVIDIA_API_KEY) {
    const apiKey = process.env.NVIDIA_API_KEY;
    const preferredModel = normalizeNvidiaModel(process.env.NVIDIA_EMBEDDING_MODEL);
    const candidateModels = Array.from(
      new Set([preferredModel, "nvidia/llama-nemotron-embed-vl-1b-v2", "nvidia/llama-3.2-nv-embedqa-1b-v2", "baai/bge-m3"])
    );

    const client = new OpenAI({
      apiKey,
      baseURL: NVIDIA_BASE_URL,
    });

    let lastErr: unknown = null;
    for (const model of candidateModels) {
      try {
        const response = await client.embeddings.create({
          model,
          input: texts,
          // @ts-expect-error - input_type and truncate are NVIDIA NIM-specific fields
          input_type: inputType,
          truncate: "END",
        });

        return response.data.map((item) => item.embedding);
      } catch (err) {
        lastErr = err;
        console.warn(`[embeddings] Model ${model} returned error (${err instanceof Error ? err.message : err}). Trying next candidate...`);
      }
    }

    if (options.allowFallback) {
      console.warn(`[embeddings] All NVIDIA embedding candidates failed (${lastErr instanceof Error ? lastErr.message : lastErr}), using fallback vectors.`);
      return texts.map((t) => generateFallbackVector(t, DEFAULT_EMBEDDING_DIMENSIONS));
    }
    throw lastErr;
  }

  // 2. OpenAI fallback
  if (process.env.OPENAI_API_KEY) {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
    });

    const model = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small";
    try {
      const response = await client.embeddings.create({
        model,
        input: texts,
      });
      return response.data.map((item) => item.embedding);
    } catch (err) {
      if (options.allowFallback) {
        console.warn(`[embeddings] OpenAI API call failed, using fallback vectors.`);
        return texts.map((t) => generateFallbackVector(t, 1536));
      }
      throw err;
    }
  }

  // 3. Fallback mode (no keys configured)
  if (!warnedFallback) {
    console.warn(
      "[embeddings] NVIDIA_API_KEY not configured. Using deterministic fallback vectors for build/search. Add NVIDIA_API_KEY to activate neural embeddings."
    );
    warnedFallback = true;
  }

  return texts.map((t) => generateFallbackVector(t, DEFAULT_EMBEDDING_DIMENSIONS));
}

export async function embedOne(text: string, options: EmbedOptions = {}): Promise<number[]> {
  const [vec] = await embed([text], { ...options, inputType: options.inputType || "passage" });
  return vec;
}

export async function embedQuery(text: string, options: EmbedOptions = {}): Promise<number[]> {
  const [vec] = await embed([text], { ...options, inputType: "query", allowFallback: true });
  return vec;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length !== b.length || a.length === 0) return 0;
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}
