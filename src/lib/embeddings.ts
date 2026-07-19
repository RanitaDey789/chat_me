/**
 * Local embedding engine.
 *
 * Uses BAAI/bge-small-en-v1.5 via @huggingface/transformers (ONNX).
 *  - Runs entirely on-device, no API key, no cost, no network call.
 *  - 384 dimensions, ~130MB model, cached in ~/.cache/huggingface.
 *  - Why bge-small over bge-base? 3x faster, only ~2% worse on MTEB,
 *    perfect tradeoff for a portfolio-sized corpus.
 *
 * The pipeline is loaded lazily on first use so the server boots fast.
 */

import { pipeline, env, type FeatureExtractionPipeline } from "@huggingface/transformers";

// Use the default cache dir; transformers.js handles download & caching.
env.allowLocalModels = true;
env.useBrowserCache = false;

const MODEL_ID = "Xenova/bge-small-en-v1.5";

let extractorPromise: Promise<FeatureExtractionPipeline> | null = null;

async function getExtractor(): Promise<FeatureExtractionPipeline> {
  if (!extractorPromise) {
    extractorPromise = pipeline("feature-extraction", MODEL_ID, {
      dtype: "fp32",
    }) as Promise<FeatureExtractionPipeline>;
  }
  return extractorPromise;
}

/**
 * Embed a list of texts. Returns a Float32Array per text (384-dim).
 * BGE models expect a "passage: " / "query: " prefix for optimal perf,
 * but for small corpora the raw text works fine and simplifies the API.
 */
export async function embed(texts: string[]): Promise<number[][]> {
  const extractor = await getExtractor();
  const out = await extractor(texts, { pooling: "mean", normalize: true });
  // `out` is a Tensor: shape [n, 384]
  const data = out.data as Float32Array;
  const dim = out.dims[1] as number;
  const result: number[][] = [];
  for (let i = 0; i < texts.length; i++) {
    const start = i * dim;
    result.push(Array.from(data.slice(start, start + dim)));
  }
  return result;
}

export async function embedOne(text: string): Promise<number[]> {
  const [vec] = await embed([text]);
  return vec;
}

/** Cosine similarity between two normalized vectors. */
export function cosineSimilarity(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}
