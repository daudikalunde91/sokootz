import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Clock, PlugZap, SearchX, WifiOff } from "lucide-react";
import { ApiError } from "@/lib/api/client";

export function PlannedBadge({ children = "Planned" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-violet/40 bg-violet/10 px-2.5 py-0.5 text-xs font-medium text-violet">
      <Clock className="size-3" aria-hidden /> {children}
    </span>
  );
}

export function EmptyState({ icon, title, body, action }: { icon?: ReactNode; title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed bg-surface/60 px-6 py-12 text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-accent text-neon">
        {icon ?? <SearchX className="size-6" aria-hidden />}
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      {body && <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/** Maps a service error to a user-facing state. */
export function DataState({ error }: { error: unknown }) {
  if (error instanceof ApiError && error.code === "not_configured") {
    return (
      <EmptyState
        icon={<PlugZap className="size-6" aria-hidden />}
        title="No listings yet"
        body="SokoTZ is getting ready to launch. Businesses and listings will appear here once the marketplace opens."
      />
    );
  }
  if (error instanceof ApiError && error.code === "network") {
    return <EmptyState icon={<WifiOff className="size-6" aria-hidden />} title="You appear to be offline" body={error.message} />;
  }
  if (error instanceof ApiError && error.code === "not_found") {
    return <EmptyState title="Not found" body="This page may have been removed." action={<Link to="/search" className="text-neon underline">Browse the marketplace</Link>} />;
  }
  return <EmptyState title="Something went wrong" body="Please try again in a moment." />;
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-muted ${className}`} aria-hidden />;
}

export function PageHeader({ eyebrow, title, body, children }: { eyebrow?: string; title: string; body?: string; children?: ReactNode }) {
  return (
    <header className="mb-8">
      {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neon">{eyebrow}</p>}
      <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
      {body && <p className="mt-3 max-w-2xl text-muted-foreground">{body}</p>}
      {children}
    </header>
  );
}
