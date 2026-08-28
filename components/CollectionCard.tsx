import Link from "next/link";
import Image from "next/image";
import { Collection } from "@/types";

export function CollectionCard({ collection }: { collection: Collection }) {
  return (
    <Link href={`/collections/${collection.slug}`} className="group block card-hover-reveal">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={collection.heroImage}
          alt={collection.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deepblack/60 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <h3 className="font-serif text-2xl text-warmwhite">{collection.name}</h3>
          <p className="text-warmwhite/75 text-sm mt-1">{collection.tagline}</p>
        </div>
      </div>
    </Link>
  );
}

export function ProjectCard({ project }: { project: import("@/types").Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block card-hover-reveal">
      <div className="relative aspect-[4/5] overflow-hidden bg-stonebeige/30">
        <Image
          src={project.heroImage}
          alt={project.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="pt-3">
        <p className="text-xs uppercase tracking-wide text-accent">{project.category}</p>
        <h3 className="font-serif text-xl text-charcoal group-hover:text-accent transition-colors">
          {project.name}
        </h3>
        <p className="text-xs text-warmgray mt-1">{project.location}</p>
      </div>
    </Link>
  );
}

export function MaterialCard({ material }: { material: import("@/types").MaterialPage }) {
  return (
    <Link href={`/materials/${material.slug}`} className="group block card-hover-reveal">
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={material.heroImage}
          alt={material.name}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-deepblack/30 group-hover:bg-deepblack/45 transition-colors flex items-center justify-center">
          <h3 className="font-serif text-xl text-warmwhite">{material.name}</h3>
        </div>
      </div>
    </Link>
  );
}
