/**
 * Above-fold home hero copy + CTA invariants (t_90541a24).
 *
 * After #37 (t_2ecfa746) bounce only eased 56.1%→52.2% and 0% of /eu sessions
 * reach halfway. Push a sharper outcome/CTA above the fold and keep the deal
 * preview inside the first mobile viewport. Demand cliff (983→~258) is diagnosed
 * in the PR body (GSC/index/pixel) — not solved by copy alone.
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
  /** Trust line under the CTA — stays visible if chips wrap off-screen. */
  ctaHint: string;
  chips: HomeHeroChip[];
  previewHeading: string;
  previewSub: string;
  /** Per-card micro-CTA on deal preview tiles. */
  dealCtaLabel: string;
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
      eyebrow: 'שופלי — דילים חיים להיום',
      title: 'חסכו על דילים מאליאקספרס — מסוננים היום',
      description:
        'מחירים ב' +
        sym +
        ', משלוח חינם בבחירות שלנו, סינון איכות. לחצו לדילים — בלי לגלול.',
      ctaLabel: 'לדילים של היום',
      ctaHint: 'בלי הרשמה · משלוח חינם בבחירות',
      chips: [
        { icon: 'truck', label: 'משלוח חינם בבחירות' },
        { icon: 'tag', label: `מחירים ב-${sym}` },
        { icon: 'shield', label: 'סינון איכות' },
        { icon: 'clock', label: 'מתעדכן היום' },
      ],
      previewHeading: 'דילים מעל הקיפול',
      previewSub: 'ארבעה פריטים חיים — בלי לגלול',
      dealCtaLabel: 'לדיל',
    };
  }

  // EN + other LTR locales share outcome-focused copy; EU gets Europe framing
  // because it is the dominant English landing after the compare kill.
  const isEu = region === 'eu';
  return {
    eyebrow: isEu ? 'LIVE EU DEALS · UPDATED TODAY' : 'LIVE DEALS · UPDATED TODAY',
    title: isEu
      ? 'Save on AliExpress deals that ship to Europe'
      : 'Save on live AliExpress deals, curated for you',
    description: isEu
      ? `EUR prices, EU free-shipping picks, quality-filtered. Tap today's deals — no scroll, no signup.`
      : `Priced in ${sym}, free-shipping picks, quality-filtered. Tap today's deals — no scroll, no signup.`,
    ctaLabel: isEu ? "Shop today's EU deals" : "Shop today's deals",
    ctaHint: isEu
      ? 'EUR · free-shipping picks · no account needed'
      : `${sym} · free-shipping picks · no account needed`,
    chips: [
      { icon: 'truck', label: isEu ? 'EU free-shipping picks' : 'Free-shipping picks' },
      { icon: 'tag', label: isEu ? 'Priced in €' : `Priced in ${sym}` },
      { icon: 'shield', label: 'Quality-filtered' },
      { icon: 'clock', label: 'Updated today' },
    ],
    previewHeading: isEu ? "Today's EU picks" : "Today's picks",
    previewSub: 'Four live deals — shop without scrolling',
    dealCtaLabel: 'View deal',
  };
}

/** Secondary hero actions must never use btn-primary (sole Browse CTA). */
export function isHomeSecondaryCtaClass(className: string): boolean {
  return !/\bbtn-primary\b/.test(className);
}

/** Mobile-first hero padding — keep CTA + deal strip inside ~first viewport. */
export function homeHeroSectionClass(): string {
  // Tighter than legacy pt-16/sm:pt-20 so CTA + 4 deals fit a mobile first paint.
  return 'max-w-7xl mx-auto px-4 sm:px-6 pt-10 sm:pt-12 pb-4 md:pt-14 md:pb-6';
}
