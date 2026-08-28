import { NextRequest, NextResponse } from "next/server";
import { draftAIReply } from "@/lib/ai-agent";
import { logAgentInteraction } from "@/lib/agent-log";
import { sendEmail } from "@/lib/email";

/**
 * EMAIL WEBHOOK (inbound)
 * ----------------------------------------------------------------
 * Payload format varies by provider — this route is written for
 * Resend's inbound email webhook shape. If you use a different
 * provider (SendGrid Inbound Parse, Postmark, Mailgun), you'll need
 * to adjust the field names below to match their payload.
 *
 * SETUP (Resend):
 * 1. Set up inbound email receiving for your domain in the Resend
 *    dashboard, and point the webhook to:
 *      https://yourdomain.com/api/agent/email
 * 2. Set RESEND_API_KEY and EMAIL_PROVIDER=resend in .env.local so
 *    the reply can be sent back out via lib/email.ts.
 *
 * This is the least commonly self-hosted of the three channels —
 * inbound email routing usually requires DNS/MX record changes on
 * your domain, which is a bigger setup step than Telegram or SMS.
 * ----------------------------------------------------------------
 */

export async function POST(req: NextRequest) {
  const payload = await req.json();

  // Resend inbound webhook shape: { from, subject, text, ... } — adjust for your provider.
  const from = payload?.from || payload?.sender || "";
  const text = payload?.text || payload?.plain || payload?.body || "";

  if (!from || !text) {
    return NextResponse.json({ ok: true }); // nothing usable in this payload
  }

  const reply = await draftAIReply({ channel: "email", fromName: from, message: text });

  if (reply) {
    await sendEmail({
      to: from,
      subject: "Re: your message",
      html: `<p>${reply.replace(/\n/g, "<br/>")}</p>`,
    });
  }

  await logAgentInteraction({
    channel: "email",
    fromContact: from,
    incomingMessage: text,
    reply,
  });

  return NextResponse.json({ ok: true });
}
