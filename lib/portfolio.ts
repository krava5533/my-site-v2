import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { MOCK_MODE } from "@/lib/config";

/**
 * PORTFOLIO STORE
 * ----------------------------------------------------------------
 * Admin-uploaded project photos, added from /admin/projects. These
 * are merged with the seed project gallery in lib/data/projects.ts
 * everywhere projects are displayed (homepage, /projects, /projects/[slug]).
 * ----------------------------------------------------------------
 */

export interface PortfolioItem {
  id: string;
  slug: string;
  name: string;
  location: string;
  category: string;
  description: string;
  materialsUsed: string;
  images: string[]; // local URLs under /uploads
  createdAt: string;
}

const DB_PATH = path.join(process.cwd(), "lib", "mock-store", "portfolio.json");

async function readAll(): Promise<PortfolioItem[]> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw) as PortfolioItem[];
  } catch {
    return [];
  }
}

async function writeAll(items: PortfolioItem[]): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(items, null, 2), "utf-8");
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  return readAll();
}

export async function getPortfolioItemBySlug(slug: string): Promise<PortfolioItem | undefined> {
  const items = await readAll();
  return items.find((i) => i.slug === slug);
}

export async function createPortfolioItem(input: {
  name: string;
  location: string;
  category: string;
  description: string;
  materialsUsed: string;
  images: string[];
}): Promise<PortfolioItem> {
  if (!MOCK_MODE) throw new Error("MOCK_MODE=false requires a configured Prisma/Postgres connection");
  const items = await readAll();
  let slug = slugify(input.name) || nanoid(6);
  // ensure uniqueness
  let suffix = 1;
  const base = slug;
  while (items.some((i) => i.slug === slug)) {
    slug = `${base}-${++suffix}`;
  }
  const item: PortfolioItem = { id: nanoid(8), slug, createdAt: new Date().toISOString(), ...input };
  items.unshift(item);
  await writeAll(items);
  return item;
}

export async function deletePortfolioItem(id: string): Promise<void> {
  if (!MOCK_MODE) throw new Error("MOCK_MODE=false requires a configured Prisma/Postgres connection");
  const items = await readAll();
  await writeAll(items.filter((i) => i.id !== id));
}
