import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createCollection, deleteCollection } from "@/lib/store/collections";
import { saveFile } from "@/lib/storage";

function parseListField(value: FormDataEntryValue | null): string[] {
  if (!value) return [];
  return String(value).split(",").map((s) => s.trim()).filter(Boolean);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const name = String(formData.get("name") || "");
  const description = String(formData.get("description") || "");
  if (!name || !description) {
    return NextResponse.json({ error: "Name and description are required" }, { status: 400 });
  }

  const files = formData.getAll("heroImage").filter((f): f is File => f instanceof File && f.size > 0);
  const stored = await Promise.all(files.map((f) => saveFile(f)));

  const collection = await createCollection({
    name,
    description,
    tagline: String(formData.get("tagline") || ""),
    heroImage: stored[0]?.url || "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1600&q=80",
    colors: parseListField(formData.get("colors")),
    finishes: parseListField(formData.get("finishes")),
    sizes: parseListField(formData.get("sizes")),
    applications: parseListField(formData.get("applications")) as never,
  });

  return NextResponse.json({ collection });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await deleteCollection(id);
  return NextResponse.json({ success: true });
}
