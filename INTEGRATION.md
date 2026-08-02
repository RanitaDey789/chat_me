# Detailed Integration Guide: Adding the RAG Chatbot to https://ranitadey.vercel.app/

This guide walks you through integrating your newly deployed Render RAG Chatbot backend directly into your live Vercel portfolio (`https://ranitadey.vercel.app/`).

---

## 🎯 Architecture Overview

```
┌──────────────────────────────────────┐       ┌──────────────────────────────────────┐
│  Live Portfolio                      │       │  Render Backend Service              │
│  https://ranitadey.vercel.app        │ ───► │  https://portfolio-rag-chatbot.     │
│                                      │       │          onrender.com                │
│  - Hosts UI & portfolio content      │       │  - Hosts /embed route & /api/chat    │
│  - Embeds Chatbot via Iframe/Widget  │       │  - BGE ONNX Embeddings + Vector Store│
└──────────────────────────────────────┘       └──────────────────────────────────────┘
```

---

## 🛠 Step 1: Deploy Chatbot Backend to Render

1. Push your repository `RanitaDey789/chat_me` to GitHub.
2. Go to [Render Dashboard](https://dashboard.render.com) and click **New +** → **Blueprint**.
3. Select `RanitaDey789/chat_me`. Render reads `render.yaml`.
4. Enter your free API key for `NVIDIA_API_KEY` (from [build.nvidia.com](https://build.nvidia.com)) or `GROQ_API_KEY`.
5. Deploy. Render will output a URL such as:
   `https://portfolio-rag-chatbot.onrender.com`

---

## 💻 Step 2: Embed on Your Vercel Portfolio

Choose the method that matches how your portfolio at `https://ranitadey.vercel.app/` was built:

### Method A: HTML / Universal Iframe Widget (Easiest — Works for HTML, React, Vue, Svelte, Next.js)

Copy and paste this snippet into your portfolio repository right before the closing `</body>` tag (or in your main `layout.tsx` / `index.html`):

```html
<!-- Floating Chatbot Widget for ranitadey.vercel.app -->
<div id="ranita-chat-root">
  <style>
    #ranita-chat-btn {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99999;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: linear-gradient(135deg, #7c5cff 0%, #4ecdc4 100%);
      color: #ffffff;
      border: none;
      cursor: pointer;
      box-shadow: 0 10px 30px rgba(124, 92, 255, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 26px;
      transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    #ranita-chat-btn:hover {
      transform: scale(1.1);
    }
    #ranita-chat-btn:active {
      transform: scale(0.95);
    }
    #ranita-chat-container {
      display: none;
      position: fixed;
      bottom: 96px;
      right: 24px;
      z-index: 99999;
      width: min(420px, calc(100vw - 32px));
      height: min(650px, 72vh);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
      border: 1px solid #26263a;
      background: #0a0a0f;
      transition: all 0.3s ease;
    }
    #ranita-chat-container.open {
      display: block;
      animation: ranitaChatFadeIn 0.25s ease-out;
    }
    @keyframes ranitaChatFadeIn {
      from { opacity: 0; transform: translateY(16px) scale(0.96); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  </style>

  <button id="ranita-chat-btn" onclick="toggleRanitaChat()" aria-label="Ask Ranita's AI Assistant">
    💬
  </button>

  <div id="ranita-chat-container">
    <iframe
      src="https://portfolio-rag-chatbot.onrender.com/embed"
      style="width: 100%; height: 100%; border: none;"
      title="Ranita Dey AI Assistant"
      loading="lazy"
    ></iframe>
  </div>

  <script>
    function toggleRanitaChat() {
      const container = document.getElementById('ranita-chat-container');
      const btn = document.getElementById('ranita-chat-btn');
      if (container.classList.contains('open')) {
        container.classList.remove('open');
        btn.innerHTML = '💬';
      } else {
        container.classList.add('open');
        btn.innerHTML = '✕';
      }
    }
  </script>
</div>
```

---

### Method B: Native React Component Import (If portfolio is React / Next.js)

1. Copy `src/components/ChatWidget.tsx` into your portfolio codebase.
2. Render `<ChatWidget />` in your layout:

```tsx
import { ChatWidget } from "@/components/ChatWidget";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <ChatWidget
        ownerName="Ranita Dey"
        apiBase="https://portfolio-rag-chatbot.onrender.com"
      />
    </div>
  );
}
```

---

## 🔍 Verification & Testing Checklist

- [x] **CORS preflights**: `/api/chat` returns `Access-Control-Allow-Origin: *` headers for cross-origin SSE streams.
- [x] **Iframe permissions**: `/embed` sets `Content-Security-Policy: frame-ancestors *;` allowing embedding inside `https://ranitadey.vercel.app/`.
- [x] **Pre-built vector embeddings**: `npm run build` generates `src/lib/embeddings-cache.json` during deployment so vector search is instantly available.
- [x] **Fallback LLM support**: Priority chain `NVIDIA_API_KEY` → `GROQ_API_KEY` → `OPENROUTER_API_KEY` → `OPENAI_API_KEY`.
