import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { CollectionCard, ProjectCard, MaterialCard } from "@/components/CollectionCard";
import { CTASection, WhyLuxeStone, TestimonialsSection } from "@/components/CTASection";
import { getCollections } from "@/lib/store/collections";
import { getMaterials } from "@/lib/store/materials";
import { getProducts } from "@/lib/store/products";
import { getAllProjects } from "@/lib/data/all-projects";
import { getBlogPosts } from "@/lib/store/blog";
import { getTestimonials } from "@/lib/testimonials";

export default async function HomePage() {
  const [products, collections, materials, blogPosts] = await Promise.all([
    getProducts(), getCollections(), getMaterials(), getBlogPosts(),
  ]);
  const featuredProducts = products.filter((p) => p.featured).slice(0, 8);
  const featuredCollections = collections.slice(0, 4);
  const featuredMaterials = materials.slice(0, 6);
  const allProjects = await getAllProjects();
  const featuredProjects = allProjects.slice(0, 6);
  const testimonials = await getTestimonials();

  return (
    <>
      <Hero />

      {/* Featured collections */}
      <section className="container-lux py-20 md:py-28">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="eyebrow mb-3">Featured Collections</p>
            <h2 className="section-heading">Curated for exceptional interiors</h2>
          </div>
          <Link href="/collections" className="hidden md:inline-block text-sm uppercase tracking-wide border-b border-charcoal hover:text-accent hover:border-accent">
            View All Collections
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCollections.map((c) => (
            <CollectionCard key={c.id} collection={c} />
          ))}
        </div>
      </section>

      {/* Shop by material */}
      <section className="bg-stonebeige/25 py-20 md:py-28">
        <div className="container-lux">
          <p className="eyebrow mb-3 text-center">Materials We Work With</p>
          <h2 className="section-heading text-center mb-12">Find your surface</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredMaterials.map((m) => (
              <MaterialCard key={m.slug} material={m} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/materials" className="btn-secondary">View All Materials</Link>
          </div>
        </div>
      </section>

      {/* Shop by application */}
      <section className="container-lux py-20 md:py-28">
        <p className="eyebrow mb-3 text-center">Where We Install</p>
        <h2 className="section-heading text-center mb-12">Designed for how you live</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Kitchens", "Bathrooms", "Flooring", "Outdoor", "Commercial", "Hospitality", "Living Spaces", "Custom Homes"].map(
            (app) => (
              <Link
                key={app}
                href={`/applications/${app.toLowerCase().replace(/\s+/g, "-")}`}
                className="relative aspect-square overflow-hidden group card-hover-reveal bg-charcoal"
              >
                <Image
                  src={`https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=600&q=70`}
                  alt={app}
                  fill
                  sizes="25vw"
                  className="object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-serif text-lg md:text-xl text-warmwhite">{app}</span>
                </div>
              </Link>
            )
          )}
        </div>
      </section>

      {/* Featured products */}
      <section className="bg-stonebeige/25 py-20 md:py-28">
        <div className="container-lux">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="eyebrow mb-3">Popular Materials</p>
              <h2 className="section-heading">Materials we frequently install</h2>
            </div>
            <Link href="/products" className="hidden md:inline-block text-sm uppercase tracking-wide border-b border-charcoal hover:text-accent hover:border-accent">
              View Full Catalog
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Project gallery */}
      <section className="container-lux py-20 md:py-28">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="eyebrow mb-3">Project Gallery</p>
            <h2 className="section-heading">Real spaces, real results</h2>
          </div>
          <Link href="/projects" className="hidden md:inline-block text-sm uppercase tracking-wide border-b border-charcoal hover:text-accent hover:border-accent">
            View All Projects
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {featuredProjects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      <WhyLuxeStone />

      {/* Upload Your Project CTA */}
      <CTASection
        eyebrow="Have a Project in Mind?"
        title="Tell us about your project"
        subtitle="Upload your plans, drawings, inspiration photos or project details and our team will help you find the right surfaces."
        primaryLabel="Upload Your Project"
        primaryHref="/upload-project"
        secondaryLabel="Talk to a Specialist"
        secondaryHref="/contact"
        image="https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=1800&q=70"
      />

      {/* Free estimate section */}
      <section className="container-lux py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-[4/3]">
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"
            alt="Tile installation project"
            fill
            sizes="50vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="eyebrow mb-3">Free On-Site Estimate</p>
          <h2 className="section-heading mb-5">We come to you, no obligation</h2>
          <p className="text-warmgray leading-relaxed mb-8">
            Every project starts with a visit to your space. We&rsquo;ll measure the job,
            walk through material options, and leave you with a clear, itemized quote.
          </p>
          <Link href="/showroom" className="btn-primary">Book a Free Estimate</Link>
        </div>
      </section>

      <TestimonialsSection testimonials={testimonials} />

      {/* Design inspiration */}
      <section className="container-lux py-20 md:py-28">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="eyebrow mb-3">Design Inspiration</p>
            <h2 className="section-heading">Ideas for your next project</h2>
          </div>
          <Link href="/inspiration" className="hidden md:inline-block text-sm uppercase tracking-wide border-b border-charcoal hover:text-accent hover:border-accent">
            Visit the Journal
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.slice(0, 3).map((post) => (
            <Link key={post.id} href={`/inspiration/${post.slug}`} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden card-hover-reveal mb-4">
                <Image src={post.coverImage} alt={post.title} fill sizes="33vw" className="object-cover" />
              </div>
              <p className="text-xs uppercase tracking-wide text-accent mb-2">{post.category}</p>
              <h3 className="font-serif text-xl group-hover:text-accent transition-colors">{post.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Final Request a Quote CTA */}
      <CTASection
        title="Ready to elevate your space?"
        subtitle="Get a personalized quote from our team of surface specialists."
        primaryLabel="Request a Quote"
        primaryHref="/request-quote"
        secondaryLabel="Book a Free Estimate"
        secondaryHref="/showroom"
      />
    </>
  );
}
