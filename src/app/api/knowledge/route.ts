/**
 * GET /api/knowledge
 *
 * Returns metadata about the indexed knowledge base — useful for the
 * architecture documentation panel and debugging.
 */

import { getVectorStore } from "@/lib/vector-store";
import { loadKnowledgeBase } from "@/lib/knowledge";
import { getProviderInfo } from "@/lib/llm";
import { getEmbeddingModelInfo } from "@/lib/embeddings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const [store, chunks] = await Promise.all([getVectorStore(), loadKnowledgeBase()]);
  const provider = getProviderInfo();
  const embedInfo = getEmbeddingModelInfo();
  const storeInfo = store.getModelInfo();

  const byCategory = chunks.reduce<Record<string, number>>((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});

  const sources = Array.from(new Set(chunks.map((c) => c.source))).sort();

  return Response.json({
    chunks: store.size(),
    sources,
    byCategory,
    provider: provider || { name: "demo", model: "none" },
    embeddingModel: embedInfo.provider !== "fallback" ? embedInfo.model : storeInfo.model,
    embeddingDimensions: storeInfo.dimensions || embedInfo.dimensions,
    embeddingProvider: embedInfo.provider,
  });
}
