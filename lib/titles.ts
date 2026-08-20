/**
 * Cleanup for non-Hebrew AliExpress titles.
 *
 * Hebrew titles have their own pipeline (sanitizeHebrewTitle in
 * lib/aliexpress.ts + the LLM override table in lib/hebrew-titles.ts). The
 * English/French/German/etc. titles the affiliate API returns carry a
 * different set of machine-translation artifacts and SEO filler: misspelled
 * words ("Dislpaly"), keyword-soup duplication ("coffee press press"),
 * drop-ship boilerplate ("Hot Sale", "Free Shipping", "Dropshipping") glued
 * onto the front and back of every listing.
 *
 * This is deliberately a small, conservative, PURE function: it fixes what
 * is unambiguously broken and leaves everything else alone. A title we do
 * not recognise comes out unchanged — an over-eager rewriter would invent
 * product claims, which is worse than an ugly title.
 */

/** Known machine-translation misspellings seen on live listings. */
const MISSPELLINGS: Record<string, string> = {
  dislpaly: 'Display',
  dispaly: 'Display',
  displai: 'Display',
  earphonee: 'Earphones',
  bluetoot: 'Bluetooth',
  wireles: 'Wireless',
  rechargable: 'Rechargeable',
  silcone: 'Silicone',
  stainles: 'Stainless',
  portble: 'Portable',
  waterprof: 'Waterproof',
  foldible: 'Foldable',
  adjustible: 'Adjustable',
};

/**
 * Drop-ship boilerplate the sellers glue onto titles. Matched case-
 * insensitively as whole phrases, anywhere in the title.
 */
const FILLER_PHRASES = [
  'hot sale',
  'hot selling',
  'free shipping',
  'drop shipping',
  'dropshipping',
  'new arrival',
  'new fashion',
  'factory price',
  'wholesale price',
  'high quality',
  'best quality',
  'fast delivery',
  'in stock',
  'promotion',
];

/** Turn "press press" / "LED LED" into one word. Repeated 3+ letter words only. */
function collapseRepeatedWords(title: string): string {
  return title.replace(/\b(\w{3,})(\s+\1\b)+/gi, '$1');
}

function fixMisspellings(title: string): string {
  return title.replace(/\b\w+\b/g, (word) => MISSPELLINGS[word.toLowerCase()] ?? word);
}

function stripFiller(title: string): string {
  let out = title;
  for (const phrase of FILLER_PHRASES) {
    out = out.replace(new RegExp(`\\b${phrase.replace(/ /g, '\\s+')}\\b`, 'gi'), ' ');
  }
  return out;
}

/**
 * Clean one API title. Idempotent: cleaning a clean title changes nothing.
 * Never returns an empty string — if stripping everything would leave
 * nothing, the original title is the better answer.
 */
export function cleanTitle(title: string): string {
  const raw = String(title || '').trim();
  if (!raw) return raw;

  let out = raw;
  out = fixMisspellings(out);
  out = stripFiller(out);
  out = collapseRepeatedWords(out);
  // Boilerplate removal leaves orphaned separators and doubled spaces.
  out = out
    .replace(/\s*[,;|]\s*[,;|]+/g, ',')
    .replace(/^[\s,;|]+|[\s,;|]+$/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return out.length >= 3 ? out : raw;
}
