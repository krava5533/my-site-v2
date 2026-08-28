import { NextRequest, NextResponse } from "next/server";
import { draftAIReply } from "@/lib/ai-agent";
import { logAgentInteraction } from "@/lib/agent-log";

/**
 * SMS WEBHOOK (Twilio)
 * ----------------------------------------------------------------
 * SETUP:
 * 1. Create a Twilio account, buy a phone number with SMS capability.
 * 2. In the Twilio console, under that number's "Messaging" config,
 *    set "A message comes in" webhook to:
 *      https://yourdomain.com/api/agent/sms   (method: POST)
 * 3. Set TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN in .env.local if you
 *    want to send additional outbound messages beyond the reply
 *    (this route's direct TwiML reply doesn't require them).
 *
 * Twilio sends form-encoded POST data (not JSON) with fields like
 * `From` and `Body`. This route responds with TwiML XML, which
 * Twilio sends back to the customer as the reply text — no separate
 * outbound API call needed for a simple reply.
 * ----------------------------------------------------------------
 */

function escapeXml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const from = String(formData.get("From") || "");
  const body = String(formData.get("Body") || "");

  if (!body) {
    return new NextResponse("<Response></Response>", { headers: { "Content-Type": "text/xml" } });
  }

  const reply = await draftAIReply({ channel: "sms", fromName: from, message: body });

  await logAgentInteraction({
    channel: "sms",
    fromContact: from,
    incomingMessage: body,
    reply,
  });

  const twiml = reply
    ? `<Response><Message>${escapeXml(reply)}</Message></Response>`
    : `<Response></Response>`;

  return new NextResponse(twiml, { headers: { "Content-Type": "text/xml" } });
}
