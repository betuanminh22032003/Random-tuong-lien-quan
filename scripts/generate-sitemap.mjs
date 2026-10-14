// Runs after `next build` (npm "postbuild"): scans the exported HTML in out/
// so every page that ships is in the sitemap automatically — no route list to
// keep in sync. Pages with a noindex robots meta are skipped.
import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';

const OUT_DIR = 'out';
const DATA_FILE = 'src/data/heroes.ts';
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://randomtuong.netlify.app').replace(/\/+$/, '');
// Repo copies keep the committed sitemap/robots in step with the deployed ones.
const MIRRORS = ['public', '.'];

const RULES = [
  { test: p => p === '/', changefreq: 'daily', priority: '1.0' },
  { test: p => p === '/mini-game/', changefreq: 'weekly', priority: '0.9' },
  { test: p => p.startsWith('/mini-game/'), changefreq: 'weekly', priority: '0.9' },
  { test: p => p === '/tier-list-lien-quan/', changefreq: 'weekly', priority: '0.9' },
  { test: p => /^\/(random-tuong|random-doi|ban-pick)-lien-quan\/$/.test(p), changefreq: 'weekly', priority: '0.9' },
  { test: p => p === '/tuong/', changefreq: 'weekly', priority: '0.8' },
  { test: p => p.startsWith('/huong-dan/'), changefreq: 'monthly', priority: '0.8' },
  { test: p => p.startsWith('/vai-tro/'), changefreq: 'weekly', priority: '0.8' },
  { test: p => p.startsWith('/tuong/'), changefreq: 'monthly', priority: '0.7' },
  { test: () => true, changefreq: 'yearly', priority: '0.3' },
];

function escapeXml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function decodeHtml(value) {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
}

function meta(html, pattern) {
  const match = html.match(pattern);
  return match ? decodeHtml(match[1]) : '';
}

async function findHtml(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(entry => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return entry.name.startsWith('_') ? [] : findHtml(full);
      return entry.name === 'index.html' ? [full] : [];
    })
  );
  return files.flat();
}

function gitDate() {
  try {
    return execSync('git log -1 --format=%cs', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return '';
  }
}

const today = new Date().toISOString().slice(0, 10);
const source = await fs.readFile(DATA_FILE, 'utf8');
const heroLastmod = process.env.SITEMAP_HERO_LASTMOD || source.match(/Last crawled:\s*(\d{4}-\d{2}-\d{2})/)?.[1] || today;
const siteLastmod = process.env.SITEMAP_STATIC_LASTMOD || gitDate() || today;

try {
  await fs.access(OUT_DIR);
} catch {
  throw new Error(`${OUT_DIR}/ not found — run "npm run build" (sitemap is generated after next build).`);
}

const pages = [];
for (const file of await findHtml(OUT_DIR)) {
  const html = await fs.readFile(file, 'utf8');
  const robots = meta(html, /<meta name="robots" content="([^"]*)"/);
  if (/noindex/i.test(robots)) continue;
  const canonical = meta(html, /<link rel="canonical" href="([^"]+)"/);
  const fallbackPath = '/' + path.relative(OUT_DIR, path.dirname(file)).split(path.sep).filter(Boolean).join('/');
  const urlPath = canonical.startsWith(SITE_URL)
    ? canonical.slice(SITE_URL.length) || '/'
    : fallbackPath.endsWith('/') ? fallbackPath : `${fallbackPath}/`;
  const image = meta(html, /<meta property="og:image" content="([^"]+)"/);
  const title = meta(html, /<title>([^<]*)<\/title>/);
  pages.push({ urlPath, image, title });
}

if (!pages.length) throw new Error(`No indexable pages found in ${OUT_DIR}/`);

const unique = [...new Map(pages.map(p => [p.urlPath, p])).values()];
const order = p => RULES.findIndex(rule => rule.test(p.urlPath));
unique.sort((a, b) => order(a) - order(b) || a.urlPath.localeCompare(b.urlPath));

const entries = unique.map(({ urlPath, image, title }) => {
  const rule = RULES.find(r => r.test(urlPath));
  const isHero = /^\/tuong\/[^/]+\/$/.test(urlPath);
  const imageXml =
    isHero && image && !image.startsWith(SITE_URL)
      ? `
    <image:image>
      <image:loc>${escapeXml(image)}</image:loc>
      <image:title>${escapeXml(title.split(' - ')[0].replace(/ Liên Quân$/, ''))}</image:title>
    </image:image>`
      : '';
  return `  <url>
    <loc>${escapeXml(SITE_URL + urlPath)}</loc>
    <lastmod>${isHero ? heroLastmod : siteLastmod}</lastmod>
    <changefreq>${rule.changefreq}</changefreq>
    <priority>${rule.priority}</priority>${imageXml}
  </url>`;
});

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

for (const dir of [OUT_DIR, ...MIRRORS]) {
  await fs.writeFile(path.join(dir, 'sitemap.xml'), sitemap, 'utf8');
  await fs.writeFile(path.join(dir, 'robots.txt'), robots, 'utf8');
}

// ads.txt is required by AdSense once a publisher ID is set in src/lib/config.ts.
const adsClient = (await fs.readFile('src/lib/config.ts', 'utf8')).match(/adsenseClient:\s*'ca-(pub-\d+)'/)?.[1];
if (adsClient) {
  await fs.writeFile(path.join(OUT_DIR, 'ads.txt'), `google.com, ${adsClient}, DIRECT, f08c47fec0942fa0\n`, 'utf8');
  console.log(`ads.txt: ${adsClient}`);
}

console.log(`Sitemap: ${entries.length} URLs → ${OUT_DIR}/sitemap.xml (+ ${MIRRORS.join(', ')})`);
