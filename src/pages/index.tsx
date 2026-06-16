import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  HEROES,
  Hero,
  ROLE_LABELS,
  HERO_DATA_UPDATED_AT,
  HERO_SOURCE_NOTE,
  HERO_SOURCES,
  slugify,
} from '@/data/heroes';

const APP_CONFIG = {
  gaMeasurementId: '',
  adsenseClient: '',
};

const SITE_URL = 'https://randomtuong.netlify.app';
const SITE_NAME = 'RandomTuong.vn';

const SEO_FAQS = [
  {
    question: 'Random tướng Liên Quân Mobile ở đâu?',
    answer:
      'Bạn có thể random tướng Liên Quân Mobile miễn phí tại RandomTuong.vn. Chọn tab Random, lọc theo vai trò hoặc độ khó rồi bấm Random để quay tướng.',
  },
  {
    question: 'Cách random đội 5v5 Liên Quân Mobile như thế nào?',
    answer:
      'Vào tab 5v5 và bấm Random đội 5v5. Công cụ tự chia hai đội theo các lane cơ bản gồm đường trên, đi rừng, đường giữa, xạ thủ và trợ thủ.',
  },
  {
    question: 'Bảng meta tướng mạnh trên RandomTuong.vn có phải số liệu chính thức không?',
    answer:
      'Không. Danh sách tướng, vai trò, ảnh và kỹ năng lấy từ nguồn Garena; tier, lane, độ khó và winrate là metadata tham khảo của app để phục vụ random và ban/pick.',
  },
  {
    question: 'RandomTuong.vn có miễn phí không?',
    answer:
      'Có. Công cụ random tướng, random đội 5v5, ban/pick và xem chi tiết tướng đều miễn phí, không cần đăng ký tài khoản.',
  },
];

const ROLE_OPTIONS = [
  { key: 'all', label: '🎯 Tất cả' },
  { key: 'Warrior', label: '⚔️ Đấu sĩ' },
  { key: 'Assassin', label: '🗡️ Sát thủ' },
  { key: 'Mage', label: '🔮 Pháp sư' },
  { key: 'Marksman', label: '🏹 Xạ thủ' },
  { key: 'Tank', label: '🛡️ Đỡ đòn' },
  { key: 'Support', label: '💊 Trợ thủ' },
  { key: 'Jungle', label: '🌿 Đi rừng' },
];

const DIFFICULTY_OPTIONS = [
  { key: 'all', label: 'Tất cả' },
  { key: '1', label: '★ Dễ' },
  { key: '2', label: '★★ Vừa' },
  { key: '3', label: '★★★ Khó' },
];

const TEAM_LANES = [
  { key: 'Top', label: 'Đường trên', match: (h: Hero) => h.lane === 'Top' || h.role === 'Warrior' || h.role === 'Tank' },
  { key: 'Jungle', label: 'Đi rừng', match: (h: Hero) => h.lane === 'Jungle' || h.secondaryRole === 'Jungle' || h.role === 'Assassin' },
  { key: 'Mid', label: 'Đường giữa', match: (h: Hero) => h.lane === 'Mid' || h.role === 'Mage' },
  { key: 'AD', label: 'Xạ thủ', match: (h: Hero) => h.lane === 'AD' || h.role === 'Marksman' },
  { key: 'Support', label: 'Trợ thủ', match: (h: Hero) => h.lane === 'Support' || h.role === 'Support' || h.role === 'Tank' },
];

// Standard Liên Quân ban/pick sequence (3 bans each → 5 picks each)
const BP_SEQUENCE: Array<{ type: 'ban' | 'pick'; side: 'blue' | 'red' }> = [
  { type: 'ban',  side: 'blue' },
  { type: 'ban',  side: 'red'  },
  { type: 'ban',  side: 'blue' },
  { type: 'ban',  side: 'red'  },
  { type: 'ban',  side: 'blue' },
  { type: 'ban',  side: 'red'  },
  { type: 'pick', side: 'blue' },
  { type: 'pick', side: 'red'  },
  { type: 'pick', side: 'red'  },
  { type: 'pick', side: 'blue' },
  { type: 'pick', side: 'blue' },
  { type: 'pick', side: 'red'  },
  { type: 'pick', side: 'red'  },
  { type: 'pick', side: 'blue' },
  { type: 'pick', side: 'blue' },
  { type: 'pick', side: 'red'  },
];

const HISTORY_KEY = 'randomtuong.history.v2';

const ACTIVE_HEROES = HEROES.filter(h => h.available !== false);

interface BpState {
  bans:  { blue: Hero[]; red: Hero[] };
  picks: { blue: Hero[]; red: Hero[] };
  step: number; // 0–16; 16 = done
}

interface TeamMember extends Hero {
  laneLabel: string;
}

type TabKey = 'random' | 'team' | 'banpick' | 'meta';

function normalize(value: string): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

function difficultyText(level: number): string {
  return '★'.repeat(level) + '☆'.repeat(3 - level);
}

function tierClass(tier: string): string {
  return String(tier || 'B').toLowerCase();
}

function pickRandom<T>(pool: T[]): T {
  return pool[Math.floor(Math.random() * pool.length)];
}

function loadHistory(): Hero[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    return Array.isArray(parsed) ? parsed.slice(0, 8) : [];
  } catch {
    return [];
  }
}

interface ThemeToggleProps {
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
}

interface PageProps {
  themeToggle?: ThemeToggleProps;
}

export default function Home({ themeToggle }: PageProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('random');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentHero, setCurrentHero] = useState<Hero | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [spinHero, setSpinHero] = useState<Hero | null>(null);
  const [history, setHistory] = useState<Hero[]>([]);
  const [teams, setTeams] = useState<{ blue: TeamMember[]; red: TeamMember[] } | null>(null);
  const [bpState, setBpState] = useState<BpState>({
    bans:  { blue: [], red: [] },
    picks: { blue: [], red: [] },
    step: 0,
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    if (APP_CONFIG.gaMeasurementId) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(APP_CONFIG.gaMeasurementId)}`;
      document.head.appendChild(script);
    }
    if (APP_CONFIG.adsenseClient) {
      const script = document.createElement('script');
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(APP_CONFIG.adsenseClient)}`;
      document.head.appendChild(script);
    }
  }, []);

  const getFilteredHeroes = useCallback((): Hero[] => {
    return ACTIVE_HEROES.filter(hero => {
      const roleMatch =
        selectedRole === 'all' ||
        hero.role === selectedRole ||
        hero.secondaryRole === selectedRole ||
        hero.lane === selectedRole;
      const difficultyMatch =
        selectedDifficulty === 'all' || String(hero.difficulty) === selectedDifficulty;
      const searchMatch = !searchTerm || normalize(hero.name).includes(normalize(searchTerm));
      return roleMatch && difficultyMatch && searchMatch;
    });
  }, [selectedRole, selectedDifficulty, searchTerm]);

  const saveHistoryItem = useCallback((hero: Hero) => {
    setHistory(prev => {
      const next = [hero, ...prev.filter(h => h.name !== hero.name)].slice(0, 8);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      } catch {
        // localStorage disabled
      }
      return next;
    });
  }, []);

  const doRandomHero = useCallback(
    ({ avoidCurrent = false }: { avoidCurrent?: boolean } = {}) => {
      if (spinning) return;
      let pool = getFilteredHeroes();
      if (avoidCurrent && currentHero && pool.length > 1) {
        pool = pool.filter(h => h.name !== currentHero.name);
      }
      if (!pool.length) {
        setCurrentHero(null);
        return;
      }
      setSpinning(true);
      setCurrentHero(null);
      setSpinHero(pickRandom(pool));

      let count = 0;
      intervalRef.current = setInterval(() => {
        setSpinHero(pickRandom(pool));
        count += 1;
        if (count >= 14) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          const chosen = pickRandom(pool);
          setSpinning(false);
          setCurrentHero(chosen);
          setSpinHero(null);
          saveHistoryItem(chosen);
        }
      }, 80);
    },
    [spinning, getFilteredHeroes, currentHero, saveHistoryItem]
  );

  const handleFacebookShare = useCallback(() => {
    if (!currentHero) return;
    const slug = slugify(currentHero.name);
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      `https://randomtuong.netlify.app/tuong/${slug}/`
    )}&quote=${encodeURIComponent(`Tôi vừa random được ${currentHero.name}!`)}`;
    window.open(url, 'fb-share', 'width=580,height=400');
  }, [currentHero]);

  const resetFilters = useCallback(() => {
    setSelectedRole('all');
    setSelectedDifficulty('all');
    setSearchTerm('');
  }, []);

  const pickForLane = (usedNames: Set<string>, lane: (typeof TEAM_LANES)[0]): TeamMember => {
    let pool = ACTIVE_HEROES.filter(h => !usedNames.has(h.name) && lane.match(h));
    if (!pool.length) pool = ACTIVE_HEROES.filter(h => !usedNames.has(h.name));
    const hero = pickRandom(pool);
    usedNames.add(hero.name);
    return { ...hero, laneLabel: lane.label };
  };

  const randomTeams = useCallback(() => {
    const used = new Set<string>();
    const blue = TEAM_LANES.map(lane => pickForLane(used, lane));
    const red  = TEAM_LANES.map(lane => pickForLane(used, lane));
    setTeams({ blue, red });
  }, []);

  // Advance to the next step in the BP sequence
  const bpNext = useCallback(() => {
    setBpState(prev => {
      if (prev.step >= BP_SEQUENCE.length) return prev;
      const step = BP_SEQUENCE[prev.step];
      const used = new Set(
        [
          ...prev.bans.blue, ...prev.bans.red,
          ...prev.picks.blue, ...prev.picks.red,
        ].map(h => h.name)
      );
      const available = ACTIVE_HEROES.filter(h => !used.has(h.name));
      if (!available.length) return prev;
      const hero = pickRandom(available);
      if (step.type === 'ban') {
        return {
          ...prev,
          step: prev.step + 1,
          bans: { ...prev.bans, [step.side]: [...prev.bans[step.side], hero] },
        };
      } else {
        return {
          ...prev,
          step: prev.step + 1,
          picks: { ...prev.picks, [step.side]: [...prev.picks[step.side], hero] },
        };
      }
    });
  }, []);

  const bpReset = useCallback(() => {
    setBpState({ bans: { blue: [], red: [] }, picks: { blue: [], red: [] }, step: 0 });
  }, []);

  // Derived bp UI helpers
  const bpCurrent = bpState.step < BP_SEQUENCE.length ? BP_SEQUENCE[bpState.step] : null;
  const bpDone = bpState.step >= BP_SEQUENCE.length;
  const bpStatusText = bpDone
    ? '✅ Ban/Pick hoàn tất!'
    : bpCurrent!.type === 'ban'
      ? `${bpCurrent!.side === 'blue' ? '🔵 Đội Xanh' : '🔴 Đội Đỏ'} – 🚫 Cấm tướng (${bpState.step + 1}/16)`
      : `${bpCurrent!.side === 'blue' ? '🔵 Đội Xanh' : '🔴 Đội Đỏ'} – ⚔️ Chọn tướng (${bpState.step + 1}/16)`;

  const filteredHeroes = getFilteredHeroes();
  const sTierCount = ACTIVE_HEROES.filter(h => h.tier === 'S').length;
  const avgWinrate = filteredHeroes.length
    ? (filteredHeroes.reduce((sum, h) => sum + h.winrate, 0) / filteredHeroes.length).toFixed(1)
    : '0.0';

  const tierLabels: Record<string, string> = {
    S: '🔥 S - Ưu tiên ban/pick',
    A: '⭐ A - Mạnh để leo rank',
    B: '✅ B - Ổn định',
    C: '⬇️ C - Tình huống',
  };

  const theme = themeToggle?.theme ?? 'dark';
  const setTheme = themeToggle?.setTheme;

  // Render a ban slot (compact image square)
  const renderBanSlot = (hero: Hero | undefined, idx: number) => (
    <div key={idx} className={`bp-slot${hero ? ' ban-filled' : ''}`}>
      {hero ? (
        <>
          <img src={hero.imageUrl} alt={hero.name} loading="lazy" />
          <span className="slot-name">{hero.name}</span>
        </>
      ) : (
        <span className="slot-empty">?</span>
      )}
    </div>
  );

  // Render a pick slot (list row with image + name + role)
  const renderPickRow = (hero: Hero | undefined, idx: number, isNext: boolean) => (
    <div key={idx} className={`team-member${!hero ? ' bp-pick-empty' : ''}${isNext ? ' bp-pick-next' : ''}`}>
      {hero ? (
        <>
          <img src={hero.imageUrl} alt={hero.name} className="member-avatar" loading="lazy" />
          <div>
            <div className="member-name">{hero.name}</div>
            <div className="member-role">{ROLE_LABELS[hero.role] || hero.role}</div>
          </div>
          <span className={`chip ${tierClass(hero.tier)}`}>T{hero.tier}</span>
        </>
      ) : (
        <>
          <div className="member-avatar member-avatar-empty">?</div>
          <div><div className="member-name bp-slot-placeholder">–</div></div>
          <span />
        </>
      )}
    </div>
  );

  return (
    <>
      <Head>
        <title>Random Tướng Liên Quân Mobile - Miễn Phí | RandomTuong.vn</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Random tướng Liên Quân Mobile miễn phí — lọc theo vai trò, độ khó, random đội 5v5, ban/pick thông minh và bảng meta tướng mạnh mùa S2 2026. Không cần đăng ký, dùng ngay!"
        />
        <meta
          name="keywords"
          content="random tướng liên quân, random tướng liên quân mobile, random tướng, công cụ random tướng liên quân, random đội liên quân, random đội 5v5 liên quân, meta liên quân 2026, tướng mạnh liên quân, ban pick liên quân, liên quân mobile"
        />
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large" />
        <link rel="canonical" href="https://randomtuong.netlify.app/" />
        <link rel="alternate" hrefLang="vi" href="https://randomtuong.netlify.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="vi_VN" />
        <meta property="og:url" content="https://randomtuong.netlify.app/" />
        <meta property="og:title" content="Random Tướng Liên Quân Mobile - Miễn Phí | RandomTuong.vn" />
        <meta
          property="og:description"
          content="Random tướng Liên Quân Mobile miễn phí — lọc role, độ khó, random đội 5v5, ban/pick và xem meta tướng mạnh S2 2026."
        />
        <meta property="og:image" content="https://randomtuong.netlify.app/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Random Tướng Liên Quân Mobile - Miễn Phí | RandomTuong.vn" />
        <meta
          name="twitter:description"
          content="Công cụ random tướng Liên Quân miễn phí — lọc role, độ khó, 5v5, ban/pick và bảng meta."
        />
        <meta name="twitter:image" content="https://randomtuong.netlify.app/og-image.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'WebApplication',
                name: 'RandomTuong.vn – Random Tướng Liên Quân Mobile',
                url: 'https://randomtuong.netlify.app/',
                applicationCategory: 'GameApplication',
                operatingSystem: 'Any',
                inLanguage: 'vi-VN',
                description: 'Công cụ random tướng Liên Quân Mobile miễn phí, hỗ trợ lọc theo vai trò, độ khó, random đội 5v5, ban/pick và bảng meta tướng mạnh mùa S2 2026.',
                offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND' },
              },
              {
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: [
                  {
                    '@type': 'Question',
                    name: 'Random tướng Liên Quân Mobile ở đâu?',
                    acceptedAnswer: { '@type': 'Answer', text: 'Bạn có thể random tướng Liên Quân Mobile miễn phí tại RandomTuong.vn — chọn tab Random, lọc theo vai trò hoặc độ khó rồi bấm nút Random để quay.' },
                  },
                  {
                    '@type': 'Question',
                    name: 'Cách random đội 5v5 Liên Quân Mobile?',
                    acceptedAnswer: { '@type': 'Answer', text: 'Vào tab 5v5 trên RandomTuong.vn, chọn số người rồi bấm Chia đội. Hệ thống tự động chia 10 tướng thành 2 đội 5v5 ngẫu nhiên.' },
                  },
                  {
                    '@type': 'Question',
                    name: 'Tướng nào mạnh nhất Liên Quân mùa S2 2026?',
                    acceptedAnswer: { '@type': 'Answer', text: 'Xem bảng meta tướng mạnh tại tab Meta trên RandomTuong.vn — phân loại tier S/A/B/C theo winrate và sức mạnh thực tế mùa S2 2026.' },
                  },
                  {
                    '@type': 'Question',
                    name: 'RandomTuong.vn có miễn phí không?',
                    acceptedAnswer: { '@type': 'Answer', text: 'Hoàn toàn miễn phí, không cần đăng ký. Truy cập và dùng ngay trên mọi thiết bị.' },
                  },
                ],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Random Tướng Liên Quân', item: 'https://randomtuong.netlify.app/' }],
              },
            ]),
          }}
        />
      </Head>

      <div className="ad ad-top" data-ad-slot="top">
        AdSense ready - Top banner 728x90
      </div>

      <header className="site-header">
        <h1>Random Tướng Liên Quân Mobile</h1>
        <p>Công cụ random tướng miễn phí — 5v5, ban/pick &amp; meta tướng mạnh mùa S2 2026</p>
        {setTheme && (
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Chuyển giao diện sáng/tối"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        )}
      </header>

      <nav className="tabs" aria-label="Điều hướng công cụ">
        {(['random', 'team', 'banpick', 'meta'] as TabKey[]).map((tab, i) => {
          const labels = ['🎲 Random', '👥 5v5', '🛡️ Ban/Pick', '📊 Meta'];
          return (
            <button
              key={tab}
              className="tab"
              type="button"
              aria-selected={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {labels[i]}
            </button>
          );
        })}
      </nav>

      <main className="shell">
        {/* ── Random Tab ── */}
        <section
          className={`page${activeTab === 'random' ? ' active' : ''}`}
          aria-label="Random tướng"
        >
          <div className="section-title">
            <h2>Random tướng</h2>
            <span>
              {filteredHeroes.length}/{ACTIVE_HEROES.length} tướng phù hợp
            </span>
          </div>

          <div className="layout two">
            <div>
              <div className="hero-stage">
                <div>
                  {/* Hero portrait */}
                  <div className={`hero-avatar${spinning ? ' spinning' : ''}`}>
                    {spinning && spinHero ? (
                      <img src={spinHero.imageUrl} alt="" />
                    ) : currentHero ? (
                      <img src={currentHero.imageUrl} alt={currentHero.name} />
                    ) : (
                      <span className="hero-avatar-placeholder">🎮</span>
                    )}
                  </div>

                  <div className="hero-name">
                    {currentHero && !spinning ? (
                      currentHero.name
                    ) : spinning ? (
                      <span className="placeholder">...</span>
                    ) : (
                      <span className="placeholder">Nhấn Random để bắt đầu</span>
                    )}
                  </div>

                  {currentHero && !spinning && (
                    <div className="chips">
                      <span className={`chip ${tierClass(currentHero.tier)}`}>
                        Tier {currentHero.tier}
                      </span>
                      <span className="chip">
                        {ROLE_LABELS[currentHero.role] || currentHero.role}
                      </span>
                      <span className="chip">
                        {currentHero.secondaryRole || currentHero.lane}
                      </span>
                      <span className="chip">{difficultyText(currentHero.difficulty)}</span>
                      <span className="chip">{currentHero.winrate.toFixed(1)}% WR</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="actions">
                <button
                  className="btn btn-primary"
                  type="button"
                  disabled={spinning}
                  onClick={() => doRandomHero()}
                >
                  🎲 Random tướng
                </button>
                <button
                  className="btn btn-secondary"
                  type="button"
                  disabled={spinning || !currentHero}
                  onClick={() => doRandomHero({ avoidCurrent: true })}
                >
                  ↻ Random tiếp
                </button>
              </div>

              {currentHero && !spinning && (
                <div className="actions" style={{ marginTop: 0 }}>
                  <Link
                    href={`/tuong/${slugify(currentHero.name)}/`}
                    className="btn btn-plain"
                  >
                    📖 Xem chi tiết
                  </Link>
                  <button
                    className="btn btn-facebook"
                    type="button"
                    onClick={handleFacebookShare}
                  >
                    📤 Chia sẻ
                  </button>
                </div>
              )}
            </div>

            <aside className="panel filters" aria-label="Bộ lọc random">
              <div className="filter-group">
                <label htmlFor="hero-search">Tìm tướng</label>
                <input
                  className="search"
                  id="hero-search"
                  type="search"
                  placeholder="Nhập tên tướng..."
                  autoComplete="off"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value.trim())}
                />
              </div>

              <div className="filter-group">
                <span className="mini-title">Vai trò</span>
                <div className="pills">
                  {ROLE_OPTIONS.map(opt => (
                    <button
                      key={opt.key}
                      className={`pill${selectedRole === opt.key ? ' active' : ''}`}
                      type="button"
                      onClick={() => setSelectedRole(opt.key)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <span className="mini-title">Độ khó</span>
                <div className="pills">
                  {DIFFICULTY_OPTIONS.map(opt => (
                    <button
                      key={opt.key}
                      className={`pill${selectedDifficulty === opt.key ? ' active' : ''}`}
                      type="button"
                      onClick={() => setSelectedDifficulty(opt.key)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="stats-row">
                <div className="stat">
                  <strong>{ACTIVE_HEROES.length}</strong>
                  <span>Tướng active</span>
                </div>
                <div className="stat">
                  <strong>{sTierCount}</strong>
                  <span>Tier S</span>
                </div>
                <div className="stat">
                  <strong>{avgWinrate}%</strong>
                  <span>WR tham khảo</span>
                </div>
              </div>

              <div className="filter-group">
                <span className="mini-title">Lịch sử random</span>
                <div className="history-list">
                  {history.length === 0 ? (
                    <span className="source-note">Chưa có lịch sử.</span>
                  ) : (
                    history.map((h, i) => (
                      <span key={i} className="history-item">
                        <img
                          src={h.imageUrl}
                          alt={h.name}
                          className="history-thumb"
                          loading="lazy"
                        />
                        {h.name}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <button className="btn btn-plain" type="button" onClick={resetFilters}>
                Xóa bộ lọc
              </button>
            </aside>
          </div>

          <div className="ad" data-ad-slot="mid">
            AdSense ready - Mobile banner 320x100
          </div>
        </section>

        {/* ── Team 5v5 Tab ── */}
        <section
          className={`page${activeTab === 'team' ? ' active' : ''}`}
          aria-label="Random đội 5v5"
        >
          <div className="section-title">
            <h2>Random đội 5v5</h2>
            <span>Cân bằng theo 5 lane cơ bản</span>
          </div>
          <div className="panel">
            {!teams ? (
              <div className="empty">Nhấn Random đội để tạo hai đội ngẫu nhiên.</div>
            ) : (
              <div className="team-grid">
                {(['blue', 'red'] as const).map(side => (
                  <div key={side} className="team-box">
                    <div className={`team-header ${side}`}>
                      {side === 'blue' ? '🔵 Đội Xanh' : '🔴 Đội Đỏ'}
                    </div>
                    {teams[side].map((hero, i) => (
                      <div key={i} className="team-member">
                        <img
                          src={hero.imageUrl}
                          alt={hero.name}
                          className="member-avatar"
                          loading="lazy"
                        />
                        <div>
                          <div className="member-name">{hero.name}</div>
                          <div className="member-role">{hero.laneLabel}</div>
                        </div>
                        <span className={`chip ${tierClass(hero.tier)}`}>T{hero.tier}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
            <button className="btn btn-primary" type="button" onClick={randomTeams}>
              ⚔️ Random đội 5v5
            </button>
          </div>
          <div className="ad" data-ad-slot="mid">
            AdSense ready - Mobile banner 320x100
          </div>
        </section>

        {/* ── Ban/Pick Tab ── */}
        <section
          className={`page${activeTab === 'banpick' ? ' active' : ''}`}
          aria-label="Ban Pick"
        >
          <div className="section-title">
            <h2>Ban/Pick</h2>
            <span>Trình tự chuẩn: 6 ban → 10 pick</span>
          </div>

          <div className="panel">
            {/* Status bar */}
            <div className={`bp-status${bpDone ? ' bp-status-done' : ''}`}>
              {bpStatusText}
            </div>

            {/* Ban zone */}
            <div className="bp-ban-zone">
              <div className="bp-ban-col">
                <div className="bp-ban-header blue">🔵 Cấm – Xanh</div>
                <div className="bp-slots">
                  {Array.from({ length: 3 }, (_, i) => renderBanSlot(bpState.bans.blue[i], i))}
                </div>
              </div>
              <div className="bp-ban-divider" />
              <div className="bp-ban-col">
                <div className="bp-ban-header red">🔴 Cấm – Đỏ</div>
                <div className="bp-slots">
                  {Array.from({ length: 3 }, (_, i) => renderBanSlot(bpState.bans.red[i], i))}
                </div>
              </div>
            </div>

            {/* Pick zone */}
            <div className="team-grid" style={{ marginTop: 12 }}>
              {(['blue', 'red'] as const).map(side => {
                const picks = bpState.picks[side];
                const nextPickIdx =
                  !bpDone &&
                  bpCurrent?.type === 'pick' &&
                  bpCurrent?.side === side
                    ? picks.length
                    : -1;
                return (
                  <div key={side} className="team-box">
                    <div className={`team-header ${side}`}>
                      {side === 'blue' ? '🔵 Đội Xanh' : '🔴 Đội Đỏ'}
                    </div>
                    {Array.from({ length: 5 }, (_, i) =>
                      renderPickRow(picks[i], i, i === nextPickIdx)
                    )}
                  </div>
                );
              })}
            </div>

            {/* Controls */}
            <div className="actions" style={{ marginTop: 12 }}>
              <button
                className="btn btn-primary"
                type="button"
                disabled={bpDone}
                onClick={bpNext}
              >
                {bpState.step === 0
                  ? '▶ Bắt đầu'
                  : bpCurrent?.type === 'ban'
                    ? '🚫 Cấm tướng'
                    : '⚔️ Chọn tướng'}
              </button>
              <button className="btn btn-plain" type="button" onClick={bpReset}>
                ↺ Chơi lại
              </button>
            </div>
          </div>

          <div className="ad" data-ad-slot="mid">
            AdSense ready - Mobile banner 320x100
          </div>
        </section>

        {/* ── Meta Tab ── */}
        <section
          className={`page${activeTab === 'meta' ? ' active' : ''}`}
          aria-label="Bảng meta"
        >
          <div className="section-title">
            <h2>Bảng meta</h2>
            <span>{HERO_DATA_UPDATED_AT}</span>
          </div>
          <div className="panel">
            <div id="meta-table">
              {(['S', 'A', 'B', 'C'] as const).map(tier => {
                const heroes = ACTIVE_HEROES.filter(h => h.tier === tier)
                  .sort((a, b) => b.winrate - a.winrate)
                  .slice(0, tier === 'S' ? 24 : 36);
                return (
                  <div key={tier} className={`tier-group tier-${tier}`}>
                    <div className="tier-label">
                      <span>{tierLabels[tier]}</span>
                      <span>{heroes.length} tướng</span>
                    </div>
                    <div className="tier-heroes">
                      {heroes.map(hero => (
                        <Link
                          key={hero.name}
                          href={`/tuong/${slugify(hero.name)}/`}
                          className="tier-hero"
                        >
                          <img
                            src={hero.imageUrl}
                            alt={hero.name}
                            className="tier-hero-img"
                            loading="lazy"
                            width={40}
                            height={40}
                          />
                          <div className="tier-hero-info">
                            <strong>{hero.emoji} {hero.name}</strong>
                            <span>
                              {ROLE_LABELS[hero.role] || hero.role} · {hero.winrate.toFixed(1)}%
                              WR · {difficultyText(hero.difficulty)}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="source-note">{HERO_SOURCE_NOTE}</p>
            <div className="source-links" aria-label="Nguồn dữ liệu meta">
              {HERO_SOURCES.map(src => {
                let label = src;
                try {
                  label = new URL(src).hostname.replace(/^www\./, '');
                } catch {
                  label = src;
                }
                return (
                  <a key={src} href={src} target="_blank" rel="noopener noreferrer">
                    {label}
                  </a>
                );
              })}
            </div>
          </div>
          <div className="ad" data-ad-slot="mid">
            AdSense ready - Mobile banner 320x100
          </div>
        </section>
      </main>

      <footer>
        <strong style={{ color: 'var(--gold)' }}>RandomTuong.vn</strong> - Công cụ random tướng
        Liên Quân Mobile miễn phí
        <br />
        <span>
          Không thuộc về Garena, VNG hay Tencent. Dữ liệu meta dùng để tham khảo khi ban/pick.
        </span>
        <br />
        <Link href="/privacy-policy/">Privacy Policy</Link> ·{' '}
        <a href="/sitemap.xml">Sitemap</a>
        <br />
        <span>© 2026 RandomTuong.vn</span>
      </footer>
    </>
  );
}
