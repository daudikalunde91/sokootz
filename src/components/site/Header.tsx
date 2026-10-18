import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

const nav = [
  { to: "/search", label: "Explore" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6">
        <Logo />
        <nav aria-label="Main" className="ml-6 hidden items-center gap-1 md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground bg-accent" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link to="/assistant"><Sparkles className="text-neon" aria-hidden /> Assistant</Link>
          </Button>
          <Button asChild variant="ghost" size="sm"><Link to="/auth/login">Log in</Link></Button>
          <Button asChild variant="hero" size="sm"><Link to="/dashboard">List your business</Link></Button>
        </div>
        <Button variant="ghost" size="icon" className="ml-auto md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <nav aria-label="Mobile" className="border-t bg-surface px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-1">
            {[...nav, { to: "/assistant", label: "SokoTZ Assistant" }, { to: "/auth/login", label: "Log in" }, { to: "/dashboard", label: "List your business" }].map((n) => (
              <li key={n.to}>
                <Link to={n.to} onClick={() => setOpen(false)} className="block rounded-md px-3 py-3 text-base hover:bg-accent">{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
