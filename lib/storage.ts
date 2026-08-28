import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { MOCK_MODE } from "@/lib/config";

/**
 * FILE STORAGE ABSTRACTION
 * ----------------------------------------------------------------
 * MOCK_MODE / STORAGE_PROVIDER=local: files are written to
 * /storage/uploads (outside /public, alongside /storage/mock-store)
 * so that a single mounted volume at /storage covers both the JSON
 * content store and uploaded files — important on hosts (like
 * Railway's free tier) that only allow one persistent volume per
 * service. Files are served back out through the
 * /api/uploads/[filename] route (see app/api/uploads/[filename]/route.ts)
 * rather than directly from /public.
 *
 * Swap in S3 / Cloudinary / Vercel Blob by implementing the same
 * `saveFile` signature and switching on STORAGE_PROVIDER.
 * ----------------------------------------------------------------
 */

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
  "image/vnd.dwg",
  "application/acad",
  "application/octet-stream", // covers .dwg on many systems
];

export const MAX_UPLOAD_SIZE_BYTES =
  Number(process.env.MAX_UPLOAD_SIZE_MB || 25) * 1024 * 1024;

export interface StoredFile {
  filename: string;
  url: string;
  size: number;
  mimeType: string;
}

export function uploadsDir() {
  return path.join(process.cwd(), "storage", "uploads");
}

export async function saveFile(file: File): Promise<StoredFile> {
  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    throw new Error(`File exceeds maximum size of ${process.env.MAX_UPLOAD_SIZE_MB || 25}MB`);
  }

  const provider = MOCK_MODE ? "local" : process.env.STORAGE_PROVIDER || "local";
  const ext = path.extname(file.name) || "";
  const safeName = `${nanoid(10)}${ext}`;

  if (provider === "local") {
    const dir = uploadsDir();
    await fs.mkdir(dir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(dir, safeName), buffer);
    return {
      filename: file.name,
      url: `/api/uploads/${safeName}`,
      size: file.size,
      mimeType: file.type,
    };
  }

  // PRODUCTION MODE providers (s3 / cloudinary / vercel-blob) go here —
  // each should implement the same StoredFile return shape.
  throw new Error(
    `Storage provider "${provider}" is not yet wired — implement it in lib/storage.ts`
  );
}
