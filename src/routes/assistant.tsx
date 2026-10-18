import { createFileRoute } from "@tanstack/react-router";
import { Send, Sparkles } from "lucide-react";
import { PlannedBadge } from "@/components/site/states";
import { seo } from "@/lib/seo";

/**
 * SokoTZ Assistant entry point (docs/SOKOTZ_ASSISTANT.md).
 * No AI provider is connected (DEC-008 pending). Input stays disabled until a
 * backend assistant endpoint exists; it must only return real marketplace data.
 */
export const Route = createFileRoute("/assistant")({
  head: () => seo("SokoTZ Assistant", "An upcoming assistant to help you find businesses and listings on SokoTZ."),
  component: Assistant,
});

function Assistant() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="overflow-hidden rounded-3xl border bg-surface shadow-card">
        <div className="flex items-center gap-3 border-b px-5 py-4">
          <span className="flex size-9 items-center justify-center rounded-full bg-gradient-primary shadow-glow"><Sparkles className="size-4 text-primary-foreground" aria-hidden /></span>
          <div>
            <h1 className="text-base font-semibold">SokoTZ Assistant</h1>
            <p className="text-xs text-muted-foreground">English · Kiswahili</p>
          </div>
          <div className="ml-auto"><PlannedBadge>Coming soon</PlannedBadge></div>
        </div>
        <div className="min-h-72 space-y-4 p-5">
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-accent p-4 text-sm">
            The assistant is not available yet. When it launches, it will help you find real businesses and listings on SokoTZ and answer questions about using the platform. It will never make up businesses, prices or reviews.
          </div>
        </div>
        <form className="flex gap-2 border-t p-3" onSubmit={(e) => e.preventDefault()} aria-label="Assistant message (disabled)">
          <label htmlFor="assistant-input" className="sr-only">Message</label>
          <input id="assistant-input" disabled placeholder="Assistant is not available yet" className="h-11 flex-1 rounded-lg border border-input bg-background px-3 text-sm disabled:opacity-60" />
          <button type="submit" disabled aria-label="Send" className="flex size-11 items-center justify-center rounded-lg bg-muted text-muted-foreground disabled:cursor-not-allowed"><Send className="size-4" aria-hidden /></button>
        </form>
      </div>
    </div>
  );
}
