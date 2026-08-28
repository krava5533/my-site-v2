import { NextRequest, NextResponse } from "next/server";
import { appointmentSchema } from "@/lib/validators";
import { createLead } from "@/lib/leads";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const raw = Object.fromEntries(formData.entries());
    const parsed = appointmentSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid submission" },
        { status: 400 }
      );
    }

    const lead = await createLead({
      type: "Estimate Appointment",
      source: "Estimate",
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      project: parsed.data.projectType,
      message: `Preferred: ${parsed.data.preferredDate} at ${parsed.data.preferredTime}. ${parsed.data.message || ""}`,
      data: parsed.data,
    });

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to book appointment. Please try again." }, { status: 500 });
  }
}
