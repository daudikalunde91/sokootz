import { useState, type ReactNode } from "react";
import type { z, ZodTypeAny } from "zod";
import { AlertCircle, CheckCircle2, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authErrorMessage } from "@/lib/auth/errors";
import { ApiError } from "@/lib/api/client";
import { FormField, readForm, zodErrors, type Field } from "./FormField";

export type { Field };

/**
 * Validated account form backed by Firebase Authentication. `onSubmit` performs
 * the real call; success text is only shown after it resolves.
 */
export function AuthForm<S extends ZodTypeAny>({
  title,
  subtitle,
  fields,
  schema,
  submitLabel,
  onSubmit,
  footer,
  onGoogle,
  configured = true,
  successMessage,
  disabled = false,
}: {
  title: string;
  subtitle?: ReactNode;
  fields: Field[];
  schema: S;
  submitLabel: string;
  onSubmit: (data: z.infer<S>) => Promise<unknown>;
  footer?: ReactNode;
  /** When provided, shows a working "Continue with Google" button. */
  onGoogle?: () => Promise<unknown>;
  /** False when the Firebase web app keys are missing; the form is then disabled. */
  configured?: boolean;
  successMessage?: string;
  disabled?: boolean;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<{ kind: "error" | "success"; text: string } | null>(null);
  const [busy, setBusy] = useState<false | "form" | "google">(false);
  const off = !configured || disabled;

  function failure(err: unknown) {
    const text = err instanceof ApiError ? err.message : authErrorMessage(err);
    if (text) setStatus({ kind: "error", text });
  }

  async function handle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (off || busy) return;
    setStatus(null);
    const parsed = schema.safeParse(readForm(e.currentTarget));
    if (!parsed.success) {
      setErrors(zodErrors(parsed.error.issues));
      return;
    }
    setErrors({});
    setBusy("form");
    try {
      await onSubmit(parsed.data);
      if (successMessage) setStatus({ kind: "success", text: successMessage });
    } catch (err) {
      failure(err);
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    if (off || busy || !onGoogle) return;
    setStatus(null);
    setBusy("google");
    try {
      await onGoogle();
    } catch (err) {
      failure(err);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border bg-surface p-6 shadow-card md:p-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && <div className="mt-2 text-sm text-muted-foreground">{subtitle}</div>}
      {!configured && (
        <div
          role="status"
          className="mt-4 flex items-start gap-2 rounded-lg border bg-accent p-3 text-sm"
        >
          <Info className="mt-0.5 size-4 shrink-0 text-neon" aria-hidden />
          <p>
            <strong>Not connected yet</strong> — Akaunti zitapatikana baada ya muunganisho wa SokoTZ
            kukamilika (Accounts open once the SokoTZ connection is set up).
          </p>
        </div>
      )}
      {onGoogle && (
        <>
          <Button
            type="button"
            variant="outline"
            disabled={off || !!busy}
            onClick={google}
            className="mt-5 h-auto min-h-11 w-full flex-wrap whitespace-normal py-3"
          >
            {busy === "google" ? (
              <Loader2 className="animate-spin" aria-hidden />
            ) : (
              <span aria-hidden className="font-bold">
                G
              </span>
            )}{" "}
            Continue with Google
          </Button>
          <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground" aria-hidden>
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
        </>
      )}
      <form noValidate onSubmit={handle} className="mt-6 space-y-4">
        {fields.map((f) => (
          <FormField key={f.name} f={f} error={errors[f.name]} />
        ))}
        {status && (
          <div
            role={status.kind === "error" ? "alert" : "status"}
            className={`flex gap-2 rounded-lg border p-3 text-sm ${status.kind === "error" ? "border-destructive/50 bg-destructive/10" : "border-neon/40 bg-neon/10"}`}
          >
            {status.kind === "error" ? (
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden />
            ) : (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-neon" aria-hidden />
            )}
            <span>{status.text}</span>
          </div>
        )}
        <Button type="submit" variant="hero" className="h-11 w-full" disabled={off || !!busy}>
          {busy === "form" ? (
            <>
              <Loader2 className="animate-spin" aria-hidden /> Please wait…
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </form>
      {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
    </div>
  );
}
