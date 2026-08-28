import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createBlogPost, deleteBlogPost } from "@/lib/store/blog";
import { saveFile } from "@/lib/storage";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const title = String(formData.get("title") || "");
  const content = String(formData.get("content") || "");
  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }

  const files = formData.getAll("coverImage").filter((f): f is File => f instanceof File && f.size > 0);
  const stored = await Promise.all(files.map((f) => saveFile(f)));

  const post = await createBlogPost({
    title,
    content,
    excerpt: String(formData.get("excerpt") || content.slice(0, 140)),
    category: String(formData.get("category") || "Interior Design") as never,
    author: String(formData.get("author") || "Our Team"),
    coverImage: stored[0]?.url || "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80",
  });

  return NextResponse.json({ post });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await deleteBlogPost(id);
  return NextResponse.json({ success: true });
}
