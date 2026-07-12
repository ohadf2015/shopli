// Comparison articles — high-converting affiliate content
// Each comparison has: intro, product1, product2, verdict, faq, jsonld

export interface ComparisonArticle {
  slug: string;
  title: { [lang: string]: string };
  metaDesc: { [lang: string]: string };
  intro: { [lang: string]: string };
  product1: { name: string; keyword: string; pros: string[]; cons: string[] };
  product2: { name: string; keyword: string; pros: string[]; cons: string[] };
  verdict: { [lang: string]: string };
  faq: { q: { [lang: string]: string }; a: { [lang: string]: string } }[];
  keywords: string[];
}

export const comparisons: ComparisonArticle[] = [
  {
    slug: 'french-press-vs-drip',
    title: {
      en: 'French Press vs Drip Coffee Maker: Which Brew Method Wins?',
      he: 'פרנץ׳ פרס מול מכונת קפה פילטר: איזו שיטת חליטה עדיפה?',
      fr: 'French Press vs Machine à Café Filtre: Quelle Méthode Choisir?',
      de: 'French Press vs Filterkaffeemaschine: Welche Brühmethode ist besser?',
      es: '¿Prensa Francesa vs Cafetera de Goteo?',
      it: 'French Press vs Macchina da Caffè a Goccia',
    },
    metaDesc: {
      en: 'French Press vs Drip Coffee Maker — compare taste, price, ease of use. Find your perfect brew method with our detailed guide.',
      he: 'פרנץ׳ פרס מול מכונת קפה פילטר — השוואת טעם, מחיר ונוחות. המדריך לבחירת שיטת החליטה המושלמת.',
      fr: 'French Press ou cafetière filtre? Comparez le goût, le prix, la facilité d\'utilisation.',
      de: 'French Press oder Filterkaffeemaschine? Vergleichen Sie Geschmack, Preis und Benutzerfreundlichkeit.',
      es: '¿Prensa francesa o cafetera de goteo? Compare sabor, precio y facilidad de uso.',
      it: 'French Press o Macchina da Caffè a Goccia? Confronta gusto, prezzo e facilità d\'uso.',
    },
    intro: {
      en: 'Two brewing methods dominate morning routines worldwide: the French Press and the Drip Coffee Maker. Both produce excellent coffee, but they differ in taste, convenience, price, and ritual. In this guide, we break down every aspect so you can choose the one that fits your lifestyle.',
      he: 'שתי שיטות חליטה שולטות בשגרת הבוקר ברחבי העולם: פרנץ׳ פרס ומכונת קפה פילטר. שתיהן מייצרות קפה מצוין, אך הן שונות בטעם, בנוחות, במחיר ובטקס. במדריך זה נפרק כל היבט כדי שתוכלו לבחור את השיטה המתאימה לכם.',
      fr: 'Deux méthodes dominent les routines matinales: la French Press et la machine à café filtre. Les deux produisent un excellent café mais diffèrent par le goût, la commodité, le prix et le rituel.',
      de: 'Zwei Brühmethoden dominieren die Morgenroutine: die French Press und die Filterkaffeemaschine. Beide produzieren hervorragenden Kaffee, unterscheiden sich aber in Geschmack, Bequemlichkeit, Preis und Ritual.',
      es: 'Dos métodos dominan las rutinas matutinas: la prensa francesa y la cafetera de goteo. Ambos producen café excelente, pero difieren en sabor, conveniencia, precio y ritual.',
      it: 'Due metodi dominano le routine mattutine: la French Press e la Macchina da Caffè a Goccia. Entrambi producono un caffè eccellente, ma differiscono per gusto, praticità, prezzo e rituale.',
    },
    product1: { name: 'French Press', keyword: 'french press coffee maker', pros: ['Richer, full-bodied flavor', 'Simple design, no filters needed', 'Easy to clean', 'Affordable price point', 'Portable for travel'], cons: ['Sediment in cup', 'Coffee cools faster', 'Manual process', 'Smaller batch sizes'] },
    product2: { name: 'Drip Coffee Maker', keyword: 'automatic drip coffee maker', pros: ['Set-and-forget convenience', 'Programmable timer', 'Larger batches', 'Consistent results', 'Keeps coffee warm'], cons: ['Takes counter space', 'Paper filters cost', 'Less flavor extraction', 'Harder to clean thoroughly'] },
    verdict: {
      en: 'Choose a French Press if you value rich, full-bodied flavor and don\'t mind a simple manual ritual. Choose a Drip Coffee Maker if convenience and batch size matter more — especially for busy mornings or multiple coffee drinkers. For most households, having both covers every scenario.',
      he: 'בחרו פרנץ׳ פרס אם אתם מעריכים טעם עשיר ומלא ולא אכפת לכם מטקס ידני פשוט. בחרו מכונת פילטר אם נוחות וכמות גדולה חשובים יותר — במיוחד לבקרים עמוסים או למספר שותי קפה. לרוב המשקי בית, שני הכלים מכסים כל תרחיש.',
      fr: 'Choisissez la French Press si vous appréciez une saveur riche et corsée. Choisissez une machine à café filtre si la commodité et la quantité comptent le plus.',
      de: 'Wählen Sie die French Press, wenn Sie reichen, vollmundigen Geschmack schätzen. Wählen Sie die Filterkaffeemaschine, wenn Bequemlichkeit und große Mengen wichtiger sind.',
      es: 'Elija la prensa francesa si valora un sabor rico y completo. Elija la cafetera de goteo si la conveniencia y la cantidad importan más.',
      it: 'Scegliete la French Press se apprezzate un sapore ricco e corposo. Scegliete la Macchina da Caffè a Goccia se la praticità e la quantità sono più importanti.',
    },
    faq: [
      { q: { en: 'Which is stronger: French Press or Drip Coffee?', he: 'מה חזק יותר: פרנץ׳ פרס או קפה פילטר?', fr: 'Quel café est plus fort?', de: 'Was ist stärker?', es: '¿Cuál es más fuerte?', it: 'Qual è più forte?' }, a: { en: 'French Press coffee is typically stronger because the metal mesh allows more oils and fine particles into the cup, creating a fuller body and more intense flavor.', he: 'קפה פרנץ׳ פרס חזק יותר כי רשת המתכת מאפשרת יותר שמנים וחלקיקים דקים לכוס.', fr: 'Le café French Press est généralement plus fort car la grille métallique laisse passer plus d\'huiles.', de: 'French Press Kaffee ist typischerweise stärker, da das Metallsieb mehr Öle und Feinpartikel durchlässt.', es: 'El café de prensa francesa suele ser más fuerte.', it: 'Il caffè della French Press è tipicamente più forte.' } },
      { q: { en: 'Which is cheaper: French Press or Drip Machine?', he: 'מה זול יותר: פרנץ׳ פרס או מכונת פילטר?', fr: 'Quel est le moins cher?', de: 'Was ist günstiger?', es: '¿Cuál es más barato?', it: 'Qual è più economico?' }, a: { en: 'A French Press is significantly cheaper — basic models cost $10-25 and require no paper filters. Good drip machines start at $30-50 and need ongoing filter purchases.', he: 'פרנץ׳ פרס זול משמעותית — דגמים בסיסיים עולים 10-25 דולר ולא דורשים פילטרים.', fr: 'Une French Press est nettement moins chère.', de: 'Eine French Press ist deutlich günstiger.', es: 'Una prensa francesa es significativamente más barata.', it: 'Una French Press è significativamente più economica.' } },
    ],
    keywords: ['french press vs drip', 'coffee maker comparison', 'best brew method', 'french press or drip coffee'],
  },
  {
    slug: 'resistance-bands-vs-dumbbells',
    title: {
      en: 'Resistance Bands vs Dumbbells: Which Home Gym Tool Wins?',
      he: 'רצועות התנגדות מול משקולות: איזה ציוד לחדר כושר ביתי עדיף?',
      fr: 'Bandes de Résistance vs Haltères: Quel Équipement pour la Maison?',
      de: 'Widerstandsbänder vs Hanteln: Welches Heimtrainingsgerät gewinnt?',
      es: 'Bandas de Resistencia vs Pesas: ¿Qué Equipo para Casa?',
      it: 'Fasce Elastiche vs Manubri: Quale Attrezzatura per Casa?',
    },
    metaDesc: {
      en: 'Resistance bands vs dumbbells — compare portability, price, versatility, and results. Find the best home gym equipment for your fitness goals.',
      he: 'רצועות התנגדות מול משקולות — השוואת ניידות, מחיר, גיוון ותוצאות. מצאו את הציוד המתאים למטרות הכושר שלכם.',
      fr: 'Bandes de résistance vs haltères — comparez portabilité, prix, polyvalence et résultats.',
      de: 'Widerstandsbänder vs Hanteln — vergleichen Sie Tragbarkeit, Preis, Vielseitigkeit und Ergebnisse.',
      es: 'Bandas de resistencia vs pesas — compare portabilidad, precio, versatilidad y resultados.',
      it: 'Fasce elastiche vs manubri — confronta portabilità, prezzo, versatilità e risultati.',
    },
    intro: {
      en: 'Building a home gym starts with one big choice: resistance bands or dumbbells? Both build muscle and strength, but they serve different needs. This guide compares cost, space, versatility, and results so you can invest in the right equipment for your goals.',
      he: 'בניית חדר כושר ביתי מתחילה בהחלטה אחת גדולה: רצועות התנגדות או משקולות? שניהם בונים שריר וכוח, אבל משרתים צרכים שונים.',
      fr: 'Construire une salle de sport à domicile commence par un grand choix: bandes de résistance ou haltères?',
      de: 'Der Aufbau eines Heim-Fitnessstudios beginnt mit einer großen Entscheidung: Widerstandsbänder oder Hanteln?',
      es: 'Construir un gimnasio en casa comienza con una gran decisión: ¿bandas de resistencia o pesas?',
      it: 'Costruire una palestra in casa inizia con una grande scelta: fasce elastiche o manubri?',
    },
    product1: { name: 'Resistance Bands', keyword: 'resistance bands set', pros: ['Ultra portable', 'Takes zero space', 'Very affordable ($10-30)', 'Variable resistance', 'Joint-friendly'], cons: ['Harder to track progress', 'Less effective for max strength', 'Snap risk with cheap bands', 'No progressive loading feel'] },
    product2: { name: 'Dumbbells', keyword: 'adjustable dumbbells set', pros: ['Precise weight increments', 'Best for strength building', 'Durable, last forever', 'Natural feel', 'Widest exercise variety'], cons: ['Expensive ($100-500+)', 'Takes significant space', 'Heavy to move', 'Must buy heavier over time'] },
    verdict: {
      en: 'Start with resistance bands if you\'re on a budget, travel often, or have limited space. Invest in adjustable dumbbells if you\'re serious about strength training and have dedicated space. The ideal setup: bands for travel/warmup + dumbbells for main lifts.',
      he: 'התחילו עם רצועות התנגדות אם התקציב מוגבל, אתם נוסעים הרבה או שיש לכם מקום מצומצם. השקיעו במשקולות מתכווננות אם אתם רציניים לגבי אימוני כוח.',
      fr: 'Commencez par les bandes de résistance si vous avez un budget limité. Investissez dans des haltères ajustables pour la musculation sérieuse.',
      de: 'Beginnen Sie mit Widerstandsbändern bei begrenztem Budget. Investieren Sie in verstellbare Hanteln für ernsthaftes Krafttraining.',
      es: 'Comience con bandas de resistencia si tiene presupuesto limitado. Invierta en pesas ajustables para entrenamiento de fuerza serio.',
      it: 'Iniziate con le fasce elastiche se avete un budget limitato. Investite in manubri regolabili per l\'allenamento di forza serio.',
    },
    faq: [
      { q: { en: 'Can resistance bands build muscle?', he: 'האם רצועות התנגדות בונות שריר?', fr: 'Les bandes de résistance construisent-elles du muscle?', de: 'Bauen Widerstandsbänder Muskeln auf?', es: '¿Las bandas de resistencia desarrollan músculo?', it: 'Le fasce elastiche costruiscono muscoli?' }, a: { en: 'Yes, especially for beginners and for muscle endurance. For advanced strength gains, you\'ll eventually need heavier resistance — either thicker bands or dumbbells.', he: 'כן, במיוחד למתחילים ולסבולת שריר. לרווחי כוח מתקדמים תצטרכו eventually התנגדות כבדה יותר.', fr: 'Oui, surtout pour les débutants et l\'endurance musculaire.', de: 'Ja, besonders für Anfänger und für Muskelausdauer.', es: 'Sí, especialmente para principiantes y resistencia muscular.', it: 'Sì, specialmente per i principianti e per la resistenza muscolare.' } },
    ],
    keywords: ['resistance bands vs dumbbells', 'home gym equipment', 'bands or weights', 'home workout gear'],
  },
  {
    slug: 'ring-light-vs-softbox',
    title: {
      en: 'Ring Light vs Softbox: Best Lighting for Content Creators',
      he: 'רינג לייט מול סופטבוקס: איזו תאורה הכי טובה ליוצרי תוכן?',
      fr: 'Ring Light vs Softbox: Meilleur Éclairage pour Créateurs',
      de: 'Ringlicht vs Softbox: Beste Beleuchtung für Content Creator',
      es: 'Ring Light vs Softbox: Mejor Iluminación para Creadores',
      it: 'Ring Light vs Softbox: Migliore Illuminazione per Creator',
    },
    metaDesc: {
      en: 'Ring light vs softbox — compare light quality, price, and best use cases. Find the perfect lighting for your YouTube, TikTok, or streaming setup.',
      he: 'רינג לייט מול סופטבוקס — השוואת איכות תאורה, מחיר ושימושים. מצאו את התאורה המושלמת ליוטיוב, טיקטוק או סטרימינג.',
      fr: 'Ring light vs softbox — comparez qualité lumineuse, prix et usages.',
      de: 'Ringlicht vs Softbox — vergleichen Sie Lichtqualität, Preis und Anwendungen.',
      es: 'Ring light vs softbox — compare calidad de luz, precio y usos.',
      it: 'Ring light vs softbox — confronta qualità della luce, prezzo e usi.',
    },
    intro: {
      en: 'Good lighting is the single biggest upgrade for video quality. Ring lights and softboxes are the two most popular options, but they serve different purposes. This guide breaks down the differences so you can choose the right tool for your content.',
      he: 'תאורה טובה היא השדרוג החשוב ביותר לאיכות וידאו. רינג לייט וסופטבוקס הן שתי האפשרויות הפופולריות ביותר, אבל הן משרתות מטרות שונות.',
      fr: 'Un bon éclairage est le plus grand upgrade pour la qualité vidéo. Ring light et softbox sont les deux options les plus populaires.',
      de: 'Gute Beleuchtung ist das größte Upgrade für Videoqualität. Ringlicht und Softbox sind die beiden beliebtesten Optionen.',
      es: 'Una buena iluminación es la mejora más importante para la calidad de video.',
      it: 'Una buona illuminazione è il più grande miglioramento per la qualità video.',
    },
    product1: { name: 'Ring Light', keyword: 'ring light with tripod', pros: ['Creates catchlight in eyes', 'Even, shadow-free face lighting', 'Compact and portable', 'Dimmable color temperature', 'Great for selfies and close-ups'], cons: ['Harsh on skin texture', 'Limited to face/head shots', 'Circular catchlight pattern', 'Less control over direction'] },
    product2: { name: 'Softbox', keyword: 'softbox lighting kit', pros: ['Professional soft light', 'Large, wrap-around quality', 'Full body lighting', 'Multiple light modifiers', 'Best for product shots'], cons: ['Bulky and heavy', "Takes time to set up", 'More expensive', 'Needs space to position'] },
    verdict: {
      en: 'Start with a ring light if you\'re a solo creator filming face-to-camera content (TikTok, YouTube shorts, streaming). Upgrade to a softbox kit if you shoot products, full-body content, or want professional-grade lighting. Many creators use both: ring light as key + softbox as fill.',
      he: 'התחילו עם רינג לייט אם אתם יוצרים סולו לצילומי פנים (טיקטוק, יוטיוב שורטס, סטרימינג). שדרגו לערכת סופטבוקס אם אתם מצלמים מוצרים, תוכן בגובה מלא, או רוצים תאורה מקצועית.',
      fr: 'Commencez avec un ring light pour le contenu en solo. Passez à un kit softbox pour les produits ou l\'éclairage professionnel.',
      de: 'Beginnen Sie mit einem Ringlicht für Solo-Content. Steigen Sie auf ein Softbox-Set für Produkte oder professionelles Licht um.',
      es: 'Comience con un ring light para contenido en solitario. Actualice a un kit softbox para productos o iluminación profesional.',
      it: 'Iniziate con un ring light per contenuti in solitaria. Passate a un kit softbox per prodotti o illuminazione professionale.',
    },
    faq: [
      { q: { en: 'Which is better for YouTube?', he: 'מה עדיף ליוטיוב?', fr: 'Quel est le meilleur pour YouTube?', de: 'Was ist besser für YouTube?', es: '¿Qué es mejor para YouTube?', it: 'Cosa è meglio per YouTube?' }, a: { en: 'For talking-head content, a ring light is better. For product reviews or full-body shots, a softbox is better. Many YouTubers use a ring light as their main light with a small softbox as fill.', he: 'לתוכן של דיבור מול המצלמה, רינג לייט עדיף. לסקירות מוצרים או צילומים בגובה מלא, סופטבוקס עדיף.', fr: 'Pour le contenu face caméra, un ring light est mieux. Pour les produits, un softbox est mieux.', de: 'Für Talking-Head-Inhalte ist ein Ringlicht besser. Für Produktbewertungen ist eine Softbox besser.', es: 'Para contenido de cara a cámara, un ring light es mejor.', it: 'Per i contenuti talking-head, un ring light è meglio.' } },
    ],
    keywords: ['ring light vs softbox', 'content creator lighting', 'best lighting for videos', 'youtube lighting setup'],
  },
];

export function getComparison(slug: string): ComparisonArticle | undefined {
  return comparisons.find(c => c.slug === slug);
}

export function getAllComparisonSlugs(): string[] {
  return comparisons.map(c => c.slug);
}
