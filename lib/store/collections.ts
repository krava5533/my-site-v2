import { nanoid } from "nanoid";
import { readStore, writeStore, slugify, uniqueSlug } from "@/lib/content-store";
import { collections as seedCollections } from "@/lib/data/collections";
import { Collection } from "@/types";
import { MOCK_MODE } from "@/lib/config";

const FILE = "collections.json";

async function readAll(): Promise<Collection[]> {
  return readStore<Collection>(FILE, () => seedCollections);
}

export async function getCollections(): Promise<Collection[]> {
  return readAll();
}

export async function getCollectionBySlug(slug: string): Promise<Collection | undefined> {
  const items = await readAll();
  return items.find((c) => c.slug === slug);
}

export interface CollectionInput {
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  colors: string[];
  finishes: string[];
  sizes: string[];
  applications: Collection["applications"];
}

export async function createCollection(input: CollectionInput): Promise<Collection> {
  if (!MOCK_MODE) throw new Error("MOCK_MODE=false requires a configured Prisma/Postgres connection");
  const items = await readAll();
  const slug = uniqueSlug(slugify(input.name), items.map((c) => c.slug));
  const collection: Collection = {
    id: nanoid(8),
    slug,
    productSlugs: [],
    relatedProjectSlugs: [],
    ...input,
  };
  items.unshift(collection);
  await writeStore(FILE, items);
  return collection;
}

export async function updateCollection(id: string, patch: Partial<CollectionInput>): Promise<Collection | null> {
  if (!MOCK_MODE) throw new Error("MOCK_MODE=false requires a configured Prisma/Postgres connection");
  const items = await readAll();
  const idx = items.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...patch };
  await writeStore(FILE, items);
  return items[idx];
}

export async function deleteCollection(id: string): Promise<void> {
  if (!MOCK_MODE) throw new Error("MOCK_MODE=false requires a configured Prisma/Postgres connection");
  const items = await readAll();
  await writeStore(FILE, items.filter((c) => c.id !== id));
}
