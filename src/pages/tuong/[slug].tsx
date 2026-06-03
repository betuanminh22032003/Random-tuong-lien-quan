import Head from 'next/head';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { HEROES, Hero, slugify, ROLE_LABELS } from '@/data/heroes';

interface Props {
  hero: Hero;
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: HEROES.map(h => ({ params: { slug: slugify(h.name) } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const hero = HEROES.find(h => slugify(h.name) === params!.slug);
  if (!hero) return { notFound: true };
  return { props: { hero } };
};

function difficultyText(level: number): string {
  return '★'.repeat(level) + '☆'.repeat(3 - level);
}

function tierClass(tier: string): string {
  return String(tier || 'B').toLowerCase();
}

export default function HeroPage({ hero }: Props) {
  const roleVi = ROLE_LABELS[hero.role] || hero.role;
  const diffText = difficultyText(hero.difficulty);
  const heroSlug = slugify(hero.name);
  const canonicalUrl = `https://randomtuong.netlify.app/tuong/${heroSlug}/`;

  const title = `${hero.name} - Tướng Liên Quân | ${roleVi} · Tier ${hero.tier} · ${hero.winrate}% WR`;
  const description = `${hero.name} là tướng ${roleVi} trong Liên Quân Mobile. Tier ${hero.tier}, winrate ${hero.winrate}%, độ khó ${diffText}. Random tướng ngay!`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Thing',
    name: hero.name,
    description: description,
    url: canonicalUrl,
  };

  // Same-tier heroes (excluding current)
  const sameTierHeroes = HEROES.filter(
    h => h.tier === hero.tier && h.name !== hero.name
  ).sort((a, b) => b.winrate - a.winrate);

  const tierColorMap: Record<string, string> = {
    S: '#ff9fb4',
    A: 'var(--gold)',
    B: 'var(--teal)',
    C: 'var(--violet)',
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content={description} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:locale" content="vi_VN" />
        <meta property="og:image" content="https://randomtuong.netlify.app/og-image.png" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <header className="site-header">
        <h1 style={{ fontSize: 'clamp(18px, 4vw, 26px)' }}>RandomTuong.vn</h1>
        <p>Random tướng Liên Quân Mobile miễn phí</p>
      </header>

      <div className="hero-detail">
        <Link href="/" className="back-link">
          ← Về trang chủ
        </Link>

        {/* Hero card */}
        <div className="hero-detail-card">
          <div className="hero-detail-avatar">{hero.emoji}</div>
          <h1 className="hero-detail-name">{hero.name}</h1>
          <div className="chips" style={{ justifyContent: 'center', marginBottom: '8px' }}>
            <span
              className={`chip ${tierClass(hero.tier)}`}
              style={{ fontSize: '14px', padding: '6px 14px' }}
            >
              Tier {hero.tier}
            </span>
            <span className="chip">{roleVi}</span>
            {hero.secondaryRole && hero.secondaryRole !== hero.role && (
              <span className="chip">{hero.secondaryRole}</span>
            )}
          </div>

          {/* Winrate bar */}
          <div className="winrate-bar">
            <div className="winrate-bar-label">
              <span>Winrate</span>
              <span style={{ color: 'var(--gold)', fontWeight: 800 }}>
                {hero.winrate.toFixed(1)}%
              </span>
            </div>
            <div className="winrate-bar-track">
              <div
                className="winrate-bar-fill"
                style={{ width: `${Math.min(hero.winrate, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="panel" style={{ marginBottom: '16px' }}>
          <div className="hero-info-grid">
            <div className="hero-info-item">
              <span className="label">Vai trò chính</span>
              <span className="value">{roleVi}</span>
            </div>
            <div className="hero-info-item">
              <span className="label">Vai trò phụ</span>
              <span className="value">
                {ROLE_LABELS[hero.secondaryRole] || hero.secondaryRole || '—'}
              </span>
            </div>
            <div className="hero-info-item">
              <span className="label">Lane</span>
              <span className="value">{hero.lane}</span>
            </div>
            <div className="hero-info-item">
              <span className="label">Độ khó</span>
              <span className="value" style={{ letterSpacing: '2px' }}>
                {diffText}
              </span>
            </div>
            <div className="hero-info-item">
              <span className="label">Winrate</span>
              <span className="value" style={{ color: 'var(--teal)' }}>
                {hero.winrate.toFixed(1)}%
              </span>
            </div>
            <div className="hero-info-item">
              <span className="label">Tier meta</span>
              <span className="value" style={{ color: tierColorMap[hero.tier] }}>
                Tier {hero.tier}
              </span>
            </div>
          </div>

          {/* CTA */}
          <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link
              href={`/?role=${hero.role}`}
              className="btn btn-primary"
              style={{ flex: '1 1 200px' }}
            >
              🎲 Random tướng {roleVi} ngay
            </Link>
            <Link href="/" className="btn btn-plain" style={{ flex: '1 1 140px' }}>
              Xem tất cả tướng
            </Link>
          </div>
        </div>

        {/* Same tier */}
        {sameTierHeroes.length > 0 && (
          <div className="panel" style={{ marginBottom: '16px' }}>
            <div
              style={{
                color: tierColorMap[hero.tier],
                fontWeight: 900,
                fontSize: '13px',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              Tướng cùng Tier {hero.tier} ({sameTierHeroes.length})
            </div>
            <div className="same-tier-grid">
              {sameTierHeroes.slice(0, 20).map(h => (
                <Link
                  key={h.name}
                  href={`/tuong/${slugify(h.name)}/`}
                  className="same-tier-card"
                >
                  <strong>
                    {h.emoji} {h.name}
                  </strong>
                  <span>
                    {ROLE_LABELS[h.role] || h.role} · {h.winrate.toFixed(1)}% WR
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Link href="/" className="back-link" style={{ marginBottom: '24px' }}>
          ← Xem tất cả tướng và random ngay
        </Link>
      </div>

      <footer>
        <strong style={{ color: 'var(--gold)' }}>RandomTuong.vn</strong> - Công cụ random tướng
        Liên Quân Mobile miễn phí
        <br />
        <span>Không thuộc về Garena, VNG hay Tencent.</span>
        <br />
        <Link href="/privacy-policy/">Privacy Policy</Link> ·{' '}
        <a href="/sitemap.xml">Sitemap</a>
        <br />
        <span>© 2026 RandomTuong.vn</span>
      </footer>
    </>
  );
}
