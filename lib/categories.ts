export interface Category {
  slug: string;
  name: Record<string, string>;
  desc: Record<string, string>;
  keywords: string[];
  icon: string;
  googleCategory?: string;
}

function parseCSV(text: string): string[][] {
  // Minimal RFC-4180-ish parser: handles quoted fields, escaped quotes,
  // commas and newlines inside quotes.
  const rows: string[][] = [];
  let field = '';
  let row: string[] = [];
  let inQuotes = false;
  const src = String(text).replace(/^\uFEFF/, '');

  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++;
      row.push(field);
      field = '';
      if (row.some((v) => v.trim() !== '')) rows.push(row);
      row = [];
    } else {
      field += c;
    }
  }

  if (field !== '' || row.length > 0) {
    row.push(field);
    if (row.some((v) => v.trim() !== '')) rows.push(row);
  }

  return rows;
}

let cachedCategories: Category[] | null = null;

function loadCategories(): Category[] {
  if (typeof window !== 'undefined') {
    // CSV is only available at build time / on the server.
    return [];
  }

  if (cachedCategories) return cachedCategories;

  try {
    // Dynamic require keeps Node-only modules out of the client bundle.
    const fs = require('fs');
    const path = require('path');
    const csvPath = path.join(process.cwd(), 'data', 'beauty-niche.csv');
    const text = fs.readFileSync(csvPath, 'utf-8');
    const table = parseCSV(text);
    if (table.length < 2) {
      throw new Error('data/beauty-niche.csv has header but no category rows');
    }

    const header = table[0].map((h: string) => h.trim().toLowerCase());
    const idx = (name: string) => header.indexOf(name);

    const categories: Category[] = [];
    for (let r = 1; r < table.length; r++) {
      const raw = table[r];
      const get = (name: string) => {
        const i = idx(name);
        return i >= 0 && raw[i] !== undefined ? raw[i].trim() : '';
      };

      const slug = get('slug');
      if (!slug) continue;

      categories.push({
        slug,
        name: {
          en: get('name_en') || slug,
          he: get('name_he') || get('name_en') || slug,
        },
        desc: {
          en: get('desc_en'),
          he: get('desc_he') || get('desc_en'),
        },
        keywords: get('keywords')
          .split('|')
          .map((k) => k.trim())
          .filter(Boolean),
        icon: get('icon') || 'bulb',
        googleCategory: get('google_category') || undefined,
      });
    }

    cachedCategories = categories;
    return categories;
  } catch (e: any) {
    throw new Error(
      `Failed to load categories from data/beauty-niche.csv: ${e?.message || String(e)}`
    );
  }
}

export function getAllCategories(): Category[] {
  return loadCategories();
}

export function getCategory(slug: string): Category | undefined {
  return loadCategories().find((c) => c.slug === slug);
}

export function categoryExists(slug: string): boolean {
  return loadCategories().some((c) => c.slug === slug);
}

/** Lightweight list for nav menus. */
export function getCategoryNavItems(lang = 'en'): Array<{ slug: string; name: string }> {
  return loadCategories().map((c) => ({
    slug: c.slug,
    name: c.name[lang] || c.name.en || c.slug,
  }));
}
