"use client";

import { useRef, useState } from "react";
import { UploadCloud, File as FileIcon, X } from "lucide-react";

export default function FileUploader({
  files,
  onChange,
  maxSizeMb = 25,
}: {
  files: File[];
  onChange: (files: File[]) => void;
  maxSizeMb?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptedTypes = [".jpg", ".jpeg", ".png", ".webp", ".pdf", ".dwg"];

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    setError(null);
    const valid: File[] = [];
    Array.from(list).forEach((f) => {
      if (f.size > maxSizeMb * 1024 * 1024) {
        setError(`"${f.name}" exceeds the ${maxSizeMb}MB limit.`);
        return;
      }
      valid.push(f);
    });
    onChange([...files, ...valid]);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          dragging ? "border-accent bg-accent/5" : "border-warmgray/40 hover:border-accent"
        }`}
      >
        <UploadCloud className="mx-auto mb-3 text-warmgray" size={28} />
        <p className="text-sm text-charcoal">
          Drag & drop files here, or <span className="text-accent underline">browse</span>
        </p>
        <p className="text-xs text-warmgray mt-2">
          JPG, PNG, WEBP, PDF, DWG &middot; up to {maxSizeMb}MB per file
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(",")}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {error && <p className="form-error mt-2">{error}</p>}

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((f, i) => (
            <li key={i} className="flex items-center gap-3 bg-white border border-warmgray/20 px-3 py-2 text-sm">
              <FileIcon size={16} className="text-warmgray shrink-0" />
              <span className="flex-1 truncate">{f.name}</span>
              <span className="text-xs text-warmgray">{(f.size / 1024 / 1024).toFixed(1)}MB</span>
              <button
                type="button"
                onClick={() => onChange(files.filter((_, idx) => idx !== i))}
                aria-label="Remove file"
              >
                <X size={14} className="text-warmgray hover:text-red-600" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
