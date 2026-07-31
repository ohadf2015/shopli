export interface CollectionDef {
  slug: string;
  keywords?: string[];
  name?: Record<string, string>;
  desc?: Record<string, string>;
  icon?: string;
  affiliateKeywords?: string[];
  tag?: Record<string, string>;
  metaTitle?: Record<string, string>;
  metaDesc?: Record<string, string>;
  image?: string;
  googleCategory?: string;
  items?: Array<{ name: string; keyword: string; minPrice: number; maxPrice: number }>;
}

export const COLLECTIONS: CollectionDef[] = [
  {
    slug: 'halloween',
    keywords: ['halloween costume', 'cosplay wig', 'halloween accessories', 'halloween makeup'],
    name: { en: 'Halloween Costumes', he: 'תחפושות ליל כל הקדושים', fr: 'Costumes Halloween', de: 'Halloween Kostüme', es: 'Disfraces Halloween', it: 'Costumi Halloween' },
    desc: { en: 'Complete your look — costume, wig, makeup & accessories', he: 'תחפושת שלמה עם פאה, איפור ואביזרים', fr: 'Look Halloween complet — costume, perruque, maquillage', de: 'Kompletter Look — Kostüm, Perücke, Make-up', es: 'Look completo — disfraz, peluca, maquillaje', it: 'Look completo — costume, parrucca, trucco' },
    icon: 'mask',
  },
  // ════════════════════════════════════════════════════
  // [P1 TEMU MOAT] Maker Lab — DIY electronics
  // Temu has limited hobby electronics selection. AliExpress is THE global
  // source for Arduino, sensors, soldering kits, and maker components.
  // ════════════════════════════════════════════════════
  {
    slug: 'maker-lab',
    keywords: ['Arduino kit', 'soldering practice kit', 'Raspberry Pi accessories', 'electronics DIY project kit', 'breadboard jumper wire'],
    name: { en: 'Maker Lab', he: 'מעבדת יוצר', fr: 'Atelier Maker', de: 'Maker Labor', es: 'Laboratorio Maker', it: 'Laboratorio Maker' },
    desc: { en: 'Arduino, sensors, soldering kits & everything for your DIY electronics projects', he: 'ארדואינו, סנסורים, ערכות הלחמה וכל מה שצריך לפרויקטי אלקטרוניקה', fr: 'Arduino, capteurs, kits de soudure pour vos projets électroniques', de: 'Arduino, Sensoren, Lötkits für deine Elektronik-Projekte', es: 'Arduino, sensores, kits de soldadura para proyectos electrónicos', it: 'Arduino, sensori, kit di saldatura per progetti elettronici' },
    icon: 'bulb',
  },
  // ════════════════════════════════════════════════════
  // [P1 TEMU MOAT] Home Bar — cocktail starters & barware
  // Temu carries some bar tools but doesn't curate into complete kits.
  // AliExpress has huge selection for home mixology.
  // ════════════════════════════════════════════════════
  {
    slug: 'home-bar',
    keywords: ['cocktail shaker set', 'jigger measure', 'muddler bar spoon', 'ice cube mold silicone', 'bar pour spout'],
    name: { en: 'Home Bar', he: 'בר ביתי', fr: 'Bar à Domicile', de: 'Hausbar', es: 'Bar en Casa', it: 'Bar in Casa' },
    desc: { en: 'Shakers, jiggers & tools to mix craft cocktails at home under €30', he: 'שייקרים, ג\'יגרים וכלים לקוקטיילים ביתיים בפחות מ-₪120', fr: 'Shakers, doseurs et outils pour cocktails maison à moins de 30€', de: 'Shaker, Jigger & Werkzeuge für Craft-Cocktails unter 30€', es: 'Cocteleras, dosificadores para cocktails caseros', it: 'Shaker, misurini e strumenti per cocktail fatti in casa' },
    icon: 'chef',
  },
  // ════════════════════════════════════════════════════
  // [P1 TEMU MOAT] Zero Waste — plastic-free essentials
  // Temu avoids regulated/safety categories; eco-friendly consumer goods
  // (bamboo, silicone, stainless) are harder to curate on Temu's platform.
  // Strong appeal in EU/IL eco-conscious markets.
  // ════════════════════════════════════════════════════
  {
    slug: 'zero-waste',
    keywords: ['bamboo toothbrush', 'reusable produce bags', 'beeswax food wrap', 'stainless steel straw set', 'reusable makeup pads'],
    name: { en: 'Zero Waste', he: 'אפס פסולת', fr: 'Zéro Déchet', de: 'Zero Waste', es: 'Cero Residuos', it: 'Zero Sprechi' },
    desc: { en: 'Reusable, plastic-free essentials for a greener everyday routine', he: 'מוצרים רב-פעמיים נטולי פלסטיק לשגרה ירוקה יותר', fr: 'Essentiels réutilisables sans plastique pour un quotidien plus vert', de: 'Wiederverwendbare, plastikfreie Essentials für den Alltag', es: 'Esenciales reutilizables sin plástico para una rutina más verde', it: 'Essenziali riutilizzabili senza plastica per una routine più verde' },
    icon: 'sun',
  },
  // ════════════════════════════════════════════════════
  // [P1 TEMU MOAT] Dorm Room — college essentials
  // Seasonal Back-to-School niche targeting dorm & student housing.
  // AliExpress has space-saving organizers not well-curated on Temu.
  // ════════════════════════════════════════════════════
  {
    slug: 'dorm-room',
    keywords: ['bed riser', 'dorm room organizer', 'shower caddy', 'under bed storage', 'closet organizer small space'],
    name: { en: 'Dorm Room', he: 'חדר מעונות', fr: 'Chambre Étudiant', de: 'Studenten-WG', es: 'Habitación Residencia', it: 'Camera Studenti' },
    desc: { en: 'Space-saving essentials for dorm rooms & small apartments', he: 'מוצרים חוסכי מקום לחדרי מעונות ודירות קטנות', fr: 'Essentiels gain de place pour chambres étudiantes', de: 'Platzsparende Essentials für WG-Zimmer', es: 'Esenciales que ahorran espacio para habitaciones pequeñas', it: 'Essenziali salvaspazio per camere studenti' },
    icon: 'backpack',
  },
  // ════════════════════════════════════════════════════
  // [P1 TEMU MOAT] Tea Ceremony — matcha & loose-leaf kits
  // Cultural curation Temu's algorithm can't replicate. AliExpress has
  // authentic Japanese & Chinese tea ware that Temu doesn't curate.
  // ════════════════════════════════════════════════════
  {
    slug: 'tea-ceremony',
    keywords: ['matcha whisk bamboo', 'Japanese tea set', 'ceramic teapot', 'tea scoop', 'matcha bowl'],
    name: { en: 'Tea Ceremony', he: 'טקס תה', fr: 'Cérémonie du Thé', de: 'Tea Zeremonie', es: 'Ceremonia del Té', it: 'Cerimonia del Tè' },
    desc: { en: 'Authentic matcha sets, teapots & accessories for the perfect brew', he: 'ערכות מאצ\'ה אותנטיות, קומקומים ואביזרים לחליטה מושלמת', fr: 'Sets matcha authentiques, théières pour une infusion parfaite', de: 'Authentische Matcha-Sets, Teekannen für den perfekten Aufguss', es: 'Sets de matcha auténticos, teteras para una infusión perfecta', it: 'Set matcha autentici, teiere per un infuso perfetto' },
    icon: 'lamp',
  },
  // ════════════════════════════════════════════════════
  // [P1 TEMU MOAT] Desk Wellness — ergonomic home office health
  // Health/ergonomic accessories Temu doesn't target well.
  // AliExpress has a vast selection of posture & ergonomic tools.
  // ════════════════════════════════════════════════════
  {
    slug: 'desk-wellness',
    keywords: ['posture corrector', 'lumbar support cushion', 'ergonomic wrist rest', 'standing desk mat anti fatigue', 'neck stretcher'],
    name: { en: 'Desk Wellness', he: 'בריאות במשרד', fr: 'Bien-être Bureau', de: 'Büro-Wellness', es: 'Bienestar en la Oficina', it: 'Benessere in Ufficio' },
    desc: { en: 'Ergonomic cushions, posture aids & desk health essentials under €25', he: 'כריות ארגונומיות, מתקני יציבה וציוד בריאותי לשולחן בפחות מ-₪100', fr: 'Coussins ergonomiques, aides posturales pour le bureau à moins de 25€', de: 'Ergonomische Kissen, Haltungshilfen für den Schreibtisch unter 25€', es: 'Cojines ergonómicos, ayudas posturales para la oficina', it: 'Cuscini ergonomici, ausili posturali per la scrivania' },
    icon: 'monitor',
  },
  // ════════════════════════════════════════════════════
  // [P1 TEMU MOAT] Jewelry Making — DIY craft supplies
  // Massive AliExpress category. Temu carries some findings but doesn't
  // curate for jewelry makers. Strong repeat-purchase potential.
  // ════════════════════════════════════════════════════
  {
    slug: 'jewelry-making',
    keywords: ['beading kit', 'jewelry pliers set', 'crimp beads', 'wire wrapping kit', 'resin mold jewelry'],
    name: { en: 'Jewelry Making', he: 'תכשיטנות', fr: 'Fabrication Bijoux', de: 'Schmuckherstellung', es: 'Fabricación de Joyas', it: 'Creazione Gioielli' },
    desc: { en: 'Beads, wires, pliers & resin molds for DIY jewelry crafting', he: 'חרוזים, חוטים, צבתות ותבניות שרף ליצירת תכשיטים', fr: 'Perles, fils, pinces et moules résine pour créer vos bijoux', de: 'Perlen, Drähte, Zangen & Harzformen für DIY-Schmuck', es: 'Abalorios, alambres, alicates y moldes de resina', it: 'Perline, fili, pinze e stampi in resina per creare gioielli' },
    icon: 'run',
  },
  // ════════════════════════════════════════════════════
  // [P1 TEMU MOAT] Microgreens & Sprouting — home growing
  // Temu doesn't carry gardening supplies well. AliExpress has vast
  // seed, tray & growing medium selection.
  // ════════════════════════════════════════════════════
  {
    slug: 'microgreens',
    keywords: ['sprouting jar', 'microgreen growing tray', 'seed starter kit', 'growing medium', 'organic seeds mix'],
    name: { en: 'Microgreens', he: 'מיקרוגרין', fr: 'Micro-pousses', de: 'Microgreens', es: 'Microvegetales', it: 'Microgreens' },
    desc: { en: 'Grow nutrient-packed microgreens at home — trays, seeds & jars', he: 'לגדל מיקרוגרין עשיר ברכיבים תזונתיים בבית', fr: 'Cultivez des micro-pousses à la maison — plateaux, graines', de: 'Nährstoffreiche Microgreens zu Hause anbauen', es: 'Cultiva microvegetales ricos en nutrientes en casa', it: 'Coltiva microgreens ricchi di nutrienti a casa' },
    icon: 'sun',
  },
  {
    slug: 'home-gym',
    keywords: ['fitness resistance bands', 'yoga mat', 'home gym equipment', 'jump rope'],
    name: { en: 'Home Gym', he: 'חדר כושר ביתי', fr: 'Salle de Sport', de: 'Heim-Fitness', es: 'Gimnasio en Casa', it: 'Palestra in Casa' },
    desc: { en: 'Resistance bands, yoga mats & gear for your home workouts', he: 'רצועות התנגדות, מזרני יוגה ועוד לאימון ביתי', fr: 'Élastiques, tapis de yoga et équipement pour chez vous', de: 'Widerstandsbänder, Yogamatten & mehr', es: 'Bandas, tapetes y equipo para tu casa', it: 'Fascia, tappetino e attrezzatura per casa' },
    icon: 'run',
  },
  {
    slug: 'home-office',
    keywords: ['desk lamp LED', 'cable management desk', 'monitor stand', 'desk organizer', 'wireless charging pad'],
    name: { en: 'Desk Setup', he: 'עמדת עבודה ביתית', fr: 'Bureau Domicile', de: 'Schreibtisch-Setup', es: 'Setup de Escritorio', it: 'Set up Scrivania' },
    desc: { en: 'Ergonomic desk gear, cable management & lighting', he: 'ציוד ארגונומי לשולחן, סידור כבלים ותאורה', fr: 'Équipement ergonomique, gestion des câbles', de: 'Ergonomisch, Kabelmanagement & Beleuchtung', es: 'Equipo ergonómico, gestión de cables', it: 'Attrezzatura ergonomica, gestione cavi' },
    icon: 'monitor',
  },
  {
    slug: 'smart-home',
    keywords: ['Tuya smart plug EU', 'wireless doorbell', 'smart sensor WiFi', 'smart LED strip'],
    name: { en: 'Smart Home', he: 'בית חכם', fr: 'Maison Connectée', de: 'Smart Home', es: 'Hogar Inteligente', it: 'Casa Intelligente' },
    desc: { en: 'WiFi plugs, sensors & smart lighting to automate your home', he: 'שקעי WiFi, חיישנים ותאורה חכמה', fr: 'Prises WiFi, capteurs, éclairage connecté', de: 'WLAN-Steckdosen, Sensoren, smarte Beleuchtung', es: 'Enchufes WiFi, sensores, iluminación', it: 'Prese WiFi, sensori, illuminazione smart' },
    icon: 'bulb',
  },
  {
    slug: 'kitchen',
    keywords: ['kitchen gadgets', 'garlic press', 'kitchen organizer', 'fruit peeler'],
    name: { en: 'Kitchen Gadgets', he: 'גאדג\'טים למטבח', fr: 'Gadgets Cuisine', de: 'Küchenhelfer', es: 'Gadgets de Cocina', it: 'Gadget da Cucina' },
    desc: { en: 'Smart tools under €10 that actually improve your cooking', he: 'כלי מטבח חכמים בפחות מ-₪40', fr: 'Outils malins à moins de 10€', de: 'Clevere Helfer unter 10€', es: 'Herramientas inteligentes por menos de 10€', it: 'Strumenti intelligenti sotto i 10€' },
    icon: 'chef',
  },
  {
    slug: 'travel',
    keywords: ['travel adapter universal', 'packing cubes', 'portable charger', 'travel organizer'],
    name: { en: 'Travel Kit', he: 'ערכת טיולים', fr: 'Kit Voyage', de: 'Reiseset', es: 'Kit de Viaje', it: 'Kit da Viaggio' },
    desc: { en: 'Packing cubes, adapters & chargers for stress-free trips', he: 'קוביות אריזה, מתאמים ומטענים לטיול', fr: 'Cubes, adaptateurs et chargeurs pour voyager', de: 'Packwürfel, Adapter & Ladegeräte', es: 'Cubos, adaptadores y cargadores', it: 'Cubi, adattatori e caricabatterie' },
    icon: 'plane',
  },
  {
    slug: 'camping',
    keywords: ['camping tent 2 person', 'sleeping bag portable', 'camping fan', 'headlamp rechargeable'],
    name: { en: 'Camping Gear', he: 'ציוד קמפינג', fr: 'Camping', de: 'Camping-Ausrüstung', es: 'Equipo de Camping', it: 'Attrezzatura da Campeggio' },
    desc: { en: 'Tent, sleeping bag & essentials for under the stars', he: 'אוהל, שק שינה ועוד ללילה תחת הכוכבים', fr: 'Tente, sac de couchage pour la belle étoile', de: 'Zelt, Schlafsack für unter dem Sternenhimmel', es: 'Tienda, saco de dormir', it: 'Tenda, sacco a pelo' },
    icon: 'tent',
  },
  {
    slug: 'wireless-audio',
    keywords: ['wireless earbuds', 'bluetooth headphones', 'true wireless', 'TWS earbuds', 'noise cancelling earphones'],
    name: { en: 'Wireless Audio', he: 'אודיו אלחוטי', fr: 'Audio Sans Fil', de: 'Kabelloses Audio', es: 'Audio Inalambrico', it: 'Audio Senza Fili' },
    desc: { en: 'TWS earbuds, BT headphones & speakers for every budget', he: 'אוזניות TWS, אוזניות בלוטוס ורמקולים', fr: 'Ecouteurs TWS, casques BT et enceintes', de: 'TWS-Kopfhorer, BT-Kopfhorer & Lautsprecher', es: 'Auriculares TWS, cascos BT y altavoces', it: 'Auricolari TWS, cuffie BT e altoparlanti' },
    icon: 'music',
  },
  {
    slug: 'phone-accessories',
    keywords: ['phone case', 'screen protector', 'phone stand', 'car phone mount', 'USB C cable', 'power bank'],
    name: { en: 'Phone Accessories', he: 'אביזרים לטלפון', fr: 'Accessoires Telephone', de: 'Handy-Zubehor', es: 'Accesorios para Telefono', it: 'Accessori per Telefono' },
    desc: { en: 'Cases, chargers, stands & mounts for your phone', he: 'כיסויים, מטענים, מעמדים ואוחזים לרכב', fr: 'Coques, chargeurs, supports', de: 'Hullen, Ladegerate, Halterungen', es: 'Fundas, cargadores, soportes', it: 'Custodie, caricabatterie, supporti' },
    icon: 'smartphone',
  },
  {
    slug: 'summer-essentials',
    keywords: ['portable fan', 'beach towel', 'pool float', 'sunglasses', 'sun hat', 'water bottle'],
    name: { en: 'Summer Essentials', he: 'מוצרי חובה לקיץ', fr: 'Essentiels Ete', de: 'Sommer-Essentials', es: 'Esenciales de Verano', it: 'Essenziali Estivi' },
    desc: { en: 'Beat the heat — fans, beach gear, hydration & sun protection', he: 'מאווררים ניידים, ציוד חוף, שתייה והגנה מהשמש', fr: 'Ventilateurs, plage, hydratation & protection solaire', de: 'Ventilatoren, Strand, Hydration & Sonnenschutz', es: 'Ventiladores, playa, hidratacion', it: 'Ventilatori, spiaggia, idratazione' },
    icon: 'sun',
  },
  {
    slug: 'back-to-school',
    keywords: ['school supplies', 'backpack', 'lunch box', 'stationery', 'pencil case', 'desk lamp'],
    name: { en: 'Back to School', he: 'חזרה לבית הספר', fr: 'Rentree Scolaire', de: 'Schulstart', es: 'Vuelta al Cole', it: 'Ritorno a Scuola' },
    desc: { en: 'Everything students need — bags, stationery, accessories', he: 'כל מה שצריך לתלמידים — תיקים, כלי כתיבה, אביזרים', fr: 'Sacs, papeterie et accessoires', de: 'Rucksacke, Schreibwaren & Zubehor', es: 'Mochilas, papeleria y accesorios', it: 'Zaini, cancelleria e accessori' },
    icon: 'backpack',
  },
  {
    slug: 'pet',
    keywords: ['dog leash strong', 'cat toy interactive', 'pet grooming brush', 'dog poop bags'],
    name: { en: 'Pet Care', he: 'חיות מחמד', fr: 'Animaux', de: 'Haustiere', es: 'Mascotas', it: 'Animali Domestici' },
    desc: { en: 'Leashes, toys & grooming tools for your furry friend', he: 'רצועות, צעצועים וכלי טיפוח', fr: 'Laisse, jouets et outils de toilettage', de: 'Leinen, Spielzeug & Pflegewerkzeuge', es: 'Correas, juguetes y herramientas', it: 'Guinzagli, giocattoli e strumenti' },
    icon: 'paw',
  },
  {
    slug: 'car',
    keywords: ['car phone holder', 'car trunk organizer', 'microfiber cleaning cloth car', 'car accessories interior'],
    name: { en: 'Car Gadgets', he: 'גאדג\'טים לרכב', fr: 'Gadgets Auto', de: 'Auto Zubehör', es: 'Accesorios Coche', it: 'Accessori Auto' },
    desc: { en: 'Phone mounts, organizers & cleaning kits under €15', he: 'מחזיקים, מארגנים וערכות ניקוי בפחות מ-₪60', fr: 'Supports, organiseurs et kits nettoyage', de: 'Halte, Organizer & Reinigungskits', es: 'Soportes, organizadores y kits', it: 'Supporti, organizer e kit pulizia' },
    icon: 'car',
  },
  {
    slug: 'lighting',
    keywords: ['LED desk lamp USB', 'monitor backlight LED', 'smart LED light strip', 'ambient light bedroom'],
    name: { en: 'Lighting', he: 'תאורה', fr: 'Éclairage', de: 'Beleuchtung', es: 'Iluminación', it: 'Illuminazione' },
    desc: { en: 'Desk lamps, LED strips & ambient lights for any space', he: 'מנורות שולחן, פסי לד ותאורת אווירה', fr: 'Lampes de bureau, bandeaux LED', de: 'Schreibtischlampen, LED-Streifen', es: 'Lámparas, tiras LED', it: 'Lampade, strip LED' },
    icon: 'lamp',
  },
  {
    slug: 'coffee-ritual',
    keywords: ['french press stainless steel', 'burr coffee grinder', 'milk frother handheld', 'reusable coffee cup'],
    name: { en: 'Coffee Ritual', he: 'טקס הקפה', fr: 'Rituel Café', de: 'Kaffeeritual', es: 'Ritual del Café', it: 'Rituale del Caffè' },
    desc: { en: 'Brew barista-quality coffee at home under €60', he: 'קפה באיכות בריסטה בבית בפחות מ-₪250', fr: 'Café de barista à domicile à moins de 60€', de: 'Barista-Qualität zu Hause unter 60€', es: 'Café de barista en casa por menos de 60€', it: 'Caffè da bar a casa sotto i 60€' },
    icon: 'chef',
  },
  {
    slug: 'content-creator',
    keywords: ['wireless lavalier microphone', 'ring light with tripod', 'phone gimbal stabilizer', 'LED ring light 10'],
    name: { en: 'Content Creator Kit', he: 'ערכת יוצרי תוכן', fr: 'Kit Créateur', de: 'Creator-Set', es: 'Kit Creador', it: 'Kit Creator' },
    desc: { en: 'Start recording like a pro with mic, light & gimbal under €80', he: 'להקליט כמו מקצוען עם מיקרופון, תאורה וגימבל בפחות מ-₪350', fr: 'Enregistrez comme un pro avec micro, lumière et gimbal à moins de 80€', de: 'Professionell aufnehmen mit Mikro, Licht & Gimbal unter 80€', es: 'Graba como un pro con mic, luz y gimbal por menos de 80€', it: 'Registra come un pro con microfono, luce e gimbal sotto 80€' },
    icon: 'camera',
  },
  {
    slug: 'balcony-garden',
    keywords: ['vertical garden planter', 'grow bag fabric', 'solar drip irrigation', 'self watering plant pot'],
    name: { en: 'Balcony Garden', he: 'גינת מרפסת', fr: 'Jardin Balcon', de: 'Balkongarten', es: 'Jardín Balcón', it: 'Giardino Balcone' },
    desc: { en: 'Grow herbs & veggies on your balcony under €40', he: 'לגדל עשבי תיבול במרפסת בפחות מ-₪160', fr: 'Cultivez herbes et légumes sur votre balcon à moins de 40€', de: 'Kräuter & Gemüse auf dem Balkon unter 40€', es: 'Cultiva hierbas y verduras en tu balcón por menos de 40€', it: 'Coltiva erbe e verdure sul balcone sotto 40€' },
    icon: 'sun',
  },
  {
    slug: 'sleep-sanctuary',
    keywords: ['silk sleep mask', 'weighted eye pillow', 'aromatherapy diffuser ultrasonic', 'memory foam contour pillow'],
    name: { en: 'Sleep Sanctuary', he: 'פינת שינה', fr: 'Sanctuaire du Sommeil', de: 'Schlaf-Oase', es: 'Santuario del Sueño', it: 'Santuario del Sonno' },
    desc: { en: 'Natural sleep aids for better rest under €40', he: 'עזרי שינה טבעיים לשינה טובה יותר בפחות מ-₪150', fr: 'Aides au sommeil naturelles pour mieux dormir à moins de 40€', de: 'Natürliche Schlafhilfen für besseren Schlaf unter 40€', es: 'Ayudas naturales para dormir mejor por menos de 40€', it: 'Aiuti naturali per dormire meglio sotto 40€' },
    affiliateKeywords: ['back to school supplies', 'school supplies bulk', 'stationery set', 'college dorm essentials', 'school backpack'],
  },
  {
    slug: 'gaming-gear',
    tag: { en: 'Gaming Gear', he: 'ציוד גיימינג' },
    metaTitle: { en: 'Best Budget Gaming Gear Under $30', he: 'ציוד גיימינג במחירי רצפה' },
    metaDesc: { en: 'Mouse, keyboard, headset and more — gaming gear that won\'t break the bank.', he: 'עכבר, מקלדת, אוזניות ועוד — ציוד גיימינג שלא ירושש אתכם' },
    image: '/collections/gaming-gear.jpg',
    items: [
      { name: 'Gaming Mouse', keyword: 'gaming mouse rgb wired 6400 dpi', minPrice: 8, maxPrice: 25 },
      { name: 'Mechanical Keyboard', keyword: 'mechanical keyboard 60% rgb wired', minPrice: 15, maxPrice: 35 },
      { name: 'Gaming Headset', keyword: 'gaming headset 7.1 surround sound', minPrice: 12, maxPrice: 30 },
      { name: 'Mouse Pad XL', keyword: 'gaming mouse pad xxl extended', minPrice: 5, maxPrice: 15 },
      { name: 'USB Microphone', keyword: 'condenser microphone usb podcast', minPrice: 10, maxPrice: 28 },
    ],
    affiliateKeywords: ['gaming mouse', 'mechanical keyboard', 'gaming headset', 'gaming accessories', 'budget gaming setup'],
  },
  {
    slug: 'gadgets-under-10',
    keywords: ['kitchen gadgets under 10', 'useful gadgets cheap', 'home gadgets', 'organization tools', 'small kitchen tools'],
    name: { en: 'Gadgets Under €10', he: 'גאדג׳טים בפחות מ-₪40', fr: 'Gadgets à Moins de 10€', de: 'Gadgets unter 10€', es: 'Gadgets por menos de 10€', it: 'Gadget Sotto i 10€' },
    desc: { en: 'Smart little tools under €10 that make daily life easier', he: 'כלים קטנים וחכמים בפחות מ-₪40 שמקלים על החיים', fr: 'Petits outils malins à moins de 10€', de: 'Clevere kleine Helfer unter 10€', es: 'Pequeñas herramientas inteligentes por menos de 10€', it: 'Piccoli strumenti intelligenti sotto 10€' },
    icon: 'bulb',
  },
  {
    slug: 'skincare-routine',
    keywords: ['face roller gua sha', 'LED face mask', 'facial cleansing brush', 'hyaluronic acid serum', 'vitamin C serum'],
    name: { en: 'Skincare Routine', he: 'שגרת טיפוח' },
    desc: { en: 'Essential skincare tools for glowing skin', he: 'כלי טיפוח חיוניים לעור זוהר — תכשירי ניקוי, מסכות וכלים' },
    icon: 'mask',
    googleCategory: '469',
  },
  {
    slug: 'hair-styling',
    keywords: ['hair dryer diffuser', 'curling wand', 'hair straightener brush', 'hair clippers trimmer', 'hot air brush'],
    name: { en: 'Hair Styling Tools', he: 'כלי עיצוב שיער' },
    desc: { en: 'Professional hair tools for salon-quality styling at home', he: 'כלי עיצוב שיער מקצועיים באיכות סלון בבית' },
    icon: 'chef',
    googleCategory: '267',
  },
  {
    slug: 'makeup-essentials',
    keywords: ['makeup brush set', 'beauty blender sponge', 'makeup bag organizer', 'eyelash curler', 'eyeshadow palette'],
    name: { en: 'Makeup Essentials', he: 'איפור בסיסי' },
    desc: { en: 'Everything you need for a complete makeup kit', he: 'כל מה שצריך לערכת איפור מלאה — מברשות, ספוגים ומארגנים' },
    icon: 'camera',
    googleCategory: '469',
  },
  {
    slug: 'nail-care',
    keywords: ['UV nail lamp', 'nail drill file', 'nail art stamp kit', 'nail polish set', 'cuticle oil kit'],
    name: { en: 'Nail Art & Care', he: 'טיפוח ציפורניים' },
    desc: { en: 'DIY nail art tools and care kits for perfect manicures at home', he: 'ערכות טיפוח ציפורניים לעשות בעצמכם — מניקור מושלם בבית' },
    icon: 'sun',
    googleCategory: '469',
  },
  {
    slug: 'mens-grooming',
    keywords: ['beard trimmer', 'electric shaver', 'beard oil kit', 'men\'s face wash', 'mustache comb'],
    name: { en: 'Men\'s Grooming', he: 'גילוח וטיפוח לגברים' },
    desc: { en: 'Complete grooming kit for modern men — shavers and beard care', he: 'ערכת גילוח וטיפוח שלמה לגבר המודרני' },
    icon: 'mask',
    googleCategory: '469',
  },
  {
    slug: 'bath-body',
    keywords: ['bath bombs set', 'body scrub', 'shower steamer', 'bath pillow', 'spa headband'],
    name: { en: 'Bath & Body', he: 'אמבטיה וגוף' },
    desc: { en: 'Luxurious bath treats and body care essentials', he: 'פינוקים לאמבטיה וטיפוח גוף יוקרתיים' },
    icon: 'lamp',
    googleCategory: '469',
  },
  {
    slug: 'korean-skincare',
    keywords: ['Korean essence', 'snail mucin', 'sheet masks', 'vitamin C brightening', 'centella asiatica'],
    name: { en: 'K-Beauty Routine', he: 'טיפוח קוריאני' },
    desc: { en: 'Korean skincare step-by-step — essence and sheet masks', he: 'שגרת טיפוח קוריאנית צעד אחר צעד' },
    icon: 'mask',
    googleCategory: '469',
  },
  {
    slug: 'anti-aging',
    keywords: ['retinol serum', 'hyaluronic acid serum', 'vitamin C serum', 'anti-wrinkle cream', 'eye cream'],
    name: { en: 'Anti-Aging Skincare', he: 'טיפוח אנטי אייג\'ינג' },
    desc: { en: 'Anti-aging serums and creams for youthful radiant skin', he: 'סרומים וקרמים נגד קמטים לעור צעיר וזוהר' },
    icon: 'sun',
    googleCategory: '469',
  },
  {
    slug: 'acne-care',
    keywords: ['salicylic acid cleanser', 'benzoyl peroxide spot treatment', 'niacinamide serum', 'tea tree oil', 'clay mask'],
    name: { en: 'Acne Care', he: 'טיפול בפצעונים' },
    desc: { en: 'Clear skin solutions for acne-prone skin — spot treatments and cleansers', he: 'פתרונות לעור נוטה לפצעונים — טיפולים מקומיים ותכשירי ניקוי' },
    icon: 'mask',
    googleCategory: '469',
  },
  {
    slug: 'facial-tools',
    keywords: ['face roller', 'jade roller', 'gua sha tool', 'facial steamer', 'microcurrent device'],
    name: { en: 'Facial Tools', he: 'כלי טיפוח לפנים' },
    desc: { en: 'Professional facial tools for spa-level skincare at home', he: 'כלי טיפוח מקצועיים ברמת ספא בבית' },
    icon: 'bulb',
    googleCategory: '469',
  },
  {
    slug: 'hair-growth',
    keywords: ['caffeine shampoo', 'biotin supplement', 'hair growth serum', 'derma roller', 'rosemary oil'],
    name: { en: 'Hair Growth', he: 'צמיחת שיער' },
    desc: { en: 'Products to support hair growth and reduce hair thinning', he: 'מוצרים לתמיכה בצמיחת שיער והפחתת נשירה' },
    icon: 'run',
    googleCategory: '469',
  },
  {
    slug: 'curly-hair',
    keywords: ['curl cream', 'diffuser attachment', 'satin bonnet', 'cotton t-shirt towel', 'leave-in conditioner'],
    name: { en: 'Curly Hair Care', he: 'טיפוח שיער מתולתל' },
    desc: { en: 'Defined curls and moisture for curly and wavy hair', he: 'תלתלים מוגדרים ולחות לשיער מתולתל וגלי' },
    icon: 'music',
    googleCategory: '469',
  },
  {
    slug: 'hair-accessories',
    keywords: ['hair claw clip', 'scrunchie set', 'hair turban towel', 'headband', 'hair fork'],
    name: { en: 'Hair Accessories', he: 'אביזרי שיער' },
    desc: { en: 'Stylish hair accessories for every occasion', he: 'אביזרי שיער אופנתיים לכל אירוע' },
    icon: 'backpack',
    googleCategory: '469',
  },
  {
    slug: 'makeup-brushes',
    keywords: ['foundation brush', 'powder brush', 'blush brush', 'eyeshadow brush set', 'concealer brush'],
    name: { en: 'Makeup Brushes', he: 'מברשות איפור' },
    desc: { en: 'Professional makeup brush sets for flawless application', he: 'ערכות מברשות איפור מקצועיות למריחה מושלמת' },
    icon: 'camera',
    googleCategory: '469',
  },
  {
    slug: 'eye-makeup',
    keywords: ['eyeliner pencil', 'eyeshadow palette', 'eyebrow pencil', 'mascara waterproof', 'eyelash curler'],
    name: { en: 'Eye Makeup', he: 'איפור עיניים' },
    desc: { en: 'Complete eye makeup essentials for stunning looks', he: 'ערכת איפור עיניים שלמה ללוקים מרשימים' },
    icon: 'camera',
    googleCategory: '469',
  },
  {
    slug: 'lip-care',
    keywords: ['lip balm', 'lip scrub', 'lip mask', 'lip plumping gloss', 'lip stain'],
    name: { en: 'Lip Care', he: 'טיפוח שפתיים' },
    desc: { en: 'Nourishing lip care products for soft hydrated lips', he: 'מוצרי הזנה לשפתיים רכות ולחות' },
    icon: 'sun',
    googleCategory: '469',
  },
  {
    slug: 'false-lashes',
    keywords: ['false eyelashes', 'lash glue', 'individual lashes', 'strip lashes', 'lash applicator'],
    name: { en: 'False Eyelashes', he: 'ריסים מלאכותיים' },
    desc: { en: 'Stunning false lashes from natural to dramatic', he: 'ריסים מלאכותיים מרשימים מטבעיים עד דרמטיים' },
    icon: 'camera',
    googleCategory: '469',
  },
  {
    slug: 'makeup-organizers',
    keywords: ['makeup case', 'cosmetic bag organizer', 'acrylic makeup organizer', 'makeup train case', 'brush holder'],
    name: { en: 'Makeup Organizers', he: 'מארגני איפור' },
    desc: { en: 'Keep your makeup collection tidy and accessible', he: 'שמירה על אוסף האיפור מסודר ונגיש' },
    icon: 'backpack',
    googleCategory: '469',
  },
  {
    slug: 'perfume-fragrance',
    keywords: ['perfume oil', 'perfume sample set', 'body mist', 'roll-on fragrance', 'solid perfume'],
    name: { en: 'Perfume & Fragrance', he: 'בשמים וניחוחות' },
    desc: { en: 'Long-lasting perfumes and fragrance oils for every occasion', he: 'בשמים וניחוחות עמידים לכל אירוע' },
    icon: 'run',
    googleCategory: '469',
  },
  {
    slug: 'sun-care',
    keywords: ['sunscreen SPF 50', 'after-sun lotion', 'sun stick', 'facial sun protection', 'tanning oil'],
    name: { en: 'Sun Care', he: 'הגנה מהשמש' },
    desc: { en: 'Sunscreen and after-sun products for healthy protected skin', he: 'מסנני קרינה ומוצרים אחרי שמש לעור בריא ומוגן' },
    icon: 'sun',
    googleCategory: '469',
  },
  {
    slug: 'body-hair-removal',
    keywords: ['epilator', 'hair removal cream', 'wax strips', 'electric trimmer', 'IPL hair removal device'],
    name: { en: 'Body Hair Removal', he: 'הסרת שיער בגוף' },
    desc: { en: 'Effective hair removal solutions for smooth skin', he: 'פתרונות אפקטיביים להסרת שיער לעור חלק' },
    icon: 'bulb',
    googleCategory: '469',
  },
  {
    slug: 'waxing-kit',
    keywords: ['wax warmer', 'hard wax beans', 'wax strips', 'wax spatula', 'pre-wax oil'],
    name: { en: 'Waxing Kit', he: 'ערכת שעווה' },
    desc: { en: 'Complete waxing kits for professional hair removal at home', he: 'ערכות שעווה שלמות להסרת שיער מקצועית בבית' },
    icon: 'bulb',
    googleCategory: '469',
  },
  {
    slug: 'manicure-pedicure',
    keywords: ['manicure set', 'cuticle pusher', 'nail file set', 'nail buffer', 'toe separator'],
    name: { en: 'Manicure & Pedicure', he: 'מניקור ופדיקור' },
    desc: { en: 'Professional nail care tools for salon-quality manicures at home', he: 'כלי טיפוח ציפורניים מקצועיים למניקור באיכות סלון בבית' },
    icon: 'sun',
    googleCategory: '469',
  },
  {
    slug: 'gel-nails',
    keywords: ['UV gel polish', 'gel nail lamp', 'gel base coat', 'gel top coat', 'nail dehydrator'],
    name: { en: 'Gel Nails', he: 'ציפורני ג\'ל' },
    desc: { en: 'Everything for perfect gel nails at home — lamps and polishes', he: 'כל מה שצריך לציפורני ג\'ל מושלמות בבית — מנורות ולקים' },
    icon: 'bulb',
    googleCategory: '469',
  },
  {
    slug: 'nail-art',
    keywords: ['nail stamps', 'nail art brushes', 'nail rhinestones', 'dotting tool', 'nail stencils'],
    name: { en: 'Nail Art', he: 'אמנות ציפורניים' },
    desc: { en: 'Creative nail art supplies for unique manicure designs', he: 'אביזרים ליצירת ציפורניים אומנותיות לעיצובים ייחודיים' },
    icon: 'lamp',
    googleCategory: '469',
  },
  {
    slug: 'beard-care',
    keywords: ['beard trimmer', 'beard oil', 'beard balm', 'beard brush', 'beard shampoo'],
    name: { en: 'Beard Care', he: 'טיפוח זקן' },
    desc: { en: 'Complete beard grooming products for a well-kept beard', he: 'מוצרי טיפוח שלמים לזקן מטופח' },
    icon: 'mask',
    googleCategory: '469',
  },
  {
    slug: 'shavers-trimmers',
    keywords: ['electric shaver', 'foil shaver', 'rotary shaver', 'trimmer detailer', 'nose hair trimmer'],
    name: { en: 'Electric Shavers', he: 'מכונות גילוח חשמליות' },
    desc: { en: 'Modern electric shavers and trimmers for a clean shave', he: 'מכונות גילוח חשמליות מודרניות לגילוח נקי' },
    icon: 'run',
    googleCategory: '469',
  },
  {
    slug: 'oral-care',
    keywords: ['electric toothbrush', 'water flosser', 'teeth whitening strips', 'tongue scraper', 'travel toothbrush case'],
    name: { en: 'Oral Care', he: 'היגיינת פה' },
    desc: { en: 'Essential oral care products for a bright healthy smile', he: 'מוצרי היגיינת פה חיוניים לחיוך בריא וזוהר' },
    icon: 'run',
    googleCategory: '469',
  },
  {
    slug: 'teeth-whitening',
    keywords: ['teeth whitening strips', 'activated charcoal powder', 'LED whitening light', 'whitening pen', 'whitening toothpaste'],
    name: { en: 'Teeth Whitening', he: 'הלבנת שיניים' },
    desc: { en: 'Professional teeth whitening kits for a brighter smile', he: 'ערכות הלבנת שיניים מקצועיות לחיוך בהיר יותר' },
    icon: 'lamp',
    googleCategory: '469',
  },
  {
    slug: 'foot-care',
    keywords: ['callus remover', 'foot file', 'foot cream', 'heel sleeves', 'foot spa'],
    name: { en: 'Foot Care', he: 'טיפוח כף הרגל' },
    desc: { en: 'Complete foot care for smooth and healthy feet', he: 'טיפוח כף הרגל השלם לעור חלק ובריא' },
    icon: 'mask',
    googleCategory: '469',
  },
  {
    slug: 'hand-care',
    keywords: ['hand cream', 'nail oil', 'cuticle cream', 'hand mask', 'moisturizing gloves'],
    name: { en: 'Hand Care', he: 'טיפוח ידיים' },
    desc: { en: 'Nourishing hand care products for soft beautiful hands', he: 'מוצרי הזנה לידיים רכות ויפות' },
    icon: 'sun',
    googleCategory: '469',
  },
  {
    slug: 'face-masks',
    keywords: ['sheet mask', 'clay mask', 'peel-off mask', 'gel mask', 'charcoal mask'],
    name: { en: 'Face Masks', he: 'מסכות פנים' },
    desc: { en: 'Sheet masks clay masks and peel-off masks for every skin type', he: 'מסכות בד, מסכות חימר ומסכות פילינג לכל סוג עור' },
    icon: 'mask',
    googleCategory: '469',
  },
  {
    slug: 'gua-sha-facial',
    keywords: ['gua sha stone', 'face roller jade', 'ice roller face', 'face yoga tool', 'lymphatic drainage tool'],
    name: { en: 'Face Massage Tools', he: 'כלי עיסוי פנים' },
    desc: { en: 'Face massage and gua sha tools for lymphatic drainage', he: 'כלי עיסוי פנים וגואה שה לניקוז לימפטי' },
    icon: 'run',
    googleCategory: '469',
  },
  {
    slug: 'aromatherapy',
    keywords: ['essential oil set', 'diffuser ultrasonic', 'aromatherapy candle', 'room spray', 'pillow spray'],
    name: { en: 'Aromatherapy', he: 'ארומתרפיה' },
    desc: { en: 'Essential oils and aromatherapy accessories for relaxation', he: 'שמנים אתריים ואביזרי ארומתרפיה להרפיה' },
    icon: 'lamp',
    googleCategory: '469',
  },
  {
    slug: 'essential-oils',
    keywords: ['lavender oil', 'tea tree oil', 'peppermint oil', 'eucalyptus oil', 'frankincense oil'],
    name: { en: 'Essential Oils', he: 'שמנים אתריים' },
    desc: { en: 'Pure essential oils collection for wellness and relaxation', he: 'אוסף שמנים אתריים טהורים לבריאות והרגעה' },
    icon: 'run',
    googleCategory: '469',
  },
  {
    slug: 'shower-gadgets',
    keywords: ['shower speaker', 'shower cap', 'loofah sponge', 'shower caddy', 'silicone shower brush'],
    name: { en: 'Shower Gadgets', he: 'גאדג\'טים למקלחת' },
    desc: { en: 'Smart shower accessories for a more enjoyable daily routine', he: 'אביזרי מקלחת חכמים לשגרה יומית מהנה יותר' },
    icon: 'music',
    googleCategory: '469',
  },
  {
    slug: 'cosmetic-bags',
    keywords: ['travel cosmetics bag', 'toiletry bag', 'makeup pouch', 'vanity case', 'cosmetic train case'],
    name: { en: 'Cosmetic Bags', he: 'תיקי קוסמטיקה' },
    desc: { en: 'Stylish and functional cosmetic bags for travel and daily use', he: 'תיקי קוסמטיקה אופנתיים ושימושיים לנסיעות ולשימוש יומי' },
    icon: 'backpack',
    googleCategory: '469',
  },
  {
    slug: 'hair-coloring',
    keywords: ['ammonia-free hair dye', 'hair bleach kit', 'hair color brush', 'hair developer', 'toning shampoo'],
    name: { en: 'Hair Coloring', he: 'צביעת שיער' },
    desc: { en: 'DIY hair coloring kits and tools for salon results at home', he: 'ערכות צביעת שיער ביתיות לתוצאות כמו במספרה' },
    icon: 'run',
    googleCategory: '469',
  },
  {
    slug: 'wigs-extensions',
    keywords: ['human hair wig', 'synthetic wig', 'hair extensions clip-in', 'tape-in extensions', 'wig cap'],
    name: { en: 'Wigs & Extensions', he: 'פאות ותוספות שיער' },
    desc: { en: 'Natural-looking wigs and hair extensions for versatile styling', he: 'פאות ותוספות שיער במראה טבעי לסטיילינג מגוון' },
    icon: 'chef',
    googleCategory: '469',
  },
  {
    slug: 'scalp-care',
    keywords: ['scalp massage brush', 'scalp scrub', 'scalp serum', 'dandruff shampoo', 'hair growth stimulator'],
    name: { en: 'Scalp Care', he: 'טיפוח הקרקפת' },
    desc: { en: 'Scalp treatments and products for a healthy hair foundation', he: 'טיפולים ומוצרים לקרקפת בריאה כבסיס לשיער חזק' },
    icon: 'mask',
    googleCategory: '469',
  },
  {
    slug: 'eyebrow-care',
    keywords: ['eyebrow razor', 'eyebrow stencil', 'eyebrow gel', 'eyebrow powder', 'eyebrow tweezer'],
    name: { en: 'Eyebrow Care', he: 'טיפוח גבות' },
    desc: { en: 'Everything for perfect eyebrows — shaping and styling', he: 'הכל לגבות מושלמות — עיצוב וסטיילינג' },
    icon: 'camera',
    googleCategory: '469',
  },
  {
    slug: 'eyelash-serum',
    keywords: ['eyelash growth serum', 'eyebrow growth serum', 'lash conditioning', 'lash primer', 'lash lift kit'],
    name: { en: 'Eyelash Serum', he: 'סרום ריסים' },
    desc: { en: 'Eyelash growth serums for longer fuller lashes', he: 'סרומים לצמיחת ריסים לריסים ארוכים ומלאים יותר' },
    icon: 'run',
    googleCategory: '469',
  },
  {
    slug: 'eco-beauty',
    keywords: ['reusable makeup pads', 'bamboo toothbrush', 'biodegradable loofah', 'shampoo bar', 'safety razor set'],
    name: { en: 'Eco Beauty', he: 'יופי אקולוגי' },
    desc: { en: 'Sustainable and eco-friendly beauty products for a greener routine', he: 'מוצרי יופי ברי קיימא וידידותיים לסביבה לשגרה ירוקה יותר' },
    icon: 'backpack',
    googleCategory: '469',
  },
  {
    slug: 'spa-at-home',
    keywords: ['face steamer', 'foot spa massager', 'bath pillow', 'body brush', 'spa robe'],
    name: { en: 'Home Spa', he: 'ספא ביתי' },
    desc: { en: 'Create a luxurious spa experience at home', he: 'צרו חוויית ספא יוקרתית בבית' },
    icon: 'lamp',
    googleCategory: '469',
  },
  {
    slug: 'sleep-beauty',
    keywords: ['silk pillowcase', 'sleep mask silk', 'satin hair bonnet', 'night cream', 'sleeping pack'],
    name: { en: 'Sleep & Beauty', he: 'שינה ויופי' },
    desc: { en: 'Beauty products for your nighttime routine for overnight radiance', he: 'מוצרי יופי לשגרת הלילה לזוהר בזמן השינה' },
    icon: 'sun',
    googleCategory: '469',
  },
  {
    slug: 'facial-cleansing',
    keywords: ['facial cleansing brush', 'oil cleanser', 'foaming cleanser', 'micellar water', 'double cleansing set'],
    name: { en: 'Facial Cleansing', he: 'ניקוי פנים' },
    desc: { en: 'Deep cleansing tools and products for a clear complexion', he: 'כלי ניקוי עמוק ומוצרים לעור נקי וצלול' },
    icon: 'mask',
    googleCategory: '469',
  },
  {
    slug: 'ipl-hair-removal',
    keywords: ['IPL device', 'flash cartridge', 'safety goggles', 'cooling gel', 'precision cap'],
    name: { en: 'IPL Hair Removal', he: 'הסרת שיער IPL' },
    desc: { en: 'Professional IPL devices for permanent hair reduction at home', he: 'מכשירי IPL מקצועיים להפחתת שיער קבועה בבית' },
    icon: 'bulb',
    googleCategory: '469',
  },
  {
    slug: 'beauty-supplements',
    keywords: ['collagen powder', 'biotin gummies', 'vitamin C gummies', 'hair skin nails vitamins', 'marine collagen'],
    name: { en: 'Beauty Supplements', he: 'תוספי יופי' },
    desc: { en: 'Supplements for hair skin and nail health from within', he: 'תוספי תזונה לשיער עור וציפורניים מבפנים' },
    icon: 'sun',
    googleCategory: '469',
  },
  {
    slug: 'tanning-bronzing',
    keywords: ['self tanner mousse', 'tanning drops', 'bronzing powder', 'tanning mitt', 'gradual tan lotion'],
    name: { en: 'Tanning & Bronzing', he: 'שיזוף עצמי וברונזרים' },
    desc: { en: 'Self-tanning products and bronzers for a sun-kissed glow', he: 'מוצרי שיזוף עצמי ומברונזרים לגוון שזוף' },
    icon: 'sun',
    googleCategory: '469',
  },
  {
    slug: 'body-butter',
    keywords: ['body butter cocoa', 'shea body cream', 'body lotion dry skin', 'whipped body butter', 'body oil'],
    name: { en: 'Body Butter', he: 'חמאת גוף' },
    desc: { en: 'Rich body butters and lotions for deep moisturization', he: 'חמאות גוף עשירות ותחליבים ללחות עמוקה' },
    icon: 'run',
    googleCategory: '469',
  },
  {
    slug: 'fragrance-oils',
    keywords: ['fragrance body oil', 'perfume oil roll-on', 'scented body lotion', 'massage oil', 'body shimmer oil'],
    name: { en: 'Fragrance Body Oils', he: 'שמני גוף ריחניים' },
    desc: { en: 'Perfumed body oils for silky scented skin', he: 'שמני גוף מבושמים לעור משיי וריחני' },
    icon: 'run',
    googleCategory: '469',
  },
];

export function getAllCollections() {
  return COLLECTIONS;
}

export function getCollection(slug: string) {
  return COLLECTIONS.find(c => c.slug === slug);
}

/** Lightweight list for nav menus (avoids shipping full collection defs to the client). */
export function getCollectionNavItems(lang = 'en'): Array<{ slug: string; name: string }> {
  return COLLECTIONS.filter((c) => c.name || c.tag)
    .map((c) => ({
      slug: c.slug,
      name:
        (c.name || c.tag || {})[lang] ||
        (c.name || c.tag || {}).en ||
        c.slug,
    }));
}