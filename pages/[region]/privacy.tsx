import { GetServerSideProps } from 'next';
import Header from '../../components/Header';
import { getRegion, isValidRegion, RegionCode, RegionConfig } from '../../lib/regions';
import SeoHead from '../../components/SeoHead';
import { SITE_URL } from '../../lib/seo';

interface PrivacyPageProps {
  region: RegionCode;
  config: RegionConfig;
  rtl: boolean;
}

const CONTENT: Record<string, { title: string; heading: string; sections: Array<{ title: string; content: string[] }> }> = {
  en: {
    title: 'Privacy Policy',
    heading: 'Privacy Policy',
    sections: [
      {
        title: 'Overview',
        content: [
          'Shopli respects your privacy. This page describes what information we collect and how we use it. We do not collect personal information like names, email addresses, or payment details unless you voluntarily provide them.',
        ],
      },
      {
        title: 'Analytics with PostHog',
        content: [
          'We use PostHog (hosted at eu.i.posthog.com) to understand how visitors use Shopli. PostHog tracks:',
          '• Which pages you visit',
          '• How long you stay on pages',
          '• Whether you click on product links or share products',
          '• Your approximate location (by region code, not GPS)',
          '• Information about your browser and device type',
          'PostHog does not collect your name, email, or phone number. Data is stored on eu.i.posthog.com servers.',
        ],
      },
      {
        title: 'Affiliate Link Tracking',
        content: [
          'When you click on a link to AliExpress, we log:',
          '• The product you clicked (product ID and title)',
          '• The page you were on',
          '• Your approximate region',
          'This information helps us understand which products are genuinely popular. It does not include personal data.',
          'AliExpress affiliate links may also carry your session identifier in the URL. This is controlled by AliExpress, not Shopli, and is necessary for us to earn the affiliate commission.',
        ],
      },
      {
        title: 'Wishlist Storage',
        content: [
          'Your wishlist is stored in your browser\'s localStorage — entirely on your device. We never see your wishlist data on our servers. Clearing your browser data will clear your wishlist.',
        ],
      },
      {
        title: 'Cookies',
        content: [
          'We do not set cookies. However, PostHog and AliExpress may set their own cookies for analytics and tracking purposes. See their privacy policies for details.',
        ],
      },
      {
        title: 'Data Requests',
        content: [
          'If you have questions about what data Shopli has collected about you, or to request deletion of data, contact: ohadf2015@gmail.com',
        ],
      },
      {
        title: 'External Links',
        content: [
          'Shopli is not responsible for the privacy practices of AliExpress, PostHog, or other third-party services. Please review their privacy policies for details on how they handle your data.',
        ],
      },
    ],
  },
  he: {
    title: 'מדיניות פרטיות',
    heading: 'מדיניות פרטיות',
    sections: [
      {
        title: 'סקירה כללית',
        content: [
          'שופלי מוערכת את הפרטיות שלכם. דף זה מתאר אילו מידע אנחנו אוספים וכיצד אנחנו משתמשים בו. אנחנו לא אוספים מידע אישי כמו שמות, כתובות דוא"ל או פרטי תשלום אלא אם תספקו אותם בהתנדבות.',
        ],
      },
      {
        title: 'ניתוחי שימוש עם PostHog',
        content: [
          'אנחנו משתמשים ב-PostHog (מתוכנן ב-eu.i.posthog.com) כדי להבין כיצד מבקרים משתמשים בשופלי. PostHog עוקב אחר:',
          '• עמודים אותם אתם מבקרים',
          '• כמה זמן אתם שוהים בעמודים',
          '• האם אתם לוחצים על קישורי מוצרים או משתפים מוצרים',
          '• המיקום המשוער שלכם (לפי קוד אזור, לא GPS)',
          '• מידע על דפדפן וסוג ההתקן שלכם',
          'PostHog לא אוסף את שמכם, דוא"ל או מספר טלפון. נתונים מאוחסנים בשרתי eu.i.posthog.com.',
        ],
      },
      {
        title: 'מעקב קישורים אפיליאט',
        content: [
          'כאשר אתם לוחצים על קישור לאליאקספרס, אנחנו רושמים:',
          '• המוצר שלחצתם עליו (מזהה מוצר וכותרת)',
          '• העמוד בו הייתם',
          '• האזור המשוער שלכם',
          'מידע זה עוזר לנו להבין אילו מוצרים באמת פופולריים. זה לא כולל נתונים אישיים.',
          'קישורי אפיליאט של אליאקספרס עשויים גם לשאת מזהה הפעלה שלכם בכתובת URL. זה שולט על ידי אליאקספרס, לא שופלי, והוא הכרחי כדי שנוכל להרוויח את עמלת האפיליאט.',
        ],
      },
      {
        title: 'אחסון רשימת מועדפים',
        content: [
          'רשימת המועדפים שלכם מאוחסנת ב-localStorage של הדפדפן שלכם — לגמרי בהתקן שלכם. אנחנו לעולם לא רואים נתונים של רשימת מועדפים בשרתים שלנו. מחיקת נתוני הדפדפן שלכם תמחק את רשימת המועדפים שלכם.',
        ],
      },
      {
        title: ' cookies',
        content: [
          'אנחנו לא מציבים cookies. עם זאת, PostHog ואליאקספרס עשויים להגדיר cookies משלהם לצורכי ניתוח וניהול. ראו את מדיניות הפרטיות שלהם לפרטים.',
        ],
      },
      {
        title: 'בקשות נתונים',
        content: [
          'אם יש לכם שאלות לגבי איזה מידע שופלי אספה עליכם, או לבקשת מחיקת נתונים, צרו קשר: ohadf2015@gmail.com',
        ],
      },
      {
        title: 'קישורים חיצוניים',
        content: [
          'שופלי אינה אחראית לנהלי הפרטיות של אליאקספרס, PostHog או שירותי צד שלישי אחרים. אנא בדקו את מדיניות הפרטיות שלהם לפרטים על כיצד הם מטפלים בנתונים שלכם.',
        ],
      },
    ],
  },
  fr: {
    title: 'Politique de confidentialité',
    heading: 'Politique de confidentialité',
    sections: [
      {
        title: 'Aperçu',
        content: [
          'Shopli respecte votre confidentialité. Cette page décrit quelles informations nous collectons et comment nous les utilisons. Nous ne collectons pas d\'informations personnelles telles que les noms, les adresses e-mail ou les détails de paiement à moins que vous ne les fournissiez volontairement.',
        ],
      },
      {
        title: 'Analyses avec PostHog',
        content: [
          'Nous utilisons PostHog (hébergé sur eu.i.posthog.com) pour comprendre comment les visiteurs utilisent Shopli. PostHog suit:',
          '• Les pages que vous visitez',
          '• Combien de temps vous restez sur les pages',
          '• Si vous cliquez sur des liens de produits ou partagez des produits',
          '• Votre emplacement approximatif (par code de région, pas GPS)',
          '• Les informations sur votre navigateur et le type d\'appareil',
          'PostHog ne collecte pas votre nom, e-mail ou numéro de téléphone. Les données sont stockées sur les serveurs eu.i.posthog.com.',
        ],
      },
      {
        title: 'Suivi des liens d\'affiliation',
        content: [
          'Quand vous cliquez sur un lien vers AliExpress, nous enregistrons:',
          '• Le produit sur lequel vous avez cliqué (ID et titre du produit)',
          '• La page sur laquelle vous étiez',
          '• Votre région approximative',
          'Ces informations nous aident à comprendre quels produits sont véritablement populaires. Cela n\'inclut pas de données personnelles.',
          'Les liens d\'affiliation AliExpress peuvent également porter votre identifiant de session dans l\'URL. Ceci est contrôlé par AliExpress, pas Shopli, et est nécessaire pour que nous gagnions la commission d\'affiliation.',
        ],
      },
      {
        title: 'Stockage de la liste de souhaits',
        content: [
          'Votre liste de souhaits est stockée dans le localStorage de votre navigateur — entièrement sur votre appareil. Nous ne voyons jamais les données de votre liste de souhaits sur nos serveurs. L\'effacement de vos données de navigateur effacera votre liste de souhaits.',
        ],
      },
      {
        title: 'Cookies',
        content: [
          'Nous ne définissons pas de cookies. Cependant, PostHog et AliExpress peuvent définir leurs propres cookies à des fins d\'analyse et de suivi. Consultez leurs politiques de confidentialité pour plus de détails.',
        ],
      },
      {
        title: 'Demandes de données',
        content: [
          'Si vous avez des questions sur les données que Shopli a collectées sur vous, ou pour demander la suppression des données, contactez: ohadf2015@gmail.com',
        ],
      },
      {
        title: 'Liens externes',
        content: [
          'Shopli n\'est pas responsable des pratiques de confidentialité d\'AliExpress, PostHog ou d\'autres services tiers. Veuillez consulter leurs politiques de confidentialité pour des détails sur la façon dont ils gèrent vos données.',
        ],
      },
    ],
  },
  de: {
    title: 'Datenschutzerklärung',
    heading: 'Datenschutzerklärung',
    sections: [
      {
        title: 'Überblick',
        content: [
          'Shopli respektiert Ihre Privatsphäre. Diese Seite beschreibt, welche Informationen wir sammeln und wie wir sie verwenden. Wir sammeln keine persönlichen Informationen wie Namen, E-Mail-Adressen oder Zahlungsdaten, es sei denn, Sie stellen diese freiwillig bereit.',
        ],
      },
      {
        title: 'Analytics mit PostHog',
        content: [
          'Wir verwenden PostHog (gehostet auf eu.i.posthog.com), um zu verstehen, wie Besucher Shopli nutzen. PostHog verfolgt:',
          '• Welche Seiten Sie besuchen',
          '• Wie lange Sie auf Seiten bleiben',
          '• Ob Sie auf Produktlinks klicken oder Produkte teilen',
          '• Ihren ungefähren Standort (nach Regionscode, nicht GPS)',
          '• Informationen über Ihren Browser und Gerätetyp',
          'PostHog erfasst weder Ihren Namen noch Ihre E-Mail oder Telefonnummer. Daten werden auf den Servern von eu.i.posthog.com gespeichert.',
        ],
      },
      {
        title: 'Tracking von Affiliate-Links',
        content: [
          'Wenn Sie auf einen AliExpress-Link klicken, protokollieren wir:',
          '• Das Produkt, auf das Sie geklickt haben (Produkt-ID und Titel)',
          '• Die Seite, auf der Sie waren',
          '• Ihre ungefähre Region',
          'Diese Informationen helfen uns zu verstehen, welche Produkte wirklich beliebt sind. Es enthält keine persönlichen Daten.',
          'AliExpress-Affiliate-Links können auch Ihre Sitzungskennung in der URL enthalten. Dies wird von AliExpress kontrolliert, nicht von Shopli, und ist erforderlich, damit wir die Affiliate-Provision verdienen.',
        ],
      },
      {
        title: 'Wunschliste-Speicherung',
        content: [
          'Ihre Wunschliste wird im localStorage Ihres Browsers gespeichert — vollständig auf Ihrem Gerät. Wir sehen niemals Ihre Wunschlisten-Daten auf unseren Servern. Das Löschen Ihrer Browserdaten löscht Ihre Wunschliste.',
        ],
      },
      {
        title: 'Cookies',
        content: [
          'Wir setzen keine Cookies. PostHog und AliExpress können jedoch ihre eigenen Cookies zu Analyse- und Tracking-Zwecken setzen. Weitere Details finden Sie in deren Datenschutzrichtlinien.',
        ],
      },
      {
        title: 'Datenanfragen',
        content: [
          'Wenn Sie Fragen dazu haben, welche Daten Shopli über Sie gesammelt hat, oder um die Löschung von Daten anzufordern, wenden Sie sich bitte an: ohadf2015@gmail.com',
        ],
      },
      {
        title: 'Externe Links',
        content: [
          'Shopli ist nicht verantwortlich für die Datenschutzpraktiken von AliExpress, PostHog oder anderen Drittanbieter-Services. Bitte lesen Sie deren Datenschutzrichtlinien für Details, wie sie mit Ihren Daten umgehen.',
        ],
      },
    ],
  },
  es: {
    title: 'Política de privacidad',
    heading: 'Política de privacidad',
    sections: [
      {
        title: 'Descripción general',
        content: [
          'Shopli respeta tu privacidad. Esta página describe qué información recopilamos y cómo la usamos. No recopilamos información personal como nombres, direcciones de correo electrónico o detalles de pago a menos que los proporciones voluntariamente.',
        ],
      },
      {
        title: 'Análisis con PostHog',
        content: [
          'Usamos PostHog (alojado en eu.i.posthog.com) para entender cómo los visitantes usan Shopli. PostHog rastrea:',
          '• Qué páginas visitas',
          '• Cuánto tiempo permaneces en las páginas',
          '• Si haces clic en enlaces de productos o compartes productos',
          '• Tu ubicación aproximada (por código de región, no GPS)',
          '• Información sobre tu navegador y tipo de dispositivo',
          'PostHog no recopila tu nombre, correo electrónico o número de teléfono. Los datos se almacenan en los servidores eu.i.posthog.com.',
        ],
      },
      {
        title: 'Seguimiento de enlaces de afiliación',
        content: [
          'Cuando haces clic en un enlace a AliExpress, registramos:',
          '• El producto en el que hiciste clic (ID y título del producto)',
          '• La página en la que estabas',
          '• Tu región aproximada',
          'Esta información nos ayuda a entender qué productos son genuinamente populares. No incluye datos personales.',
          'Los enlaces de afiliación de AliExpress también pueden llevar tu identificador de sesión en la URL. Esto es controlado por AliExpress, no por Shopli, y es necesario para que ganemos la comisión de afiliación.',
        ],
      },
      {
        title: 'Almacenamiento de lista de deseos',
        content: [
          'Tu lista de deseos se almacena en el localStorage de tu navegador — completamente en tu dispositivo. Nunca vemos los datos de tu lista de deseos en nuestros servidores. Borrar tus datos del navegador borrará tu lista de deseos.',
        ],
      },
      {
        title: 'Cookies',
        content: [
          'No establecemos cookies. Sin embargo, PostHog y AliExpress pueden establecer sus propias cookies para fines de análisis y seguimiento. Consulta sus políticas de privacidad para más detalles.',
        ],
      },
      {
        title: 'Solicitudes de datos',
        content: [
          'Si tienes preguntas sobre qué datos ha recopilado Shopli sobre ti, o para solicitar la eliminación de datos, contacta: ohadf2015@gmail.com',
        ],
      },
      {
        title: 'Enlaces externos',
        content: [
          'Shopli no es responsable de las prácticas de privacidad de AliExpress, PostHog u otros servicios de terceros. Consulta sus políticas de privacidad para obtener detalles sobre cómo manejan tus datos.',
        ],
      },
    ],
  },
  it: {
    title: 'Politica sulla privacy',
    heading: 'Politica sulla privacy',
    sections: [
      {
        title: 'Panoramica',
        content: [
          'Shopli rispetta la tua privacy. Questa pagina descrive quali informazioni raccogliamo e come le utilizziamo. Non raccogliamo informazioni personali come nomi, indirizzi e-mail o dettagli di pagamento a meno che non li fornisci volontariamente.',
        ],
      },
      {
        title: 'Analitiche con PostHog',
        content: [
          'Utilizziamo PostHog (ospitato su eu.i.posthog.com) per capire come i visitatori utilizzano Shopli. PostHog traccia:',
          '• Quali pagine visiti',
          '• Quanto tempo rimani sulle pagine',
          '• Se fai clic su link di prodotti o condividi prodotti',
          '• La tua posizione approssimativa (per codice di regione, non GPS)',
          '• Informazioni sul tuo browser e tipo di dispositivo',
          'PostHog non raccoglie il tuo nome, e-mail o numero di telefono. I dati vengono archiviati sui server eu.i.posthog.com.',
        ],
      },
      {
        title: 'Tracciamento dei link di affiliazione',
        content: [
          'Quando fai clic su un link ad AliExpress, registriamo:',
          '• Il prodotto su cui hai fatto clic (ID e titolo del prodotto)',
          '• La pagina su cui eri',
          '• La tua regione approssimativa',
          'Queste informazioni ci aiutano a capire quali prodotti sono genuinamente popolari. Non include dati personali.',
          'I link di affiliazione di AliExpress potrebbero anche portare il tuo identificatore di sessione nell\'URL. Questo è controllato da AliExpress, non da Shopli, ed è necessario affinché guadagniamo la commissione di affiliazione.',
        ],
      },
      {
        title: 'Archiviazione della lista dei desideri',
        content: [
          'La tua lista dei desideri viene archiviata nel localStorage del tuo browser — interamente sul tuo dispositivo. Non vediamo mai i dati della tua lista dei desideri sui nostri server. L\'eliminazione dei dati del browser eliminerà la tua lista dei desideri.',
        ],
      },
      {
        title: 'Cookie',
        content: [
          'Non impostiamo cookie. Tuttavia, PostHog e AliExpress possono impostare i propri cookie a scopo di analisi e tracciamento. Consulta le loro politiche sulla privacy per ulteriori dettagli.',
        ],
      },
      {
        title: 'Richieste di dati',
        content: [
          'Se hai domande su quali dati Shopli ha raccolto su di te, o per richiedere l\'eliminazione dei dati, contattami: ohadf2015@gmail.com',
        ],
      },
      {
        title: 'Link esterni',
        content: [
          'Shopli non è responsabile delle pratiche sulla privacy di AliExpress, PostHog o altri servizi di terze parti. Consulta le loro politiche sulla privacy per i dettagli su come gestiscono i tuoi dati.',
        ],
      },
    ],
  },
  ru: {
    title: 'Политика конфиденциальности',
    heading: 'Политика конфиденциальности',
    sections: [
      {
        title: 'Обзор',
        content: [
          'Shopli уважает вашу конфиденциальность. На этой странице описана информация, которую мы собираем, и способы её использования. Мы не собираем личную информацию, такую ​​как имена, адреса электронной почты или данные платежей, если вы их добровольно не предоставляете.',
        ],
      },
      {
        title: 'Аналитика с PostHog',
        content: [
          'Мы используем PostHog (размещён на eu.i.posthog.com), чтобы понять, как посетители используют Shopli. PostHog отслеживает:',
          '• Какие страницы вы посещаете',
          '• Сколько времени вы проводите на страницах',
          '• Нажимаете ли вы на ссылки продуктов или делитесь продуктами',
          '• Ваше приблизительное местоположение (по коду региона, не GPS)',
          '• Информацию о вашем браузере и типе устройства',
          'PostHog не собирает ваше имя, электронную почту или номер телефона. Данные хранятся на серверах eu.i.posthog.com.',
        ],
      },
      {
        title: 'Отслеживание партнёрских ссылок',
        content: [
          'Когда вы нажимаете на ссылку на AliExpress, мы регистрируем:',
          '• Продукт, на который вы нажали (ID и название продукта)',
          '• Страницу, на которой вы находились',
          '• Ваш приблизительный регион',
          'Эта информация помогает нам понять, какие продукты действительно популярны. Она не включает личные данные.',
          'Партнёрские ссылки AliExpress могут также содержать ваш идентификатор сеанса в URL-адресе. Это контролируется AliExpress, а не Shopli, и необходимо для того, чтобы мы получали партнёрскую комиссию.',
        ],
      },
      {
        title: 'Хранилище списка желаний',
        content: [
          'Ваш список желаний хранится в localStorage вашего браузера — полностью на вашем устройстве. Мы никогда не видим данные вашего списка желаний на наших серверах. Удаление данных браузера приведёт к удалению вашего списка желаний.',
        ],
      },
      {
        title: 'Файлы cookie',
        content: [
          'Мы не устанавливаем файлы cookie. Однако PostHog и AliExpress могут устанавливать свои собственные файлы cookie в целях аналитики и отслеживания. Подробности см. в их политиках конфиденциальности.',
        ],
      },
      {
        title: 'Запросы данных',
        content: [
          'Если у вас есть вопросы о том, какие данные Shopli собрала о вас, или для запроса удаления данных, свяжитесь с: ohadf2015@gmail.com',
        ],
      },
      {
        title: 'Внешние ссылки',
        content: [
          'Shopli не несёт ответственность за практику конфиденциальности AliExpress, PostHog или других сторонних сервисов. Пожалуйста, ознакомьтесь с их политиками конфиденциальности для получения информации о том, как они обрабатывают ваши данные.',
        ],
      },
    ],
  },
};

export default function PrivacyPage({ region, config, rtl }: PrivacyPageProps) {
  const lang = (config.lang || 'en') as keyof typeof CONTENT;
  const content = CONTENT[lang] || CONTENT.en;
  const pageUrl = `${SITE_URL}/${region}/privacy`;

  return (
    <>
      <SeoHead
        region={region}
        path="/privacy"
        title={content.title}
        description="Learn how Shopli collects and uses your data."
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
              <div className="space-y-2">
                {section.content.map((line, lineIdx) => (
                  <p
                    key={lineIdx}
                    className="text-base leading-relaxed"
                    style={{ color: line.startsWith('•') ? 'var(--shopli-warm-gray)' : 'var(--shopli-warm-gray)' }}
                  >
                    {line}
                  </p>
                ))}
              </div>
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
