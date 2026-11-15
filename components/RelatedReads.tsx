type Lang = 'he' | 'en' | 'fr' | 'de' | 'es' | 'it' | 'ru';

const T: Record<string, Record<Lang, string>> = {
  heading: { en: 'Keep exploring', he: 'להמשך קריאה', fr: 'Continuer la visite', de: 'Weiter stöbern', es: 'Sigue explorando', it: 'Continua a esplorare', ru: 'Смотрите также' },
  guide: { en: 'Buying guide', he: 'מדריך קנייה', fr: 'Guide d’achat', de: 'Kaufratgeber', es: 'Guía de compra', it: 'Guida all’acquisto', ru: 'Гид покупателя' },
  compare: { en: 'Head to head', he: 'השוואה', fr: 'Comparatif', de: 'Vergleich', es: 'Comparativa', it: 'Confronto', ru: 'Сравнение' },
  collection: { en: 'Shop the picks', he: 'לבחירות שלנו', fr: 'Notre sélection', de: 'Unsere Auswahl', es: 'Nuestra selección', it: 'La nostra selezione', ru: 'Подборка' },
  more: { en: 'More in', he: 'עוד ב', fr: 'Plus dans', de: 'Mehr in', es: 'Más en', it: 'Altro in', ru: 'Ещё в разделе' },
};

import type { RelatedLink } from '../lib/related-links';

export type { RelatedLink };

/**
 * On-topic next steps between collections, guides and comparisons
 * (lib/related-content.ts), plus sibling collections in the same theme.
 * Renders nothing when there is nothing to link.
 */
export default function RelatedReads({
  links,
  siblings,
  themeName,
  region,
  lang,
}: {
  links: RelatedLink[];
  siblings?: { slug: string; name: string }[];
  themeName?: string;
  region: string;
  lang: string;
}) {
  const l = (lang in T.heading ? lang : 'en') as Lang;
  const sib = siblings || [];
  if (links.length === 0 && sib.length === 0) return null;
  return (
    <section className="py-8 border-t border-[#141414]" data-related-reads>
      {links.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--shopli-navy)' }}>
            {T.heading[l]}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {links.map((r) => (
              <a
                key={r.href}
                href={r.href}
                className="block rounded-lg border border-[#141414] bg-white p-4 hover:bg-orange-50/40 transition-colors"
                data-related-kind={r.kind}
              >
                <span className="block text-[0.65rem] font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--shopli-orange)' }}>
                  {T[r.kind][l]}
                </span>
                <span className="block text-sm font-semibold" style={{ color: 'var(--shopli-navy)' }}>
                  {r.title}
                </span>
              </a>
            ))}
          </div>
        </>
      )}
      {sib.length > 0 && (
        <nav aria-label={`${T.more[l]} ${themeName || ''}`.trim()}>
          <p className="text-sm font-semibold mb-2" style={{ color: 'var(--shopli-navy)' }}>
            {T.more[l]}{l === 'he' ? '' : ' '}{themeName}
          </p>
          <ul className="flex flex-wrap gap-2">
            {sib.map((s) => (
              <li key={s.slug}>
                <a
                  href={`/${region}/collection/${s.slug}`}
                  className="inline-block text-xs font-semibold px-3 py-1.5 rounded-full border border-[#141414] bg-white hover:bg-orange-50/40"
                  style={{ color: 'var(--shopli-navy)' }}
                >
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </section>
  );
}
