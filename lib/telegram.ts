import { Lead } from "@/types";
import { MOCK_MODE } from "@/lib/config";

/**
 * TELEGRAM NOTIFICATION ABSTRACTION
 * ----------------------------------------------------------------
 * Optional — controlled via TELEGRAM_ENABLED. Sends a formatted
 * alert to a Telegram chat whenever a new lead is created. In
 * MOCK_MODE, the message is only logged to the console.
 * ----------------------------------------------------------------
 */

function formatMessage(lead: Lead): string {
  return [
    "🚨 NEW LUXESTONE LEAD",
    "",
    `Lead Type: ${lead.type}`,
    `Name: ${lead.name}`,
    `Phone: ${lead.phone || "—"}`,
    `Email: ${lead.email}`,
    `Company: ${lead.company || "—"}`,
    `Project: ${lead.project || "—"}`,
    `Location: ${lead.location || "—"}`,
    "",
    `Message: ${lead.message || "—"}`,
    "",
    `Source: ${lead.source}`,
  ].join("\n");
}

export async function sendTelegramLeadAlert(lead: Lead): Promise<void> {
  const enabled = process.env.TELEGRAM_ENABLED === "true";
  const text = formatMessage(lead);

  if (MOCK_MODE || !enabled) {
    console.log(`[MOCK TELEGRAM]\n${text}`);
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
}
