# 🧠 Portfolio RAG Chatbot

A production-ready, free-tier RAG chatbot that answers questions about your work, projects, and engineering decisions — grounded entirely in your personal knowledge base.

[**→ Read the integration guide**](./INTEGRATION.md) for how to embed this in your existing portfolio.

## What's inside

```
src/
├── app/
│   ├── page.tsx                  ← mock portfolio demonstrating the widget
│   ├── globals.css               ← design system
│   └── api/
│       ├── chat/route.ts         ← streaming RAG endpoint (SSE)
│       └── knowledge/route.ts    ← live KB stats
├── components/
│   ├── ChatWidget.tsx            ← THE drop-in widget (floating button + modal)
│   ├── ChatApp.tsx               ← full-page variant (not used in widget mode)
│   └── ...
├── lib/                          ← the RAG pipeline
│   ├── knowledge.ts              ← markdown loader + semantic chunker
│   ├── embeddings.ts             ← local BGE-small via ONNX (free, no API)
│   ├── vector-store.ts           ← in-memory cosine similarity
│   ├── prompts.ts                ← system + retrieval prompts
│   └── llm.ts                    ← provider abstraction (Groq/OR/OAI)
└── knowledge/                    ← your personal knowledge base
    ├── about.md
    ├── skills.md
    ├── projects/*.md
    ├── internships.md
    ├── publications.md
    ├── certifications.md
    ├── leadership.md
    ├── hobbies.md
    ├── career.md
    └── faq.md
```

## Quick start

```bash
npm install
npm run dev                 # widget works at http://localhost:3000
```

Add an LLM key for real answers. **Default: NVIDIA OpenAI OSS 120B** (free at [build.nvidia.com](https://build.nvidia.com)):

```bash
# .env.local
NVIDIA_API_KEY=nvapi_xxx
```

Other supported providers (fallback): Groq, OpenRouter, OpenAI, any OpenAI-compatible endpoint.

## Embedding in your existing portfolio

Add one line at the end of your root layout or page:

```tsx
import { ChatWidget } from "@/components/ChatWidget";

export default function Layout({ children }) {
  return (
    <>
      {children}
      <ChatWidget ownerName="Your Name" />
    </>
  );
}
```

See [INTEGRATION.md](./INTEGRATION.md) for the full guide.

## Architecture highlights

- **Local embeddings** — BAAI/bge-small-en-v1.5 runs via ONNX. Zero cost, zero API calls.
- **In-memory vector store** — for a portfolio-sized corpus (<500 chunks), brute-force cosine similarity is faster than a managed vector DB.
- **Provider-agnostic LLM** — OpenAI-compatible API. Defaults to free tiers (Groq → OpenRouter → OpenAI).
- **Streaming SSE** — first token arrives in ~400ms.
- **Grounded refusal** — the bot never fabricates facts not present in your knowledge base.
- **Source citations** — every answer shows which documents it retrieved, with scores.

## Cost

| Component | Monthly cost (1000 conversations) |
|---|---|
| Netlify hosting | $0 |
| Embeddings (local BGE) | $0 |
| Vector DB (in-memory) | $0 |
| LLM (Groq free tier) | $0 |
| **Total** | **$0** |

## License

MIT — use it however you want.
