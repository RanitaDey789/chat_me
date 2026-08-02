"use client";

/**
 * /embed — a minimal page that renders the chat full-screen.
 *
 * Point an iframe at https://your-chat-domain.com/embed to drop the
 * chatbot into any site (including non-Next.js sites like a Vite portfolio).
 *
 * The close button is hidden here because there's no parent modal to close.
 */

import { ChatWindow } from "@/components/ChatWidget";

export default function EmbedPage() {
  return (
    <main className="h-screen w-screen bg-[var(--color-bg)]">
      <ChatWindow ownerName="Ranita Dey" apiBase="" />
    </main>
  );
}
