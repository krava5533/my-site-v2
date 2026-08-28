import { nanoid } from "nanoid";
import { readStore, writeStore, slugify, uniqueSlug } from "@/lib/content-store";
import { blogPosts as seedPosts } from "@/lib/data/blog";
import { BlogPost } from "@/types";
import { MOCK_MODE } from "@/lib/config";

const FILE = "blog.json";

async function readAll(): Promise<BlogPost[]> {
  return readStore<BlogPost>(FILE, () => seedPosts);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return readAll();
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const items = await readAll();
  return items.find((b) => b.slug === slug);
}

export interface BlogPostInput {
  title: string;
  excerpt: string;
  category: BlogPost["category"];
  coverImage: string;
  content: string;
  author: string;
}

export async function createBlogPost(input: BlogPostInput): Promise<BlogPost> {
  if (!MOCK_MODE) throw new Error("MOCK_MODE=false requires a configured Prisma/Postgres connection");
  const items = await readAll();
  const slug = uniqueSlug(slugify(input.title), items.map((b) => b.slug));
  const post: BlogPost = {
    id: nanoid(8),
    slug,
    publishedAt: new Date().toISOString().slice(0, 10),
    ...input,
  };
  items.unshift(post);
  await writeStore(FILE, items);
  return post;
}

export async function deleteBlogPost(id: string): Promise<void> {
  if (!MOCK_MODE) throw new Error("MOCK_MODE=false requires a configured Prisma/Postgres connection");
  const items = await readAll();
  await writeStore(FILE, items.filter((b) => b.id !== id));
}
