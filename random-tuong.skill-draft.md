---
name: random-tuong
description: |
  Project skill cho RandomTuong.vn — Next.js 14 SSG app về random tướng Liên Quân Mobile.
  Tự động kích hoạt cho mọi task liên quan đến codebase này: code review, refactor, tạo boilerplate
  component/hook/utility, debug lỗi TypeScript/Next.js/build, và viết changelog/docs.
  Trigger khi user nhắc đến: tướng, hero, random, tab, filter, SSG, next.config, heroes.ts, globals.css,
  hoặc bất kỳ file nào trong src/pages, src/data, src/styles của project này.
---

# RandomTuong.vn — Project Skill

Project-specific context và conventions cho Claude khi làm việc trong repo này.

## Stack nhanh

| Layer | Tech |
|---|---|
| Framework | Next.js 14, Pages Router, Static Export |
| Language | TypeScript strict |
| Styling | CSS thuần, CSS custom properties |
| State | React hooks only (useState, useCallback, useRef) |
| Deploy | Netlify → `out/` folder |
| Data | `src/data/heroes.ts` — bundle tĩnh, 127 tướng |

---

## Code Review & Refactor

Khi review code trong project này, kiểm tra theo thứ tự ưu tiên:

### 1. SSG Compatibility
- Mọi `window`/`document`/`localStorage` access phải nằm trong `useEffect` hoặc check `typeof window !== 'undefined'`
- Không dùng `getServerSideProps` — chỉ `getStaticProps`/`getStaticPaths`
- Dynamic import chỉ với `{ ssr: false }` nếu cần

### 2. TypeScript Strictness
- Không có `any` — nếu cần escape dùng `unknown` rồi narrow
- Props interface phải explicit, không dùng `React.FC` với implicit children
- Enum-like unions thay vì string literals mơ hồ

### 3. Performance
- `useCallback` cho mọi function được pass xuống component con hoặc dùng trong dependency array
- `useMemo` khi filter/sort `HEROES` array (127 items) trong render
- Không tạo object/array mới trong render body mà không memo

### 4. Bundle Size
- Không thêm dependency nặng (lodash, moment, date-fns toàn bộ)
- Tree-shake bằng named imports
- `next/image` không dùng được (unoptimized) — dùng `<img>` thường với lazy loading

### 5. SEO/Accessibility
- Mọi trang phải có `<Head>` với title + description unique
- Interactive elements phải có `aria-label` hoặc visible text
- `<section>` phải có `aria-label`

**Output format cho code review:**
```
## Vấn đề tìm thấy
[severity: critical/major/minor] [file:line] — mô tả ngắn + fix suggestion

## Không có vấn đề gì với
[liệt kê phần code đã đúng conventions]
```

---

## Generate Boilerplate

### New Page

```tsx
// src/pages/[ten-trang].tsx
import Head from 'next/head';
import type { GetStaticProps } from 'next';

interface Props {
  // props từ getStaticProps nếu cần
}

export default function TenTrang({}: Props) {
  return (
    <>
      <Head>
        <title>Tiêu đề | RandomTuong.vn</title>
        <meta name="description" content="Mô tả ngắn dưới 160 ký tự" />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://randomtuong.netlify.app/ten-trang/" />
      </Head>
      <main className="shell">
        {/* content */}
      </main>
    </>
  );
}
```

### New Tab trong index.tsx

Để thêm tab mới vào trang chủ:
1. Thêm key vào `TabKey` type: `type TabKey = 'random' | 'team' | 'banpick' | 'meta' | 'ten-tab-moi'`
2. Thêm vào labels array trong `<nav>`: `['🎲 Random', '👥 5v5', '🛡️ Ban/Pick', '📊 Meta', '🆕 Tab Mới']`
3. Thêm `<section className={`page${activeTab === 'ten-tab-moi' ? ' active' : ''}`} aria-label="...">`

### Custom Hook Pattern

```typescript
import { useState, useCallback } from 'react';
import type { Hero } from '@/data/heroes';

export function useTenHook() {
  // logic
}
```

### Hero Filter Utility

```typescript
export function filterHeroes(
  heroes: Hero[],
  { role, difficulty, search }: { role?: string; difficulty?: string; search?: string; }
): Hero[] {
  return heroes.filter(hero => {
    if (role && role !== 'all') {
      if (hero.role !== role && hero.secondaryRole !== role && hero.lane !== role) return false;
    }
    if (difficulty && difficulty !== 'all') {
      if (String(hero.difficulty) !== difficulty) return false;
    }
    if (search) {
      const q = normalize(search);
      if (!normalize(hero.name).includes(q)) return false;
    }
    return true;
  });
}
```

---

## Debug & Diagnose

### Build Lỗi TypeScript
1. Check `window`/`document`/`localStorage` access ngoài `useEffect`
2. Check `HEROES` array có hero nào missing required field không
3. Check `[slug].tsx` — `getStaticPaths` phải return tất cả slugs

### Lỗi phổ biến và fix

**"window is not defined"**
```typescript
// ❌ Sai
const history = JSON.parse(localStorage.getItem('key') || '[]');

// ✅ Đúng
function loadFromStorage(): Hero[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem('key') || '[]'); }
  catch { return []; }
}
```

**Build OK nhưng trang trắng trên Netlify**
→ Check `next.config.js`: `output: 'export'`, `trailingSlash: true`
→ Check `netlify.toml`: `publish = "out"`

**Hero slug 404**
→ Check `slugify()` output cho tên đặc biệt: "Azzen'Ka" → "azzenka", "D'Arcy" → "darcy"

---

## Docs & Changelog

### Format Changelog

```markdown
## [version] — YYYY-MM-DD

### Thêm mới
- Tính năng A: mô tả ngắn gọn

### Thay đổi  
- Cập nhật data tướng: X tướng mới (crawl Garena MM/DD/YYYY)

### Sửa lỗi
- Fix: mô tả bug + context
```

### Cập nhật Data Tướng — Ghi chú chuẩn

```
Cập nhật danh sách tướng từ Garena Liên Quân Mobile ngày DD/MM/YYYY.
Thêm: [tên tướng mới]
Tổng: [N] tướng active
Tier/winrate đã review thủ công theo meta mùa [Sx] 2026.
```

---

## Project Gotchas

1. **`ACTIVE_HEROES`** = `HEROES.filter(h => h.available !== false)` — dùng cái này, không dùng `HEROES` raw
2. **`slugify()` phải consistent** — cùng logic ở `getStaticPaths` và khi tạo links, cùng file `src/data/heroes.ts`
3. **Theme** set qua `data-theme` trên `<html>`, managed trong `_app.tsx` — không can thiệp trực tiếp
4. **AdSense placeholders** — giữ nguyên div `.ad` cho đến khi AdSense được duyệt
5. **Static export** — không có `rewrites`, `redirects`, `headers` trong next.config (không hoạt động với static export)
