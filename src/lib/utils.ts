import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getImageUrl(path: string | null | undefined, width = 256): string {
  if (!path) return "";
  const trimmed = path.trim();
  if (!trimmed) return "";

  let fullUrl = trimmed;
  if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
    const baseImgUrl = (
      process.env.NEXT_PUBLIC_API_IMG_URL || ""
    ).replace(/\/$/, "");
    const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    fullUrl = `${baseImgUrl}${cleanPath}`;
  }

  return `/_next/image?url=${encodeURIComponent(fullUrl)}&w=${width}&q=75`;
}

