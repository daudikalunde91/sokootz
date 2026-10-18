import { useState, type ReactNode } from "react";
import type { ZodType } from "zod";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/api/client";

export interface Field {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
}

/** Generic validated form. `onSubmit` calls a real service; errors are shown, never faked as success. */
export function AuthForm({ title, subtitle, fields, schema, submitLabel, onSubmit, footer }: {
  title: string;
  subtitle?: string;
  fields: Field[];
  schema: ZodType;
  submitLabel: string;
  onSubmit: (data: Record<string, string>) => Promise<unknown>;
  footer?: ReactNode;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) errs[String(issue.path[0])] ??= issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      await onSubmit(data);
    } catch (err) {
      setStatus(errorMessage(err) + " Accounts open when the marketplace launches.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border bg-surface p-6 shadow-card md:p-8">
      <h1 className="text-2xl font-bold">{title}</h1>
      {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
      <form noValidate onSubmit={handle} className="mt-6 space-y-4">
        {fields.map((f) => (
          <div key={f.name}>
            <label htmlFor={f.name} className="mb-1.5 block text-sm font-medium">{f.label}</label>
            <input
              id={f.name}
              name={f.name}
              type={f.type ?? "text"}
              autoComplete={f.autoComplete}
              aria-invalid={!!errors[f.name]}
              aria-describedby={errors[f.name] ? `${f.name}-err` : undefined}
              className="h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-neon aria-[invalid=true]:border-destructive"
            />
            {errors[f.name] && <p id={`${f.name}-err`} className="mt-1 text-xs text-destructive">{errors[f.name]}</p>}
          </div>
        ))}
        {status && (
          <div role="status" className="flex gap-2 rounded-lg border border-violet/40 bg-violet/10 p-3 text-sm">
            <Info className="mt-0.5 size-4 shrink-0 text-violet" aria-hidden /> {status}
          </div>
        )}
        <Button type="submit" variant="hero" className="w-full" disabled={busy}>{busy ? "Please wait…" : submitLabel}</Button>
      </form>
      {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
    </div>
  );
}
