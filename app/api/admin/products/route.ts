import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createProduct, updateProduct, deleteProduct } from "@/lib/store/products";
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

  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  const stored = await Promise.all(files.map((f) => saveFile(f)));

  const product = await createProduct({
    name,
    description,
    collectionSlug: String(formData.get("collectionSlug") || ""),
    material: String(formData.get("material") || "Porcelain") as never,
    color: String(formData.get("color") || ""),
    finish: String(formData.get("finish") || "Matte") as never,
    sizes: parseListField(formData.get("sizes")),
    thicknessMm: parseListField(formData.get("thicknessMm")).map(Number).filter((n) => !isNaN(n)),
    applications: parseListField(formData.get("applications")) as never,
    availability: String(formData.get("availability") || "In Stock") as never,
    images: stored.length > 0 ? stored.map((f) => f.url) : ["https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80"],
    featured: formData.get("featured") === "on",
  });

  return NextResponse.json({ product });
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { id, ...patch } = body;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const product = await updateProduct(id, patch);
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await deleteProduct(id);
  return NextResponse.json({ success: true });
}
