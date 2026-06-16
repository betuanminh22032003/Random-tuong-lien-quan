import fs from 'node:fs/promises';

const DATA_FILE = 'src/data/heroes.ts';
const SITEMAP_FILE = 'public/sitemap.xml';
const ROOT_SITEMAP_FILE = 'sitemap.xml';
const ROBOTS_FILE = 'public/robots.txt';
const ROOT_ROBOTS_FILE = 'robots.txt';
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://randomtuong.netlify.app').replace(/\/+$/, '');

const STATIC_ROUTES = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/privacy-policy/', changefreq: 'monthly', priority: '0.3' },
  { path: '/random-tuong-lien-quan/', changefreq: 'weekly', priority: '0.9' },
  { path: '/random-doi-lien-quan/', changefreq: 'weekly', priority: '0.8' },
  { path: '/ban-pick-lien-quan/', changefreq: 'weekly', priority: '0.8' },
];

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

function urlEntry(path, changefreq, priority, lastmod) {
  return `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const source = await fs.readFile(DATA_FILE, 'utf8');
const crawledDate = source.match(/Last crawled:\s*(\d{4}-\d{2}-\d{2})/)?.[1];
const HERO_LASTMOD = process.env.SITEMAP_HERO_LASTMOD || crawledDate || new Date().toISOString().slice(0, 10);
const STATIC_LASTMOD = process.env.SITEMAP_STATIC_LASTMOD || new Date().toISOString().slice(0, 10);
const heroNames = [...source.matchAll(/\{\s*name:\s*"([^"]+)",\s*role:\s*"/g)].map(match => match[1]);

if (!heroNames.length) {
  throw new Error(`No heroes found in ${DATA_FILE}`);
}

const entries = [
  ...STATIC_ROUTES.map(route => urlEntry(route.path, route.changefreq, route.priority, STATIC_LASTMOD)),
  ...heroNames.map(name => urlEntry(`/tuong/${slugify(name)}/`, 'monthly', '0.7', HERO_LASTMOD)),
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
await fs.writeFile(ROOT_SITEMAP_FILE, sitemap, 'utf8');
await fs.writeFile(ROBOTS_FILE, robots, 'utf8');
await fs.writeFile(ROOT_ROBOTS_FILE, robots, 'utf8');

console.log(`Generated ${SITEMAP_FILE} with ${entries.length} URLs`);
