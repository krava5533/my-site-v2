import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/CTASection";
import { APPLICATION_LIST } from "@/lib/data/applications";

export const metadata: Metadata = {
  title: "Shop by Application — Kitchens, Bathrooms, Commercial & More",
  description: "Explore LuxeStone Interiors surfaces organized by application, from kitchens and bathrooms to hospitality and commercial builds.",
};

export default function ApplicationsPage() {
  return (
    <div className="container-lux py-12 md:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Applications" }]} />
      <div className="mt-6 mb-12">
        <p className="eyebrow mb-3">Shop by Application</p>
        <h1 className="section-heading">Designed for how you live</h1>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {APPLICATION_LIST.map((app) => (
          <Link key={app.slug} href={`/applications/${app.slug}`} className="group relative aspect-[4/3] overflow-hidden card-hover-reveal">
            <Image src={app.image} alt={app.name} fill sizes="33vw" className="object-cover" />
            <div className="absolute inset-0 bg-deepblack/35 group-hover:bg-deepblack/50 transition-colors flex items-end p-5">
              <h3 className="font-serif text-xl text-warmwhite">{app.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
