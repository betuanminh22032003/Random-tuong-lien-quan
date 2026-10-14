import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { HEROES, slugify } from '@/data/heroes';
import { GUIDES, Guide, guideBySlug } from '@/data/guides';
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/seo';
import Seo from '@/components/Seo';
import SiteLayout from '@/components/SiteLayout';
import RichText from '@/components/RichText';

interface HeroChip {
  name: string;
  slug: string;
  imageUrl: string;
}

interface Props {
  guide: Guide;
  heroLists: Record<string, HeroChip[]>;
  related: Array<Pick<Guide, 'slug' | 'title' | 'excerpt'>>;
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: GUIDES.map(guide => ({ params: { slug: guide.slug } })),
  fallback: false,
});

// Hero chips are resolved at build time so the article bundle doesn't ship the full hero dataset.
export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const guide = guideBySlug(String(params?.slug));
  if (!guide) return { notFound: true };
  const tierOrder = { S: 0, A: 1, B: 2, C: 3 };
  const heroLists: Record<string, HeroChip[]> = {};
  guide.sections.forEach(section => {
    if (!section.heroes) return;
    const { role, difficulty, limit = 8 } = section.heroes;
    const pool = HEROES.filter(h => h.available !== false && (!role || h.role === role));
    let matches = pool.filter(h => !difficulty || h.difficulty === difficulty);
    // Some roles have very few ★ heroes; top up with the next difficulty level.
    if (difficulty && matches.length < 3) matches = pool.filter(h => h.difficulty <= difficulty + 1);
    heroLists[section.id] = matches
      .sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier] || b.winrate - a.winrate)
      .slice(0, limit)
      .map(h => ({ name: h.name, slug: slugify(h.name), imageUrl: h.imageUrl }));
  });
  const related = GUIDES.filter(g => g.slug !== guide.slug)
    .slice(0, 3)
    .map(({ slug, title, excerpt }) => ({ slug, title, excerpt }));
  return { props: { guide, heroLists, related } };
};

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export default function GuidePage({ guide, heroLists, related }: Props) {
  const path = `/huong-dan/${guide.slug}/`;
  const breadcrumbs = [
    { name: 'Cẩm nang', path: '/huong-dan/' },
    { name: guide.title, path },
  ];

  return (
    <>
      <Seo
        title={`${guide.title} | ${SITE_NAME}`}
        description={guide.description}
        path={path}
        type="article"
        keywords={guide.keywords}
        breadcrumbs={breadcrumbs}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: guide.title,
            description: guide.description,
            image: DEFAULT_OG_IMAGE,
            datePublished: guide.published,
            dateModified: guide.updated,
            inLanguage: 'vi-VN',
            mainEntityOfPage: absoluteUrl(path),
            author: { '@type': 'Organization', name: SITE_NAME, url: absoluteUrl('/gioi-thieu/') },
            publisher: { '@type': 'Organization', name: SITE_NAME, url: absoluteUrl('/') },
          },
        ]}
      />

      <SiteLayout breadcrumbs={breadcrumbs}>
        <article className="article">
          <header className="hero-banner compact">
            <h1>{guide.title}</h1>
            <p className="article-meta">
              Cập nhật {formatDate(guide.updated)} · {SITE_NAME}
            </p>
          </header>

          <div className="article-body">
            <nav className="toc" aria-label="Mục lục">
              <strong>Mục lục</strong>
              <ol>
                {guide.sections.map(section => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.heading}</a>
                  </li>
                ))}
              </ol>
            </nav>

            {guide.sections.map(section => {
              const ListTag = section.ordered ? 'ol' : 'ul';
              return (
                <section key={section.id}>
                  <h2 id={section.id}>{section.heading}</h2>
                  {section.paragraphs?.map(text => (
                    <p key={text}>
                      <RichText text={text} />
                    </p>
                  ))}
                  {heroLists[section.id]?.length > 0 && (
                    <div className="hero-inline-list">
                      {heroLists[section.id].map(hero => (
                        <Link key={hero.slug} href={`/tuong/${hero.slug}/`}>
                          <img src={hero.imageUrl} alt="" loading="lazy" width={28} height={28} />
                          {hero.name}
                        </Link>
                      ))}
                    </div>
                  )}
                  {section.list && (
                    <ListTag>
                      {section.list.map(item => (
                        <li key={item}>
                          <RichText text={item} />
                        </li>
                      ))}
                    </ListTag>
                  )}
                </section>
              );
            })}
          </div>

          <section className="related-guides">
            <div className="section-title">
              <h2>Bài viết khác</h2>
              <Link href="/huong-dan/">Tất cả →</Link>
            </div>
            <div className="guide-grid">
              {related.map(item => (
                <Link key={item.slug} href={`/huong-dan/${item.slug}/`} className="guide-card">
                  <strong>{item.title}</strong>
                  <span>{item.excerpt}</span>
                </Link>
              ))}
            </div>
          </section>
        </article>
      </SiteLayout>
    </>
  );
}
