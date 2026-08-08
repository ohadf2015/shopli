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
  /**
   * Restrict a post to specific regions. Omit for posts that apply everywhere.
   * Country-specific pieces (import tax rules, say) are wrong — not merely
   * untranslated — in the other eight locales, and publishing them there would
   * be eight thin pages per post.
   */
  regions?: string[];
}

/** Posts publishable in `region`, newest first. */
export function getBlogPostsForRegion(region: string): BlogPost[] {
  return blogPosts
    .filter((p) => (p.category as string) !== 'draft')
    .filter((p) => !p.regions || p.regions.includes(region))
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
}

/** True when `slug` exists and is publishable in `region`. */
export function isBlogPostInRegion(slug: string, region: string): boolean {
  const post = getBlogPost(slug);
  return !!post && (!post.regions || post.regions.includes(region));
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
      { heading: { en: 'Priority 1: Adjustable Dumbbells', he: 'עדיפות 1: משקולות מתכווננות' }, body: { en: 'The single most versatile piece. One pair replaces 15+ sets of fixed dumbbells. Look for 5-50lb range with quick selector.', he: 'הכלי הכי גמיש. זוג אחד מחליף 15+ סטים של משקולות קבועות. חפשו טווח 2-22 ק"ג עם בורר מהיר.' } },
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
      he: 'קפה טוב בבית לא דורש מכונת אספרסו ב-500$. השיפורים המשמעותיים בטעם מגיעים מפולים טריים, טחינה נכונה, ויחס עקבי — לא מלחץ.',
      fr: 'Le bon café à la maison ne nécessite pas une machine espresso à 500$. Les plus gros gains de saveur viennent de grains frais, mouture correcte et ratio constant.',
      de: 'Guter Kaffee zu Hause braucht keine 500$-Espressomaschine. Die größten Geschmacksgewinne kommen von frischen Bohnen, richtigem Mahlgrad und konstantem Verhältnis.',
      es: 'El buen café en casa no requiere una máquina de espresso de $500. Las mayores ganancias de sabor vienen de granos frescos, molienda correcta y proporción constante.',
      it: 'Il buon caffè a casa non richiede una macchina espresso da 500$. I maggiori guadagni di sapore vengono da chicchi freschi, macinatura corretta e rapporto costante.',
    },
    sections: [
      { heading: { en: '1. Burr Grinder (Non-Negotiable)', he: '1. מטחנת קפה איכותית (חובה)' }, body: { en: 'Blade grinders chop unevenly = bitter + sour in same cup. Entry hand grinder ($25) beats electric blade. Electric burr starts at $80.', he: 'מטחנות להב קוצצות לא אחיד = מר + חמוץ באותה כוס. מטחנת יד בסיסית ($25) מנצחת חשמלית להב. מטחנה חשמלית איכותית מ-$80.' } },
      { heading: { en: '2. French Press or AeroPress', he: '2. פרנץ׳ פרס או אירופרס' }, body: { en: 'Both under $30. French press = richer, more body. AeroPress = cleaner, faster, travel-friendly. Pick one.', he: 'שניהם מתחת ל-$30. פרנץ׳ פרס = עשיר יותר, יותר גוף. אירופרס = נקי יותר, מהיר, ידידותי לנסיעות. בחרו אחד.' } },
      { heading: { en: '3. Digital Scale (0.1g)', he: '3. משקל דיגיטלי (0.1ג)' }, body: { en: 'Eyeballing ratios = inconsistent coffee. $15 scale gives repeatable 1:16 ratio every time. Essential.', he: 'ניחוש יחסים = קפה לא עקבי. משקל $15 נותן יחס 1:16 חוזר בכל פעם. חובה.' } },
      { heading: { en: '4. Gooseneck Kettle', he: '4. קומקום צוואר אווז' }, body: { en: 'Controls pour rate for even extraction. Stovetop ($20) or electric with temp control ($60). Variable temp matters for light roasts.', he: 'שולט בקצב מזיגה למיצוי אחיד. כיריים ($20) או חשמלי עם בקרת טמפרטורה ($60). טמפרטורה משתנה חשובה לקלייה קלה.' } },
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
  {
    slug: 'best-wireless-earbuds-2026',
    title: {
      en: 'Best Wireless Earbuds Under $50 (2026): ANC, Sound & Battery Compared',
      he: 'האוזניות האלחוטיות הטובות ביותר מתחת ל-50$ (2026): ANC, סאונד וסוללה',
      fr: 'Meilleurs Écouteurs Sans Fil à Moins de 50$ (2026)',
      de: 'Beste kabellose Kopfhörer unter 50$ (2026)',
      es: 'Mejores Auriculares Inalámbricos por menos de 50$ (2026)',
      it: 'Migliori Auricolari Wireless Sotto i 50$ (2026)',
    },
    metaDesc: {
      en: 'Best budget wireless earbuds in 2026 compared: ANC, battery life, sound quality, and water resistance. Find your perfect pair under $50 on AliExpress.',
      he: 'האוזניות האלחוטיות התקציביות הטובות ביותר של 2026 בהשוואה: ANC, חיי סוללה, איכות סאונד ועמידות במים.',
      fr: 'Meilleurs écouteurs sans fil économiques 2026: ANC, autonomie, qualité sonore.',
      de: 'Beste budget-kabellose Kopfhörer 2026: ANC, Akkulaufzeit, Klangqualität.',
      es: 'Mejores auriculares inalámbricos económicos 2026: ANC, batería, calidad de sonido.',
      it: 'Migliori auricolari wireless economici 2026: ANC, batteria, qualità audio.',
    },
    intro: {
      en: 'Wireless earbuds have become astonishingly good at budget prices. ANC that rivals Sony and Bose from 3 years ago, 30+ hour battery with case, and IPX5 water resistance — all under $50 on AliExpress. This guide breaks down what to look for and which models deliver the best value.',
      he: 'אוזניות TWS הפכו לטובות במיוחד במחירים תקציביים. ANC שמתחרה בסוני ובוס מלפני 3 שנים, 30+ שעות סוללה עם קייס, ועמידות IPX5.',
      fr: 'Les écouteurs sans fil sont devenus étonnamment bons à prix budget. ANC rivalisant avec Sony et Bose.',
      de: 'Kabellose Kopfhörer sind zu erstaunlich günstigen Preisen geworden. ANC, das mit Sony und Bose mithält.',
      es: 'Los auriculares inalámbricos se han vuelto asombrosamente buenos a precios económicos.',
      it: 'Gli auricolari wireless sono diventati sorprendentemente buoni a prezzi economici.',
    },
    sections: [
      { heading: { en: 'What to Look for in Budget TWS Earbuds', he: 'מה לבדוק באוזניות TWS תקציביות' }, body: { en: 'Bluetooth 5.3+ ensures stable connection and lower power consumption. ANC (Active Noise Cancellation) is now common under $30 — it attenuates 25-30dB of ambient noise. IPX5+ water resistance handles sweat and rain. Battery life should be 6-8 hours per charge; the case adds 3-4 full charges. USB-C charging is standard; wireless charging is a bonus.', he: 'Bluetooth 5.3 ומעלה נותן חיבור יציב וצריכת חשמל נמוכה יותר. ANC — ביטול רעשים אקטיבי — כבר נפוץ מתחת ל-30$ ומנחית 25-30 דציבל מרעש הרקע. עמידות IPX5 ומעלה מספיקה לזיעה ולגשם. סוללה סבירה היא 6-8 שעות לטעינה, והנרתיק מוסיף עוד 3-4 טעינות מלאות. טעינת USB-C היא סטנדרט; טעינה אלחוטית זה בונוס, לא שיקול.' } },
      { heading: { en: 'Pick Your Priority: ANC, Sound, or Battery', he: 'תחליטו מה חשוב: ביטול רעשים, צליל או סוללה' }, body: { en: 'For commuting and noisy environments, prioritize ANC earbuds with transparency mode. For music lovers, look for 13mm+ dynamic drivers and AAC codec support. For all-day wear, prioritize battery (8h+ per charge) and comfort — slim stem designs with ear tips that match your ear canal size.', he: 'אי אפשר לקבל את שלושתם במחיר הזה, אז כדאי להחליט מראש. לנסיעות ולסביבות רועשות — ANC עם מצב שקיפות, שמאפשר לשמוע הכרזות בלי להוציא את האוזנייה. לאוהבי מוזיקה — דרייבר דינמי 13 מ"מ ומעלה ותמיכה בקודק AAC. לשימוש לאורך כל היום — סוללה של 8 שעות ומעלה ונוחות: מבנה גזע דק וטיפים בגודל שמתאים לתעלת האוזן שלכם. טיפ שלא עולה כלום: החליפו טיפים עד שיש אטימה מלאה — אטימה גרועה מורידה גם בס וגם ANC יותר מכל הבדל בין דגמים.' } },
      { heading: { en: 'Top Budget Picks Under $30', he: 'מה מקבלים מתחת ל-30$' }, body: { en: 'The best value tier: earbuds with ANC, Bluetooth 5.3, 30h+ total battery, IPX5, USB-C charging, and touch controls — all for $15-30 on AliExpress. Brands like Baseus, SoundPEATS, QCY, and Moondrop offer exceptional value. Look for 4.3+ star ratings and 1000+ reviews.', he: 'בטווח 15-30$ כבר מקבלים ANC, ‏Bluetooth 5.3, סוללה מצטברת של 30 שעות ומעלה, IPX5, טעינת USB-C ובקרת מגע. Baseus, ‏SoundPEATS, ‏QCY ו-Moondrop הם השמות שחוזרים בטווח הזה. סינון מהיר שעובד: דירוג 4.3 ומעלה עם יותר מ-1000 ביקורות — מתחת לזה אין מספיק דגימות כדי לדעת אם הדגם אמין.' } },
    ],
    faq: [
      { q: { en: 'Are $20 ANC earbuds actually good?', he: 'האם אוזניות ANC ב-20$ באמת טובות?' }, a: { en: 'The ANC won\'t match $300 Sony earbuds — expect ~20-25dB reduction vs 35-40dB. But they\'re effective enough for commuting, office, and gym. Sound quality has improved dramatically. For the price, they\'re excellent value.', he: 'ה-ANC לא יתאים לאוזניות סוני ב-300$ — תצפו להפחתה של ~20-25dB לעומת 35-40dB. אבל הן מספיק יעילות לנסיעה, משרד וחדר כושר.' } },
    ],
    keywords: ['best wireless earbuds 2026', 'budget ANC earbuds', 'TWS earbuds under 50', 'best cheap earbuds aliexpress'],
    relatedProducts: [
      { name: 'TWS ANC Earbuds', keyword: 'TWS earbuds ANC wireless' },
      { name: 'Bluetooth 5.3 Earbuds', keyword: 'bluetooth 5.3 earbuds' },
      { name: 'Waterproof Earbuds', keyword: 'waterproof earbuds IPX7' },
    ],
    publishDate: '2026-07-15',
    category: 'buying-guide',
  },
  {
    slug: 'summer-gadgets-beat-heat-2026',
    title: {
      en: 'Summer Gadgets 2026: Beat the Heat Without AC (Under €30)',
      he: 'גאדג\'טים לקיץ 2026: לנצח את החום בלי מזגן (פחות מ-₪120)',
      fr: 'Gadgets d\'Été 2026: Vaincre la Chaleur Sans Climatisation (Moins de 30€)',
      de: 'Sommer-Gadgets 2026: Hitze ohne Klimaanlage besiegen (unter 30€)',
      es: 'Gadgets de Verano 2026: Vence el Calor Sin Aire Acondicionado',
      it: 'Gadget Estivi 2026: Sconfiggi il Caldo Senza Aria Condizionata',
    },
    metaDesc: {
      en: 'Stay cool this summer without running the AC. Portable fans, cooling towels, insulated bottles, UV umbrellas, and neck fans — all under €30 on AliExpress.',
      he: 'הישארו קרירים הקיץ בלי להפעיל מזגן. מאווררים ניידים, מגבות קירור, בקבוקים מבודדים, מטריות UV ומאווררי צוואר — הכל בפחות מ-₪120.',
      fr: 'Restez au frais sans climatisation. Ventilateurs, serviettes rafraîchissantes, bouteilles isolées, parapluies UV.',
      de: 'Bleiben Sie im Sommer ohne Klimaanlage kühl. Ventilatoren, Kühltücher, isolierte Flaschen, UV-Schirme.',
      es: 'Manténgase fresco sin aire acondicionado. Ventiladores, toallas refrescantes, botellas aisladas.',
      it: 'Rimanete al fresco senza aria condizionata. Ventilatori, asciugamani rinfrescanti, borracce isolate.',
    },
    intro: {
      en: 'Heatwaves are getting worse, but you don\'t need to blast the AC (or your budget). The right gadgets make a dramatic difference in comfort — whether you\'re commuting, working, or relaxing at home. Here are the best summer cooling gadgets under €30 on AliExpress.',
      he: 'גלי חום מחמירים, אבל לא צריך להפעיל מזגן במלוא העוצמה (או לפרוץ את התקציב). הגאדג\'טים הנכונים עושים הבדל דרמטי בנוחות.',
      fr: 'Les vagues de chaleur s\'aggravent, mais vous n\'avez pas besoin de faire exploser votre budget climatisation.',
      de: 'Hitzewellen werden schlimmer, aber Sie müssen nicht die Klimaanlage aufdrehen.',
      es: 'Las olas de calor empeoran, pero no necesita disparar el aire acondicionado.',
      it: 'Le ondate di calore peggiorano, ma non serve sparare l\'aria condizionata.',
    },
    sections: [
      { heading: { en: 'Neck Fans & Portable Coolers', he: 'מאווררי צוואר וקירור נייד' }, body: { en: 'Wearable neck fans are the #1 summer gadget in 2026. They blow cool air directly on your face and neck — the most heat-sensitive areas. Look for 4000mAh+ battery, 3+ speed settings, and quiet operation. For desk use, a mini USB fan with 360° rotation cools your workspace without hogging space. Both cost €7-20 on AliExpress.', he: 'מאוורר צוואר לביש מכוון אוויר ישירות לפנים ולצוואר — האזורים שהכי רגישים לחום, ולכן ההרגשה משתנה מהר יותר מאשר עם מאוורר חדר. מה לבדוק: סוללה 4000mAh ומעלה (מספיקה ליום עבודה), לפחות שלוש מהירויות, ורעש נמוך — דגמים זולים משמיעים שריקה שמעצבנת אחרי חצי שעה. לשולחן, מאוורר USB קטן עם סיבוב 360° מקרר את העמדה בלי לתפוס מקום. שניהם בטווח 25-70 ש"ח.' } },
      { heading: { en: 'Hydration That Actually Stays Cold', he: 'שתייה שנשארת קרה באמת' }, body: { en: 'A vacuum-insulated stainless steel bottle keeps ice water cold for 24+ hours — even in direct sun. Look for 1L+ capacity, wide mouth for ice cubes, and a carry loop. Pair with electrolyte powder packets for faster hydration. For hands-free hydration, a hydration backpack holds 2L and has a drinking tube — perfect for outdoor work or long walks.', he: 'בקבוק נירוסטה עם בידוד ואקום שומר על מים עם קרח קרים יותר מ-24 שעות, גם בשמש ישירה — זה הפריט היחיד ברשימה שמשנה את היום בישראל. מה לבדוק: קיבולת ליטר ומעלה, פה רחב שקוביות קרח נכנסות דרכו (פה צר הופך אותו לבקבוק רגיל), ולולאת נשיאה. אבקת אלקטרוליטים עוזרת כשמזיעים הרבה — מים לבד לא מחזירים מלחים. לפעילות ממושכת, תיק שתייה של 2 ליטר עם צינורית משחרר את הידיים.' } },
      { heading: { en: 'Sun & Heat Protection', he: 'הגנה מהשמש ומהחום' }, body: { en: 'A UV umbrella with silver coating reflects sunlight and lowers perceived temperature by 5-10°C. Cooling towels activated by water (wet, wring, snap) drop 15-20°C below ambient and stay cool for 1-3 hours. UV400 polarized sunglasses protect your eyes and reduce glare. A wide-brim UV hat adds full face and neck protection.', he: 'מטריית UV עם ציפוי כסף מחזירה קרינה ומורידה את הטמפרטורה המורגשת ב-5-10 מעלות — הבדל מורגש בהמתנה לאוטובוס. מגבת קירור עובדת במחזור של הרטבה, סחיטה ונפנוף, ונשארת קרירה שעה עד שלוש. משקפי שמש UV400 מקוטבים מגנים על העיניים ומורידים סנוור מאספלט ומים. כובע רחב שוליים עם דירוג UV מכסה גם את הפנים וגם את העורף, שזה האזור שנשרף הכי הרבה.' } },
    ],
    faq: [
      { q: { en: 'Do neck fans actually cool you down?', he: 'האם מאווררי צוואר באמת מקררים?' }, a: { en: 'Yes — by blowing air directly over your face and neck, they accelerate evaporative cooling from sweat and moisture. Users report feeling 5-8°C cooler. They work best in dry heat. For humid climates, cooling towels are more effective.', he: 'כן — על ידי ניפוח אוויר ישירות על הפנים והצוואר, הם מאיצים קירור באידוי מזיעה ולחות.' } },
    ],
    keywords: ['summer gadgets 2026', 'beat the heat without AC', 'portable neck fan', 'cooling gadgets aliexpress', 'summer survival kit'],
    relatedProducts: [
      { name: 'Neck Fan', keyword: 'neck fan wearable rechargeable' },
      { name: 'Cooling Towel', keyword: 'cooling towel instant' },
      { name: 'UV Umbrella', keyword: 'UV umbrella UPF 50' },
      { name: 'Insulated Bottle', keyword: 'insulated water bottle stainless steel' },
    ],
    publishDate: '2026-07-15',
    category: 'seasonal',
      },
      {
    slug: 'best-wireless-earbuds-under-30',
    title: { en: 'Best Wireless Earbuds Under $30 in 2026', he: 'האוזניות האלחוטיות הטובות ביותר מתחת ל-₪100' },
    metaDesc: { en: 'We tested 12 budget wireless earbuds under $30 from AliExpress.', he: 'בדקנו 12 אוזניות אלחוטיות מתחת ל-₪100' },
    intro: { en: 'You dont need $200 for decent earbuds. We tested 12 pairs under $30.', he: 'אתם לא צריכים ₪800 על אוזניות טובות' },
    sections: [
      { heading: { en: 'What to Look for', he: 'מה לחפש' }, body: { en: 'Battery life, fit, and sound quality are key.', he: 'חיי סוללה, התאמה ואיכות שמע' } },
      { heading: { en: 'Our Top Pick', he: 'הבחירה שלנו' }, body: { en: 'QCY T13 Gen 2 at under $25.', he: 'QCY T13 Gen 2 בפחות מ-₪90' } },
    ],
    faq: [{ q: { en: 'Are cheap earbuds worth it?', he: 'האם אוזניות זולות שוות?' }, a: { en: 'Yes — budget earbuds have improved dramatically.', he: 'כן' } }],
    keywords: ['best wireless earbuds under 30', 'cheap bluetooth earbuds 2026', 'budget TWS AliExpress'],
    relatedProducts: [{ name: 'QCY T13 Gen 2', keyword: 'QCY T13 Gen 2 wireless earbuds' }],
    publishDate: '2026-07-15',
    category: 'buying-guide',
  },
  {
    slug: 'smart-home-beginners-guide',
    title: {
      en: 'Smart Home for Beginners: Start Your Automation Journey Under €50',
      he: 'בית חכם למתחילים: להתחיל באוטומציה בפחות מ-₪200',
    },
    metaDesc: {
      en: 'Smart home starter guide — WiFi plugs, bulbs, sensors, and voice assistants. Build your smart home on a budget with AliExpress deals.',
      he: 'מדריך בית חכם למתחילים — שקעי WiFi, נורות, חיישנים ועוזרים קוליים. בנו בית חכם בתקציב עם מבצעי אליאקספרס.',
    },
    intro: {
      en: 'Smart home technology has never been more affordable. You can automate your lights, schedule your coffee maker, and monitor your front door — all for under €50 from AliExpress. This guide walks you through the essential building blocks, in the right order, so you don\'t waste money on gadgets that don\'t work together.',
      he: 'טכנולוגיית בית חכם מעולם לא הייתה משתלמת יותר. אפשר להפוך את הבית לאוטומטי — תאורה, קפה, דלת כניסה — הכל בפחות מ-₪200 מאליאקספרס. המדריך הזה עובר על אבני הבניין החיוניות, בסדר הנכון.',
    },
    sections: [
      {
              heading: { en: 'Smart Plugs — The Easiest Entry Point', he: 'שקעים חכמים — נקודת הכניסה הקלה ביותר' },
              body: { en: 'A WiFi smart plug turns any dumb appliance into a smart one. Plug in your lamp, coffee maker, or fan — then control it from your phone, set schedules, or use voice commands via Alexa/Google. Tuya-based plugs cost €3-8 and work with the Smart Life app. Look for EU plugs with power monitoring (shows energy usage). Start with 2-3: one for your bedside lamp (sunrise alarm), one for the coffee maker (morning auto-brew), and one for a living room lamp (evening auto-on).', he: 'שקע WiFi חכם הופך כל מכשיר רגיל לחכם. חברו מנורה, מכונת קפה או מאוורר — שלטו מהטלפון, קבעו לוחות זמנים, או השתמשו בפקודות קוליות. שקעי Tuya עולים €3-8 ועובדים עם אפליקציית Smart Life.' } },
            {
              heading: { en: 'Smart Bulbs — Instant Atmosphere', he: 'נורות חכמות — אווירה מיידית' },
              body: { en: 'Smart bulbs let you dim lights, change colors, and set schedules without rewiring. RGB bulbs create mood lighting for movies, parties, or relaxation. Look for WiFi bulbs (no hub needed) with 16M colors and dimmable white range (2700K-6500K). A 2-pack covers your living room and bedroom. Pair with a motion sensor in the hallway for lights that turn on automatically when you walk by at night.', he: 'נורות חכמות מאפשרות לעמעם, לשנות צבעים ולקבוע לוחות זמנים בלי להתקין חשמל. נורות RGB יוצרות אווירה לסרטים, מסיבות או הרפיה. חפשו נורות WiFi (בלי רכזת) עם 16M צבעים.' } },
            {
              heading: { en: 'Sensors & Automation — Make It Automatic', he: 'חיישנים ואוטומציה — להפוך לאוטומטי' },
              body: { en: 'The real magic of a smart home is automation that happens without you. A door/window sensor sends an alert when opened. A motion sensor triggers lights when you enter a room. A temperature sensor adjusts your smart plug space heater. These sensors cost €2-8 each and create the "if-this-then-that" logic that makes a house feel intelligent. Start with a door sensor on the front door + a motion sensor in the hallway.', he: 'הקסם האמיתי של בית חכם הוא אוטומציה שקורית בלי ידכם. חיישן דלת/חלון שולח התראה כשנפתח. חיישן תנועה מפעיל אורות כשנכנסים לחדר. חיישני טמפרטורה מכוונים תנור חכם. חיישנים אלה עולים €2-8 כל אחד.' } },
          ],
    faq: [
      { q: { en: 'Do I need a hub or bridge for smart home devices?', he: 'האם צריך רכזת (Hub) למכשירי בית חכם?' }, a: { en: 'Not for WiFi-based devices (Tuya/Smart Life). They connect directly to your home WiFi and are controlled via app. Zigbee or Z-Wave devices need a hub (like a Philips Hue bridge or Sonoff hub). For beginners, stick with WiFi devices — no hub needed.', he: 'לא למכשירי WiFi (Tuya/Smart Life). הם מתחברים ישירות ל-WiFi הביתי ונשלטים באפליקציה. מכשירי Zigbee או Z-Wave צריכים רכזת. למתחילים, היצמדו למכשירי WiFi.' } },
      { q: { en: 'Can I use voice control without a smart speaker?', he: 'האם אפשר להשתמש בשליטה קולית בלי רמקול חכם?' }, a: { en: 'Yes — the Smart Life app has a widget on your phone, and you can schedule automations from the app. But a cheap Echo Dot or Google Nest Mini (€20-30 on AliExpress) adds voice control and makes the experience much better.', he: 'כן — לאפליקציית Smart Life יש ווידג\'ט בטלפון, ואפשר לקבוע אוטומציות מהאפליקציה. אבל רמקול חכם זול (€20-30) מוסיף שליטה קולית.' } },
    ],
    keywords: ['smart home beginners', 'smart home starter kit', 'home automation aliexpress', 'smart home under 50', 'tuya smart home setup'],
    relatedProducts: [
      { name: 'WiFi Smart Plug', keyword: 'Tuya smart plug EU' },
      { name: 'RGB Smart Bulb', keyword: 'smart wifi bulb rgb' },
      { name: 'Motion Sensor', keyword: 'motion sensor wifi' },
      { name: 'Door Sensor', keyword: 'door window sensor wifi' },
    ],
    publishDate: '2026-07-16',
    category: 'buying-guide',
  },
  {
    slug: 'pet-care-essentials-budget',
    title: {
      en: 'Pet Care Essentials on a Budget: Must-Haves Under €30',
      he: 'ציוד חיוני לחיות מחמד בתקציב: מוצרי חובה בפחות מ-₪120',
    },
    metaDesc: {
      en: 'Complete pet care guide — feeding, grooming, walking, and playing. Everything your furry friend needs from AliExpress under €30.',
      he: 'מדריך שלם למוצרים לחיות מחמד — האכלה, טיפוח, טיולים ומשחק. כל מה שחבר הפרוותי צריך מאליאקספרס בפחות מ-₪120.',
    },
    intro: {
      en: 'Pets are family — but the pet supply industry is notorious for markups. The same products sold in pet stores for 3x the price are available on AliExpress for a fraction. This guide covers the essential gear every dog or cat owner needs, from feeding to grooming to playtime, all under €30.',
      he: 'חיות מחמד זה משפחה — אבל תעשיית מוצרי חיות המחמד ידועה במחירים מופקעים. אותם מוצרים שנמכרים בחנויות במחיר כפול ומשולש זמינים באליאקספרס בשבריר מהמחיר. המדריך הזה מכסה את הציוד החיוני לכל בעל כלב או חתול.',
    },
    sections: [
      {
        heading: { en: 'Feeding & Hydration', he: 'האכלה ושתייה' },
        body: { en: 'A slow feeder bowl prevents bloat and makes mealtime last longer — especially important for dogs that inhale food. A pet water fountain with a carbon filter encourages cats to drink more (prevents kidney issues). Look for stainless steel or ceramic bowls — they\'re hygienic and don\'t harbor bacteria like plastic. An automatic feeder with a timer is a game-changer for busy pet parents: it dispenses measured portions at set times.', he: 'קערת האכלה איטית מונעת נפיחות ומאריכה את זמן הארוחה — חשוב במיוחד לכלבים שבולעים אוכל. מזרקת מים עם פילטר פחם מעודדת חתולים לשתות יותר (מונעת בעיות כליות).' },
      },
      {
        heading: { en: 'Grooming Tools', he: 'כלי טיפוח' },
        body: { en: 'Regular grooming keeps your pet healthy and your home clean. A deshedding brush (like a FURminator-style) removes loose undercoat and reduces shedding by 90%. A nail grinder is safer than clippers — no risk of cutting the quick. A grooming glove doubles as a petting session and hair removal tool. For cats, a self-grooming brush that mounts on the wall lets them groom themselves on demand. For bathing, a silicone pet brush with shampoo dispenser makes bath time easier.', he: 'טיפוח קבוע שומר על חיית המחמד בריאה ועל הבית נקי. מברשת נשירה מסירה פרווה תחתונה רופפת ומפחיתה נשירה ב-90%. משחקת ציפורניים בטוחה יותר ממספריים.' },
      },
      {
        heading: { en: 'Walking & Outdoor Gear', he: 'ציוד טיולים וחוץ' },
        body: { en: 'A hands-free leash with a waist belt is perfect for jogging with your dog or managing multiple dogs. A reflective harness with a handle gives you control and visibility at night. LED collar lights make your dog visible in the dark. Poop bag dispensers with a built-in holder clip to the leash so you\'re never caught without bags. A car seat cover protects your seats from mud, fur, and scratches.', he: 'רצועה ידיים-חופשיות עם חגורת מותניים מושלמת לריצה עם הכלב או לניהול מספר כלבים. רתמה מחזירת אור עם ידית נותנת שליטה ונראות בלילה. קולר LED הופך את הכלב לגלוי בחושך.' },
      },
    ],
    faq: [
      { q: { en: 'Are AliExpress pet products safe?', he: 'האם מוצרים לחיות מחמד מאליאקספרס בטוחים?' }, a: { en: 'Yes — look for BPA-free, food-grade silicone, and stainless steel materials. Avoid cheap plastic that can crack or leach chemicals. Check reviews for \"pet safe\" and stick to sellers with 95%+ positive feedback. The same factories that make branded pet products also sell on AliExpress.', he: 'כן — חפשו חומרים נטולי BPA, סיליקון באיכות מזון, ונירוסטה. הימנעו מפלסטיק זוק שיכול להיסדק. בדקו ביקורות והיצמדו למוכרים עם 95%+ משוב חיובי.' } },
      { q: { en: 'Which is better: a water fountain or a regular bowl?', he: 'מה עדיף: מזרקת מים או קערה רגילה?' }, a: { en: 'A fountain is significantly better — the flowing water encourages cats to drink more (preventing urinary tract issues), filters out hair and debris, and keeps water oxygenated and fresh. Most cats drink 2-3x more from a fountain.', he: 'מזרקה טובה משמעותית — מים זורמים מעודדים חתולים לשתות יותר (מונע בעיות בדרכי השתן), מסננים שיער ולכלוך, ושומרים על מים מחומצנים וטריים.' } },
    ],
    keywords: ['pet care essentials', 'dog supplies aliexpress', 'cat supplies budget', 'pet grooming tools', 'dog walking gear'],
    relatedProducts: [
      { name: 'Pet Water Fountain', keyword: 'pet water fountain stainless' },
      { name: 'Deshedding Brush', keyword: 'deshedding tool dog cat' },
      { name: 'Hands-Free Leash', keyword: 'hands free dog leash waist' },
      { name: 'Slow Feeder', keyword: 'slow feeder dog bowl' },
    ],
    publishDate: '2026-07-16',
    category: 'buying-guide',
  },
  {
    slug: 'travel-hacks-gadgets-packing',
    title: {
      en: 'Travel Hacks: Smart Packing Gadgets Under €25',
      he: 'טריקים לטיולים: גאדג\'טים חכמים לאריזה בפחות מ-₪100',
    },
    metaDesc: {
      en: 'Smart travel gadgets for stress-free packing — compression cubes, cable organizers, universal adapters, and more. Travel smarter on a budget.',
      he: 'גאדג\'טים חכמים לטיולים ללא לחץ — קוביות דחיסה, מארגני כבלים, מתאמים אוניברסליים ועוד. טיילו חכם יותר בתקציב.',
    },
    intro: {
      en: 'Traveling is one of life\'s greatest pleasures — but packing, adapters, and dead batteries can ruin the experience. The right gadgets transform a stressful trip into a smooth journey. Here are the best travel accessories under €25 from AliExpress that every traveler should own.',
      he: 'טיולים הם אחד מהנאות החיים הגדולות — אבל אריזה, מתאמים וסוללות מתות יכולים להרוס את החוויה. הגאדג\'טים הנכונים הופכים טיול מלחיץ למסע חלק. הנה אביזרי הנסיעה הטובים ביותר בפחות מ-₪100 מאליאקספרס.',
    },
    sections: [
      {
        heading: { en: 'Packing Organization', he: 'ארגון אריזה' },
        body: { en: 'Compression packing cubes are the #1 travel hack. They squeeze the air out of your clothes, fitting 2x more in your suitcase. Get a set of 4-6 cubes in different sizes. A hanging toiletry bag with a hook keeps your bathroom essentials organized and visible. Shoe bags keep dirty soles away from clean clothes. A travel jewelry organizer with individual compartments prevents tangles.', he: 'קוביות אריזה דחיסה הן הטריק מספר 1 לטיולים. הן סוחטות את האוויר מבגדים, ומכניסות פי 2 יותר למזוודה. קחו סט של 4-6 קוביות בגדלים שונים. תיק טואלט תלוי עם וו שומר על מוצרי רחצה מסודרים.' },
      },
      {
        heading: { en: 'Tech & Charging on the Go', he: 'טק וטעינה בדרכים' },
        body: { en: 'A universal travel adapter with multiple USB ports is essential — look for one with US/EU/UK/AU plugs, USB-C PD (Power Delivery) for fast charging, and surge protection. A 10000mAh power bank charges your phone 2-3 times. A cable organizer case keeps chargers, cables, and adapters from tangling. A magnetic USB-C cable with detachable tips works for both iPhone and Android — carry one cable for everything.', he: 'מתאם נסיעות אוניברסלי עם שקעי USB מרובים הוא חיוני — חפשו עם תקעי US/EU/UK/AU, USB-C PD לטעינה מהירה, והגנת נחשולי מתח.' },
      },
      {
        heading: { en: 'Comfort & Security', he: 'נוחות וביטחון' },
        body: { en: 'A travel neck pillow with memory foam and a washable cover makes long flights bearable. A sleep mask with contoured eye cups allows you to blink naturally while blocking 100% of light. A TSA-approved combination lock secures your luggage. A door lock alarm adds security to hotel rooms. A portable luggage scale prevents overweight baggage fees. An RFID-blocking passport wallet protects your data from digital theft.', he: 'כרית צוואר לנסיעות עם קצף זיכרון וכיסוי ניתן לכביסה הופכת טיסות ארוכות לנסבלות. מסכת שינה עם כוסות עיניים מעוצבות מאפשרת למצמץ באופן טבעי תוך חסימת 100% אור.' },
      },
    ],
    faq: [
      { q: { en: 'Do compression packing cubes really work?', he: 'האם קוביות דחיסה באמת עובדות?' }, a: { en: 'Yes — they use a second zipper to compress the cube, reducing volume by 30-50%. Clothes come out wrinkled but not as bad as vacuum bags. They\'re better than rolling for maximizing space, and the organization benefit alone is worth it.', he: 'כן — הן משתמשות ברוכסן שני כדי לדחוס את הקובייה, ומפחיתות נפח ב-30-50%. בגדים יוצאים מקומטים אבל פחות גרוע משקיות ואקום.' } },
      { q: { en: 'Do I need a universal adapter or a specific one?', he: 'האם צריך מתאם אוניברסלי או ספציפי?' }, a: { en: 'A universal adapter with all 4 plug types (US/EU/UK/AU) covers 95% of destinations. Some countries (South Africa, Brazil, India) have unique plugs. Check your destination before buying. Adapters with USB-C PD 20W+ can charge a laptop, phone, and tablet simultaneously.', he: 'מתאם אוניברסלי עם כל 4 סוגי התקעים (US/EU/UK/AU) מכסה 95% מהיעדים. למדינות מסוימות יש תקעים ייחודיים. בדקו את היעד לפני הקנייה.' } },
    ],
    keywords: ['travel hacks', 'packing gadgets', 'travel accessories aliexpress', 'smart packing', 'travel adapter universal'],
    relatedProducts: [
      { name: 'Compression Packing Cubes', keyword: 'compression packing cubes set' },
      { name: 'Universal Travel Adapter', keyword: 'universal travel adapter usb c' },
      { name: 'Travel Neck Pillow', keyword: 'memory foam neck pillow' },
      { name: 'Cable Organizer', keyword: 'cable organizer travel case' },
    ],
    publishDate: '2026-07-16',
    category: 'tips',
  },
  {
    slug: 'budget-gaming-mouse-keyboard',
    title: { en: 'Budget Gaming Mouse vs Keyboard: Which Upgrade Matters Most?', he: 'עכבר גיימינג מול מקלדת: איזה שדרוג הכי משתלם?' },
    metaDesc: { en: 'Should you upgrade your mouse or keyboard first? We compare the impact on gaming performance.', he: 'מה כדאי לשדרג קודם — עכבר או מקלדת? השוואה של ההשפעה על ביצועי המשחק.' },
    intro: { en: 'When building a budget gaming setup, the two biggest upgrades are mouse and keyboard. We tested $20 mice against $20 keyboards to find which gives the biggest boost.', he: 'כשבונים עמדת גיימינג תקציבית, שני השדרוגים הכי גדולים הם עכבר ומקלדת. בדקנו איזה נותן את התמורה הטובה ביותר.' },
    sections: [
      { heading: { en: 'Why a Gaming Mouse Matters', he: 'למה עכבר גיימינג חשוב' }, body: { en: 'Adjustable DPI (up to 6400), programmable buttons, and 1000Hz polling rate give you precision and speed in FPS games.', he: 'DPI מתכוונן, כפתורים ניתנים לתכנות וקצב דיווח גבוה נותנים דיוק ומהירות במשחקי FPS.' } },
      { heading: { en: 'Why a Mechanical Keyboard Matters', he: 'למה מקלדת מכנית חשובה' }, body: { en: 'Genuine mechanical switches provide faster, more consistent keystrokes. The 60% form factor saves desk space.', he: 'סוויצ\'ים מכניים אמיתיים מספקים הקשות מהירות ועקביות יותר. הפורמט 60% חוסך מקום על השולחן.' } },
    ],
    faq: [
      { q: { en: 'Which is more important for FPS?', he: 'מה יותר חשוב ל-FPS?' }, a: { en: 'Mouse. DPI and polling rate matter more than keyboard switches for aiming.', he: 'עכבר. DPI וקצב דיווח חשובים יותר מסוויצ\'ים במקלדת.' } },
    ],
    keywords: ['gaming mouse vs keyboard', 'budget gaming setup', 'best cheap gaming mouse', 'best cheap mechanical keyboard'],
    relatedProducts: [
      { name: 'Gaming Mouse', keyword: 'gaming mouse rgb wired 6400 dpi' },
      { name: 'Mechanical Keyboard', keyword: 'mechanical keyboard 60% rgb wired' },
    ],
    publishDate: '2026-07-16',
    category: 'comparison',
  },
  {
    slug: 'best-wireless-earbuds-under-20-compared',
    title: { en: 'Best Wireless Earbuds Under $20 on AliExpress (2026)', he: 'האוזניות האלחוטיות הכי טובות בפחות מ-₪80 באליאקספרס (2026)' },
    metaDesc: { en: 'We tested 5 budget wireless earbuds under $20 from AliExpress to find the best value.', he: 'בדקנו 5 אוזניות אלחוטיות תקציביות בפחות מ-₪80 מאליאקספרס.' },
    intro: { en: "Wireless earbuds don't have to cost a fortune. We tested 5 top-rated earbuds under $20 from AliExpress.", he: 'אוזניות אלחוטיות לא חייבות להיות יקרות. בדקנו 5 אוזניות מובילות בפחות מ-₪80.' },
    sections: [
      { heading: { en: 'What to Look For', he: 'מה לחפש' }, body: { en: 'Battery life (4-8hrs), Bluetooth 5.0+, charging case, IP rating, 13mm+ drivers.', he: 'חיי סוללה (4-8 שעות), בלוטות\' 5.0+, מארז טעינה, דירוג IP, דרייבר 13 מ"מ+.' } },
      { heading: { en: 'Top Pick: Baseus Bowie 15', he: 'הבחירה המובילה: Baseus Bowie 15' }, body: { en: 'Best overall — 6hr battery, USB-C, touch controls, IPX5. Under $15.', he: 'הכי טוב — 6 שעות סוללה, USB-C, בקרות מגע, IPX5. פחות מ-₪60.' } },
    ],
    faq: [{ q: { en: 'Are $20 earbuds any good?', he: 'האם אוזניות ב-₪80 טובות?' }, a: { en: 'Yes. Brands like Baseus, QKZ, and SoundPEATS offer excellent value.', he: 'כן. מותגים כמו Baseus, QKZ ו-SoundPEATS מציעות תמורה מצוינת.' } }],
    keywords: ['best wireless earbuds under 20', 'budget wireless earbuds 2026', 'aliexpress earbuds review'],
    relatedProducts: [{ name: 'Wireless Earbuds', keyword: 'bluetooth 5.3 earbuds wireless noise cancelling' }],
    publishDate: '2026-07-17',
    category: 'comparison',
  },
{
    slug: 'budget-streaming-setup-guide',
    title: {
      en: 'Budget Streaming Setup Guide: Go Live on Twitch/YouTube Under $100',
      he: 'מדריך עמדת סטרימינג תקציבית: לשדר ב-Twitch/YouTube בפחות מ-₪400',
      fr: 'Guide Setup Streaming Budget: Devenir Streamer pour Moins de 100€',
      de: 'Budget-Streaming-Setup-Guide: Live auf Twitch/YouTube unter 100$',
      es: 'Guía de Setup Streaming Económico: Stream en Vivo por menos de $100',
      it: 'Guida Setup Streaming Budget: Vai in Live su Twitch/YouTube Sotto i 100$',
    },
    metaDesc: {
      en: 'Complete budget streaming setup guide — microphone, camera, lighting, capture card, and software. Start streaming on Twitch or YouTube under $100 with AliExpress gear.',
      he: 'מדריך עמדת סטרימינג תקציבית מלא — מיקרופון, מצלמה, תאורה, כרטיס לכידה ותוכנה. התחילו לשדר ב-Twitch או YouTube בפחות מ-₪400 עם ציוד מאליאקספרס.',
      fr: 'Guide complet pour un setup streaming économique — micro, caméra, éclairage, carte de capture et logiciel.',
      de: 'Kompletter Budget-Streaming-Setup-Guide — Mikrofon, Kamera, Beleuchtung, Capture-Karte und Software.',
      es: 'Guía completa de setup streaming económico — micrófono, cámara, iluminación, tarjeta de captura y software.',
      it: 'Guida completa per setup streaming budget — microfono, fotocamera, illuminazione, scheda di acquisizione e software.',
    },
    intro: {
      en: 'You don\'t need a $2,000 streaming setup to go live on Twitch or YouTube. In 2026, budget gear from AliExpress delivers shockingly good quality for under $100 total. A USB microphone, ring light, and webcam beat the average starter streamer\'s setup. This guide covers every piece of gear you need — in order of priority — so you don\'t waste money on things that don\'t matter for your first 50 streams.',
      he: 'אתם לא צריכים עמדת סטרימינג ב-8,000₪ כדי לשדר ב-Twitch או YouTube. ב-2026, ציוד תקציבי מאליאקספרס נותן איכות מפתיעה בפחות מ-₪400. מיקרופון USB, תאורת טבעת ומצלמת רשת מנצחים את העמדה הממוצעת של סטרימר מתחיל.',
      fr: 'Vous n\'avez pas besoin d\'un setup à 2000€ pour streamer. En 2026, du matériel économique donne une qualité surprenante pour moins de 100€.',
      de: 'Sie brauchen kein 2000$-Streaming-Setup. Im Jahr 2026 liefert Budget-Equipment überraschend gute Qualität für unter 100$.',
      es: 'No necesitas un setup de $2,000 para hacer stream. En 2026, equipo económico ofrece calidad sorprendente por menos de $100.',
      it: 'Non serve un setup da 2000$ per andare in live su Twitch. Nel 2026, attrezzatura economica offre qualità sorprendente per meno di 100$.',
    },
    sections: [
      { heading: { en: 'Priority 1: Audio — USB Microphone', he: 'עדיפות 1: אודיו — מיקרופון USB' }, body: { en: 'Audio quality matters more than video. Viewers forgive a grainy webcam but will leave if your audio is echoey or quiet. USB condenser microphones cost $10-25 on AliExpress and sound professional. Look for a cardioid pickup pattern (rejects background noise), a pop filter, and a desk stand. Dynamic USB mics are better if your room is noisy (no echo/reverb). Start with a USB mic before buying anything else.', he: 'איכות אודיו חשובה יותר ממהירות. צופים סולחים על מצלמה מגורענת אבל יעזבו אם האודיו מהדהד או שקט. מיקרופוני USB קונדנסר עולים $10-25 באליאקספרס ונשמעים מקצועיים. חפשו תבנית קרדיואידית (דוחה רעשי רקע), פילטר פופ ומעמד שולחן.' } },
      { heading: { en: 'Priority 2: Lighting — Ring Light', he: 'עדיפות 2: תאורה — רינג לייט' }, body: { en: 'Good lighting transforms any webcam into a decent-looking stream. A 10-inch ring light with tripod costs $12-20 on AliExpress and includes dimmable brightness and color temperature (warm/cool/natural). Place it at eye level, slightly in front of you. The ring shape creates a flattering catchlight in your eyes. For a two-light setup, add a small softbox as fill light ($20-30).', he: 'תאורה טובה הופכת כל מצלמת רשת לסטרימינג טוב. רינג לייט 10 אינץ\' עם חצובה עולה $12-20 באליאקספרס וכולל בהירות מתכווננת וטמפרטורת צבע (חם/קר/טבעי).' } },
      { heading: { en: 'Priority 3: Video — Webcam or Phone Camera', he: 'עדיפות 3: וידאו — מצלמת רשת או מצלמת טלפון' }, body: { en: 'A 1080p webcam from AliExpress ($15-30) is fine for starting. Look for one with autofocus and a built-in microphone as backup. For better quality, use your phone as a webcam via IVCam or DroidCam (free) with a phone tripod ($5-10). Phone cameras are dramatically better than budget webcams. If using a phone, get a long USB cable for stable connection.', he: 'מצלמת רשת 1080p מאליאקספרס ($15-30) מספיקה להתחלה. חפשו עם פוקוס אוטומטי ומיקרופון מובנה כגיבוי. לאיכות טובה יותר, השתמשו בטלפון כמצלמת רשת דרך IVCam או DroidCam (חינם) עם חצובת טלפון ($5-10).' } },
      { heading: { en: 'Priority 4: Capture Card (Console Streamers)', he: 'עדיפות 4: כרטיס לכידה (לסטרימרים קונסולה)' }, body: { en: 'If you stream console gameplay (PS5, Xbox, Switch), you need a capture card. AliExpress HDMI capture cards ($10-20) support 1080p60 with USB 3.0. They work with OBS and Streamlabs. For PC gaming, you don\'t need a capture card — use OBS directly to capture your screen. High-end capture cards (Elgato, $150+) offer lower latency, but budget cards work fine for starting.', he: 'אם אתם משדרים משחקי קונסולה (PS5, Xbox, Switch), אתם צריכים כרטיס לכידה. כרטיסי HDMI מאליאקספרס ($10-20) תומכים 1080p60 עם USB 3.0. הם עובדים עם OBS ו-Streamlabs.' } },
      { heading: { en: 'Priority 5: Software & Accessories', he: 'עדיפות 5: תוכנה ואביזרים' }, body: { en: 'OBS Studio is free and industry-standard. Streamlabs OBS is easier for beginners. For alerts and overlays, use StreamElements or OWN3D (free tiers available). Add a stream deck alternative — a macro keypad ($10-20) lets you switch scenes, mute, and play sounds with one button. A RGB LED strip behind your monitor ($5-10) adds ambiance. Total software cost: $0.', he: 'OBS Studio חינמי ותקן בתעשייה. Streamlabs OBS קל יותר למתחילים. להתראות ואובליים, השתמשו ב-StreamElements או OWN3D (גרסאות חינמיות). הוסיפו מקלדת מאקרו ($10-20) שמאפשרת להחליף סצנות, להשתיק ולנגן צלילים בכפתור אחד.' } },
    ],
    faq: [
      { q: { en: 'Can I stream with just a laptop and no extra gear?', he: 'האם אפשר לשדר רק עם לפטופ בלי ציוד נוסף?' }, a: { en: 'Yes — OBS captures your laptop\'s webcam and screen. But the built-in mic will sound bad and the webcam is dim. A $15 USB microphone and $15 ring light are the minimum upgrades that make a dramatic difference. Budget $30-40 for the essentials.', he: 'כן — OBS לוכד את מצלמת הרשת והמסך של הלפטופ. אבל המיקרופון המובנה ישמע רע והמצלמה תהיה עמומה. מיקרופון USB ב-$15 ורינג לייט ב-$15 הם השדרוגים המינימליים שעושים הבדל דרמטי.' } },
      { q: { en: 'What internet speed do I need for streaming?', he: 'איזה מהירות אינטרנט צריך לסטרימינג?' }, a: { en: 'For 1080p30 streaming: 6 Mbps upload minimum. For 720p30: 3 Mbps. Twitch recommends 4500-6000 Kbps bitrate. Most ISPs can handle this. Check your speed at speedtest.net. If upload is below 5 Mbps, stream at 720p — it still looks good.', he: 'לסטרימינג 1080p30: מינימום 6 Mbps העלאה. ל-720p30: 3 Mbps. Twitch ממליץ על 4500-6000 Kbps bitrate.' } },
      { q: { en: 'Do I need a gaming PC to stream?', he: 'האם צריך מחשב גיימינג כדי לשדר?' }, a: { en: 'For console streaming, any laptop with 8GB RAM and USB 3.0 works — the console does the gaming. For PC streaming, you need a dedicated GPU (GTX 1660 or better) to avoid lag. NVIDIA NVENC encoder (GTX 1060+) handles streaming with minimal performance impact.', he: 'לסטרימינג מקונסולה, כל לפטופ עם 8GB RAM ו-USB 3.0 עובד — הקונסולה עושה את המשחק. לסטרימינג ממחשב, צריך GPU ייעודי (GTX 1660 ומעלה) כדי למנוע לאג.' } },
    ],
    keywords: ['budget streaming setup', 'streaming setup under 100', 'twitch streaming gear', 'start streaming cheap', 'budget microphone streaming', 'streaming equipment aliexpress'],
    relatedProducts: [
      { name: 'USB Microphone', keyword: 'usb condenser microphone cardioid' },
      { name: 'Ring Light', keyword: 'ring light with tripod 10 inch' },
      { name: 'Webcam 1080p', keyword: '1080p webcam autofocus' },
      { name: 'Capture Card', keyword: 'hdmi capture card usb 3.0' },
      { name: 'Macro Keypad', keyword: 'programmable macro keypad usb' },
    ],
    publishDate: '2026-07-17',
    category: 'buying-guide',
  },
  {
    slug: 'pet-accessories-roundup',
    title: {
      en: 'Pet Accessories Roundup: 15 Unique Finds Under €30 on AliExpress',
      he: 'אביזרים לחיות מחמד: 15 מוצרים ייחודיים בפחות מ-₪120',
      fr: 'Accessoires pour Animaux: 15 Trouvailles à Moins de 30€',
      de: 'Haustier-Zubehör: 15 einzigartige Funde unter 30€',
      es: 'Accesorios para Mascotas: 15 Hallazgos Únicos por menos de 30€',
      it: 'Accessori per Animali: 15 Trovate Uniche Sotto i 30€',
    },
    metaDesc: {
      en: '15 unique pet accessories under €30 — from interactive treat puzzles and GPS trackers to pet strollers and self-cleaning litter boxes. Discover AliExpress\'s best pet finds.',
      he: '15 אביזרים ייחודיים לחיות מחמד בפחות מ-₪120 — מפאזלים אינטראקטיביים ומעקבי GPS ועד עגלות כלבים וארגזי חול מתנקים עצמית. גלו את המוצרים הטובים ביותר באליאקספרס.',
      fr: '15 accessoires uniques pour animaux à moins de 30€ — puzzles interactifs, traceurs GPS, poussettes et litières auto-nettoyantes.',
      de: '15 einzigartige Haustier-Zubehörteile unter 30€ — interaktive Puzzles, GPS-Tracker, Kinderwagen und selbstreinigende Katzenklos.',
      es: '15 accesorios únicos para mascotas por menos de 30€ — rompecabezas interactivos, rastreadores GPS, carriolas y areneros autolimpiables.',
      it: '15 accessori unici per animali sotto 30€ — puzzle interattivi, tracker GPS, passeggini e lettiere autopulenti.',
    },
    intro: {
      en: 'You already know the basics — leash, bowl, bed. But the pet accessory market on AliExpress is full of clever, unique finds that solve real problems you didn\'t know you had. From interactive treat puzzles that challenge your dog\'s mind to pet strollers for senior cats, here are 15 standout pet accessories under €30 that go beyond the basics.',
      he: 'אתם כבר מכירים את הבסיס — רצועה, קערה, מיטה. אבל שוק אביזרי חיות המחמד באליאקספרס מלא במוצרים חכמים וייחודיים שפותרים בעיות אמיתיות שלא ידעתם שיש לכם. מפאזלים אינטראקטיביים שמאתגרים את המוח של הכלב ועד עגלות לחתולים מבוגרים, הנה 15 אביזרים ייחודיים בפחות מ-₪120 שחורגים מהבסיס.',
      fr: 'Vous connaissez les basiques — laisse, gamelle, panier. Mais le marché des accessoires pour animaux sur AliExpress regorge de trouvailles uniques.',
      de: 'Sie kennen die Basics — Leine, Napf, Bett. Aber der Markt für Haustierzubehör auf AliExpress ist voller cleverer, einzigartiger Funde.',
      es: 'Ya conoces lo básico — correa, plato, cama. Pero el mercado de accesorios para mascotas en AliExpress está lleno de hallazgos únicos.',
      it: 'Conosci le basi — guinzaglio, ciotola, cuccia. Ma il mercato degli accessori per animali su AliExpress è pieno di tesori unici.',
    },
    sections: [
      { heading: { en: 'Smart & Interactive Toys', he: 'צעצועים חכמים ואינטראקטיביים' }, body: { en: 'Interactive treat puzzles challenge your dog\'s problem-solving skills and prevent boredom. A snuffle mat ($5-10) mimics foraging in grass — great for dogs that eat too fast. Treat-dispensing balls ($3-8) release kibble as your dog rolls them. A flirt pole ($8-15) is the ultimate exercise toy: a long pole with a toy on a string that triggers the prey drive. For cats, an automatic laser toy ($10-18) keeps them active when you\'re not home. A cat tunnel with crinkle material ($8-12) satisfies hiding and pouncing instincts.', he: 'פאזלי פינוקים אינטראקטיביים מאתגרים את כישורי פתרון הבעיות של הכלב ומונעים שעמום. משטח sniffing ($5-10) מחקה חיפוש אוכל בדשא — מעולה לכלבים שאוכלים מהר מדי. כדורים מפזרי פינוקים ($3-8) משחררים אוכל כשהכלב מגלגל אותם.' } },
      { heading: { en: 'Health & Wellness Tech', he: 'טכנולוגיית בריאות ורווחה' }, body: { en: 'GPS trackers for pets ($15-25) attach to the collar and let you track your dog or cat via your phone. They work within a 1-5km radius — perfect for outdoor cats or escape artists. A pet activity tracker ($10-20) monitors steps, sleep, and calories, just like a Fitbit for your dog. An orthopedic memory foam bed ($12-25) with a washable cover supports aging joints — especially important for senior dogs with arthritis. A pet heating pad ($8-15) provides soothing warmth for sore muscles or anxious pets.', he: 'מעקבי GPS לחיות מחמד ($15-25) מתחברים לקולר ומאפשרים לעקוב אחר הכלב או החתול דרך הטלפון. הם עובדים בטווח 1-5 ק\"מ — מושלם לחתולים שיוצאים החוצה או כלבים שבורחים.' } },
      { heading: { en: 'Travel & Outdoor Gear', he: 'ציוד טיולים וחוץ' }, body: { en: 'A pet stroller ($20-30) is a game-changer for senior dogs, small breeds, or cats that enjoy walks but can\'t keep up. The best ones have a removable carrier, mesh windows, and a rain cover. A pet car seat cover ($8-15) protects your seats from mud, fur, and scratches — a must for any dog owner. A collapsible travel bowl set ($3-7) with a carry pouch means you always have water on walks. A pet life jacket ($10-20) with a handle is essential for boating, swimming, or beach trips — it helps your dog float and gives you a grab handle.', he: 'עגלת כלבים ($20-30) משנה חיים עבור כלבים מבוגרים, גזעים קטנים או חתולים שנהנים מטיולים אבל לא מסוגלים להמשיך. לאלו הטובות יש מנשא נשלף, חלונות רשת וכיסוי גשם.' } },
      { heading: { en: 'Grooming & Home Solutions', he: 'פתרונות טיפוח ובית' }, body: { en: 'A self-cleaning litter box ($18-28) automatically sifts waste after your cat uses it. The best budget versions use a rolling mechanism rather than rakes. A pet hair remover roller ($3-8) with reusable adhesive sheets saves your furniture. A deshedding glove ($4-10) removes loose fur while petting. A nail grinder ($8-15) with a safety guard is quieter and safer than clippers. A pet drying bag ($10-18) — a mesh bag with a hole for the head — lets you dry your wet dog with a hairdryer hands-free. A no-pull harness with front clip ($8-15) gently redirects dogs that pull on walks.', he: 'ארגז חול מתנקה עצמית ($18-28) מסנן אוטומטית פסולת אחרי שהחתול משתמש בו. הגרסאות התקציביות הטובות ביותר משתמשות במנגנון גלגול במקום מגרפות.' } },
    ],
    faq: [
      { q: { en: 'Are pet strollers really necessary?', he: 'האם עגלות כלבים באמת נחוצות?' }, a: { en: 'For healthy young dogs, probably not. But for senior dogs with arthritis, small breeds that tire easily, cats that enjoy outdoor time, or post-surgery recovery, they\'re invaluable. They also let you bring your pet to places where walking is restricted (malls, markets).', he: 'לכלבים צעירים בריאים, כנראה שלא. אבל לכלבים מבוגרים עם דלקת פרקים, גזעים קטנים שמתעייפים מהר, חתולים שנהנים מחוץ, או החלמה מניתוח — הם יקרי ערך.' } },
      { q: { en: 'Do GPS pet trackers require a subscription?', he: 'האם מעקבי GPS דורשים מנוי?' }, a: { en: 'Budget AliExpress trackers use Bluetooth or LoRa (no subscription) but have limited range (1-5km). Cellular GPS trackers need a SIM card and data plan ($5-10/month). Tractive and Fi are the premium options with subscriptions. For most owners, a Bluetooth tracker within 1km is sufficient for daily walks.', he: 'מעקבים תקציביים מאליאקספרס משתמשים ב-Bluetooth או LoRa (ללא מנוי) אבל טווח מוגבל (1-5 ק\"מ). מעקבי GPS סלולריים צריכים כרטיס SIM ותוכנית נתונים ($5-10 לחודש).' } },
    ],
    keywords: ['pet accessories unique', 'pet gadgets aliexpress', 'dog accessories budget', 'cat accessories under 30', 'pet stroller small dog', 'gps tracker for pets', 'self cleaning litter box', 'interactive dog toys'],
    relatedProducts: [
      { name: 'Pet Stroller', keyword: 'pet stroller small dog cat' },
      { name: 'GPS Tracker', keyword: 'pet gps tracker no subscription' },
      { name: 'Self-Cleaning Litter Box', keyword: 'self cleaning litter box automatic' },
      { name: 'Interactive Treat Puzzle', keyword: 'dog treat puzzle interactive' },
      { name: 'Pet Life Jacket', keyword: 'dog life jacket buoyancy' },
    ],
    publishDate: '2026-07-17',
    category: 'buying-guide',
  },
  {
    slug: 'aliexpress-israel-customs-vat',
    regions: ['il'],
    title: {
      he: 'מכס ומע"מ על אליאקספרס: כמה באמת תשלמו (עדכון אוגוסט 2026)',
      en: 'AliExpress Import Tax in Israel: What You Actually Pay (August 2026)',
    },
    metaDesc: {
      he: 'הפטור חזר ל-75$ ב-2 ביוני 2026. מה פטור, מתי נכנס מע"מ 18%, ולמה החישוב של רשות המסים שונה מזה שבעגלה. כולל דוגמאות מספריות.',
      en: 'Israel restored the $75 exemption on 2 June 2026. What is exempt, when 18% VAT applies, and why the tax authority does the sum differently than your cart does.',
    },
    intro: {
      he: 'רוב האנשים שמוותרים על הזמנה מאליאקספרס עושים את זה כי הם לא בטוחים כמה יעלה המכס. התשובה הקצרה: מתחת ל-75 דולר שווי סחורה — לא תשלמו כלום. מעל זה — 18% מע"מ, ולא מכס. הבעיה היא שהסכום שממנו סופרים את ה-75$ והסכום שעליו גובים את המע"מ הם שני סכומים שונים, וזה בדיוק המקום שבו אנשים מופתעים.',
      en: 'Most people who abandon an AliExpress cart do it because they cannot tell what the tax will be. Short answer: under $75 of goods, nothing. Above it, 18% VAT and no customs duty. The catch is that the figure used to test the $75 threshold and the figure the VAT is charged on are two different numbers — which is exactly where the surprises come from.',
    },
    sections: [
      {
        heading: { he: 'המצב נכון לאוגוסט 2026', en: 'Where the rules stand in August 2026' },
        body: {
          he: 'הסף עלה ל-150$ בתחילת 2026 ואז הוחזר ל-75$ ב-2 ביוני 2026. כלומר: חבילות בשווי 75$–130$ שהיו פטורות לגמרי בחודשים שלפני כן חייבות היום ב-18% מע"מ. אם ראיתם מדריך שמדבר על 150$ — הוא לא מעודכן. הסף השתנה פעמיים בשנה אחת, אז לפני הזמנה גדולה שווה לוודא באתר רשות המסים.',
          en: 'The threshold rose to $150 in early 2026 and was put back to $75 on 2 June 2026. Parcels worth $75–$130, fully exempt for the months in between, now carry 18% VAT. Any guide still quoting $150 is out of date — the figure moved twice in one year, so check the Tax Authority site before a large order.',
        },
      },
      {
        heading: { he: 'שלוש המדרגות', en: 'The three brackets' },
        body: {
          he: 'עד 75$ שווי סחורה: פטור מלא — בלי מע"מ, בלי מכס, בלי מס קנייה. מ-75$ עד 500$: מכס לא נגבה, אבל מע"מ 18% כן, ובתוספת מס קנייה אם המוצר חייב בו. מעל 500$: נכנסים גם מכס וגם מס קנייה לפי סיווג המוצר, וזה כבר תלוי מאוד במה קניתם. רוב הזמנות אליאקספרס נופלות במדרגה הראשונה או השנייה.',
          en: 'Up to $75 of goods: fully exempt — no VAT, no duty, no purchase tax. From $75 to $500: no customs duty, but 18% VAT applies, plus purchase tax on the categories that carry it. Above $500: customs duty and purchase tax both enter, at rates that depend on how the item is classified. Most AliExpress orders sit in the first two brackets.',
        },
      },
      {
        heading: { he: 'הפרט שמפתיע: שני סכומים שונים', en: 'The detail that catches people out' },
        body: {
          he: 'כדי לבדוק אם עברתם את ה-75$ סופרים רק את שווי הסחורה — בלי משלוח ובלי ביטוח. אבל ברגע שעברתם, המע"מ מחושב על ה-CIF: סחורה + משלוח + ביטוח. הזמנה של 72$ עם משלוח 10$ נשארת פטורה. הזמנה של 78$ עם אותו משלוח חייבת ב-18% על 88$, כלומר בערך 15.8$ — קפיצה של כמעט 16 דולר על הפרש של 6 דולר במחיר המוצר. אם אתם קרובים לסף, לפצל להזמנות נפרדות זה לרוב זול יותר.',
          en: 'The $75 test looks only at the goods — shipping and insurance are excluded. Once you cross it, VAT is charged on the CIF value: goods plus shipping plus insurance. A $72 order with $10 shipping stays exempt. A $78 order with the same shipping is taxed 18% on $88, about $15.80 — nearly sixteen dollars triggered by a six-dollar difference in item price. Near the line, splitting into separate orders is usually cheaper.',
        },
      },
      {
        heading: { he: 'איך זה נגבה בפועל', en: 'How it actually gets collected' },
        body: {
          he: 'על חבילות קטנות אליאקספרס בדרך כלל גובה את המע"מ בקופה ומעביר אותו — במקרה כזה החבילה מגיעה בלי דרישת תשלום נוספת. אם המע"מ לא נגבה מראש, חברת השילוח או דואר ישראל יגבו אותו לפני המסירה, בתוספת דמי טיפול. שווה להסתכל בעמוד התשלום: אם כתוב שם "VAT" או "מע"מ" בשורה נפרדת, כבר שילמתם ולא אמורה להגיע דרישה שנייה.',
          en: 'On small parcels AliExpress usually collects the VAT at checkout and remits it, so the package arrives with nothing further to pay. Where it is not collected upfront, the courier or Israel Post collects it before delivery and adds a handling fee. Check the payment page: if VAT appears as its own line, you have already paid it and no second demand should follow.',
        },
      },
      {
        heading: { he: 'טעויות שעולות כסף', en: 'Mistakes that cost money' },
        body: {
          he: 'לבקש מהמוכר להצהיר על ערך נמוך יותר זה הצהרה כוזבת — החבילה עלולה להיתפס, והביטוח לא יכסה אובדן מעבר לערך שהוצהר. לצרף כמה פריטים למשלוח אחד עלול לדחוף אתכם מעל הסף בלי שהתכוונתם. ומוצרים מסוימים חייבים באישור רגולטורי בלי קשר למחיר — מכשירי חשמל עם תקע, ציוד סלולרי ומוצרי תינוקות הם הקטגוריות שנתקעות הכי הרבה.',
          en: 'Asking a seller to under-declare is a false declaration: the parcel can be seized, and insurance will not cover a loss beyond the declared value. Consolidating items into one shipment can push you over the threshold unintentionally. And some goods need regulatory approval regardless of price — mains-powered electronics, cellular equipment and baby products are the categories that get held most often.',
        },
      },
    ],
    faq: [
      {
        q: { he: 'האם המשלוח נספר לתוך ה-75 דולר?', en: 'Does shipping count toward the $75?' },
        a: {
          he: 'לא לצורך הפטור — הסף נבדק על שווי הסחורה בלבד. אבל אם עברתם את הסף, המע"מ כן מחושב על הסחורה יחד עם המשלוח והביטוח.',
          en: 'Not for the exemption — the threshold is tested on the goods alone. But once you are over it, the VAT is calculated on the goods together with shipping and insurance.',
        },
      },
      {
        q: { he: 'שתי הזמנות נפרדות באותו יום — זה נחשב לאחת?', en: 'Do two separate orders on the same day count as one?' },
        a: {
          he: 'כל משלוח נבדק בנפרד. אבל אם שתי הזמנות מגיעות מאותו מוכר באותה חבילה פיזית, הן משלוח אחד לכל דבר. אם אתם מפצלים בכוונה, ודאו שהמוכר לא מאחד אותן.',
          en: 'Each shipment is assessed on its own. But if two orders arrive from the same seller in one physical parcel, that is a single shipment. If you are splitting deliberately, make sure the seller does not consolidate them.',
        },
      },
      {
        q: { he: 'מה קורה אם החבילה מגיעה פגומה אחרי ששילמתי מע"מ?', en: 'What if the parcel arrives damaged after I have paid VAT?' },
        a: {
          he: 'החזר מהמוכר דרך אליאקספרס והחזר מס הם שני מסלולים נפרדים. את המע"מ מבקשים חזרה מרשות המסים עם אסמכתאות, וזה תהליך שלוקח זמן — סיבה טובה להישאר מתחת לסף כשאפשר.',
          en: 'A seller refund through AliExpress and a tax refund are two separate processes. VAT is reclaimed from the Tax Authority with documentation, and it takes time — a good reason to stay under the threshold where you can.',
        },
      },
      {
        q: { he: 'הפטור עוד ישתנה?', en: 'Will the threshold change again?' },
        a: {
          he: 'ייתכן. הוא עלה ל-150$ ואז ירד חזרה ל-75$ בתוך חצי שנה, בלחץ של קמעונאים מקומיים. המספרים כאן נכונים לאוגוסט 2026 — לפני הזמנה גדולה בדקו באתר רשות המסים.',
          en: 'Possibly. It went to $150 and back to $75 inside six months under pressure from local retailers. The figures here are current as of August 2026 — check the Tax Authority site before a large order.',
        },
      },
    ],
    keywords: ['מכס אליאקספרס', 'מע"מ אליאקספרס', 'יבוא אישי פטור 75 דולר', 'כמה מכס משלמים על חבילה', 'aliexpress israel customs', 'israel import vat threshold'],
    relatedProducts: [
      { name: 'Under $75 Picks', keyword: 'best value gadgets under 20' },
      { name: 'Phone Accessories', keyword: 'phone accessories bundle' },
      { name: 'Home Gadgets', keyword: 'home gadgets useful' },
    ],
    publishDate: '2026-08-08',
    category: 'tips',
  },
  {
    slug: 'desk-wellness-setup-guide',
    title: {
      he: 'שדרוג עמדת העבודה: מה באמת משנה תחושה אחרי 8 שעות',
      en: 'Desk Wellness: What Actually Changes How You Feel After Eight Hours',
      fr: 'Bien-être au Bureau : Ce Qui Change Vraiment Après Huit Heures',
      de: 'Schreibtisch-Ergonomie: Was nach acht Stunden wirklich zählt',
      es: 'Bienestar en el Escritorio: Lo Que de Verdad Cambia Tras Ocho Horas',
      it: 'Benessere alla Scrivania: Cosa Cambia Davvero Dopo Otto Ore',
    },
    metaDesc: {
      he: 'לא צריך כיסא ב-3000 ש"ח. סדר העדיפויות האמיתי לעמדת עבודה — גובה מסך, תמיכה למרפקים, ותאורה — ומה עולה כמה.',
      en: 'You do not need a $900 chair. The real priority order for a desk setup — screen height, forearm support, lighting — and what each part costs.',
      fr: 'Pas besoin d\'un fauteuil à 900€. Le vrai ordre de priorité pour un poste de travail et ce que coûte chaque élément.',
      de: 'Sie brauchen keinen 900-Euro-Stuhl. Die echte Prioritätenfolge für den Arbeitsplatz — und was jedes Teil kostet.',
      es: 'No necesitas una silla de 900€. El orden de prioridad real para tu puesto de trabajo y cuánto cuesta cada pieza.',
      it: 'Non serve una sedia da 900€. Il vero ordine di priorità per la postazione e quanto costa ogni pezzo.',
    },
    intro: {
      he: 'הכאב בסוף יום עבודה כמעט תמיד מגיע משלושה דברים: מסך נמוך מדי, מרפקים בלי תמיכה, ומסך בהיר בחדר חשוך. כיסא יקר לא מתקן אף אחד מהם. הנה סדר העדיפויות לפי כמה שקל שהשקעתם באמת משנה תחושה.',
      en: 'End-of-day aches almost always trace to three things: a screen that sits too low, forearms with nothing under them, and a bright display in a dark room. An expensive chair fixes none of them. Here is the priority order, ranked by how much each dollar actually changes how you feel.',
      fr: 'Les douleurs de fin de journée viennent presque toujours de trois choses : un écran trop bas, des avant-bras sans appui et un écran lumineux dans une pièce sombre.',
      de: 'Beschwerden am Abend haben fast immer drei Ursachen: ein zu tiefer Bildschirm, Unterarme ohne Auflage und ein heller Monitor im dunklen Raum.',
      es: 'Los dolores al final del día casi siempre vienen de tres cosas: una pantalla demasiado baja, antebrazos sin apoyo y un monitor brillante en una habitación oscura.',
      it: 'I dolori di fine giornata derivano quasi sempre da tre cose: schermo troppo basso, avambracci senza appoggio e monitor luminoso in una stanza buia.',
    },
    sections: [
      {
        heading: { he: '1. גובה המסך — התיקון הזול ביותר', en: '1. Screen height — the cheapest fix there is' },
        body: {
          he: 'השורה העליונה של המסך צריכה להיות בגובה העיניים או מעט מתחת. אם אתם מסתכלים למטה, הצוואר נושא את משקל הראש בזווית כל היום. זרוע מסך עם מלחציים ($12-25) פותרת את זה ומשחררת את השולחן; מעמד פשוט ($6-12) עושה את אותה עבודה בגובה קבוע. על לפטופ זה קריטי במיוחד — מעמד לפטופ ($8-15) בתוספת מקלדת ועכבר חיצוניים הוא ההבדל בין עמדה זמנית לעמדה שאפשר לעבוד בה.',
          en: 'The top line of the screen should sit at eye level or just below. Looking down means your neck holds the weight of your head at an angle all day. A clamp monitor arm ($12-25) fixes it and frees the desk; a fixed riser ($6-12) does the same job without the adjustability. On a laptop it matters most — a stand ($8-15) plus an external keyboard and mouse is the difference between a temporary perch and a workstation.',
        },
      },
      {
        heading: { he: '2. תמיכה למרפקים ולפרקי כף היד', en: '2. Support for forearms and wrists' },
        body: {
          he: 'כשהמרפקים תלויים באוויר, הכתפיים עובדות כל היום. תמיכת מרפק שמתחברת לקצה השולחן ($10-20) מעבירה את העומס מהכתף לשולחן. משענת ג\'ל למקלדת ($4-8) עוזרת רק אם היא בגובה של המקשים — משענת גבוהה מדי מכופפת את פרק כף היד למעלה ומחמירה את המצב. אם אתם מקלידים הרבה, מקלדת נמוכה עדיפה על משענת עבה.',
          en: 'Forearms hanging in the air mean the shoulders carry them all day. A clamp-on forearm support ($10-20) moves that load from your shoulder to the desk. A gel wrist rest ($4-8) helps only if it sits level with the key tops — one that is too tall bends the wrist upward and makes things worse. If you type a lot, a low-profile keyboard beats a thick rest.',
        },
      },
      {
        heading: { he: '3. תאורה — מה שרוב האנשים מדלגים עליו', en: '3. Lighting — the part most people skip' },
        body: {
          he: 'מסך בהיר בחדר חשוך מכריח את האישונים להתאים את עצמם בכל פעם שאתם מסיטים מבט. מנורת בר מעל המסך ($15-30) מאירה את השולחן בלי להחזיר בוהק, וזה ההבדל היחיד שרוב האנשים מרגישים באותו ערב. תאורת הטיה מאחורי המסך ($8-15) מקטינה את הניגודיות בין המסך לקיר. אור לבן-ניטרלי (4000K בערך) נוח יותר לעבודה מאור צהוב חם.',
          en: 'A bright display in a dark room forces your pupils to readjust every time you glance away. A monitor light bar ($15-30) lights the desk without throwing glare back, and it is the one change most people notice the same evening. Bias lighting behind the screen ($8-15) cuts the contrast between display and wall. Neutral white, around 4000K, is easier to work under than warm yellow.',
        },
      },
      {
        heading: { he: '4. הרגליים והישיבה', en: '4. Feet and seating' },
        body: {
          he: 'אם הרגליים לא מגיעות לרצפה בנוחות, הלחץ עובר לירכיים. הדום רגליים ($10-20) עולה הרבה פחות מכיסא חדש ופותר את זה. כרית ישיבה מקצף זיכרון ($12-25) משפרת כיסא בינוני יותר משדרוג לכיסא בינוני אחר. תמיכה מותנית ($8-18) עובדת רק אם היא בגובה הנכון — מתחת לצלעות, לא באמצע הגב.',
          en: 'If your feet do not reach the floor comfortably, the pressure moves to your thighs. A footrest ($10-20) costs far less than a new chair and solves it. A memory-foam seat cushion ($12-25) improves a mediocre chair more than swapping it for another mediocre chair. A lumbar support ($8-18) only works at the right height — under the ribs, not mid-back.',
        },
      },
      {
        heading: { he: 'מה לא לקנות קודם', en: 'What not to buy first' },
        body: {
          he: 'שולחן עמידה חשמלי הוא לרוב הפריט הראשון שאנשים קונים והאחרון שהיה צריך. אם המסך בגובה לא נכון, הוא יישאר בגובה לא נכון גם בעמידה. אותו דבר לגבי כיסא גיימינג — הגב הגבוה נראה תומך אבל רוב הדגמים הזולים עם ריפוד קשה. תקנו קודם את הגובה, התמיכה והאור, ואז תחליטו אם עוד חסר משהו.',
          en: 'A powered standing desk is usually the first thing people buy and the last thing they needed. If the screen is at the wrong height, it stays at the wrong height standing up. Same for a gaming chair — the tall back looks supportive, but the cheap models are firm foam in a racing shape. Fix height, support and light first, then decide whether anything is still missing.',
        },
      },
    ],
    faq: [
      {
        q: { he: 'האם מקלדת ארגונומית מפוצלת שווה את זה?', en: 'Is a split ergonomic keyboard worth it?' },
        a: {
          he: 'אם יש כאב בפרק כף היד — כן, היא משנה את זווית האמה. אם אין כאב, ההסתגלות לוקחת שבוע-שבועיים של הקלדה איטית ולא בטוח שתרוויחו. תתחילו ממקלדת נמוכה ומעמד למסך.',
          en: 'If you have wrist pain, yes — it changes the forearm angle. Without pain, expect a week or two of slower typing while you adapt, for a benefit you may not notice. Start with a low-profile keyboard and a screen riser.',
        },
      },
      {
        q: { he: 'זרוע מסך תחזיק מסך 27 אינץ\'?', en: 'Will a monitor arm hold a 27-inch display?' },
        a: {
          he: 'רוב הזרועות הזולות מדורגות ל-8 ק"ג ומחזיקות 27 אינץ\' בלי בעיה. שני דברים לבדוק: עובי משטח השולחן (המלחציים לרוב עד 8 ס"מ) ותקן VESA — 100x100 הוא הנפוץ, אבל חלק מהמסכים דורשים מתאם.',
          en: 'Most budget arms are rated to 8 kg and hold a 27-inch fine. Two things to check: your desktop thickness (clamps usually top out around 8 cm) and the VESA pattern — 100x100 is common, but some monitors need an adapter plate.',
        },
      },
      {
        q: { he: 'כמה זה עולה בסך הכל?', en: 'What does the whole thing cost?' },
        a: {
          he: 'מעמד או זרוע למסך, תמיכת מרפק, מנורת בר והדום רגליים יוצאים בערך 50-80$ ביחד. זה פחות מכיסא משרדי בינוני, ומטפל בסיבות עצמן ולא בתסמינים.',
          en: 'A riser or arm, a forearm support, a light bar and a footrest come to roughly $50-80 together. That is less than one mid-range office chair, and it addresses the causes rather than the symptoms.',
        },
      },
    ],
    keywords: ['desk setup ergonomic budget', 'monitor light bar worth it', 'monitor arm cheap', 'forearm support desk', 'עמדת עבודה ארגונומית', 'מנורת מסך'],
    relatedProducts: [
      { name: 'Monitor Arm', keyword: 'monitor arm desk mount gas spring' },
      { name: 'Monitor Light Bar', keyword: 'monitor light bar screen lamp' },
      { name: 'Forearm Support', keyword: 'forearm support desk clamp' },
      { name: 'Footrest', keyword: 'under desk footrest ergonomic' },
      { name: 'Laptop Stand', keyword: 'laptop stand aluminum adjustable' },
    ],
    publishDate: '2026-08-08',
    category: 'buying-guide',
  },
  {
    slug: 'home-bar-starter-kit',
    title: {
      he: 'בר ביתי מאפס: מה קונים קודם ומה אפשר לדלג עליו',
      en: 'Building a Home Bar From Scratch: What to Buy First, What to Skip',
      fr: 'Créer un Bar à la Maison : Quoi Acheter en Premier',
      de: 'Hausbar von Grund auf: Was zuerst kaufen, was weglassen',
      es: 'Montar un Bar en Casa: Qué Comprar Primero y Qué Saltarte',
      it: 'Bar di Casa da Zero: Cosa Comprare Prima e Cosa Saltare',
    },
    metaDesc: {
      he: 'ארבעה כלים מכסים כמעט כל קוקטייל קלאסי. מה באמת צריך, למה שייקר בוסטון עדיף על קוברלר, ואיזה גאדג\'טים רק תופסים מקום.',
      en: 'Four tools cover nearly every classic cocktail. What you actually need, why a Boston shaker beats a cobbler, and which gadgets just take up space.',
      fr: 'Quatre outils couvrent presque tous les classiques. Ce qu\'il faut vraiment et ce qui prend juste de la place.',
      de: 'Vier Werkzeuge decken fast jeden Klassiker ab. Was Sie wirklich brauchen und was nur Platz wegnimmt.',
      es: 'Cuatro herramientas cubren casi todos los clásicos. Lo que de verdad necesitas y lo que solo ocupa sitio.',
      it: 'Quattro strumenti coprono quasi tutti i classici. Cosa serve davvero e cosa occupa solo spazio.',
    },
    intro: {
      he: 'סטים של בר ב-24 חלקים נראים מרשימים ורובם נשארים בקופסה. כמעט כל קוקטייל קלאסי דורש ארבעה כלים: משהו לנער בו, משהו למדוד בו, משהו לסנן דרכו וכף ערבוב. הנה מה שכדאי לקנות, ולמה.',
      en: 'Twenty-four-piece bar sets look impressive and mostly stay in the box. Nearly every classic cocktail needs four tools: something to shake in, something to measure with, something to strain through, and a bar spoon. Here is what to buy, and why.',
      fr: 'Les coffrets de 24 pièces impressionnent et restent dans leur boîte. Presque tous les classiques demandent quatre outils.',
      de: '24-teilige Barsets sehen beeindruckend aus und bleiben meist in der Schachtel. Fast jeder Klassiker braucht vier Werkzeuge.',
      es: 'Los sets de 24 piezas impresionan y se quedan en la caja. Casi todos los clásicos necesitan cuatro herramientas.',
      it: 'I set da 24 pezzi fanno scena e restano nella scatola. Quasi tutti i classici richiedono quattro strumenti.',
    },
    sections: [
      {
        heading: { he: 'שייקר: בוסטון, לא קוברלר', en: 'The shaker: Boston, not cobbler' },
        body: {
          he: 'שייקר קוברלר (שלושה חלקים עם מסננת מובנית) הוא מה שרוב הסטים כוללים, והמכסה שלו נתקע כשהמתכת מתקררת. שייקר בוסטון — כוס מתכת 800 מ"ל וכוס קטנה 500 מ"ל — נאטם בדפיקה ונפתח בדפיקה, וזה מה שמשתמשים בו בברים. עולה 8-18$. אם אתם קונים דבר אחד מהרשימה, זה הדבר.',
          en: 'A cobbler shaker — three parts with a built-in strainer — is what most sets include, and its cap seizes as the metal chills. A Boston shaker, an 800 ml tin and a 500 ml tin, seals with a tap and opens with a tap, and it is what bars actually use. $8-18. If you buy one thing off this list, buy this.',
        },
      },
      {
        heading: { he: 'ג\'יגר: המדידה היא כל ההבדל', en: 'The jigger: measuring is the whole difference' },
        body: {
          he: 'קוקטייל הוא יחס. מזיגה בעין משנה את היחס בכל פעם, וזו הסיבה שאותו מתכון יוצא שונה בכל ערב. ג\'יגר יפני עם סימוני מדידה פנימיים ($4-9) נותן 15, 20, 30 ו-45 מ"ל באותו כלי. הימנעו מג\'יגר חלק בלי סימונים — הוא רק שני נפחים.',
          en: 'A cocktail is a ratio. Free-pouring changes the ratio every time, which is why the same recipe tastes different each evening. A Japanese jigger with internal graduations ($4-9) gives you 15, 20, 30 and 45 ml in one tool. Skip the smooth unmarked kind — it is only two volumes.',
        },
      },
      {
        heading: { he: 'מסננות: הוֹתוֹרן ומסננת דקה', en: 'Strainers: a Hawthorne and a fine mesh' },
        body: {
          he: 'מסננת הוֹתוֹרן ($3-7) — זו עם הקפיץ — יושבת על כוס השייקר ועוצרת קרח ופירות. למשקאות שמנוערים עם מיץ הדרים, סינון כפול דרך מסננת תה דקה ($2-5) מוציא רסיסי קרח ועסיס ונותן מרקם חלק. שתיהן ביחד עולות פחות מעשרה דולר ומשנות את התוצאה יותר מכל גאדג\'ט אחר.',
          en: 'A Hawthorne strainer ($3-7) — the one with the spring — sits on the shaking tin and holds back ice and fruit. For anything shaken with citrus, double-straining through a fine tea strainer ($2-5) removes ice shards and pulp and gives a clean texture. Both together cost under ten dollars and change the result more than any gadget.',
        },
      },
      {
        heading: { he: 'קרח: החלק שהכי מזלזלים בו', en: 'Ice: the most underrated part' },
        body: {
          he: 'קרח קטן נמס מהר ומדלל את המשקה תוך דקות. תבנית סיליקון לקוביות 5 ס"מ ($5-12) נותנת קובייה אחת גדולה לכוס אולד פאשנד, שמצננת באותה מידה ומדללת הרבה פחות. לקוקטיילים ארוכים, תבנית לקוביות מוארכות מתאימה לכוס גבוהה. זו ההשקעה הכי זולה שמשנה את הטעם.',
          en: 'Small ice melts fast and waters the drink down within minutes. A silicone mould for 5 cm cubes ($5-12) gives one large cube for an Old Fashioned glass — same chill, far less dilution. For long drinks, a collins-spear mould fits a highball. It is the cheapest change that alters how the drink tastes.',
        },
      },
      {
        heading: { he: 'מה אפשר לדלג עליו', en: 'What you can skip' },
        body: {
          he: 'מוֹדְלֶר מעץ מיותר — גב של כף ערבוב מועך נענע ולימון בדיוק אותו דבר, ועץ לא שרוד במדיח. סחטן הדרים חשמלי מיותר לשניים-שלושה משקאות. וסט של 24 חלקים כמעט תמיד מרכיב את החלקים החלשים: קוברלר, ג\'יגר בלי סימונים ומסננת רופפת. עדיף לקנות ארבעה פריטים טובים בנפרד.',
          en: 'A wooden muddler is unnecessary — the back of a bar spoon presses mint and citrus just as well, and wood does not survive a dishwasher. An electric citrus juicer is overkill for two or three drinks. And a 24-piece set almost always bundles the weak versions: a cobbler, an unmarked jigger, a loose strainer. Four good pieces bought separately beat it.',
        },
      },
    ],
    faq: [
      {
        q: { he: 'נערים או מערבבים?', en: 'Shake or stir?' },
        a: {
          he: 'הכלל הישן עובד: משקה שכולו אלכוהול (נגרוני, מנהטן, מרטיני) מערבבים; כל דבר עם מיץ, ביצה או שמנת מנערים. ניעור מכניס אוויר ומעכיר — נהדר למרגריטה, הרסני למרטיני.',
          en: 'The old rule holds: all-spirit drinks (Negroni, Manhattan, Martini) are stirred; anything with juice, egg or cream is shaken. Shaking aerates and clouds the drink — right for a Margarita, wrong for a Martini.',
        },
      },
      {
        q: { he: 'כמה עולה להתחיל?', en: 'What does it cost to start?' },
        a: {
          he: 'שייקר בוסטון, ג\'יגר מסומן, שתי מסננות, כף ערבוב ותבנית קרח יוצאים 25-45$ ביחד — פחות משני קוקטיילים בבר. הכוסות והאלכוהול הם ההוצאה האמיתית.',
          en: 'A Boston shaker, a graduated jigger, two strainers, a bar spoon and an ice mould come to $25-45 together — less than two cocktails out. The glassware and the spirits are the real expense.',
        },
      },
    ],
    keywords: ['home bar starter kit', 'boston shaker vs cobbler', 'japanese jigger', 'cocktail tools beginner', 'בר ביתי', 'ערכת קוקטיילים'],
    relatedProducts: [
      { name: 'Boston Shaker', keyword: 'boston shaker tin set stainless' },
      { name: 'Japanese Jigger', keyword: 'japanese jigger graduated 30ml' },
      { name: 'Hawthorne Strainer', keyword: 'hawthorne cocktail strainer' },
      { name: 'Ice Cube Mould', keyword: 'silicone ice cube mold large square' },
      { name: 'Bar Spoon', keyword: 'twisted bar spoon long stainless' },
    ],
    publishDate: '2026-08-08',
    category: 'buying-guide',
  },
  {
    slug: 'zero-waste-kitchen-swaps',
    title: {
      he: 'מטבח בלי חד-פעמי: ההחלפות שבאמת מחזיקות',
      en: 'Zero-Waste Kitchen: The Swaps That Actually Last',
      fr: 'Cuisine Zéro Déchet : Les Alternatives Qui Durent Vraiment',
      de: 'Zero-Waste-Küche: Die Alternativen, die wirklich halten',
      es: 'Cocina Sin Residuos: Los Cambios Que de Verdad Duran',
      it: 'Cucina Zero Rifiuti: I Cambi Che Durano Davvero',
    },
    metaDesc: {
      he: 'לא כל החלפה "ידידותית לסביבה" מחזיקה מעמד. מה שורד שימוש יומיומי, מה מתפרק אחרי חודש, ותוך כמה זמן זה מחזיר את עצמו.',
      en: 'Not every eco swap survives daily use. What holds up, what falls apart within a month, and how long each takes to pay for itself.',
      fr: 'Toutes les alternatives écologiques ne résistent pas. Ce qui tient, ce qui casse et en combien de temps c\'est rentabilisé.',
      de: 'Nicht jede Öko-Alternative übersteht den Alltag. Was hält, was nach einem Monat kaputtgeht und wann es sich rechnet.',
      es: 'No todo cambio ecológico aguanta el uso diario. Qué dura, qué se rompe en un mes y cuándo se amortiza.',
      it: 'Non ogni alternativa ecologica regge l\'uso quotidiano. Cosa dura, cosa si rompe e quando si ripaga.',
    },
    intro: {
      he: 'החלפה שנשברת אחרי חודש היא לא חיסכון ולא ידידותית לסביבה — היא סתם קנייה נוספת. המדריך הזה מפריד בין ההחלפות ששורדות שימוש יומיומי לבין אלה שנראות טוב בתמונה ומתפרקות במדיח.',
      en: 'A swap that breaks in a month is neither cheaper nor greener — it is just another purchase. This guide separates the swaps that survive daily use from the ones that photograph well and disintegrate in the dishwasher.',
      fr: 'Une alternative qui casse en un mois n\'est ni plus économique ni plus écologique. Voici celles qui tiennent vraiment.',
      de: 'Eine Alternative, die nach einem Monat kaputtgeht, ist weder günstiger noch grüner. Hier steht, was wirklich hält.',
      es: 'Un cambio que se rompe en un mes no es ni más barato ni más ecológico. Aquí están los que de verdad aguantan.',
      it: 'Un cambio che si rompe in un mese non è né più economico né più ecologico. Ecco quelli che reggono davvero.',
    },
    sections: [
      {
        heading: { he: 'מה שורד: סיליקון, נירוסטה, כותנה', en: 'What survives: silicone, stainless, cotton' },
        body: {
          he: 'שקיות סיליקון לשימוש חוזר ($3-8 ליחידה) נכנסות למקפיא, למדיח ולמיקרוגל ומחזיקות שנים — הן מחליפות שקיות ziplock בערך פי מאה. מכסי סיליקון נמתחים ($5-10 לסט) מכסים קערות בלי ניילון נצמד. מסננת תה מנירוסטה ($2-5) מחליפה שקיות תה לנצח. שקיות כותנה לירקות ($5-10 לסט) נכנסות לכביסה. כל אלה מחזירים את עצמם תוך חודשיים-שלושה של שימוש יומיומי.',
          en: 'Reusable silicone bags ($3-8 each) go in the freezer, the dishwasher and the microwave and last years — they replace roughly a hundred ziplock bags apiece. Stretch silicone lids ($5-10 a set) cover bowls without cling film. A stainless tea infuser ($2-5) replaces tea bags permanently. Cotton produce bags ($5-10 a set) go through the wash. All of these pay for themselves within two or three months of daily use.',
        },
      },
      {
        heading: { he: 'מה מתפרק: שעווה, במבוק בלח, ספוגים דקים', en: 'What falls apart: wax wraps, wet bamboo, thin sponges' },
        body: {
          he: 'מטליות שעוות דבורים מאבדות את ההידבקות אחרי כ-20 שטיפות, ולא נוגעים איתן בבשר נא. כלי במבוק שנשארים רטובים מפתחים כתמים שחורים תוך שבועות — במבוק דורש ייבוש בין שימושים, וזה לא מסתדר עם מדיח. ספוגי לוּפָה זולים מתפוררים אחרי כמה שבועות. אם קונים במבוק, קונים למה שנשאר יבש: כלי הגשה, לא כפות שיושבות בסיר.',
          en: 'Beeswax wraps lose their cling after about twenty washes, and you cannot use them on raw meat. Bamboo utensils left wet develop black staining within weeks — bamboo needs drying between uses, which does not fit a dishwasher routine. Cheap loofah sponges shed and crumble after a few weeks. If you buy bamboo, buy it for things that stay dry: serving pieces, not the spoon that sits in the pot.',
        },
      },
      {
        heading: { he: 'המקרר: איפה הפחת האמיתי', en: 'The fridge: where the real waste is' },
        body: {
          he: 'רוב הפחת במטבח הוא אוכל שנזרק, לא אריזות. מיכלי אחסון עם שסתום ואקום ($8-20 לסט) מאריכים חיי ירקות משמעותית. סופגי אתילן למגירת הפירות ($5-10) מאטים הבשלה. מיכלים שקופים עם תאריך פשוט עובדים כי רואים מה יש. שדרוג האחסון חוסך יותר כסף מכל החלפה של חד-פעמי.',
          en: 'Most kitchen waste is food thrown out, not packaging. Vacuum-valve storage containers ($8-20 a set) extend vegetable life noticeably. Ethylene absorbers in the crisper drawer ($5-10) slow ripening. Clear containers with a date on them work simply because you can see what is in there. Improving storage saves more money than any single-use swap.',
        },
      },
      {
        heading: { he: 'קפה ותה', en: 'Coffee and tea' },
        body: {
          he: 'קפסולה נטענת מנירוסטה ($6-15) מחליפה קפסולות אלומיניום, אבל דורשת טחינה נכונה ודפיקה — אם אתם לא מוכנים לכוונן, פילטר מתכת לפור-אובר ($5-12) פשוט יותר ומבטל נייר לגמרי. פילטר מתכת מעביר יותר שמנים, כלומר כוס עם יותר גוף ופחות נקייה מנייר. זה עניין של טעם, לא של איכות.',
          en: 'A refillable stainless capsule ($6-15) replaces aluminium pods, but needs the right grind and a proper tamp — if you are not up for dialling it in, a metal pour-over filter ($5-12) is simpler and eliminates paper entirely. A metal filter passes more oils, so the cup has more body and less of the clarity paper gives. That is a preference, not a quality difference.',
        },
      },
    ],
    faq: [
      {
        q: { he: 'שקיות סיליקון באמת בטוחות למקפיא ולמיקרוגל?', en: 'Are silicone bags really freezer and microwave safe?' },
        a: {
          he: 'סיליקון בדרגת מזון כן, בטווח של בערך -40°C עד 220°C. הנקודה לבדוק היא הסוגר: דגמים זולים עם סוגר פלסטיק נסדק בהקפאה. חפשו סוגר סיליקון או נירוסטה.',
          en: 'Food-grade silicone is, across roughly -40°C to 220°C. The part to check is the closure: cheap models with a plastic slider crack when frozen. Look for a silicone or stainless closure.',
        },
      },
      {
        q: { he: 'תוך כמה זמן זה מחזיר את עצמו?', en: 'How long until this pays for itself?' },
        a: {
          he: 'סט התחלתי — ארבע שקיות סיליקון, מכסים נמתחים, שקיות ירקות ומסננת תה — יוצא בערך 25-40$. מול שקיות חד-פעמיות, ניילון נצמד ושקיות תה, זה מתאזן תוך שלושה-ארבעה חודשים.',
          en: 'A starter set — four silicone bags, stretch lids, produce bags and a tea infuser — runs about $25-40. Against disposable bags, cling film and tea bags, it breaks even in three to four months.',
        },
      },
      {
        q: { he: 'איך מנקים שקית סיליקון שהריחה מהאוכל?', en: 'How do you clean a silicone bag that has taken on a smell?' },
        a: {
          he: 'סיליקון סופג ריחות של שום, קארי ובצל. משרים בסודה לשתייה וחומץ חצי שעה, ואז מייבשים בשמש — אור UV מפרק את מה שנשאר. מדיח לבד לרוב לא מספיק.',
          en: 'Silicone picks up garlic, curry and onion. Soak in baking soda and vinegar for half an hour, then dry in sunlight — UV breaks down what is left. A dishwasher cycle alone usually will not do it.',
        },
      },
    ],
    keywords: ['zero waste kitchen swaps', 'reusable silicone bags review', 'do beeswax wraps work', 'plastic free kitchen', 'מטבח ללא פלסטיק', 'שקיות סיליקון'],
    relatedProducts: [
      { name: 'Silicone Food Bags', keyword: 'reusable silicone food storage bags' },
      { name: 'Stretch Lids', keyword: 'silicone stretch lids set' },
      { name: 'Produce Bags', keyword: 'cotton mesh produce bags reusable' },
      { name: 'Vacuum Containers', keyword: 'vacuum seal food storage container set' },
      { name: 'Pour-Over Filter', keyword: 'stainless steel pour over coffee filter' },
    ],
    publishDate: '2026-08-08',
    category: 'buying-guide',
  },
  {
    slug: 'arduino-starter-kit-guide',
    title: {
      he: 'ערכת אלקטרוניקה ראשונה: מה שווה לקנות ומה סתם ממלא את הקופסה',
      en: 'Your First Electronics Kit: What Is Worth Buying, What Just Fills the Box',
      fr: 'Premier Kit Électronique : Ce Qui Vaut le Coup et Ce Qui Remplit la Boîte',
      de: 'Das erste Elektronik-Set: Was sich lohnt und was nur die Schachtel füllt',
      es: 'Tu Primer Kit de Electrónica: Qué Vale la Pena y Qué Solo Rellena la Caja',
      it: 'Il Primo Kit di Elettronica: Cosa Vale e Cosa Riempie Solo la Scatola',
    },
    metaDesc: {
      he: 'ESP32 או Uno? כמה חיישנים באמת צריך? מה מבדיל ערכה ב-15$ מערכה ב-50$, ואיזה חלקים תשתמשו בהם בפועל.',
      en: 'ESP32 or Uno? How many sensors do you actually need? What separates a $15 kit from a $50 one, and which parts you will genuinely use.',
      fr: 'ESP32 ou Uno ? Combien de capteurs faut-il vraiment ? Ce qui distingue un kit à 15$ d\'un kit à 50$.',
      de: 'ESP32 oder Uno? Wie viele Sensoren braucht man wirklich? Was ein 15-Dollar-Set von einem 50-Dollar-Set unterscheidet.',
      es: '¿ESP32 o Uno? ¿Cuántos sensores necesitas de verdad? Qué diferencia un kit de 15$ de uno de 50$.',
      it: 'ESP32 o Uno? Quanti sensori servono davvero? Cosa distingue un kit da 15$ da uno da 50$.',
    },
    intro: {
      he: 'ערכות "37 חיישנים" נראות כמו מציאה, ובפועל משתמשים בערך בשישה מהם. מה שקובע אם תסיימו פרויקט ראשון זה לא מספר החלקים אלא הלוח שבחרתם, איכות חוטי הגישור, ואם יש לכם ספק כוח יציב. הנה איך לבחור.',
      en: 'A "37 sensors" kit looks like a bargain, and in practice you use about six of them. What decides whether you finish a first project is not the part count — it is which board you picked, the quality of the jumper wires, and whether you have a stable power supply. Here is how to choose.',
      fr: 'Les kits « 37 capteurs » semblent avantageux ; en pratique on en utilise six. Ce qui compte, c\'est la carte, les fils et l\'alimentation.',
      de: '„37 Sensoren"-Sets wirken günstig; genutzt werden etwa sechs. Entscheidend sind Board, Jumper-Kabel und Stromversorgung.',
      es: 'Los kits de «37 sensores» parecen una ganga; en la práctica usas seis. Lo decisivo es la placa, los cables y la alimentación.',
      it: 'I kit «37 sensori» sembrano un affare; in pratica ne usi sei. Ciò che conta è la scheda, i cavi e l\'alimentazione.',
    },
    sections: [
      {
        heading: { he: 'הלוח: ESP32 כמעט תמיד', en: 'The board: ESP32, nearly always' },
        body: {
          he: 'Arduino Uno תואם ($4-8) הוא הקלאסיקה ויש לו הכי הרבה מדריכים. אבל ESP32 ($4-9) עולה אותו דבר ומגיע עם Wi-Fi ו-Bluetooth מובנים, יותר זיכרון ומעבד דו-ליבתי — כלומר הפרויקט השני שלכם יכול להיות מחובר לרשת בלי לקנות שום דבר נוסף. הוא עובד באותה סביבת Arduino IDE. הסיבה היחידה להתחיל ב-Uno היא אם אתם עוקבים אחרי קורס ספציפי שדורש אותו.',
          en: 'A compatible Arduino Uno ($4-8) is the classic and has the most tutorials. But an ESP32 ($4-9) costs the same and arrives with Wi-Fi and Bluetooth built in, more memory and a dual-core processor — meaning your second project can be networked without buying anything else. It runs in the same Arduino IDE. The one reason to start on a Uno is if you are following a course that requires it.',
        },
      },
      {
        heading: { he: 'החיישנים שבאמת בשימוש', en: 'The sensors people actually use' },
        body: {
          he: 'מתוך ערכת 37 החלקים, אלה שחוזרים בפרויקטים אמיתיים: DHT22 לטמפרטורה ולחות (מדויק יותר מ-DHT11 שנמצא בערכות הזולות), HC-SR04 למרחק אולטרסוני, PIR לגילוי תנועה, LDR לעוצמת אור, ומודול ממסר להפעלת מכשירי 220V. השאר — חיישן להבה, חיישן דופק, מקלדת ממברנה — כמעט אף פעם לא מגיעים לפרויקט שני.',
          en: 'Out of a 37-piece kit, these are the ones that recur in real projects: a DHT22 for temperature and humidity (more accurate than the DHT11 that ships in cheap kits), an HC-SR04 for ultrasonic distance, a PIR for motion, an LDR for light level, and a relay module for switching mains devices. The rest — flame sensor, pulse sensor, membrane keypad — rarely make it into a second project.',
        },
      },
      {
        heading: { he: 'איפה ערכות זולות חוסכות', en: 'Where cheap kits cut corners' },
        body: {
          he: 'חוטי גישור זולים הם הבעיה הכי נפוצה — הליבה נשברת בתוך הבידוד ומקבלים תקלה שנראית כמו באג בקוד. חוטים איכותיים ($3-6 ל-120 יחידות) חוסכים שעות. בעיה שנייה: לוח מטריצה עם קפיצים חלשים שלא מחזיקים רגלי רכיבים. שלישית: ספק כוח. הזנת מנועים או רצועת LED מיציאת ה-5V של הלוח מפילה אותו — ספק חיצוני ($3-8) פותר את זה.',
          en: 'Cheap jumper wires are the most common problem — the core snaps inside the insulation and you get a fault that looks exactly like a bug in your code. Decent wires ($3-6 for 120) save hours. Second: a breadboard with weak springs that will not grip component legs. Third: power. Driving motors or an LED strip from the board\'s 5V pin browns it out — an external supply ($3-8) fixes it.',
        },
      },
      {
        heading: { he: 'מה להוסיף אחרי הפרויקט הראשון', en: 'What to add after the first project' },
        body: {
          he: 'מולטימטר ($8-15) הוא הכלי שהופך ניחושים לבדיקה — בלעדיו מנפים תקלות בעיניים. מלחם עם בקרת טמפרטורה ($15-30) נדרש ברגע שרוצים משהו קבוע ולא על לוח מטריצה. וצג OLED קטן ב-I2C ($2-5) הופך כל פרויקט למשהו שאפשר להראות, כי רואים את הפלט בלי מחשב מחובר.',
          en: 'A multimeter ($8-15) is the tool that turns guessing into measuring — without one you debug by eye. A temperature-controlled soldering iron ($15-30) becomes necessary the moment you want something permanent rather than on a breadboard. And a small I2C OLED display ($2-5) makes any project demonstrable, because the output is visible with no computer attached.',
        },
      },
    ],
    faq: [
      {
        q: { he: 'ESP32 או Raspberry Pi?', en: 'ESP32 or Raspberry Pi?' },
        a: {
          he: 'הם לא מתחרים. ESP32 הוא מיקרו-בקר: מתעורר מיד, אוכל מעט חשמל, מריץ לולאה אחת אמינה — מושלם לחיישנים ולאוטומציה. Raspberry Pi הוא מחשב עם לינוקס — צריך אותו למצלמה, לשרת או לעיבוד וידאו. לפרויקט חיישנים ראשון, ESP32, ובעשירית המחיר.',
          en: 'They are not competitors. An ESP32 is a microcontroller: instant boot, tiny power draw, one reliable loop — ideal for sensors and automation. A Raspberry Pi is a Linux computer, which you need for a camera, a server or video processing. For a first sensor project, the ESP32, at a tenth of the price.',
        },
      },
      {
        q: { he: 'למה הלוח לא מזוהה במחשב?', en: 'Why is my board not detected?' },
        a: {
          he: 'כמעט תמיד אחת משתיים: כבל USB לטעינה בלבד בלי חוטי נתונים (תחליפו כבל), או שחסר דרייבר ל-CH340/CP2102 — השבב שלוחות תואמים משתמשים בו במקום ה-FTDI המקורי. את הדרייבר מתקינים ידנית והלוח מופיע מיד.',
          en: 'Almost always one of two things: a charge-only USB cable with no data lines (swap the cable), or a missing CH340/CP2102 driver — the chip compatible boards use instead of the original FTDI. Install the driver manually and the port appears immediately.',
        },
      },
      {
        q: { he: 'האם כדאי לקנות ערכה או חלקים בנפרד?', en: 'Kit or individual parts?' },
        a: {
          he: 'ערכה משתלמת בפעם הראשונה כי היא כוללת לוח מטריצה, נגדים, LEDים וחוטים במחיר שקשה להרכיב לבד. מהפרויקט השני והלאה עדיף לקנות ספציפית — תשלמו פחות ותקבלו רכיבים טובים יותר.',
          en: 'A kit is worth it the first time, because it bundles a breadboard, resistors, LEDs and wires for less than assembling them separately. From the second project on, buy specifically — you pay less and get better parts.',
        },
      },
    ],
    keywords: ['arduino starter kit beginner', 'esp32 vs arduino uno', 'best sensors arduino kit', 'electronics kit worth buying', 'ערכת ארדואינו', 'ESP32 למתחילים'],
    relatedProducts: [
      { name: 'ESP32 Board', keyword: 'esp32 development board wifi bluetooth' },
      { name: 'Sensor Kit', keyword: 'arduino sensor kit dht22 ultrasonic' },
      { name: 'Jumper Wires', keyword: 'dupont jumper wires 120pcs' },
      { name: 'Breadboard', keyword: 'solderless breadboard 830 tie points' },
      { name: 'OLED Display', keyword: 'oled display i2c 0.96 inch' },
    ],
    publishDate: '2026-08-08',
    category: 'buying-guide',
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
