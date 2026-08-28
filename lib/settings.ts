import { promises as fs } from "fs";
import path from "path";
import { MOCK_MODE } from "@/lib/config";

/**
 * SITE SETTINGS STORE
 * ----------------------------------------------------------------
 * Editable contact info & social links, managed from /admin/settings.
 * In MOCK_MODE, persisted to a local JSON file so changes survive
 * restarts without a database. Falls back to .env.local values
 * (via lib/config.ts) until the admin sets real values.
 *
 * In production mode, swap this for a Prisma-backed `Settings`
 * table (or a single-row config table) — same get/update shape.
 * ----------------------------------------------------------------
 */

const DB_PATH = path.join(process.cwd(), "lib", "mock-store", "settings.json");

export interface SiteSettings {
  phone: string;
  email: string;
  address: string;
  instagram: string;
  pinterest: string;
  houzz: string;
  linkedin: string;
}

const DEFAULTS: SiteSettings = {
  phone: process.env.COMPANY_PHONE || "",
  email: process.env.COMPANY_EMAIL || "",
  address: process.env.COMPANY_ADDRESS || "",
  instagram: "",
  pinterest: "",
  houzz: "",
  linkedin: "",
};

export async function getSettings(): Promise<SiteSettings> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export async function updateSettings(partial: Partial<SiteSettings>): Promise<SiteSettings> {
  if (!MOCK_MODE) {
    throw new Error("MOCK_MODE=false requires a configured Prisma/Postgres connection");
  }
  const current = await getSettings();
  const next = { ...current, ...partial };
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(next, null, 2), "utf-8");
  return next;
}
