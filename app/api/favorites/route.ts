import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createLead } from "@/lib/leads";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
  items: z.array(z.string()).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid submission" },
        { status: 400 }
      );
    }

    const lead = await createLead({
      type: "General Contact",
      source: "Product",
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      message: `Selected favorites: ${parsed.data.items.join(", ")}. ${parsed.data.message || ""}`,
      data: parsed.data,
    });

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to send selection. Please try again." }, { status: 500 });
  }
}
