import Head from 'next/head';
import Link from 'next/link';
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/seo';

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
}: KeywordPageProps) {
  const canonicalUrl = absoluteUrl(`/${slug}/`);
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      url: canonicalUrl,
      description,
      inLanguage: 'vi-VN',
      image: DEFAULT_OG_IMAGE,
      isPartOf: {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: absoluteUrl('/'),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Random Tướng Liên Quân', item: absoluteUrl('/') },
        { '@type': 'ListItem', position: 2, name: h1, item: canonicalUrl },
      ],
    },
  ];

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
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="vi_VN" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <header className="site-header">
        <h1>{h1}</h1>
        <p>{lead}</p>
      </header>

      <main className="privacy-container keyword-page">
        <section className="privacy-panel">
          <div className="actions keyword-actions">
            <Link href="/" className="btn btn-primary">
              {primaryCta}
            </Link>
            <Link href="/#meta-table" className="btn btn-plain">
              Xem bảng meta
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
            <Link href="/">Trang chủ RandomTuong.vn</Link>
          </p>
        </section>
      </main>

      <footer>
        <strong style={{ color: 'var(--gold)' }}>RandomTuong.vn</strong>
        <br />
        <Link href="/">Trang chủ</Link> · <a href="/sitemap.xml">Sitemap</a>
        <br />
        <span>© 2026 RandomTuong.vn</span>
      </footer>
    </>
  );
}
