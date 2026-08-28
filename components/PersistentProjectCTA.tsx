"use client";

import { useState } from "react";
import Link from "next/link";
import { X, UploadCloud } from "lucide-react";

export default function PersistentProjectCTA() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="hidden md:flex fixed bottom-6 right-6 z-30 max-w-xs bg-charcoal text-warmwhite shadow-2xl p-5 items-start gap-3">
      <UploadCloud size={20} className="text-accent shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium mb-1">Have a project in mind?</p>
        <p className="text-xs text-warmwhite/70 mb-3 leading-relaxed">
          Upload your plans, inspiration photos or drawings and let our team help you find the
          perfect surface.
        </p>
        <Link
          href="/upload-project"
          className="text-xs uppercase tracking-wide text-accent hover:text-accent-light font-medium"
        >
          Upload Your Project &rarr;
        </Link>
      </div>
      <button aria-label="Dismiss" onClick={() => setDismissed(true)} className="text-warmwhite/50 hover:text-warmwhite">
        <X size={16} />
      </button>
    </div>
  );
}
