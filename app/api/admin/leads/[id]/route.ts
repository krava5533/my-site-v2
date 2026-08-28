import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateLeadStatus, addLeadNote } from "@/lib/leads";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  if (body.status) {
    const lead = await updateLeadStatus(params.id, body.status);
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    return NextResponse.json({ lead });
  }

  if (body.note) {
    const lead = await addLeadNote(params.id, body.note);
    if (!lead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    return NextResponse.json({ lead });
  }

  return NextResponse.json({ error: "No valid update provided" }, { status: 400 });
}
