#!/usr/bin/env tsx
import { loadKnowledgeBase } from "../src/lib/knowledge.js";
import {
  embed,
  getEmbeddingModelInfo,
  DEFAULT_NVIDIA_EMBED_MODEL,
  DEFAULT_EMBEDDING_DIMENSIONS,
} from "../src/lib/embeddings.js";
import { writeFileSync, existsSync, readFileSync } from "fs";
import { join } from "path";

async function buildEmbeddings() {
  console.log("[build] Loading knowledge base...");
  const chunks = await loadKnowledgeBase();
  console.log(`[build] Found ${chunks.length} chunks`);

  const outPath = join(process.cwd(), "src", "lib", "embeddings-cache.json");
  const hasKey = Boolean(process.env.NVIDIA_API_KEY || process.env.OPENAI_API_KEY);

  // If already exists and no API key is provided, keep existing cache
  if (!hasKey && existsSync(outPath)) {
    try {
      const existing = JSON.parse(readFileSync(outPath, "utf-8"));
      if (Array.isArray(existing.chunks) && existing.chunks.length > 0) {
        console.log(
          `[build] ✓ Reusing existing embeddings cache (${existing.chunks.length} chunks, model: ${existing.model || "cached"}).`
        );
        console.log("[build] (To refresh with NVIDIA NIM embeddings, set NVIDIA_API_KEY in your environment)");
        return;
      }
    } catch {
      // If corrupted, re-generate below
    }
  }

  const modelInfo = getEmbeddingModelInfo();
  console.log(
    `[build] Generating embeddings using ${modelInfo.provider === "nvidia" ? "NVIDIA NIM" : modelInfo.provider} (${modelInfo.model})...`
  );

  const BATCH = 16;
  const allVectors: number[][] = [];

  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH).map((c) => c.text);
    try {
      const vectors = await embed(batch, { inputType: "passage", allowFallback: true });
      allVectors.push(...vectors);
      console.log(`[build] Embedded ${Math.min(i + BATCH, chunks.length)}/${chunks.length}`);
    } catch (err) {
      console.warn(`[build] Batch ${i}-${i + BATCH} embedding error, using fallback for batch:`, err);
      const fallbackVectors = await embed(batch, { inputType: "passage", allowFallback: true });
      allVectors.push(...fallbackVectors);
    }

    // Small breathing room between network batches to avoid rate limits
    if (hasKey && i + BATCH < chunks.length) {
      await new Promise((res) => setTimeout(res, 120));
    }
  }

  const output = {
    chunks: chunks.map((c, i) => ({ ...c, vector: allVectors[i] })),
    generatedAt: new Date().toISOString(),
    model: hasKey ? modelInfo.model : DEFAULT_NVIDIA_EMBED_MODEL,
    dimensions: allVectors[0]?.length || DEFAULT_EMBEDDING_DIMENSIONS,
    isFallback: !hasKey,
  };

  writeFileSync(outPath, JSON.stringify(output));
  console.log(
    `[build] ✓ Successfully saved ${output.chunks.length} chunks to ${outPath} (dimensions: ${output.dimensions})`
  );
}

buildEmbeddings().catch((err) => {
  console.error("[build] Failed:", err);
  process.exit(1);
});
