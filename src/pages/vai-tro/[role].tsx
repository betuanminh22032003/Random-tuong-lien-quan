import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { HEROES, Hero, slugify } from '@/data/heroes';
import { ROLE_PAGES, RolePage, TIER_LABELS } from '@/data/site';
import { heroUrl } from '@/lib/seo';
import Seo from '@/components/Seo';
import SiteLayout from '@/components/SiteLayout';

interface Props {
  page: RolePage;
  heroes: Hero[];
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: ROLE_PAGES.map(page => ({ params: { role: page.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const page = ROLE_PAGES.find(p => p.slug === params?.role);
  if (!page) return { notFound: true };
  const tierOrder = { S: 0, A: 1, B: 2, C: 3 };
  const heroes = HEROES.filter(h => h.role === page.role && h.available !== false).sort(
    (a, b) => tierOrder[a.tier] - tierOrder[b.tier] || b.winrate - a.winrate
  );
  return { props: { page, heroes } };
};

export default function RoleHeroesPage({ page, heroes }: Props) {
  const path = `/vai-tro/${page.slug}/`;
  const breadcrumbs = [
    { name: 'Danh sách tướng', path: '/tuong/' },
    { name: `Tướng ${page.label}`, path },
  ];
  const top = heroes.filter(h => h.tier === 'S' || h.tier === 'A').slice(0, 5);
  const topNames = top.map(h => h.name).join(', ');
  const faqs = [
    {
      question: `Liên Quân có bao nhiêu tướng ${page.label}?`,
      answer: `Hiện RandomTuong.vn ghi nhận ${heroes.length} tướng ${page.label} (vai trò chính) trong Liên Quân Mobile theo dữ liệu Garena.`,
    },
    {
      question: `Tướng ${page.label} nào mạnh nhất Liên Quân 2026?`,
      answer: `Theo bảng meta tham khảo của RandomTuong.vn, các tướng ${page.label} nổi bật gồm ${topNames || heroes.slice(0, 5).map(h => h.name).join(', ')}. Tier là dữ liệu tham khảo, không phải thống kê chính thức của Garena.`,
    },
    {
      question: `Làm sao random tướng ${page.label}?`,
      answer: `Bấm nút "Random tướng ${page.label}" trên trang này hoặc vào trang chủ, chọn bộ lọc ${page.label} rồi bấm Random.`,
    },
  ];

  return (
    <>
      <Seo
        title={`Tướng ${page.label} Liên Quân Mobile 2026 - ${heroes.length} Tướng Mạnh Nhất | RandomTuong.vn`}
        description={`Danh sách ${heroes.length} tướng ${page.label} Liên Quân Mobile 2026 xếp theo tier: ${topNames}... Xem kỹ năng, cách chơi và random tướng ${page.label} miễn phí.`}
        path={path}
        keywords={`tướng ${page.label.toLowerCase()} liên quân, tướng ${page.label.toLowerCase()} mạnh nhất, random tướng ${page.label.toLowerCase()}, ${page.label.toLowerCase()} liên quân 2026`}
        breadcrumbs={breadcrumbs}
        faqs={faqs}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: `Tướng ${page.label} Liên Quân Mobile`,
            numberOfItems: heroes.length,
            itemListElement: heroes.map((hero, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: hero.name,
              url: heroUrl(slugify(hero.name)),
            })),
          },
        ]}
      />

      <SiteLayout breadcrumbs={breadcrumbs}>
        <section className="hero-banner">
          <p className="eyebrow">
            {page.emoji} {heroes.length} tướng
          </p>
          <h1>Tướng {page.label} Liên Quân Mobile</h1>
          <p>{page.intro}</p>
        </section>

        <main className="shell">
          <div className="actions" style={{ marginTop: 0 }}>
            <Link href={`/?role=${page.role}`} className="btn btn-primary">
              🎲 Random tướng {page.label}
            </Link>
            <Link href="/mini-game/doan-tuong/" className="btn btn-secondary">
              🧠 Đoán tướng
            </Link>
          </div>

          {(['S', 'A', 'B', 'C'] as const).map(tier => {
            const list = heroes.filter(h => h.tier === tier);
            if (!list.length) return null;
            return (
              <div key={tier} className={`tier-group tier-${tier}`}>
                <div className="tier-label">
                  <span>{TIER_LABELS[tier]}</span>
                  <span>{list.length} tướng</span>
                </div>
                <div className="hero-directory">
                  {list.map(hero => (
                    <Link key={hero.name} href={`/tuong/${slugify(hero.name)}/`} className="hero-tile">
                      <img src={hero.imageUrl} alt={`Tướng ${hero.name}`} loading="lazy" width={96} height={96} />
                      <strong>{hero.name}</strong>
                      <span>{hero.lane}</span>
                      <i className={`tier-dot tier-${hero.tier}`}>{hero.tier}</i>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          <section className="seo-copy" style={{ marginTop: 18 }}>
            <h2>Mẹo chơi tướng {page.label}</h2>
            <p>{page.tips}</p>
            <div className="faq-list" style={{ marginTop: 12 }}>
              {faqs.map(item => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
            <h2 style={{ marginTop: 16 }}>Vai trò khác</h2>
            <div className="seo-links">
              {ROLE_PAGES.filter(p => p.slug !== page.slug).map(p => (
                <Link key={p.slug} href={`/vai-tro/${p.slug}/`}>
                  {p.emoji} Tướng {p.label}
                </Link>
              ))}
            </div>
          </section>
        </main>
      </SiteLayout>
    </>
  );
}
