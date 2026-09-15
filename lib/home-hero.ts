/**
 * Above-fold home hero copy + CTA invariants (t_2ecfa746).
 *
 * After #28 killed dead compare landings, /eu became the dominant path
 * (148 visits @ 56.1% bounce). Visitors leave before scrolling to trending —
 * so the first viewport must carry concrete value + one primary exit.
 */

import type { IconName } from '../components/icons';

export const HOME_PRIMARY_CTA_CLASS = 'btn-primary';

/** Sole primary CTA — always the trending index, never a seasonal collection. */
export function homePrimaryCtaHref(region: string): string {
  return `/${region}/trending`;
}

export interface HomeHeroChip {
  icon: IconName;
  label: string;
}

export interface HomeHeroCopy {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  chips: HomeHeroChip[];
  previewHeading: string;
  previewSub: string;
}

export function homeHeroCopy(opts: {
  region: string;
  lang: string;
  rtl: boolean;
  currencySymbol: string;
}): HomeHeroCopy {
  const { region, rtl, currencySymbol } = opts;
  const sym = currencySymbol || '€';

  if (rtl) {
    return {
      eyebrow: 'שופלי — דילים חיים',
      title: 'דילים חיים מאליאקספרס — מסוננים בשבילכם',
      description:
        'מחירים ב' +
        sym +
        ', משלוח חינם בבחירות שלנו, סינון איכות. דילוג על הגלילה — עברו לדילים עכשיו.',
      ctaLabel: 'כל המבצעים',
      chips: [
        { icon: 'truck', label: 'משלוח חינם בבחירות' },
        { icon: 'tag', label: `מחירים ב-${sym}` },
        { icon: 'shield', label: 'סינון איכות' },
        { icon: 'clock', label: 'מתעדכן מדי יום' },
      ],
      previewHeading: 'דילים מעל הקיפול',
      previewSub: 'ארבעה פריטים חיים — בלי לגלול',
    };
  }

  // English + other LTR locales share outcome-focused EN copy; EU gets
  // Europe-specific framing because it is the dominant English landing.
  const isEu = region === 'eu';
  return {
    eyebrow: isEu ? 'SHOPLI — LIVE EU DEALS' : 'SHOPLI — LIVE DEALS',
    title: isEu
      ? 'AliExpress deals that ship to Europe — curated daily'
      : 'Live AliExpress deals, curated for you',
    description: isEu
      ? `EUR prices, free-shipping picks, quality-filtered. Skip the scroll — browse today's deals now.`
      : `Priced in ${sym}, free-shipping picks, quality-filtered. Skip the scroll — browse today's deals now.`,
    ctaLabel: 'Browse All Deals',
    chips: [
      { icon: 'truck', label: isEu ? 'EU free-shipping picks' : 'Free-shipping picks' },
      { icon: 'tag', label: isEu ? 'Priced in €' : `Priced in ${sym}` },
      { icon: 'shield', label: 'Quality-filtered' },
      { icon: 'clock', label: 'Updated daily' },
    ],
    previewHeading: 'Deals above the fold',
    previewSub: 'Four live picks — no scroll required',
  };
}

/** Secondary hero actions must never use btn-primary (sole Browse CTA). */
export function isHomeSecondaryCtaClass(className: string): boolean {
  return !/\bbtn-primary\b/.test(className);
}
