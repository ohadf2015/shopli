/**
 * What counts as "trending" this week, by date and region.
 *
 * The trending page used to read a hardcoded array of ten category keyword
 * sets. The products inside them were live, but the categories never moved:
 * Halloween sat at the top of an Israeli page in August, and a Summer row
 * would still have been there in January.
 *
 * Seasons are date-derived here so the page is always in-season, and holidays
 * are per-region because the calendar that matters in /il is not the one that
 * matters in /de.
 */

export interface TrendCategory {
  key: string;
  keywords: string[];
  label: Record<string, string>;
  /** Higher sorts first. Seasonal windows outrank evergreen categories. */
  weight: number;
}

interface SeasonalCategory extends Omit<TrendCategory, 'weight'> {
  /** Inclusive month/day window, 1-indexed months. Wraps across year end. */
  from: [number, number];
  to: [number, number];
  /** Region codes this applies to. Omit for all regions. */
  regions?: string[];
  weight: number;
}

/** Always relevant — the floor the page falls back to out of season. */
const EVERGREEN: TrendCategory[] = [
  { key: 'home-gym', weight: 10, keywords: ['fitness resistance bands', 'home gym equipment', 'jump rope'], label: { en: 'Home Gym', he: 'חדר כושר', fr: 'Sport maison', de: 'Heim-Fitness', es: 'Gimnasio', it: 'Palestra', ru: 'Фитнес' } },
  { key: 'smart-home', weight: 10, keywords: ['Tuya smart plug', 'smart LED strip', 'wireless doorbell'], label: { en: 'Smart Home', he: 'בית חכם', fr: 'Maison connectée', de: 'Smart Home', es: 'Hogar inteligente', it: 'Casa smart', ru: 'Умный дом' } },
  { key: 'kitchen', weight: 10, keywords: ['kitchen gadgets', 'garlic press', 'fruit peeler'], label: { en: 'Kitchen', he: 'מטבח', fr: 'Cuisine', de: 'Küche', es: 'Cocina', it: 'Cucina', ru: 'Кухня' } },
  { key: 'wireless-audio', weight: 10, keywords: ['wireless earbuds', 'bluetooth headphones', 'TWS earbuds'], label: { en: 'Audio', he: 'אודיו', fr: 'Audio', de: 'Audio', es: 'Audio', it: 'Audio', ru: 'Аудио' } },
  { key: 'phone', weight: 10, keywords: ['phone case', 'screen protector', 'USB C cable', 'power bank'], label: { en: 'Phone Gear', he: 'אביזרי טלפון', fr: 'Téléphone', de: 'Handy', es: 'Teléfono', it: 'Telefono', ru: 'Аксессуары' } },
  { key: 'desk', weight: 10, keywords: ['desk lamp LED', 'cable management desk', 'monitor stand'], label: { en: 'Desk Setup', he: 'עמדת עבודה', fr: 'Bureau', de: 'Schreibtisch', es: 'Escritorio', it: 'Scrivania', ru: 'Рабочее место' } },
  { key: 'pet', weight: 10, keywords: ['cat toy interactive', 'dog leash strong', 'pet grooming brush'], label: { en: 'Pet', he: 'חיות מחמד', fr: 'Animaux', de: 'Haustier', es: 'Mascota', it: 'Animali', ru: 'Питомцы' } },
];

/**
 * Seasonal windows. Dates are approximate on purpose — shopping demand for a
 * holiday builds for weeks beforehand and dies the day after, so each window
 * opens early and closes on the date.
 *
 * Jewish-calendar holidays drift against the Gregorian calendar, so their
 * windows are deliberately wide rather than exact.
 */
const SEASONAL: SeasonalCategory[] = [
  {
    key: 'back-to-school', weight: 30, from: [7, 20], to: [9, 15],
    keywords: ['school supplies set', 'backpack student', 'desk organizer'],
    label: { en: 'Back to School', he: 'חזרה לבית הספר', fr: 'Rentrée', de: 'Schulanfang', es: 'Vuelta al cole', it: 'Rientro a scuola', ru: 'К школе' },
  },
  {
    key: 'high-holidays', weight: 35, from: [8, 25], to: [10, 20], regions: ['il'],
    keywords: ['hosting serving tray', 'candle holder set', 'tablecloth festive'],
    label: { en: 'Holiday Hosting', he: 'חגי תשרי', fr: 'Fêtes', de: 'Feiertage', es: 'Fiestas', it: 'Feste', ru: 'Праздники' },
  },
  {
    key: 'halloween', weight: 35, from: [9, 15], to: [10, 31],
    // Not a shopping season in Israel or Russia.
    regions: ['eu', 'us', 'uk', 'fr', 'de', 'es', 'it'],
    keywords: ['halloween costume', 'cosplay wig', 'halloween decoration'],
    label: { en: 'Halloween', he: 'האלווין', fr: 'Halloween', de: 'Halloween', es: 'Halloween', it: 'Halloween', ru: 'Хэллоуин' },
  },
  {
    key: 'black-friday', weight: 40, from: [11, 1], to: [12, 2],
    keywords: ['best deals electronics', 'discount gadgets', 'clearance sale items'],
    label: { en: 'Black Friday', he: 'בלאק פריידי', fr: 'Black Friday', de: 'Black Friday', es: 'Black Friday', it: 'Black Friday', ru: 'Чёрная пятница' },
  },
  {
    key: 'gifting', weight: 38, from: [11, 20], to: [12, 31],
    keywords: ['gift set unique', 'stocking stuffer gadgets', 'secret santa gift'],
    label: { en: 'Gift Season', he: 'מתנות', fr: 'Cadeaux', de: 'Geschenke', es: 'Regalos', it: 'Regali', ru: 'Подарки' },
  },
  {
    key: 'winter', weight: 30, from: [11, 15], to: [2, 28],
    keywords: ['thermal gloves touchscreen', 'heated blanket usb', 'winter beanie'],
    label: { en: 'Winter', he: 'חורף', fr: 'Hiver', de: 'Winter', es: 'Invierno', it: 'Inverno', ru: 'Зима' },
  },
  {
    key: 'purim', weight: 35, from: [2, 1], to: [3, 25], regions: ['il'],
    keywords: ['costume accessories', 'cosplay wig', 'party decoration set'],
    label: { en: 'Purim', he: 'פורים', fr: 'Purim', de: 'Purim', es: 'Purim', it: 'Purim', ru: 'Пурим' },
  },
  {
    key: 'spring-clean', weight: 28, from: [3, 1], to: [4, 30],
    keywords: ['storage organizer box', 'cleaning gadgets home', 'vacuum accessories'],
    label: { en: 'Spring Clean', he: 'ניקיונות אביב', fr: 'Grand ménage', de: 'Frühjahrsputz', es: 'Limpieza', it: 'Pulizie', ru: 'Уборка' },
  },
  {
    key: 'summer', weight: 32, from: [5, 1], to: [9, 10],
    keywords: ['portable fan', 'sunglasses polarized', 'insulated water bottle', 'beach towel'],
    label: { en: 'Summer', he: 'קיץ', fr: 'Été', de: 'Sommer', es: 'Verano', it: 'Estate', ru: 'Лето' },
  },
  {
    key: 'travel', weight: 30, from: [5, 15], to: [9, 15],
    keywords: ['travel adapter universal', 'packing cubes', 'power bank'],
    label: { en: 'Travel', he: 'טיולים', fr: 'Voyage', de: 'Reise', es: 'Viaje', it: 'Viaggio', ru: 'Путешествия' },
  },
];

const md = (m: number, d: number) => m * 100 + d;

/** Inclusive, and handles windows that wrap past 31 December. */
export function inWindow(date: Date, from: [number, number], to: [number, number]): boolean {
  const now = md(date.getUTCMonth() + 1, date.getUTCDate());
  const start = md(from[0], from[1]);
  const end = md(to[0], to[1]);
  return start <= end ? now >= start && now <= end : now >= start || now <= end;
}

/**
 * Categories to feature for `region` on `date`, strongest season first.
 *
 * Always returns at least the evergreen set, so a gap in the seasonal calendar
 * can never empty the trending page.
 */
export function getTrendCategories(region: string, date: Date = new Date(), limit = 10): TrendCategory[] {
  const seasonal = SEASONAL.filter(
    (s) => (!s.regions || s.regions.includes(region)) && inWindow(date, s.from, s.to)
  ).map(({ key, keywords, label, weight }) => ({ key, keywords, label, weight }));

  // Evergreen order is rotated by week so the page is not identical every day,
  // while staying stable within a week for the edge cache and for crawlers.
  const week = Math.floor(
    (Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - Date.UTC(date.getUTCFullYear(), 0, 1)) / 604800000
  );
  const offset = week % EVERGREEN.length;
  const rotated = [...EVERGREEN.slice(offset), ...EVERGREEN.slice(0, offset)];

  return [...seasonal.sort((a, b) => b.weight - a.weight), ...rotated].slice(0, limit);
}
