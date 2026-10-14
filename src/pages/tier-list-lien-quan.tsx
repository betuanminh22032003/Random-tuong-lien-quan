import Link from 'next/link';
import { HEROES, HERO_DATA_UPDATED_AT, HERO_SOURCE_NOTE, ROLE_LABELS, slugify } from '@/data/heroes';
import { ROLE_PAGES, TIER_LABELS } from '@/data/site';
import { heroUrl } from '@/lib/seo';
import Seo from '@/components/Seo';
import SiteLayout from '@/components/SiteLayout';

const PATH = '/tier-list-lien-quan/';
const BREADCRUMBS = [{ name: 'Tier list Liên Quân', path: PATH }];
const ACTIVE = HEROES.filter(h => h.available !== false);
const S_TIER = ACTIVE.filter(h => h.tier === 'S').sort((a, b) => b.winrate - a.winrate);

const FAQS = [
  {
    question: 'Tier list Liên Quân 2026 có những tướng nào mạnh nhất?',
    answer: `Theo bảng meta tham khảo của RandomTuong.vn, nhóm Tier S hiện gồm ${S_TIER.slice(0, 8)
      .map(h => h.name)
      .join(', ')} và một số tướng khác. Tier dùng để tham khảo khi random và ban/pick.`,
  },
  {
    question: 'Tier list này có phải số liệu chính thức của Garena không?',
    answer:
      'Không. Garena không công bố winrate public. Danh sách tướng, ảnh và kỹ năng lấy từ Garena, còn tier/winrate là metadata tham khảo của RandomTuong.vn.',
  },
];

export default function TierListPage() {
  return (
    <>
      <Seo
        title="Tier List Liên Quân Mobile 2026 - Bảng Xếp Hạng Tướng Mạnh Nhất | RandomTuong.vn"
        description={`Tier list Liên Quân Mobile 2026: xếp hạng ${ACTIVE.length} tướng theo tier S, A, B, C và theo vai trò. Tướng mạnh nên ban/pick: ${S_TIER.slice(0, 5)
          .map(h => h.name)
          .join(', ')}.`}
        path={PATH}
        keywords="tier list liên quân, tier list liên quân 2026, tướng mạnh liên quân, meta liên quân, bảng xếp hạng tướng liên quân"
        breadcrumbs={BREADCRUMBS}
        faqs={FAQS}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Tier S Liên Quân Mobile',
            itemListElement: S_TIER.map((hero, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: hero.name,
              url: heroUrl(slugify(hero.name)),
            })),
          },
        ]}
      />

      <SiteLayout breadcrumbs={BREADCRUMBS}>
        <section className="hero-banner">
          <p className="eyebrow">{HERO_DATA_UPDATED_AT}</p>
          <h1>Tier List Liên Quân Mobile 2026</h1>
          <p>Bảng xếp hạng tướng tham khảo theo tier và vai trò — dùng để ban/pick và random có chiến thuật.</p>
        </section>

        <main className="shell">
          <div className="tier-table-wrap panel">
            <table className="tier-table">
              <thead>
                <tr>
                  <th scope="col">Tier</th>
                  {ROLE_PAGES.map(page => (
                    <th key={page.role} scope="col">
                      <Link href={`/vai-tro/${page.slug}/`}>
                        {page.emoji} {page.label}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(['S', 'A', 'B', 'C'] as const).map(tier => (
                  <tr key={tier} className={`tier-row tier-${tier}`}>
                    <th scope="row">
                      <span className={`tier-badge tier-${tier}`}>{tier}</span>
                    </th>
                    {ROLE_PAGES.map(page => (
                      <td key={page.role}>
                        {ACTIVE.filter(h => h.tier === tier && h.role === page.role)
                          .sort((a, b) => b.winrate - a.winrate)
                          .map(hero => (
                            <Link
                              key={hero.name}
                              href={`/tuong/${slugify(hero.name)}/`}
                              className="tier-cell-hero"
                              title={`${hero.name} · ${ROLE_LABELS[hero.role]}`}
                            >
                              <img src={hero.imageUrl} alt={hero.name} loading="lazy" width={40} height={40} />
                              <span>{hero.name}</span>
                            </Link>
                          ))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="tier-legend">
            {(['S', 'A', 'B', 'C'] as const).map(tier => (
              <span key={tier}>{TIER_LABELS[tier]}</span>
            ))}
          </div>

          <section className="seo-copy" style={{ marginTop: 18 }}>
            <h2>Cách dùng tier list khi ban/pick</h2>
            <p>
              Tier S là nhóm tướng nên ưu tiên cấm hoặc chọn sớm. Tier A ổn định để leo rank, Tier B và C
              phát huy tốt trong đội hình phù hợp. Muốn thử thách bản thân? Dùng{' '}
              <Link href="/?tab=banpick">Ban/Pick ngẫu nhiên</Link> hoặc{' '}
              <Link href="/mini-game/thu-thach-random/">Vòng quay thử thách</Link>.
            </p>
            <p className="source-note">{HERO_SOURCE_NOTE}</p>
            <div className="faq-list" style={{ marginTop: 12 }}>
              {FAQS.map(item => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        </main>
      </SiteLayout>
    </>
  );
}
