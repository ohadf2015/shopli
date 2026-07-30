# SPEC — Create @shopli_us / @shopli_eu Telegram channels (task t_56496a9c)

## Problem
/us and /eu footers (and header nav) link to t.me/shopli_us and
t.me/shopli_eu. Both channels did not exist, so the previous fix
(commit f18a92b) hid the CTAs entirely — missed signups.

Revert approach: create the channels instead of hiding the CTAs.

## Fix (code changes)
1. `lib/regions.ts` — add `tgChannel: 'shopli_eu'` to eu, `tgChannel: 'shopli_us'` to us
2. `lib/seo.ts` — add 'https://t.me/shopli_us' and 'https://t.me/shopli_eu' to organizationJsonLd sameAs
3. `tests/telegram-cta.test.ts` — update assertions and VERIFIED_CHANNELS set

## Prerequisites (human action)
- Ohad creates @shopli_us (public channel, "Shopli USA")
- Ohad creates @shopli_eu (public channel, "Shopli Europe")

Only merge `fix/add-telegram-channels` into main after both channels
are live (t.me/s/shopli_us and t.me/s/shopli_eu return HTTP 200).

## Acceptance criteria
- REGIONS.us.tgChannel === 'shopli_us'
- REGIONS.eu.tgChannel === 'shopli_eu'
- organizationJsonLd().sameAs includes t.me/shopli_us and t.me/shopli_eu
- tsc --noEmit passes
