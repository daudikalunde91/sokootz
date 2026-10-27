import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { telHref, whatsappHref } from "@/lib/api/mappers";

/** Renders Call / WhatsApp only for numbers that normalise to a valid phone number. */
export function ContactButtons({
  phone,
  whatsapp,
  context,
}: {
  phone: string;
  whatsapp: string;
  context?: string;
}) {
  const tel = telHref(phone);
  const wa = whatsappHref(whatsapp || phone);
  const text = context
    ? `?text=${encodeURIComponent(`Habari, nimeona "${context}" kwenye SokoTZ.`)}`
    : "";
  if (!tel && !wa)
    return <p className="text-sm text-muted-foreground">No contact details published.</p>;
  return (
    <div className="flex flex-wrap gap-3">
      {tel && (
        <Button asChild variant="hero">
          <a href={tel}>
            <Phone aria-hidden /> Call
          </a>
        </Button>
      )}
      {wa && (
        <Button asChild variant="outline">
          <a href={wa + text} target="_blank" rel="noopener noreferrer">
            <MessageCircle aria-hidden /> WhatsApp
          </a>
        </Button>
      )}
    </div>
  );
}
