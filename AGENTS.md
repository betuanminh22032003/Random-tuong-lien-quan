# AGENTS.md

## Project Shape

This repository is `RandomTuong.vn`, a Vietnamese Next.js 14 static app for randomizing Liên Quân Mobile heroes, 5v5 teams, ban/pick slots, and hero detail pages.

- App routes live in `src/pages/`.
- Shared styles live in `src/styles/globals.css`.
- Canonical hero data lives in `src/data/heroes.ts`.
- `heroes-data.js` is the legacy browser-global export generated from the same crawl script.
- `scripts/crawl-garena-heroes.mjs` crawls Garena public hero pages and rewrites both hero data files.
- Static public assets live in `public/`; root-level HTML/assets are legacy/static-export compatibility files.

## Working Rules

- Prefer small, scoped edits that preserve the current static-export behavior.
- Keep Vietnamese UX copy and SEO metadata natural, concise, and consistent with the existing tone.
- Treat Garena-sourced fields as source data: hero names, official roles, image URLs, source URLs, and skill text should come from the crawl output or verified official pages.
- Treat `tier`, `winrate`, `difficulty`, `lane`, `emoji`, and app role mapping as app metadata. Do not present them as official Garena stats.
- When changing hero data manually, update both `src/data/heroes.ts` and `heroes-data.js`, or rerun the crawl script so they stay aligned.
- Preserve route slugs produced by `slugify`; changing slug behavior affects generated detail page URLs and SEO.
- Do not remove AdSense/GA placeholders unless the task explicitly asks for monetization cleanup.
- Use `Get-Content -LiteralPath` for paths containing brackets, such as `src/pages/tuong/[slug].tsx`.

## Commands

- Install dependencies: `npm.cmd install`
- Dev server: `npm.cmd run dev`
- Production build/static export: `npm.cmd run build`
- Refresh Garena data: `node scripts/crawl-garena-heroes.mjs`

PowerShell may block `npm.ps1` and `npx.ps1` on this machine. Use `npm.cmd` and `npx.cmd`.

## Validation

- Run `npm.cmd run build` after code, routing, data-shape, or SEO changes.
- For crawl/data changes, inspect the generated hero count, spot-check a few hero detail pages, and confirm `src/data/heroes.ts` and `heroes-data.js` were both updated.
- For frontend/layout changes, verify mobile and desktop views. The first screen should stay focused on the usable randomizer, not a marketing landing page.

## Coding Notes

- This app uses TypeScript, React 18, and the Pages Router.
- Keep dependencies minimal. Add a package only when it clearly reduces real complexity.
- Keep fixed-format UI pieces stable with explicit dimensions or responsive constraints so random states do not shift the layout.
- Do not add nested decorative cards, large hero marketing sections, or one-note color rewrites unless requested.
