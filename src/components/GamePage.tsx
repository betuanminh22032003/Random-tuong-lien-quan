import Link from 'next/link';
import type { ReactNode } from 'react';
import { MINI_GAMES } from '@/data/site';
import { absoluteUrl, SITE_NAME } from '@/lib/seo';
import Seo, { FaqItem } from './Seo';
import SiteLayout from './SiteLayout';

interface GamePageProps {
  slug: string;
  title: string;
  description: string;
  keywords: string;
  h1: string;
  lead: string;
  howTo: string[];
  faqs: FaqItem[];
  children: ReactNode;
}

/** Shared shell for every mini game: SEO, breadcrumbs, how-to, FAQ and cross-links. */
export default function GamePage({ slug, title, description, keywords, h1, lead, howTo, faqs, children }: GamePageProps) {
  const path = `/mini-game/${slug}/`;
  const breadcrumbs = [
    { name: 'Mini game', path: '/mini-game/' },
    { name: h1, path },
  ];
  const others = MINI_GAMES.filter(game => game.slug !== slug);

  return (
    <>
      <Seo
        title={title}
        description={description}
        path={path}
        keywords={keywords}
        breadcrumbs={breadcrumbs}
        faqs={faqs}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: h1,
            url: absoluteUrl(path),
            applicationCategory: 'GameApplication',
            operatingSystem: 'Any',
            inLanguage: 'vi-VN',
            description,
            isAccessibleForFree: true,
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND' },
            publisher: { '@type': 'Organization', name: SITE_NAME, url: absoluteUrl('/') },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: `Cách chơi ${h1}`,
            step: howTo.map((text, index) => ({ '@type': 'HowToStep', position: index + 1, text })),
          },
        ]}
      />

      <SiteLayout breadcrumbs={breadcrumbs}>
        <section className="hero-banner compact">
          <h1>{h1}</h1>
          <p>{lead}</p>
        </section>

        <main className="shell">
          {children}

          <section className="seo-grid" style={{ marginTop: 18 }}>
            <article className="seo-copy">
              <h2>Cách chơi</h2>
              <ol className="howto">
                {howTo.map(step => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>
            <aside className="faq-list">
              <h2>Câu hỏi thường gặp</h2>
              {faqs.map(item => (
                <details key={item.question}>
                  <summary>{item.question}</summary>
                  <p>{item.answer}</p>
                </details>
              ))}
            </aside>
          </section>

          <section className="game-strip">
            <div className="section-title">
              <h2>Mini game khác</h2>
              <Link href="/mini-game/">Tất cả →</Link>
            </div>
            <div className="game-grid">
              {others.map(game => (
                <Link key={game.slug} href={`/mini-game/${game.slug}/`} className="game-card">
                  <span className="game-emoji" aria-hidden="true">
                    {game.emoji}
                  </span>
                  <strong>{game.name}</strong>
                  <span>{game.tagline}</span>
                  <em>{game.players}</em>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </SiteLayout>
    </>
  );
}
