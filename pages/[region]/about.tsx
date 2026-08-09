import { GetServerSideProps } from 'next';
import Header from '../../components/Header';
import { getRegion, isValidRegion, RegionCode, RegionConfig } from '../../lib/regions';
import SeoHead from '../../components/SeoHead';
import { SITE_URL } from '../../lib/seo';

interface AboutPageProps {
  region: RegionCode;
  config: RegionConfig;
  rtl: boolean;
}

const CONTENT: Record<string, { title: string; heading: string; sections: Array<{ title: string; text: string }> }> = {
  en: {
    title: 'About Shopli',
    heading: 'About Shopli',
    sections: [
      {
        title: 'What is Shopli?',
        text: 'Shopli is an independent deal-curation website. We find and rank trending products on AliExpress based on real-time data — current prices, customer ratings, review counts, and order volume. Our goal is to help you discover great products and the best deals available.',
      },
      {
        title: 'We are not AliExpress',
        text: 'Shopli is not owned by, affiliated with (except through the public affiliate program), or endorsed by Alibaba Group or AliExpress beyond the affiliate commission structure. All product images, trademarks, and product listings belong to their respective owners.',
      },
      {
        title: 'How we make money',
        text: 'Shopli earns a commission on qualifying purchases made through our affiliate links. This commission comes from AliExpress at no extra cost to you. The commission we earn does not influence which products we show or how we rank them — our rankings are based purely on data quality signals.',
      },
      {
        title: 'Operator',
        text: 'Shopli is operated by Ohad Fisher, based in Israel. Contact: ohadf2015@gmail.com',
      },
    ],
  },
  he: {
    title: 'על שופלי',
    heading: 'על שופלי',
    sections: [
      {
        title: 'מה זה שופלי?',
        text: 'שופלי היא אתר עצמאי לקיוריישן של דילים. אנחנו מוצאים ודירגים מוצרים פופולריים באליאקספרס על בסיס נתונים בזמן אמת — מחיר עדכני, דירוגי לקוחות, מספר ביקורות וכמות הזמנות. המטרה שלנו היא לעזור לכם לגלות מוצרים멋ים ודילים טובים.',
      },
      {
        title: 'אנחנו לא אליאקספרס',
        text: 'שופלי אינה בבעלות אליאקספרס, אינה שותפה שלה (חוץ מתכנית האפיליאט הציבורית) ואינה נתמכת על ידי Alibaba Group או אליאקספרס מעבר למבנה עמלת האפיליאט. כל תמונות המוצרים, הסימנים המסחריים והרשימות של מוצרים שייכות לבעליהם.',
      },
      {
        title: 'איך אנחנו מרוויחים כסף',
        text: 'שופלי מרוויחה עמלה בעקבות קנייות מעבר לקישורי אפיליאט שלנו. העמלה הזאת בעלת סכום קטן מאליאקספרס וללא עלות נוספת לכם. העמלה שאנחנו מרוויחים לא משפיעה על המוצרים שאנחנו מציגים או על איך אנחנו דירגנו אותם — הדירוג שלנו מבוסס אך ורק על אותות איכות נתונים.',
      },
      {
        title: 'מפעיל',
        text: 'שופלי מופעלת על ידי אוהד פישר, תושב ישראל. יצירת קשר: ohadf2015@gmail.com',
      },
    ],
  },
  fr: {
    title: 'À propos de Shopli',
    heading: 'À propos de Shopli',
    sections: [
      {
        title: 'Qu\'est-ce que Shopli ?',
        text: 'Shopli est un site indépendant de curation d\'offres. Nous trouvons et classons les produits tendance sur AliExpress en fonction de données en temps réel — prix actuels, notes des clients, nombre d\'avis et volume de commandes. Notre objectif est de vous aider à découvrir d\'excellents produits et les meilleures offres disponibles.',
      },
      {
        title: 'Nous ne sommes pas AliExpress',
        text: 'Shopli n\'est pas détenue par AliExpress, n\'est pas associée (sauf par le programme d\'affiliation public) et n\'est pas approuvée par le groupe Alibaba ou AliExpress au-delà de la structure de commission d\'affiliation. Toutes les images de produits, marques et listes de produits appartiennent à leurs propriétaires respectifs.',
      },
      {
        title: 'Comment nous gagnons de l\'argent',
        text: 'Shopli gagne une commission sur les achats qualifiants effectués via nos liens d\'affiliation. Cette commission provient d\'AliExpress à aucun coût supplémentaire pour vous. La commission que nous gagnons n\'influence pas les produits que nous montrons ni comment nous les classons — nos classements sont basés uniquement sur des signaux de qualité des données.',
      },
      {
        title: 'Opérateur',
        text: 'Shopli est exploitée par Ohad Fisher, basée en Israël. Contact : ohadf2015@gmail.com',
      },
    ],
  },
  de: {
    title: 'Über Shopli',
    heading: 'Über Shopli',
    sections: [
      {
        title: 'Was ist Shopli?',
        text: 'Shopli ist eine unabhängige Deal-Kuratierungswebsite. Wir finden und bewerten Trendprodukte auf AliExpress anhand von Echtzeitdaten — aktuelle Preise, Kundenbewertungen, Anzahl der Rezensionen und Bestellvolumen. Unser Ziel ist es, Ihnen bei der Entdeckung großartiger Produkte und der besten verfügbaren Angebote zu helfen.',
      },
      {
        title: 'Wir sind nicht AliExpress',
        text: 'Shopli ist weder Eigentum von noch verbunden mit (außer durch das öffentliche Partnerprogramm) noch von der Alibaba-Gruppe oder AliExpress gebilligt, außer für die Provisionsstruktur des Partners. Alle Produktbilder, Marken und Produktlisten gehören ihren jeweiligen Eigentümern.',
      },
      {
        title: 'Wie wir Geld verdienen',
        text: 'Shopli verdient eine Provision auf qualifizierende Käufe über unsere Affiliate-Links. Diese Provision kommt von AliExpress ohne zusätzliche Kosten für Sie. Die Provision, die wir verdienen, beeinflusst nicht, welche Produkte wir anzeigen oder wie wir sie bewerten — unsere Bewertungen basieren rein auf Datensignalen.',
      },
      {
        title: 'Betreiber',
        text: 'Shopli wird von Ohad Fisher mit Sitz in Israel betrieben. Kontakt: ohadf2015@gmail.com',
      },
    ],
  },
  es: {
    title: 'Acerca de Shopli',
    heading: 'Acerca de Shopli',
    sections: [
      {
        title: '¿Qué es Shopli?',
        text: 'Shopli es un sitio independiente de curación de ofertas. Encontramos y clasificamos productos en tendencia en AliExpress basándonos en datos en tiempo real — precios actuales, calificaciones de clientes, cantidad de reseñas y volumen de pedidos. Nuestro objetivo es ayudarte a descubrir productos excelentes y las mejores ofertas disponibles.',
      },
      {
        title: 'No somos AliExpress',
        text: 'Shopli no es propiedad de AliExpress, no está afiliada (excepto a través del programa de afiliados público) ni está respaldada por el grupo Alibaba o AliExpress más allá de la estructura de comisión de afiliados. Todas las imágenes de productos, marcas comerciales y listados de productos pertenecen a sus respectivos propietarios.',
      },
      {
        title: 'Cómo ganamos dinero',
        text: 'Shopli gana una comisión en compras calificadas realizadas a través de nuestros enlaces de afiliados. Esta comisión proviene de AliExpress sin costo adicional para ti. La comisión que ganamos no influye en qué productos mostramos ni cómo los clasificamos — nuestras clasificaciones se basan únicamente en señales de calidad de datos.',
      },
      {
        title: 'Operador',
        text: 'Shopli es operada por Ohad Fisher, con sede en Israel. Contacto: ohadf2015@gmail.com',
      },
    ],
  },
  it: {
    title: 'Chi siamo',
    heading: 'Chi siamo',
    sections: [
      {
        title: 'Cos\'è Shopli?',
        text: 'Shopli è un sito indipendente di cura delle offerte. Troviamo e classifichiamo i prodotti di tendenza su AliExpress in base a dati in tempo reale — prezzi attuali, valutazioni dei clienti, numero di recensioni e volume di ordini. Il nostro obiettivo è aiutarti a scoprire ottimi prodotti e le migliori offerte disponibili.',
      },
      {
        title: 'Non siamo AliExpress',
        text: 'Shopli non è di proprietà di AliExpress, non è affiliata (se non attraverso il programma di affiliazione pubblico) e non è approvata dal gruppo Alibaba o AliExpress al di là della struttura delle commissioni di affiliazione. Tutte le immagini dei prodotti, i marchi e gli elenchi dei prodotti appartengono ai rispettivi proprietari.',
      },
      {
        title: 'Come guadagniamo',
        text: 'Shopli guadagna una commissione sugli acquisti idonei effettuati attraverso i nostri link di affiliazione. Questa commissione viene da AliExpress senza costi aggiuntivi per te. La commissione che guadagniamo non influenza quali prodotti mostriamo o come li classifichiamo — le nostre classificazioni si basano esclusivamente su segnali di qualità dei dati.',
      },
      {
        title: 'Operatore',
        text: 'Shopli è gestita da Ohad Fisher, con sede in Israele. Contatti: ohadf2015@gmail.com',
      },
    ],
  },
  ru: {
    title: 'О Shopli',
    heading: 'О Shopli',
    sections: [
      {
        title: 'Что такое Shopli?',
        text: 'Shopli — это независимый сайт по кураторству предложений. Мы находим и ранжируем трендовые товары на AliExpress на основе данных в реальном времени — текущие цены, оценки клиентов, количество отзывов и объем заказов. Наша цель — помочь вам найти отличные товары и лучшие доступные предложения.',
      },
      {
        title: 'Мы не AliExpress',
        text: 'Shopli не принадлежит AliExpress, не аффилирована с ней (кроме публичной партнёрской программы) и не одобрена группой Alibaba или AliExpress за пределами структуры комиссии аффилиата. Все изображения товаров, торговые марки и списки товаров принадлежат их владельцам.',
      },
      {
        title: 'Как мы зарабатываем',
        text: 'Shopli получает комиссию за квалифицирующие покупки, совершённые по нашим партнёрским ссылкам. Эта комиссия поступает от AliExpress без дополнительных затрат для вас. Комиссия, которую мы зарабатываем, не влияет на то, какие товары мы показываем или как мы их ранжируем — наши рейтинги основаны исключительно на сигналах качества данных.',
      },
      {
        title: 'Оператор',
        text: 'Shopli управляется Охадом Фишером, базируется в Израиле. Контакты: ohadf2015@gmail.com',
      },
    ],
  },
};

export default function AboutPage({ region, config, rtl }: AboutPageProps) {
  const lang = (config.lang || 'en') as keyof typeof CONTENT;
  const content = CONTENT[lang] || CONTENT.en;
  const pageUrl = `${SITE_URL}/${region}/about`;

  return (
    <>
      <SeoHead
        region={region}
        path="/about"
        title={content.title}
        description="Learn about Shopli: an independent AliExpress affiliate that finds and curates trending products."
        canonical={pageUrl}
      />
      <Header currentRegion={region} dir={config.direction} />

      <main
        className="max-w-3xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-16"
        style={{ fontFamily: rtl ? "var(--font-assistant), system-ui, sans-serif" : undefined }}
      >
        <h1
          className="text-3xl md:text-4xl font-extrabold mb-8"
          style={{ color: 'var(--shopli-navy)' }}
        >
          {content.heading}
        </h1>

        <div className="space-y-8">
          {content.sections.map((section, idx) => (
            <section key={idx}>
              <h2
                className="text-xl font-bold mb-3"
                style={{ color: 'var(--shopli-navy)' }}
              >
                {section.title}
              </h2>
              <p
                className="text-base leading-relaxed"
                style={{ color: 'var(--shopli-warm-gray)' }}
              >
                {section.text}
              </p>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params, res }) => {
  const region = ((params?.region as string) || 'eu') as RegionCode;
  if (!isValidRegion(region)) return { notFound: true };
  const config = getRegion(region);
  const rtl = config.direction === 'rtl';

  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');

  return {
    props: {
      region,
      config,
      rtl,
    },
  };
};
