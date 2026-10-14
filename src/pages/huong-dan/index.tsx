import Link from 'next/link';
import { GUIDES } from '@/data/guides';
import { absoluteUrl } from '@/lib/seo';
import Seo from '@/components/Seo';
import SiteLayout from '@/components/SiteLayout';

const PATH = '/huong-dan/';
const BREADCRUMBS = [{ name: 'Cẩm nang', path: PATH }];

export default function GuidesHub() {
  return (
    <>
      <Seo
        title="Cẩm Nang Liên Quân Mobile - Hướng Dẫn, Mẹo Leo Rank, Ban/Pick | RandomTuong.vn"
        description="Cẩm nang Liên Quân Mobile cho người mới và người chơi cùng bạn bè: tướng dễ chơi, 5 vị trí trong trận, cách ban/pick, mẹo leo rank và luật chơi custom."
        path={PATH}
        keywords="hướng dẫn liên quân, cẩm nang liên quân, mẹo liên quân, liên quân cho người mới"
        breadcrumbs={BREADCRUMBS}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Cẩm nang Liên Quân Mobile',
            itemListElement: GUIDES.map((guide, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: guide.title,
              url: absoluteUrl(`/huong-dan/${guide.slug}/`),
            })),
          },
        ]}
      />

      <SiteLayout breadcrumbs={BREADCRUMBS}>
        <section className="hero-banner">
          <p className="eyebrow">{GUIDES.length} bài viết</p>
          <h1>Cẩm nang Liên Quân Mobile</h1>
          <p>Hướng dẫn cho người mới, mẹo leo rank, ban/pick và luật chơi vui cùng bạn bè.</p>
        </section>
        <main className="shell">
          <div className="guide-grid">
            {GUIDES.map(guide => (
              <Link key={guide.slug} href={`/huong-dan/${guide.slug}/`} className="guide-card">
                <strong>{guide.title}</strong>
                <span>{guide.excerpt}</span>
                <em>Đọc bài →</em>
              </Link>
            ))}
          </div>
        </main>
      </SiteLayout>
    </>
  );
}
