import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createPortfolioItem, deletePortfolioItem } from "@/lib/portfolio";
import { saveFile } from "@/lib/storage";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const name = String(formData.get("name") || "");
  const location = String(formData.get("location") || "");
  const category = String(formData.get("category") || "");
  const description = String(formData.get("description") || "");
  const materialsUsed = String(formData.get("materialsUsed") || "");

  if (!name || !description) {
    return NextResponse.json({ error: "Project name and description are required" }, { status: 400 });
  }

  const files = formData.getAll("images").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) {
    return NextResponse.json({ error: "Please upload at least one photo" }, { status: 400 });
  }

  const stored = await Promise.all(files.map((f) => saveFile(f)));

  const item = await createPortfolioItem({
    name,
    location,
    category,
    description,
    materialsUsed,
    images: stored.map((f) => f.url),
  });

  return NextResponse.json({ item });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await deletePortfolioItem(id);
  return NextResponse.json({ success: true });
}
