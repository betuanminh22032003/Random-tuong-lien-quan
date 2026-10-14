# CLAUDE.md — RandomTuong.vn

## Project Overview

**RandomTuong.vn** — Công cụ random tướng Liên Quân Mobile cho game thủ Việt Nam.

- **Stack:** Next.js 14 (Pages Router) + TypeScript + Static Export (`output: 'export'`)
- **Deploy:** Netlify (tự động từ GitHub push)
- **Domain:** random-tuong-lien-quan.netlify.app → sau là randomtuong.vn
- **Ngôn ngữ UI:** Tiếng Việt hoàn toàn

## Architecture

```
src/
├── data/heroes.ts          ← Nguồn sự thật duy nhất: 127 tướng + interfaces
├── data/site.ts            ← Nav, MINI_GAMES, ROLE_PAGES, TEAM_LANES, TIER_LABELS
├── lib/random.ts           ← RNG có seed (link chia sẻ tái tạo đúng kết quả), shuffle, share
├── lib/theme.ts            ← ThemeContext (dark/light)
├── components/
│   ├── Seo.tsx             ← Head chung: title/description/canonical/OG + JSON-LD (breadcrumb, FAQ)
│   ├── SiteLayout.tsx      ← Top bar, breadcrumb, footer liên kết nội bộ
│   ├── GamePage.tsx        ← Khung chung cho mini game (SEO, HowTo, FAQ, game khác)
│   └── KeywordPage.tsx     ← Landing page SEO theo keyword
├── pages/
│   ├── _app.tsx            ← ThemeContext provider (localStorage)
│   ├── _document.tsx       ← HTML shell + script set theme trước khi paint
│   ├── index.tsx           ← Trang chính: Random / 5v5 / Ban-Pick / Meta tabs (?tab=, ?role=)
│   ├── mini-game/          ← Hub + doan-tuong, chia-team, thu-thach-random, dau-bai-tuong
│   ├── tuong/index.tsx     ← Danh sách tướng (lọc/tìm, ?q=)
│   ├── tuong/[slug].tsx    ← 127 trang SSG tướng (SEO)
│   ├── vai-tro/[role].tsx  ← 6 trang tướng theo vai trò
│   ├── huong-dan/          ← Cẩm nang: hub + bài viết từ data/guides.ts
│   ├── gioi-thieu.tsx, lien-he.tsx, dieu-khoan.tsx
│   ├── tier-list-lien-quan.tsx
│   └── privacy-policy.tsx  ← Trang bắt buộc cho AdSense
└── styles/globals.css      ← CSS thuần, CSS vars cho dark/light theme

public/                     ← Static assets (favicon, og-image, manifest, robots, sitemap)
scripts/
├── crawl-garena-heroes.mjs ← Crawler cập nhật heroes.ts từ Garena
└── generate-sitemap.mjs    ← postbuild: quét out/**/index.html → sitemap.xml (+ image sitemap) & robots.txt
next.config.js              ← output: 'export', trailingSlash: true, images.unoptimized: true
netlify.toml                ← build: npm run build, publish: out
```

## Key Data Structures

```typescript
// src/data/heroes.ts
interface Hero {
  name: string;
  role: 'Warrior' | 'Assassin' | 'Mage' | 'Marksman' | 'Tank' | 'Support';
  secondaryRole: string;
  lane: 'Top' | 'Jungle' | 'Mid' | 'AD' | 'Support';
  emoji: string;
  difficulty: 1 | 2 | 3;
  winrate: number;      // tham khảo, không phải Garena official
  tier: 'S' | 'A' | 'B' | 'C';
  available?: boolean;  // false = ẩn khỏi random pool
  officialRoleLabels: string[];
  imageUrl: string;
  sourceUrl: string;
  skills: HeroSkill[];
}
```

## Commands

```bash
npm run dev       # Dev server localhost:3000
npm run build     # SSG build → out/ (postbuild tự sinh sitemap.xml + robots.txt)
npm run export    # Alias cho build
```

> Không có test runner nào được cài. Verify bằng `npm run build` thành công.

## Conventions

### TypeScript
- Strict mode bật — không dùng `any`
- Mọi component props đều có explicit interface
- Utility functions thuần TypeScript (không dùng lodash)

### CSS
- **Không có CSS framework** — CSS thuần với CSS custom properties
- Dark/light theme qua `data-theme` attribute trên `<html>`
- Responsive mobile-first
- Class naming: BEM-lite (`.hero-avatar`, `.hero-avatar.spinning`)

### React / Next.js
- Pages Router (không phải App Router)
- Tất cả state dùng `useState` + `useCallback` — **không có Redux/Zustand**
- localStorage cho history và theme
- `useRef` cho interval animation
- SSG only — không có `getServerSideProps`, không có API routes

### SEO
- Mỗi trang có `<Head>` với title, description, OG tags riêng
- Schema.org JSON-LD trên trang chủ (WebApplication type)
- Canonical URL cho mỗi trang
- `slugify()` tạo URL path từ tên tướng (ví dụ: "Azzen'Ka" → "azzenka")

## Hero Data Updates

Để cập nhật data tướng mới:
```bash
node scripts/crawl-garena-heroes.mjs
# Script tự crawl từ https://lienquan.garena.vn/hoc-vien/tuong-skin/
# Output: cập nhật src/data/heroes.ts
```

Sau đó cần **manual review** tier/winrate/difficulty vì Garena không publish winrate public.

## Monetization Config

Tất cả cấu hình nằm ở `src/lib/config.ts`:
```typescript
export const APP_CONFIG = {
  gaMeasurementId: '',          // GA4 ID: G-XXXXXXXXXX → gtag tự chèn trong _document
  adsenseClient: '',            // ca-pub-XXXXXXXXXXXXXXXX → script AdSense + meta + out/ads.txt khi build
  adSlots: { top: '', mid: '' },// mã đơn vị quảng cáo (số); trống = không render ô quảng cáo
  contactEmail: '',             // hiển thị ở /lien-he/
  feedbackUrl: '...',
};
```
`<AdSlot slot="top|mid" />` không render gì khi chưa có `adsenseClient` + slot ID (không còn ô placeholder).

## Content

- Cẩm nang: bài viết trong `src/data/guides.ts` (link nội tuyến dạng `[text](/path)`), render ở `/huong-dan/[slug]/`.
- Trang thông tin bắt buộc cho AdSense: `/gioi-thieu/`, `/lien-he/`, `/dieu-khoan/`, `/privacy-policy/`.

## Deployment Flow

1. Push lên GitHub `master` branch (dự án cá nhân — push thẳng `master`)
2. Netlify tự chạy `npm run build` → publish `out/`
3. Không có CI/CD tests — build success = deploy success

## Constraints

- **Static export only** — không thể dùng dynamic routes với `fallback`, không có server-side logic
- **No external API calls** ở runtime — mọi data đều bundle vào build
- **No image optimization** (`unoptimized: true`) — dùng Netlify CDN
- **No state management library** — giữ đơn giản, chỉ `useState`
- **Bundle size quan trọng** — không thêm heavy dependencies

## Common Tasks

### Thêm tướng mới
Chạy crawler hoặc thêm thủ công vào `HEROES` array trong `src/data/heroes.ts`. Giữ đúng interface `Hero`.

### Thêm mini game / trang mới
Tạo file trong `src/pages/` (mini game: dùng `GamePage`, thêm vào `MINI_GAMES`). Sitemap tự cập nhật sau build — không cần sửa danh sách route.

### Thêm tab mới
1. Thêm key vào `TabKey` type
2. Thêm button vào `<nav className="tabs">`
3. Thêm `<section className="page">` với logic tương ứng

### Sửa CSS theme
Các CSS variables định nghĩa trong `src/styles/globals.css` dưới `:root[data-theme="dark"]` và `:root[data-theme="light"]`.

### Debug build lỗi
```bash
npm run build 2>&1 | head -50
```
Lỗi phổ biến: TypeScript strict, `window` access trong SSG context (dùng `typeof window !== 'undefined'`).
