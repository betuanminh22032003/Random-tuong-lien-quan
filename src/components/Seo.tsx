import Head from 'next/head';
import { absoluteUrl, DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/seo';

export interface Crumb {
  name: string;
  path: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

interface SeoProps {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  keywords?: string;
  noindex?: boolean;
  breadcrumbs?: Crumb[];
  faqs?: FaqItem[];
  jsonLd?: Array<Record<string, unknown>>;
}

/** One place for title/description/canonical/OG/Twitter + JSON-LD on every page. */
export default function Seo({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  keywords,
  noindex = false,
  breadcrumbs,
  faqs,
  jsonLd = [],
}: SeoProps) {
  const url = absoluteUrl(path);
  const graph: Array<Record<string, unknown>> = [...jsonLd];

  if (breadcrumbs?.length) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [{ name: 'Trang chủ', path: '/' }, ...breadcrumbs].map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: absoluteUrl(crumb.path),
      })),
    });
  }

  if (faqs?.length) {
    graph.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  }

  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta
        name="robots"
        content={noindex ? 'noindex,follow' : 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1'}
      />
      <link rel="canonical" href={url} />
      <link rel="alternate" hrefLang="vi" href={url} />
      <link rel="alternate" hrefLang="x-default" href={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="vi_VN" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content={title} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {graph.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      )}
    </Head>
  );
}
