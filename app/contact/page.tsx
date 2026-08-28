import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/CTASection";
import ContactForm from "@/components/ContactForm";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with our team.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <div className="container-lux py-12 md:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <div className="grid md:grid-cols-2 gap-16 mt-8">
        <div>
          <p className="eyebrow mb-3">Contact</p>
          <h1 className="section-heading mb-6">Talk to a Specialist</h1>
          <p className="text-warmgray leading-relaxed mb-8">
            Have a question about a project or an estimate? Send us a message and our team
            will respond shortly.
          </p>
          <div className="space-y-3 text-sm border-t border-warmgray/20 pt-8">
            {settings.phone && <p><strong>Phone:</strong> {settings.phone}</p>}
            {settings.email && <p><strong>Email:</strong> {settings.email}</p>}
            {settings.address && <p><strong>Address:</strong> {settings.address}</p>}
            {settings.instagram && (
              <p>
                <strong>Instagram:</strong>{" "}
                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="text-accent underline">
                  {settings.instagram}
                </a>
              </p>
            )}
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
