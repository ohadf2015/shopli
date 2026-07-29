# Spec: PDP hard 404 (kill soft-404s)

**Date:** 2026-07-29  
**Branch:** `fix/pdp-hard-404` (off `fix/shopli-pdp-council-20260728`)  
**Path note:** PDP lives at `pages/[region]/product/[id].tsx` (region-scoped), not `pages/product/[id].tsx`.

## Goal

When both the AliExpress product fetch **and** the local demo catalog fallback fail, `getServerSideProps` must return `{ notFound: true }` so Next.js serves a real HTTP 404. Soft-404s (HTTP 200 + in-page “not found” + `noindex`) must not be the dual-failure path — they create crawl-scale soft-404 noise from stale deep-links, invalid ids, and API outages.

## Smallest sane interpretation

- Only change the dual-failure GSSP return shape: after AE + demo both miss, return `{ notFound: true }` (Next.js contract → 404 status).
- Demo fallback must still win when AE fails but the id is in the static catalog.
- Empty `productId` already returns `{ notFound: true }` — leave that alone.
- No PDP render redesign. The in-page not-found UI may remain as a defensive branch; GSSP will no longer feed it for the dual-failure path.
- Extract a tiny testable resolver (same dual-fetch order as today) so TDD can cover acceptance without mounting the full Next page module.

## Approach

1. Extract `resolvePdpProduct(id, region, currency, deps)` — try `getProductsByIds`, then `getDemoProductById`; return `SearchProduct | null`.
2. In GSSP: after resolve, if `null` → `{ notFound: true }`; else build props as today (product non-null).
3. Tests inject mocks for AE / demo deps (no live network).

## Files to change

1. `docs/specs/pdp-hard-404.md` — this spec (SDD).
2. `lib/pdp.ts` — add `resolvePdpProduct` (+ deps type).
3. `pages/[region]/product/[id].tsx` — GSSP uses resolver; dual-failure → `{ notFound: true }`.
4. `tests/pdp-gssp-notfound.test.ts` — acceptance tests (TDD).

## Acceptance criteria

- [x] When AE returns empty/throws **and** demo has no id → resolver returns `null`.
- [x] GSSP maps that null to `{ notFound: true }` (not `{ props: { product: null, ... } }`).
- [x] When AE fails/throws **but** demo has the id → resolver returns the demo product (non-null).
- [x] When AE returns a product → that product is used (demo not needed).
- [x] Empty productId still yields `{ notFound: true }` (existing behavior).
- [x] `npx tsc --noEmit` clean; `npm test` green.
