import type { ReactNode } from 'react';
import Seo from './Seo';
import SiteLayout from './SiteLayout';

interface InfoPageProps {
  path: string;
  title: string;
  description: string;
  h1: string;
  lead: string;
  children: ReactNode;
}

/** Plain text page (Giới thiệu, Liên hệ, Điều khoản…). */
export default function InfoPage({ path, title, description, h1, lead, children }: InfoPageProps) {
  const breadcrumbs = [{ name: h1, path }];
  return (
    <>
      <Seo title={title} description={description} path={path} breadcrumbs={breadcrumbs} />
      <SiteLayout breadcrumbs={breadcrumbs}>
        <section className="hero-banner">
          <h1>{h1}</h1>
          <p>{lead}</p>
        </section>
        <main className="privacy-container">
          <div className="privacy-panel">{children}</div>
        </main>
      </SiteLayout>
    </>
  );
}
