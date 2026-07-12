// Niche mood boards — ultra-specific "build this look/setup" pages
// Each is a complete outfit, kit, room design, or setup with items that go together

export interface MoodBoardItem {
  keywords: string[];
  caption: Record<string, string>;
  note?: Record<string, string>;
}

export interface MoodBoard {
  slug: string;
  metaTitle: Record<string, string>;
  metaDesc: Record<string, string>;
  h1: Record<string, string>;
  intro: Record<string, string>;
  items: MoodBoardItem[];
  totalEstimate?: Record<string, string>;
  faq?: { q: Record<string, string>; a: Record<string, string> }[];
  tags: string[];
}

export const MOOD_BOARDS: Record<string, MoodBoard> = {

  // ====== ROOM DESIGN — specific aesthetic rooms ======

  'japandi-office': {
    slug: 'japandi-office',
    metaTitle: { en: 'Japandi Home Office: Minimalist Workspace Under €80', he: 'משרד ביתי בסגנון יפנדי: מרחב עבודה מינימליסטי בפחות מ-₪320' },
    metaDesc: { en: 'Design a serene Japandi workspace: bamboo desk organizer, wooden monitor stand, paper lamp, ceramic planter, linen cushion & minimalist clock.', he: 'לעצב חלל עבודה יפנדי שליו: מארגן שולחן במבוק, מעמד צג מעץ, מנורת נייר, עציץ קרמי, כרית פשתן ושעון מינימליסטי.' },
    h1: { en: 'Design a Japandi Home Office Under €80', he: 'משרד ביתי יפנדי בפחות מ-₪320' },
    intro: { en: 'Japandi combines Japanese minimalism with Scandinavian warmth — clean lines, natural materials, and a calm color palette. Here is how to transform your desk into a serene workspace.', he: 'יפנדי משלב מינימליזם יפני עם חמימות סקנדינבית — קווים נקיים, חומרים טבעיים ופלטת צבעים רגועה. הנה איך להפוך את השולחן שלכם לחלל עבודה שליו.' },
    tags: ['room-design', 'desk', 'home-office', 'scandinavian'],
    items: [
      { keywords: ['bamboo desk organizer', 'natural wood pen holder'], caption: { en: 'Bamboo Desk Organizer', he: 'מארגן שולחן במבוק' } },
      { keywords: ['wooden monitor stand riser', 'bamboo laptop stand'], caption: { en: 'Wooden Monitor Stand', he: 'מעמד צג מעץ' } },
      { keywords: ['washi paper lamp', 'rice paper desk lamp'], caption: { en: 'Washi Paper Desk Lamp', he: 'מנורת נייר ואשי' } },
      { keywords: ['ceramic desk planter', 'minimalist flower vase'], caption: { en: 'Ceramic Desk Planter', he: 'עציץ קרמי לשולחן' } },
      { keywords: ['linen desk mat', 'natural cotton mouse pad'], caption: { en: 'Linen Desk Mat', he: 'משטח שולחן פשתן' } },
      { keywords: ['minimalist wall clock silent', 'wooden clock modern'], caption: { en: 'Minimalist Wall Clock', he: 'שעון קיר מינימליסטי' } },
    ],
    totalEstimate: { en: 'Full Japandi setup: ~€50-80', he: 'עיצוב יפנדי שלם: ~₪200-320' },
    faq: [
      { q: { en: 'What colors work for Japandi?', he: 'איזה צבעים מתאימים ליפנדי?' }, a: { en: 'Stick to warm whites, beige, soft wood tones, and muted green from plants. Avoid bright colors.', he: 'היצמדו ללבנים חמים, בז\', גווני עץ רכים וירוק עמום מעציצים. הימנעו מצבעים בהירים.' } },
    ],
  },

  'gamer-den': {
    slug: 'gamer-den',
    metaTitle: { en: 'Ultimate Gamer Den: RGB Gaming Setup Under €120', he: 'פינת גיימרינג אולטימטיבית: עמדת משחק RGB בפחות מ-₪480' },
    metaDesc: { en: 'Build the ultimate gaming setup: RGB LED strips, gaming chair, XL mouse pad, monitor stand, cable sleeve, and desk shelf.', he: 'בנו את עמדת המשחק האולטימטיבית: פסי RGB, כיסא גיימינג, משטח עכבר ענק, מעמד צג, ארגון כבלים ומדף שולחן.' },
    h1: { en: 'Build the Ultimate RGB Gaming Den Under €120', he: 'פינת גיימרינג RGB מושלמת בפחות מ-₪480' },
    intro: { en: 'A proper gaming setup is about atmosphere as much as hardware. RGB lighting, a comfortable chair, and clean cable management turn any corner into a gaming sanctuary.', he: 'עמדת משחק טובה היא עניין של אווירה לא פחות מחומרה. תאורת RGB, כיסא נוח וניהול כבלים מסודר הופכים כל פינה למקדש משחקים.' },
    tags: ['room-design', 'gaming', 'desk', 'tech'],
    items: [
      { keywords: ['gaming RGB LED strip', 'smart LED strip wifi'], caption: { en: 'RGB LED Strip (5m)', he: 'פס תאורת RGB (5 מטר)' }, note: { en: 'Get the app-controlled version', he: 'קחו את הגרסה הנשלטת באפליקציה' } },
      { keywords: ['gaming chair ergonomic', 'racing style desk chair'], caption: { en: 'Gaming Chair', he: 'כיסא גיימינג' } },
      { keywords: ['XL gaming mouse pad', 'extended desk mat RGB'], caption: { en: 'XL Gaming Mouse Pad (90x40cm)', he: 'משטח עכבר ענק (90x40 ס"מ)' } },
      { keywords: ['monitor arm stand', 'gas spring monitor mount'], caption: { en: 'Monitor Arm / Mount', he: 'זרוע צג / מעמד' } },
      { keywords: ['cable management sleeve', 'cable raceway kit'], caption: { en: 'Cable Management Kit', he: 'ערכת ניהול כבלים' } },
      { keywords: ['desk shelf riser', 'monitor desk shelf'], caption: { en: 'Desk Shelf / Riser', he: 'מדף שולחן / הגבהה' } },
    ],
    totalEstimate: { en: 'Full Gamer Den: ~€80-120', he: 'פינת גיימרינג מלאה: ~₪320-480' },
  },

  'boho-bedroom': {
    slug: 'boho-bedroom',
    metaTitle: { en: 'Boho Bedroom Makeover: Cozy Aesthetic Under €50', he: 'עיצוב חדר בוהו: אווירה נעימה בפחות מ-₪200' },
    metaDesc: { en: 'Transform your bedroom with boho style: macrame wall hanging, tassel blanket, woven rug, fairy lights, floor cushion & dream catcher.', he: 'לשדרג את חדר השינה בסגנון בוהו: תליית מקרמה, שמיכת ציציות, שטיח ארוג, אורות פיות, כרית רצפה ולוכד חלומות.' },
    h1: { en: 'Boho Bedroom Makeover Under €50', he: 'עיצוב חדר בוהו בפחות מ-₪200' },
    intro: { en: 'Bohemian style is all about texture, warmth, and personality. Layer natural materials, soft lighting, and handmade details to create a bedroom that feels like a creative retreat.', he: 'סגנון בוהמי הוא כולו טקסטורה, חמימות ואישיות. שלבו חומרים טבעיים, תאורה רכה ופרטים בעבודת יד ליצירת חדר שינה שמרגיש כמו מפלט יצירתי.' },
    tags: ['room-design', 'bedroom', 'boho'],
    items: [
      { keywords: ['macrame wall hanging', 'macrame tapestry'], caption: { en: 'Macrame Wall Hanging', he: 'תליית קיר מקרמה' } },
      { keywords: ['tassel throw blanket', 'fringe knitted blanket'], caption: { en: 'Tassel Throw Blanket', he: 'שמיכת ציציות' } },
      { keywords: ['woven round rug', 'braided cotton rug'], caption: { en: 'Woven Round Rug', he: 'שטיח עגול ארוג' } },
      { keywords: ['curtain fairy lights', 'warm string lights'], caption: { en: 'Warm Fairy Lights', he: 'אורות פיות חמים' } },
      { keywords: ['floor cushion pouf', 'meditation floor pillow'], caption: { en: 'Floor Cushion / Pouf', he: 'כרית רצפה / פוף' } },
      { keywords: ['dream catcher feather', 'boho dream catcher'], caption: { en: 'Feather Dream Catcher', he: 'לוכד חלומות נוצות' } },
    ],
    totalEstimate: { en: 'Full boho makeover: ~€30-50', he: 'עיצוב בוהו מלא: ~₪120-200' },
  },

  'scandinavian-reading-nook': {
    slug: 'scandinavian-reading-nook',
    metaTitle: { en: 'Scandinavian Reading Nook: Cozy Corner Under €60', he: 'פינת קריאה סקנדינבית: פינה נעימה בפחות מ-₪240' },
    metaDesc: { en: 'Create a hygge reading corner: floor lamp, armchair, blanket, side table, book stand, and candle holder set.', he: 'יצירת פינת קריאה הייג\'ית: מנורת רצפה, כורסה, שמיכה, שולחן צד, מעמד ספרים וסט פמוטים.' },
    h1: { en: 'Design a Scandinavian Reading Nook Under €60', he: 'פינת קריאה סקנדינבית בפחות מ-₪240' },
    intro: { en: 'Hygge is about creating warm, cozy corners where you can escape with a book. Soft lighting, a comfortable chair, and natural textures are all you need.', he: 'הייג\'ה זה ליצור פינות חמות ונעימות שאפשר לברוח אליהן עם ספר. תאורה רכה, כיסא נוח ומרקמים טבעיים — זה כל מה שצריך.' },
    tags: ['room-design', 'scandinavian', 'hygge'],
    items: [
      { keywords: ['floor lamp reading', 'arc floor lamp modern'], caption: { en: 'Arc Floor Lamp', he: 'מנורת קשת רצפה' } },
      { keywords: ['armchair cozy', 'comfy reading chair'], caption: { en: 'Cozy Armchair', he: 'כורסה נעימה' } },
      { keywords: ['knitted throw blanket', 'chunky knit blanket'], caption: { en: 'Knitted Throw Blanket', he: 'שמיכה סרוגה' } },
      { keywords: ['small side table', 'C table sofa lap desk'], caption: { en: 'C Table / Side Table', he: 'שולחן צד / C-טייבל' } },
      { keywords: ['book stand acrylic', 'cookbook holder reading'], caption: { en: 'Book Stand', he: 'מעמד ספרים' } },
      { keywords: ['candle holder set', 'tealight holder ceramic'], caption: { en: 'Candle Holder Set', he: 'סט פמוטים' } },
    ],
    totalEstimate: { en: 'Full nook: ~€40-60', he: 'פינה שלמה: ~₪160-240' },
  },

  'indoor-jungle': {
    slug: 'indoor-jungle',
    metaTitle: { en: 'Indoor Jungle Room: Home Plant Corner Under €40', he: 'ג\'ונגל ביתי: פינת צמחים בפחות מ-₪160' },
    metaDesc: { en: 'Build an indoor jungle: macrame plant hangers, shelf, watering can, mister, ceramic pots, and grow light.', he: 'לבנות ג\'ונגל ביתי: תליוני צמחים מקרמה, מדף, מזלף, מרסס, עציצים קרמיים ונורת גידול.' },
    h1: { en: 'Create an Indoor Jungle Corner Under €40', he: 'ג\'ונגל ביתי בפחות מ-₪160' },
    intro: { en: 'An indoor jungle turns any room into a living, breathing space. With the right pots, hangers, and lighting, you can create a lush plant corner that thrives.', he: 'ג\'ונגל ביתי הופך כל חדר לחלל חי ונושם. עם העציצים, התליונים והתאורה הנכונים, אפשר ליצור פינת צמחים שופעת שמשגשגת.' },
    tags: ['room-design', 'plants', 'indoor'],
    items: [
      { keywords: ['macrame plant hanger', 'plant hanger rope'], caption: { en: 'Macrame Plant Hanger (2pk)', he: 'תליון צמחים מקרמה (זוג)' } },
      { keywords: ['plant shelf wall', 'floating shelf plants'], caption: { en: 'Plant Wall Shelf', he: 'מדף צמחים לקיר' } },
      { keywords: ['ceramic plant pot set', 'terracotta pot with tray'], caption: { en: 'Ceramic Plant Pots (3pk)', he: 'עציצים קרמיים (3 יחידות)' } },
      { keywords: ['plant mister spray bottle', 'misting bottle glass'], caption: { en: 'Plant Mister (Glass)', he: 'מרסס צמחים מזכוכית' } },
      { keywords: ['watering can indoor', 'small watering can metal'], caption: { en: 'Indoor Watering Can', he: 'מזלף פנימי' } },
      { keywords: ['grow light LED', 'plant growing lamp'], caption: { en: 'LED Grow Light', he: 'נורת גידול לד' } },
    ],
    totalEstimate: { en: 'Indoor jungle: ~€25-40', he: 'ג\'ונגל ביתי: ~₪100-160' },
  },

  // ====== MORE PURIM / COSTUMES ======

  'spiderman': {
    slug: 'spiderman',
    metaTitle: { en: 'Spider-Man Costume: Complete Superhero Look Under €25', he: 'תחפושת ספיידרמן: מראה גיבור על שלם בפחות מ-₪100' },
    metaDesc: { en: 'Every piece for an amazing Spider-Man costume: bodysuit, mask, web shooters, lens frames, gloves, and shoe covers.', he: 'כל חלק לתחפושת ספיידרמן מדהימה: חליפה, מסכה, מטילי קורים, עדשות, כפפות וכיסויי נעליים.' },
    h1: { en: 'Spider-Man: Complete Superhero Costume Under €25', he: 'ספיידרמן: תחפושת גיבור על שלמה בפחות מ-₪100' },
    intro: { en: 'Spider-Man is the most popular superhero costume for good reason — it is recognizable, cool, and surprisingly easy to assemble. Here is the complete look.', he: 'ספיידרמן היא תחפושת גיבור העל הפופולרית ביותר מסיבה טובה — היא מזוהה, מגניבה ומפתיע שקל להרכיב. הנה המראה השלם.' },
    tags: ['purim', 'costume', 'halloween', 'superhero'],
    items: [
      { keywords: ['spiderman bodysuit costume', 'spider man full suit'], caption: { en: 'Spider-Man Bodysuit', he: 'חליפת ספיידרמן' } },
      { keywords: ['spiderman mask mask', 'spider man cosplay mask'], caption: { en: 'Spider-Man Mask (Lens)', he: 'מסכת ספיידרמן' } },
      { keywords: ['spiderman web shooter', 'spider man glove launcher'], caption: { en: 'Web Shooter Gloves', he: 'כפפות מטילי קורים' } },
      { keywords: ['spiderman shoe covers', 'cosplay shoe covers spandex'], caption: { en: 'Shoe Covers', he: 'כיסויי נעליים' } },
    ],
    totalEstimate: { en: 'Full costume: ~€15-25', he: 'תחפושת שלמה: ~₪60-100' },
  },

  'wonder-woman': {
    slug: 'wonder-woman',
    metaTitle: { en: 'Wonder Woman Costume: Amazon Warrior Look Under €30', he: 'תחפושת וונדר וומן: מראה לוחמת אמזונות בפחות מ-₪120' },
    metaDesc: { en: 'Complete Wonder Woman cosplay: bodice armor, skirt, tiara, bracelets, lasso, boots and sword.', he: 'קוספליי וונדר וומן מלא: שריון גוף, חצאית, נזר, צמידים, לאסו, מגפיים וחרב.' },
    h1: { en: 'Wonder Woman Costume: Warrior Princess Under €30', he: 'תחפושת וונדר וומן: נסיכה לוחמת בפחות מ-₪120' },
    intro: { en: 'Wonder Woman is a Purim classic in Israel. Here is the full Amazon warrior look — from the golden tiara to the Lasso of Truth — assembled from affordable AliExpress pieces.', he: 'וונדר וומן היא קלאסיקה בפורים בישראל. הנה מראה הלוחמת אמזונות המלא — מהנזר המוזהב ועד הלאסו של האמת — המורכב מפריטים משתלמים מאליאקספרס.' },
    tags: ['purim', 'costume', 'superhero', 'halloween'],
    items: [
      { keywords: ['wonder woman costume bodice', 'amazon warrior armor top'], caption: { en: 'Bodice / Armor Top', he: 'שריון עליון' } },
      { keywords: ['wonder woman skirt costume', 'gold armored skirt'], caption: { en: 'Armored Skirt', he: 'חצאית שריון' } },
      { keywords: ['wonder woman tiara crown', 'gold headpiece warrior'], caption: { en: 'Golden Tiara Crown', he: 'נזר זהב/כתר' } },
      { keywords: ['wonder woman bracelets', 'gold gauntlets costume'], caption: { en: 'Gauntlets / Bracelets', he: 'צמידי קרב' } },
      { keywords: ['lasso of truth prop', 'golden rope costume'], caption: { en: 'Lasso of Truth', he: 'לאסו של האמת' } },
      { keywords: ['wonder woman boots costume', 'gladiator boots gold'], caption: { en: 'Gold Warrior Boots', he: 'מגפיים מוזהבים' } },
    ],
    totalEstimate: { en: 'Full Wonder Woman: ~€20-30', he: 'וונדר וומן שלמה: ~₪80-120' },
  },

  'ninja-turtle': {
    slug: 'ninja-turtle',
    metaTitle: { en: 'Ninja Turtle Costume: Heroes in a Half Shell Under €20', he: 'תחפושת צבי נינג\'ה: גיבורי חצי קליפה בפחות מ-₪80' },
    metaDesc: { en: 'Build a Teenage Mutant Ninja Turtle costume: shell, mask, eye bandana, knee pads, weapon set and green bodysuit.', he: 'לבנות תחפושת צבי נינג\'ה: שריון גב, מסכה, בנדנה, מגני ברכיים, סט נשקים וחליפה ירוקה.' },
    h1: { en: 'Ninja Turtle Costume: Hero in a Half Shell Under €20', he: 'תחפושת צב נינג\'ה: גיבור חצי קליפה בפחות מ-₪80' },
    intro: { en: 'Cowabunga! Leonardo, Michelangelo, Donatello or Raphael — pick your turtle and build the costume with a shell, mask, and weapons. Perfect for Purim groups of 4.', he: 'קאו-באנגה! לאונרדו, מיכלאנג\'לו, דונטלו או רפאל — ב�רו צב ובנו תחפושת עם שריון, מסכה ונשקים. מושלם לקבוצות של 4 בפורים.' },
    tags: ['purim', 'costume', 'halloween', 'kids'],
    items: [
      { keywords: ['ninja turtle shell prop', 'turtle shell backpack'], caption: { en: 'TMNT Shell Backpack', he: 'שריון צב/תיק גב' } },
      { keywords: ['ninja turtle mask bandana', 'tmnt eye mask'], caption: { en: 'Eye Mask / Bandana', he: 'מסכת עיניים/בנדנה' } },
      { keywords: ['green bodysuit morphsuit', 'green long sleeve shirt'], caption: { en: 'Green Bodysuit', he: 'חליפה ירוקה' } },
      { keywords: ['ninja weapon set toy', 'plastic ninja sword nunchucks'], caption: { en: 'Weapon Set (Sword/Nunchucks)', he: 'סט נשקים (חרב/נונצ\'קו)' } },
      { keywords: ['knee pad elbow pad set', 'protective pads kids'], caption: { en: 'Knee & Elbow Pads', he: 'מגני ברכיים ומרפקים' } },
    ],
    totalEstimate: { en: 'Full costume: ~€15-20', he: 'תחפושת שלמה: ~₪60-80' },
    faq: [
      { q: { en: 'How do I pick my turtle color?', he: 'איך בוחרים את צבע הצב?' }, a: { en: 'Red bandana = Raphael (sai), Blue = Leonardo (katanas), Purple = Donatello (bo staff), Orange = Michelangelo (nunchucks).', he: 'בנדנה אדומה = רפאל, כחול = לאונרדו, סגול = דונטלו, כתום = מיכלאנג\'לו.' } },
    ],
  },

  'superman': {
    slug: 'superman',
    metaTitle: { en: 'Superman Costume: Classic Man of Steel Under €25', he: 'תחפושת סופרמן: איש הפלדה הקלאסי בפחות מ-₪100' },
    metaDesc: { en: 'Complete Superman costume: bodysuit, cape, chest emblem, boots, belt and cuffs. The iconic look.', he: 'תחפושת סופרמן מלאה: חליפה, גלימה, סמל חזה, מגפיים, חגורה וצמידים. המראה האייקוני.' },
    h1: { en: 'Superman: The Complete Man of Steel Under €25', he: 'סופרמן: איש הפלדה השלם בפחות מ-₪100' },
    intro: { en: 'There is no more iconic superhero than Superman. Build the full look — blue bodysuit, red cape, and the famous \u2018S\u2019 shield — and fly into Purim.', he: 'אין גיבור על אייקוני יותר מסופרמן. בנו את המראה המלא — חליפה כחולה, גלימה אדומה ומגן ה-S המפורסם — ועפו לתוך פורים.' },
    tags: ['purim', 'costume', 'superhero', 'halloween'],
    items: [
      { keywords: ['superman costume men', 'superman suit spandex'], caption: { en: 'Superman Bodysuit', he: 'חליפת סופרמן' } },
      { keywords: ['superman cape red', 'superhero cape satin'], caption: { en: 'Red Cape', he: 'גלימה אדומה' }, note: { en: 'Get the satin one, it drapes better', he: 'קחו מבד סאטן, היא נופלת יפה יותר' } },
      { keywords: ['superman chest emblem shield', 'S shield patch'], caption: { en: 'S Shield Emblem', he: 'סמל S על החזה' } },
      { keywords: ['superman boots cosplay', 'red blue boot covers'], caption: { en: 'Superman Boot Covers', he: 'כיסויי מגפיים' } },
      { keywords: ['superman belt buckle', 'gold belt hero'], caption: { en: 'Gold Belt / Buckle', he: 'חגורת זהב/אבזם' } },
    ],
    totalEstimate: { en: 'Full Superman: ~€15-25', he: 'סופרמן שלם: ~₪60-100' },
  },

  // ====== MORE NICHE KITS / SETUPS ======

  'digital-nomad': {
    slug: 'digital-nomad',
    metaTitle: { en: 'Digital Nomad Kit: Remote Work Anywhere Under €60', he: 'ערכת נווד דיגיטלי: לעבוד מרחוק מכל מקום בפחות מ-₪240' },
    metaDesc: { en: 'Everything a digital nomad needs: universal adapter, power bank, laptop stand, packing cubes, cable organizer, and travel mouse.', he: 'כל מה שנווד דיגיטלי צריך: מתאם אוניברסלי, בנק כוח, מעמד למחשב, קוביות אריזה, מארגן כבלים ועכבר נייד.' },
    h1: { en: 'Digital Nomad Kit: Work From Anywhere Under €60', he: 'ערכת נווד דיגיטלי: לעבוד מכל מקום בפחות מ-₪240' },
    intro: { en: 'Working from cafes, co-working spaces, or the beach requires a curated kit. These compact essentials let you set up a productive workspace anywhere in the world.', he: 'עבודה מבתי קפה, חללי עבודה משותפים או החוף דורשת ערכה מתוכננת. המוצרים הקומפקטיים האלה יאפשרו לכם להקים מרחב עבודה פרודוקטיבי בכל מקום בעולם.' },
    tags: ['travel', 'desk', 'tech'],
    items: [
      { keywords: ['universal travel adapter', 'international power adapter'], caption: { en: 'Universal Travel Adapter', he: 'מתאם נסיעות אוניברסלי' } },
      { keywords: ['power bank 20000mAh', 'fast charging portable charger'], caption: { en: '20000mAh Power Bank', he: 'בנק כוח 20000mAh' } },
      { keywords: ['laptop stand portable', 'foldable laptop riser'], caption: { en: 'Foldable Laptop Stand', he: 'מעמד מתקפל למחשב' } },
      { keywords: ['packing cubes set', 'travel organizer cubes'], caption: { en: 'Packing Cubes (3-4 set)', he: 'קוביות אריזה (3-4 יחידות)' } },
      { keywords: ['cable organizer case', 'electronic organizer bag'], caption: { en: 'Cable Organizer Case', he: 'מארגן כבלים' } },
      { keywords: ['travel mouse wireless', 'portable mouse slim'], caption: { en: 'Slim Travel Mouse', he: 'עכבר נייד דק' } },
    ],
    totalEstimate: { en: 'Full nomad kit: ~€35-60', he: 'ערכה מלאה: ~₪140-240' },
  },

  'streaming-setup': {
    slug: 'streaming-setup',
    metaTitle: { en: 'Game Streaming Setup: Go Live Under €60', he: 'עמדת סטרימינג: לשדר בשידור חי בפחות מ-₪240' },
    metaDesc: { en: 'Everything to start streaming: ring light, USB mic, phone tripod, RGB strip, capture card, and streaming chat display.', he: 'כל מה שצריך כדי להתחיל לשדר: תאורת טבעת, מיקרופון USB, חצובה לפלאפון, פס RGB, כרטיס לכידה ותצוגת צ\'אט.' },
    h1: { en: 'Game Streaming Setup: Go Live Under €60', he: 'עמדת סטרימינג: לשדר בשידור חי בפחות מ-₪240' },
    intro: { en: 'Starting a stream does not require a huge budget. Ring light for pro lighting, USB mic for clear audio, and a capture card for console gameplay. Here is everything you need.', he: 'כדי להתחיל לשדר לא צריך תקציב ענק. תאורת טבעת לתאורה מקצועית, מיקרופון USB לאודיו נקי וכרטיס לכידה לקונסולה. הנה כל מה שצריך.' },
    tags: ['desk', 'gaming', 'tech'],
    items: [
      { keywords: ['ring light 10 inch', 'professional ring light stand'], caption: { en: 'Ring Light (10\u201d + Tripod)', he: 'תאורת טבעת 10" + חצובה' } },
      { keywords: ['USB microphone condenser', 'podcast mic gaming'], caption: { en: 'USB Condenser Mic', he: 'מיקרופון קונדנסר USB' }, note: { en: 'Dynamic mic is better if your room is noisy', he: 'מיקרופון דינמי עדיף אם החדר רועש' } },
      { keywords: ['phone tripod stand', 'flexible phone holder'], caption: { en: 'Phone Tripod / Stand', he: 'חצובת פלאפון' } },
      { keywords: ['HDMI capture card', 'USB video capture'], caption: { en: 'HDMI Capture Card', he: 'כרטיס לכידה HDMI' } },
      { keywords: ['RGB LED strip', 'usb led strip monitor'], caption: { en: 'Monitor RGB Backlight', he: 'תאורת RGB מאחורי המסך' } },
      { keywords: ['stream deck alternative', 'macro keypad programmable'], caption: { en: 'Macro Keypad / Stream Deck', he: 'מקלדת מאקרו לסטרימינג' } },
    ],
    totalEstimate: { en: 'Full streaming: ~€40-60', he: 'סטרימינג מלא: ~₪160-240' },
  },

  'dessert-baking': {
    slug: 'dessert-baking',
    metaTitle: { en: 'Dessert Baking Kit: Bake Like a Pro Under €30', he: 'ערכת אפיית קינוחים: לאפות כמו מקצוען בפחות מ-₪120' },
    metaDesc: { en: 'Every baking tool you need: mixing bowls, hand mixer, measuring cups, piping set, silicone mat and cooling rack.', he: 'כל כלי האפייה שצריך: קערות ערבוב, מיקסר ידני, כוסות מדידה, צנרת, משטח סיליקון ורשת קירור.' },
    h1: { en: 'Dessert Baking Kit Under €30', he: 'ערכת אפיית קינוחים בפחות מ-₪120' },
    intro: { en: 'Fresh cookies, fluffy cakes, perfect cupcakes — the right tools make all the difference. Here is the complete baking starter kit for anyone who loves dessert.', he: 'עוגיות טריות, עוגות אווריריות, קאפקייקס מושלמים — הכלים הנכונים עושים את כל ההבדל. ערכת אפייה למתחילים למי שאוהב קינוחים.' },
    tags: ['kitchen', 'cooking', 'dessert'],
    items: [
      { keywords: ['mixing bowl set stainless steel', 'nesting bowls kitchen'], caption: { en: 'Stainless Mixing Bowl Set', he: 'סט קערות ערבוב מנירוסטה' } },
      { keywords: ['electric hand mixer', 'stand mixer hand'], caption: { en: 'Electric Hand Mixer', he: 'מיקסר ידני חשמלי' } },
      { keywords: ['measuring cups spoons set', 'kitchen measuring set'], caption: { en: 'Measuring Cups & Spoons', he: 'כוסות מדידה וכפיות' } },
      { keywords: ['piping bag set nozzle', 'cake decorating kit'], caption: { en: 'Piping Bag & Nozzle Set', he: 'ערכת צנרת וצנתרים' } },
      { keywords: ['silicone baking mat', 'non stick pastry mat'], caption: { en: 'Silicone Baking Mat', he: 'משטח אפייה מסיליקון' } },
      { keywords: ['cooling rack baking', 'wire cooling rack'], caption: { en: 'Cooling Rack', he: 'רשת קירור' } },
    ],
    totalEstimate: { en: 'Full baking kit: ~€20-30', he: 'ערכת אפייה: ~₪80-120' },
  },

  'jewelry-making': {
    slug: 'jewelry-making',
    metaTitle: { en: 'Jewelry Making Starter Kit: Design Your Own Under €25', he: 'ערכת תכשיטנות: לעצב תכשיטים משלך בפחות מ-₪100' },
    metaDesc: { en: 'Complete jewelry making kit: pliers set, bead organizer, wire, findings, charms and mat. Start your handmade jewelry hobby.', he: 'ערכת תכשיטנות מלאה: סט צבתות, מארגן חרוזים, חוט, מחברים, תליונים ומשטח. התחילו את תחביב התכשיטים בעבודת יד.' },
    h1: { en: 'Jewelry Making Kit: Design Your Own Under €25', he: 'ערכת תכשיטנות: עיצוב תכשיטים משלך בפחות מ-₪100' },
    intro: { en: 'Making your own jewelry is therapeutic, creative, and surprisingly affordable. With this starter kit you can create custom earrings, bracelets, and necklaces.', he: 'הכנת תכשיטים בעצמך היא טיפולית, יצירתית ומפתיע שזולה. עם ערכה זו תוכלי ליצור עגילים, צמידים ושרשראות מותאמים אישית.' },
    tags: ['craft', 'diy', 'gifts'],
    items: [
      { keywords: ['jewelry pliers set', 'beading pliers tool kit'], caption: { en: 'Jewelry Pliers Set (3-5pc)', he: 'סט צבתות תכשיטנות (3-5 יחידות)' } },
      { keywords: ['bead organizer box', 'bead storage container'], caption: { en: 'Bead Organizer Box', he: 'קופסת אחסון חרוזים' } },
      { keywords: ['jewelry wire spool', 'beading wire memory wire'], caption: { en: 'Jewelry Wire (3 spools)', he: 'חוט תכשיטנות (3 גלילים)' } },
      { keywords: ['jump rings clasps findings', 'jewelry findings kit'], caption: { en: 'Findings & Clasps Kit', he: 'ערכת מחברים וסגירות' } },
      { keywords: ['charm pendant set', 'mixed charms jewelry'], caption: { en: 'Charms & Pendants (20pk)', he: 'תליונים וצ\'ארמס (20 יחידות)' } },
      { keywords: ['beading mat anti roll', 'bead design tray'], caption: { en: 'Beading Design Mat', he: 'משטח עיצוב חרוזים' } },
    ],
    totalEstimate: { en: 'Full kit: ~€15-25', he: 'ערכה מלאה: ~₪60-100' },
  },

  'home-gym-pro': {
    slug: 'home-gym-pro',
    metaTitle: { en: 'Home Gym Pro: Serious Workout Setup Under €80', he: 'חדר כופר ביתי מקצועי: מתקדם בפחות מ-₪320' },
    metaDesc: { en: 'Level up your home gym: adjustable dumbbells, pull-up bar, battle ropes, ab roller, foam roller, and jump rope pro.', he: 'לשדרג את חדר הכושר הביתי: משקולות מתכווננות, מוט מתח, חבלי קרב, גלגל בטן, רולר וחבל קפיצה מקצועי.' },
    h1: { en: 'Serious Home Gym Setup Under €80', he: 'חדר כושר ביתי רציני בפחות מ-₪320' },
    intro: { en: 'You do not need a gym membership to get in great shape. Adjustable dumbbells, a pull-up bar, and battle ropes give you a full-body workout in your living room.', he: 'לא צריך מנוי לחדר כושר כדי להיות בכושר מעולה. משקולות מתכווננות, מוט מתח וחבלי קרב נותנים אימון גוף מלא בסלון.' },
    tags: ['fitness', 'home-gym', 'wellness'],
    items: [
      { keywords: ['adjustable dumbbells set', 'weight dumbbell pair'], caption: { en: 'Adjustable Dumbbells (2kg-20kg)', he: 'משקולות מתכווננות (2-20 ק"ג)' } },
      { keywords: ['pull up bar doorway', 'doorway chin up bar'], caption: { en: 'Doorway Pull-Up Bar', he: 'מוט מתח לדלת' } },
      { keywords: ['battle ropes', 'heavy workout ropes'], caption: { en: 'Battle Ropes (10m)', he: 'חבלי קרב (10 מטר)' } },
      { keywords: ['ab roller wheel', 'knee pad ab wheel'], caption: { en: 'Ab Roller Wheel', he: 'גלגל בטן' } },
      { keywords: ['foam roller high density', 'muscle massage roller'], caption: { en: 'Foam Roller', he: 'רולר עיסוי' } },
      { keywords: ['speed jump rope', 'weighted jump rope'], caption: { en: 'Speed Jump Rope', he: 'חבל קפיצה מהירות' } },
    ],
    totalEstimate: { en: 'Full setup: ~€50-80', he: 'ציוד מלא: ~₪200-320' },
  },
};

export function getMoodBoard(slug: string): MoodBoard | undefined {
  return MOOD_BOARDS[slug];
}

export function getMoodBoardsByTag(tag: string): MoodBoard[] {
  return Object.values(MOOD_BOARDS).filter(b => b.tags.includes(tag));
}