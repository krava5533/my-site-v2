import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/CTASection";
import ProjectUploadForm from "@/components/ProjectUploadForm";

export const metadata: Metadata = {
  title: "Upload Your Project",
  description: "Upload your plans, drawings, inspiration photos or project details and our team will help you find the right surfaces.",
};

export default function UploadProjectPage() {
  return (
    <div className="container-lux py-12 md:py-16 max-w-3xl">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Upload Your Project" }]} />
      <div className="mt-6 mb-10">
        <p className="eyebrow mb-3">Upload Your Project</p>
        <h1 className="section-heading mb-4">Tell Us About Your Project</h1>
        <p className="text-warmgray">
          Upload your plans, drawings, inspiration photos or project details and our team will
          help you find the right surfaces.
        </p>
      </div>
      <ProjectUploadForm />
    </div>
  );
}
