import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Clock, Lock, PlugZap, SearchX, WifiOff } from "lucide-react";
import { ApiError } from "@/lib/api/client";

export function PlannedBadge({ children = "Planned" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-violet/40 bg-violet/10 px-2.5 py-0.5 text-xs font-medium text-violet">
      <Clock className="size-3 shrink-0" aria-hidden /> {children}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
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

/** Maps a service error to a user-facing state. Never substitutes sample data. */
export function DataState({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const retry = onRetry ? (
    <button type="button" onClick={onRetry} className="min-h-11 text-neon underline">
      Try again
    </button>
  ) : undefined;
  const code = error instanceof ApiError ? error.code : "server";
  if (code === "not_configured") {
    return (
      <EmptyState
        icon={<PlugZap className="size-6" aria-hidden />}
        title="Marketplace not connected yet"
        body="The website's connection to the SokoTZ marketplace is still being set up. Listings will appear here once it is ready."
      />
    );
  }
  if (code === "network") {
    return (
      <EmptyState
        icon={<WifiOff className="size-6" aria-hidden />}
        title="You appear to be offline"
        body="Check your connection and try again."
        action={retry}
      />
    );
  }
  if (code === "not_found") {
    return (
      <EmptyState
        title="Not found"
        body="This page may have been removed or is not public."
        action={
          <Link to="/search" className="text-neon underline">
            Browse the marketplace
          </Link>
        }
      />
    );
  }
  if (code === "forbidden" || code === "unauthorized") {
    return (
      <EmptyState
        icon={<Lock className="size-6" aria-hidden />}
        title="Sign-in required"
        body="The marketplace isn't open to visitors right now. Log in with your SokoTZ account to continue."
        action={
          <Link to="/auth/login" className="text-neon underline">
            Log in
          </Link>
        }
      />
    );
  }
  if (code === "index_required") {
    return (
      <EmptyState
        title="This view isn't ready yet"
        body="A database index still needs to be created for this view. Please try again later."
      />
    );
  }
  if (code === "rate_limited") {
    return (
      <EmptyState
        title="Too many requests"
        body="Please wait a moment and try again."
        action={retry}
      />
    );
  }
  return (
    <EmptyState title="Something went wrong" body="Please try again in a moment." action={retry} />
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-muted ${className}`} aria-hidden />;
}

export function PageHeader({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-8">
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-neon">{eyebrow}</p>
      )}
      <h1 className="break-words text-3xl font-bold md:text-4xl">{title}</h1>
      {body && <p className="mt-3 max-w-2xl text-muted-foreground">{body}</p>}
      {children}
    </header>
  );
}
