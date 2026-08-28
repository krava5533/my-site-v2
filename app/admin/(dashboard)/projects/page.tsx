import Link from "next/link";
import { projects } from "@/lib/data/projects";
import { getPortfolioItems } from "@/lib/portfolio";
import PortfolioManager from "@/components/PortfolioManager";

export default async function AdminProjectsPage() {
  const portfolioItems = await getPortfolioItems();

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Projects</h1>

      <PortfolioManager initial={portfolioItems} />

      <div className="mt-16 pt-10 border-t border-warmgray/15">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl">Demo Sample Projects</h2>
          <span className="text-xs text-warmgray bg-stonebeige/40 px-3 py-1.5">
            {projects.length} demo projects
          </span>
        </div>
        <p className="text-sm text-warmgray bg-stonebeige/25 p-4 mb-6 max-w-2xl">
          These are placeholder projects from <code>lib/data/projects.ts</code> shown for
          reference — feel free to delete this file&rsquo;s contents once you have enough real
          uploaded projects above.
        </p>
        <div className="bg-white border border-warmgray/15 overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-warmgray/15 text-left text-xs uppercase tracking-wide text-warmgray">
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Location</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-warmgray/10">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3 text-warmgray">{p.location}</td>
                  <td className="p-3">
                    <Link href={`/projects/${p.slug}`} target="_blank" className="text-xs text-accent underline">
                      View live &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
