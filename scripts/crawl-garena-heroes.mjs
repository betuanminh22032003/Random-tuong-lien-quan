import fs from 'node:fs/promises';

const HERO_INDEX_URL = 'https://lienquan.garena.vn/hoc-vien/tuong-skin/';
const DATA_FILE = 'src/data/heroes.ts';
const LEGACY_DATA_FILE = 'heroes-data.js';

const ROLE_BY_TYPE_ID = {
  28: { role: 'Warrior', label: 'Đấu sĩ' },
  31: { role: 'Tank', label: 'Đỡ đòn' },
  29: { role: 'Mage', label: 'Pháp sư' },
  32: { role: 'Assassin', label: 'Sát thủ' },
  30: { role: 'Support', label: 'Trợ thủ' },
  33: { role: 'Marksman', label: 'Xạ thủ' },
};

const ROLE_LABELS = {
  Warrior: 'Đấu sĩ',
  Assassin: 'Sát thủ',
  Mage: 'Pháp sư',
  Marksman: 'Xạ thủ',
  Tank: 'Đỡ đòn',
  Support: 'Trợ thủ',
  Jungle: 'Đi rừng',
};

const FALLBACK_BY_ROLE = {
  Warrior: { emoji: '⚔️', lane: 'Top', secondaryRole: 'Tank', difficulty: 2 },
  Assassin: { emoji: '🗡️', lane: 'Jungle', secondaryRole: 'Jungle', difficulty: 3 },
  Mage: { emoji: '🔮', lane: 'Mid', secondaryRole: 'Control', difficulty: 2 },
  Marksman: { emoji: '🏹', lane: 'AD', secondaryRole: 'Carry', difficulty: 2 },
  Tank: { emoji: '🛡️', lane: 'Support', secondaryRole: 'Support', difficulty: 1 },
  Support: { emoji: '💊', lane: 'Support', secondaryRole: 'Mage', difficulty: 1 },
};

const META_ALIASES = new Map([
  ['Điêu Thuyền', 'Diao Chan'],
  ['Lữ Bố', 'Lu Bu'],
  ['Ngộ Không', 'Wukong'],
  ['Triệu Vân', 'Zanis'],
  ['Jinna', 'Jinnar'],
  ['Richter', 'Riktor'],
  ['Celica', 'Brunhilda'],
  ['Eland’orr', "Eland'orr"],
  ['D’Arcy', "D'Arcy"],
  ['Y’bneth', "Y'bneth"],
  ['Kil’Groth', "Kil'Groth"],
  ['Tel’Annas', "Tel'Annas"],
  ['Azzen’Ka', "Azzen'Ka"],
]);

function decodeHtml(value) {
  return String(value || '')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCharCode(Number.parseInt(code, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, '’')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function stripTags(value) {
  return decodeHtml(value)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^["“]+|["”]+$/g, '')
    .trim();
}

function normalizeKey(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’'`]/g, '')
    .replace(/[^a-z0-9]+/gi, '')
    .toLowerCase();
}

function normalizeText(value) {
  return String(value || '')
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function jsString(value) {
  return JSON.stringify(value);
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36',
    },
  });

  if (!response.ok) {
    throw new Error(`Fetch failed ${response.status} for ${url}`);
  }

  return response.text();
}

async function readExistingMeta() {
  try {
    const source = await fs.readFile(DATA_FILE, 'utf8');
    const meta = new Map();
    const heroPattern =
      /\{\s*name:\s*"([^"]+)",\s*role:\s*"([^"]+)",\s*secondaryRole:\s*"([^"]*)",\s*lane:\s*"([^"]+)",\s*emoji:\s*"([^"]*)",\s*difficulty:\s*(\d),\s*winrate:\s*([\d.]+),\s*tier:\s*"([SABC])"/g;

    for (const match of source.matchAll(heroPattern)) {
      const [, name, role, secondaryRole, lane, emoji, difficulty, winrate, tier] = match;
      meta.set(normalizeKey(name), {
        name,
        role,
        secondaryRole,
        lane,
        emoji,
        difficulty: Number(difficulty),
        winrate: Number(winrate),
        tier,
      });
    }

    return meta;
  } catch {
    return new Map();
  }
}

function parseHeroIndex(html) {
  const itemPattern =
    /<a\s+href="([^"]+)"\s+class="st-heroes__item"\s+data-keyword="([^"]*)"\s+data-type="([^"]*)"[\s\S]*?<img\s+src="([^"]+)"\s+alt="([^"]*)"[\s\S]*?<h2 class="st-heroes__item--name">\s*([\s\S]*?)\s*<\/h2>/g;

  const heroesByName = new Map();

  for (const match of html.matchAll(itemPattern)) {
    const [, sourceUrl, keyword, typeValue, imageUrl, imageAlt, nameHtml] = match;
    const name = stripTags(nameHtml) || decodeHtml(imageAlt) || decodeHtml(keyword);
    const key = normalizeKey(name);
    const typeIds = [...typeValue.matchAll(/\[(\d+)\]/g)]
      .map(([, id]) => Number(id))
      .filter(id => ROLE_BY_TYPE_ID[id]);

    if (!heroesByName.has(key)) {
      heroesByName.set(key, {
        name,
        sourceUrl,
        imageUrl: decodeHtml(imageUrl),
        officialRoleLabels: [],
        officialRoles: [],
      });
    }

    const hero = heroesByName.get(key);
    const shouldPreferUrl =
      hero.sourceUrl.includes('-2/') && !sourceUrl.includes('-2/');

    if (shouldPreferUrl) {
      hero.sourceUrl = sourceUrl;
      hero.imageUrl = decodeHtml(imageUrl);
    }

    for (const id of typeIds) {
      const roleInfo = ROLE_BY_TYPE_ID[id];
      if (!hero.officialRoles.includes(roleInfo.role)) {
        hero.officialRoles.push(roleInfo.role);
        hero.officialRoleLabels.push(roleInfo.label);
      }
    }
  }

  return [...heroesByName.values()].sort((a, b) => a.name.localeCompare(b.name, 'vi'));
}

function parseSkills(html) {
  const skillPattern =
    /<div class="hero__skills--detail[^"]*" id="heroSkill-\d+">\s*<h3>([\s\S]*?)<\/h3>\s*<article>([\s\S]*?)<\/article>/g;

  return [...html.matchAll(skillPattern)]
    .map(([, nameHtml, descriptionHtml]) => ({
      name: stripTags(nameHtml),
      description: normalizeText(stripTags(descriptionHtml)),
    }))
    .filter(skill => skill.name && skill.description);
}

function choosePrimaryRole(hero, oldMeta) {
  if (hero.name === 'Flowborn' && hero.officialRoles.includes('Marksman')) {
    return 'Marksman';
  }

  if (oldMeta?.role && hero.officialRoles.includes(oldMeta.role)) {
    return oldMeta.role;
  }

  return hero.officialRoles[0] || 'Warrior';
}

function findOldMeta(hero, meta) {
  const keys = [hero.name, META_ALIASES.get(hero.name)]
    .filter(Boolean)
    .map(normalizeKey);

  return keys.map(key => meta.get(key)).find(Boolean);
}

function toHeroData(hero, meta) {
  const oldMeta = findOldMeta(hero, meta);
  const role = choosePrimaryRole(hero, oldMeta);
  const fallback = FALLBACK_BY_ROLE[role] || FALLBACK_BY_ROLE.Warrior;
  const officialSecondary = hero.officialRoles.find(item => item !== role);

  return {
    name: hero.name,
    role,
    secondaryRole: officialSecondary || oldMeta?.secondaryRole || fallback.secondaryRole,
    lane: oldMeta?.lane || fallback.lane,
    emoji: oldMeta?.emoji || fallback.emoji,
    difficulty: oldMeta?.difficulty || fallback.difficulty,
    winrate: oldMeta?.winrate || 50,
    tier: oldMeta?.tier || 'B',
    officialRoleLabels: hero.officialRoleLabels,
    imageUrl: hero.imageUrl,
    sourceUrl: hero.sourceUrl,
    skills: hero.skills,
  };
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: limit }, worker));
  return results;
}

function renderTypeScript(heroes) {
  const heroRows = heroes
    .map(hero => {
      const skills = hero.skills
        .map(
          skill =>
            `{ name: ${jsString(skill.name)}, description: ${jsString(skill.description)} }`
        )
        .join(', ');

      return `  { name: ${jsString(hero.name)}, role: ${jsString(hero.role)}, secondaryRole: ${jsString(
        hero.secondaryRole
      )}, lane: ${jsString(hero.lane)}, emoji: ${jsString(hero.emoji)}, difficulty: ${
        hero.difficulty
      }, winrate: ${hero.winrate.toFixed(1)}, tier: ${jsString(
        hero.tier
      )}, officialRoleLabels: ${jsString(hero.officialRoleLabels)}, imageUrl: ${jsString(
        hero.imageUrl
      )}, sourceUrl: ${jsString(hero.sourceUrl)}, skills: [${skills}] },`;
    })
    .join('\n');

  return `// Roster and hero details for RandomTuong.vn.
// Generated by scripts/crawl-garena-heroes.mjs from Garena's public Liên Quân Mobile pages.
// Last crawled: 2026-06-11.
// Roster, role labels, images, source URLs, and skill text come from Garena.
// Tier/winrate/difficulty/lane are app metadata; Garena does not publish official public winrate here.

export interface HeroSkill {
  name: string;
  description: string;
}

export interface Hero {
  name: string;
  role: 'Warrior' | 'Assassin' | 'Mage' | 'Marksman' | 'Tank' | 'Support';
  secondaryRole: string;
  lane: 'Top' | 'Jungle' | 'Mid' | 'AD' | 'Support';
  emoji: string;
  difficulty: 1 | 2 | 3;
  winrate: number;
  tier: 'S' | 'A' | 'B' | 'C';
  available?: boolean;
  officialRoleLabels: string[];
  imageUrl: string;
  sourceUrl: string;
  skills: HeroSkill[];
}

export const HERO_DATA_UPDATED_AT = "Crawl Garena 11/06/2026 · ${heroes.length} tướng";
export const HERO_SOURCE_NOTE =
  "Danh sách tướng, vai trò chính thức, ảnh và kỹ năng được crawl từ trang Tướng/Skin của Garena Liên Quân Mobile ngày 11/06/2026. Google Play cũng ghi nhận bản cập nhật gần nhất 04/06/2026 với tướng mới Flowborn. Tier/winrate/lane là metadata tham khảo của app vì Garena không công bố winrate public trên nguồn này.";
export const HERO_SOURCES: string[] = [
  "https://lienquan.garena.vn/hoc-vien/tuong-skin/",
  "https://play.google.com/store/apps/details?hl=vi&id=com.garena.game.kgvn"
];

export const HEROES: Hero[] = [
${heroRows}
];

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\\u0300-\\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export const ROLE_LABELS: Record<string, string> = ${JSON.stringify(ROLE_LABELS, null, 2)};
`;
}

function renderLegacyJavaScript(heroes) {
  const publicHeroes = heroes.map(({ officialRoleLabels, imageUrl, sourceUrl, skills, ...hero }) => ({
    ...hero,
    officialRoleLabels,
    imageUrl,
    sourceUrl,
    skills,
  }));

  return `// Generated by scripts/crawl-garena-heroes.mjs.
window.HERO_DATA_UPDATED_AT = "Crawl Garena 11/06/2026 · ${heroes.length} tướng";
window.HERO_SOURCE_NOTE = "Danh sách tướng, vai trò chính thức, ảnh và kỹ năng được crawl từ Garena Liên Quân Mobile ngày 11/06/2026. Tier/winrate/lane là metadata tham khảo của app vì Garena không công bố winrate public trên nguồn này.";
window.HERO_SOURCES = [
  "https://lienquan.garena.vn/hoc-vien/tuong-skin/",
  "https://play.google.com/store/apps/details?hl=vi&id=com.garena.game.kgvn"
];

window.HEROES = ${JSON.stringify(publicHeroes, null, 2)};
`;
}

async function main() {
  const existingMeta = await readExistingMeta();
  const indexHtml = await fetchText(HERO_INDEX_URL);
  const indexedHeroes = parseHeroIndex(indexHtml);

  console.log(`Found ${indexedHeroes.length} unique heroes from Garena index.`);

  const crawledHeroes = await mapWithConcurrency(indexedHeroes, 6, async (hero, index) => {
    try {
      const html = await fetchText(hero.sourceUrl);
      const skills = parseSkills(html);
      console.log(`[${index + 1}/${indexedHeroes.length}] ${hero.name}: ${skills.length} skills`);
      return { ...hero, skills };
    } catch (error) {
      console.warn(`[${index + 1}/${indexedHeroes.length}] ${hero.name}: ${error.message}`);
      return { ...hero, skills: [] };
    }
  });

  const heroes = crawledHeroes.map(hero => toHeroData(hero, existingMeta));

  await fs.writeFile(DATA_FILE, renderTypeScript(heroes), 'utf8');
  await fs.writeFile(LEGACY_DATA_FILE, renderLegacyJavaScript(heroes), 'utf8');

  console.log(`Wrote ${DATA_FILE} and ${LEGACY_DATA_FILE}.`);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
