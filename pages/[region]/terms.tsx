import { GetServerSideProps } from 'next';
import Header from '../../components/Header';
import { getRegion, isValidRegion, RegionCode, RegionConfig } from '../../lib/regions';
import SeoHead from '../../components/SeoHead';
import { SITE_URL } from '../../lib/seo';

interface TermsPageProps {
  region: RegionCode;
  config: RegionConfig;
  rtl: boolean;
}

const CONTENT: Record<string, { title: string; heading: string; sections: Array<{ title: string; content: string[] }> }> = {
  en: {
    title: 'Terms of Service',
    heading: 'Terms of Service',
    sections: [
      {
        title: 'Affiliate Relationship',
        content: [
          'Shopli participates in the AliExpress affiliate program. When you click on a product link and make a purchase on AliExpress, Shopli may earn a referral commission. This commission does not affect the price you pay.',
        ],
      },
      {
        title: 'Third-Party Content and Listings',
        content: [
          'All product information, images, prices, and listings on Shopli come from AliExpress or other third parties. Shopli does not own, sell, or represent these products. Product availability, pricing, and details are subject to change based on the original merchant\'s decisions.',
          'Shopli is not responsible for:',
          '• Product quality or condition',
          '• Prices shown (verify on AliExpress before purchase)',
          '• Product availability or shipping',
          '• Customer service or returns',
        ],
      },
      {
        title: 'No Warranty',
        content: [
          'Shopli provides product information "as is" without any warranty, express or implied. We make no guarantees about accuracy, completeness, or fitness for a particular purpose.',
        ],
      },
      {
        title: 'Limitation of Liability',
        content: [
          'To the maximum extent permitted by law, Shopli shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of data, revenue, or profit, arising from or in connection with your use of Shopli.',
        ],
      },
      {
        title: 'Purchases on AliExpress',
        content: [
          'All transactions, payments, shipping, returns, and disputes happen directly with AliExpress or the merchant. Shopli is merely a curator and affiliate partner. For questions, complaints, or refunds, contact AliExpress directly, not Shopli.',
        ],
      },
      {
        title: 'Intellectual Property',
        content: [
          'Shopli name and branding are the property of Shopli. Product names, images, and trademarks belong to their respective owners.',
          'You may not use Shopli or its content for commercial purposes without permission.',
        ],
      },
      {
        title: 'Prohibited Conduct',
        content: [
          'You agree not to:',
          '• Engage in any unlawful or fraudulent activity',
          '• Attempt to reverse-engineer or scrape Shopli',
          '• Interfere with Shopli\'s operation or security',
          '• Collect or transmit any personal data without consent',
        ],
      },
      {
        title: 'Changes to These Terms',
        content: [
          'Shopli may update these terms at any time. Your continued use of Shopli implies acceptance of the updated terms.',
        ],
      },
      {
        title: 'Governing Law',
        content: [
          'These terms are governed by the laws of Israel. Any disputes shall be resolved in Israeli courts.',
        ],
      },
      {
        title: 'Contact',
        content: [
          'For questions or concerns about these terms, contact: ohadf2015@gmail.com',
        ],
      },
    ],
  },
  he: {
    title: 'תנאי השירות',
    heading: 'תנאי השירות',
    sections: [
      {
        title: 'יחסי אפיליאט',
        content: [
          'שופלי משתתפת בתכנית האפיליאט של אליאקספרס. כאשר אתם לוחצים על קישור מוצר ומבצעים קנייה באליאקספרס, שופלי עשויה להרוויח עמלת הפניה. עמלה זו לא משפיעה על המחיר שאתם משלמים.',
        ],
      },
      {
        title: 'תוכן וקישורים של צד שלישי',
        content: [
          'כל מידע המוצר, תמונות, מחירים ורשימות על שופלי מגיעים מאליאקספרס או מצדדים שלישיים אחרים. שופלי לא בעלת, לא מוכרת, וגם לא מייצגת מוצרים אלה. זמינות המוצר, המחיר והפרטים כפופים לשינוי בהתאם להחלטות של הסוחר המקורי.',
          'שופלי אינה אחראית עבור:',
          '• איכות המוצר או מצבו',
          '• המחירים המוצגים (אמתו באליאקספרס לפני קנייה)',
          '• זמינות המוצר או משלוח',
          '• שירות לקוחות או החזרות',
        ],
      },
      {
        title: 'אין הבטחה',
        content: [
          'שופלי מספקת מידע מוצר "כפי שהוא" ללא כל הבטחה, מפורשת או משתמעת. אנחנו לא נותנות ערבויות לגבי דיוק, שלמות, או התאמה לתכנית מסוימת.',
        ],
      },
      {
        title: 'הגבלת אחריות',
        content: [
          'למידת הרחוק המרבית המותרת על ידי חוק, שופלי לא תהיה אחראית לכל נזק עקיף, אפיזודי, מיוחד, כמויות או קנסות, או כל אובדן נתונים, הכנסות או רווח, הנובע מ או בקשר לשימוש שלכם בשופלי.',
        ],
      },
      {
        title: 'קנייות באליאקספרס',
        content: [
          'כל עסקאות, תשלומים, משלוח, החזרות וסכסוכים מתרחשים ישירות עם אליאקספרס או הסוחר. שופלי היא רק קיוריית ושותפת אפיליאט. לשאלות, תלונות או החזרים, צרו קשר ישירות עם אליאקספרס, לא עם שופלי.',
        ],
      },
      {
        title: 'קניין רוחני',
        content: [
          'שם וייחוד של שופלי הם רכוש של שופלי. שמות מוצרים, תמונות וסימנים מסחריים שייכים לבעליהם בהתאמה.',
          'אתם אינכם רשאים להשתמש בשופלי או בתוכנה שלה למטרות מסחריות ללא רשות.',
        ],
      },
      {
        title: 'התנהגות אסורה',
        content: [
          'אתם מסכימים שלא:',
          '• עוסקים בכל פעילות בלתי חוקית או הונאה',
          '• מנסים להנדס לאחור או לגרוד את שופלי',
          '• להפריע להפעלה או לביטחון של שופלי',
          '• לאסוף או להעביר כל מידע אישי ללא הסכמה',
        ],
      },
      {
        title: 'שינויים בתנאים אלה',
        content: [
          'שופלי עשויה לעדכן תנאים אלה בכל עת. השימוש המשכי שלכם בשופלי מרמז על קבלת התנאים המעודכנים.',
        ],
      },
      {
        title: 'חוק שחל',
        content: [
          'תנאים אלה מנוהלים על ידי חוקי ישראל. כל סכסוכים יוסדרו בבתי המשפט הישראליים.',
        ],
      },
      {
        title: 'יצירת קשר',
        content: [
          'לשאלות או דיווחים אודות תנאים אלה, צרו קשר: ohadf2015@gmail.com',
        ],
      },
    ],
  },
  fr: {
    title: 'Conditions de service',
    heading: 'Conditions de service',
    sections: [
      {
        title: 'Relation d\'affiliation',
        content: [
          'Shopli participe au programme d\'affiliation AliExpress. Lorsque vous cliquez sur un lien produit et effectuez un achat sur AliExpress, Shopli peut percevoir une commission de parrainage. Cette commission n\'affecte pas le prix que vous payez.',
        ],
      },
      {
        title: 'Contenu et listes de tiers',
        content: [
          'Toutes les informations produit, images, prix et listes sur Shopli proviennent d\'AliExpress ou d\'autres tiers. Shopli ne possède pas, ne vend pas et ne représente pas ces produits. La disponibilité, les prix et les détails des produits peuvent changer en fonction des décisions du commerçant d\'origine.',
          'Shopli n\'est pas responsable de:',
          '• La qualité ou l\'état du produit',
          '• Les prix affichés (vérifiez sur AliExpress avant l\'achat)',
          '• La disponibilité ou l\'expédition du produit',
          '• Le service client ou les retours',
        ],
      },
      {
        title: 'Pas de garantie',
        content: [
          'Shopli fournit les informations produit "telles quelles" sans aucune garantie, explicite ou implicite. Nous ne faisons aucune garantie concernant l\'exactitude, l\'exhaustivité ou l\'adéquation à un objectif particulier.',
        ],
      },
      {
        title: 'Limitation de responsabilité',
        content: [
          'Dans la limite maximale permise par la loi, Shopli ne sera pas responsable de tout dommage indirect, accidentel, spécial, consécutif ou punitif, ou de toute perte de données, de revenus ou de profit, découlant de ou lié à votre utilisation de Shopli.',
        ],
      },
      {
        title: 'Achats sur AliExpress',
        content: [
          'Toutes les transactions, paiements, expéditions, retours et litiges se font directement avec AliExpress ou le commerçant. Shopli n\'est que curateur et partenaire affilié. Pour les questions, plaintes ou remboursements, contactez AliExpress directement, pas Shopli.',
        ],
      },
      {
        title: 'Propriété intellectuelle',
        content: [
          'Le nom et la marque de Shopli sont la propriété de Shopli. Les noms de produits, les images et les marques appartiennent à leurs propriétaires respectifs.',
          'Vous ne pouvez pas utiliser Shopli ou son contenu à des fins commerciales sans permission.',
        ],
      },
      {
        title: 'Conduite interdite',
        content: [
          'Vous acceptez de ne pas:',
          '• Participer à toute activité illégale ou frauduleuse',
          '• Tenter d\'inverser l\'ingénierie ou de scraper Shopli',
          '• Interférer avec l\'exploitation ou la sécurité de Shopli',
          '• Collecter ou transmettre des données personnelles sans consentement',
        ],
      },
      {
        title: 'Modifications de ces conditions',
        content: [
          'Shopli peut mettre à jour ces conditions à tout moment. Votre utilisation continue de Shopli implique votre acceptation des conditions mises à jour.',
        ],
      },
      {
        title: 'Droit applicable',
        content: [
          'Ces conditions sont régies par les lois d\'Israël. Tout litige sera résolu par les tribunaux israéliens.',
        ],
      },
      {
        title: 'Contact',
        content: [
          'Pour des questions ou des préoccupations au sujet de ces conditions, contactez: ohadf2015@gmail.com',
        ],
      },
    ],
  },
  de: {
    title: 'Nutzungsbedingungen',
    heading: 'Nutzungsbedingungen',
    sections: [
      {
        title: 'Affiliate-Beziehung',
        content: [
          'Shopli nimmt am AliExpress-Partnerprogramm teil. Wenn Sie auf einen Produktlink klicken und einen Kauf bei AliExpress tätigen, kann Shopli eine Empfehlungsprovision erhalten. Diese Provision beeinflusst nicht den Preis, den Sie zahlen.',
        ],
      },
      {
        title: 'Inhalte und Angebote Dritter',
        content: [
          'Alle Produktinformationen, Bilder, Preise und Angebote auf Shopli stammen von AliExpress oder anderen Dritten. Shopli besitzt diese Produkte nicht, verkauft sie nicht und stellt sie nicht dar. Produktverfügbarkeit, Preisgestaltung und Details können sich je nach Entscheidungen des ursprünglichen Verkäufers ändern.',
          'Shopli ist nicht verantwortlich für:',
          '• Produktqualität oder Zustand',
          '• Angezeigte Preise (vor dem Kauf auf AliExpress überprüfen)',
          '• Verfügbarkeit oder Versand von Produkten',
          '• Kundenservice oder Rückgaben',
        ],
      },
      {
        title: 'Keine Garantie',
        content: [
          'Shopli stellt Produktinformationen "wie sie sind" ohne jegliche Gewährleistung, ausdrücklich oder stillschweigend, zur Verfügung. Wir machen keine Zusagen bezüglich Genauigkeit, Vollständigkeit oder Eignung für einen bestimmten Zweck.',
        ],
      },
      {
        title: 'Haftungsbeschränkung',
        content: [
          'Shopli haftet in keinem Fall für indirekte, zufällige, spezielle, Folge- oder Strafschadensersatz oder für Datenverlust, Umsatz- oder Gewinnverluste, die sich aus oder im Zusammenhang mit Ihrer Nutzung von Shopli ergeben.',
        ],
      },
      {
        title: 'Käufe auf AliExpress',
        content: [
          'Alle Transaktionen, Zahlungen, Versand, Rückgaben und Streitigkeiten erfolgen direkt mit AliExpress oder dem Verkäufer. Shopli ist nur ein Kurator und Affiliatepartner. Bei Fragen, Beschwerden oder Rückerstattungen wenden Sie sich bitte direkt an AliExpress, nicht an Shopli.',
        ],
      },
      {
        title: 'Geistiges Eigentum',
        content: [
          'Der Name und das Branding von Shopli sind Eigentum von Shopli. Produktnamen, Bilder und Marken gehören ihren jeweiligen Eigentümern.',
          'Sie dürfen Shopli oder seine Inhalte ohne Genehmigung nicht für kommerzielle Zwecke verwenden.',
        ],
      },
      {
        title: 'Verbotenes Verhalten',
        content: [
          'Sie verpflichten sich nicht zu:',
          '• Beteiligung an illegalen oder betrügerischen Aktivitäten',
          '• Versuch, Shopli rückzuentwickeln oder zu scrappen',
          '• Beeinträchtigung des Betriebs oder der Sicherheit von Shopli',
          '• Erhebung oder Übertragung persönlicher Daten ohne Zustimmung',
        ],
      },
      {
        title: 'Änderungen dieser Bedingungen',
        content: [
          'Shopli kann diese Bedingungen jederzeit aktualisieren. Die weitere Nutzung von Shopli bedeutet die Akzeptanz der aktualisierten Bedingungen.',
        ],
      },
      {
        title: 'Anwendbares Recht',
        content: [
          'Diese Bedingungen unterliegen den Gesetzen Israels. Alle Streitigkeiten werden von israelischen Gerichten beigelegt.',
        ],
      },
      {
        title: 'Kontakt',
        content: [
          'Bei Fragen oder Bedenken zu diesen Bedingungen kontaktieren Sie bitte: ohadf2015@gmail.com',
        ],
      },
    ],
  },
  es: {
    title: 'Términos de servicio',
    heading: 'Términos de servicio',
    sections: [
      {
        title: 'Relación de afiliación',
        content: [
          'Shopli participa en el programa de afiliados de AliExpress. Cuando haces clic en un enlace de producto y realizas una compra en AliExpress, Shopli puede ganar una comisión de referencia. Esta comisión no afecta el precio que pagas.',
        ],
      },
      {
        title: 'Contenido y listados de terceros',
        content: [
          'Toda la información del producto, imágenes, precios y listados en Shopli provienen de AliExpress u otros terceros. Shopli no posee, vende ni representa estos productos. La disponibilidad del producto, los precios y los detalles están sujetos a cambios según las decisiones del comerciante original.',
          'Shopli no es responsable de:',
          '• La calidad o condición del producto',
          '• Los precios mostrados (verifica en AliExpress antes de comprar)',
          '• La disponibilidad o envío del producto',
          '• El servicio al cliente o devoluciones',
        ],
      },
      {
        title: 'Sin garantía',
        content: [
          'Shopli proporciona información de producto "tal cual" sin garantía alguna, expresa o implícita. No hacemos garantías sobre exactitud, integridad o idoneidad para un propósito particular.',
        ],
      },
      {
        title: 'Limitación de responsabilidad',
        content: [
          'En la máxima medida permitida por la ley, Shopli no será responsable de ningún daño indirecto, incidental, especial, consecuente o punitivo, o de pérdida de datos, ingresos o ganancias, que surja de o esté relacionada con tu uso de Shopli.',
        ],
      },
      {
        title: 'Compras en AliExpress',
        content: [
          'Todas las transacciones, pagos, envíos, devoluciones y disputas ocurren directamente con AliExpress o el comerciante. Shopli es solo un curador y socio afiliado. Para preguntas, quejas o reembolsos, ponte en contacto directamente con AliExpress, no con Shopli.',
        ],
      },
      {
        title: 'Propiedad intelectual',
        content: [
          'El nombre y la marca de Shopli son propiedad de Shopli. Los nombres de productos, imágenes y marcas registradas pertenecen a sus respectivos propietarios.',
          'No puedes usar Shopli o su contenido con fines comerciales sin permiso.',
        ],
      },
      {
        title: 'Conducta prohibida',
        content: [
          'Aceptas no:',
          '• Participar en ninguna actividad ilegal o fraudulenta',
          '• Intentar realizar ingeniería inversa o extraer información de Shopli',
          '• Interferir con la operación o seguridad de Shopli',
          '• Recopilar o transmitir datos personales sin consentimiento',
        ],
      },
      {
        title: 'Cambios en estos términos',
        content: [
          'Shopli puede actualizar estos términos en cualquier momento. Tu uso continuado de Shopli implica aceptación de los términos actualizados.',
        ],
      },
      {
        title: 'Ley aplicable',
        content: [
          'Estos términos se rigen por las leyes de Israel. Cualquier disputa será resuelta por los tribunales israelíes.',
        ],
      },
      {
        title: 'Contacto',
        content: [
          'Para preguntas o inquietudes sobre estos términos, contacta: ohadf2015@gmail.com',
        ],
      },
    ],
  },
  it: {
    title: 'Termini di servizio',
    heading: 'Termini di servizio',
    sections: [
      {
        title: 'Relazione di affiliazione',
        content: [
          'Shopli partecipa al programma di affiliazione AliExpress. Quando fai clic su un link di prodotto e effettui un acquisto su AliExpress, Shopli potrebbe guadagnare una commissione di referenza. Questa commissione non influisce sul prezzo che paghi.',
        ],
      },
      {
        title: 'Contenuti e listati di terzi',
        content: [
          'Tutte le informazioni sui prodotti, le immagini, i prezzi e i listati su Shopli provengono da AliExpress o da altri terzi. Shopli non possiede, vende o rappresenta questi prodotti. La disponibilità dei prodotti, i prezzi e i dettagli sono soggetti a modifiche in base alle decisioni del commerciante originale.',
          'Shopli non è responsabile di:',
          '• La qualità o le condizioni del prodotto',
          '• I prezzi mostrati (verifica su AliExpress prima dell\'acquisto)',
          '• La disponibilità o la spedizione del prodotto',
          '• Il servizio clienti o i resi',
        ],
      },
      {
        title: 'Nessuna garanzia',
        content: [
          'Shopli fornisce informazioni sui prodotti "così come sono" senza alcuna garanzia, esplicita o implicita. Non facciamo garanzie in merito all\'accuratezza, alla completezza o all\'idoneità per uno scopo particolare.',
        ],
      },
      {
        title: 'Limitazione della responsabilità',
        content: [
          'Nella massima misura consentita dalla legge, Shopli non sarà responsabile di danni indiretti, incidentali, speciali, consequenziali o punitivi, o di qualsiasi perdita di dati, entrate o profitti, derivanti da o in relazione al tuo utilizzo di Shopli.',
        ],
      },
      {
        title: 'Acquisti su AliExpress',
        content: [
          'Tutte le transazioni, i pagamenti, le spedizioni, i resi e le controversie avvengono direttamente con AliExpress o il commerciante. Shopli è solo un curatore e partner affiliato. Per domande, reclami o rimborsi, contatta direttamente AliExpress, non Shopli.',
        ],
      },
      {
        title: 'Proprietà intellettuale',
        content: [
          'Il nome e il marchio di Shopli sono di proprietà di Shopli. I nomi dei prodotti, le immagini e i marchi appartengono ai rispettivi proprietari.',
          'Non puoi utilizzare Shopli o i suoi contenuti per scopi commerciali senza permesso.',
        ],
      },
      {
        title: 'Condotta proibita',
        content: [
          'Accetti di non:',
          '• Partecipare a nessuna attività illegale o fraudolenta',
          '• Tentare di decodificare o eseguire il web scraping di Shopli',
          '• Interferire con il funzionamento o la sicurezza di Shopli',
          '• Raccogliere o trasmettere dati personali senza consenso',
        ],
      },
      {
        title: 'Modifiche a questi termini',
        content: [
          'Shopli può aggiornare questi termini in qualsiasi momento. Il tuo uso continuato di Shopli implica l\'accettazione dei termini aggiornati.',
        ],
      },
      {
        title: 'Legge applicabile',
        content: [
          'Questi termini sono disciplinati dalle leggi di Israele. Qualsiasi controversia sarà risolta dai tribunali israeliani.',
        ],
      },
      {
        title: 'Contatti',
        content: [
          'Per domande o dubbi su questi termini, contattami: ohadf2015@gmail.com',
        ],
      },
    ],
  },
  ru: {
    title: 'Условия обслуживания',
    heading: 'Условия обслуживания',
    sections: [
      {
        title: 'Партнёрские отношения',
        content: [
          'Shopli участвует в программе партнёрства AliExpress. Когда вы нажимаете на ссылку на продукт и совершаете покупку на AliExpress, Shopli может получить комиссию. Эта комиссия не влияет на цену, которую вы платите.',
        ],
      },
      {
        title: 'Контент и предложения третьих лиц',
        content: [
          'Вся информация о продуктах, изображения, цены и предложения на Shopli поступают от AliExpress или других третьих лиц. Shopli не владеет этими продуктами, не продаёт их и не представляет их. Доступность продуктов, цены и детали могут изменяться в зависимости от решений оригинального продавца.',
          'Shopli не несёт ответственность за:',
          '• Качество или состояние продукта',
          '• Показанные цены (проверьте на AliExpress перед покупкой)',
          '• Доступность или доставку продукта',
          '• Обслуживание клиентов или возвраты',
        ],
      },
      {
        title: 'Без гарантий',
        content: [
          'Shopli предоставляет информацию о продуктах "как есть" без каких-либо гарантий, явных или подразумеваемых. Мы не даём никаких гарантий относительно точности, полноты или пригодности для какой-либо конкретной цели.',
        ],
      },
      {
        title: 'Ограничение ответственности',
        content: [
          'В максимальной степени, допускаемой законом, Shopli не несёт ответственности за любые косвенные, случайные, специальные, косвенные или штрафные убытки, или за любые потери данных, дохода или прибыли, вытекающие из использования Shopli.',
        ],
      },
      {
        title: 'Покупки на AliExpress',
        content: [
          'Все транзакции, платежи, доставка, возвраты и споры осуществляются непосредственно с AliExpress или продавцом. Shopli — это просто куратор и партнёр-партнёр. По вопросам, жалобам или возвратам обращайтесь напрямую в AliExpress, а не в Shopli.',
        ],
      },
      {
        title: 'Интеллектуальная собственность',
        content: [
          'Название и бренд Shopli являются собственностью Shopli. Названия продуктов, изображения и торговые марки принадлежат их соответствующим владельцам.',
          'Вы не можете использовать Shopli или её содержание в коммерческих целях без разрешения.',
        ],
      },
      {
        title: 'Запрещённое поведение',
        content: [
          'Вы соглашаетесь не:',
          '• Заниматься какой-либо незаконной или мошеннической деятельностью',
          '• Пытаться произвести обратную инженерию или скрейпить Shopli',
          '• Мешать работе или безопасности Shopli',
          '• Собирать или передавать личные данные без согласия',
        ],
      },
      {
        title: 'Изменения этих условий',
        content: [
          'Shopli может обновлять эти условия в любое время. Ваше дальнейшее использование Shopli подразумевает согласие с обновленными условиями.',
        ],
      },
      {
        title: 'Действующее законодательство',
        content: [
          'Эти условия регулируются законодательством Израиля. Любые споры будут разрешены израильскими судами.',
        ],
      },
      {
        title: 'Контакты',
        content: [
          'По вопросам или проблемам, связанным с этими условиями, обратитесь: ohadf2015@gmail.com',
        ],
      },
    ],
  },
};

export default function TermsPage({ region, config, rtl }: TermsPageProps) {
  const lang = (config.lang || 'en') as keyof typeof CONTENT;
  const content = CONTENT[lang] || CONTENT.en;
  const pageUrl = `${SITE_URL}/${region}/terms`;

  return (
    <>
      <SeoHead
        region={region}
        path="/terms"
        title={content.title}
        description="Read Shopli's terms of service."
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
                    style={{ color: 'var(--shopli-warm-gray)' }}
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
