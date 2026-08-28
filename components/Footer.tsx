import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { getSettings } from "@/lib/settings";
import { Instagram, Linkedin } from "lucide-react";

export default async function Footer() {
  const settings = await getSettings();

  return (
    <footer className="bg-charcoal text-warmwhite mt-24">
      <div className="container-lux py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <p className="font-serif text-2xl mb-4">{siteConfig.name}</p>
          <p className="text-sm text-warmwhite/60 max-w-xs leading-relaxed">
            {siteConfig.description}
          </p>
          <div className="flex gap-4 mt-6">
            {settings.instagram && (
              <a href={settings.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={18} className="text-warmwhite/60 hover:text-accent transition-colors" />
              </a>
            )}
            {settings.linkedin && (
              <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin size={18} className="text-warmwhite/60 hover:text-accent transition-colors" />
              </a>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest2 text-warmwhite/50 mb-4">Explore</p>
          <ul className="space-y-2.5">
            {siteConfig.nav.footer.explore.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-warmwhite/80 hover:text-accent transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest2 text-warmwhite/50 mb-4">Get Started</p>
          <ul className="space-y-2.5">
            {siteConfig.nav.footer.leadGen.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sm text-warmwhite/80 hover:text-accent transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest2 text-warmwhite/50 mb-4">Contact</p>
          <ul className="space-y-2.5 text-sm text-warmwhite/80">
            {settings.phone && <li><a href={`tel:${settings.phone}`} className="hover:text-accent transition-colors">{settings.phone}</a></li>}
            {settings.email && <li><a href={`mailto:${settings.email}`} className="hover:text-accent transition-colors">{settings.email}</a></li>}
            {settings.address && <li>{settings.address}</li>}
            {!settings.phone && !settings.email && !settings.address && (
              <li className="text-warmwhite/40">Contact info coming soon</li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-warmwhite/10">
        <div className="container-lux py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-warmwhite/50">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </p>
          <div className="flex gap-6">
            {siteConfig.nav.footer.legal.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-warmwhite transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
