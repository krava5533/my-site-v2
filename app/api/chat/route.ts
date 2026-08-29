import { NextRequest, NextResponse } from "next/server";
import { draftChatReply, extractPhoneNumber, ChatMessage } from "@/lib/ai-agent";
import { createLead, addLeadNote } from "@/lib/leads";

export async function POST(req: NextRequest) {
  try {
    const { messages, leadId } = (await req.json()) as {
      messages: ChatMessage[];
      leadId?: string;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Missing messages" }, { status: 400 });
    }

    const reply = await draftChatReply(messages);

    // Look at everything the user has typed so far for a phone number.
    const userText = messages.filter((m) => m.role === "user").map((m) => m.content).join(" \n ");
    const phone = extractPhoneNumber(userText);

    let newLeadId = leadId;

    if (phone && !leadId) {
      // First time we see a phone number in this conversation — save it as a lead.
      const firstLine = messages.find((m) => m.role === "user")?.content || "";
      const nameGuess = firstLine.split(/[.,!\n]/)[0]?.slice(0, 60) || "Website visitor";
      const lead = await createLead({
        type: "General Contact",
        source: "Homepage",
        name: nameGuess,
        email: "",
        phone,
        message: userText,
        data: { transcript: messages },
      });
      newLeadId = lead.id;
    } else if (leadId) {
      // Ongoing conversation — append the latest exchange as a note.
      const lastUser = [...messages].reverse().find((m) => m.role === "user");
      if (lastUser) {
        await addLeadNote(leadId, `Chat: ${lastUser.content}`);
      }
    }

    return NextResponse.json({ reply, leadId: newLeadId });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
