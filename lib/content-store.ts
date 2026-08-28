import { promises as fs } from "fs";
import path from "path";

/**
 * GENERIC CONTENT STORE
 * ----------------------------------------------------------------
 * Shared read/write helpers for JSON-file-backed content collections
 * (products, collections, materials, blog posts, etc). Each content
 * type wraps this with its own typed module in lib/store/*.ts.
 *
 * First read seeds the store from the type's original demo data in
 * lib/data/*.ts so the site isn't empty on first run — after that,
 * the JSON file is the source of truth and the admin dashboard reads
 * and writes through these same functions.
 * ----------------------------------------------------------------
 */

function storePath(file: string) {
  return path.join(process.cwd(), "storage", "mock-store", file);
}

export async function readStore<T>(file: string, seed: () => T[]): Promise<T[]> {
  const p = storePath(file);
  try {
    const raw = await fs.readFile(p, "utf-8");
    return JSON.parse(raw) as T[];
  } catch {
    const seeded = seed();
    await writeStore(file, seeded);
    return seeded;
  }
}

export async function writeStore<T>(file: string, items: T[]): Promise<void> {
  const p = storePath(file);
  await fs.mkdir(path.dirname(p), { recursive: true });
  await fs.writeFile(p, JSON.stringify(items, null, 2), "utf-8");
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function uniqueSlug(base: string, existing: string[]): string {
  let slug = base || "item";
  let suffix = 1;
  while (existing.includes(slug)) {
    slug = `${base}-${++suffix}`;
  }
  return slug;
}
