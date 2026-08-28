import { NextRequest, NextResponse } from "next/server";
import { draftAIReply } from "@/lib/ai-agent";
import { logAgentInteraction } from "@/lib/agent-log";

/**
 * TELEGRAM BOT WEBHOOK
 * ----------------------------------------------------------------
 * Handles incoming messages sent TO your Telegram bot by customers
 * (separate from lib/telegram.ts, which only sends you outbound
 * lead notifications — this route makes the bot actually reply).
 *
 * SETUP:
 * 1. Create a bot via @BotFather on Telegram, get its token.
 * 2. Set TELEGRAM_BOT_TOKEN in .env.local.
 * 3. Once this site is deployed at a public HTTPS URL, register the
 *    webhook (one-time, run from any terminal with internet access):
 *
 *    curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://yourdomain.com/api/agent/telegram"
 *
 * Telegram will not deliver messages to a localhost URL — this route
 * can only be tested for real once the site is deployed publicly.
 * ----------------------------------------------------------------
 */

export async function POST(req: NextRequest) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN not configured" }, { status: 200 });
  }

  const update = await req.json();
  const message = update?.message;
  const chatId = message?.chat?.id;
  const text = message?.text;

  if (!chatId || !text) {
    return NextResponse.json({ ok: true }); // ignore non-text updates
  }

  const fromName = [message?.from?.first_name, message?.from?.last_name].filter(Boolean).join(" ");

  const reply = await draftAIReply({ channel: "telegram", fromName, message: text });

  if (reply) {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: reply }),
    });
  }

  await logAgentInteraction({
    channel: "telegram",
    fromName,
    fromContact: String(chatId),
    incomingMessage: text,
    reply,
  });

  return NextResponse.json({ ok: true });
}
