import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/AuthProvider";
import { Logo } from "./Logo";

const nav = [
  { to: "/search", label: "Explore" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const signedIn = !!auth.user;
  const name = auth.profile?.displayName || auth.user?.displayName || auth.user?.email || "";

  async function logout() {
    setOpen(false);
    try {
      await auth.signOut();
      toast.success("Umetoka (Logged out).");
      navigate({ to: "/" });
    } catch {
      toast.error("Could not log out. Please try again.");
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 md:px-6 lg:flex">
        <Logo />
        <nav aria-label="Main" className="ml-6 hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-foreground bg-accent" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto hidden shrink-0 items-center gap-2 lg:flex">
          <Button asChild variant="ghost" size="sm">
            <Link to="/assistant">
              <Sparkles className="text-neon" aria-hidden /> Assistant
            </Link>
          </Button>
          {signedIn ? (
            <>
              <span className="max-w-40 truncate text-sm text-muted-foreground" title={name}>
                {name}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut aria-hidden /> Log out
              </Button>
              <Button asChild variant="hero" size="sm">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth/login">Log in</Link>
              </Button>
              <Button asChild variant="hero" size="sm">
                <Link to="/dashboard">List your business</Link>
              </Button>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto size-11 shrink-0 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-controls="mobile-navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile"
          className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t bg-surface px-4 py-4 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {[
              ...nav,
              { to: "/assistant", label: "SokoTZ Assistant" },
              ...(signedIn
                ? [{ to: "/dashboard", label: "Dashboard" }]
                : [
                    { to: "/auth/login", label: "Log in" },
                    { to: "/dashboard", label: "List your business" },
                  ]),
            ].map((n) => (
              <li key={n.to + n.label}>
                <Link
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-3 text-base hover:bg-accent"
                >
                  {n.label}
                </Link>
              </li>
            ))}
            {signedIn && (
              <li>
                <button
                  type="button"
                  onClick={logout}
                  className="block w-full rounded-md px-3 py-3 text-left text-base hover:bg-accent"
                >
                  Log out
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}
