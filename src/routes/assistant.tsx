import { createFileRoute } from "@tanstack/react-router";
import { Loader2, RotateCcw, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { seo } from "@/lib/seo";

/**
 * SokoTZ Assistant (docs/SOKOTZ_ASSISTANT.md). Platform help + listing text drafting.
 * Marketplace search is not connected yet, so the assistant never returns listings.
 */
export const Route = createFileRoute("/assistant")({
  head: () => seo("SokoTZ Assistant", "Ask SokoTZ Assistant for help using the marketplace or drafting listing text, in Kiswahili or English."),
  component: Assistant,
});

type Lang = "en" | "sw";
type Msg = { role: "user" | "assistant"; content: string };

const T = {
  en: {
    intro: "Hi! I'm SokoTZ Assistant, an AI. I can explain how to use SokoTZ and help business owners write product descriptions. I can't search listings yet, and I never make up businesses, prices or reviews. Please don't share passwords or payment details.",
    placeholder: "Ask a question…",
    send: "Send", newChat: "New chat", error: "The assistant couldn't reply. Please try again.", retry: "Retry",
    suggestions: ["How do I create a business profile?", "Write a description for my fresh mango juice", "How do I reset my password?"],
  },
  sw: {
    intro: "Habari! Mimi ni Msaidizi wa SokoTZ, mfumo wa AI. Naweza kukueleza jinsi ya kutumia SokoTZ na kuwasaidia wafanyabiashara kuandika maelezo ya bidhaa. Bado siwezi kutafuta bidhaa, na sitabuni biashara, bei wala maoni. Tafadhali usishiriki nenosiri au taarifa za malipo.",
    placeholder: "Uliza swali…",
    send: "Tuma", newChat: "Mazungumzo mapya", error: "Msaidizi ameshindwa kujibu. Tafadhali jaribu tena.", retry: "Jaribu tena",
    suggestions: ["Nawezaje kufungua wasifu wa biashara?", "Niandikie maelezo ya juisi yangu ya embe", "Nawezaje kubadilisha nenosiri?"],
  },
} as const;

function Assistant() {
  const [lang, setLang] = useState<Lang>("sw");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const t = T[lang];

  useEffect(() => {
    const saved = localStorage.getItem("sokotz-lang");
    if (saved === "en" || saved === "sw") setLang(saved);
  }, []);
  useEffect(() => endRef.current?.scrollIntoView({ block: "end" }), [messages]);

  function changeLang(l: Lang) { setLang(l); localStorage.setItem("sokotz-lang", l); }

  async function send(history: Msg[]) {
    setBusy(true); setError(false);
    setMessages([...history, { role: "assistant", content: "" }]);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang, messages: history.slice(-20) }),
      });
      if (!res.ok || !res.body) throw new Error(String(res.status));
      const reader = res.body.getReader(); const dec = new TextDecoder(); let text = "";
      for (;;) {
        const { done, value } = await reader.read(); if (done) break;
        text += dec.decode(value, { stream: true });
        setMessages([...history, { role: "assistant", content: text }]);
      }
      if (!text.trim()) throw new Error("empty");
    } catch {
      setMessages(history); setError(true);
    } finally { setBusy(false); }
  }

  function submit(text: string) {
    const v = text.trim(); if (!v || busy) return;
    setInput(""); send([...messages, { role: "user", content: v }]);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="overflow-hidden rounded-3xl border bg-surface shadow-card">
        <div className="flex flex-wrap items-center gap-3 border-b px-5 py-4">
          <span className="flex size-9 items-center justify-center rounded-full bg-gradient-primary shadow-glow"><Sparkles className="size-4 text-primary-foreground" aria-hidden /></span>
          <div>
            <h1 className="text-base font-semibold">{lang === "sw" ? "Msaidizi wa SokoTZ" : "SokoTZ Assistant"}</h1>
            <p className="text-xs text-muted-foreground">AI</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div role="group" aria-label="Language" className="flex rounded-lg border p-0.5 text-xs">
              {(["sw", "en"] as const).map((l) => (
                <button key={l} type="button" onClick={() => changeLang(l)} aria-pressed={lang === l}
                  className={`rounded-md px-2.5 py-1 ${lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                  {l === "sw" ? "Kiswahili" : "English"}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => { setMessages([]); setError(false); }} aria-label={t.newChat} title={t.newChat}
              className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground hover:text-foreground"><RotateCcw className="size-4" aria-hidden /></button>
          </div>
        </div>
        <div className="max-h-[60vh] min-h-72 space-y-4 overflow-y-auto p-5" aria-live="polite">
          <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-accent p-4 text-sm">{t.intro}</div>
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2">
              {t.suggestions.map((s) => (
                <button key={s} type="button" onClick={() => submit(s)} className="rounded-full border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">{s}</button>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`max-w-[85%] whitespace-pre-wrap rounded-2xl p-4 text-sm ${m.role === "user" ? "ml-auto rounded-tr-sm bg-primary text-primary-foreground" : "rounded-tl-sm bg-accent"}`}>
              {m.content || <Loader2 className="size-4 animate-spin" aria-label="…" />}
            </div>
          ))}
          {error && (
            <div className="flex items-center gap-3 text-sm text-destructive">
              {t.error}
              <button type="button" className="underline" onClick={() => send(messages)}>{t.retry}</button>
            </div>
          )}
          <div ref={endRef} />
        </div>
        <form className="flex gap-2 border-t p-3" onSubmit={(e) => { e.preventDefault(); submit(input); }}>
          <label htmlFor="assistant-input" className="sr-only">{t.placeholder}</label>
          <input id="assistant-input" value={input} onChange={(e) => setInput(e.target.value)} maxLength={4000} placeholder={t.placeholder}
            className="h-11 flex-1 rounded-lg border border-input bg-background px-3 text-sm" />
          <button type="submit" disabled={busy || !input.trim()} aria-label={t.send}
            className="flex size-11 items-center justify-center rounded-lg bg-gradient-primary text-primary-foreground disabled:opacity-50">
            {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
          </button>
        </form>
      </div>
    </div>
  );
}
