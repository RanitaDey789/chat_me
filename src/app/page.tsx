"use client";

/**
 * This page simulates what your existing portfolio looks like with the
 * chatbot widget embedded. Replace this content with your real portfolio —
 * the only thing you need to keep is the <ChatWidget /> component at the end.
 */

import { Code2, Link2, Mail, FileText } from "lucide-react";
import { ChatWidget } from "@/components/ChatWidget";

export default function PortfolioPage() {
  return (
    <div className="min-h-screen">
      {/* ─── Your real portfolio goes here ─────────────────────────────── */}
      <header className="border-b border-[var(--color-border)]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="font-semibold text-white">Your Name</div>
          <nav className="flex items-center gap-4 text-sm text-[var(--color-text-dim)]">
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#projects" className="hover:text-white transition-colors">Projects</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      <section id="about" className="max-w-5xl mx-auto px-6 py-20">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs uppercase tracking-widest text-[var(--color-accent-2)]">AI Engineer</span>
          <span className="h-px flex-1 bg-[var(--color-border)]" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
          Building <span className="gradient-text">production-grade</span> AI systems.
        </h1>
        <p className="text-lg text-[var(--color-text-dim)] max-w-2xl leading-relaxed mb-8">
          I&apos;m a senior engineer focused on LLM infrastructure, RAG systems, and applied ML.
          I ship things that work in production, not just in notebooks.
        </p>
        <div className="flex items-center gap-3 mb-12">
          <a href="#" className="px-4 py-2 rounded-lg bg-[var(--color-accent)] hover:bg-[#8b6fff] text-white text-sm font-medium transition-colors flex items-center gap-2">
            <FileText className="h-4 w-4" /> Resume
          </a>
          <a href="#" className="h-10 w-10 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)] text-[var(--color-text-dim)] hover:text-white flex items-center justify-center transition-colors">
            <Code2 className="h-4 w-4" />
          </a>
          <a href="#" className="h-10 w-10 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)] text-[var(--color-text-dim)] hover:text-white flex items-center justify-center transition-colors">
            <Link2 className="h-4 w-4" />
          </a>
          <a href="#" className="h-10 w-10 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-border-strong)] text-[var(--color-text-dim)] hover:text-white flex items-center justify-center transition-colors">
            <Mail className="h-4 w-4" />
          </a>
        </div>

        {/* Demo callout — delete this in your real portfolio */}
        <div className="rounded-xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-panel)] p-5 max-w-2xl">
          <div className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[var(--color-accent-2)] animate-pulse" />
            Try the AI assistant
          </div>
          <p className="text-sm text-[var(--color-text-dim)] leading-relaxed">
            Click the chat icon in the bottom-right corner to ask questions about my work,
            projects, and engineering decisions. It&apos;s powered by a RAG pipeline over
            my portfolio knowledge base — grounded in authentic work.
          </p>
        </div>
      </section>

      <section id="projects" className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-semibold text-white mb-6">Selected Projects</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { title: "Personal RAG Chatbot", desc: "This assistant — built with NVIDIA NIM embeddings, in-memory vector search, and a provider-agnostic streaming LLM layer." },
            { title: "Real-Time Defect Detection", desc: "YOLOv8 on edge devices. 94.2% mAP at 38ms/frame on a Jetson Nano." },
            { title: "Two-Tower Recommender", desc: "Serving personalized results to 200K DAU at p95 < 80ms." },
            { title: "Research on Efficient Fine-Tuning", desc: "Second-author paper at ACL workshop on low-rank prompt tuning." },
          ].map((p) => (
            <div key={p.title} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] p-5 hover:border-[var(--color-border-strong)] transition-colors">
              <div className="font-semibold text-white mb-1.5">{p.title}</div>
              <div className="text-sm text-[var(--color-text-dim)] leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[var(--color-border)] mt-20">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center text-sm text-[var(--color-text-mute)]">
          © {new Date().getFullYear()} — built with Next.js. Ask the AI assistant anything →
        </div>
      </footer>
      {/* ─── End of your portfolio ───────────────────────────────────────── */}

      {/*
        👇 THIS IS THE ONLY LINE YOU NEED TO ADD TO YOUR PORTFOLIO.
        Drop it at the very end of your root layout (or on every page
        where you want the chat to be available).
      */}
      <ChatWidget ownerName="Ranita Dey" />
    </div>
  );
}
