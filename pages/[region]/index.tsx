import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Header from '../../components/Header';
import Icon from '../../components/icons';
import { getRegion, RegionCode } from '../../lib/regions';
import { fetchProducts, CATEGORIES } from '../../lib/api';
import type { Product } from '../../lib/types';
import type { RegionConfig } from '../../lib/regions';

interface HomePageProps {
  region: RegionCode;
  config: RegionConfig;
  products: Product[];
  rtl: boolean;
}

export default function HomePage({ region, config, products, rtl }: HomePageProps) {
  const c = (text: { he: string; en: string; fr: string; de: string; es: string; it: string }) =>
    text[config.lang as keyof typeof text] || text.en;

  const sectionLabel = rtl ? 'איך זה עובד' : 'How It Works';
  const heroTitle1 = rtl ? 'המוצרים הכי שווים' : 'Best Deals from';  
  const heroTitle2 = rtl ? 'מאליאקספרס' : 'AliExpress';
  const heroTitle3 = rtl ? 'ישירות אלייך' : 'Handpicked for You';
  const heroDesc = rtl
    ? 'AI חכם בוחר לך מוצרים איכותיים במחירים מטורפים — לפי טרנדים, עונה ומזג אוויר. אנחנו מסננים, אתה קונה.'
    : 'Smart AI picks the best products from AliExpress based on trends, season, and weather. We filter, you save.';
  const productSection = rtl ? 'המלצות אחרונות' : 'Latest Picks';
  const productTitle = rtl ? 'מה שווה עכשיו?' : "What's Hot Right Now";
  const productDesc = rtl
    ? 'המוצרים הכי חמים כרגע — נבחרו במיוחד בשבילך'
    : 'The hottest products right now — curated just for you';
  const howTitle = rtl ? 'AI בוחר, אנחנו מסננים, אתה מרוויח' : 'AI Picks, We Filter, You Save';
  const howDesc = rtl
    ? 'שלושה צעדים פשוטים בשביל למצוא את המוצרים הכי שווים'
    : 'Three simple steps to find the best deals';
  const categorySection = rtl ? 'קטגוריות' : 'Categories';
  const categoryTitle = rtl ? 'תגיד לי מה בא לך' : 'Browse by Category';
  const trustTitle = rtl ? 'יש לנו סטנדרטים' : 'Why Trust Us';
  const trustDesc = rtl
    ? 'כל מוצר עובר סינון קפדני לפני שהוא מגיע אליך'
    : 'Every product goes through strict quality filters';
  const ctaTitle = rtl
    ? 'רוצה לקבל את ההמלצות הכי שוות?'
    : 'Get the Best Deals Delivered';
  const ctaDesc = rtl
    ? 'הצטרף לערוץ הטלגרם שלנו ותקבל עדכונים שווים'
    : 'Join our Telegram channel for daily curated deals';
  const tgText = rtl ? 'הצטרף לטלגרם' : 'Join Telegram';

  const steps = rtl
    ? [
        { num: '1', title: 'AI סורק', desc: 'בוחן אלפי מוצרים לפי טרנדים, עונה וחיפושים חמים' },
        { num: '2', title: 'אנחנו מסננים', desc: 'דירוג מוכר, ביקורות, יחס מחיר-איכות — רק הטובים ביותר' },
        { num: '3', title: 'אתה קונה', desc: 'לוחץ, קונה מאליאקספרס במחיר הכי נמוך עם משלוח חינם' },
      ]
    : [
        { num: '1', title: 'AI Scans', desc: 'Analyzes thousands of products by trends, season, and demand' },
        { num: '2', title: 'We Filter', desc: 'Seller rating, reviews, value — only the best pass through' },
        { num: '3', title: 'You Buy', desc: 'Click, buy on AliExpress at the lowest price, free shipping' },
      ];

  const features = [
    {
      icon: 'tech',
      title: rtl ? 'AI חכם' : 'Smart AI',
      desc: rtl ? 'בינה מלאכותית סורקת טרנדים ועונות' : 'AI scans trends and seasons for the best picks',
    },
    {
      icon: 'shield',
      title: rtl ? 'בדיקת איכות' : 'Quality Checked',
      desc: rtl ? 'כל מוצר מקבל ציון מבוסס על דירוג וביקורות' : 'Every product scored on ratings and reviews',
    },
    {
      icon: 'truck',
      title: rtl ? 'משלוח חינם' : 'Free Shipping',
      desc: rtl ? 'כל המוצרים באתר עם משלוח חינם לישראל' : 'All products come with free shipping',
    },
    {
      icon: 'globe',
      title: rtl ? 'לכל האזורים' : 'Multi-Region',
      desc: rtl ? 'מחירים בשקלים, אירו, דולר — מותאם אליך' : 'Prices in ILS, EUR, USD — adapted to your region',
    },
  ];

  return (
    <>
      <Head>
        <title>{config.meta.title}</title>
        <meta name="description" content={config.meta.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="alternate" hrefLang="he" href="https://shopli.co.il" />
        <link rel="alternate" hrefLang="en" href="https://shopli.co/en" />
        <link rel="alternate" hrefLang="fr" href="https://shopli.co/fr" />
        <link rel="alternate" hrefLang="de" href="https://shopli.co/de" />
        <link rel="alternate" hrefLang="es" href="https://shopli.co/es" />
        <link rel="alternate" hrefLang="it" href="https://shopli.co/it" />
        <meta property="og:title" content={config.meta.title} />
        <meta property="og:description" content={config.meta.description} />
      </Head>

      <Header currentRegion={region} />

      <main style={{ fontFamily: rtl ? "'Assistant', system-ui, sans-serif" : undefined }}>
        {/* ====== HERO ====== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-16 md:pt-28 md:pb-20 grid md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div>
            <h1 className="section-title mb-4" style={{ color: 'var(--shopli-navy)' }}>
              {heroTitle1}<br />
              <span style={{ background: 'linear-gradient(135deg, var(--shopli-orange), var(--shopli-orange-dark))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {heroTitle2}
              </span><br />
              {heroTitle3}
            </h1>
            <p className="text-base md:text-lg mb-8 leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>
              {heroDesc}
            </p>
            <div className="flex gap-3 mb-8">
              <div className="text-center">
                <div className="text-xl font-extrabold" style={{ color: 'var(--shopli-navy)' }}>500+</div>
                <div className="text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
                  {rtl ? 'מוצרים נבדקו' : 'Products Checked'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-extrabold" style={{ color: 'var(--shopli-navy)' }}>{config.currencySymbol}0</div>
                <div className="text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
                  {rtl ? 'עמלה בשבילך' : 'Hidden Fees'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl font-extrabold" style={{ color: 'var(--shopli-navy)' }}>AI</div>
                <div className="text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
                  {rtl ? 'בוחר הכי שווה' : 'Powered Picks'}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={`/${region}/products`} className="btn-primary">
                <Icon name="tag" size={16} />
                {rtl ? 'למוצרים' : 'Browse Deals'}
              </a>
              <a href={config.tgChannel ? `https://t.me/${config.tgChannel}` : '#'} target="_blank" rel="noopener" className="btn-secondary">
                <Icon name="telegram" size={16} />
                {tgText}
              </a>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="rounded-2xl p-6" style={{
              background: 'linear-gradient(135deg, oklch(75% 0.12 45), oklch(75% 0.08 185))',
              aspectRatio: '4/3',
            }}>
              <div className="grid grid-cols-2 gap-4 h-full">
                {[
                  { label: '🔦', price: `${config.currencySymbol}8.90`, name: rtl ? 'פנס לד' : 'LED Flashlight' },
                  { label: '🎧', price: `${config.currencySymbol}18.90`, name: rtl ? 'אוזניות BT' : 'BT Earbuds' },
                  { label: '⌚', price: `${config.currencySymbol}22.90`, name: rtl ? 'שעון חכם' : 'Smart Watch' },
                  { label: '🔌', price: `${config.currencySymbol}8.50`, name: rtl ? 'מטען אלחוטי' : 'Wireless Charger' },
                ].map((p, i) => (
                  <div
                    key={i}
                    className="bg-white/90 backdrop-blur-sm rounded-lg p-3 flex flex-col items-center justify-center text-center shadow-sm"
                  >
                    <div className="text-2xl mb-1">{p.label}</div>
                    <div className="font-bold text-sm" style={{ color: 'var(--shopli-teal)' }}>{p.price}</div>
                    <div className="text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>{p.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ====== HOW IT WORKS ====== */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--shopli-orange)' }}>
              {sectionLabel}
            </div>
            <h2 className="section-title mb-3" style={{ color: 'var(--shopli-navy)' }}>{howTitle}</h2>
            <p className="mb-10 max-w-lg" style={{ color: 'var(--shopli-warm-gray)' }}>{howDesc}</p>
            <div className="grid md:grid-cols-3 gap-6">
              {steps.map((step) => (
                <div key={step.num} className="bg-gray-50 rounded-xl p-6 transition-all hover:shadow-md">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white mb-4 text-sm"
                    style={{ background: 'var(--shopli-orange)' }}>
                    {step.num}
                  </div>
                  <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--shopli-navy)' }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== PRODUCTS ====== */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--shopli-orange)' }}>
                  {productSection}
                </div>
                <h2 className="section-title" style={{ color: 'var(--shopli-navy)' }}>{productTitle}</h2>
                <p className="mt-2" style={{ color: 'var(--shopli-warm-gray)' }}>{productDesc}</p>
              </div>
              <a href={`/${region}/products`} className="hidden sm:flex items-center gap-1 text-sm font-semibold hover:underline"
                style={{ color: 'var(--shopli-orange)' }}>
                {rtl ? 'כל המוצרים' : 'All Products'}
                <Icon name={rtl ? 'chevron-left' : 'chevron-right'} size={14} />
              </a>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-12" style={{ color: 'var(--shopli-warm-gray)' }}>
                {rtl ? 'טוען מוצרים...' : 'Loading products...'}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {products.slice(0, 6).map((product) => (
                  <a
                    key={product.id}
                    href={product.affiliateLink}
                    target="_blank"
                    rel="noopener noreferrer sponsored"
                    className="product-card group"
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                      <div className="text-4xl opacity-40">📦</div>
                      {product.isHot && (
                        <span className="badge-hot absolute top-2 right-2">
                          {rtl ? 'חם' : 'HOT'}
                        </span>
                      )}
                      {product.freeShipping && (
                        <span className="badge-shipping absolute top-2 left-2 text-[0.6rem]">
                          {rtl ? 'משלוח חינם' : 'Free Ship'}
                        </span>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/5 to-transparent" />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-semibold leading-tight mb-1 line-clamp-2" style={{ color: 'var(--shopli-navy)' }}>
                        {product.title}
                      </h3>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="font-bold text-base" style={{ color: 'var(--shopli-teal)' }}>
                          {config.currencySymbol}{product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs line-through" style={{ color: 'var(--shopli-warm-gray)' }}>
                            {config.currencySymbol}{product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="star" size={12} className="text-yellow-500" />
                        <span className="text-xs font-medium" style={{ color: 'var(--shopli-warm-gray)' }}>
                          {product.rating}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
                          ({product.reviewCount > 999 ? `${(product.reviewCount / 1000).toFixed(1)}k` : product.reviewCount})
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}

            <div className="mt-8 text-center sm:hidden">
              <a href={`/${region}/products`} className="btn-secondary text-sm">
                {rtl ? 'כל המוצרים' : 'All Products'}
              </a>
            </div>
          </div>
        </section>

        {/* ====== CATEGORIES ====== */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--shopli-orange)' }}>
              {categorySection}
            </div>
            <h2 className="section-title mb-8" style={{ color: 'var(--shopli-navy)' }}>{categoryTitle}</h2>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {CATEGORIES.map((cat) => {
                const catName = cat.name[config.lang as keyof typeof cat.name] || cat.name.en;
                return (
                  <a
                    key={cat.id}
                    href={`/${region}/category/${cat.slug}`}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm"
                      style={{ color: 'var(--shopli-orange)' }}>
                      <Icon name={cat.icon as any} size={20} />
                    </div>
                    <span className="text-xs font-semibold text-center leading-tight" style={{ color: 'var(--shopli-navy)' }}>
                      {catName}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>

        {/* ====== TRUST ====== */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--shopli-orange)' }}>
              {rtl ? 'למה להאמין לנו' : 'Why Trust Us'}
            </div>
            <h2 className="section-title mb-8" style={{ color: 'var(--shopli-navy)' }}>{trustTitle}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((f, i) => (
                <div key={i} className="bg-white rounded-xl p-6 border border-gray-100">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: 'oklch(90% 0.04 45)', color: 'var(--shopli-orange)' }}>
                    <Icon name={f.icon as any} size={20} />
                  </div>
                  <h4 className="font-bold text-base mb-1" style={{ color: 'var(--shopli-navy)' }}>{f.title}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--shopli-warm-gray)' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== CTA ====== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 md:pb-20">
          <div className="rounded-2xl p-8 md:p-16 text-center" style={{
            background: 'var(--shopli-navy)',
            color: 'white',
          }}>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{ctaTitle}</h2>
            <p className="mb-8 max-w-md mx-auto" style={{ color: 'oklch(70% 0.02 80)' }}>{ctaDesc}</p>
            <a
              href={config.tgChannel ? `https://t.me/${config.tgChannel}` : '#'}
              target="_blank"
              rel="noopener"
              className="btn-primary inline-flex text-base px-8 py-3.5"
            >
              <Icon name="telegram" size={20} />
              {tgText}
            </a>
          </div>
        </section>
      </main>

      {/* ====== FOOTER ====== */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--shopli-navy)' }}>
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="var(--shopli-orange)" />
              <path d="M9 12h14l-2 12H11L9 12z" fill="white" opacity="0.9" />
            </svg>
            shopli
          </div>
          <div className="text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
            &copy; {new Date().getFullYear()} Shopli. {rtl ? 'כל הזכויות שמורות' : 'All rights reserved.'}
          </div>
          <div className="flex gap-4 text-xs" style={{ color: 'var(--shopli-warm-gray)' }}>
            {[
              { href: `/${region}/privacy`, label: rtl ? 'פרטיות' : 'Privacy' },
              { href: `/${region}/terms`, label: rtl ? 'תנאים' : 'Terms' },
            ].map((link) => (
              <a key={link.href} href={link.href} className="hover:underline">{link.label}</a>
            ))}
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

  let products: Product[] = [];
  try {
    products = await fetchProducts(region as RegionCode, { limit: 6 });
  } catch {}

  return {
    props: {
      region,
      config,
      products: products || [],
      rtl,
    },
  };
};