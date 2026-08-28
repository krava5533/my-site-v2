import { nanoid } from "nanoid";
import { readStore, writeStore, slugify, uniqueSlug } from "@/lib/content-store";
import { products as seedProducts } from "@/lib/data/products";
import { Product } from "@/types";
import { MOCK_MODE } from "@/lib/config";

const FILE = "products.json";

async function readAll(): Promise<Product[]> {
  return readStore<Product>(FILE, () => seedProducts);
}

export async function getProducts(): Promise<Product[]> {
  return readAll();
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const items = await readAll();
  return items.find((p) => p.slug === slug);
}

export async function getProductsByCollection(collectionSlug: string): Promise<Product[]> {
  const items = await readAll();
  return items.filter((p) => p.collectionSlug === collectionSlug);
}

export async function getRelatedProducts(product: Product, count = 4): Promise<Product[]> {
  const items = await readAll();
  return items
    .filter((p) => p.id !== product.id && (p.material === product.material || p.collectionSlug === product.collectionSlug))
    .slice(0, count);
}

export interface ProductInput {
  name: string;
  collectionSlug: string;
  material: Product["material"];
  color: string;
  finish: Product["finish"];
  sizes: string[];
  thicknessMm: number[];
  applications: Product["applications"];
  description: string;
  availability: Product["availability"];
  images: string[];
  featured?: boolean;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  if (!MOCK_MODE) throw new Error("MOCK_MODE=false requires a configured Prisma/Postgres connection");
  const items = await readAll();
  const slug = uniqueSlug(slugify(input.name), items.map((p) => p.slug));
  const product: Product = {
    id: nanoid(8),
    slug,
    technicalSpecs: [],
    documents: [],
    ...input,
  };
  items.unshift(product);
  await writeStore(FILE, items);
  return product;
}

export async function updateProduct(id: string, patch: Partial<ProductInput>): Promise<Product | null> {
  if (!MOCK_MODE) throw new Error("MOCK_MODE=false requires a configured Prisma/Postgres connection");
  const items = await readAll();
  const idx = items.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...patch };
  await writeStore(FILE, items);
  return items[idx];
}

export async function deleteProduct(id: string): Promise<void> {
  if (!MOCK_MODE) throw new Error("MOCK_MODE=false requires a configured Prisma/Postgres connection");
  const items = await readAll();
  await writeStore(FILE, items.filter((p) => p.id !== id));
}
