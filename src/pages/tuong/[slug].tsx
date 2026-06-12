import Head from 'next/head';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { HEROES, Hero, slugify, ROLE_LABELS } from '@/data/heroes';
import { absoluteUrl, DEFAULT_OG_IMAGE, heroUrl, SITE_NAME } from '@/lib/seo';

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
  const officialRoles = hero.officialRoleLabels?.length ? hero.officialRoleLabels : [roleVi];
  const diffText = difficultyText(hero.difficulty);
  const heroSlug = slugify(hero.name);
  const canonicalUrl = heroUrl(heroSlug);

  const title = `${hero.name} Liên Quân - Kỹ năng, vai trò, random | RandomTuong.vn`;
  const description = `${hero.name} là tướng ${officialRoles.join(
    ', '
  )} trong Liên Quân Mobile. Xem ảnh, vai trò chính thức, bộ kỹ năng từ Garena và random ${hero.name} theo đội hình.`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Thing',
      name: hero.name,
      description,
      image: hero.imageUrl || DEFAULT_OG_IMAGE,
      url: canonicalUrl,
      sameAs: hero.sourceUrl,
      isPartOf: {
        '@type': 'VideoGame',
        name: 'Liên Quân Mobile',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Random Tướng Liên Quân', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: hero.name, item: canonicalUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `${hero.name} là tướng vai trò gì trong Liên Quân?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${hero.name} có vai trò chính thức là ${officialRoles.join(', ')} theo dữ liệu Garena được RandomTuong.vn crawl lại.`,
          },
        },
        {
          '@type': 'Question',
          name: `Có thể random ${hero.name} không?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Có. Bạn có thể dùng RandomTuong.vn để random ${hero.name}, random đội 5v5 hoặc ban/pick cùng các tướng Liên Quân khác.`,
          },
        },
      ],
    },
  ];

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
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large" />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="vi" href={canonicalUrl} />
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:locale" content="vi_VN" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:image" content={hero.imageUrl || DEFAULT_OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={hero.imageUrl || DEFAULT_OG_IMAGE} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <header className="site-header">
        <h1 style={{ fontSize: 'clamp(18px, 4vw, 26px)' }}>RandomTuong.vn</h1>
        <p>Dữ liệu tướng Liên Quân Mobile crawl từ Garena</p>
      </header>

      <div className="hero-detail">
        <Link href="/" className="back-link">
          ← Về trang chủ
        </Link>

        <div className="hero-detail-card">
          <div className="hero-detail-portrait">
            {hero.imageUrl ? (
              <img src={hero.imageUrl} alt={`Ảnh tướng ${hero.name}`} loading="eager" />
            ) : (
              <span>{hero.emoji}</span>
            )}
          </div>
          <h1 className="hero-detail-name">{hero.name}</h1>
          <div className="chips" style={{ justifyContent: 'center', marginBottom: '8px' }}>
            <span
              className={`chip ${tierClass(hero.tier)}`}
              style={{ fontSize: '14px', padding: '6px 14px' }}
            >
              Tier {hero.tier}
            </span>
            {officialRoles.map(role => (
              <span className="chip" key={role}>
                {role}
              </span>
            ))}
          </div>

          <p className="source-note" style={{ margin: '10px auto 0', maxWidth: '560px' }}>
            Ảnh, vai trò chính thức và kỹ năng được lấy từ Garena. Tier, lane, độ khó và winrate là
            metadata tham khảo để app random/ban-pick hoạt động.
          </p>
        </div>

        <div className="panel" style={{ marginBottom: '16px' }}>
          <div className="hero-info-grid">
            <div className="hero-info-item">
              <span className="label">Vai trò chính thức</span>
              <span className="value">{officialRoles.join(', ')}</span>
            </div>
            <div className="hero-info-item">
              <span className="label">Vai trò app</span>
              <span className="value">{roleVi}</span>
            </div>
            <div className="hero-info-item">
              <span className="label">Vai trò phụ</span>
              <span className="value">
                {ROLE_LABELS[hero.secondaryRole] || hero.secondaryRole || 'Chưa gán'}
              </span>
            </div>
            <div className="hero-info-item">
              <span className="label">Lane gợi ý</span>
              <span className="value">{hero.lane}</span>
            </div>
            <div className="hero-info-item">
              <span className="label">Độ khó app</span>
              <span className="value" style={{ letterSpacing: '2px' }}>
                {diffText}
              </span>
            </div>
            <div className="hero-info-item">
              <span className="label">Tier meta</span>
              <span className="value" style={{ color: tierColorMap[hero.tier] }}>
                Tier {hero.tier} · {hero.winrate.toFixed(1)}% WR
              </span>
            </div>
          </div>

          <div className="official-source">
            <a href={hero.sourceUrl} target="_blank" rel="noopener noreferrer">
              Mở trang nguồn Garena
            </a>
          </div>

          <div style={{ marginTop: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link href={`/?role=${hero.role}`} className="btn btn-primary" style={{ flex: '1 1 200px' }}>
              🎲 Random tướng {roleVi} ngay
            </Link>
            <Link href="/" className="btn btn-plain" style={{ flex: '1 1 140px' }}>
              Xem tất cả tướng
            </Link>
          </div>
        </div>

        {hero.skills.length > 0 && (
          <div className="panel" style={{ marginBottom: '16px' }}>
            <div className="detail-section-title">Bộ kỹ năng từ Garena</div>
            <div className="hero-skills">
              {hero.skills.map((skill, index) => (
                <article className="hero-skill-card" key={`${skill.name}-${index}`}>
                  <div className="skill-index">{index === 0 ? 'Nội tại' : `Chiêu ${index}`}</div>
                  <h2>{skill.name}</h2>
                  <p>{skill.description}</p>
                </article>
              ))}
            </div>
          </div>
        )}

        {sameTierHeroes.length > 0 && (
          <div className="panel" style={{ marginBottom: '16px' }}>
            <div className="detail-section-title" style={{ color: tierColorMap[hero.tier] }}>
              Tướng cùng Tier {hero.tier} ({sameTierHeroes.length})
            </div>
            <div className="same-tier-grid">
              {sameTierHeroes.slice(0, 20).map(h => (
                <Link key={h.name} href={`/tuong/${slugify(h.name)}/`} className="same-tier-card">
                  <img
                            src={h.imageUrl}
                            alt={h.name}
                            className="tier-hero-img"
                            loading="lazy"
                            width={40}
                            height={40}
                          />
                  <strong>
                    {h.name}
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
        <Link href="/privacy-policy/">Privacy Policy</Link> · <a href="/sitemap.xml">Sitemap</a>
        <br />
        <span>© 2026 RandomTuong.vn</span>
      </footer>
    </>
  );
}
