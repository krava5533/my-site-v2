import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/CTASection";
import AppointmentForm from "@/components/AppointmentForm";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Get a Free Estimate",
  description: "Book a free on-site consultation and estimate for your tile or stone installation project.",
};

export default async function EstimatePage() {
  const settings = await getSettings();

  return (
    <div>
      <div className="relative h-[55vh] min-h-[400px]">
        <Image
          src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=2000&q=80"
          alt="Tile installation in progress"
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-deepblack/45" />
        <div className="relative h-full container-lux flex flex-col justify-end pb-14">
          <p className="eyebrow text-warmwhite mb-3">Free Estimate</p>
          <h1 className="font-serif text-4xl md:text-6xl text-warmwhite">
            Book a free on-site consultation
          </h1>
        </div>
      </div>

      <div className="container-lux py-12">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Get an Estimate" }]} />
      </div>

      <section className="container-lux grid md:grid-cols-2 gap-16 pb-20">
        <div>
          <h2 className="section-heading mb-6">What to Expect</h2>
          <ul className="space-y-4 text-warmgray leading-relaxed">
            <li>&mdash; A visit to your space to measure and assess the job</li>
            <li>&mdash; One-on-one time with an installation specialist</li>
            <li>&mdash; Material and layout recommendations for your project</li>
            <li>&mdash; A clear, itemized estimate before any work begins</li>
          </ul>

          <div className="mt-10 space-y-3 text-sm border-t border-warmgray/20 pt-8">
            {settings.phone && <p><strong>Phone:</strong> {settings.phone}</p>}
            {settings.email && <p><strong>Email:</strong> {settings.email}</p>}
            {settings.address && <p><strong>Service Area:</strong> {settings.address}</p>}
          </div>
        </div>

        <div id="appointment">
          <h2 className="section-heading mb-6">Book Your Free Estimate</h2>
          <AppointmentForm />
        </div>
      </section>
    </div>
  );
}
