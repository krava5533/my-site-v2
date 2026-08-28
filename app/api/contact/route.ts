import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validators";
import { createLead } from "@/lib/leads";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const raw = Object.fromEntries(formData.entries());
    const parsed = contactSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid submission" },
        { status: 400 }
      );
    }

    const lead = await createLead({
      type: "General Contact",
      source: "Contact",
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      message: parsed.data.message,
      data: parsed.data,
    });

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to send message. Please try again." }, { status: 500 });
  }
}
