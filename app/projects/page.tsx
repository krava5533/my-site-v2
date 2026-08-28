import { Breadcrumbs } from "@/components/CTASection";
import ProjectsBrowser from "@/components/ProjectsBrowser";
import { getAllProjects } from "@/lib/data/all-projects";

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="container-lux py-12 md:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Projects" }]} />
      <div className="mt-6 mb-10">
        <p className="eyebrow mb-3">Project Gallery</p>
        <h1 className="section-heading">Real spaces, real results</h1>
      </div>
      <ProjectsBrowser projects={projects} />
    </div>
  );
}
