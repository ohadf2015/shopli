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
];

export function getAllCollections() {
  return COLLECTIONS;
}

export function getCollection(slug: string) {
  return COLLECTIONS.find(c => c.slug === slug);
}