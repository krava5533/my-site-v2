import { getBlogPosts } from "@/lib/store/blog";
import BlogManager from "@/components/BlogManager";

export default async function AdminInspirationPage() {
  const posts = await getBlogPosts();

  return (
    <div>
      <h1 className="font-serif text-3xl mb-2">Inspiration / Blog</h1>
      <p className="text-sm text-warmgray mb-8 max-w-xl">
        Posts you publish here appear at /inspiration.
      </p>
      <BlogManager initial={posts} />
    </div>
  );
}
