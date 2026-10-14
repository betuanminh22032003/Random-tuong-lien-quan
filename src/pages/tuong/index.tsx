import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { HEROES, HERO_DATA_UPDATED_AT, ROLE_LABELS, slugify } from '@/data/heroes';
import { ROLE_PAGES } from '@/data/site';
import { heroUrl } from '@/lib/seo';
import { normalize } from '@/lib/random';
import Seo from '@/components/Seo';
import SiteLayout from '@/components/SiteLayout';

const BREADCRUMBS = [{ name: 'Danh sách tướng', path: '/tuong/' }];

const FAQS = [
  {
    question: 'Liên Quân Mobile có bao nhiêu tướng?',
    answer: `Theo dữ liệu crawl từ Garena (${HERO_DATA_UPDATED_AT}), RandomTuong.vn đang có ${HEROES.length} tướng Liên Quân Mobile, chia theo 6 vai trò Đấu sĩ, Sát thủ, Pháp sư, Xạ thủ, Đỡ đòn và Trợ thủ.`,
  },
  {
    question: 'Xem kỹ năng tướng Liên Quân ở đâu?',
    answer:
      'Bấm vào từng tướng trong danh sách để xem ảnh, vai trò chính thức, bộ kỹ năng (nội tại và 3 chiêu) lấy từ trang Garena cùng các tướng cùng vai trò.',
  },
];

export default function HeroDirectory() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('all');

  useEffect(() => {
    if (router.isReady && typeof router.query.q === 'string') setQuery(router.query.q);
  }, [router.isReady, router.query.q]);

  const visible = useMemo(() => {
    const q = normalize(query.trim());
    return new Set(
      HEROES.filter(h => (role === 'all' || h.role === role) && (!q || normalize(h.name).includes(q))).map(
        h => h.name
      )
    );
  }, [query, role]);

  return (
    <>
      <Seo
        title={`Danh Sách ${HEROES.length} Tướng Liên Quân Mobile 2026 - Kỹ Năng, Vai Trò | RandomTuong.vn`}
        description={`Tra cứu đầy đủ ${HEROES.length} tướng Liên Quân Mobile: ảnh, vai trò chính thức, bộ kỹ năng từ Garena, lọc theo Đấu sĩ, Sát thủ, Pháp sư, Xạ thủ, Đỡ đòn, Trợ thủ.`}
        path="/tuong/"
        keywords="danh sách tướng liên quân, tướng liên quân mobile, kỹ năng tướng liên quân, tất cả tướng liên quân 2026"
        breadcrumbs={BREADCRUMBS}
        faqs={FAQS}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: 'Danh sách tướng Liên Quân Mobile',
            inLanguage: 'vi-VN',
            mainEntity: {
              '@type': 'ItemList',
              numberOfItems: HEROES.length,
              itemListElement: HEROES.map((hero, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: hero.name,
                url: heroUrl(slugify(hero.name)),
              })),
            },
          },
        ]}
      />

      <SiteLayout breadcrumbs={BREADCRUMBS}>
        <section className="hero-banner">
          <h1>Danh sách {HEROES.length} tướng Liên Quân Mobile</h1>
          <p>{HERO_DATA_UPDATED_AT} · bấm vào tướng để xem kỹ năng chi tiết</p>
        </section>

        <main className="shell">
          <div className="panel directory-filters">
            <input
              className="search"
              type="search"
              placeholder="🔍 Tìm tướng: Nakroth, Tulen, Florentino..."
              aria-label="Tìm tướng"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <div className="pills">
              <button
                type="button"
                className={`pill${role === 'all' ? ' active' : ''}`}
                onClick={() => setRole('all')}
              >
                Tất cả
              </button>
              {ROLE_PAGES.map(page => (
                <button
                  key={page.role}
                  type="button"
                  className={`pill${role === page.role ? ' active' : ''}`}
                  onClick={() => setRole(page.role)}
                >
                  {page.emoji} {page.label}
                </button>
              ))}
            </div>
            <span className="source-note">{visible.size} tướng</span>
          </div>

          <div className="hero-directory">
            {HEROES.map(hero => (
              <Link
                key={hero.name}
                href={`/tuong/${slugify(hero.name)}/`}
                className="hero-tile"
                hidden={!visible.has(hero.name)}
              >
                <img src={hero.imageUrl} alt={`Tướng ${hero.name}`} loading="lazy" width={96} height={96} />
                <strong>{hero.name}</strong>
                <span>{ROLE_LABELS[hero.role] || hero.role}</span>
                <i className={`tier-dot tier-${hero.tier}`}>{hero.tier}</i>
              </Link>
            ))}
          </div>
          {visible.size === 0 && <div className="empty">Không tìm thấy tướng phù hợp.</div>}

          <section className="seo-copy" style={{ marginTop: 18 }}>
            <h2>Tướng Liên Quân theo vai trò</h2>
            <div className="seo-links">
              {ROLE_PAGES.map(page => (
                <Link key={page.slug} href={`/vai-tro/${page.slug}/`}>
                  {page.emoji} Tướng {page.label}
                </Link>
              ))}
            </div>
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
