import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { MOCK_MODE } from "@/lib/config";
import { testimonials as seedTestimonials } from "@/lib/data/blog";

/**
 * TESTIMONIALS STORE
 * ----------------------------------------------------------------
 * Admin-managed customer reviews, shown on the homepage. Starts
 * seeded with the demo testimonials from lib/data/blog.ts (clearly
 * marked as demo) — the admin can delete those and add real ones
 * from /admin/testimonials at any time.
 * ----------------------------------------------------------------
 */

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  demo?: boolean;
  createdAt: string;
}

const DB_PATH = path.join(process.cwd(), "lib", "mock-store", "testimonials.json");

async function readAll(): Promise<Testimonial[]> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw) as Testimonial[];
  } catch {
    // First run — seed with demo testimonials so the homepage isn't empty
    const seeded: Testimonial[] = seedTestimonials.map((t) => ({
      id: t.id,
      quote: t.quote,
      author: t.author,
      role: t.role,
      demo: true,
      createdAt: new Date().toISOString(),
    }));
    await writeAll(seeded);
    return seeded;
  }
}

async function writeAll(items: Testimonial[]): Promise<void> {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(items, null, 2), "utf-8");
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return readAll();
}

export async function createTestimonial(input: {
  quote: string;
  author: string;
  role: string;
}): Promise<Testimonial> {
  if (!MOCK_MODE) throw new Error("MOCK_MODE=false requires a configured Prisma/Postgres connection");
  const items = await readAll();
  const testimonial: Testimonial = { id: nanoid(8), createdAt: new Date().toISOString(), ...input };
  items.unshift(testimonial);
  await writeAll(items);
  return testimonial;
}

export async function deleteTestimonial(id: string): Promise<void> {
  if (!MOCK_MODE) throw new Error("MOCK_MODE=false requires a configured Prisma/Postgres connection");
  const items = await readAll();
  await writeAll(items.filter((t) => t.id !== id));
}
