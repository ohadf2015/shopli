# Shopli

Next.js 14 Pages Router site. Nine regions under `pages/[region]/`; Israel-only tools and guides live at the root (`/landed`, `/how-to-<store>-israel`). All copy is in TypeScript: there are no translation or markdown files.

## Commands

- `npm test` compiles `tests/` and runs them with `node --test`.
- `npm run check:copy` runs the public copy check. The deploy build runs it first and fails on any finding.

## Public copy

A page has one job and the visitor should be able to do it without scrolling. Read the page as a stranger would before and after you change it.

- **Edit, don't append.** To say something new, rewrite the section that covers it. A page that grows a new panel per change ends up with the tool buried under the panels. `scripts/check-copy.mjs` holds a line budget for the pages this has happened to.
- **The tool comes first.** On a calculator or checker page the inputs sit above every explanation.
- **Text a visitor reads holds no working notes.** No ticket or PR numbers, no tool or dataset versions, no "kept", "verified at 14:15", no strategy words. Those go in the commit message. The same applies to `data-*` attributes and JSDoc on page files.
- **Don't name or criticise other sites.** State the rule, cite the official source, and stop.
- **Claim only what the data shows.** Shopli links out to sellers and guarantees nothing, so no "guaranteed", "unbeatable" or similar. Say what was measured: prices recorded daily, orders per day, percent below the usual price.
- **Write whole sentences in the reader's language.** No arrows, no stacked `·` fragments, no English jargon inside Hebrew. A localized page gets a localized title and meta description.
- **A feature the copy promises must exist.** If the page says "paste a link", pasting a link has to do something.

## Facts and numbers

- A number that appears in copy is imported from the module that computes with it. Israel import rules (thresholds, VAT rate, sources, the date they were last checked) live in `lib/landed-cost.ts`; copy built on them lives in `lib/landed-guide.ts`.
- When a rule changes, update the constant, re-read both sources listed there, and move `IL_IMPORT_RULES_CHECKED`. Pages print that date.
- Rates that move are fetched, never typed in. The dollar rate comes from the Bank of Israel (`lib/boi-rate.js`) at build time and on `/landed` revalidation; the typed fallback carries its own date and that date is what the page shows when the lookup fails.
- Tests pass an explicit rate to the estimator. A test that depends on the site-wide rate breaks the day the rate moves.

## Content that updates itself

Prefer a page that is rebuilt from recorded data over one that needs a person to refresh it: the weekly issue (`lib/weekly.ts`) is built from the nightly price and order snapshots, and the calculator from the current exchange rate. When adding a page, ask what it will say in three months without anyone touching it.
