import { PageHeader, PlannedBadge } from "./states";

export function PlannedSection({ title, body, items }: { title: string; body: string; items: string[] }) {
  return (
    <section>
      <PageHeader title={title} body={body}><div className="mt-3"><PlannedBadge>Available after accounts launch</PlannedBadge></div></PageHeader>
      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((i) => (
          <li key={i} className="rounded-xl border border-dashed bg-surface/60 p-4 text-sm text-muted-foreground">{i}</li>
        ))}
      </ul>
    </section>
  );
}
