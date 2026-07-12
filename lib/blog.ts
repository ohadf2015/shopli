// Blog posts — SEO/GEO content for organic traffic
// Each post has: intro, sections, FAQ, JSON-LD, target keywords

export interface BlogPost {
  slug: string;
  title: { [lang: string]: string };
  metaDesc: { [lang: string]: string };
  intro: { [lang: string]: string };
  sections: { heading: { [lang: string]: string }; body: { [lang: string]: string } }[];
  faq: { q: { [lang: string]: string }; a: { [lang: string]: string } }[];
  keywords: string[];
  relatedProducts: { name: string; keyword: string }[];
  publishDate: string; // ISO
  category: 'buying-guide' | 'comparison' | 'seasonal' | 'tips';
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'best-home-gym-under-500',
    title: {
      en: 'Best Home Gym Equipment Under $500 (2026 Guide)',
      he: 'ציוד חדר כושר ביתי מומלץ עד 500$ (מדריך 2026)',
      fr: 'Meilleur Équipement Home Gym sous 500$ (Guide 2026)',
      de: 'Bestes Home-Gym-Equipment unter 500$ (2026)',
      es: 'Mejor Equipo Gimnasio en Casa bajo $500 (2026)',
      it: 'Miglior Attrezzatura Palestra in Casa sotto 500$ (2026)',
    },
    metaDesc: {
      en: 'Build a complete home gym under $500 — adjustable dumbbells, resistance bands, bench, and more. Expert picks with AliExpress links.',
      he: 'בנו חדר כושר ביתי מלא מתחת ל-500$ — משקולות מתכווננות, רצועות התנגדות, ספסל ועוד. בחירות מומחה עם קישורי אליאקספרס.',
      fr: 'Construisez une salle de sport complète sous 500$ — haltères ajustables, bandes de résistance, banc et plus.',
      de: 'Bauen Sie ein komplettes Home-Gym unter 500$ — verstellbare Hanteln, Widerstandsbänder, Bank und mehr.',
      es: 'Construye un gimnasio completo en casa bajo $500 — pesas ajustables, bandas de resistencia, banco y más.',
      it: 'Costruisci una palestra completa in casa sotto 500$ — manubri regolabili, fasce elastiche, panca e altro.',
    },
    intro: {
      en: 'You don\'t need a commercial gym membership to get strong. With $500 and smart picks, you can build a home gym that covers every major movement pattern. This guide breaks down exactly what to buy, in priority order, with direct links to AliExpress deals.',
      he: 'לא צריך מנוי לחדר כושר מסחרי כדי להתחזק. עם 500$ ובחירות חכמות, אפשר לבנות חדר כושר ביתי שמכסה כל תבנית תנועה עיקרית.',
      fr: 'Vous n\'avez pas besoin d\'un abonnement en salle pour vous muscler. Avec 500$ et les bons choix, vous pouvez construire un home gym complet.',
      de: 'Sie brauchen kein Fitnessstudio-Abo, um stark zu werden. Mit 500$ und klugen Entscheidungen können Sie ein komplettes Home-Gym aufbauen.',
      es: 'No necesitas membresía de gimnasio para ponerte fuerte. Con $500 y buenas elecciones, puedes construir un gimnasio completo en casa.',
      it: 'Non serve un abbonamento in palestra per diventare forti. Con 500$ e le scelte giuste, puoi costruire una palestra completa in casa.',
    },
    sections: [
      { heading: { en: 'Priority 1: Adjustable Dumbbells', he: 'עדיפות 1: משקולות מתכווננות' }, body: { en: 'The single most versatile piece. One pair replaces 15+ sets of fixed dumbbells. Look for 5-50lb range with quick selector.', he: 'הכלי הכי ורסטילי. זוג אחד מחליף 15+ סטים של משקולות קבועות. חפשו טווח 2-22 ק"ג עם בורר מהיר.' } },
      { heading: { en: 'Priority 2: Resistance Bands Set', he: 'עדיפות 2: סט רצועות התנגדות' }, body: { en: 'Adds variable resistance, warm-ups, mobility work, and travel capability for ~$20. Get a set with 5 bands (10-150lb).', he: 'מוסיף התנגדות משתנה, חימום, עבודת ניידות ויכולת נסיעה ב-~$20. קחו סט עם 5 רצועות (5-70 ק"ג).' } },
      { heading: { en: 'Priority 3: Adjustable Bench', he: 'עדיפות 3: ספסל מתכוונן' }, body: { en: 'Enables incline/decline press, rows, split squats. Flat-only benches limit you. Get one with 6+ angles and 600lb capacity.', he: 'מאפשר לחיצה בשיפוע/ירידה, חתירות, סקוואט מפוצל. ספסל שטוח בלבד מגביל אתכם.' } },
      { heading: { en: 'Priority 4: Pull-Up Bar / Power Tower', he: 'עדיפות 4: מתח / מגדל כוח' }, body: { en: 'Vertical pulling is non-negotiable for back development. Doorframe bar ($15) works; power tower ($80) adds dips, leg raises.', he: 'משיכה אנכית חיונית לפיתוח גב. מתח לדלת ($15) עובד; מגדל כוח ($80) מוסיף מקבילים, הרמות רגליים.' } },
      { heading: { en: 'Sample Weekly Split', he: 'תוכנית שבועית לדוגמה' }, body: { en: 'Day 1: Push (bench, overhead press, dips) / Day 2: Pull (pull-ups, rows, curls) / Day 3: Legs (goblet squats, RDLs, lunges) / Day 4: Rest / Repeat.', he: 'יום 1: דחיפה (לחיצת חזה, לחיצת כתפיים, מקבילים) / יום 2: משיכה (מתח, חתירות, כפיפות) / יום 3: רגליים (סקוואט גביע, RDL, לאנג\'ים) / יום 4: מנוחה / חזור.' } },
    ],
    faq: [
      { q: { en: 'Can I build muscle with just dumbbells and bands?', he: 'האם אפשר לבנות שריר רק עם משקולות ורצועות?' }, a: { en: 'Absolutely. Progressive overload (adding weight/reps over time) drives hypertrophy. Dumbbells + bands cover every movement pattern.', he: 'בהחלט. עומס מתקדם (הוספת משקל/חזרות לאורך זמן) מניע היפרטרופיה. משקולות + רצועות מכסות כל תבנית תנועה.' } },
      { q: { en: 'What if I only have $300?', he: 'מה אם יש לי רק 300$?' }, a: { en: 'Skip the bench — do floor press and bodyweight dips. Get adjustable dumbbells + bands + doorframe pull-up bar. That\'s ~$280 and covers 90% of movements.', he: 'דלגו על הספסל — עשו לחיצת רצפה ומקבילים במשקל גוף. קחו משקולות מתכווננות + רצועות + מתח לדלת. זה ~280$ ומכסה 90% מהתנועות.' } },
    ],
    keywords: ['home gym under 500', 'best home gym equipment budget', 'adjustable dumbbells home gym', 'build home gym cheap'],
    relatedProducts: [
      { name: 'Adjustable Dumbbells', keyword: 'adjustable dumbbells set' },
      { name: 'Resistance Bands', keyword: 'resistance bands set' },
      { name: 'Adjustable Bench', keyword: 'adjustable weight bench' },
      { name: 'Pull-Up Bar', keyword: 'doorway pull up bar' },
    ],
    publishDate: '2026-07-10',
    category: 'buying-guide',
  },
  {
    slug: 'coffee-gear-guide-beginners',
    title: {
      en: 'Coffee Gear for Beginners: What to Buy First (2026)',
      he: 'ציוד קפה למתחילים: מה לקנות קודם (2026)',
      fr: 'Équipement Café pour Débutants: Quoi Acheter en Premier (2026)',
      de: 'Kaffee-Ausrüstung für Einsteiger: Was zuerst kaufen (2026)',
      es: 'Equipo de Café para Principiantes: Qué Comprar Primero (2026)',
      it: 'Attrezzatura Caffè per Principianti: Cosa Comprare Prima (2026)',
    },
    metaDesc: {
      en: 'Starting your coffee journey? Skip the expensive espresso machine. French press, grinder, scale, and kettle — under $100 for cafe-quality coffee.',
      he: 'מתחילים את מסע הקפה? דלגו על מכונת אספרסו יקרה. פרנץ׳ פרס, מטחנה, משקל, וקומקום — מתחת ל-100$ לקפה ברמת בית קפה.',
      fr: 'Débutez votre aventure café? Évitez la machine espresso chère. French press, moulin, balance, bouilloire — sous 100$ pour du café de qualité.',
      de: 'Starten Sie Ihre Kaffeereise? Überspringen Sie die teure Espressomaschine. French Press, Mühle, Waage, Wasserkocher — unter 100$ für Café-Qualität.',
      es: '¿Empiezas tu viaje del café? Salta la máquina de espresso cara. Prensa francesa, molinillo, balanza, hervidor — bajo $100 para café de calidad.',
      it: 'Inizi il tuo viaggio nel caffè? Salta la macchina espresso costosa. French press, macinino, bilancia, bollitore — sotto 100$ per caffè da bar.',
    },
    intro: {
      en: 'Good coffee at home doesn\'t require a $500 espresso machine. The biggest flavor gains come from fresh beans, proper grind, and consistent ratio — not pressure. This guide shows the minimum gear for maximum flavor.',
      he: 'קפה טוב בבית לא דורש מכונת אספרסו ב-500$. הרווחי הטעם הגדולים מגיעים מפולים טריים, טחינה נכונה, ויחס עקבי — לא מלחץ.',
      fr: 'Le bon café à la maison ne nécessite pas une machine espresso à 500$. Les plus gros gains de saveur viennent de grains frais, mouture correcte et ratio constant.',
      de: 'Guter Kaffee zu Hause braucht keine 500$-Espressomaschine. Die größten Geschmacksgewinne kommen von frischen Bohnen, richtigem Mahlgrad und konstantem Verhältnis.',
      es: 'El buen café en casa no requiere una máquina de espresso de $500. Las mayores ganancias de sabor vienen de granos frescos, molienda correcta y proporción constante.',
      it: 'Il buon caffè a casa non richiede una macchina espresso da 500$. I maggiori guadagni di sapore vengono da chicchi freschi, macinatura corretta e rapporto costante.',
    },
    sections: [
      { heading: { en: '1. Burr Grinder (Non-Negotiable)', he: '1. מטחנת דסקיות (חובה)' }, body: { en: 'Blade grinders chop unevenly = bitter + sour in same cup. Entry hand grinder ($25) beats electric blade. Electric burr starts at $80.', he: 'מטחנות להב קוצצות לא אחיד = מר + חמוץ באותה כוס. מטחנת יד בסיסית ($25) מנצחת חשמלית להב. חשמלית דסקיות מ-$80.' } },
      { heading: { en: '2. French Press or AeroPress', he: '2. פרנץ׳ פרס או אירופרס' }, body: { en: 'Both under $30. French press = richer, more body. AeroPress = cleaner, faster, travel-friendly. Pick one.', he: 'שניהם מתחת ל-$30. פרנץ׳ פרס = עשיר יותר, יותר גוף. אירופרס = נקי יותר, מהיר, ידידותי לנסיעות. בחרו אחד.' } },
      { heading: { en: '3. Digital Scale (0.1g)', he: '3. משקל דיגיטלי (0.1ג)' }, body: { en: 'Eyeballing ratios = inconsistent coffee. $15 scale gives repeatable 1:16 ratio every time. Essential.', he: 'ניחוש יחסים = קפה לא עקבי. משקל $15 נותן יחס 1:16 חוזר בכל פעם. חובה.' } },
      { heading: { en: '4. Gooseneck Kettle', he: '4. קומקום צוואר אווז' }, body: { en: 'Controls pour rate for even extraction. Stovetop ($20) or electric with temp control ($60). Variable temp matters for light roasts.', he: 'שולט בקצב מזיגה למיצוי אחיד. כיריים ($20) או חשמלי עם בקרת טמפרטורה ($60). טמפרטורה משתנה חשובה לקלילות קלות.' } },
    ],
    faq: [
      { q: { en: 'Do I need a scale for French press?', he: 'האם צריך משקל לפרנץ׳ פרס?' }, a: { en: 'Yes — 1:15 to 1:17 ratio is the sweet spot. Without a scale you\'re guessing. $15 scale pays for itself in saved beans.', he: 'כן — יחס 1:15 עד 1:17 זה הנקודה המתוקה. בלי משקל אתם מנחשים. משקל $15 מחזיר את עצמו בפולים שנחסכו.' } },
    ],
    keywords: ['coffee gear beginners', 'best coffee equipment starter', 'french press vs aeropress', 'burr grinder worth it'],
    relatedProducts: [
      { name: 'Burr Grinder', keyword: 'burr coffee grinder' },
      { name: 'French Press', keyword: 'french press coffee maker' },
      { name: 'Digital Scale', keyword: 'coffee scale 0.1g' },
      { name: 'Gooseneck Kettle', keyword: 'gooseneck kettle temperature control' },
    ],
    publishDate: '2026-07-08',
    category: 'buying-guide',
  },
  {
    slug: 'standing-desk-setup-ergonomics',
    title: {
      en: 'Standing Desk Setup: Ergonomics, Accessories & Mistakes to Avoid',
      he: 'הגדרת שולחן עמידה: ארגונומיה, אביזרים וטעויות להימנע',
      fr: 'Configuration Bureau Debout: Ergonomie, Accessoires et Erreurs à Éviter',
      de: 'Stehschreibtisch-Setup: Ergonomie, Zubehör & Fehler vermeiden',
      es: 'Configuración Escritorio de Pie: Ergonomía, Accesorios y Errores',
      it: 'Configurazione Scrivania in Piedi: Ergonomia, Accessori ed Errori',
    },
    metaDesc: {
      en: 'Standing desk ergonomics guide — monitor height, keyboard tray, anti-fatigue mat, cable management. Avoid the mistakes that cause back/neck pain.',
      he: 'מדריך ארגונומיה לשולחן עמידה — גובה מסך, מגש מקלדת, מחצלת נגד עייפות, ניהול כבלים. הימנעו מהטעויות שגורמות לכאבי גב/צוואר.',
      fr: 'Guide ergonomie bureau debout — hauteur écran, plateau clavier, tapis anti-fatigue, gestion câbles. Évitez les erreurs causant douleurs dos/cou.',
      de: 'Ergonomie-Leitfaden Stehschreibtisch — Monitorhöhe, Tastaturablage, Anti-Ermüdungsmatte, Kabelmanagement. Vermeiden Sie Fehler die Rücken/Nackenschmerzen verursachen.',
      es: 'Guía ergonomía escritorio pie — altura monitor, bandeja teclado, alfombra antifatiga, gestión cables. Evite errores que causan dolor espalda/cuello.',
      it: 'Guida ergonomia scrivania piedi — altezza monitor, vassoio tastiera, tappeto antiaffaticamento, gestione cavi. Evita errori che causano mal di schiena/collo.',
    },
    intro: {
      en: 'A standing desk alone won\'t fix your posture. Without proper ergonomics, standing can cause *more* problems than sitting. This guide covers the complete setup: monitor position, keyboard/mouse height, floor support, and the accessories that make standing sustainable.',
      he: 'שולחן עמידה לבד לא יתקן את היציבה. בלי ארגונומיה נכונה, עמידה יכולה לגרום *יותר* בעיות מישיבה. המדריך מכסה את ההגדרה המלאה.',
      fr: 'Un bureau debout seul ne corrige pas la posture. Sans ergonomie, debout peut causer *plus* de problèmes qu\'assis.',
      de: 'Ein Stehschreibtisch allein repariert die Haltung nicht. Ohne Ergonomie kann Stehen *mehr* Probleme verursachen als Sitzen.',
      es: 'Un escritorio de pie solo no arregla la postura. Sin ergonomía, estar de pie puede causar *más* problemas que sentado.',
      it: 'Una scrivania in piedi da sola non corregge la postura. Senza ergonomia, stare in piedi può causare *più* problemi che sedersi.',
    },
    sections: [
      { heading: { en: 'Monitor: Top at Eye Level', he: 'מסך: קצה עליון בגובה העיניים' }, body: { en: 'Center of screen 15-20° below horizontal gaze. Use monitor arm ($30-80) or riser. Laptop users: external keyboard + laptop stand mandatory.', he: 'מרכז המסך 15-20° מתחת למבט אופקי. השתמשו בזרוע מסך ($30-80) או מעמד. משתמשי לפטופ: מקלדת חיצונית + מעמד לפטופ חובה.' } },
      { heading: { en: 'Keyboard/Mouse: Elbows at 90-100°', he: 'מקלדת/עכבר: מרפקים ב-90-100°' }, body: { en: 'Forearms parallel to floor. Wrists neutral. Keyboard tray or adjustable desk surface. Negative tilt (front lower) reduces wrist extension.', he: 'אמות מקבילות לרצפה. פרקי יד נייטרליים. מגש מקלדת או משטח שולחן מתכוונן. הטיה שלילית (קדימה נמוך) מפחיתה הארכת פרק יד.' } },
      { heading: { en: 'Feet: Anti-Fatigue Mat + Supportive Shoes', he: 'רגליים: מחצלת נגד עייפות + נעליים תומכות' }, body: { en: 'Hard floors destroy feet/back. 3/4" mat ($30-60) + running shoes or clogs. No barefoot, no dress shoes. Shift weight every 10-15 min.', he: 'רצפות קשות הורסות רגליים/גב. מחצלת 2ס"מ ($30-60) + נעלי ריצה או קרוקס. לא יחפים, לא נעלי ערב. העבירו משקל כל 10-15 דק\'.' } },
      { heading: { en: 'Cable Management: Vertical Channels', he: 'ניהול כבלים: תעלות אנכיות' }, body: { en: 'Cables tugging monitors = constant micro-adjustments = neck strain. Use cable chain ($15) or zip-tied sleeve along desk leg. Power strip mounted under desk.', he: 'כבלים שמושכים מסכים = התאמות מיקרו מתמידות = מתח צוואר. השתמשו בשרשרת כבלים ($15) או שרוול עם אזיקונים לאורך רגל השולחן. מפצל חשמל מותקן מתחת לשולחן.' } },
    ],
    faq: [
      { q: { en: 'How long should I stand at first?', he: 'כמה זמן לעמוד בהתחלה?' }, a: { en: '15 min/hour. Add 5 min/week until 30-45 min/hour. Goal: movement, not standing still. Sit when fatigued.', he: '15 דק\'/שעה. הוסיפו 5 דק\'/שבוע עד 30-45 דק\'/שעה. מטרה: תנועה, לא עמידה סטטית. שבו כשעייפים.' } },
      { q: { en: 'Do I need a monitor arm?', he: 'האם צריך זרוע מסך?' }, a: { en: 'Highly recommended. Fixed stands rarely hit the sweet spot. Arm lets you pull monitor closer (reduces eye strain) and adjust for sitting/standing height difference.', he: 'מומלץ מאוד. מעמדים קבועים נדיר פוגעים בנקודה המתוקה. זרוע מאפשרת לקרב מסך (מפחית עומס עיניים) ולהתאים לגובה ישיבה/עמידה.' } },
    ],
    keywords: ['standing desk ergonomics', 'standing desk setup guide', 'monitor arm standing desk', 'anti fatigue mat standing desk'],
    relatedProducts: [
      { name: 'Monitor Arm', keyword: 'monitor arm gas spring' },
      { name: 'Anti-Fatigue Mat', keyword: 'anti fatigue mat standing desk' },
      { name: 'Keyboard Tray', keyword: 'under desk keyboard tray' },
      { name: 'Cable Management', keyword: 'cable management tray under desk' },
    ],
    publishDate: '2026-07-05',
    category: 'tips',
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(p => p.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map(p => p.slug);
}

export function getBlogPostsByCategory(category: BlogPost['category']): BlogPost[] {
  return blogPosts.filter(p => p.category === category);
}
