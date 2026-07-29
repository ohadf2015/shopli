import type { SearchProduct } from './aliexpress';
import { COLLECTIONS, type CollectionDef } from './collections';

/**
 * PDP content builders — generate unique, structured content per product so
 * PDPs are not thin pages (spec: docs/PDP-V1-SPEC.md, council finding #4).
 * Localized he/en (he = rtl); other region languages fall back to English.
 */

export interface SpecRow {
  label: string;
  value: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

const t = (rtl: boolean, he: string, en: string) => (rtl ? he : en);

export function buildPdpDescription(p: SearchProduct, rtl: boolean): string {
  const price = p.price.toFixed(2);
  const parts: string[] = [
    t(rtl, `${p.title} במחיר ${price} ${p.currency}`, `${p.title} for ${price} ${p.currency}`),
  ];
  if (p.originalPrice && p.originalPrice > p.price && p.discount) {
    parts.push(
      t(
        rtl,
        `במקום ${p.originalPrice.toFixed(2)} — חיסכון של ${p.discount}`,
        `down from ${p.originalPrice.toFixed(2)} — save ${p.discount}`
      )
    );
  }
  parts.push(
    p.freeShipping
      ? t(rtl, 'משלוח חינם', 'free shipping')
      : t(rtl, 'בתוספת דמי משלוח', 'plus shipping')
  );
  if (p.categoryPath) {
    parts.push(t(rtl, `בקטגוריית ${p.categoryPath}`, `in ${p.categoryPath}`));
  }
  return parts.join(t(rtl, ' · ', ' · ')) + '.';
}

export function buildPdpSpecs(p: SearchProduct, rtl: boolean): SpecRow[] {
  const rows: SpecRow[] = [
    { label: t(rtl, 'מחיר', 'Price'), value: `${p.price.toFixed(2)} ${p.currency}` },
  ];
  if (p.originalPrice && p.originalPrice > p.price) {
    rows.push({
      label: t(rtl, 'מחיר מקורי', 'Original price'),
      value: `${p.originalPrice.toFixed(2)} ${p.currency}`,
    });
  }
  if (p.discount) rows.push({ label: t(rtl, 'הנחה', 'Discount'), value: p.discount });
  if (p.categoryPath) rows.push({ label: t(rtl, 'קטגוריה', 'Category'), value: p.categoryPath });
  if (p.shopName) rows.push({ label: t(rtl, 'מוכר', 'Seller'), value: p.shopName });
  rows.push({
    label: t(rtl, 'משלוח', 'Shipping'),
    value: p.freeShipping ? t(rtl, 'חינם', 'Free') : t(rtl, 'בתשלום', 'Paid'),
  });
  if (p.volume > 0) {
    rows.push({
      label: t(rtl, 'נמכרו', 'Sold'),
      value: t(rtl, `${p.volume.toLocaleString('he-IL')}+ יחידות`, `${p.volume.toLocaleString('en-US')}+ units`),
    });
  }
  return rows;
}

export function buildPdpProsCons(
  p: SearchProduct,
  rtl: boolean
): { pros: string[]; cons: string[] } {
  const pros: string[] = [];
  const cons: string[] = [];
  if (p.rating >= 90) {
    pros.push(
      t(rtl, `דירוג חיובי גבוה (${p.rating}%) באלי אקספרס`, `High positive rating (${p.rating}%) on AliExpress`)
    );
  } else if (p.rating > 0) {
    cons.push(t(rtl, `דירוג בינוני בלבד (${p.rating}%)`, `Moderate rating only (${p.rating}%)`));
  }
  if (p.freeShipping) {
    pros.push(t(rtl, 'משלוח חינם', 'Free shipping'));
  } else {
    cons.push(t(rtl, 'המשלוח בתשלום', 'Shipping is not free'));
  }
  if (p.originalPrice && p.originalPrice > p.price) {
    pros.push(
      t(
        rtl,
        `מבצע פעיל — ${p.discount || 'מחיר מופחת'}`,
        `Active deal — ${p.discount || 'reduced price'}`
      )
    );
  }
  if (p.volume >= 10000) {
    pros.push(
      t(rtl, `מוצר פופולרי — מעל ${p.volume.toLocaleString('en-US')} רכישות`, `Popular — over ${p.volume.toLocaleString('en-US')} orders`)
    );
  }
  cons.push(t(rtl, 'זמן משלוח ארוך יחסית (משלוח בינלאומי)', 'Relatively long international shipping time'));
  return { pros, cons };
}

export function buildPdpFaq(p: SearchProduct, rtl: boolean): FaqItem[] {
  return [
    {
      q: t(rtl, 'כמה עולה המשלוח?', 'How much is shipping?'),
      a: p.freeShipping
        ? t(rtl, 'המשלוח למוצר זה חינם דרך אלי אקספרס.', 'Shipping for this item is free via AliExpress.')
        : t(
            rtl,
            'דמי המשלוח מחושבים בקופה של אלי אקספרס לפי יעד ומהירות.',
            'Shipping is calculated at AliExpress checkout by destination and speed.'
          ),
    },
    {
      q: t(rtl, 'כמה זמן לוקח למוצר להגיע?', 'How long does delivery take?'),
      a: t(
        rtl,
        'משלוח בינלאומי מאלי אקספרס נמשך בדרך כלל 2–4 שבועות, בהתאם ליעד ולשיטת המשלוח.',
        'International AliExpress delivery typically takes 2–4 weeks depending on destination and shipping method.'
      ),
    },
    {
      q: t(rtl, 'איפה משלימים את הרכישה?', 'Where do I complete the purchase?'),
      a: t(
        rtl,
        'הרכישה מתבצעת באלי אקספרס — לחצו על כפתור הקנייה ותועברו לעמוד המוצר המאובטח.',
        'Checkout happens on AliExpress — hit the buy button and you will be redirected to the secure product page.'
      ),
    },
    {
      q: t(rtl, 'מה מדיניות ההחזרות?', 'What is the return policy?'),
      a: t(
        rtl,
        'החזרות מטופלות לפי מדיניות ההגנה על הקונים של אלי אקספרס.',
        'Returns are handled under the AliExpress buyer-protection policy.'
      ),
    },
  ];
}

/** Rank collections by keyword overlap with product title/category. */
export function relatedCollections(p: SearchProduct, limit = 4): CollectionDef[] {
  const hay = `${p.title} ${p.category} ${p.categoryPath}`.toLowerCase();
  const scored = COLLECTIONS.map((c) => {
    let score = 0;
    for (const kw of c.keywords || []) {
      for (const token of kw.toLowerCase().split(/\s+/)) {
        if (token.length > 3 && hay.includes(token)) score += 1;
      }
    }
    return { c, score };
  });
  const matched = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score);
  const picked = (matched.length > 0 ? matched : scored).slice(0, limit).map((s) => s.c);
  return picked;
}

/**
 * v1 schema rule (spec finding #3): listing schemas (collection/compare) whose
 * product URL is an on-site PDP must NOT emit AggregateRating — Shopli has no
 * on-site ratings yet, and AliExpress-scale ratings must not be attributed to
 * our PDP URLs. When the URL is not a PDP (no product id), existing behavior
 * is preserved by passing the page's own values in `whenNotPdp`.
 */
export function listingAggregateFields(
  p: { id?: string },
  whenNotPdp: { ratingValue?: number; reviewCount?: number }
): { ratingValue?: number; reviewCount?: number } {
  if (p.id) return { ratingValue: undefined, reviewCount: undefined };
  return whenNotPdp;
}
