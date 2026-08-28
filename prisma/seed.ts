/**
 * Seeds a real Postgres database (MOCK_MODE=false) with the same
 * 20 products / 8 collections / 10 projects / 10 blog posts used
 * as mock data in dev — swap these in for real catalog data anytime.
 *
 * Run with: npm run db:seed
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { products } from "../lib/data/products";
import { collections } from "../lib/data/collections";
import { materials } from "../lib/data/materials";
import { projects } from "../lib/data/projects";
import { blogPosts } from "../lib/data/blog";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding LuxeStone database...");

  const adminEmail = process.env.ADMIN_SEED_EMAIL || "admin@luxestone.example";
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || "change-me-immediately";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "LuxeStone Admin",
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 10),
      role: "ADMIN",
    },
  });

  const collectionIdBySlug: Record<string, string> = {};
  for (const c of collections) {
    const created = await prisma.collection.upsert({
      where: { slug: c.slug },
      update: {},
      create: {
        slug: c.slug,
        name: c.name,
        tagline: c.tagline,
        description: c.description,
        heroImage: c.heroImage,
        colors: c.colors,
        finishes: c.finishes,
        sizes: c.sizes,
        applications: c.applications,
      },
    });
    collectionIdBySlug[c.slug] = created.id;
  }

  for (const m of materials) {
    await prisma.material.upsert({
      where: { slug: m.slug },
      update: {},
      create: {
        slug: m.slug,
        name: m.name,
        intro: m.intro,
        characteristics: m.characteristics,
        applications: m.applications,
        care: m.care,
        heroImage: m.heroImage,
        gallery: m.gallery,
      },
    });
  }

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name,
        collectionId: collectionIdBySlug[p.collectionSlug],
        material: p.material,
        color: p.color,
        finish: p.finish,
        sizes: p.sizes,
        thicknessMm: p.thicknessMm,
        applications: p.applications,
        description: p.description,
        technicalSpecs: p.technicalSpecs,
        documents: p.documents,
        images: p.images,
        availability: p.availability,
        featured: p.featured ?? false,
      },
    });
  }

  for (const proj of projects) {
    await prisma.project.upsert({
      where: { slug: proj.slug },
      update: {},
      create: {
        slug: proj.slug,
        name: proj.name,
        location: proj.location,
        type: proj.type,
        designer: proj.designer,
        architect: proj.architect,
        contractor: proj.contractor,
        category: proj.category,
        heroImage: proj.heroImage,
        gallery: proj.gallery,
        description: proj.description,
        materialsUsed: proj.materialsUsed,
        productSlugs: proj.productSlugs,
      },
    });
  }

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        coverImage: post.coverImage,
        content: post.content,
        author: post.author,
        publishedAt: new Date(post.publishedAt),
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
