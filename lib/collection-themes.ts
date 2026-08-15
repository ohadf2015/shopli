import { COLLECTIONS, type CollectionDef } from './collections';

/**
 * Seven themes over 78 collections.
 *
 * The Categories menu listed 14 of the 78 flat, and the homepage listed all of
 * them as a wall of tiles. Both are the same problem: 50 of the 78 are beauty
 * niches (skincare-routine, gua-sha-facial, eyelash-serum, …), so a shopper
 * looking for a lamp scrolled through half a cosmetics catalogue to find one.
 *
 * Grouping rather than cutting, deliberately: this is an SEO-driven site and
 * every collection page earns its own traffic, so hiding 70 of them would delete
 * 70 internal links to save a menu. A theme is one more click, not one fewer
 * page, and /[region]/collections is a real hub that links all of them.
 *
 * Membership is explicit rather than inferred from keywords: a fuzzy matcher
 * would silently drop a new collection into "other" and nobody would notice.
 * The test asserts every collection belongs to exactly one theme, so adding a
 * collection without placing it fails the build instead.
 */

export interface Theme {
  key: string;
  icon: string;
  name: Record<string, string>;
  slugs: string[];
}

export const THEMES: Theme[] = [
  {
    key: 'skin-body',
    icon: 'sparkles',
    name: { en: 'Skin & Body', he: 'עור וגוף', fr: 'Peau & Corps', de: 'Haut & Körper', es: 'Piel y Cuerpo', it: 'Pelle e Corpo' },
    slugs: [
      'skincare-routine', 'korean-skincare', 'anti-aging', 'acne-care', 'facial-tools',
      'face-masks', 'gua-sha-facial', 'facial-cleansing', 'sun-care', 'sleep-beauty',
      'eco-beauty', 'beauty-supplements', 'tanning-bronzing', 'body-butter', 'bath-body',
      'spa-at-home', 'shower-gadgets', 'hand-care', 'foot-care', 'oral-care', 'teeth-whitening',
    ],
  },
  {
    key: 'makeup-nails',
    icon: 'sparkles',
    name: { en: 'Makeup & Nails', he: 'איפור וציפורניים', fr: 'Maquillage & Ongles', de: 'Make-up & Nägel', es: 'Maquillaje y Uñas', it: 'Trucco e Unghie' },
    slugs: [
      'makeup-essentials', 'makeup-brushes', 'eye-makeup', 'lip-care', 'false-lashes',
      'makeup-organizers', 'cosmetic-bags', 'nail-care', 'manicure-pedicure', 'gel-nails',
      'nail-art', 'eyebrow-care', 'eyelash-serum',
    ],
  },
  {
    key: 'hair-grooming',
    icon: 'scissors',
    name: { en: 'Hair & Grooming', he: 'שיער וטיפוח', fr: 'Cheveux & Soins', de: 'Haare & Pflege', es: 'Cabello y Cuidado', it: 'Capelli e Cura' },
    slugs: [
      'hair-styling', 'hair-growth', 'curly-hair', 'hair-accessories', 'hair-coloring',
      'wigs-extensions', 'scalp-care', 'mens-grooming', 'beard-care', 'shavers-trimmers',
      'body-hair-removal', 'waxing-kit', 'ipl-hair-removal',
    ],
  },
  {
    key: 'fragrance',
    icon: 'flower',
    name: { en: 'Fragrance & Wellness', he: 'ניחוחות ורוגע', fr: 'Parfums & Bien-être', de: 'Duft & Wohlbefinden', es: 'Fragancia y Bienestar', it: 'Profumi e Benessere' },
    slugs: ['perfume-fragrance', 'fragrance-oils', 'aromatherapy', 'essential-oils', 'desk-wellness'],
  },
  {
    key: 'home',
    icon: 'home',
    name: { en: 'Home & Kitchen', he: 'בית ומטבח', fr: 'Maison & Cuisine', de: 'Haus & Küche', es: 'Hogar y Cocina', it: 'Casa e Cucina' },
    slugs: [
      'kitchen', 'home-bar', 'lighting', 'smart-home', 'sleep-sanctuary', 'zero-waste',
      'balcony-garden', 'microgreens', 'tea-ceremony', 'coffee-ritual', 'home-office', 'dorm-room',
    ],
  },
  {
    key: 'tech',
    icon: 'bulb',
    name: { en: 'Tech & Gaming', he: 'טכנולוגיה וגיימינג', fr: 'Tech & Gaming', de: 'Technik & Gaming', es: 'Tecnología y Gaming', it: 'Tech e Gaming' },
    slugs: [
      'wireless-audio', 'phone-accessories', 'gaming-gear', 'gadgets-under-10',
      'content-creator', 'maker-lab', 'car',
    ],
  },
  {
    key: 'outdoors',
    icon: 'package',
    name: { en: 'Out & About', he: 'בחוץ ובדרכים', fr: 'Sorties & Voyages', de: 'Unterwegs', es: 'Aire Libre', it: 'Fuori Casa' },
    slugs: [
      'travel', 'camping', 'home-gym', 'pet', 'summer-essentials', 'back-to-school',
      'halloween', 'jewelry-making',
    ],
  },
];

export interface ThemeGroup extends Theme {
  collections: Array<{ slug: string; name: string; icon?: string }>;
}

const collectionName = (c: CollectionDef, lang: string) =>
  (c.name || c.tag || {})[lang] || (c.name || c.tag || {}).en || c.slug;

/** Themes with their collections resolved and localized, empty themes dropped. */
export function getThemeGroups(lang = 'en'): ThemeGroup[] {
  return THEMES.map((t) => ({
    ...t,
    collections: t.slugs
      .map((slug) => COLLECTIONS.find((c) => c.slug === slug))
      .filter((c): c is CollectionDef => Boolean(c))
      .map((c) => ({ slug: c.slug, name: collectionName(c, lang), icon: c.icon })),
  })).filter((t) => t.collections.length > 0);
}

export function themeName(key: string, lang = 'en'): string {
  const t = THEMES.find((x) => x.key === key);
  return t ? t.name[lang] || t.name.en : key;
}

/** The theme a collection belongs to, for breadcrumbs on a collection page. */
export function themeForCollection(slug: string): Theme | undefined {
  return THEMES.find((t) => t.slugs.includes(slug));
}
