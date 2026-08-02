# 🧠 Portfolio RAG Chatbot

A production-ready, retrieval-augmented generation (RAG) chatbot that answers questions about your work, projects, background, and engineering decisions — grounded entirely in your personal knowledge base (`src/knowledge/`).

Designed for seamless deployment on **Render** and embedding into your live portfolio at [https://ranitadey.vercel.app/](https://ranitadey.vercel.app/).

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run local dev server
npm run dev
```

Open `http://localhost:3000` to preview the chatbot widget embedded on a sample portfolio page or test the `/embed` route directly at `http://localhost:3000/embed`.

### Adding an LLM Key (Free API)
By default, the chatbot runs in retrieval-demo mode without a key. To get real AI streaming answers, add an API key to `.env.local`:

```env
# Free key at https://build.nvidia.com
NVIDIA_API_KEY=nvapi_xxx
```

*Supported provider keys (in fallback order):* `NVIDIA_API_KEY` → `GROQ_API_KEY` → `OPENROUTER_API_KEY` → `OPENAI_API_KEY`.

---

## 🌐 Deploying to Render (Step-by-Step)

You can deploy this Next.js app to Render as a **Web Service** in less than 5 minutes.

### Method 1: Using Render Blueprint (`render.yaml` - Recommended)

1. Push this repository to GitHub.
2. Go to your [Render Dashboard](https://dashboard.render.com/) and click **New +** → **Blueprint**.
3. Select your repository `RanitaDey789/chat_me`. Render will automatically detect `render.yaml`.
4. In the environment variables section, set your LLM API Key:
   - `NVIDIA_API_KEY` (or `GROQ_API_KEY` / `OPENAI_API_KEY`)
5. Click **Apply**. Render will build and deploy your app.

### Method 2: Manual Render Web Service Setup

1. On [Render Dashboard](https://dashboard.render.com/), click **New +** → **Web Service**.
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Name**: `portfolio-rag-chatbot` (or your choice)
   - **Language**: `Node`
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Instance Type**: `Free`
4. Add **Environment Variables**:
   - `NODE_VERSION`: `20.11.0`
   - `NVIDIA_API_KEY`: your API key (from build.nvidia.com or Groq)
5. Click **Create Web Service**.

Once deployed, Render will provide a live URL, e.g.:
`https://portfolio-rag-chatbot.onrender.com`

---

## 📌 Embedding the Chatbot into your Vercel Portfolio (`ranitadey.vercel.app`)

Since your portfolio is already live on Vercel at `https://ranitadey.vercel.app/`, you have two quick ways to add the chatbot:

### Option A: Clean Floating Iframe / Modal Widget (Works for ANY site — HTML, React, Vue, Next.js)

Add this lightweight floating button & iframe modal script to your portfolio page (or layout) on Vercel:

```html
<!-- Add before closing </body> tag on ranitadey.vercel.app -->
<style>
  #chat-widget-button {
    position: fixed; bottom: 24px; right: 24px; z-index: 9999;
    width: 56px; height: 56px; border-radius: 50%;
    background: linear-gradient(135deg, #7c5cff, #4ecdc4);
    color: white; border: none; cursor: pointer;
    box-shadow: 0 10px 25px rgba(124, 92, 255, 0.4);
    font-size: 24px; display: flex; align-items: center; justify-content: center;
    transition: transform 0.2s ease;
  }
  #chat-widget-button:hover { transform: scale(1.08); }
  #chat-widget-modal {
    display: none; position: fixed; bottom: 90px; right: 24px; z-index: 9999;
    width: min(420px, calc(100vw - 32px)); height: min(650px, 70vh);
    border-radius: 16px; overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.5); border: 1px solid #26263a;
  }
</style>

<button id="chat-widget-button" onclick="toggleChatWidget()" aria-label="Open Chat Assistant">💬</button>
<div id="chat-widget-modal">
  <iframe
    src="https://portfolio-rag-chatbot.onrender.com/embed"
    style="width: 100%; height: 100%; border: none;"
    title="AI Portfolio Assistant"
  ></iframe>
</div>

<script>
  function toggleChatWidget() {
    const modal = document.getElementById('chat-widget-modal');
    modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
  }
</script>
```

### Option B: If your Vercel Portfolio is a React / Next.js app

If your portfolio repository is built with React or Next.js, you can import `<ChatWidget />` directly and pass your Render API URL as `apiBase`:

```tsx
import { ChatWidget } from "./components/ChatWidget";

export default function PortfolioPage() {
  return (
    <>
      {/* Your existing portfolio content */}
      <ChatWidget
        ownerName="Ranita Dey"
        apiBase="https://portfolio-rag-chatbot.onrender.com"
      />
    </>
  );
}
```

---

## 📂 Customizing Your Knowledge Base

The chatbot grounds all answers in markdown files under `src/knowledge/`. Edit these files to personalize the chatbot with your authentic information:

- `src/knowledge/about.md` — Bio, summary, background
- `src/knowledge/skills.md` — Tech stack, frameworks, tools
- `src/knowledge/projects/` — Detailed notes on your projects
- `src/knowledge/internships.md` — Work history & contributions
- `src/knowledge/education.md` & `certifications.md` — Degree, courses, certificates
- `src/knowledge/faq.md` — Frequently asked questions

When you push updates to `src/knowledge/`, Render will automatically rebuild the embeddings during `npm run build`.

---

## 🛠️ Project Structure

```
├── render.yaml                   ← Render Blueprint configuration
├── .node-version                 ← Pin Node version to 20.11.0 for Render
├── scripts/
│   └── build-embeddings.ts       ← Generates vector embeddings at build time
├── src/
│   ├── app/
│   │   ├── embed/page.tsx        ← Full-screen iframe endpoint (/embed)
│   │   └── api/
│   │       ├── chat/route.ts     ← Streaming RAG endpoint with CORS support
│   │       ├── health/route.ts   ← Warmup & health check endpoint
│   │       └── knowledge/route.ts← Knowledge base index stats
│   ├── components/
│   │   └── ChatWidget.tsx        ← Drop-in floating widget & ChatWindow
│   ├── lib/
│   │   ├── embeddings.ts         ← Local BGE ONNX embeddings (no external costs)
│   │   ├── vector-store.ts       ← Fast in-memory cosine similarity search
│   │   ├── llm.ts                ← Provider-agnostic streaming LLM client
│   │   └── knowledge.ts          ← Markdown parser & semantic chunker
│   └── knowledge/                ← Knowledge base markdown files
```

---

## 📜 License

MIT — feel free to use and adapt for your portfolio!
