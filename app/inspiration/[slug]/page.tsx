import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Breadcrumbs, CTASection } from "@/components/CTASection";
import { getBlogPosts, getBlogPostBySlug } from "@/lib/store/blog";
import { blogPosts as seedPosts } from "@/lib/data/blog";
import { format } from "date-fns";

export function generateStaticParams() {
  return seedPosts.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    author: { "@type": "Organization", name: post.author },
    datePublished: post.publishedAt,
  };

  let publishedLabel = post.publishedAt;
  try {
    publishedLabel = format(new Date(post.publishedAt), "MMMM d, yyyy");
  } catch {
    // keep raw string if the date can't be parsed
  }

  return (
    <article className="container-lux py-12 md:py-16 max-w-3xl">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Inspiration", href: "/inspiration" }, { label: post.title }]} />
      <p className="text-xs uppercase tracking-wide text-accent mt-6 mb-3">{post.category}</p>
      <h1 className="font-serif text-3xl md:text-5xl mb-4 leading-tight">{post.title}</h1>
      <p className="text-sm text-warmgray mb-8">{post.author} &middot; {publishedLabel}</p>
      <div className="relative aspect-[16/9] mb-10">
        <Image src={post.coverImage} alt={post.title} fill sizes="768px" className="object-cover" />
      </div>
      <div className="prose-lux text-charcoal leading-relaxed space-y-6 text-base whitespace-pre-line">
        <p>{post.content}</p>
      </div>

      <div className="mt-16">
        <CTASection
          title="Ready to explore materials for your project?"
          primaryLabel="Browse Products"
          primaryHref="/products"
          secondaryLabel="Request a Quote"
          secondaryHref="/request-quote"
        />
      </div>
    </article>
  );
}
