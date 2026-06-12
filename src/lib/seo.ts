export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://randomtuong.netlify.app').replace(
  /\/+$/,
  ''
);

export const SITE_NAME = 'RandomTuong.vn';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export function absoluteUrl(path = '/'): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}

export function heroUrl(slug: string): string {
  return absoluteUrl(`/tuong/${slug}/`);
}
