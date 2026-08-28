"use client";

import { useState, useMemo } from "react";
import { ProjectCard } from "@/components/CollectionCard";
import { Project } from "@/types";

const CATEGORIES = [
  "All", "Luxury Residential", "Kitchens", "Bathrooms", "Living Spaces", "Custom Homes",
  "Commercial", "Hospitality", "Restaurants", "Hotels", "Outdoor",
];

export default function ProjectsBrowser({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState("All");

  const filtered = useMemo(
    () => (category === "All" ? projects : projects.filter((p) => p.category === category)),
    [projects, category]
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`text-xs uppercase tracking-wide px-4 py-2 border transition-colors ${
              category === c ? "bg-charcoal text-warmwhite border-charcoal" : "border-warmgray/30 text-charcoal hover:border-charcoal"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      {filtered.length === 0 && <p className="text-warmgray py-16 text-center">No projects in this category yet.</p>}
    </div>
  );
}
