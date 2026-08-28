import { NextRequest, NextResponse } from "next/server";
import { projectUploadSchema } from "@/lib/validators";
import { createLead } from "@/lib/leads";
import { saveFile } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const raw = Object.fromEntries(formData.entries());
    const parsed = projectUploadSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid submission" },
        { status: 400 }
      );
    }

    const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
    const stored = await Promise.all(files.map((f) => saveFile(f)));

    const lead = await createLead({
      type: "Project Upload",
      source: "Upload Project",
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company,
      project: parsed.data.projectType,
      location: parsed.data.projectLocation,
      message: parsed.data.message,
      data: parsed.data,
      files: stored.map((f) => f.url),
    });

    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to submit project. Please try again." }, { status: 500 });
  }
}
