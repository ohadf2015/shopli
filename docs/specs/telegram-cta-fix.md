# Spec: Fix dead "Join Telegram" CTAs

**Goal**  
Remove dead Telegram channel links from `/us` and `/eu`, verify `/il`, and make sure no locale renders a Telegram CTA unless the repo actually knows about a real channel for that locale.

**Background / smallest sane interpretation**  
- The repo only references three Telegram channels: `@shopli_us`, `@shopli_eu`, and `@shoppingisraelnew`.  
- `@shopli_us` and `@shopli_eu` were verified dead on 2026-07-28 (kanban card `t_c80e5c43`).  
- `@shoppingisraelnew` is the only channel still referenced as a fallback and is used by the `il` and `ru` configs.  
- There is no verified US/EU channel, so the correct fix is to **hide** the CTA on those locales, not invent or repurpose a channel.  
- The Header currently always renders a Telegram link and falls back to `shoppingisraelnew`, which would re-introduce a real-but-wrong link for `us`/`eu` if we only cleared the config. Therefore the Header must become conditional too.

**Files to change**  
1. `lib/regions.ts` — remove `tgChannel` from `us` and `eu`; add `getTelegramChannelUrl(config)` helper.  
2. `components/Header.tsx` — only render Telegram links when a channel URL exists; remove the fallback default.  
3. `pages/[region]/index.tsx` — use the helper for the hero and bottom CTA links.  
4. `lib/seo.ts` — derive `organizationJsonLd().sameAs` from the region configs instead of hard-coding dead channels.  
5. `lib/regions.test.ts` — add minimal Node built-in tests for the acceptance criteria.  
6. `package.json` — wire up `npm test` to run the new test file (via `tsx`).

**Acceptance criteria**  
- [ ] `REGIONS.us.tgChannel` and `REGIONS.eu.tgChannel` are `undefined`.  
- [ ] `REGIONS.il.tgChannel` and `REGIONS.ru.tgChannel` are still `'shoppingisraelnew'`.  
- [ ] No source file references `shopli_us` or `shopli_eu`.  
- [ ] `getTelegramChannelUrl(REGIONS.us)` returns `undefined`; `getTelegramChannelUrl(REGIONS.il)` returns `https://t.me/shoppingisraelnew`.  
- [ ] `organizationJsonLd().sameAs` only contains URLs derived from existing region configs and excludes dead channels.  
- [ ] `tsc --noEmit` passes.  
- [ ] `npm test` passes.
