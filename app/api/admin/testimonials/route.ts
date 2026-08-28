import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createTestimonial, deleteTestimonial } from "@/lib/testimonials";
import { z } from "zod";

const schema = z.object({
  quote: z.string().min(5, "Please enter the review text"),
  author: z.string().min(1, "Please enter a name"),
  role: z.string().optional().default(""),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid submission" }, { status: 400 });
  }

  const testimonial = await createTestimonial(parsed.data);
  return NextResponse.json({ testimonial });
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await deleteTestimonial(id);
  return NextResponse.json({ success: true });
}
