/**
 * Knowledge loader & chunker.
 *
 * Reads all markdown files under src/knowledge/**, splits them into
 * overlapping chunks, and attaches metadata (source file, heading path).
 *
 * Design notes:
 *  - Chunk size 512 tokens (~2000 chars) with 64-token overlap.
 *    Tuned empirically: smaller chunks fragment "why" questions;
 *    larger chunks reduce retrieval precision.
 *  - Each chunk gets a "heading path" (e.g. "Projects > RAG Chatbot > Challenges")
 *    so the LLM has structural context even when a chunk is mid-section.
 *  - Chunks that cross heading boundaries are split at the heading to
 *    keep semantic coherence.
 */

import { readdir, readFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";

export interface KnowledgeChunk {
  id: string;
  text: string;
  source: string; // relative path under knowledge/
  headingPath: string[]; // breadcrumb of headings
  category: string; // top-level folder
}

const KNOWLEDGE_DIR = join(process.cwd(), "src", "knowledge");
const CHUNK_SIZE_CHARS = 1800; // ~450 tokens
const CHUNK_OVERLAP_CHARS = 180; // ~45 tokens

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (entry.name.endsWith(".md")) {
      files.push(full);
    }
  }
  return files;
}

function extractHeading(line: string): string | null {
  const m = line.match(/^(#{1,6})\s+(.+)$/);
  return m ? m[2].trim() : null;
}

function deriveCategory(relPath: string): string {
  const parts = relPath.split(sep);
  return parts.length > 1 ? parts[0] : "general";
}

function chunkText(text: string, size: number, overlap: number): string[] {
  const chunks: string[] = [];
  let start = 0;
  while (start < text.length) {
    let end = Math.min(start + size, text.length);
    // try to end on a sentence or paragraph boundary
    if (end < text.length) {
      const slice = text.slice(start, end);
      const lastPara = slice.lastIndexOf("\n\n");
      const lastSentence = slice.search(/[.!?]\s(?=[^.!?]*$)/);
      if (lastPara > size * 0.5) end = start + lastPara + 2;
      else if (lastSentence > size * 0.5) end = start + lastSentence + 1;
    }
    chunks.push(text.slice(start, end).trim());
    if (end >= text.length) break;
    start = end - overlap;
  }
  return chunks.filter((c) => c.length > 50);
}

export async function loadKnowledgeBase(): Promise<KnowledgeChunk[]> {
  const files = await walk(KNOWLEDGE_DIR);
  const chunks: KnowledgeChunk[] = [];
  let idCounter = 0;

  for (const file of files) {
    const raw = await readFile(file, "utf-8");
    const relPath = relative(KNOWLEDGE_DIR, file);
    const category = deriveCategory(relPath);
    const lines = raw.split("\n");

    // Split into sections by heading
    const sections: { headingPath: string[]; body: string }[] = [];
    let currentHeadings: string[] = [];
    let currentBody: string[] = [];

    for (const line of lines) {
      const h = extractHeading(line);
      if (h) {
        if (currentBody.length) {
          sections.push({ headingPath: [...currentHeadings], body: currentBody.join("\n") });
          currentBody = [];
        }
        const level = (line.match(/^#+/) || [""])[0].length;
        currentHeadings = currentHeadings.slice(0, level - 1);
        currentHeadings[level - 1] = h;
        currentBody.push(line);
      } else {
        currentBody.push(line);
      }
    }
    if (currentBody.length) {
      sections.push({ headingPath: [...currentHeadings], body: currentBody.join("\n") });
    }

    for (const section of sections) {
      const bodyChunks = chunkText(section.body, CHUNK_SIZE_CHARS, CHUNK_OVERLAP_CHARS);
      for (const text of bodyChunks) {
        chunks.push({
          id: `${relPath}:${idCounter++}`,
          text,
          source: relPath,
          headingPath: section.headingPath.filter(Boolean),
          category,
        });
      }
    }
  }

  return chunks;
}
