import { NextRequest, NextResponse } from "next/server";
import { draftChatReply, extractPhoneNumber, ChatMessage, ChatImage } from "@/lib/ai-agent";
import { extractProjectSignals, computeEstimate } from "@/lib/estimate";
import { createLead, addLeadNote } from "@/lib/leads";

export async function POST(req: NextRequest) {
  try {
    const { messages, leadId, image } = (await req.json()) as {
      messages: ChatMessage[];
      leadId?: string;
      image?: ChatImage;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Missing messages" }, { status: 400 });
    }

    // Look across the whole conversation for room type + rough size, and
    // compute a ballpark estimate if we have enough to go on.
    const userText = messages.filter((m) => m.role === "user").map((m) => m.content).join(" \n ");
    const signals = extractProjectSignals(userText);
    const estimate = await computeEstimate(signals);
    const estimateContext = estimate
      ? `$${estimate.low.toLocaleString()}–$${estimate.high.toLocaleString()} for approximately ${estimate.sqft} sq ft of ${estimate.roomType} tile installation.`
      : undefined;

    const reply = await draftChatReply(messages, estimateContext, image);

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
        project: estimate ? `${estimate.roomType} (~${estimate.sqft} sq ft)` : undefined,
        message: [
          userText,
          image ? "\n\n(Customer shared a photo of their space during the chat.)" : "",
          estimate ? `\n\nAI ballpark estimate given: $${estimate.low.toLocaleString()}–$${estimate.high.toLocaleString()}` : "",
        ].join(""),
        data: { transcript: messages, estimate },
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
