import { useEffect, useState } from "react";
import type { Lang } from "@/lib/api/mappers";

/** Content language for listing titles/descriptions; shares the Assistant's saved choice. */
export function useContentLang(): [Lang, (l: Lang) => void] {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    const saved = localStorage.getItem("sokotz-lang");
    if (saved === "en" || saved === "sw") setLang(saved);
  }, []);
  return [
    lang,
    (l) => {
      setLang(l);
      localStorage.setItem("sokotz-lang", l);
    },
  ];
}
