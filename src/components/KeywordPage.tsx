import Link from 'next/link';
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/seo';
import { MINI_GAMES } from '@/data/site';
import Seo from './Seo';
import SiteLayout from './SiteLayout';

export interface KeywordFaq {
  question: string;
  answer: string;
}

export interface KeywordPageProps {
  slug: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  sections: Array<{
    heading: string;
    body: string;
  }>;
  faqs: KeywordFaq[];
  primaryCta: string;
  ctaHref?: string;
  keywords?: string;
}

export default function KeywordPage({
  slug,
  title,
  description,
  h1,
  lead,
  sections,
  faqs,
  primaryCta,
  ctaHref = '/',
  keywords,
}: KeywordPageProps) {
  const canonicalPath = `/${slug}/`;
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      url: absoluteUrl(canonicalPath),
      description,
      inLanguage: 'vi-VN',
      image: DEFAULT_OG_IMAGE,
      isPartOf: {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: absoluteUrl('/'),
      },
    },
  ];
  const breadcrumbs = [{ name: h1, path: canonicalPath }];

  return (
    <>
      <Seo
        title={title}
        description={description}
        path={canonicalPath}
        keywords={keywords}
        breadcrumbs={breadcrumbs}
        faqs={faqs}
        jsonLd={jsonLd}
      />

      <SiteLayout breadcrumbs={breadcrumbs}>
      <section className="hero-banner">
        <h1>{h1}</h1>
        <p>{lead}</p>
      </section>


      <main className="privacy-container keyword-page">
        <section className="privacy-panel">
          <div className="actions keyword-actions">
            <Link href={ctaHref} className="btn btn-primary">
              {primaryCta}
            </Link>
            <Link href="/mini-game/" className="btn btn-plain">
              🎮 Mini game chơi với bạn
            </Link>
          </div>

          {sections.map(section => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}

          <h2>Câu hỏi thường gặp</h2>
          <div className="faq-list keyword-faq">
            {faqs.map(item => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>

          <p className="keyword-related">
            <Link href="/random-tuong-lien-quan/">Random tướng Liên Quân</Link>
            {' · '}
            <Link href="/random-doi-lien-quan/">Random đội Liên Quân</Link>
            {' · '}
            <Link href="/ban-pick-lien-quan/">Ban/Pick Liên Quân</Link>
            {' · '}
            <Link href="/tier-list-lien-quan/">Tier list Liên Quân</Link>
            {MINI_GAMES.map(game => (
              <span key={game.slug}>
                {' · '}
                <Link href={`/mini-game/${game.slug}/`}>{game.name}</Link>
              </span>
            ))}
          </p>
        </section>
      </main>

      </SiteLayout>
    </>
  );
}
