export interface CollectionTheme {
  id: string;
  slug: string;
  name: Record<string, string>; // locale -> name
  description: Record<string, string>;
  image: string;
  searches: string[];          // keywords to search
  style: 'essentials' | 'outfit' | 'setup' | 'kit' | 'comparison';
}

// Curated collections — these are the *actual* product, not a generic feed
export const COLLECTIONS: CollectionTheme[] = [
  // ===== ENSEMBLES / OUTFITS =====
  {
    id: 'halloween-costume',
    slug: 'halloween-costume',
    name: {
      en: 'Halloween Costume Builder',
      he: 'בנה תחפושת ליל כל הקדושים',
      fr: 'Ensemble Costume Halloween',
      de: 'Halloween-Kostüm-Bausatz',
      es: 'Disfraz de Halloween Completo',
      it: 'Costume di Halloween Completo',
    },
    description: {
      en: 'Complete Halloween look — costume, wig, accessories, and makeup all in one place',
      he: 'מראה שלם לליל כל הקדושים — תחפושת, פאה, אביזרים ואיפור במקום אחד',
      fr: 'Look Halloween complet — costume, perruque, accessoires et maquillage en un seul endroit',
      de: 'Kompletter Halloween-Look — Kostüm, Perücke, Accessoires und Make-up an einem Ort',
      es: 'Look completo de Halloween — disfraz, peluca, accesorios y maquillaje en un solo lugar',
      it: 'Look Halloween completo — costume, parrucca, accessori e trucco in un unico posto',
    },
    image: 'halloween',
    searches: ['halloween costume', 'cosplay wig', 'halloween makeup', 'halloween accessories'],
    style: 'outfit',
  },
  {
    id: 'fitness-outfit',
    slug: 'fitness-outfit',
    name: {
      en: 'Home Gym Essentials',
      he: 'ציוד כושר לבית',
      fr: 'Équipement de Sport à Domicile',
      de: 'Fitnessausrüstung für Zuhause',
      es: 'Equipo de Gimnasio en Casa',
      it: 'Attrezzatura da Palestra a Casa',
    },
    description: {
      en: 'Everything you need for a home gym — from resistance bands to yoga mats to smart jump ropes',
      he: 'כל מה שצריך לחדר כושר ביתי — מרצועות התנגדות ועד מזרני יוגה',
      fr: 'Tout ce qu\'il faut pour une salle de sport à la maison',
      de: 'Alles für Ihr Heim-Fitnessstudio',
    },
    image: 'fitness',
    searches: ['fitness resistance bands', 'yoga mat', 'home gym equipment', 'jump rope smart'],
    style: 'essentials',
  },
  {
    id: 'home-office',
    slug: 'home-office',
    name: {
      en: 'Home Office Power Setup',
      he: 'משימה ביתית — הסטודיו המושלם',
      fr: 'Set Up Bureau à Domicile',
      de: 'Home-Office-Komplettlösung',
      es: 'Setup de Oficina en Casa',
      it: 'Configurazione Ufficio a Casa',
    },
    description: {
      en: 'Ergonomic desk, cable management, monitor stand — build a workspace you actually enjoy',
      he: 'שולחן ארגונומי, ניהול כבלים, מעמד למסך — בנה מרחב עבודה שכיף להיות בו',
      fr: 'Bureau ergonomique, gestion des câbles, support d\'écran',
      de: 'Ergonomischer Schreibtisch, Kabelmanagement, Monitorständer',
    },
    image: 'desk',
    searches: ['desk lamp LED', 'cable management desk', 'monitor stand', 'desk organizer', 'wireless charging pad', 'ergonomic wrist rest'],
    style: 'setup',
  },
  {
    id: 'kitchen-essentials',
    slug: 'kitchen-essentials',
    name: {
      en: 'Smart Kitchen Kit',
      he: 'מטבח חכם — כלי עבודה',
      fr: 'Cuisine Intelligente',
      de: 'Smarte Küchenhelfer',
      es: 'Cocina Inteligente',
      it: 'Cucina Intelligente',
    },
    description: {
      en: 'Gadgets that actually make cooking better — garlic presses, peelers, organizers, and more under €10',
      he: 'גאדג\'טים שבאמת משפרים את הבישול — מוציאי שום, קולפנים, מארגנים ועוד בלי לשבור חסכון',
      fr: 'Des gadgets qui améliorent vraiment la cuisine',
      de: 'Gadgets, die das Kochen wirklich besser machen',
    },
    image: 'kitchen',
    searches: ['kitchen gadgets vegetable', 'garlic press', 'kitchen organizer', 'fruit peeler'],
    style: 'essentials',
  },
  {
    id: 'smart-home-starter',
    slug: 'smart-home-starter',
    name: {
      en: 'Smart Home Starter Pack',
      he: 'ערכת בית חכם למתחילים',
      fr: 'Pack Maison Connectée',
      de: 'Smart-Home-Einsteigerpaket',
      es: 'Pack Hogar Inteligente',
      it: 'Pacchetto Casa Intelligente',
    },
    description: {
      en: 'Start your smart home — WiFi plugs, doorbells, sensors, all under €30 total',
      he: 'התחל בית חכם — שקעי WiFi, פעמון דלת, חיישנים — הכל בפחות מ-₪100',
      fr: 'Démarrez votre maison connectée',
      de: 'Starten Sie Ihr Smart Home',
    },
    image: 'smarthome',
    searches: ['Tuya smart plug EU', 'wireless doorbell', 'smart sensor WiFi', 'smart LED strip'],
    style: 'kit',
  },
  {
    id: 'travel-kit',
    slug: 'travel-kit',
    name: {
      en: 'Smart Travel Kit',
      he: 'ערכת טיולים חכמה',
      fr: 'Kit Voyage Malin',
      de: 'Smartes Reiseset',
      es: 'Kit de Viaje Inteligente',
      it: 'Kit da Viaggio Intelligente',
    },
    description: {
      en: 'Packing cubes, travel adapters, portable charger, and everything else for stress-free trips',
      he: 'קוביות אריזה, מתאם נסיעות, מטען נייד ועוד — לטיול בלי דאגות',
      fr: 'Cubes de rangement, adaptateur voyage, chargeur portable',
      de: 'Packwürfel, Reiseadapter, Powerbank',
    },
    image: 'travel',
    searches: ['travel adapter universal', 'packing cubes', 'portable charger 20000mAh', 'travel organizer'],
    style: 'kit',
  },
  {
    id: 'camping-gear',
    slug: 'camping-gear',
    name: {
      en: 'Camping Kit Under €50',
      he: 'ציוד קמפינג בפחות מ-₪200',
      fr: 'Kit Camping à Moins de 50€',
      de: 'Camping-Set unter 50€',
      es: 'Kit de Camping por menos de 50€',
      it: 'Kit da Campeggio sotto i 50€',
    },
    description: {
      en: 'Portable tent, sleeping bag, camping fan, headlamp — everything you need for a night under the stars',
      he: 'אוהל נייד, שק שינה, מאוורר קמפינג, פנס ראש — כל מה שצריך ללילה תחת הכוכבים',
      fr: 'Tente portable, sac de couchage, ventilateur de camping',
      de: 'Tragbares Zelt, Schlafsack, Campingventilator',
    },
    image: 'camping',
    searches: ['camping tent 2 person', 'sleeping bag portable', 'camping fan', 'headlamp rechargeable'],
    style: 'kit',
  },
  {
    id: 'car-accessories',
    slug: 'car-accessories',
    name: {
      en: 'Car Gadgets Under €10',
      he: 'גאדג\'טים לרכב בפחות מ-₪40',
      fr: 'Gadgets Auto à Moins de 10€',
      de: 'Auto-Gadgets unter 10€',
      es: 'Gadgets para Coche por menos de 10€',
      it: 'Gadget per Auto sotto i 10€',
    },
    description: {
      en: 'Phone holder, cleaning kit, trunk organizer — small upgrades that make a huge difference',
      he: 'מחזיק פלאפון, ערכת ניקוי, מארגן תא מטען',
      fr: 'Support téléphone, kit nettoyage, organiseur de coffre',
    },
    image: 'car',
    searches: ['car phone holder', 'microfiber cleaning cloth car', 'car trunk organizer', 'car interior cleaner'],
    style: 'essentials',
  },
  {
    id: 'pet-essentials',
    slug: 'pet-essentials',
    name: {
      en: 'Pet Care Essentials',
      he: 'ציוד לחיות מחמד',
      fr: 'Essentiels pour Animaux',
      de: 'Haustier-Zubehör',
      es: 'Esenciales para Mascotas',
      it: 'Essenziali per Animali Domestici',
    },
    description: {
      en: 'Leashes, toys, grooming tools, and poop bags — everything your furry friend needs',
      he: 'רצועות, צעצועים, כלי טיפוח',
    },
    image: 'pet',
    searches: ['dog leash strong', 'cat toy interactive', 'pet grooming brush', 'dog poop bags'],
    style: 'essentials',
  },
  {
    id: 'desk-lighting',
    slug: 'desk-lighting',
    name: {
      en: 'Desk Lighting & Ambience',
      he: 'תאורה אווירה לשולחן',
      fr: 'Éclairage de Bureau',
      de: 'Schreibtischbeleuchtung',
      es: 'Iluminación de Escritorio',
      it: 'Illuminazione da Scrivania',
    },
    description: {
      en: 'LED desk lamps, smart light strips, monitor backlights — set the perfect mood for work or gaming',
      he: 'מנורות לד, פסי תאורה חכמים, תאורה אחורית למסך',
    },
    image: 'lighting',
    searches: ['LED desk lamp USB', 'monitor backlight LED', 'smart LED light strip', 'ambient light bedroom'],
    style: 'essentials',
  },
];

export function getCollections(locale: string) {
  return COLLECTIONS.map(c => ({
    ...c,
    name: c.name[locale] || c.name.en,
    description: c.description[locale] || c.description.en,
    searchQueries: c.searches,
  }));
}

export function getCollection(slug: string) {
  return COLLECTIONS.find(c => c.slug === slug);
}