import { getSettings } from "@/lib/settings";

/**
 * ROUGH ESTIMATE ENGINE
 * ----------------------------------------------------------------
 * Deliberately simple: extracts a room type and an approximate
 * square footage from free-text chat messages, then multiplies by
 * a $/sqft range the business owner sets in /admin/settings.
 *
 * This is intentionally a rough, non-binding ballpark — the chat
 * widget always frames it as needing an in-person visit to confirm.
 * The LLM never does the arithmetic itself (unreliable); this module
 * computes the number, and the AI just presents it in conversation.
 * ----------------------------------------------------------------
 */

export type RoomType = "kitchen" | "bathroom" | "floor" | "outdoor" | "other";

const ROOM_KEYWORDS: Record<Exclude<RoomType, "other">, string[]> = {
  kitchen: ["kitchen", "backsplash"],
  bathroom: ["bathroom", "shower", "bath "],
  floor: ["floor", "flooring", "living room", "hallway", "basement"],
  outdoor: ["outdoor", "patio", "backyard", "deck", "pool"],
};

export interface ProjectSignals {
  roomType: RoomType | null;
  sqft: number | null;
}

export function extractProjectSignals(text: string): ProjectSignals {
  const lower = text.toLowerCase();

  let roomType: RoomType | null = null;
  for (const [room, keywords] of Object.entries(ROOM_KEYWORDS) as [Exclude<RoomType, "other">, string[]][]) {
    if (keywords.some((k) => lower.includes(k))) {
      roomType = room;
      break;
    }
  }

  // Matches "200 sqft", "200 sq ft", "200 square feet", "20x10" (multiplies), "200 ft2"
  let sqft: number | null = null;
  const sqftMatch = lower.match(/(\d{2,4})\s*(sq\s?\.?\s?ft|square feet|sqft|ft2)/);
  if (sqftMatch) {
    sqft = parseInt(sqftMatch[1], 10);
  } else {
    const dimsMatch = lower.match(/(\d{1,3})\s*(?:x|by)\s*(\d{1,3})/);
    if (dimsMatch) {
      sqft = parseInt(dimsMatch[1], 10) * parseInt(dimsMatch[2], 10);
    }
  }

  return { roomType, sqft };
}

export interface EstimateRange {
  low: number;
  high: number;
  sqft: number;
  roomType: RoomType;
}

export async function computeEstimate(signals: ProjectSignals): Promise<EstimateRange | null> {
  if (!signals.sqft || signals.sqft <= 0) return null;
  const roomType = signals.roomType || "other";
  const settings = await getSettings();

  const rateLow = settings.pricing?.[roomType]?.low ?? DEFAULT_RATES[roomType].low;
  const rateHigh = settings.pricing?.[roomType]?.high ?? DEFAULT_RATES[roomType].high;

  return {
    low: Math.round(signals.sqft * rateLow),
    high: Math.round(signals.sqft * rateHigh),
    sqft: signals.sqft,
    roomType,
  };
}

// Fallback $/sqft ranges (materials + labor, ballpark) — the business owner
// should replace these with real numbers in /admin/settings.
export const DEFAULT_RATES: Record<RoomType, { low: number; high: number }> = {
  kitchen: { low: 12, high: 25 },
  bathroom: { low: 15, high: 30 },
  floor: { low: 8, high: 18 },
  outdoor: { low: 10, high: 22 },
  other: { low: 10, high: 20 },
};
