import { useState, type ReactNode } from "react";
import type { z, ZodTypeAny } from "zod";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { errorMessage } from "@/lib/api/client";
import { FormField, readForm, zodErrors, type Field } from "./FormField";

/** Validated form for dashboard records. Errors from Firestore are shown inline, never hidden. */
export function DataForm<S extends ZodTypeAny>({
  fields,
  schema,
  submitLabel,
  onSubmit,
  extra,
  secondary,
  transform,
}: {
  fields: Field[];
  schema: S;
  submitLabel: string;
  onSubmit: (data: z.infer<S>) => Promise<unknown>;
  /** Extra controls rendered before the submit button (e.g. image picker). */
  extra?: ReactNode;
  secondary?: ReactNode;
  /** Adds values not held in inputs (e.g. the processed image) before validation. */
  transform?: (raw: Record<string, string>) => Record<string, unknown>;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [failure, setFailure] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handle(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setFailure(null);
    const raw = readForm(e.currentTarget);
    const parsed = schema.safeParse(transform ? transform(raw) : raw);
    if (!parsed.success) {
      setErrors(zodErrors(parsed.error.issues));
      return;
    }
    setErrors({});
    setBusy(true);
    try {
      await onSubmit(parsed.data);
    } catch (err) {
      setFailure(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form noValidate onSubmit={handle} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div
            key={f.name}
            className={f.type === "textarea" || f.type === "radio" ? "sm:col-span-2" : ""}
          >
            <FormField f={f} error={errors[f.name]} />
          </div>
        ))}
      </div>
      {extra}
      {errors["imageUrl"] && <p className="text-xs text-destructive">{errors["imageUrl"]}</p>}
      {failure && (
        <div
          role="alert"
          className="flex gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden /> {failure}
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="hero" className="h-11" disabled={busy}>
          {busy ? (
            <>
              <Loader2 className="animate-spin" aria-hidden /> Saving…
            </>
          ) : (
            submitLabel
          )}
        </Button>
        {secondary}
      </div>
    </form>
  );
}
