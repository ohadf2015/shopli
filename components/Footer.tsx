import Link from 'next/link';
import { getRegion, RegionCode } from '../lib/regions';

type Lang = 'he' | 'en' | 'fr' | 'de' | 'es' | 'it' | 'ru';

/**
 * FTC 16 CFR Part 255 requires the affiliate relationship to be disclosed
 * "clearly and conspicuously" — every page carries a sponsored outbound link,
 * so the disclosure lives in the footer rather than on one buried page.
 */
const DISCLOSURE: Record<Lang, string> = {
  en: 'Shopli is an AliExpress affiliate. When you buy through a link on this site we may earn a commission, at no extra cost to you. That commission never changes which products we show or how we rank them.',
  he: 'שופלי היא שותפה אפיליאט של אליאקספרס. כשאתם קונים דרך קישור באתר אנחנו עשויים להרוויח עמלה, בלי עלות נוספת לכם. העמלה לא משפיעה על המוצרים שאנחנו מציגים ולא על סדר הדירוג.',
  fr: 'Shopli est un affilié AliExpress. Si vous achetez via un lien de ce site, nous pouvons percevoir une commission, sans surcoût pour vous. Cette commission ne modifie jamais les produits affichés ni leur classement.',
  de: 'Shopli ist AliExpress-Partner. Wenn Sie über einen Link auf dieser Seite kaufen, erhalten wir unter Umständen eine Provision — ohne Mehrkosten für Sie. Die Provision beeinflusst weder unsere Produktauswahl noch das Ranking.',
  es: 'Shopli es afiliado de AliExpress. Si compras a través de un enlace de este sitio podemos recibir una comisión, sin coste adicional para ti. Esa comisión nunca cambia qué productos mostramos ni cómo los ordenamos.',
  it: 'Shopli è affiliato AliExpress. Se acquisti tramite un link di questo sito potremmo ricevere una commissione, senza costi aggiuntivi per te. La commissione non influenza i prodotti mostrati né il loro ordine.',
  ru: 'Shopli — партнёр AliExpress. Если вы покупаете по ссылке с этого сайта, мы можем получить комиссию без дополнительных затрат для вас. Комиссия не влияет на то, какие товары мы показываем и как их ранжируем.',
};

/** How picks are made — an E-E-A-T signal, and the honest answer to "why trust this list?". */
const METHOD: Record<Lang, string> = {
  en: 'Every pick starts from live AliExpress data — current price, rating, review count and order volume — not from a paid placement. Prices and stock change on AliExpress; always check the product page before you buy.',
  he: 'כל בחירה מתחילה מנתונים חיים של אליאקספרס — מחיר עדכני, דירוג, מספר ביקורות וכמות הזמנות — ולא מקידום בתשלום. מחירים ומלאי משתנים באליאקספרס; תמיד בדקו בעמוד המוצר לפני קנייה.',
  fr: 'Chaque sélection part de données AliExpress en direct — prix actuel, note, nombre d’avis et volume de commandes — jamais d’un placement payant. Les prix et stocks changent sur AliExpress : vérifiez la fiche produit avant d’acheter.',
  de: 'Jede Empfehlung basiert auf Live-Daten von AliExpress — aktueller Preis, Bewertung, Anzahl der Rezensionen und Bestellvolumen — nicht auf bezahlter Platzierung. Preise und Verfügbarkeit ändern sich; prüfen Sie die Produktseite vor dem Kauf.',
  es: 'Cada selección parte de datos en vivo de AliExpress — precio actual, valoración, número de reseñas y volumen de pedidos — nunca de una colocación pagada. Los precios y el stock cambian: comprueba la página del producto antes de comprar.',
  it: 'Ogni scelta parte da dati AliExpress in tempo reale — prezzo attuale, valutazione, numero di recensioni e volume di ordini — mai da un posizionamento a pagamento. Prezzi e disponibilità cambiano: controlla la pagina prodotto prima di acquistare.',
  ru: 'Каждая подборка строится на актуальных данных AliExpress — текущая цена, рейтинг, число отзывов и количество заказов, — а не на платном размещении. Цены и наличие меняются: проверьте страницу товара перед покупкой.',
};

const T: Record<Lang, Record<string, string>> = {
  en: { explore: 'Explore', trending: 'Trending', compare: 'Compare', guides: 'Buying guides', deals: 'Deals', wishlist: 'Wishlist', about: 'About Shopli', how: 'How we pick', disclosure: 'Affiliate disclosure' },
  he: { explore: 'לגלוש', trending: 'חם עכשיו', compare: 'השוואה', guides: 'מדריכי קנייה', deals: 'מבצעים', wishlist: 'מועדפים', about: 'על שופלי', how: 'איך אנחנו בוחרים', disclosure: 'גילוי נאות' },
  fr: { explore: 'Explorer', trending: 'Tendances', compare: 'Comparer', guides: 'Guides d’achat', deals: 'Offres', wishlist: 'Favoris', about: 'À propos', how: 'Comment nous choisissons', disclosure: 'Divulgation d’affiliation' },
  de: { explore: 'Entdecken', trending: 'Trends', compare: 'Vergleichen', guides: 'Kaufratgeber', deals: 'Angebote', wishlist: 'Merkliste', about: 'Über Shopli', how: 'So wählen wir aus', disclosure: 'Affiliate-Hinweis' },
  es: { explore: 'Explorar', trending: 'Tendencias', compare: 'Comparar', guides: 'Guías de compra', deals: 'Ofertas', wishlist: 'Favoritos', about: 'Sobre Shopli', how: 'Cómo elegimos', disclosure: 'Divulgación de afiliación' },
  it: { explore: 'Esplora', trending: 'Di tendenza', compare: 'Confronta', guides: 'Guide all’acquisto', deals: 'Offerte', wishlist: 'Preferiti', about: 'Chi siamo', how: 'Come scegliamo', disclosure: 'Informativa affiliazione' },
  ru: { explore: 'Обзор', trending: 'В тренде', compare: 'Сравнить', guides: 'Гиды по покупкам', deals: 'Скидки', wishlist: 'Избранное', about: 'О Shopli', how: 'Как мы выбираем', disclosure: 'Партнёрское раскрытие' },
};

export default function Footer({ currentRegion }: { currentRegion: RegionCode | string }) {
  const region = getRegion(currentRegion);
  const lang = (region.lang || 'en') as Lang;
  const rtl = region.direction === 'rtl';
  const t = T[lang] || T.en;
  const base = `/${region.code}`;

  const links = [
    { href: `${base}/trending`, label: t.trending },
    { href: `${base}/compare`, label: t.compare },
    { href: `${base}/blog`, label: t.guides },
    { href: '/deals', label: t.deals },
    { href: `${base}/wishlist`, label: t.wishlist },
  ];

  return (
    <footer
      className="mt-16 border-t border-gray-100"
      style={{ background: 'var(--shopli-warm-card)' }}
      dir={rtl ? 'rtl' : 'ltr'}
    >
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link href={base} className="inline-flex items-center gap-2 font-extrabold text-lg" style={{ color: 'var(--shopli-navy)' }}>
              Shopli
            </Link>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>
              {region.meta.description}
            </p>
          </div>

          <nav aria-label={t.explore}>
            <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--shopli-navy)' }}>
              {t.explore}
            </h2>
            <ul className="space-y-2">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm hover:underline" style={{ color: 'var(--shopli-warm-gray)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--shopli-navy)' }}>
              {t.how}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>
              {METHOD[lang] || METHOD.en}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <h2 className="text-xs font-bold uppercase tracking-wide mb-2" style={{ color: 'var(--shopli-navy)' }}>
            {t.disclosure}
          </h2>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>
            {DISCLOSURE[lang] || DISCLOSURE.en}
          </p>
          <p className="mt-4 text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
            © {new Date().getFullYear()} Shopli · AliExpress is a trademark of Alibaba Group. Shopli is not affiliated with or endorsed by Alibaba Group beyond its public affiliate programme.
          </p>
        </div>
      </div>
    </footer>
  );
}
