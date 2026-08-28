import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-[92vh] min-h-[640px] w-full overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=2000&q=85"
        alt="Book-matched marble kitchen island by LuxeStone Interiors"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-deepblack/70 via-deepblack/20 to-deepblack/10" />

      <div className="relative z-10 h-full container-lux flex flex-col justify-end pb-20 md:pb-28">
        <p className="eyebrow text-warmwhite mb-4 animate-fadeUp">Expert Tile & Stone Installation</p>
        <h1 className="font-serif text-5xl md:text-7xl text-warmwhite leading-[1.05] max-w-3xl animate-fadeUp [animation-delay:0.1s] opacity-0">
          Expert Craftsmanship, <br className="hidden md:block" />Built to Last.
        </h1>
        <p className="text-warmwhite/85 text-base md:text-lg max-w-xl mt-6 animate-fadeUp [animation-delay:0.2s] opacity-0">
          Professional tile and stone installation for kitchens, bathrooms, floors and
          custom residential and commercial projects.
        </p>
        <div className="flex flex-wrap gap-4 mt-9 animate-fadeUp [animation-delay:0.3s] opacity-0">
          <Link href="/request-quote" className="btn-primary">
            Request a Quote
          </Link>
          <Link href="/projects" className="btn-outline-light">
            See Our Work
          </Link>
          <Link href="/showroom" className="btn-outline-light">
            Book a Free Estimate
          </Link>
        </div>
      </div>
    </section>
  );
}
