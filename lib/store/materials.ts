import { readStore, writeStore, slugify, uniqueSlug } from "@/lib/content-store";
import { materials as seedMaterials } from "@/lib/data/materials";
import { MaterialPage } from "@/types";
import { MOCK_MODE } from "@/lib/config";

const FILE = "materials.json";

async function readAll(): Promise<MaterialPage[]> {
  return readStore<MaterialPage>(FILE, () => seedMaterials);
}

export async function getMaterials(): Promise<MaterialPage[]> {
  return readAll();
}

export async function getMaterialBySlug(slug: string): Promise<MaterialPage | undefined> {
  const items = await readAll();
  return items.find((m) => m.slug === slug);
}

export interface MaterialInput {
  name: string;
  intro: string;
  characteristics: string[];
  applications: MaterialPage["applications"];
  care: string[];
  heroImage: string;
  gallery: string[];
}

export async function createMaterial(input: MaterialInput): Promise<MaterialPage> {
  if (!MOCK_MODE) throw new Error("MOCK_MODE=false requires a configured Prisma/Postgres connection");
  const items = await readAll();
  const slug = uniqueSlug(slugify(input.name), items.map((m) => m.slug));
  const material: MaterialPage = { slug, ...input } as MaterialPage;
  items.unshift(material);
  await writeStore(FILE, items);
  return material;
}

export async function updateMaterial(slug: string, patch: Partial<MaterialInput>): Promise<MaterialPage | null> {
  if (!MOCK_MODE) throw new Error("MOCK_MODE=false requires a configured Prisma/Postgres connection");
  const items = await readAll();
  const idx = items.findIndex((m) => m.slug === slug);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...patch };
  await writeStore(FILE, items);
  return items[idx];
}

export async function deleteMaterial(slug: string): Promise<void> {
  if (!MOCK_MODE) throw new Error("MOCK_MODE=false requires a configured Prisma/Postgres connection");
  const items = await readAll();
  await writeStore(FILE, items.filter((m) => m.slug !== slug));
}
