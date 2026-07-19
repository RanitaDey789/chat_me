# Project: Personal RAG Chatbot

## What It Is
A production-grade retrieval-augmented chatbot that acts as an AI version of me on my portfolio. Visitors ask questions about my work, projects, and philosophy, and the bot answers using only my curated knowledge base.

## Why I Built It
Resumes are static. Recruiters often have specific questions — "Why did you choose X over Y?" — that a CV can't answer. I wanted an interface that could convey the reasoning behind my decisions, not just the outcomes.

## Architecture Decisions
- **Serverless on Netlify Functions** — zero maintenance cost, scales to zero.
- **Local embedding model (BGE-small-en)** via transformers.js — no external embedding API, no latency, no cost, runs at build time.
- **JSON-based vector store** instead of a vector DB — for ~200 chunks, brute-force cosine similarity is faster than a managed service call and eliminates infrastructure.
- **OpenAI-compatible LLM endpoint** — lets me swap providers (Groq free tier, OpenRouter free models, HuggingFace Inference Providers) without code changes.
- **Streaming responses** — recruiters don't wait; the first token arrives in under 400ms.

## Trade-offs Considered
- **Vector DB vs JSON**: I chose JSON because my corpus is tiny. A vector DB would add latency for network hops that exceed the compute savings. If the corpus grows past ~10k chunks, I'd migrate to pgvector.
- **Free LLM vs paid**: Free tiers have rate limits and can be flaky. I built a provider abstraction with fallback ordering — if Groq fails, OpenRouter's free Qwen is tried next.
- **Chunk size 512 tokens**: Smaller chunks gave worse retrieval on "why" questions (context fragmented). Larger chunks reduced precision. 512 with 64-token overlap hit the sweet spot.

## Challenges
The hardest part was making "why" questions work. Early versions retrieved the right facts but the LLM had no reasoning context. I solved this by enriching each chunk with a "meta-chunk" — a one-sentence summary prepended at index time that captures the intent of the passage (e.g., "Why I chose pgvector over Pinecone"). This boosted retrieval recall on reasoning questions from ~55% to ~88%.

## Lessons Learned
- Retrieval quality matters 10x more than LLM quality. A great LLM with bad retrieval gives confidently wrong answers.
- Evaluate RAG as a system, not as separate components. Use end-to-end metrics like answer faithfulness and retrieval recall@k.
- Always log retrieval results. When the chatbot fails, 90% of the time the failure mode is "the right chunk wasn't in the top-k."

## Future Improvements
- Hybrid search (BM25 + dense) for better recall on exact project names
- Conversational memory compression to support longer sessions
- Citation UI so users can click to see the source chunk
