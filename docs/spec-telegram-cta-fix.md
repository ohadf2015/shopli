# SPEC — Fix dead "Join Telegram" CTAs (task t_c80e5c43)

## Problem
/us and /eu footers (and hero CTAs, header nav) link to t.me/shopli_us and
t.me/shopli_eu. Both channels do not exist (t.me/s/<name> returns 302).
Header.tsx additionally falls back to `t.me/shoppingisraelnew` (a Hebrew
Israel channel) for every locale without its own channel — wrong-language
dead end for English/French/German/etc. visitors.
JSON-LD organization sameAs in lib/seo.ts also advertises the dead
t.me/shopli_eu URL.

## Interpretation (smallest sane)
Only one real, verified channel exists in the repo: `shoppingisraelnew`
(t.me/s/shoppingisraelnew returns 200), a Hebrew Israel channel. Pointing
English /us and /eu audiences at a Hebrew channel is a functional dead end,
so the chosen fix is: HIDE the Telegram CTA on locales that have no real
channel (us, eu, and all others except il/ru), and keep it only where
tgChannel is a real verified channel. No new channels, no new features.

## Files to change
1. lib/regions.ts — remove `tgChannel: 'shopli_us'` and `tgChannel: 'shopli_eu'`
   (pages already guard with `{config.tgChannel && ...}` so CTAs hide automatically).
2. components/Header.tsx — remove `|| 'shoppingisraelnew'` fallback in both
   desktop and mobile nav; render the Telegram link only when region.tgChannel is set.
3. lib/seo.ts — remove 'https://t.me/shopli_eu' from organizationJsonLd sameAs.

## Acceptance criteria
- No string 'shopli_us' or 'shopli_eu' remains in the repo source.
- REGIONS.us and REGIONS.eu have no tgChannel.
- Every tgChannel in REGIONS belongs to a verified-existing channel allowlist.
- organizationJsonLd().sameAs contains only existing channel URLs.
- tsc --noEmit passes; node --test suite passes.
