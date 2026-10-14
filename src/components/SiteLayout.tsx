import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ReactNode } from 'react';
import { MINI_GAMES, NAV_LINKS, ROLE_PAGES } from '@/data/site';
import { useTheme } from '@/lib/theme';
import type { Crumb } from './Seo';
import AdSlot from './AdSlot';

interface SiteLayoutProps {
  children: ReactNode;
  breadcrumbs?: Crumb[];
  showTopAd?: boolean;
}

function isActive(pathname: string, href: string): boolean {
  if (href === '/') {
    return pathname === '/' || ['/random-tuong-lien-quan', '/random-doi-lien-quan', '/ban-pick-lien-quan'].includes(pathname);
  }
  return pathname.startsWith(href.replace(/\/$/, ''));
}

export default function SiteLayout({ children, breadcrumbs, showTopAd = false }: SiteLayoutProps) {
  const { theme, setTheme } = useTheme();
  const { pathname } = useRouter();

  return (
    <>
      {showTopAd && (
        <AdSlot slot="top" variant="top" />
      )}

      <header className="topbar">
        <div className="topbar-inner">
          <Link href="/" className="brand" aria-label="RandomTuong.vn - Trang chủ">
            <span className="brand-mark" aria-hidden="true">
              RT
            </span>
            <span className="brand-text">
              Random<b>Tuong</b>
              <small>.vn</small>
            </span>
          </Link>

          <nav className="topnav" aria-label="Điều hướng chính">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`topnav-link${isActive(pathname, link.href) ? ' active' : ''}`}
                aria-current={isActive(pathname, link.href) ? 'page' : undefined}
              >
                <span className="nav-icon" aria-hidden="true">
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>

          <button
            className="theme-toggle"
            type="button"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Chuyển giao diện sáng/tối"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/">Trang chủ</Link>
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.path}>
              <span aria-hidden="true">›</span>
              {index === breadcrumbs.length - 1 ? (
                <span aria-current="page">{crumb.name}</span>
              ) : (
                <Link href={crumb.path}>{crumb.name}</Link>
              )}
            </span>
          ))}
        </nav>
      )}

      {children}

      <footer className="site-footer">
        <div className="footer-grid">
          <div>
            <strong className="footer-brand">RandomTuong.vn</strong>
            <p>
              Hệ sinh thái random tướng &amp; mini game Liên Quân Mobile miễn phí cho game thủ Việt.
              Không thuộc về Garena, VNG hay Tencent.
            </p>
          </div>
          <div>
            <h3>Công cụ</h3>
            <Link href="/random-tuong-lien-quan/">Random tướng Liên Quân</Link>
            <Link href="/random-doi-lien-quan/">Random đội 5v5</Link>
            <Link href="/ban-pick-lien-quan/">Ban/Pick Liên Quân</Link>
            <Link href="/tier-list-lien-quan/">Tier list Liên Quân</Link>
            <Link href="/tuong/">Danh sách tướng</Link>
            <Link href="/huong-dan/">Cẩm nang Liên Quân</Link>
          </div>
          <div>
            <h3>Mini game</h3>
            {MINI_GAMES.map(game => (
              <Link key={game.slug} href={`/mini-game/${game.slug}/`}>
                {game.name}
              </Link>
            ))}
          </div>
          <div>
            <h3>Vai trò</h3>
            {ROLE_PAGES.map(page => (
              <Link key={page.slug} href={`/vai-tro/${page.slug}/`}>
                Tướng {page.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="footer-bottom">
          <Link href="/gioi-thieu/">Giới thiệu</Link> · <Link href="/lien-he/">Liên hệ</Link> ·{' '}
          <Link href="/dieu-khoan/">Điều khoản</Link> · <Link href="/privacy-policy/">Chính sách bảo mật</Link> ·{' '}
          <a href="/sitemap.xml">Sitemap</a> ·{' '}
          <span>© 2026 RandomTuong.vn</span>
        </div>
      </footer>
    </>
  );
}
