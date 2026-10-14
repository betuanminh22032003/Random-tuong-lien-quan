import { Html, Head, Main, NextScript } from 'next/document';

// Applied before first paint so light-theme users don't see a dark flash.
const THEME_BOOT = `try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t==='light'?'light':'dark')}catch(e){}`;

export default function Document() {
  return (
    <Html lang="vi" data-theme="dark">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="theme-color" content="#0d0f16" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="google-site-verification" content="kWD3nX8fSKSWn05DreTITreHE4ByeiVPZQuL8DtZscM" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://lienquan.garena.vn" crossOrigin="" />
        <link rel="dns-prefetch" href="https://lienquan.garena.vn" />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
