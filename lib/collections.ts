export interface CollectionDef {
  slug: string;
  keywords: string[];
  name: Record<string, string>;
  desc: Record<string, string>;
  icon: string;
}

export const COLLECTIONS: CollectionDef[] = [
  {
    slug: 'halloween',
    keywords: ['halloween costume', 'cosplay wig', 'halloween accessories', 'halloween makeup'],
    name: { en: 'Halloween Costumes', he: 'תחפושות ליל כל הקדושים', fr: 'Costumes Halloween', de: 'Halloween Kostüme', es: 'Disfraces Halloween', it: 'Costumi Halloween' },
    desc: { en: 'Complete your look — costume, wig, makeup & accessories', he: 'תחפושת שלמה עם פאה, איפור ואביזרים', fr: 'Look Halloween complet — costume, perruque, maquillage', de: 'Kompletter Look — Kostüm, Perücke, Make-up', es: 'Look completo — disfraz, peluca, maquillaje', it: 'Look completo — costume, parrucca, trucco' },
    icon: 'mask',
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
    name: { en: 'Desk Setup', he: 'משימה ביתית', fr: 'Bureau Domicile', de: 'Schreibtisch-Setup', es: 'Setup de Escritorio', it: 'Set up Scrivania' },
    desc: { en: 'Ergonomic desk gear, cable management & lighting', he: 'ציוד ארגונומי, ניהול כבלים ותאורה', fr: 'Équipement ergonomique, gestion des câbles', de: 'Ergonomisch, Kabelmanagement & Beleuchtung', es: 'Equipo ergonómico, gestión de cables', it: 'Attrezzatura ergonomica, gestione cavi' },
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
    name: { en: 'Summer Essentials', he: 'קיץ הכרחי', fr: 'Essentiels Ete', de: 'Sommer-Essentials', es: 'Esenciales de Verano', it: 'Essenziali Estivi' },
    desc: { en: 'Beat the heat — fans, beach gear, hydration & sun protection', he: 'מניפות, ציוד חוף, הידרציה והגנה מהשמש', fr: 'Ventilateurs, plage, hydratation & protection solaire', de: 'Ventilatoren, Strand, Hydration & Sonnenschutz', es: 'Ventiladores, playa, hidratacion', it: 'Ventilatori, spiaggia, idratazione' },
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
    name: { en: 'Coffee Ritual', he: 'פולחן קפה', fr: 'Rituel Café', de: 'Kaffeeritual', es: 'Ritual del Café', it: 'Rituale del Caffè' },
    desc: { en: 'Brew barista-quality coffee at home under €60', he: 'קפה באיכות בריסטה בבית בפחות מ-₪250', fr: 'Café de barista à domicile à moins de 60€', de: 'Barista-Qualität zu Hause unter 60€', es: 'Café de barista en casa por menos de 60€', it: 'Caffè da bar a casa sotto i 60€' },
    icon: 'chef',
  },
  {
    slug: 'content-creator',
    keywords: ['wireless lavalier microphone', 'ring light with tripod', 'phone gimbal stabilizer', 'LED ring light 10'],
    name: { en: 'Content Creator Kit', he: 'ערכת קריאייטיב', fr: 'Kit Créateur', de: 'Creator-Set', es: 'Kit Creador', it: 'Kit Creator' },
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
    name: { en: 'Gadgets Under €10', he: 'גאדג\'טים ב-₪40', fr: 'Gadgets à Moins de 10€', de: 'Gadgets unter 10€', es: 'Gadgets por menos de 10€', it: 'Gadget Sotto i 10€' },
    desc: { en: 'Smart little tools under €10 that make daily life easier', he: 'כלים קטנים וחכמים בפחות מ-₪40 שמקלים על החיים', fr: 'Petits outils malins à moins de 10€', de: 'Clevere kleine Helfer unter 10€', es: 'Pequeñas herramientas inteligentes por menos de 10€', it: 'Piccoli strumenti intelligenti sotto 10€' },
    icon: 'bulb',
  },
];

export function getAllCollections() {
  return COLLECTIONS;
}

export function getCollection(slug: string) {
  return COLLECTIONS.find(c => c.slug === slug);
}