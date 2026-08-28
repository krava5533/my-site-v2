import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createMaterial, deleteMaterial } from "@/lib/store/materials";
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
  const intro = String(formData.get("intro") || "");
  if (!name || !intro) {
    return NextResponse.json({ error: "Name and description are required" }, { status: 400 });
  }

  const files = formData.getAll("heroImage").filter((f): f is File => f instanceof File && f.size > 0);
  const stored = await Promise.all(files.map((f) => saveFile(f)));

  const material = await createMaterial({
    name: name as never,
    intro,
    characteristics: parseListField(formData.get("characteristics")),
    applications: parseListField(formData.get("applications")) as never,
    care: parseListField(formData.get("care")),
    heroImage: stored[0]?.url || "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1400&q=80",
    gallery: stored.slice(1).map((f) => f.url),
  });

  return NextResponse.json({ material });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await req.json();
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  await deleteMaterial(slug);
  return NextResponse.json({ success: true });
}
