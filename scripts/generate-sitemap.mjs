import fs from 'node:fs/promises';

const DATA_FILE = 'src/data/heroes.ts';
const SITEMAP_FILE = 'public/sitemap.xml';
const ROBOTS_FILE = 'public/robots.txt';
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://random-tuong-lien-quan.netlify.app').replace(/\/+$/, '');

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function urlEntry(path, changefreq, priority) {
  return `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const source = await fs.readFile(DATA_FILE, 'utf8');
const crawledDate = source.match(/Last crawled:\s*(\d{4}-\d{2}-\d{2})/)?.[1];
const LASTMOD = process.env.SITEMAP_LASTMOD || crawledDate || new Date().toISOString().slice(0, 10);
const heroNames = [...source.matchAll(/\{\s*name:\s*"([^"]+)",\s*role:\s*"/g)].map(match => match[1]);

if (!heroNames.length) {
  throw new Error(`No heroes found in ${DATA_FILE}`);
}

const entries = [
  urlEntry('/', 'weekly', '1.0'),
  urlEntry('/privacy-policy/', 'monthly', '0.3'),
  ...heroNames.map(name => urlEntry(`/tuong/${slugify(name)}/`, 'monthly', '0.7')),
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

await fs.writeFile(SITEMAP_FILE, sitemap, 'utf8');
await fs.writeFile(ROBOTS_FILE, robots, 'utf8');

console.log(`Generated ${SITEMAP_FILE} with ${entries.length} URLs`);
