import { GetServerSideProps } from 'next';
import Header from '../../components/Header';
import Icon from '../../components/icons';
import ProductCard from '../../components/ProductCard';
import WhatsAppShare from '../../components/WhatsAppShare';
import SeoHead from '../../components/SeoHead';
import { getRegion, RegionCode } from '../../lib/regions';
import { getAllCollections } from '../../lib/collections';
import { breadcrumbJsonLd, websiteJsonLd, SITE_URL } from '../../lib/seo';
import type { RegionConfig } from '../../lib/regions';
import type { Product } from '../../lib/types';

interface FlatProduct extends Product { collectionSlug?: string; collectionName?: string; }

interface CollectionGroup {
  slug: string;
  name: string;
  desc: string;
  icon: string;
  products: FlatProduct[];
}

interface HomePageProps {
  region: RegionCode;
  config: RegionConfig;
  groups: CollectionGroup[];
  rtl: boolean;
}

async function fetchCollectionProducts(region: string, keywords: string[], limit = 4): Promise<FlatProduct[]> {
  try {
    const { searchCollection: sc } = await import('../../lib/aliexpress');
    return (await sc(region, keywords, limit)) as any;
  } catch { return []; }
}

export default function HomePage({ region, config, groups, rtl }: HomePageProps) {
  const t = (text?: Record<string, string> | null) => text?.[config.lang] || text?.en || '';

  const heroTitle = rtl ? 'מצאו את הדילים הכי שווים מאליאקספרס' : 'The Best AliExpress Deals, Curated for You';
  const heroDesc = rtl
    ? 'אנחנו בוחרים מוצרים לפי טרנדים, עונה ואיכות. אתם קונים במחירים הכי נמוכים עם קישור partnerפים ישיר.'
    : 'We pick products by trends, season & quality. You buy at the lowest price with direct affiliate links.';

  const pageUrl = `${SITE_URL}/${region}`;
  const structuredData = [
    breadcrumbJsonLd([{ name: rtl ? 'דף הבית' : 'Home', url: pageUrl }]),
    websiteJsonLd(`${SITE_URL}/${region}/search?q={search_term_string}`, region as RegionCode),
  ];

  return (
    <>
      <SeoHead
        region={region as RegionCode}
        path=""
        title={config.meta.title}
        description={config.meta.description}
        jsonLd={structuredData}
      />
      <Header currentRegion={region} dir={config.direction} />

      <main style={{ fontFamily: rtl ? "'Assistant', system-ui, sans-serif" : undefined }}>

        {/* HERO */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-12 md:pt-32 md:pb-16">
          <div className="max-w-3xl">
            <div className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: 'var(--shopli-orange)' }}>
              {rtl ? 'שופלי — המלצות חכמות' : 'SHOPLI — SMART PICKS'}
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4" style={{ color: 'var(--shopli-navy)' }}>
              {heroTitle}
            </h1>
            <p className="text-base md:text-lg mb-6 leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>
              {heroDesc}
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={`/${region}/collection/home-gym`} className="btn-primary">
                <Icon name="tag" size={16} />
                {rtl ? 'כל המבצעים' : 'Browse All Deals'}
              </a>
              {config.tgChannel && (
                <a href={`https://t.me/${config.tgChannel}`} target="_blank" rel="noopener" className="btn-secondary">
                  <Icon name="telegram" size={16} />
                  {rtl ? 'ערוץ טלגרם' : 'Telegram Channel'}
                </a>
              )}
              <WhatsAppShare
                title={rtl ? 'שופלי — הדילים הכי שווים מאליאקספרס' : 'Shopli — The Best AliExpress Deals'}
                url={`${SITE_URL}/${region}`}
                description={heroDesc}
                locale={config.lang}
                size="md"
                className="btn-secondary"
              />
            </div>
          </div>
        </section>

        {/* COLLECTIONS GRID */}
        {groups.filter(g => g.products.length > 0).slice(0, 6).map((group, gi) => (
          <section key={group.slug} className={`py-10 md:py-14 ${gi % 2 === 1 ? 'bg-white' : 'bg-gray-50/50'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'oklch(90% 0.06 45)', color: 'var(--shopli-orange)' }}>
                      <Icon name={group.icon as any} size={16} />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold" style={{ color: 'var(--shopli-navy)' }}>{group.name}</h2>
                  </div>
                  <p className="text-sm mt-1" style={{ color: 'var(--shopli-warm-gray)' }}>{group.desc}</p>
                </div>
                <a href={`/${region}/collection/${group.slug}`} className="text-sm font-semibold flex items-center gap-1 hover:underline whitespace-nowrap" style={{ color: 'var(--shopli-orange)' }}>
                  {rtl ? 'לכל המוצרים' : 'View All'}
                  <Icon name={rtl ? 'chevron-left' : 'chevron-right'} size={14} />
                </a>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                {group.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    currencySymbol={config.currencySymbol}
                    rtl={rtl}
                    locale={config.lang}
                    region={region}
                    showCompareLink
                  />
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* FULL COLLECTIONS LIST */}
        <section id="categories" className="py-14 bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: 'var(--shopli-navy)' }}>
              {rtl ? 'כל הקטגוריות' : 'All Collections'}
            </h2>
            <p className="text-sm mb-8" style={{ color: 'var(--shopli-warm-gray)' }}>
              {rtl ? 'מוצרים מקובצים לפי נושא — בחרו מה שמעניין אתכם' : 'Products grouped by theme — pick what interests you'}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {getAllCollections().filter(coll => coll.name).map(coll => {
                const name = t(coll.name);
                const desc = t(coll.desc);
                return (
                  <a key={coll.slug} href={`/${region}/collection/${coll.slug}`}
                    className="p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: 'oklch(90% 0.06 45)', color: 'var(--shopli-orange)' }}>
                      <Icon name={coll.icon as any} size={16} />
                    </div>
                    <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--shopli-navy)' }}>{name}</h3>
                    <p className="text-xs leading-snug" style={{ color: 'var(--shopli-warm-gray)' }}>{desc}</p>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* MOOD BOARDS — Complete Looks & Room Designs */}
        <section className="py-10 bg-orange-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: 'var(--shopli-navy)' }}>
              {rtl ? 'ערכות שלמות — מראה, חדר, ערכת' : 'Complete Looks, Rooms & Kits'}
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--shopli-warm-gray)' }}>
              {rtl ? 'כל ערכה מחברת מספר פריטים ליצירת מראה שלם, עיצוב חדר או ערכת שלמה' : 'Each board combines multiple products into a complete look, room design, or kit.'}
            </p>

            <h3 className="text-xs font-semibold uppercase tracking-widest mb-3 mt-4" style={{ color: 'var(--shopli-orange)' }}>{rtl ? 'תחפושות לפורים / הלווין' : 'PURIM & HALLOWEEN COSTUMES'}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {[
                { link: 'jack-sparrow', titleEn: 'Pirate Jack Sparrow', titleHe: 'פיראט ג׳ק ספארו', descEn: 'Complete pirate costume €30', descHe: 'תחפושת פיראט ₪120' },
                { link: 'queen-esther', titleEn: 'Queen Esther', titleHe: 'אסתר המלכה', descEn: 'Royal costume €25', descHe: 'תחפושת מלכותית ₪100' },
                { link: 'pikachu', titleEn: 'Pikachu Cosplay', titleHe: 'פיקאצ׳ו', descEn: 'Cute Pokemon cosplay €20', descHe: 'קוספליי פוקימון ₪80' },
                { link: 'spiderman', titleEn: 'Spider-Man', titleHe: 'ספיידרמן', descEn: 'Superhero costume €25', descHe: 'תחפושת גיבור על ₪100' },
                { link: 'wonder-woman', titleEn: 'Wonder Woman', titleHe: 'ונדר וומן', descEn: 'Amazon warrior €30', descHe: 'לוחמת אמזונות ₪120' },
                { link: 'ninja-turtle', titleEn: 'Ninja Turtle', titleHe: 'צב נינג׳ה', descEn: 'Hero in a half shell €20', descHe: 'גיבור חצי קליפה ₪80' },
                { link: 'superman', titleEn: 'Superman', titleHe: 'סופרמן', descEn: 'Man of Steel €25', descHe: 'איש הפלדה ₪100' },
              ].map(b => (                <a key={b.link} href={`/${region}/mood/${b.link}`}
                  className="p-3 rounded-xl border border-orange-200 bg-white hover:shadow-md transition-all">
                  <div className="font-semibold text-sm mb-0.5" style={{ color: 'var(--shopli-navy)' }}>{rtl ? b.titleHe : b.titleEn}</div>
                  <p className="text-[0.6rem]" style={{ color: 'var(--shopli-warm-gray)' }}>{rtl ? b.descHe : b.descEn}</p>
                </a>
              ))}
            </div>

            <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--shopli-orange)' }}>{rtl ? 'עיצובי חדרים' : 'ROOM DESIGN'}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {[
                { link: 'japandi-office', titleEn: 'Japandi Office', titleHe: 'משרד יפנדי', descEn: 'Minimalist serene workspace €80', descHe: 'מרחב עבודה שלו ₪320' },
                { link: 'gamer-den', titleEn: 'RGB Gamer Den', titleHe: 'פינת גיימרינג', descEn: 'Ultimate gaming setup €120', descHe: 'עמדת משחק אולטימטיבית ₪480' },
                { link: 'boho-bedroom', titleEn: 'Boho Bedroom', titleHe: 'חדר בוהו', descEn: 'Cozy aesthetic bedroom €50', descHe: 'חדר נעים בסגנון בוהמי ₪200' },
                { link: 'scandinavian-reading-nook', titleEn: 'Reading Nook', titleHe: 'פינת קריאה', descEn: 'Hygge cozy corner €60', descHe: 'פינה הייג׳ית נעימה ₪240' },
                { link: 'indoor-jungle', titleEn: 'Indoor Jungle', titleHe: 'ג׳ונגל ביתי', descEn: 'Plant corner €40', descHe: 'פינת צמחים שופעת ₪160' },
              ].map(b => (                <a key={b.link} href={`/${region}/mood/${b.link}`}
                  className="p-3 rounded-xl border border-orange-200 bg-white hover:shadow-md transition-all">
                  <div className="font-semibold text-sm mb-0.5" style={{ color: 'var(--shopli-navy)' }}>{rtl ? b.titleHe : b.titleEn}</div>
                  <p className="text-[0.6rem]" style={{ color: 'var(--shopli-warm-gray)' }}>{rtl ? b.descHe : b.descEn}</p>
                </a>
              ))}
            </div>

            <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--shopli-orange)' }}>{rtl ? 'ערכות מתוייבות' : 'CURATED KITS'}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { link: 'sushi-night', titleEn: 'Sushi Night', titleHe: 'ערב סושי', descEn: 'Kitchen kit under €25', descHe: 'ערכת סושי ₪100' },
                { link: 'mechanical-keyboard', titleEn: 'Mech Keyboard', titleHe: 'מקלדת מכנית', descEn: 'Custom build under €70', descHe: 'מקלדת מותאמת ₪300' },
                { link: 'home-bar', titleEn: 'Home Bar', titleHe: 'בר ביתי', descEn: 'Cocktail kit under €35', descHe: 'ערכת קוקטיילים ₪140' },
                { link: 'digital-nomad', titleEn: 'Digital Nomad', titleHe: 'נווד דיגיטלי', descEn: 'Work anywhere under €60', descHe: 'לעבוד מכל מקום ₪240' },
                { link: 'streaming-setup', titleEn: 'Streaming Setup', titleHe: 'עמדת סטרימינג', descEn: 'Go live under €60', descHe: 'לשדר בשידור חי ₪240' },
                { link: 'dessert-baking', titleEn: 'Baking Kit', titleHe: 'ערכת אפייה', descEn: 'Bake like a pro under €30', descHe: 'אפייה מקצועית ₪120' },
                { link: 'home-gym-pro', titleEn: 'Home Gym Pro', titleHe: 'חדר כושר מתקדם', descEn: 'Serious setup under €80', descHe: 'ציוד מתקדם ₪320' },
                { link: 'jewelry-making', titleEn: 'Jewelry Making', titleHe: 'תכשיטנות', descEn: 'DIY jewelry under €25', descHe: 'תכשיטים בעבודת יד ₪100' },
                { link: 'camping-coffee', titleEn: 'Camping Coffee', titleHe: 'קפה בקמפינג', descEn: 'Brew in the wild under €20', descHe: 'קפה בשטח ₪80' },
                { link: 'study-corner', titleEn: 'Study Corner', titleHe: 'פינת לימוד', descEn: 'Focus workspace under €40', descHe: 'מרחב לימוד ממוקד ₪160' },
                { link: 'morning-routine', titleEn: 'Morning Routine', titleHe: 'ערכת בוקר', descEn: 'Start your day under €25', descHe: 'בוקר מושלם ₪100' },
                { link: 'beach-day', titleEn: 'Beach Day', titleHe: 'יום חוף', descEn: 'Stress-free kit under €30', descHe: 'ערכת חוף ₪120' },
                { link: 'wireless-audio', titleEn: 'Wireless Audio', titleHe: 'אודיו אלחוטי', descEn: 'Earbuds, headphones & speaker €60', descHe: 'אוזניות ורמקולים ₪240' },
                { link: 'phone-accessories', titleEn: 'Phone Kit', titleHe: 'אביזרים לטלפון', descEn: 'Protect, charge & mount €25', descHe: 'הגנה וטעינה ₪100' },
                { link: 'summer-essentials', titleEn: 'Summer Survival', titleHe: 'קיץ הכרחי', descEn: 'Beat the heat kit under €25', descHe: 'ערכת הישרדות ₪100' },
              ].map(b => (                <a key={b.link} href={`/${region}/mood/${b.link}`}
                  className="p-3 rounded-xl border border-orange-200 bg-white hover:shadow-md transition-all">
                  <div className="font-semibold text-sm mb-0.5" style={{ color: 'var(--shopli-navy)' }}>{rtl ? b.titleHe : b.titleEn}</div>
                  <p className="text-[0.6rem]" style={{ color: 'var(--shopli-warm-gray)' }}>{rtl ? b.descHe : b.descEn}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* COMPARISONS */}
        <section className="py-10 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl md:text-2xl font-bold mb-2" style={{ color: 'var(--shopli-navy)' }}>
              {rtl ? 'השוואות מוצרים' : 'Product Comparisons'}
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--shopli-warm-gray)' }}>
              {rtl ? 'לא בטוחים מה לבחור? ההשוואות שלנו עוזרות להחליט' : 'Not sure what to pick? Our comparisons help you decide.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { slug: 'french-press-vs-drip', titleEn: 'French Press vs Drip Maker', titleHe: 'פרנץ׳ פרס מול פילטר', descEn: 'Which brew method wins?', descHe: 'איזו שיטת חליטה עדיפה?' },
                { slug: 'resistance-bands-vs-dumbbells', titleEn: 'Bands vs Dumbbells', titleHe: 'רצועות מול משקולות', descEn: 'Best home gym gear', descHe: 'איזה ציוד כושר עדיף?' },
                { slug: 'ring-light-vs-softbox', titleEn: 'Ring Light vs Softbox', titleHe: 'רינג לייט מול סופטבוקס', descEn: 'Perfect lighting choice', descHe: 'בחירת התאורה המושלמת' },
              ].map(c => (
                <a key={c.slug} href={`/${region}/compare/${c.slug}`}
                  className="p-5 rounded-xl border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all bg-white">
                  <h3 className="font-bold text-sm mb-1" style={{ color: 'var(--shopli-navy)' }}>{rtl ? c.titleHe : c.titleEn}</h3>
                  <p className="text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>{rtl ? c.descHe : c.descEn}</p>
                  <span className="text-xs font-semibold mt-2 inline-block" style={{ color: 'var(--shopli-orange)' }}>
                    {rtl ? 'קראו השוואה →' : 'Read comparison →'}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA — Newsletter + Telegram */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="rounded-2xl p-8 md:p-12 text-center" style={{ background: 'var(--shopli-navy)', color: 'white' }}>
            <h2 className="text-xl md:text-2xl font-bold mb-3">
              {rtl ? 'רוצים לקבל עדכונים שווים?' : 'Want the Best Deals First?'}
            </h2>
            <p className="mb-6 max-w-md mx-auto text-sm" style={{ color: 'oklch(70% 0.02 80)' }}>
              {rtl ? 'הירשמו לניוזלטר וקבלו מבצעים חמים ישירות למייל' : 'Subscribe for hot deals straight to your inbox'}
            </p>
            
            {/* Newsletter form */}
            <div className="max-w-sm mx-auto mb-6">
              <form id="newsletter-form" data-region={region} onSubmit={async (e) => {
                e.preventDefault();
                const input = e.currentTarget.querySelector('input') as HTMLInputElement;
                const btn = e.currentTarget.querySelector('button') as HTMLButtonElement;
                const status = e.currentTarget.querySelector('.status') as HTMLElement;
                const formRegion = e.currentTarget.getAttribute('data-region') || 'eu';
                if (!input.value) return;
                btn.disabled = true;
                btn.textContent = rtl ? 'נרשם...' : 'Subscribing...';
                try {
                  const res = await fetch('/api/newsletter', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ email: input.value, region: formRegion }),
                  });
                  const data = await res.json();
                  status.textContent = data.message;
                  status.style.display = 'block';
                  if (data.ok) input.value = '';
                } catch {
                  status.textContent = rtl ? 'שגיאה, נסו שוב' : 'Error, try again';
                  status.style.display = 'block';
                }
                btn.disabled = false;
                btn.textContent = rtl ? 'הצטרפו' : 'Subscribe';
              }} className="flex gap-2">
                <input type="email" required placeholder={rtl ? 'האימייל שלך' : 'your@email.com'}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm text-gray-900 placeholder-gray-400 border-0 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                <button type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer"
                  style={{ background: 'var(--shopli-orange)', color: 'white' }}>
                  {rtl ? 'הצטרפו' : 'Subscribe'}
                </button>
              </form>
              <p className="status text-xs mt-2 hidden" style={{ color: 'oklch(80% 0.05 130)' }}></p>
            </div>

            <div className="text-xs" style={{ color: 'oklch(70% 0.02 80)' }}>
              {rtl ? 'או' : 'or'}
            </div>

            {config.tgChannel && (
              <a href={`https://t.me/${config.tgChannel}`} target="_blank" rel="noopener"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm mt-4"
                style={{ background: 'var(--shopli-orange)', color: 'white' }}>
                <Icon name="telegram" size={18} />
                {rtl ? 'הצטרפו לטלגרם' : 'Join Telegram'}
              </a>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
          <div className="flex items-center gap-2 font-semibold" style={{ color: 'var(--shopli-navy)' }}>
            <svg width="18" height="18" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="var(--shopli-orange)"/><path d="M9 12h14l-2 12H11L9 12z" fill="white" opacity="0.9"/></svg>
            shopli
          </div>
          <div>&copy; {new Date().getFullYear()} Shopli. {rtl ? 'כל הזכויות שמורות' : 'All rights reserved.'}</div>
          <div className="flex gap-4">
            <a href={`/${region}/collection/home-gym`} className="hover:underline">{rtl ? 'אימונים' : 'Workout'}</a>
            <a href={`/${region}/collection/coffee-ritual`} className="hover:underline">{rtl ? 'קפה' : 'Coffee'}</a>
            <a href={`/${region}/mood/jack-sparrow`} className="hover:underline">{rtl ? 'תחפושות' : 'Costumes'}</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, query }) => {
  const region = (query?.region as string) || (params?.region as string) || 'eu';
  const config = getRegion(region);
  const rtl = config.direction === 'rtl';

  const t = (text: Record<string, string>) => text[config.lang] || text.en || '';

  const collections = getAllCollections().slice(0, 6);
  const groups: CollectionGroup[] = [];

  for (const coll of collections) {
    const products = await fetchCollectionProducts(region, [coll.keywords[0]], 4);
    if (products.length > 0) {
      groups.push({
        slug: coll.slug,
        name: t(coll.name),
        desc: t(coll.desc),
        icon: coll.icon,
        products,
      });
    }
  }

  return {
    props: {
      region,
      config,
      groups: groups || [],
      rtl,
    },
  };
};