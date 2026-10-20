import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getStrapiMediaUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    process.env.NEXT_PUBLIC_API_URL_IMAGE ||
    'https://strapi-back-emilibramovich.waw0.amvera.tech';

  const cleanBase = strapiUrl.replace(/\/$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${cleanBase}${cleanPath}`;
}
