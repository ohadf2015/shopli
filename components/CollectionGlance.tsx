import { collectionFacts, formatOrders, stars, type FactProduct } from '../lib/collection-facts';
import { productImage } from '../lib/img';
import { outHref } from '../lib/out-link';

type Lang = 'he' | 'en' | 'fr' | 'de' | 'es' | 'it' | 'ru';

const T: Record<string, Record<Lang, string>> = {
  heading: { en: 'At a glance', he: 'במבט מהיר', fr: 'En un coup d’œil', de: 'Auf einen Blick', es: 'De un vistazo', it: 'In breve', ru: 'Коротко' },
  topRated: { en: 'Highest rated', he: 'הדירוג הכי גבוה', fr: 'Le mieux noté', de: 'Am besten bewertet', es: 'Mejor valorado', it: 'Il più votato', ru: 'Лучший рейтинг' },
  mostOrdered: { en: 'Most ordered', he: 'הכי נמכר', fr: 'Le plus commandé', de: 'Am meisten bestellt', es: 'El más pedido', it: 'Il più ordinato', ru: 'Чаще всего заказывают' },
  cheapest: { en: 'Lowest price', he: 'המחיר הכי נמוך', fr: 'Prix le plus bas', de: 'Günstigster Preis', es: 'Precio más bajo', it: 'Prezzo più basso', ru: 'Самая низкая цена' },
  cta: { en: 'View on AliExpress', he: 'לצפייה באליאקספרס', fr: 'Voir sur AliExpress', de: 'Auf AliExpress ansehen', es: 'Ver en AliExpress', it: 'Vedi su AliExpress', ru: 'Смотреть на AliExpress' },
  orders: { en: 'orders', he: 'הזמנות', fr: 'commandes', de: 'Bestellungen', es: 'pedidos', it: 'ordini', ru: 'заказов' },
  method: {
    en: 'How we picked these: live AliExpress listings for this niche, ranked on rating and order volume, with items under 90% positive feedback or 100 orders dropped whenever better ones are available. Prices update hourly and can change on AliExpress.',
    he: 'איך בחרנו: מוצרים חיים מאליאקספרס בנישה הזו, ממוינים לפי דירוג וכמות הזמנות, ופריטים עם פחות מ-90% משוב חיובי או פחות מ-100 הזמנות יורדים כשיש חלופות טובות יותר. המחירים מתעדכנים כל שעה ועשויים להשתנות באליאקספרס.',
    fr: 'Notre sélection : des annonces AliExpress en direct pour cette niche, classées par note et commandes, en écartant les articles sous 90 % d’avis positifs ou 100 commandes dès qu’il existe mieux. Les prix sont mis à jour toutes les heures.',
    de: 'So wählen wir aus: aktuelle AliExpress-Angebote dieser Nische, sortiert nach Bewertung und Bestellungen; Artikel unter 90 % positiver Bewertungen oder 100 Bestellungen fliegen raus, sobald es Besseres gibt. Preise werden stündlich aktualisiert.',
    es: 'Cómo elegimos: anuncios en vivo de AliExpress para este nicho, ordenados por valoración y pedidos, descartando artículos con menos del 90 % de valoraciones positivas o 100 pedidos cuando hay mejores opciones. Los precios se actualizan cada hora.',
    it: 'Come scegliamo: inserzioni AliExpress in tempo reale per questa nicchia, ordinate per voto e ordini, scartando articoli sotto il 90% di feedback positivi o 100 ordini quando ci sono alternative migliori. I prezzi si aggiornano ogni ora.',
    ru: 'Как мы выбираем: актуальные товары AliExpress в этой нише по рейтингу и числу заказов; позиции с рейтингом ниже 90% или менее 100 заказов убираем, если есть лучше. Цены обновляются каждый час.',
  },
};

function summary(lang: Lang, n: number, name: string, min: string, max: string, orders: string): string {
  switch (lang) {
    case 'he': return `${n} מוצרים נבחרים ב${name}, במחירים בין ${min} ל-${max}, עם יותר מ-${orders} הזמנות ביחד באליאקספרס.`;
    case 'fr': return `${n} articles sélectionnés en ${name}, de ${min} à ${max}, pour plus de ${orders} commandes cumulées sur AliExpress.`;
    case 'de': return `${n} ausgewählte ${name}-Artikel von ${min} bis ${max}, zusammen über ${orders} Bestellungen auf AliExpress.`;
    case 'es': return `${n} productos seleccionados de ${name}, de ${min} a ${max}, con más de ${orders} pedidos en total en AliExpress.`;
    case 'it': return `${n} prodotti selezionati per ${name}, da ${min} a ${max}, con oltre ${orders} ordini complessivi su AliExpress.`;
    case 'ru': return `${n} отобранных товаров (${name}) от ${min} до ${max}, вместе более ${orders} заказов на AliExpress.`;
    default: return `${n} top ${name} picks from ${min} to ${max}, with over ${orders} orders between them on AliExpress.`;
  }
}

export default function CollectionGlance({
  products,
  name,
  lang,
  currencySymbol,
  region,
}: {
  products: FactProduct[];
  name: string;
  lang: string;
  currencySymbol: string;
  region: string;
}) {
  const facts = collectionFacts(products);
  if (!facts) return null;
  const l = (lang in T.heading ? lang : 'en') as Lang;
  const money = (n: number) => `${currencySymbol}${n.toFixed(2)}`;
  const picks = [
    facts.topRated && { key: 'topRated', p: facts.topRated, stat: `★ ${stars(facts.topRated.rating)}` },
    facts.mostOrdered && { key: 'mostOrdered', p: facts.mostOrdered, stat: `${formatOrders(facts.mostOrdered.volume || 0)} ${T.orders[l]}` },
    facts.cheapest && { key: 'cheapest', p: facts.cheapest, stat: money(facts.cheapest.price) },
  ].filter(Boolean) as { key: string; p: FactProduct; stat: string }[];

  return (
    <section className="mb-8 rounded-xl border border-[#141414] bg-white p-4 sm:p-5" data-collection-glance>
      <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--shopli-navy)' }}>
        {T.heading[l]}
      </h2>
      <p className="text-sm mb-4" style={{ color: 'var(--shopli-warm-gray)' }}>
        {summary(l, facts.count, name, money(facts.minPrice), money(facts.maxPrice), formatOrders(facts.totalOrders))}
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        {picks.map(({ key, p, stat }) => (
          <div
            key={key}
            className="flex gap-3 items-center rounded-lg border border-[#141414] p-3 bg-[#FFF4E4]/50"
            data-product-id={p.id}
            data-product-title={p.title}
            data-price={p.price.toFixed(2)}
            data-currency={currencySymbol}
            data-category={name}
            data-region={region}
          >
            {p.imageUrl && (
              <img {...productImage(p.imageUrl, 120)} alt="" className="w-14 h-14 object-contain rounded bg-white shrink-0" />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-[0.65rem] font-semibold uppercase tracking-wider" style={{ color: 'var(--shopli-orange)' }}>
                {T[key][l]} · {stat}
              </p>
              <a
                href={`/${region}/product/${encodeURIComponent(p.id)}`}
                className="block text-xs font-semibold line-clamp-2 hover:underline"
                style={{ color: 'var(--shopli-navy)' }}
              >
                {p.title}
              </a>
              {p.affiliateLink && (
                <a
                  href={outHref(p.affiliateLink)}
                  target="_blank"
                  rel="nofollow sponsored noopener noreferrer"
                  data-cta="collection_glance"
                  className="mt-1 inline-flex items-center gap-1 text-[0.7rem] font-bold hover:underline"
                  style={{ color: 'var(--shopli-orange)' }}
                >
                  {money(p.price)} · {T.cta[l]} <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
        {T.method[l]}
      </p>
    </section>
  );
}
