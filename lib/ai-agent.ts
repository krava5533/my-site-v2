import { siteConfig } from "@/lib/config";
import { getSettings } from "@/lib/settings";

/**
 * AI AGENT — REPLY ENGINE
 * ----------------------------------------------------------------
 * Shared by the Telegram bot, SMS webhook, and email auto-reply
 * routes. Calls the Anthropic API to draft a reply as if from the
 * business owner, using real business context (contact info,
 * services, positioning) pulled from lib/settings.ts / lib/config.ts.
 *
 * Requires ANTHROPIC_API_KEY in .env.local. Without it, falls back
 * to a simple canned reply so the webhooks don't hard-fail — this
 * lets you wire up Telegram/Twilio/email providers and test the
 * plumbing before adding a real API key.
 *
 * IMPORTANT: this drafts replies automatically. Review the agent
 * log at /admin/agent regularly, especially at first — an AI reply
 * that overpromises on price, timeline, or scope is a business risk,
 * not just a technical one.
 * ----------------------------------------------------------------
 */

export type AgentChannel = "telegram" | "sms" | "email";

export interface AgentReplyInput {
  channel: AgentChannel;
  fromName?: string;
  message: string;
}

async function buildSystemPrompt(): Promise<string> {
  const settings = await getSettings();
  return `You are a helpful, professional assistant answering customer messages on behalf of ${siteConfig.legalName}, a tile and stone installation contractor.

Business info:
- Services: professional tile and stone installation for kitchens, bathrooms, floors, and custom residential/commercial projects.
- Phone: ${settings.phone || "not yet provided"}
- Email: ${settings.email || "not yet provided"}
- Service area: ${settings.address || "not yet provided"}

Guidelines:
- Be warm, concise, and professional — a few sentences, not an essay.
- Never invent specific prices, exact availability dates, or guarantees you don't have information for. Offer to schedule a free on-site estimate instead.
- If the customer wants to book an estimate, direct them to call/email/message directly and confirm someone will follow up.
- If a message is abusive, spam, or clearly not a customer inquiry, reply with a brief neutral message or no reply at all.
- Never claim to be human if directly asked — you may say you're the business's assistant.`;
}

export async function draftAIReply(input: AgentReplyInput): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    // No AI key configured yet — safe fallback so webhooks still function end-to-end.
    return "Thanks for reaching out! We've received your message and someone from our team will get back to you shortly.";
  }

  try {
    const systemPrompt = await buildSystemPrompt();
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 300,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Channel: ${input.channel}\nFrom: ${input.fromName || "customer"}\nMessage: ${input.message}`,
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error("AI agent: Anthropic API error", await res.text());
      return null;
    }

    const data = await res.json();
    const text = data.content?.find((c: { type: string }) => c.type === "text")?.text;
    return text || null;
  } catch (err) {
    console.error("AI agent: failed to draft reply", err);
    return null;
  }
}
