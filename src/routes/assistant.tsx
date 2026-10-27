import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, RotateCcw, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { seo } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { priceLabel } from "@/components/site/ListingCard";
import { publicCatalogueQuery } from "@/lib/api/queries";
import { localized } from "@/lib/api/mappers";
import type { ListingView } from "@/lib/api/types";
import { rankForAssistant } from "@/lib/marketplace/search";

/**
 * SokoTZ Assistant (docs/SOKOTZ_ASSISTANT.md). Platform help + listing text drafting.
 * For each question the browser retrieves matching PUBLISHED listings from Firestore
 * (same visibility rule as /search) and sends only those to the model as data.
 */
export const Route = createFileRoute("/assistant")({
  head: () =>
    seo(
      "SokoTZ Assistant",
      "Ask SokoTZ Assistant for help using the marketplace or drafting listing text, in Kiswahili or English.",
    ),
  component: Assistant,
});

type Lang = "en" | "sw";
type Msg = { role: "user" | "assistant"; content: string; refs?: ListingView[] };

const T = {
  en: {
    intro:
      "Hi! I'm SokoTZ Assistant, an AI. I can explain how to use SokoTZ and help business owners write product descriptions. I can look up published SokoTZ listings, and I never make up businesses, prices or reviews. Please don't share passwords or payment details.",
    placeholder: "Ask a question…",
    send: "Send",
    newChat: "New chat",
    error: "The assistant couldn't reply. Please try again.",
    retry: "Retry",
    suggestions: [
      "How do I create a business profile?",
      "Write a description for my fresh mango juice",
      "How do I reset my password?",
    ],
  },
  sw: {
    intro:
      "Habari! Mimi ni Msaidizi wa SokoTZ, mfumo wa AI. Naweza kukueleza jinsi ya kutumia SokoTZ na kuwasaidia wafanyabiashara kuandika maelezo ya bidhaa. Naweza kutafuta matangazo yaliyochapishwa SokoTZ, na sitabuni biashara, bei wala maoni. Tafadhali usishiriki nenosiri au taarifa za malipo.",
    placeholder: "Uliza swali…",
    send: "Tuma",
    newChat: "Mazungumzo mapya",
    error: "Msaidizi ameshindwa kujibu. Tafadhali jaribu tena.",
    retry: "Jaribu tena",
    suggestions: [
      "Nawezaje kufungua wasifu wa biashara?",
      "Niandikie maelezo ya juisi yangu ya embe",
      "Nawezaje kubadilisha nenosiri?",
    ],
  },
} as const;

function Assistant() {
  const [lang, setLang] = useState<Lang>("sw");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const conversationRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const t = T[lang];

  useEffect(() => {
    const saved = localStorage.getItem("sokotz-lang");
    if (saved === "en" || saved === "sw") setLang(saved);
  }, []);
  useEffect(() => {
    const conversation = conversationRef.current;
    if (conversation) conversation.scrollTop = conversation.scrollHeight;
  }, [messages]);

  function changeLang(l: Lang) {
    setLang(l);
    localStorage.setItem("sokotz-lang", l);
  }

  async function send(history: Msg[]) {
    setBusy(true);
    setError(false);
    setMessages([...history, { role: "assistant", content: "" }]);
    try {
      const last = [...history].reverse().find((m) => m.role === "user")?.content ?? "";
      let refs: ListingView[] = [];
      try {
        refs = rankForAssistant(await queryClient.fetchQuery(publicCatalogueQuery), last, 6);
      } catch {
        refs = []; // marketplace unavailable: the assistant is told nothing was retrieved
      }
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lang,
          messages: history.slice(-20).map(({ role, content }) => ({ role, content })),
          listings: refs.map((l) => ({
            id: l.id,
            title: localized(l.titleSw, l.titleEn, lang).slice(0, 200),
            type: l.type,
            priceTzs: l.priceTzs,
            city: l.city.slice(0, 100),
            businessName: l.businessName.slice(0, 150),
            categorySlug: l.categorySlug.slice(0, 100),
          })),
        }),
      });
      if (!res.ok || !res.body) throw new Error(String(res.status));
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let text = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        text += dec.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: text }]);
      }
      setMessages([...history, { role: "assistant", content: text, refs }]);
      if (!text.trim()) throw new Error("empty");
    } catch {
      setMessages(history);
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  function submit(text: string) {
    const v = text.trim();
    if (!v || busy) return;
    setInput("");
    send([...messages, { role: "user", content: v }]);
  }

  return (
    <div className="mx-auto max-w-3xl sm:px-4 sm:py-8" lang={lang}>
      <div className="flex h-[calc(100dvh-4rem)] min-h-80 flex-col overflow-hidden bg-surface sm:h-[min(740px,calc(100dvh-8rem))] sm:rounded-2xl sm:border sm:shadow-card">
        <div className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b px-4 py-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
              <Sparkles className="size-4 text-primary-foreground" aria-hidden />
            </span>
            <div className="min-w-0">
              <h1 className="text-sm font-semibold sm:text-base">
                {lang === "sw" ? "Msaidizi wa SokoTZ" : "SokoTZ Assistant"}
              </h1>
              <p className="text-xs text-muted-foreground">AI</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={busy}
            onClick={() => {
              setMessages([]);
              setError(false);
            }}
            aria-label={t.newChat}
            title={t.newChat}
            className="size-11 shrink-0 text-muted-foreground"
          >
            <RotateCcw className="size-4" aria-hidden />
          </Button>
          <div
            role="group"
            aria-label="Language"
            className="col-span-2 flex gap-1 justify-self-start rounded-lg border p-0.5 text-xs sm:justify-self-end"
          >
            {(["sw", "en"] as const).map((l) => (
              <Button
                key={l}
                type="button"
                variant={lang === l ? "default" : "ghost"}
                disabled={busy}
                onClick={() => changeLang(l)}
                aria-pressed={lang === l}
                className="h-11 px-4 text-xs"
              >
                {l === "sw" ? "Kiswahili" : "English"}
              </Button>
            ))}
          </div>
        </div>
        <div
          ref={conversationRef}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 sm:p-5"
          aria-live="polite"
        >
          <div className="max-w-[95%] rounded-2xl rounded-tl-sm bg-accent p-4 text-sm leading-relaxed sm:max-w-[85%]">
            {t.intro}
          </div>
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2">
              {t.suggestions.map((s) => (
                <Button
                  key={s}
                  type="button"
                  variant="outline"
                  disabled={busy}
                  onClick={() => submit(s)}
                  className="h-auto min-h-11 max-w-full justify-start whitespace-normal px-3 py-2 text-left text-xs text-muted-foreground"
                >
                  {s}
                </Button>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[95%] whitespace-pre-wrap rounded-2xl p-4 text-sm leading-relaxed [overflow-wrap:anywhere] sm:max-w-[85%] ${m.role === "user" ? "ml-auto rounded-tr-sm bg-primary text-primary-foreground" : "rounded-tl-sm bg-accent"}`}
            >
              {m.content || <Loader2 className="size-4 animate-spin" aria-label="…" />}
              {m.refs && m.refs.length > 0 && (
                <ul className="mt-3 space-y-2 whitespace-normal">
                  {m.refs.map((l) => (
                    <li key={l.id}>
                      <Link
                        to="/listing/$id"
                        params={{ id: l.id }}
                        className="block rounded-lg border bg-surface px-3 py-2 hover:border-neon"
                      >
                        <span className="block font-semibold">
                          {localized(l.titleSw, l.titleEn, lang)}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {priceLabel(l.priceTzs)} · {l.businessName}
                          {l.city ? ` · ${l.city}` : ""}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          {error && (
            <div className="flex flex-wrap items-center gap-3 text-sm text-destructive">
              {t.error}
              <Button
                type="button"
                variant="link"
                className="h-11 text-destructive"
                onClick={() => send(messages)}
              >
                {t.retry}
              </Button>
            </div>
          )}
        </div>
        <form
          className="grid shrink-0 grid-cols-[minmax(0,1fr)_auto] gap-2 border-t p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          onSubmit={(e) => {
            e.preventDefault();
            submit(input);
          }}
        >
          <label htmlFor="assistant-input" className="sr-only">
            {t.placeholder}
          </label>
          <input
            id="assistant-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={4000}
            placeholder={t.placeholder}
            className="h-11 min-w-0 w-full rounded-lg border border-input bg-background px-3 text-base"
          />
          <Button
            type="submit"
            variant="hero"
            size="icon"
            disabled={busy || !input.trim()}
            aria-label={t.send}
            className="size-11 shrink-0 rounded-lg"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Send className="size-4" aria-hidden />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
