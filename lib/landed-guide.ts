/**
 * Copy and small helpers for the Israel import calculator (/landed) and the
 * per-store guides (/how-to-<store>-israel). Every number in the copy comes
 * from lib/landed-cost.ts, so the text can't drift from the estimator.
 */

import {
  DUTY_FREE_THRESHOLD_USD,
  DUTY_WAIVER_CEILING_USD,
  IL_VAT_RATE,
  BOI_CUSTOMS_FX_UPLIFT,
  USD_TO_ILS_RATE,
  estimateLandedCost,
  estimateKitLandedCost,
  type LandedCostInput,
} from './landed-cost';

const FREE = DUTY_FREE_THRESHOLD_USD;
const CEILING = DUTY_WAIVER_CEILING_USD;
const VAT_PCT = Math.round(IL_VAT_RATE * 100);
const FX_PCT = (BOI_CUSTOMS_FX_UPLIFT * 100).toFixed(1);

export type ImportBand = 'exempt' | 'vat-only' | 'full';

export function classifyImportBand(usdGoods: number): ImportBand | null {
  const n = Number(usdGoods);
  if (!Number.isFinite(n) || n <= 0) return null;
  if (n < FREE) return 'exempt';
  if (n < CEILING) return 'vat-only';
  return 'full';
}

export interface ImportBandRow {
  id: ImportBand;
  titleHe: string;
  detailHe: string;
}

export function importBandRowsHe(): ImportBandRow[] {
  return [
    {
      id: 'exempt',
      titleHe: `מתחת ל-$${FREE}: בלי מע״מ ובלי מכס`,
      detailHe:
        'הסכום נבדק על מחיר המוצרים בלבד. המשלוח לא נספר, כל עוד הוא מופיע בהזמנה בנפרד.',
    },
    {
      id: 'vat-only',
      titleHe: `מ-$${FREE} ועד $${CEILING}: מע״מ ${VAT_PCT}%, בלי מכס`,
      detailHe: `המע״מ מחושב על מחיר המוצרים יחד עם המשלוח, ועל כל הסכום ולא רק על מה שמעל $${FREE}.`,
    },
    {
      id: 'full',
      titleHe: `מעל $${CEILING}: מע״מ, ולפעמים גם מכס`,
      detailHe:
        'חלק מהמוצרים חייבים גם במכס או במס קנייה, לפי סוג המוצר. המחשבון מציג כאן מע״מ בלבד, ולכן הסכום האמיתי יכול להיות גבוה יותר.',
    },
  ];
}

/** True when every item alone is exempt but the parcel as a whole is not. */
export function orderLosesExemption(
  skus: LandedCostInput[],
  usdIls: number = USD_TO_ILS_RATE
): boolean {
  const singles = (skus || [])
    .map((sku) => estimateLandedCost(sku, usdIls))
    .filter((est): est is NonNullable<typeof est> => est != null);
  const order = estimateKitLandedCost(skus, usdIls);
  if (singles.length < 2 || !order) return false;
  return singles.every((s) => s.dutyFree) && !order.dutyFree;
}

export interface Faq {
  question: string;
  answer: string;
}

export function landedFaqHe(): Faq[] {
  return [
    {
      question: `הפטור של $${FREE} הוא לכל מוצר או לכל ההזמנה?`,
      answer:
        `לכל החבילה. אם הזמנתם שלושה מוצרים של $30 באותו משלוח, הערך שנבדק הוא $90 ותשלמו מע״מ על הכול. ` +
        'גם שתי חבילות מאותו מוכר שנשלחו בהפרש של עד 72 שעות נחשבות למשלוח אחד.',
    },
    {
      question: `דמי המשלוח נספרים בתקרת ה-$${FREE}?`,
      answer:
        'לא, כל עוד דמי המשלוח מופיעים בהזמנה בנפרד ממחיר המוצרים. אם אי אפשר להפריד ביניהם, הבדיקה נעשית על הסכום הכולל. ' +
        'מעל התקרה המע״מ מחושב גם על המשלוח.',
    },
    {
      question: 'יש מס על הזמנות מטמו, משיין או מאליאקספרס?',
      answer:
        `הכללים זהים לכל אתר בחו״ל, כי המס נקבע לפי ערך החבילה ולא לפי החנות. מתחת ל-$${FREE} אין מס, ` +
        `ומ-$${FREE} ועד $${CEILING} משלמים מע״מ של ${VAT_PCT}%.`,
    },
    {
      question: 'לפי איזה שער דולר מחשבים?',
      answer:
        `המכס משתמש בשער היציג של בנק ישראל בתוספת ${FX_PCT}%, לפי היום שבו החבילה משתחררת. ` +
        'המחשבון מתעדכן לפי השער היציג האחרון שפורסם, ולכן התוצאה קרובה מאוד אבל לא סופית.',
    },
    {
      question: 'מה המחשבון לא כולל?',
      answer:
        `דמי טיפול שדואר ישראל או חברת השילוח גובים כשיש מס לשלם, מכס ומס קנייה על מוצרים מעל $${CEILING}, ` +
        'ומס קנייה על מוצרים מסוימים כמו טלוויזיות וחלקי חילוף לרכב. על אלכוהול וטבק אין פטור בכלל.',
    },
    {
      question: 'התקרה לא עלתה ל-$130?',
      answer:
        `בין 25 בפברואר ל-1 ביוני 2026 הפטור ניתן עד $130, ומאז הוא חזר ל-$${FREE}. ` +
        'הכללים השתנו כמה פעמים בשנה האחרונה, ולכן אנחנו בודקים אותם שוב ומציינים בעמוד מתי נבדקו לאחרונה.',
    },
  ];
}

export type MarketplaceHowToId =
  | 'etsy' | 'ebay' | 'walmart' | 'aliexpress' | 'amazonjp' | 'shein' | 'temu'
  | 'flipkart' | 'amazonus' | 'amazonindia' | 'myntra' | 'costco' | 'macys';

export interface MarketplaceHowToSpec {
  id: MarketplaceHowToId;
  nameEn: string;
  path: string;
}

export const MARKETPLACE_HOW_TOS: readonly MarketplaceHowToSpec[] = [
  { id: 'aliexpress', nameEn: 'AliExpress', path: '/how-to-aliexpress-israel' },
  { id: 'temu', nameEn: 'Temu', path: '/how-to-temu-israel' },
  { id: 'shein', nameEn: 'Shein', path: '/how-to-shein-israel' },
  { id: 'amazonus', nameEn: 'Amazon US', path: '/how-to-amazonus-israel' },
  { id: 'ebay', nameEn: 'eBay', path: '/how-to-ebay-israel' },
  { id: 'etsy', nameEn: 'Etsy', path: '/how-to-etsy-israel' },
  { id: 'walmart', nameEn: 'Walmart', path: '/how-to-walmart-israel' },
  { id: 'costco', nameEn: 'Costco', path: '/how-to-costco-israel' },
  { id: 'macys', nameEn: "Macy's", path: '/how-to-macys-israel' },
  { id: 'amazonjp', nameEn: 'Amazon Japan', path: '/how-to-amazonjp-israel' },
  { id: 'amazonindia', nameEn: 'Amazon India', path: '/how-to-amazonindia-israel' },
  { id: 'flipkart', nameEn: 'Flipkart', path: '/how-to-flipkart-israel' },
  { id: 'myntra', nameEn: 'Myntra', path: '/how-to-myntra-israel' },
];

export function getMarketplaceHowTo(id: MarketplaceHowToId): MarketplaceHowToSpec {
  const found = MARKETPLACE_HOW_TOS.find((m) => m.id === id);
  if (!found) throw new Error(`unknown marketplace how-to: ${id}`);
  return found;
}

export interface HowToExample {
  goodsUsd: number;
  goodsIls: number;
  vatIls: number;
  totalIls: number;
  band: ImportBand;
}

/** One worked order per band, so a reader sees the jump at each line. */
export function howToExamples(usdIls: number = USD_TO_ILS_RATE): HowToExample[] {
  return [50, 120, 600].map((goodsUsd) => {
    const est = estimateLandedCost({ price: goodsUsd, currency: 'USD', freeShipping: true }, usdIls)!;
    return {
      goodsUsd,
      goodsIls: est.priceIls,
      vatIls: est.vatIls,
      totalIls: est.totalIls,
      band: classifyImportBand(goodsUsd)!,
    };
  });
}

export function howToFaqEn(store: string): Faq[] {
  return [
    {
      question: `Is there tax on orders from ${store} to Israel?`,
      answer:
        `It depends on the value of the parcel. If the goods are worth less than $${FREE}, there is no VAT and no customs. ` +
        `From $${FREE} up to $${CEILING} you pay ${VAT_PCT}% VAT, and above $${CEILING} some products also owe customs or purchase tax.`,
    },
    {
      question: `Is the $${FREE} limit per item or per order?`,
      answer:
        'Per parcel. Three $30 items shipped together count as $90, and VAT is then charged on all of it. ' +
        'Parcels from the same seller sent within 72 hours of each other are treated as one shipment.',
    },
    {
      question: `Does shipping count toward the $${FREE} limit?`,
      answer:
        'Not when the shipping cost is listed separately from the goods. If the two cannot be told apart, the total is used. ' +
        'Once VAT applies, it is charged on the goods and the shipping together.',
    },
    {
      question: 'Which exchange rate does customs use?',
      answer:
        `The Bank of Israel representative rate plus ${FX_PCT}%, on the day the parcel is released. ` +
        'The examples on this page use the latest published rate, so expect small differences.',
    },
  ];
}
