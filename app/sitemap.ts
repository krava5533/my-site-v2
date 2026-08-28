import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";
import { getProducts } from "@/lib/store/products";
import { getCollections } from "@/lib/store/collections";
import { getMaterials } from "@/lib/store/materials";
import { getBlogPosts } from "@/lib/store/blog";
import { getAllProjects } from "@/lib/data/all-projects";
import { APPLICATION_LIST } from "@/lib/data/applications";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const staticPages = [
    "", "/products", "/collections", "/materials", "/applications", "/projects",
    "/inspiration", "/about", "/showroom", "/contact", "/request-quote",
    "/upload-project", "/find-your-surface", "/privacy", "/terms", "/accessibility",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const [products, collections, materials, projects, blogPosts] = await Promise.all([
    getProducts(), getCollections(), getMaterials(), getAllProjects(), getBlogPosts(),
  ]);

  const dynamic = [
    ...products.map((p) => ({ url: `${base}/products/${p.slug}`, lastModified: new Date(), priority: 0.6 })),
    ...collections.map((c) => ({ url: `${base}/collections/${c.slug}`, lastModified: new Date(), priority: 0.6 })),
    ...materials.map((m) => ({ url: `${base}/materials/${m.slug}`, lastModified: new Date(), priority: 0.5 })),
    ...APPLICATION_LIST.map((a) => ({ url: `${base}/applications/${a.slug}`, lastModified: new Date(), priority: 0.5 })),
    ...projects.map((p) => ({ url: `${base}/projects/${p.slug}`, lastModified: new Date(), priority: 0.5 })),
    ...blogPosts.map((b) => ({ url: `${base}/inspiration/${b.slug}`, lastModified: new Date(b.publishedAt), priority: 0.4 })),
  ];

  return [...staticPages, ...dynamic];
}
