# Integrating the Chat Widget into Your Portfolio

This guide answers your three questions: **Will this work on my existing portfolio?** **How do I test it?** **What do I need to change?**

---

## ✅ Will this work on my existing Netlify portfolio?

**Yes — with a small caveat.**

The system has two pieces that need to live together:

| Piece | Where it lives | Notes |
|---|---|---|
| **Frontend widget** (`<ChatWidget />`) | Your portfolio page (one line import) | Pure React, works in any Next.js app |
| **Backend** (`/api/chat`, `/api/knowledge`, `src/lib/*`, `src/knowledge/`) | **Must be on the same Next.js app** | Uses Next.js Route Handlers |

### If your portfolio is a Next.js app on Netlify (the easy case)
→ Just copy the widget + backend into your repo. Done.

### If your portfolio is something else (Create React App, Astro, plain HTML, etc.)
You have two options:

**Option A (recommended): Deploy this as a separate Next.js app on Netlify, embed via iframe.**
- Deploy this project as `chat.yourdomain.com`
- Add `<iframe src="https://chat.yourdomain.com/widget" />` to your portfolio
- Takes 10 minutes

**Option B: Port the backend to Netlify Functions.**
- Copy `src/lib/*` and `src/knowledge/` into a `netlify/functions/chat.ts` file
- Point the widget's `apiBase` prop to that function URL
- Same logic, different host

This guide covers **Option A in detail** because it's the most common case and the least friction.

---

## 🧪 How to test it

### 1. Local dev (fastest)
```bash
npm install
npm run dev
```
Open `http://localhost:3000`. You'll see a mock portfolio with the chat widget in the bottom-right corner. Click it → ask a question → watch it stream.

**Without an LLM key:** the widget still works. Retrieval runs, sources are shown, and you'll see a demo-mode message explaining what would be sent to the LLM. This is enough to verify the entire pipeline except final text generation.

**With an LLM key (free, takes 60 seconds):**
```bash
# .env.local
NVIDIA_API_KEY=nvapi_xxx   # get one free at https://build.nvidia.com
```
Restart `npm run dev` — now you get full streaming answers from NVIDIA OpenAI OSS 120B (primary provider).

Also supported as fallbacks: `GROQ_API_KEY`, `OPENROUTER_API_KEY`, `OPENAI_API_KEY`, or any OpenAI-compatible endpoint via `OPENAI_BASE_URL` + `OPENAI_API_KEY`.

### 2. Production on Netlify
```bash
# Push to GitHub, import on Netlify, add env var:
NVIDIA_API_KEY=nvapi_xxx
```
Deploy. First chat request will download the embedding model (~130MB, cached after). Subsequent requests are instant.

### 3. Testing the widget on your real portfolio (iframe method)
1. Deploy this app to `chat.yourname.com`
2. Add this to your portfolio's HTML:
   ```html
   <button onclick="openChat()">💬</button>
   <div id="chat-modal" style="display:none; position:fixed; ...">
     <iframe src="https://chat.yourname.com/widget" style="width:100%;height:100%;border:0;" />
   </div>
   ```
3. Or, if your portfolio is React: just install this as a dependency and import `<ChatWidget apiBase="https://chat.yourname.com" />`.

---

## 🔧 What to change and where

### Files you MUST edit (personalize)

| File | What to change |
|---|---|
| `src/knowledge/about.md` | Your name, background, what you're looking for |
| `src/knowledge/skills.md` | Your tech stack, strengths, tool choices |
| `src/knowledge/projects/*.md` | Your projects, with **reasoning** (why you chose X, tradeoffs) |
| `src/knowledge/internships.md` | Your work experience, lessons learned |
| `src/knowledge/publications.md` | Papers, blog posts, talks |
| `src/knowledge/career.md` | What jobs you want, why hire you |
| `src/knowledge/hobbies.md` | Your non-tech interests (humanizes the bot) |
| `src/knowledge/faq.md` | FAQ answers in your voice |
| `src/components/ChatWidget.tsx` line ~47 | `ownerName="Your Name"` |

### Files you MAY want to edit

| File | What for |
|---|---|
| `src/lib/prompts.ts` | Tune personality, add guardrails for specific topics |
| `src/lib/llm.ts` | Swap default provider (Groq → OpenRouter → OpenAI) |
| `src/lib/embeddings.ts` | Swap embedding model (BGE-small → BGE-base → Nomic) |
| `src/lib/knowledge.ts` | Adjust chunk size if your docs are very long/short |
| `src/app/page.tsx` | Replace the mock portfolio with your real one, keeping only the `<ChatWidget />` import |
| `.env` | Add your `GROQ_API_KEY` (or `OPENROUTER_API_KEY`, or `OPENAI_API_KEY`) |

### Files you should NOT touch

- `src/lib/vector-store.ts` — works as-is for portfolio-sized corpus
- `src/app/api/chat/route.ts` — streaming + rate limiting + retrieval orchestration
- `next.config.ts` — required for the ONNX embedding model to work

---

## 🚀 Deploying to Netlify step by step

1. **Push to GitHub**
2. **On Netlify:** "Add new site" → "Import an existing project" → select the repo
3. **Build settings** auto-detected: `npm run build`, output `.next`
4. **Add environment variables** (Site settings → Environment variables):
   ```
   GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
5. **Deploy** — first deploy takes ~3 min, chat is live immediately
6. **Custom domain:** optional, set in Domain settings

Netlify's free tier gives you 100GB bandwidth/month and 125K function invocations — far more than any portfolio needs.

---

## 🎨 Customizing the widget's look

`<ChatWidget />` accepts these props:

```tsx
<ChatWidget
  ownerName="Arjun"          // shows in the header and welcome screen
  apiBase="https://chat..."  // if backend is on another domain
  accentColor="#7c5cff"      // (future) override button color
/>
```

The floating button position is `bottom-6 right-6` — change it in `ChatWidget.tsx` line ~75 if you want it elsewhere (e.g. `bottom-6 left-6`).

The modal uses CSS variables from `globals.css`. If your portfolio already has a `globals.css`, you can either:
- Copy the `@theme` block into yours, or
- Replace the `var(--color-*)` references in `ChatWidget.tsx` with your own tokens

---

## ❓ FAQ

**Q: Does the widget need my portfolio to be dark-themed?**
No. The widget is self-contained with its own color scheme. It looks best on dark backgrounds but works anywhere.

**Q: Will the widget slow down my portfolio?**
No. The widget code is lazy-loaded with React. The ~130MB embedding model only downloads on the first chat request, not on page load.

**Q: Can multiple visitors chat at once?**
Yes. The vector store is shared (read-only, rebuilt per cold start), but each chat is independent. The rate limiter allows 10 requests per IP per minute.

**Q: What happens if my LLM provider is down?**
The widget shows a friendly error. You can add fallback providers in `src/lib/llm.ts` — the `detectProvider()` function already has a priority chain.
