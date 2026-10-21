import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchBar({ initial = "", large = false }: { initial?: string; large?: boolean }) {
  const [q, setQ] = useState(initial);
  const navigate = useNavigate();
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        navigate({ to: "/search", search: { q: q.trim() || undefined } });
      }}
      className={`flex w-full items-center gap-2 rounded-2xl border bg-surface p-2 shadow-card focus-within:border-neon ${large ? "md:p-3" : ""}`}
    >
      <label htmlFor="site-search" className="sr-only">Search businesses, products and services</label>
      <Search className="ml-1 size-5 shrink-0 text-muted-foreground sm:ml-2" aria-hidden />
      <input
        id="site-search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        maxLength={120}
        placeholder="Search SokoTZ…"
        className={`min-w-0 flex-1 bg-transparent px-1 text-base outline-none placeholder:text-muted-foreground ${large ? "md:text-lg" : ""}`}
      />
      <Button type="submit" variant="hero" size={large ? "lg" : "default"} className="h-11 shrink-0 px-4 sm:px-6">Search</Button>
    </form>
  );
}
