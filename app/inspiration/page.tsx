import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Breadcrumbs } from "@/components/CTASection";
import { getBlogPosts } from "@/lib/store/blog";

export const metadata: Metadata = {
  title: "Inspiration — Tile Trends, Design Guides & Material Care",
  description: "Design inspiration, material guides and trend coverage from our team.",
};

export default async function InspirationPage() {
  const blogPosts = await getBlogPosts();

  return (
    <div className="container-lux py-12 md:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Inspiration" }]} />
      <div className="mt-6 mb-12">
        <p className="eyebrow mb-3">Inspiration</p>
        <h1 className="section-heading">Ideas for your next project</h1>
      </div>
      <div className="grid md:grid-cols-3 gap-x-8 gap-y-14">
        {blogPosts.map((post) => (
          <Link key={post.id} href={`/inspiration/${post.slug}`} className="group block">
            <div className="relative aspect-[4/3] overflow-hidden card-hover-reveal mb-4">
              <Image src={post.coverImage} alt={post.title} fill sizes="33vw" className="object-cover" />
            </div>
            <p className="text-xs uppercase tracking-wide text-accent mb-2">{post.category}</p>
            <h3 className="font-serif text-xl group-hover:text-accent transition-colors mb-2">{post.title}</h3>
            <p className="text-sm text-warmgray">{post.excerpt}</p>
          </Link>
        ))}
        {blogPosts.length === 0 && <p className="text-warmgray">No posts yet.</p>}
      </div>
    </div>
  );
}
