import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 font-display text-lg font-bold"
      aria-label="SokoTZ home"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-primary text-sm text-primary-foreground shadow-glow">
        S
      </span>
      <span>
        Soko<span className="text-gradient-neon">TZ</span>
      </span>
    </Link>
  );
}
