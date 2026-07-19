#!/usr/bin/env tsx
import { loadKnowledgeBase } from "../src/lib/knowledge.js";
import { embed } from "../src/lib/embeddings.js";
import { writeFileSync } from "fs";
import { join } from "path";

async function buildEmbeddings() {
  console.log("[build] Loading knowledge base...");
  const chunks = await loadKnowledgeBase();
  console.log(`[build] Found ${chunks.length} chunks`);
  console.log("[build] Generating embeddings (this takes 30-60 seconds)...");
  const BATCH = 32;
  const allVectors: number[][] = [];
  for (let i = 0; i < chunks.length; i += BATCH) {
    const batch = chunks.slice(i, i + BATCH).map((c) => c.text);
    const vectors = await embed(batch);
    allVectors.push(...vectors);
    console.log(`[build] Embedded ${Math.min(i + BATCH, chunks.length)}/${chunks.length}`);
  }
  const output = {
    chunks: chunks.map((c, i) => ({ ...c, vector: allVectors[i] })),
    generatedAt: new Date().toISOString(),
    model: "BAAI/bge-small-en-v1.5",
    dimensions: 384,
  };
  const outPath = join(process.cwd(), "src", "lib", "embeddings-cache.json");
  writeFileSync(outPath, JSON.stringify(output));
  console.log(`[build] ✓ Saved embeddings to ${outPath}`);
}
buildEmbeddings().catch((err) => {
  console.error("[build] Failed:", err);
  process.exit(1);
});