import type { ReactNode } from "react";

export interface Field {
  name: string;
  label: string;
  type?:
    | "text"
    | "email"
    | "password"
    | "tel"
    | "number"
    | "textarea"
    | "select"
    | "checkbox"
    | "radio"
    | undefined;
  autoComplete?: string | undefined;
  placeholder?: string | undefined;
  hint?: ReactNode | undefined;
  options?: readonly { value: string; label: string }[] | undefined;
  defaultValue?: string | undefined;
  required?: boolean | undefined;
  maxLength?: number | undefined;
}

const inputCls =
  "w-full rounded-lg border border-input bg-background px-3 text-base outline-none focus:border-neon aria-[invalid=true]:border-destructive";

export function FormField({ f, error }: { f: Field; error?: string | undefined }) {
  const describedBy =
    [error ? `${f.name}-err` : null, f.hint ? `${f.name}-hint` : null].filter(Boolean).join(" ") ||
    undefined;
  const common = {
    id: f.name,
    name: f.name,
    "aria-invalid": !!error,
    "aria-describedby": describedBy,
  };

  if (f.type === "checkbox") {
    return (
      <div>
        <label htmlFor={f.name} className="flex items-start gap-3 text-sm">
          <input
            {...common}
            type="checkbox"
            defaultChecked={f.defaultValue === "on"}
            className="mt-1 size-4 accent-primary"
          />
          <span>{f.label}</span>
        </label>
        {error && (
          <p id={`${f.name}-err`} className="mt-1 text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (f.type === "radio") {
    return (
      <fieldset aria-describedby={describedBy}>
        <legend className="mb-1.5 block text-sm font-medium">{f.label}</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {f.options?.map((o) => (
            <label
              key={o.value}
              className="flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border bg-background px-3 py-2 text-sm has-[:checked]:border-neon"
            >
              <input
                type="radio"
                name={f.name}
                value={o.value}
                defaultChecked={f.defaultValue === o.value}
                className="accent-primary"
              />
              {o.label}
            </label>
          ))}
        </div>
        {error && (
          <p id={`${f.name}-err`} className="mt-1 text-xs text-destructive">
            {error}
          </p>
        )}
      </fieldset>
    );
  }

  return (
    <div>
      <label htmlFor={f.name} className="mb-1.5 block text-sm font-medium">
        {f.label}
      </label>
      {f.type === "textarea" ? (
        <textarea
          {...common}
          defaultValue={f.defaultValue}
          maxLength={f.maxLength}
          placeholder={f.placeholder}
          rows={4}
          className={`${inputCls} py-2`}
        />
      ) : f.type === "select" ? (
        <select {...common} defaultValue={f.defaultValue ?? ""} className={`${inputCls} h-11`}>
          <option value="" disabled>
            Choose…
          </option>
          {f.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          {...common}
          type={f.type ?? "text"}
          inputMode={f.type === "number" ? "numeric" : undefined}
          min={f.type === "number" ? 0 : undefined}
          step={f.type === "number" ? 1 : undefined}
          autoComplete={f.autoComplete}
          placeholder={f.placeholder}
          defaultValue={f.defaultValue}
          maxLength={f.maxLength}
          className={`${inputCls} h-11`}
        />
      )}
      {f.hint && (
        <p id={`${f.name}-hint`} className="mt-1 text-xs text-muted-foreground">
          {f.hint}
        </p>
      )}
      {error && (
        <p id={`${f.name}-err`} className="mt-1 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/** Reads a form into a plain object (unchecked checkboxes are omitted, like the browser does). */
export function readForm(form: HTMLFormElement): Record<string, string> {
  return Object.fromEntries(new FormData(form)) as Record<string, string>;
}

export function zodErrors(issues: readonly { path: readonly PropertyKey[]; message: string }[]) {
  const errs: Record<string, string> = {};
  for (const issue of issues) errs[String(issue.path[0])] ??= issue.message;
  return errs;
}
