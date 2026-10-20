import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { PlannedBadge } from "./states";
import { CONTACT, whatsappLink } from "@/lib/contact";

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-surface/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 md:px-6">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">Find businesses, products and services across Tanzania.</p>
          <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
            <li><a href={`tel:${CONTACT.phone}`} className="hover:text-foreground">Simu: {CONTACT.phoneDisplay}</a></li>
            <li><a href={whatsappLink} target="_blank" rel="noreferrer" className="hover:text-foreground">WhatsApp: {CONTACT.whatsappDisplay}</a></li>
            <li><a href={`mailto:${CONTACT.email}`} className="hover:text-foreground">{CONTACT.email}</a></li>
          </ul>
          <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            Assistant: Kiswahili · English <PlannedBadge>Site translation coming soon</PlannedBadge>
          </div>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Marketplace</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/search" className="hover:text-foreground">Explore</Link></li>
            <li><Link to="/categories" className="hover:text-foreground">Categories</Link></li>
            <li><Link to="/assistant" className="hover:text-foreground">SokoTZ Assistant</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="mb-3 text-sm font-semibold">Company</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/dashboard" className="hover:text-foreground">For businesses</Link></li>
          </ul>
        </div>
      </div>
      <p className="border-t py-6 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} SokoTZ. Made for Tanzania.</p>
    </footer>
  );
}
