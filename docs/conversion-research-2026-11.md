# Conversion research, November 2026

Goal: more visitors click through to AliExpress and buy.

## Where we stand (Growth Radar, 2026-11-21)
- 27 visitors in 7 days. Most sessions start on a product page (top: /uk/product/1005012466633371, arriving from chatgpt.com) and end on the same page.
- At this volume no UI change can be measured with significance. Traffic is the main limit; the page should still not waste the visitors it gets.

## What competitors do
| Site | Buy CTA | Trust / urgency | Capture |
|---|---|---|---|
| mydealz.de | deal title is the link | expiry date range, commission note | Deal-Alarm |
| hotukdeals.com | deal title is the link | code in text, commission note | Create alert |
| pricespy.co.uk | "from £379 at Amazon +4 shops" | stars + review count, discount badge | none visible |
| zap.co.il | "השוואת מחירים", "החל מ-" | shipping terms on every card | newsletter |
| kneli.co.il | card link | -% badge, struck original price, coupon "expired" tags | email, footer social icons |
| Honey (PayPal) | extension | price-history badge on the product page | Droplist alerts (30/60/90 days) |
| Keepa | extension | price history | alerts by email, push or Telegram |

Slickdeals, CamelCamelCamel and Wirecutter blocked fetching and were not checked.

## Evidence on CTA patterns
- Sticky mobile buy bar: Zipify +10% add-to-cart clicks, +9% orders at 95% confidence (zipify.com/mobile-sticky-button-split-test-results); CRE reported larger lifts without sample sizes; other tests flat.
- Low-commitment wording ("View deal") over "Buy now" for visitors who are not ready yet: CRE "safe step" principle, no lift figure.
- Price on the button: no gain in VWO's Artsy test.
- Price charts did not reduce sales in a European retailer field experiment (J. Interactive Marketing, 2011).

## What we changed on the product page
- The buy button sits directly under the price on every screen size, with a trust line (rating share, orders, buyer protection) and a commission note next to it.
- Wording: "View deal on AliExpress" instead of "Buy now", in every site language, not only English and Hebrew.
- Share buttons moved out of the buy row.
- Related collections match whole words (an office chair no longer links to Hair Coloring because "chair" contains "hair") and show nothing when nothing matches.
- Image column stays in view on desktop instead of leaving an empty block; the title is clamped on phones so the price and button come up sooner.

## Next bets, ranked
1. Distribution: the page converts nothing if nobody lands on it. Telegram channel (bot needs admin rights), Pinterest with disclosure.
2. Price-drop alert on the product page (Honey, Keepa, mydealz all have one); Telegram as the channel for Israel.
3. Coupon codes with copy button and expiry, where the seller publishes one.
