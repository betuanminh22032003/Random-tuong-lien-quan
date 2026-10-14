import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { HEROES, Hero, slugify, ROLE_LABELS } from '@/data/heroes';
import { DEFAULT_OG_IMAGE, heroUrl } from '@/lib/seo';
import { MINI_GAMES, rolePageFor } from '@/data/site';
import Seo, { Crumb } from '@/components/Seo';
import SiteLayout from '@/components/SiteLayout';

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

  const rolePage = rolePageFor(hero.role);
  const breadcrumbs: Crumb[] = [
    { name: 'Tướng', path: '/tuong/' },
    ...(rolePage ? [{ name: `Tướng ${rolePage.label}`, path: `/vai-tro/${rolePage.slug}/` }] : []),
    { name: hero.name, path: `/tuong/${heroSlug}/` },
  ];

  const faqs = [
    {
      question: `${hero.name} là tướng vai trò gì trong Liên Quân?`,
      answer: `${hero.name} có vai trò chính thức là ${officialRoles.join(', ')} theo dữ liệu Garena được RandomTuong.vn crawl lại. Lane gợi ý trong app: ${hero.lane}.`,
    },
    {
      question: `${hero.name} có khó chơi không?`,
      answer: `Theo thang độ khó tham khảo của RandomTuong.vn, ${hero.name} ở mức ${diffText} (${
        hero.difficulty === 1 ? 'dễ' : hero.difficulty === 2 ? 'vừa' : 'khó'
      }).`,
    },
    {
      question: `Có thể random ${hero.name} không?`,
      answer: `Có. Bạn có thể dùng RandomTuong.vn để random ${hero.name}, random đội 5v5, ban/pick hoặc chơi mini game đoán tướng cùng các tướng Liên Quân khác.`,
    },
  ];

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
  ];

  const sameRoleHeroes = HEROES.filter(h => h.role === hero.role && h.name !== hero.name).slice(0, 12);

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
      <Seo
        title={title}
        description={description}
        path={`/tuong/${heroSlug}/`}
        image={hero.imageUrl || DEFAULT_OG_IMAGE}
        type="article"
        breadcrumbs={breadcrumbs}
        faqs={faqs}
        jsonLd={jsonLd}
      />

      <SiteLayout breadcrumbs={breadcrumbs}>

      <div className="hero-detail">
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
            {rolePage && (
              <Link href={`/vai-tro/${rolePage.slug}/`} className="btn btn-plain" style={{ flex: '1 1 140px' }}>
                {rolePage.emoji} Tất cả tướng {rolePage.label}
              </Link>
            )}
            <Link href="/mini-game/doan-tuong/" className="btn btn-secondary" style={{ flex: '1 1 140px' }}>
              🧠 Chơi đoán tướng
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

        {rolePage && (
          <div className="panel" style={{ marginBottom: '16px' }}>
            <div className="detail-section-title">Cách chơi {hero.name} theo vai trò {rolePage.label}</div>
            <p className="source-note" style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>
              {rolePage.intro} {rolePage.tips} {hero.name} được xếp độ khó {diffText} và lane gợi ý {hero.lane}
              {hero.difficulty === 1
                ? ' — phù hợp cho người mới tập vai trò này.'
                : hero.difficulty === 3
                  ? ' — nên luyện ở chế độ thường trước khi mang vào xếp hạng.'
                  : '.'}{' '}
              Xem thêm <Link href="/huong-dan/vi-tri-trong-lien-quan/">nhiệm vụ của từng vị trí</Link> và{' '}
              <Link href="/huong-dan/tuong-de-choi-cho-nguoi-moi/">tướng dễ chơi cho người mới</Link>.
            </p>
          </div>
        )}

        {sameRoleHeroes.length > 0 && (
          <div className="panel" style={{ marginBottom: '16px' }}>
            <div className="detail-section-title">
              Tướng {roleVi} khác ({sameRoleHeroes.length})
            </div>
            <div className="same-tier-grid">
              {sameRoleHeroes.map(h => (
                <Link key={h.name} href={`/tuong/${slugify(h.name)}/`} className="same-tier-card">
                  <img src={h.imageUrl} alt={h.name} className="tier-hero-img" loading="lazy" width={40} height={40} />
                  <strong>{h.name}</strong>
                  <span>
                    Tier {h.tier} · {difficultyText(h.difficulty)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="panel faq-inline" style={{ marginBottom: '16px' }}>
          <div className="detail-section-title">Câu hỏi về {hero.name}</div>
          {faqs.map(item => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>

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

        <div className="game-grid" style={{ marginBottom: '24px' }}>
          {MINI_GAMES.slice(0, 2).map(game => (
            <Link key={game.slug} href={`/mini-game/${game.slug}/`} className="game-card">
              <span className="game-emoji" aria-hidden="true">
                {game.emoji}
              </span>
              <strong>{game.name}</strong>
              <span>{game.tagline}</span>
            </Link>
          ))}
        </div>
      </div>

      </SiteLayout>
    </>
  );
}
