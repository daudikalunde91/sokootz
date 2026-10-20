import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/states";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { seo } from "@/lib/seo";
import { CONTACT, whatsappLink } from "@/lib/contact";

const items = [
  { icon: Phone, label: "Phone / Simu", value: CONTACT.phoneDisplay, href: `tel:${CONTACT.phone}` },
  { icon: MessageCircle, label: "WhatsApp", value: CONTACT.whatsappDisplay, href: whatsappLink },
  { icon: Mail, label: "Email / Barua pepe", value: CONTACT.email, href: `mailto:${CONTACT.email}` },
];

export const Route = createFileRoute("/contact")({
  head: () => seo("Contact", "Call, WhatsApp or email the SokoTZ team."),
  component: () => (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <PageHeader eyebrow="Contact · Wasiliana nasi" title="Talk to us" />
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map(({ icon: Icon, label, value, href }) => (
          <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
            className="rounded-2xl border bg-surface p-5 shadow-card transition hover:border-primary">
            <Icon className="size-5 text-primary" aria-hidden />
            <p className="mt-3 text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 break-all text-sm font-semibold">{value}</p>
          </a>
        ))}
      </div>
    </div>
  ),
});
