# PDP v1 Spec — council NO-SHIP remediation

Date: 2026-07-28. Branch: `fix/shopli-pdp-council-20260728` (off current `main`).
Re-applies `kimi/shopli-pdp-reviews-1785112687` (2 commits) with all 7 Grok-council
blocking findings fixed.

## Goal
Ship product detail pages (PDPs) that ProductCard deep-links to, with clean
schema, real content, and zero fake-review / serverless-storage risk.

## Key decision (council finding #2)
**Option (b): read-only PDPs in v1.** No review submission, no on-site review
storage, no `AggregateRating` anywhere until a real moderated review system
exists (Neon-backed, gated — follow-up task, out of scope here). This is the
smallest sane scope and simultaneously resolves findings #1 (fake seeds),
#2 (fs JSON on Vercel) and #5 (open POST).

## Changes by finding
1. **Fake seeds** — `data/reviews.json` deleted; not shipped.
2. **Serverless storage** — `lib/reviews.ts` deleted (option b above).
3. **Schema conflict** — collection/compare listing schemas keep pointing at
   on-site PDP URLs but NO LONGER emit `ratingValue`/`reviewCount` for those
   URLs. PDP `productJsonLd` emits no `aggregateRating`. AliExpress
   rating/reviewCount remain as *labeled visible text* only
   ("4.7 on AliExpress · 2,341 reviews"), never in JSON-LD.
4. **Thin PDPs** — PDPs gain generated unique content from structured product
   data via new `lib/pdp.ts`: templated meta description (price, discount,
   shipping, category — not just title), specs table, pros/cons, FAQ (3 Qs),
   related collections. Indexed (no noindex) because content is no longer thin.
5. **Open POST** — review form + POST handling in `getServerSideProps` deleted.
6. **Sitemap parity** — demo catalog extracted to `lib/demo-products.ts`
   (single source of truth, was triplicated). Sitemap lists PDPs for exactly
   that catalog per region; no `reviews.json` fs read. Dynamic AliExpress PDPs
   are discovered via links, not sitemap (standard for search-driven catalogs).
7. **Rebase** — branch cut from current `main` (www.tryshopli.com canonical,
   Neon newsletter, admin). All PDP URLs built from `SITE_URL` (www).

## Files
- NEW `lib/demo-products.ts` — shared demo catalog (PDP + compare/index + sitemap)
- NEW `lib/pdp.ts` — description/specs/pros-cons/FAQ/related-collections builders
- NEW `pages/[region]/product/[id].tsx` — PDP (from branch, reviews stripped, content enriched)
- NEW `tests/` + `tsconfig.test.json` — node:test suite (tsc-compiled, zero new deps)
- MOD `components/ProductCard.tsx` — deep-link to PDP (from branch)
- MOD `pages/[region]/collection/[collection].tsx`, `compare/[slug].tsx`,
  `compare/index.tsx` — PDP schema URLs, no AggregateRating on PDP URLs;
  compare/index uses shared demo catalog
- MOD `pages/sitemap.xml.tsx` — PDP urls from shared catalog
- MOD `styles/globals.css` — keyframes (from branch, review-item class dropped)
- DEL `data/reviews.json`, `lib/reviews.ts`, `components/Reviews.tsx`

## Acceptance criteria
- `npx tsc --noEmit` clean; `npm test` green.
- No `AggregateRating` in any emitted JSON-LD; no `reviews.json`/`lib/reviews.ts`.
- PDP meta description != product.title; PDP body contains specs/pros-cons/FAQ sections.
- Sitemap PDP locs = `{SITE_URL}/{region}/product/{demoId}` for all regions, www host.
- No POST handler / review form on PDP.
