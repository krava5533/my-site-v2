import { projects as seedProjects } from "@/lib/data/projects";
import { getPortfolioItems, getPortfolioItemBySlug } from "@/lib/portfolio";
import { Project } from "@/types";

function toProject(item: Awaited<ReturnType<typeof getPortfolioItems>>[number]): Project {
  return {
    id: item.id,
    slug: item.slug,
    name: item.name,
    location: item.location,
    type: item.category,
    category: (item.category as Project["category"]) || "Luxury Residential",
    heroImage: item.images[0] || "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1600&q=80",
    gallery: item.images.slice(1),
    description: item.description,
    materialsUsed: item.materialsUsed ? item.materialsUsed.split(",").map((m) => m.trim()) : [],
    productSlugs: [],
  };
}

export async function getAllProjects(): Promise<Project[]> {
  const portfolio = await getPortfolioItems();
  return [...portfolio.map(toProject), ...seedProjects];
}

export async function getAnyProjectBySlug(slug: string): Promise<Project | undefined> {
  const fromSeed = seedProjects.find((p) => p.slug === slug);
  if (fromSeed) return fromSeed;
  const fromPortfolio = await getPortfolioItemBySlug(slug);
  return fromPortfolio ? toProject(fromPortfolio) : undefined;
}
