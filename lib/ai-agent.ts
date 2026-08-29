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
  return `You're chatting with customers on behalf of ${siteConfig.legalName}, a tile and stone installation contractor. Talk like a friendly, knowledgeable person on the team would — warm, casual, genuinely helpful. Use contractions, keep it natural, avoid sounding like a form letter or a corporate bot. Short messages, real conversation, not a wall of text.

Business info:
- Services: professional tile and stone installation for kitchens, bathrooms, floors, and custom residential/commercial projects.
- Phone: ${settings.phone || "not yet provided"}
- Email: ${settings.email || "not yet provided"}
- Service area: ${settings.address || "not yet provided"}

Guidelines:
- Be warm and concise — a couple of sentences, not an essay.
- Never invent specific prices, exact availability dates, or guarantees beyond what you're explicitly given in this conversation. If you're handed a computed ballpark estimate, present that — otherwise offer to schedule a free on-site estimate instead.
- If the customer wants to book an estimate, direct them to call/email/message directly and confirm someone will follow up.
- If a message is abusive, spam, or clearly not a customer inquiry, reply with a brief neutral message or no reply at all.
- If someone directly asks whether you're a real person, be honest that you're the business's assistant — but don't volunteer that unprompted, and otherwise just talk like a normal, friendly human would.`;
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

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const CHAT_SYSTEM_SUFFIX = `

You are running as the on-site chat widget (channel: website chat). Your job is to warmly collect, over a few natural turns, whatever of the following the customer hasn't already given: their name, phone number, project type (kitchen/bathroom/floor/outdoor/other), and a rough room size (ask for square footage, or dimensions like "12 by 10", if they haven't mentioned it). Ask only ONE or two missing things per message — don't interrogate, and don't repeat questions they've already answered.

If the customer shares a photo of their space, take a genuine look at it — the lighting, existing colors, layout, style — and give specific, grounded suggestions: what material (e.g. marble, porcelain, natural stone, quartz, terrazzo, travertine, large-format slabs), color, finish, and layout (e.g. diagonal, large-format to minimize grout lines, book-matched) would suit that particular room. Keep it a few sentences, not a lecture, and make it feel like a real opinion, not a generic list.

If you're given a "Computed estimate" fact below, weave it into your next reply naturally and warmly — present it as a rough ballpark ($X–$Y), and always mention that the final number depends on an in-person visit. Don't do your own math — only use a number you're explicitly handed.

Once you have at least a name and phone number, let them know a specialist will follow up soon to confirm details and book a free on-site visit, and stop pressing for more information unless they offer it. Keep every message to 1-3 short, natural sentences.`;

export interface ChatImage {
  mediaType: string;
  data: string; // base64, no "data:image/..;base64," prefix
}

export async function draftChatReply(
  messages: ChatMessage[],
  estimateContext?: string,
  image?: ChatImage
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return image
      ? "Thanks for the photo! Once you share your name and phone number, a specialist can take a closer look and follow up with real suggestions."
      : "Thanks! Could you share your name and phone number so a specialist can follow up with a real estimate?";
  }

  try {
    const baseSystemPrompt = await buildSystemPrompt();
    const contextBlock = estimateContext ? `\n\nComputed estimate: ${estimateContext}` : "";

    const anthropicMessages = messages.map((m, i) => {
      const isLast = i === messages.length - 1;
      if (isLast && image && m.role === "user") {
        return {
          role: m.role,
          content: [
            { type: "image", source: { type: "base64", media_type: image.mediaType, data: image.data } },
            { type: "text", text: m.content || "Here's a photo of my space." },
          ],
        };
      }
      return { role: m.role, content: m.content };
    });

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 350,
        system: baseSystemPrompt + CHAT_SYSTEM_SUFFIX + contextBlock,
        messages: anthropicMessages,
      }),
    });

    if (!res.ok) {
      console.error("AI agent: Anthropic API error", await res.text());
      return "Sorry, I'm having trouble right now — could you leave your name and phone number and we'll follow up shortly?";
    }

    const data = await res.json();
    const text = data.content?.find((c: { type: string }) => c.type === "text")?.text;
    return text || "Could you tell me a bit more about your project?";
  } catch (err) {
    console.error("AI agent: failed to draft chat reply", err);
    return "Sorry, I'm having trouble right now — could you leave your name and phone number and we'll follow up shortly?";
  }
}

/** Very light-touch phone number detector — good enough to know when to save a lead. */
export function extractPhoneNumber(text: string): string | null {
  const match = text.match(/(\+?\d[\d\s().-]{7,}\d)/);
  return match ? match[0].trim() : null;
}
