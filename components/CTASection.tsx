import Link from "next/link";
import Image from "next/image";

export function CTASection({
  eyebrow,
  title,
  subtitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  image,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-charcoal text-warmwhite">
      {image && (
        <>
          <Image src={image} alt="" fill sizes="100vw" className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-charcoal/60" />
        </>
      )}
      <div className="relative container-lux py-20 md:py-28 text-center">
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <h2 className="font-serif text-3xl md:text-5xl max-w-2xl mx-auto leading-tight">{title}</h2>
        {subtitle && <p className="text-warmwhite/75 max-w-xl mx-auto mt-5">{subtitle}</p>}
        <div className="flex flex-wrap justify-center gap-4 mt-9">
          <Link href={primaryHref} className="btn-primary">
            {primaryLabel}
          </Link>
          {secondaryLabel && secondaryHref && (
            <Link href={secondaryHref} className="btn-outline-light">
              {secondaryLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export function WhyLuxeStone() {
  const points = [
    { title: "Skilled Craftsmanship", desc: "Precise, professional installation from experienced tile and stone setters." },
    { title: "Free On-Site Estimates", desc: "We visit your space, measure the job, and give you a clear, itemized quote." },
    { title: "Quality Materials", desc: "Guidance on marble, porcelain, natural stone and engineered surfaces that fit your project and budget." },
    { title: "Reliable Timelines", desc: "Clear scheduling and communication from the first estimate through final walkthrough." },
    { title: "Residential & Commercial", desc: "Experience across custom homes, hospitality and commercial builds." },
    { title: "Workmanship You Can Trust", desc: "Clean job sites, careful prep work, and installs built to last." },
  ];
  return (
    <section className="container-lux py-20 md:py-28">
      <p className="eyebrow mb-3 text-center">Why LuxeStone</p>
      <h2 className="section-heading text-center max-w-2xl mx-auto">
        Trusted by designers, architects and homeowners
      </h2>
      <div className="grid md:grid-cols-3 gap-x-8 gap-y-12 mt-16">
        {points.map((p) => (
          <div key={p.title} className="border-t border-charcoal/15 pt-6">
            <h3 className="font-serif text-xl mb-2">{p.title}</h3>
            <p className="text-sm text-warmgray leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function TestimonialsSection({
  testimonials,
}: {
  testimonials: import("@/lib/testimonials").Testimonial[];
}) {
  if (testimonials.length === 0) return null;
  const hasDemoContent = testimonials.some((t) => t.demo);

  return (
    <section className="bg-stonebeige/30 py-20 md:py-28">
      <div className="container-lux">
        <p className="eyebrow mb-3 text-center">Testimonials</p>
        <h2 className="section-heading text-center max-w-2xl mx-auto mb-3">What our clients say</h2>
        {hasDemoContent && (
          <p className="text-center text-xs text-warmgray mb-14">Demo content — replace before launch</p>
        )}
        <div className={`grid md:grid-cols-3 gap-8 ${!hasDemoContent ? "mt-10" : ""}`}>
          {testimonials.map((t) => (
            <blockquote key={t.id} className="bg-warmwhite p-8">
              <p className="font-serif text-lg leading-relaxed text-charcoal mb-6">&ldquo;{t.quote}&rdquo;</p>
              <footer className="text-sm text-warmgray">
                <span className="text-charcoal font-medium">{t.author}</span> &mdash; {t.role}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="text-xs text-warmgray flex flex-wrap gap-2 items-center">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {item.href ? (
            <Link href={item.href} className="hover:text-accent">
              {item.label}
            </Link>
          ) : (
            <span className="text-charcoal">{item.label}</span>
          )}
          {i < items.length - 1 && <span>/</span>}
        </span>
      ))}
    </nav>
  );
}
