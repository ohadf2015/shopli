// Niche mood boards — ultra-specific "build this look/setup" pages
// Each is a complete outfit, kit, room design, or setup with items that go together

export interface MoodBoardItem {
  keywords: string[];
  /** What a listing title must (and must not) say to fill this slot; see lib/slot-match.ts. */
  match: string[];
  also?: string[];
  not?: string[];
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
  faq?: { q: Record<string, string>; a: Record<string, string> }[];
  tags: string[];
}

export const MOOD_BOARDS: Record<string, MoodBoard> = {
// ====== PURIM / COSTUMES ======
  'jack-sparrow': {
    slug: 'jack-sparrow',
    metaTitle: { en: 'The Complete Jack Sparrow Costume: Pirate Cosplay', he: 'תחפושת ג\'ק ספארו המלאה: קוספליי שודד ים' },
    metaDesc: { en: 'Every item you need for an authentic Jack Sparrow look: tricorn hat, pirate shirt, compass necklace, wig, boots & sword. Complete cosplay guide.', he: 'כל מה שצריך למראה ג\'ק ספארו אותנטי: כובע משולש, חולצת פיראט, שרשרת מצפן, פאה, מגפיים וחרב. מדריך קוספליי מלא.' },
    h1: { en: 'Build the Perfect Jack Sparrow Costume', he: 'תחפושת ג\'ק ספארו מושלמת' },
    intro: { en: 'Captain Jack Sparrow is one of the most iconic pirate costumes — and you can build an authentic-looking outfit without spending a fortune. Here\'s every piece you need, from the tricorn hat to the pirate boots.', he: 'ג\'ק ספארו הוא אחת מתחפושות הפיראטים האייקוניות ביותר — ואתם יכולים לבנות מראה אותנטי בלי להוציא הון. הנה כל חלק שאתם צריכים, מהכובע המשולש ועד המגפיים.' },
    tags: ['purim', 'costume', 'halloween'],
    items: [
      { keywords: ['tricorn pirate hat', 'captain hat pirate'], match: ['tricorn', 'pirate hat', 'captain hat'], caption: { en: 'Tricorn Hat', he: 'כובע משולש פיראט' }, note: { en: 'Get the weathered leather look', he: 'לכו על מראה עור שחוק' } },
      { keywords: ['pirate shirt men', 'renaissance poet shirt'], match: ['shirt', 'blouse'], caption: { en: 'Pirate Shirt / Poet Blouse', he: 'חולצת פיראט' }, note: { en: 'White billowy cotton, unbutton at collar', he: 'כותנה לבנה רפויה, כפתור עליון פתוח' } },
      { keywords: ['cosplay wig long dreadlocks', 'pirate dreadlock wig'], match: ['wig'], caption: { en: 'Dreadlock Wig with Beads', he: 'פאה עם ראסטות וחרוזים' } },
      { keywords: ['compass necklace pirate', 'astrolabe pendant'], match: ['compass'], caption: { en: 'Compass Pendant Necklace', he: 'שרשרת עם תליון מצפן' } },
      { keywords: ['pirate boots costume', 'faux leather pirate boots'], match: ['boot'], caption: { en: 'Pirate Boots', he: 'מגפי פיראט' } },
      { keywords: ['pirate sword prop', 'cosplay sword pirate'], match: ['sword', 'cutlass', 'saber', 'sabre'], not: ['holster', 'frog', 'sheath', 'scabbard', 'belt'], caption: { en: 'Pirate Sword (Prop)', he: 'חרב פיראט (אביזר)' } },
    ],
  },

  'sushi-night': {
    slug: 'sushi-night',
    metaTitle: { en: 'DIY Sushi Night Kit: Make Restaurant-Quality Sushi at Home', he: 'ערכת סושי ביתית: להכין סושי ברמה של מסעדה' },
    metaDesc: { en: 'Everything for a sushi night at home: sushi maker, rice paddle, soy sauce dish, chopsticks, bamboo mat & nori seaweed.', he: 'כל מה שצריך לערב סושי ביתי: מכונת סושי, מצקת אורז, צלוחית סויה, מקלות אכילה, מחצלת במבוק ואצות נורי.' },
    h1: { en: 'Complete Sushi Making Kit', he: 'ערכת סושי מלאה' },
    intro: { en: 'Making sushi at home is cheaper than takeout and way more fun. Here\'s the complete kit — tools, accessories, and ingredients you need to roll like a pro.', he: 'להכין סושי בבית זה זול יותר ממשלוח והרבה יותר כיף. הערכה המלאה — כלים, אביזרים ומרכיבים כדי לגלגל כמו מקצוען.' },
    tags: ['kitchen', 'japanese', 'cooking'],
    items: [
      { keywords: ['sushi maker kit', 'sushi making mold'], match: ['sushi maker', 'sushi mold', 'sushi mould', 'sushi making', 'sushi kit', 'sushi bazooka'], caption: { en: 'Sushi Maker / Mold', he: 'מכונת סושי / תבנית' } },
      { keywords: ['bamboo sushi mat', 'makisu'], match: ['sushi mat', 'rolling mat', 'makisu', 'bamboo mat', 'sushi roller', 'sushi rolling'], caption: { en: 'Bamboo Rolling Mat', he: 'מחצלת גלגול במבוק' } },
      { keywords: ['nori seaweed sheets', 'sushi nori'], match: ['nori', 'seaweed'], not: ['punch', 'cutter', 'mold', 'mould', 'maker', 'press', 'packing', 'bag', 'wrapper', 'mat'], caption: { en: 'Nori Seaweed Sheets (50pk)', he: 'דפי נורי (50 יחידות)' } },
      { keywords: ['sushi rice paddle', 'rice spatula'], match: ['rice paddle', 'rice spoon', 'rice spatula', 'shamoji', 'rice scoop', 'rice shovel'], not: ['holder', 'rest', 'rack'], caption: { en: 'Rice Paddle (Shamoji)', he: 'מצקת אורז' } },
      { keywords: ['sushi chopsticks set', 'reusable chopsticks'], match: ['chopstick'], not: ['rest', 'holder', 'rack', 'helper', 'hinge', 'training'], caption: { en: 'Reusable Chopsticks', he: 'מקלות אכילה רב-פעמיים' }, note: { en: 'Get the dishwasher-safe ones', he: 'קחו כאלה שמתאימים למדיח' } },
      { keywords: ['soy sauce dish ceramic', 'dipping sauce bowl'], match: ['sauce dish', 'soy dish', 'dipping', 'sauce bowl', 'seasoning dish', 'soy sauce', 'sauce plate'], caption: { en: 'Soy Sauce Dishes (2-4pk)', he: 'צלוחיות סויה' } },
    ],
    faq: [
      { q: { en: 'Do I need a rice cooker too?', he: 'צריך גם סיר אורז?' }, a: { en: 'Not essential — any pot works. But a rice cooker makes perfect sushi rice every time.', he: 'לא חייב — כל סיר עובד. אבל סיר אורז עושה אורז סושי מושלם כל פעם.' } },
    ],
  },

  'mechanical-keyboard': {
    slug: 'mechanical-keyboard',
    metaTitle: { en: 'Custom Mechanical Keyboard Setup: Build Your Dream Typing Experience', he: 'מקלדת מכאנית מותאמת אישית' },
    metaDesc: { en: 'Complete custom keyboard setup: hot-swap keyboard, PBT keycaps, artisan keycap, coiled cable, wrist rest & switch puller.', he: 'מקלדת מכאנית מותאמת אישית: מקלדת hot-swap, כפתורי PBT, כבל מפותל, משענת יד ומוציא סוויצ\'ים.' },
    h1: { en: 'Build Your Custom Mechanical Keyboard', he: 'מקלדת מכאנית מותאמת אישית' },
    intro: { en: 'A custom mechanical keyboard isn\'t just a tool — it\'s a daily joy. Hot-swap switches, satisfying keycaps, a coiled cable, and a wrist rest that makes typing effortless. Here\'s how to build yours.', he: 'מקלדת מכאנית מותאמת אישית זה לא רק כלי — זה תענוג יומיומי. סוויצ\'ים שאפשר להחליף, כפתורים מספקים, כבל מפותל ומשענת יד שהופכים את ההקלדה לקלה.' },
    tags: ['desk', 'tech', 'gaming'],
    items: [
      { keywords: ['AJAZZ AK820 mechanical keyboard', 'hot swap mechanical keyboard 75%'], match: ['keyboard'], not: ['wrist rest', 'palm rest', 'puller', 'keyboard cover', 'keyboard bag', 'dust cover', 'keyboard stand'], caption: { en: 'Hot-Swap Mechanical Keyboard (75%)', he: 'מקלדת מכאנית Hot-Swap 75%' } },
      { keywords: ['PBT keycaps 108', 'custom keycaps OEM'], match: ['keycap'], not: ['puller', 'artisan'], caption: { en: 'PBT Keycap Set', he: 'ערכת כפתורי PBT' } },
      { keywords: ['artisan keycap resin', 'custom keycap'], match: ['artisan', 'resin', 'esc', 'cute', 'cartoon', '1u', 'novelty'], caption: { en: 'Artisan Keycap (Esc)', he: 'כפתור ארטיזן (Esc)' } },
      { keywords: ['coiled keyboard cable USB C', 'aviator coiled cable'], match: ['coiled', 'aviator'], caption: { en: 'Coiled USB-C Cable', he: 'כבל USB-C מפותל' } },
      { keywords: ['mechanical keyboard wrist rest', 'palm rest keyboard'], match: ['wrist rest', 'palm rest', 'wrist pad', 'wrist support', 'hand rest'], caption: { en: 'Wrist Rest', he: 'משענת יד' } },
      { keywords: ['keycap puller switch puller', 'keyboard tool kit'], match: ['puller', 'remover'], not: ['cleaning', 'cleaner', 'brush'], caption: { en: 'Switch & Keycap Puller Set', he: 'ערכת מוציא כפתורים וסוויצ\'ים' } },
    ],
  },

  'study-corner': {
    slug: 'study-corner',
    metaTitle: { en: 'Aesthetic Study Corner: Build a Focused Workspace', he: 'פינת לימוד אסתטית: מרחב למידה ממוקד' },
    metaDesc: { en: 'Everything for a distraction-free study space: desk lamp, cork board, storage caddy, desk mat, timer & plant.', he: 'כל מה שצריך לפינת לימוד: מנורת שולחן, לוח שעם, מארגן, משטח שולחן, טיימר ועציץ.' },
    h1: { en: 'Design Your Perfect Study Corner', he: 'פינת לימוד מושלמת' },
    intro: { en: 'A well-designed study space makes focusing easier and studying more enjoyable. Here\'s how to build an aesthetic, functional corner that actually helps you learn.', he: 'פינת לימוד מעוצבת הופכת את ההתרכזות לקלה יותר והלימודים לנעימים יותר. הנה איך לבנות פינה אסתטית ופונקציונלית שבאמת עוזרת ללמוד.' },
    tags: ['desk', 'students', 'home-office'],
    items: [
      { keywords: ['LED desk lamp USB', 'clip on reading light'], match: ['desk lamp', 'reading light', 'table lamp', 'led lamp', 'clip lamp', 'book light', 'reading lamp', 'clip light'], caption: { en: 'LED Desk Lamp (USB-C)', he: 'מנורת לד (USB-C)' }, note: { en: 'Warm white recommended', he: 'לבן חם מומלץ' } },
      { keywords: ['cork bulletin board', 'pin board wall'], match: ['cork', 'bulletin', 'pin board', 'pinboard', 'memo board'], not: ['push pin', 'pushpin', 'tack'], caption: { en: 'Cork Pin Board', he: 'לוח שעם' } },
      { keywords: ['desk storage caddy', 'pencil holder organizer'], match: ['caddy', 'organizer', 'organiser', 'pencil holder', 'pen holder', 'storage box'], not: ['cable', 'wire', 'lipstick', 'eyebrow'], caption: { en: 'Desk Organizer Caddy', he: 'מארגן שולחן' } },
      { keywords: ['desk pad mouse pad large', 'writing desk mat'], match: ['desk pad', 'desk mat', 'mouse pad', 'mousepad', 'mouse mat', 'writing mat'], caption: { en: 'Large Desk Pad / Mouse Mat', he: 'משטח שולחן גדול' } },
      { keywords: ['mechanical timer kitchen', 'focus timer'], match: ['timer'], caption: { en: 'Study Timer (Pomodoro)', he: 'טיימר לימוד (פומודורו)' } },
      { keywords: ['small desk plant fake', 'succulent pot'], match: ['plant', 'succulent', 'planter', 'pot'], not: ['grow light', 'hanger', 'shelf', 'mister', 'mat', 'repotting'], caption: { en: 'Small Desk Plant', he: 'עציץ קטן לשולחן' } },
    ],
  },

  'beach-day': {
    slug: 'beach-day',
    metaTitle: { en: 'Beach Day Essentials: Stress-Free Beach Kit', he: 'ערכת יום חוף מושלמת' },
    metaDesc: { en: 'Everything for the perfect beach day: waterproof phone pouch, beach mat, cooler bag, float, hat, and speaker.', he: 'כל מה שצריך ליום חוף מושלם: שקית פלאפון אטומה, מזרן חוף, צידנית, מתנפח, כובע ורמקול.' },
    h1: { en: 'Your Complete Beach Day Kit', he: 'ערכת יום חוף שלמה' },
    intro: { en: 'No more rushing before the beach or overpaying at the kiosk. Pack this kit once and have the perfect beach day every time — from the waterproof phone case to the inflatable float.', he: 'בלי למהר לפני הים או לשלם ביוקר בקיוסק. ארזו את הערכה הזו פעם אחת ושיהיה לכם יום חוף מושלם בכל פעם.' },
    tags: ['summer', 'travel', 'outdoor'],
    items: [
      { keywords: ['waterproof phone pouch', 'dry bag phone'], match: ['phone pouch', 'phone bag', 'dry bag', 'waterproof pouch', 'waterproof case', 'waterproof phone', 'phone case'], caption: { en: 'Waterproof Phone Pouch', he: 'שקית פלאפון אטומה למים' } },
      { keywords: ['beach mat sand proof', 'picnic blanket portable'], match: ['mat', 'blanket'], also: ['beach', 'picnic', 'sand'], not: ['mattress', 'sleeping', 'camping', 'throw'], caption: { en: 'Sand-Proof Beach Mat', he: 'מזרן חוף נגד חול' } },
      { keywords: ['insulated cooler bag', 'beach cooler tote'], match: ['cooler', 'insulated bag', 'thermal bag', 'ice bag', 'lunch bag', 'insulated tote'], caption: { en: 'Insulated Cooler Bag', he: 'תיק צידנית מבודד' } },
      { keywords: ['inflatable pool float', 'beach floatie'], match: ['float', 'inflatable'], caption: { en: 'Inflatable Pool Float', he: 'מזרון מתנפח' } },
      { keywords: ['sun hat UV protection', 'wide brim beach hat'], match: ['hat', 'cap', 'visor'], caption: { en: 'UV Protection Sun Hat', he: 'כובע שמש עם הגנת UV' } },
      { keywords: ['portable bluetooth speaker', 'waterproof speaker'], match: ['speaker'], caption: { en: 'Waterproof Bluetooth Speaker', he: 'רמקול בלוטות\' עמיד מים' } },
    ],
    faq: [
      { q: { en: 'Are the floats durable?', he: 'המתנפחים עמידים?' }, a: { en: 'Most inflatables on AliExpress are made of thick PVC and last multiple seasons. Just avoid sharp objects.', he: 'רוב המתנפחים באליאקספרס עשויים PVC עבה שמחזיק עונות שלמות. רק להתרחק מחפצים חדים.' } },
    ],
  },

  'home-bar': {
    slug: 'home-bar',
    metaTitle: { en: 'Home Bar Starter Kit: Mix Cocktails Like a Bartender', he: 'בר ביתי למתחילים: להכין קוקטיילים כמו ברמן' },
    metaDesc: { en: 'Complete bar setup: shaker set, jigger, muddler, strainer, cocktail glasses, ice molds & garnish tools.', he: 'ערכת בר שלמה: שייקר, מידות, מודלר, מסנן, כוסות קוקטייל, תבניות קרח וכלי קישוט.' },
    h1: { en: 'Build a Home Bar That Impresses', he: 'בר ביתי שמרשים' },
    intro: { en: 'A bar cocktail costs more than most of these tools. With these 6, you can mix anything from an Old Fashioned to a Margarita at home.', he: 'קוקטייל בבר עולה יותר מרוב הכלים האלה. עם 6 הכלים האלה אפשר להכין בבית הכל, מאולד פאשנד ועד מרגריטה.' },
    tags: ['kitchen', 'party', 'home'],
    items: [
      { keywords: ['cocktail shaker set', 'boston shaker stainless steel'], match: ['shaker'], caption: { en: 'Cocktail Shaker Set (Boston)', he: 'ערכת שייקר קוקטיילים' } },
      { keywords: ['jigger double sided', 'measuring jigger bartender'], match: ['jigger', 'measuring cup'], caption: { en: 'Double Jigger (30/45ml)', he: 'מידות כפולות' } },
      { keywords: ['muddler wooden', 'cocktail muddler'], match: ['muddler'], caption: { en: 'Wooden Muddler', he: 'מודלר עץ' } },
      { keywords: ['cocktail strainer', 'hawthorne strainer'], match: ['strainer'], caption: { en: 'Hawthorne Strainer', he: 'מסננת קוקטיילים' } },
      { keywords: ['whiskey tumbler glasses', 'old fashioned glasses set'], match: ['glass', 'tumbler', 'whiskey cup', 'whisky cup'], not: ['ice', 'mold', 'mould'], caption: { en: 'Whiskey Tumbler Glasses (4pk)', he: 'כוסות וויסקי (4 יחידות)' } },
      { keywords: ['ice ball mold silicone', 'whiskey ice mold'], match: ['ice'], not: ['maker machine'], caption: { en: 'Large Ice Ball / Ice Mold', he: 'תבנית קרח כדור גדול' } },
    ],
  },

  'morning-routine': {
    slug: 'morning-routine',
    metaTitle: { en: 'Perfect Morning Routine Kit: Start Your Day Right', he: 'ערכת בוקר מושלמת: להתחיל את היום נכון' },
    metaDesc: { en: 'Everything for a calm, productive morning: smart alarm clock, French press, gratitude journal, yoga mat, water bottle, and diffuser.', he: 'כל מה שצריך לבוקר רגוע ופרודוקטיבי: שעון מעורר חכם, פרנץ\' פרס, יומן הכרת תודה, מזרן יוגה, בקבוק מים ומפזר.' },
    h1: { en: 'Your Perfect Morning Routine Starts Here', he: 'בוקר מושלם מתחיל כאן' },
    intro: { en: 'A great morning sets the tone for the entire day. Instead of hitting snooze and scrolling your phone, try this morning kit — designed to wake you up gently and set you up for focus.', he: 'בוקר טוב קובע את הטון לכל היום. במקום לסנוז ולגלול בטלפון, נסו את ערכת הבוקר הזו — מעוצבת להעיר בעדינות ולהכין אתכם לריכוז.' },
    tags: ['wellness', 'mindfulness', 'home'],
    items: [
      { keywords: ['sunrise alarm clock', 'wake up light alarm'], match: ['alarm clock', 'wake up light', 'wake-up light', 'sunrise'], caption: { en: 'Sunrise Alarm Clock', he: 'שעון מעורר מדמה זריחה' } },
      { keywords: ['french press coffee maker', 'coffee plunger'], match: ['french press', 'coffee plunger', 'press pot', 'cafetiere', 'coffee maker', 'coffee press'], caption: { en: 'French Press (Stainless)', he: 'פרנץ\' פרס מנירוסטה' } },
      { keywords: ['gratitude journal notebook', 'morning pages journal'], match: ['journal', 'notebook', 'planner', 'diary'], caption: { en: 'Morning Journal / Notebook', he: 'יומן בוקר / מחברת' } },
      { keywords: ['yoga mat exercise', 'non slip workout mat'], match: ['yoga mat', 'exercise mat', 'fitness mat', 'workout mat', 'mat'], not: ['mouse', 'car', 'bath', 'kneeling', 'knee', 'block', 'brick'], caption: { en: 'Yoga Mat (6mm+)', he: 'מזרן יוגה (6מ"מ+)' } },
      { keywords: ['large water bottle time marker', 'motivational water bottle'], match: ['bottle'], caption: { en: 'Water Bottle with Time Marks', he: 'בקבוק מים עם סימוני שעות' } },
      { keywords: ['essential oil diffuser', 'aromatherapy diffuser'], match: ['diffuser', 'humidifier'], caption: { en: 'Aromatherapy Diffuser', he: 'מפזר ארומתרפיה' } },
    ],
  },

  'camping-coffee': {
    slug: 'camping-coffee',
    metaTitle: { en: 'Camping Coffee Kit: Brew in the Wild', he: 'ערכת קפה לקמפינג: קפה בשטח' },
    metaDesc: { en: 'Everything for great coffee while camping: portable espresso maker, camping stove, folding mug, coffee grinder, and aeropress.', he: 'כל מה שצריך לקפה מעולה בקמפינג: מכונת אספרסו ניידת, כיריים מתקפלות, ספל, מטחנה ואירופרס.' },
    h1: { en: 'Great Coffee in the Wilderness', he: 'קפה מעולה בטבע' },
    intro: { en: 'Instant coffee in the woods? Not anymore. With these compact tools, you can brew proper coffee at your campsite — from espresso on a pocket stove to pour-over with a view.', he: 'קפה נמס ביער? כבר לא. עם הכלים הקומפקטיים האלה, תבשלו קפה אמיתי במחנה.' },
    tags: ['camping', 'coffee', 'outdoor'],
    items: [
      { keywords: ['portable espresso maker', 'manual espresso machine camping'], match: ['espresso', 'coffee maker', 'portable coffee'], not: ['holder', 'stand'], caption: { en: 'Portable Espresso Maker', he: 'מכונת אספרסו ניידת' } },
      { keywords: ['camping stove portable', 'pocket stove backpacking'], match: ['stove', 'burner'], caption: { en: 'Camping Stove (Pocket)', he: 'כיריים ניידות' } },
      { keywords: ['folding camping mug', 'collapsible silicone cup'], match: ['mug', 'cup'], caption: { en: 'Folding Silicone Mug', he: 'ספל סיליקון מתקפל' } },
      { keywords: ['hand coffee grinder', 'mini manual burr grinder'], match: ['grinder'], caption: { en: 'Manual Coffee Grinder', he: 'מטחנת קפה ידנית' } },
      { keywords: ['aero press go camping', 'Aeropress travel'], match: ['aeropress', 'aero press', 'pour over', 'dripper', 'coffee press', 'coffee filter', 'drip coffee', 'brewer', 'french press'], not: ['puck', 'espresso'], caption: { en: 'Aeropress / Pour Over', he: 'אירופרס / פור-אובר' } },
    ],
  },

  // ====== MORE COSTUME PAGES ======
  'queen-esther': {
    slug: 'queen-esther',
    metaTitle: { en: 'Queen Esther Costume: Royal Purim Look', he: 'תחפושת אסתר המלכה: מראה מלכותי לפורים' },
    metaDesc: { en: 'Complete Queen Esther costume: royal dress, crown, jewelry, scepter, and cape. Perfect for Purim celebrations.', he: 'תחפושת אסתר המלכה המלאה: שמלה מלכותית, כתר, תכשיטים, שרביט וגלימה. מושלם לחג פורים.' },
    h1: { en: 'Queen Esther Costume: Royal & Elegant', he: 'תחפושת אסתר המלכה: מלכותית ואלגנטית' },
    intro: { en: 'Queen Esther is the most iconic Purim costume. Here\'s how to build a regal, elegant look that feels royal without breaking the bank.', he: 'אסתר המלכה היא התחפושת הכי אייקונית בפורים. הנה איך לבנות מראה מלכותי ואלגנטי שלא שובר את הכיס.' },
    tags: ['purim', 'costume', 'israel'],
    items: [
      { keywords: ['queen dress costume', 'royal medieval dress women'], match: ['dress', 'gown'], caption: { en: 'Royal Dress / Gown', he: 'שמלת מלכה' } },
      { keywords: ['queen crown tiara', 'royal crown gold'], match: ['crown', 'tiara'], caption: { en: 'Crown / Tiara', he: 'כתר / טיארה' } },
      { keywords: ['royal necklace jewelry set', 'gold statement necklace'], match: ['necklace', 'jewelry set', 'jewellery', 'earring'], also: ['gold', 'royal', 'queen', 'statement', 'crystal', 'pearl', 'rhinestone', 'bridal', 'baroque'], not: ['hip-hop', 'skeleton', 'thorn'], caption: { en: 'Royal Jewelry Set', he: 'ערכת תכשיטים מלכותית' } },
      { keywords: ['scepter royal prop', 'queen scepter wand'], match: ['scepter', 'sceptre', 'wand', 'staff'], caption: { en: 'Scepter (Royal Prop)', he: 'שרביט מלכותי' } },
      { keywords: ['royal cape cloak', 'velvet cape women'], match: ['cape', 'cloak', 'robe'], caption: { en: 'Velvet Cape / Cloak', he: 'גלימת קטיפה' } },
    ],
  },

  'pikachu': {
    slug: 'pikachu',
    metaTitle: { en: 'Pikachu Costume: Cutest Pokemon Cosplay', he: 'תחפושת פיקאצ\'ו: הקוספליי הכי חמוד לפורים' },
    metaDesc: { en: 'Everything for a perfect Pikachu costume: onesie, hat with ears, cheek stickers, tail, gloves and Pokéball prop.', he: 'כל מה שצריך לתחפושת פיקאצ\'ו מושלמת: סרבל, כובע עם אוזניים, מדבקות לחיים, זנב, כפפות וכדור פוקימון.' },
    h1: { en: 'Pikachu Costume: Be the Cutest Pokémon', he: 'תחפושת פיקאצ\'ו: להיות הפוקימון הכי חמוד' },
    intro: { en: 'Pikachu is a timeless favorite — kids and adults love it. Here\'s the complete costume: from the yellow onesie to the cheek blush stickers and Pokéball.', he: 'פיקאצ\'ו הוא אהוב נצחי — ילדים ומבוגרים אוהבים אותו. התחפושת המלאה: מהסרבל הצהוב ועד מדבקות הלחיים וכדור הפוקימון.' },
    tags: ['purim', 'costume', 'kids', 'halloween'],
    items: [
      { keywords: ['pikachu onesie pajama', 'pokemon costume kigurumi'], match: ['onesie', 'kigurumi', 'pajama', 'pyjama', 'jumpsuit', 'costume'], also: ['pikachu'], caption: { en: 'Pikachu Onesie', he: 'סרבל פיקאצ\'ו' } },
      { keywords: ['pikachu hat ears', 'pokemon hat cap'], match: ['hat', 'cap', 'beanie', 'headband', 'ears'], also: ['pikachu'], caption: { en: 'Pikachu Hat with Ears', he: 'כובע פיקאצ\'ו עם אוזניים' } },
      { keywords: ['pokemon tail prop', 'pikachu tail'], match: ['tail'], also: ['pikachu'], caption: { en: 'Pikachu Tail', he: 'זנב פיקאצ\'ו' } },
      { keywords: ['pokeball prop toy', 'pokemon ball plush'], match: ['pokeball', 'poke ball', 'pokéball', 'poké ball', 'pokemon ball'], caption: { en: 'Pokéball (Prop)', he: 'כדור פוקימון' } },
    ],
  },

// ====== ROOM DESIGN — specific aesthetic rooms ======

  'japandi-office': {
    slug: 'japandi-office',
    metaTitle: { en: 'Japandi Home Office: Minimalist Workspace', he: 'משרד ביתי בסגנון יפנדי: מרחב עבודה מינימליסטי' },
    metaDesc: { en: 'Design a serene Japandi workspace: bamboo desk organizer, wooden monitor stand, paper lamp, ceramic planter, linen cushion & minimalist clock.', he: 'לעצב חלל עבודה יפנדי שליו: מארגן שולחן במבוק, מעמד צג מעץ, מנורת נייר, עציץ קרמי, כרית פשתן ושעון מינימליסטי.' },
    h1: { en: 'Design a Japandi Home Office', he: 'משרד ביתי יפנדי' },
    intro: { en: 'Japandi combines Japanese minimalism with Scandinavian warmth — clean lines, natural materials, and a calm color palette. Here is how to transform your desk into a serene workspace.', he: 'יפנדי משלב מינימליזם יפני עם חמימות סקנדינבית — קווים נקיים, חומרים טבעיים ופלטת צבעים רגועה. הנה איך להפוך את השולחן שלכם לחלל עבודה שליו.' },
    tags: ['room-design', 'desk', 'home-office', 'scandinavian'],
    items: [
      { keywords: ['bamboo desk organizer', 'natural wood pen holder'], match: ['organizer', 'organiser', 'pen holder', 'desk storage', 'holder'], not: ['cable', 'wire', 'kitchen'], caption: { en: 'Bamboo Desk Organizer', he: 'מארגן שולחן במבוק' } },
      { keywords: ['wooden monitor stand riser', 'bamboo laptop stand'], match: ['monitor stand', 'laptop stand', 'riser', 'monitor riser'], caption: { en: 'Wooden Monitor Stand', he: 'מעמד צג מעץ' } },
      { keywords: ['washi paper lamp', 'rice paper desk lamp'], match: ['paper lamp', 'washi', 'rice paper', 'lantern', 'lamp'], caption: { en: 'Washi Paper Desk Lamp', he: 'מנורת נייר ואשי' } },
      { keywords: ['ceramic desk planter', 'minimalist flower vase'], match: ['planter', 'pot', 'vase'], caption: { en: 'Ceramic Desk Planter', he: 'עציץ קרמי לשולחן' } },
      { keywords: ['linen desk mat', 'natural cotton mouse pad'], match: ['desk mat', 'mouse pad', 'desk pad', 'mousepad', 'mat'], caption: { en: 'Linen Desk Mat', he: 'משטח שולחן פשתן' } },
      { keywords: ['minimalist wall clock silent', 'wooden clock modern'], match: ['clock'], caption: { en: 'Minimalist Wall Clock', he: 'שעון קיר מינימליסטי' } },
    ],
    faq: [
      { q: { en: 'What colors work for Japandi?', he: 'איזה צבעים מתאימים ליפנדי?' }, a: { en: 'Stick to warm whites, beige, soft wood tones, and muted green from plants. Avoid bright colors.', he: 'היצמדו ללבנים חמים, בז\', גווני עץ רכים וירוק עמום מעציצים. הימנעו מצבעים בהירים.' } },
    ],
  },

  'gamer-den': {
    slug: 'gamer-den',
    metaTitle: { en: 'Ultimate Gamer Den: RGB Gaming Setup', he: 'פינת גיימינג אולטימטיבית: עמדת משחק RGB' },
    metaDesc: { en: 'Build the ultimate gaming setup: RGB LED strips, gaming chair, XL mouse pad, monitor stand, cable sleeve, and desk shelf.', he: 'בנו את עמדת המשחק האולטימטיבית: פסי RGB, כיסא גיימינג, משטח עכבר ענק, מעמד צג, ארגון כבלים ומדף שולחן.' },
    h1: { en: 'Build the Ultimate RGB Gaming Den', he: 'פינת גיימינג RGB מושלמת' },
    intro: { en: 'A proper gaming setup is about atmosphere as much as hardware. RGB lighting, a comfortable chair, and clean cable management turn any corner into a gaming sanctuary.', he: 'עמדת משחק טובה היא עניין של אווירה לא פחות מחומרה. תאורת RGB, כיסא נוח וניהול כבלים מסודר הופכים כל פינה למקדש משחקים.' },
    tags: ['room-design', 'gaming', 'desk', 'tech'],
    items: [
      { keywords: ['gaming RGB LED strip', 'smart LED strip wifi'], match: ['strip', 'light strip'], caption: { en: 'RGB LED Strip (5m)', he: 'פס תאורת RGB (5 מטר)' }, note: { en: 'Get the app-controlled version', he: 'קחו את הגרסה הנשלטת באפליקציה' } },
      { keywords: ['gaming chair ergonomic', 'racing style desk chair'], match: ['chair'], caption: { en: 'Gaming Chair', he: 'כיסא גיימינג' } },
      { keywords: ['XL gaming mouse pad', 'extended desk mat RGB'], match: ['mouse pad', 'mousepad', 'desk mat', 'mouse mat'], caption: { en: 'XL Gaming Mouse Pad (90x40cm)', he: 'משטח עכבר ענק (90x40 ס"מ)' } },
      { keywords: ['monitor arm stand', 'gas spring monitor mount'], match: ['monitor arm', 'monitor mount', 'monitor stand', 'monitor bracket', 'monitor holder'], caption: { en: 'Monitor Arm / Mount', he: 'זרוע צג / מעמד' } },
      { keywords: ['cable management sleeve', 'cable raceway kit'], match: ['cable management', 'cable sleeve', 'cable organizer', 'cable raceway', 'cable tray', 'wire organizer', 'cable cover', 'cable organiser'], caption: { en: 'Cable Management Kit', he: 'ערכת ניהול כבלים' } },
      { keywords: ['desk shelf riser', 'monitor desk shelf'], match: ['shelf', 'riser'], not: ['figurine', 'topper'], caption: { en: 'Desk Shelf / Riser', he: 'מדף שולחן / הגבהה' } },
    ],
  },

  'boho-bedroom': {
    slug: 'boho-bedroom',
    metaTitle: { en: 'Boho Bedroom Makeover: Cozy Aesthetic', he: 'עיצוב חדר בוהו: אווירה נעימה' },
    metaDesc: { en: 'Transform your bedroom with boho style: macrame wall hanging, tassel blanket, woven rug, fairy lights, floor cushion & dream catcher.', he: 'לשדרג את חדר השינה בסגנון בוהו: תליית מקרמה, שמיכת ציציות, שטיח ארוג, אורות פיות, כרית רצפה ולוכד חלומות.' },
    h1: { en: 'Boho Bedroom Makeover', he: 'עיצוב חדר בוהו' },
    intro: { en: 'Bohemian style is all about texture, warmth, and personality. Layer natural materials, soft lighting, and handmade details to create a bedroom that feels like a creative retreat.', he: 'סגנון בוהמי הוא כולו טקסטורה, חמימות ואישיות. שלבו חומרים טבעיים, תאורה רכה ופרטים בעבודת יד ליצירת חדר שינה שמרגיש כמו מפלט יצירתי.' },
    tags: ['room-design', 'bedroom', 'boho'],
    items: [
      { keywords: ['macrame wall hanging', 'macrame tapestry'], match: ['macrame', 'wall hanging', 'tapestry'], not: ['plant hanger'], caption: { en: 'Macrame Wall Hanging', he: 'תליית קיר מקרמה' } },
      { keywords: ['tassel throw blanket', 'fringe knitted blanket'], match: ['blanket', 'throw'], caption: { en: 'Tassel Throw Blanket', he: 'שמיכת ציציות' } },
      { keywords: ['woven round rug', 'braided cotton rug'], match: ['rug', 'carpet'], not: ['kitchen', 'bathroom', 'door mat', 'doormat', 'sink'], caption: { en: 'Woven Round Rug', he: 'שטיח עגול ארוג' } },
      { keywords: ['curtain fairy lights', 'warm string lights'], match: ['fairy', 'string light', 'curtain light', 'led string'], caption: { en: 'Warm Fairy Lights', he: 'אורות פיות חמים' } },
      { keywords: ['floor cushion pouf', 'meditation floor pillow'], match: ['floor cushion', 'floor pillow', 'pouf', 'pouffe', 'ottoman', 'meditation', 'floor seat', 'tatami'], caption: { en: 'Floor Cushion / Pouf', he: 'כרית רצפה / פוף' } },
      { keywords: ['dream catcher feather', 'boho dream catcher'], match: ['dream catcher', 'dreamcatcher'], caption: { en: 'Feather Dream Catcher', he: 'לוכד חלומות נוצות' } },
    ],
  },

  'scandinavian-reading-nook': {
    slug: 'scandinavian-reading-nook',
    metaTitle: { en: 'Scandinavian Reading Nook: Cozy Corner', he: 'פינת קריאה סקנדינבית: פינה נעימה' },
    metaDesc: { en: 'Create a hygge reading corner: floor lamp, armchair, blanket, side table, book stand, and candle holder set.', he: 'יצירת פינת קריאה נעימה בסגנון הייגה: מנורת רצפה, כורסה, שמיכה, שולחן צד, מעמד ספרים וסט פמוטים.' },
    h1: { en: 'Design a Scandinavian Reading Nook', he: 'פינת קריאה סקנדינבית' },
    intro: { en: 'Hygge is about creating warm, cozy corners where you can escape with a book. Soft lighting, a comfortable chair, and natural textures are all you need.', he: 'הייגה זו האומנות של ליצור פינות חמות ונעימות שאפשר לברוח אליהן עם ספר. תאורה רכה, כיסא נוח ומרקמים טבעיים — זה כל מה שצריך.' },
    tags: ['room-design', 'scandinavian', 'hygge'],
    items: [
      { keywords: ['floor lamp reading', 'arc floor lamp modern'], match: ['floor lamp', 'standing lamp', 'arc lamp'], caption: { en: 'Arc Floor Lamp', he: 'מנורת קשת רצפה' } },
      { keywords: ['armchair cozy', 'comfy reading chair'], match: ['chair', 'armchair', 'sofa', 'recliner'], not: ['cover', 'slipcover'], caption: { en: 'Cozy Armchair', he: 'כורסה נעימה' } },
      { keywords: ['knitted throw blanket', 'chunky knit blanket'], match: ['blanket', 'throw'], caption: { en: 'Knitted Throw Blanket', he: 'שמיכה סרוגה' } },
      { keywords: ['small side table', 'C table sofa lap desk'], match: ['side table', 'end table', 'c table', 'coffee table', 'sofa table', 'table'], not: ['lamp', 'dog', 'cage'], caption: { en: 'C Table / Side Table', he: 'שולחן צד / C-טייבל' } },
      { keywords: ['book stand acrylic', 'cookbook holder reading'], match: ['book stand', 'bookstand', 'book holder', 'reading stand', 'cookbook'], caption: { en: 'Book Stand', he: 'מעמד ספרים' } },
      { keywords: ['candle holder set', 'tealight holder ceramic'], match: ['candle'], caption: { en: 'Candle Holder Set', he: 'סט פמוטים' } },
    ],
  },

  'indoor-jungle': {
    slug: 'indoor-jungle',
    metaTitle: { en: 'Indoor Jungle Room: Home Plant Corner', he: 'ג\'ונגל ביתי: פינת צמחים' },
    metaDesc: { en: 'Build an indoor jungle: macrame plant hangers, shelf, watering can, mister, ceramic pots, and grow light.', he: 'לבנות ג\'ונגל ביתי: תליוני צמחים מקרמה, מדף, מזלף, מרסס, עציצים קרמיים ונורת גידול.' },
    h1: { en: 'Create an Indoor Jungle Corner', he: 'ג\'ונגל ביתי' },
    intro: { en: 'An indoor jungle turns any room into a living, breathing space. With the right pots, hangers, and lighting, you can create a lush plant corner that thrives.', he: 'ג\'ונגל ביתי הופך כל חדר לחלל חי ונושם. עם העציצים, התליונים והתאורה הנכונים, אפשר ליצור פינת צמחים שופעת שמשגשגת.' },
    tags: ['room-design', 'plants', 'indoor'],
    items: [
      { keywords: ['macrame plant hanger', 'plant hanger rope'], match: ['plant hanger', 'macrame', 'hanging basket', 'hanger'], caption: { en: 'Macrame Plant Hanger (2pk)', he: 'תליון צמחים מקרמה (זוג)' } },
      { keywords: ['plant shelf wall', 'floating shelf plants'], match: ['shelf', 'shelves'], not: ['artificial', 'fake'], caption: { en: 'Plant Wall Shelf', he: 'מדף צמחים לקיר' } },
      { keywords: ['ceramic plant pot set', 'terracotta pot with tray'], match: ['pot', 'planter'], not: ['watering'], caption: { en: 'Ceramic Plant Pots (3pk)', he: 'עציצים קרמיים (3 יחידות)' } },
      { keywords: ['plant mister spray bottle', 'misting bottle glass'], match: ['mister', 'spray bottle', 'sprayer', 'spray'], not: ['cooking', 'seasoning', 'kitchen'], caption: { en: 'Plant Mister (Glass)', he: 'מרסס צמחים מזכוכית' } },
      { keywords: ['watering can indoor', 'small watering can metal'], match: ['watering can', 'watering pot', 'watering kettle'], caption: { en: 'Indoor Watering Can', he: 'מזלף פנימי' } },
      { keywords: ['grow light LED', 'plant growing lamp'], match: ['grow light', 'growing lamp', 'plant light', 'grow lamp', 'full spectrum', 'growing light'], caption: { en: 'LED Grow Light', he: 'נורת גידול לד' } },
    ],
  },

  // ====== MORE PURIM / COSTUMES ======

  'spiderman': {
    slug: 'spiderman',
    metaTitle: { en: 'Spider-Man Costume: Complete Superhero Look', he: 'תחפושת ספיידרמן: מראה גיבור על שלם' },
    metaDesc: { en: 'Every piece for an amazing Spider-Man costume: bodysuit, mask, web shooters, lens frames, gloves, and shoe covers.', he: 'כל חלק לתחפושת ספיידרמן מדהימה: חליפה, מסכה, מטילי קורים, עדשות, כפפות וכיסויי נעליים.' },
    h1: { en: 'Spider-Man: Complete Superhero Costume', he: 'ספיידרמן: תחפושת גיבור על שלמה' },
    intro: { en: 'Spider-Man is the most popular superhero costume for good reason — it is recognizable, cool, and surprisingly easy to assemble. Here is the complete look.', he: 'ספיידרמן היא תחפושת גיבור העל הפופולרית ביותר מסיבה טובה — היא מזוהה, מגניבה ומפתיע שקל להרכיב. הנה המראה השלם.' },
    tags: ['purim', 'costume', 'halloween', 'superhero'],
    items: [
      { keywords: ['spiderman bodysuit costume', 'spider man full suit'], match: ['bodysuit', 'suit', 'jumpsuit', 'costume', 'zentai'], also: ['spider'], not: ['mask only'], caption: { en: 'Spider-Man Bodysuit', he: 'חליפת ספיידרמן' } },
      { keywords: ['spiderman mask mask', 'spider man cosplay mask'], match: ['mask'], caption: { en: 'Spider-Man Mask (Lens)', he: 'מסכת ספיידרמן' } },
      { keywords: ['spiderman web shooter', 'spider man glove launcher'], match: ['web shooter', 'launcher', 'web slinger', 'wrist'], also: ['spider', 'web'], caption: { en: 'Web Shooter Gloves', he: 'כפפות מטילי קורים' } },
      { keywords: ['spiderman shoe covers', 'cosplay shoe covers spandex'], match: ['shoe cover', 'boot cover', 'shoe'], caption: { en: 'Shoe Covers', he: 'כיסויי נעליים' } },
    ],
  },

  'wonder-woman': {
    slug: 'wonder-woman',
    metaTitle: { en: 'Wonder Woman Costume: Amazon Warrior Look', he: 'תחפושת וונדר וומן: מראה לוחמת אמזונות' },
    metaDesc: { en: 'Complete Wonder Woman cosplay: bodice armor, skirt, tiara, bracelets, lasso, boots and sword.', he: 'קוספליי וונדר וומן מלא: שריון גוף, חצאית, נזר, צמידים, לאסו, מגפיים וחרב.' },
    h1: { en: 'Wonder Woman Costume: Warrior Princess', he: 'תחפושת וונדר וומן: נסיכה לוחמת' },
    intro: { en: 'Wonder Woman is a Purim classic in Israel. Here is the full Amazon warrior look — from the golden tiara to the Lasso of Truth — assembled from affordable AliExpress pieces.', he: 'וונדר וומן היא קלאסיקה בפורים בישראל. הנה מראה הלוחמת אמזונות המלא — מהנזר המוזהב ועד הלאסו של האמת — המורכב מפריטים משתלמים מאליאקספרס.' },
    tags: ['purim', 'costume', 'superhero', 'halloween'],
    items: [
      { keywords: ['wonder woman costume bodice', 'amazon warrior armor top'], match: ['bodice', 'armor', 'armour', 'corset', 'costume', 'top'], caption: { en: 'Bodice / Armor Top', he: 'שריון עליון' } },
      { keywords: ['wonder woman skirt costume', 'gold armored skirt'], match: ['skirt'], caption: { en: 'Armored Skirt', he: 'חצאית שריון' } },
      { keywords: ['wonder woman tiara crown', 'gold headpiece warrior'], match: ['tiara', 'crown', 'headband', 'headpiece'], not: ['bodysuit', 'helmet', 'horn'], caption: { en: 'Golden Tiara Crown', he: 'נזר זהב/כתר' } },
      { keywords: ['wonder woman bracelets', 'gold gauntlets costume'], match: ['bracelet', 'gauntlet', 'bracer', 'cuff'], also: ['gold', 'golden', 'wonder', 'warrior', 'amazon', 'gauntlet'], caption: { en: 'Gauntlets / Bracelets', he: 'צמידי קרב' } },
      { keywords: ['lasso of truth prop', 'golden rope costume'], match: ['lasso', 'rope'], also: ['lasso', 'gold', 'golden'], not: ['scorpion', 'dart', 'kombat'], caption: { en: 'Lasso of Truth', he: 'לאסו של האמת' } },
      { keywords: ['wonder woman boots costume', 'gladiator boots gold'], match: ['boot'], not: ['doll'], caption: { en: 'Gold Warrior Boots', he: 'מגפיים מוזהבים' } },
    ],
  },

  'ninja-turtle': {
    slug: 'ninja-turtle',
    metaTitle: { en: 'Ninja Turtle Costume: Heroes in a Half Shell', he: 'תחפושת צבי נינג\'ה: גיבורי חצי קליפה' },
    metaDesc: { en: 'Build a Teenage Mutant Ninja Turtle costume: shell, mask, eye bandana, knee pads, weapon set and green bodysuit.', he: 'לבנות תחפושת צבי נינג\'ה: שריון גב, מסכה, בנדנה, מגני ברכיים, סט נשקים וחליפה ירוקה.' },
    h1: { en: 'Ninja Turtle Costume: Hero in a Half Shell', he: 'תחפושת צב נינג\'ה: גיבור חצי קליפה' },
    intro: { en: 'Cowabunga! Leonardo, Michelangelo, Donatello or Raphael — pick your turtle and build the costume with a shell, mask, and weapons. Perfect for Purim groups of 4.', he: 'קאו-באנגה! לאונרדו, מיכלאנג\'לו, דונטלו או רפאל — ב�רו צב ובנו תחפושת עם שריון, מסכה ונשקים. מושלם לקבוצות של 4 בפורים.' },
    tags: ['purim', 'costume', 'halloween', 'kids'],
    items: [
      { keywords: ['ninja turtle shell prop', 'turtle shell backpack'], match: ['turtle shell', 'shell backpack', 'tmnt', 'ninja turtle'], caption: { en: 'TMNT Shell Backpack', he: 'שריון צב/תיק גב' } },
      { keywords: ['ninja turtle mask bandana', 'tmnt eye mask'], match: ['mask', 'bandana', 'eye mask'], caption: { en: 'Eye Mask / Bandana', he: 'מסכת עיניים/בנדנה' } },
      { keywords: ['green bodysuit morphsuit', 'green long sleeve shirt'], match: ['bodysuit', 'morphsuit', 'zentai', 'jumpsuit', 'shirt', 't-shirt', 'top'], also: ['green'], caption: { en: 'Green Bodysuit', he: 'חליפה ירוקה' } },
      { keywords: ['ninja weapon set toy', 'plastic ninja sword nunchucks'], match: ['sword', 'nunchuck', 'nunchaku', 'weapon', 'katana', 'sai'], not: ['minifigure', 'building block', 'figure', 'lego'], caption: { en: 'Weapon Set (Sword/Nunchucks)', he: 'סט נשקים (חרב/נונצ\'קו)' } },
      { keywords: ['knee pad elbow pad set', 'protective pads kids'], match: ['knee pad', 'elbow pad', 'pads', 'knee'], not: ['car', 'seat'], caption: { en: 'Knee & Elbow Pads', he: 'מגני ברכיים ומרפקים' } },
    ],
    faq: [
      { q: { en: 'How do I pick my turtle color?', he: 'איך בוחרים את צבע הצב?' }, a: { en: 'Red bandana = Raphael (sai), Blue = Leonardo (katanas), Purple = Donatello (bo staff), Orange = Michelangelo (nunchucks).', he: 'בנדנה אדומה = רפאל, כחול = לאונרדו, סגול = דונטלו, כתום = מיכלאנג\'לו.' } },
    ],
  },

  'superman': {
    slug: 'superman',
    metaTitle: { en: 'Superman Costume: Classic Man of Steel', he: 'תחפושת סופרמן: איש הפלדה הקלאסי' },
    metaDesc: { en: 'Complete Superman costume: bodysuit, cape, chest emblem, boots, belt and cuffs. The iconic look.', he: 'תחפושת סופרמן מלאה: חליפה, גלימה, סמל חזה, מגפיים, חגורה וצמידים. המראה האייקוני.' },
    h1: { en: 'Superman: The Complete Man of Steel', he: 'סופרמן: איש הפלדה השלם' },
    intro: { en: 'There is no more iconic superhero than Superman. Build the full look — blue bodysuit, red cape, and the famous \'S\' shield — and fly into Purim.', he: 'אין גיבור על אייקוני יותר מסופרמן. בנו את המראה המלא — חליפה כחולה, גלימה אדומה ומגן ה-S המפורסם — ועפו לתוך פורים.' },
    tags: ['purim', 'costume', 'superhero', 'halloween'],
    items: [
      { keywords: ['superman costume men', 'superman suit spandex'], match: ['costume', 'suit', 'bodysuit', 'jumpsuit'], also: ['superman', 'super man', 'superhero'], caption: { en: 'Superman Bodysuit', he: 'חליפת סופרמן' } },
      { keywords: ['superman cape red', 'superhero cape satin'], match: ['cape'], also: ['red', 'superhero', 'superman', 'hero'], caption: { en: 'Red Cape', he: 'גלימה אדומה' }, note: { en: 'Get the satin one, it drapes better', he: 'קחו מבד סאטן, היא נופלת יפה יותר' } },
      { keywords: ['superman chest emblem shield', 'S shield patch'], match: ['emblem', 'patch', 'logo', 'badge', 'shield'], also: ['superman', 'super man', 'superhero', 's shield', 'hero'], not: ['cable', 'ethernet', 'lan', 'viking', 'skull'], caption: { en: 'S Shield Emblem', he: 'סמל S על החזה' } },
      { keywords: ['superman boots cosplay', 'red blue boot covers'], match: ['boot cover', 'boots cover', 'shoe cover', 'superman boot', 'cosplay boot', 'cosplay shoe'], caption: { en: 'Superman Boot Covers', he: 'כיסויי מגפיים' } },
      { keywords: ['superman belt buckle', 'gold belt hero'], match: ['belt'], also: ['superman', 'superhero', 'hero', 'gold', 'costume', 'cosplay'], not: ['webbing', 'strap', 'ratchet'], caption: { en: 'Gold Belt / Buckle', he: 'חגורת זהב/אבזם' } },
    ],
  },

  // ====== MORE NICHE KITS / SETUPS ======

  'digital-nomad': {
    slug: 'digital-nomad',
    metaTitle: { en: 'Digital Nomad Kit: Remote Work Anywhere', he: 'ערכת נווד דיגיטלי: לעבוד מרחוק מכל מקום' },
    metaDesc: { en: 'Everything a digital nomad needs: universal adapter, power bank, laptop stand, packing cubes, cable organizer, and travel mouse.', he: 'כל מה שנווד דיגיטלי צריך: מתאם אוניברסלי, בנק כוח, מעמד למחשב, קוביות אריזה, מארגן כבלים ועכבר נייד.' },
    h1: { en: 'Digital Nomad Kit: Work From Anywhere', he: 'ערכת נווד דיגיטלי: לעבוד מכל מקום' },
    intro: { en: 'Working from cafes, co-working spaces, or the beach requires a curated kit. These compact essentials let you set up a productive workspace anywhere in the world.', he: 'עבודה מבתי קפה, חללי עבודה משותפים או החוף דורשת ערכה מתוכננת. המוצרים הקומפקטיים האלה יאפשרו לכם להקים מרחב עבודה פרודוקטיבי בכל מקום בעולם.' },
    tags: ['travel', 'desk', 'tech'],
    items: [
      { keywords: ['universal travel adapter', 'international power adapter'], match: ['adapter', 'adaptor', 'travel plug', 'converter'], caption: { en: 'Universal Travel Adapter', he: 'מתאם נסיעות אוניברסלי' } },
      { keywords: ['power bank 20000mAh', 'fast charging portable charger'], match: ['power bank', 'powerbank', 'portable charger', 'battery pack'], not: ['car adapter', 'car charger', 'wall'], caption: { en: '20000mAh Power Bank', he: 'בנק כוח 20000mAh' } },
      { keywords: ['laptop stand portable', 'foldable laptop riser'], match: ['laptop stand', 'laptop holder', 'laptop riser', 'notebook stand'], caption: { en: 'Foldable Laptop Stand', he: 'מעמד מתקפל למחשב' } },
      { keywords: ['packing cubes set', 'travel organizer cubes'], match: ['packing cube', 'packing organizer', 'travel organizer', 'cube'], caption: { en: 'Packing Cubes (3-4 set)', he: 'קוביות אריזה (3-4 יחידות)' } },
      { keywords: ['cable organizer case', 'electronic organizer bag'], match: ['cable organizer', 'electronic organizer', 'electronics organizer', 'cable bag', 'cable case', 'organizer bag', 'storage bag', 'case', 'pouch'], caption: { en: 'Cable Organizer Case', he: 'מארגן כבלים' } },
      { keywords: ['travel mouse wireless', 'portable mouse slim'], match: ['mouse'], not: ['pad', 'mat'], caption: { en: 'Slim Travel Mouse', he: 'עכבר נייד דק' } },
    ],
  },

  'streaming-setup': {
    slug: 'streaming-setup',
    metaTitle: { en: 'Game Streaming Setup: Go Live', he: 'עמדת סטרימינג: לשדר בשידור חי' },
    metaDesc: { en: 'Everything to start streaming: ring light, USB mic, phone tripod, RGB strip, capture card, and streaming chat display.', he: 'כל מה שצריך כדי להתחיל לשדר: תאורת טבעת, מיקרופון USB, חצובה לפלאפון, פס RGB, כרטיס לכידה ותצוגת צ\'אט.' },
    h1: { en: 'Game Streaming Setup: Go Live', he: 'עמדת סטרימינג: לשדר בשידור חי' },
    intro: { en: 'Starting a stream does not require a huge budget. Ring light for pro lighting, USB mic for clear audio, and a capture card for console gameplay. Here is everything you need.', he: 'כדי להתחיל לשדר לא צריך תקציב ענק. תאורת טבעת לתאורה מקצועית, מיקרופון USB לאודיו נקי וכרטיס לכידה לקונסולה. הנה כל מה שצריך.' },
    tags: ['desk', 'gaming', 'tech'],
    items: [
      { keywords: ['ring light 10 inch', 'professional ring light stand'], match: ['ring light', 'fill light', 'selfie light'], caption: { en: 'Ring Light (10" + Tripod)', he: 'תאורת טבעת 10" + חצובה' } },
      { keywords: ['USB microphone condenser', 'podcast mic gaming'], match: ['microphone', 'mic'], caption: { en: 'USB Condenser Mic', he: 'מיקרופון קונדנסר USB' }, note: { en: 'Dynamic mic is better if your room is noisy', he: 'מיקרופון דינמי עדיף אם החדר רועש' } },
      { keywords: ['phone tripod stand', 'flexible phone holder'], match: ['tripod', 'phone holder', 'phone stand'], caption: { en: 'Phone Tripod / Stand', he: 'חצובת פלאפון' } },
      { keywords: ['HDMI capture card', 'USB video capture'], match: ['capture'], caption: { en: 'HDMI Capture Card', he: 'כרטיס לכידה HDMI' } },
      { keywords: ['RGB LED strip', 'usb led strip monitor'], match: ['strip', 'backlight', 'light bar'], not: ['car', 'tesla', 'auto'], caption: { en: 'Monitor RGB Backlight', he: 'תאורת RGB מאחורי המסך' } },
      { keywords: ['stream deck alternative', 'macro keypad programmable'], match: ['keypad', 'stream deck', 'macro', 'controller', 'creative deck', 'control hub'], caption: { en: 'Macro Keypad / Stream Deck', he: 'מקלדת מאקרו לסטרימינג' } },
    ],
  },

  'dessert-baking': {
    slug: 'dessert-baking',
    metaTitle: { en: 'Dessert Baking Kit: Bake Like a Pro', he: 'ערכת אפיית קינוחים: לאפות כמו מקצוען' },
    metaDesc: { en: 'Every baking tool you need: mixing bowls, hand mixer, measuring cups, piping set, silicone mat and cooling rack.', he: 'כל כלי האפייה שצריך: קערות ערבוב, מיקסר ידני, כוסות מדידה, צנרת, משטח סיליקון ורשת קירור.' },
    h1: { en: 'Dessert Baking Kit', he: 'ערכת אפיית קינוחים' },
    intro: { en: 'Fresh cookies, fluffy cakes, perfect cupcakes — the right tools make all the difference. Here is the complete baking starter kit for anyone who loves dessert.', he: 'עוגיות טריות, עוגות אווריריות, קאפקייקס מושלמים — הכלים הנכונים עושים את כל ההבדל. ערכת אפייה למתחילים למי שאוהב קינוחים.' },
    tags: ['kitchen', 'cooking', 'dessert'],
    items: [
      { keywords: ['mixing bowl set stainless steel', 'nesting bowls kitchen'], match: ['bowl'], caption: { en: 'Stainless Mixing Bowl Set', he: 'סט קערות ערבוב מנירוסטה' } },
      { keywords: ['electric hand mixer', 'stand mixer hand'], match: ['mixer', 'whisk', 'beater'], caption: { en: 'Electric Hand Mixer', he: 'מיקסר ידני חשמלי' } },
      { keywords: ['measuring cups spoons set', 'kitchen measuring set'], match: ['measuring'], not: ['bowl'], caption: { en: 'Measuring Cups & Spoons', he: 'כוסות מדידה וכפיות' } },
      { keywords: ['piping bag set nozzle', 'cake decorating kit'], match: ['piping', 'nozzle', 'icing', 'decorating'], caption: { en: 'Piping Bag & Nozzle Set', he: 'ערכת צנרת וצנתרים' } },
      { keywords: ['silicone baking mat', 'non stick pastry mat'], match: ['baking mat', 'silicone mat', 'pastry mat', 'baking sheet', 'mat'], not: ['induction', 'cooktop'], caption: { en: 'Silicone Baking Mat', he: 'משטח אפייה מסיליקון' } },
      { keywords: ['cooling rack baking', 'wire cooling rack'], match: ['rack'], caption: { en: 'Cooling Rack', he: 'רשת קירור' } },
    ],
  },

  'jewelry-making': {
    slug: 'jewelry-making',
    metaTitle: { en: 'Jewelry Making Starter Kit: Design Your Own', he: 'ערכת תכשיטנות: לעצב תכשיטים משלך' },
    metaDesc: { en: 'Complete jewelry making kit: pliers set, bead organizer, wire, findings, charms and mat. Start your handmade jewelry hobby.', he: 'ערכת תכשיטנות מלאה: סט צבתות, מארגן חרוזים, חוט, מחברים, תליונים ומשטח. התחילו את תחביב התכשיטים בעבודת יד.' },
    h1: { en: 'Jewelry Making Kit: Design Your Own', he: 'ערכת תכשיטנות: עיצוב תכשיטים משלך' },
    intro: { en: 'Making your own jewelry is therapeutic, creative, and surprisingly affordable. With this starter kit you can create custom earrings, bracelets, and necklaces.', he: 'הכנת תכשיטים בעצמך היא טיפולית, יצירתית ומפתיע שזולה. עם ערכה זו תוכלי ליצור עגילים, צמידים ושרשראות מותאמים אישית.' },
    tags: ['craft', 'diy', 'gifts'],
    items: [
      { keywords: ['jewelry pliers set', 'beading pliers tool kit'], match: ['plier'], caption: { en: 'Jewelry Pliers Set (3-5pc)', he: 'סט צבתות תכשיטנות (3-5 יחידות)' } },
      { keywords: ['bead organizer box', 'bead storage container'], match: ['organizer', 'organiser', 'storage box', 'box', 'container', 'case'], not: ['pencil', 'pen', 'school'], caption: { en: 'Bead Organizer Box', he: 'קופסת אחסון חרוזים' } },
      { keywords: ['jewelry wire spool', 'beading wire memory wire'], match: ['wire', 'thread', 'cord'], not: ['plier'], caption: { en: 'Jewelry Wire (3 spools)', he: 'חוט תכשיטנות (3 גלילים)' } },
      { keywords: ['jump rings clasps findings', 'jewelry findings kit'], match: ['jump ring', 'clasp', 'finding', 'lobster', 'earring hook', 'crimp'], caption: { en: 'Findings & Clasps Kit', he: 'ערכת מחברים וסגירות' } },
      { keywords: ['charm pendant set', 'mixed charms jewelry'], match: ['charm', 'pendant'], caption: { en: 'Charms & Pendants (20pk)', he: 'תליונים וצ\'ארמס (20 יחידות)' } },
      { keywords: ['beading mat anti roll', 'bead design tray'], match: ['mat', 'tray', 'board'], caption: { en: 'Beading Design Mat', he: 'משטח עיצוב חרוזים' } },
    ],
  },


  'home-gym-pro': {
    slug: 'home-gym-pro',
    metaTitle: { en: 'Home Gym Pro: Serious Workout Setup', he: 'חדר כושר ביתי מקצועי: מתקדם' },
    metaDesc: { en: 'Level up your home gym: adjustable dumbbells, pull-up bar, battle ropes, ab roller, foam roller, and jump rope pro.', he: 'לשדרג את חדר הכושר הביתי: משקולות מתכווננות, מוט מתח, חבלי קרב, גלגל בטן, רולר וחבל קפיצה מקצועי.' },
    h1: { en: 'Serious Home Gym Setup', he: 'חדר כושר ביתי רציני' },
    intro: { en: 'You do not need a gym membership to get in great shape. Adjustable dumbbells, a pull-up bar, and battle ropes give you a full-body workout in your living room.', he: 'לא צריך מנוי לחדר כושר כדי להיות בכושר מעולה. משקולות מתכווננות, מוט מתח וחבלי קרב נותנים אימון גוף מלא בסלון.' },
    tags: ['fitness', 'home-gym', 'wellness'],
    items: [
      { keywords: ['adjustable dumbbells set', 'weight dumbbell pair'], match: ['dumbbell'], caption: { en: 'Adjustable Dumbbells (2kg-20kg)', he: 'משקולות מתכווננות (2-20 ק"ג)' } },
      { keywords: ['pull up bar doorway', 'doorway chin up bar'], match: ['pull up', 'pull-up', 'chin up', 'chin-up', 'pullup', 'horizontal bar', 'door bar', 'doorway bar'], caption: { en: 'Doorway Pull-Up Bar', he: 'מוט מתח לדלת' } },
      { keywords: ['battle ropes', 'heavy workout ropes'], match: ['battle rope', 'training rope', 'rope'], not: ['jump', 'skipping', 'speed', 'handle', 'grip'], caption: { en: 'Battle Ropes (10m)', he: 'חבלי קרב (10 מטר)' } },
      { keywords: ['ab roller wheel', 'knee pad ab wheel'], match: ['ab roller', 'ab wheel', 'abdominal wheel', 'roller wheel', 'wheel'], caption: { en: 'Ab Roller Wheel', he: 'גלגל בטן' } },
      { keywords: ['foam roller high density', 'muscle massage roller'], match: ['foam roller', 'massage roller', 'roller'], not: ['wheel', 'ab '], caption: { en: 'Foam Roller', he: 'רולר עיסוי' } },
      { keywords: ['speed jump rope', 'weighted jump rope'], match: ['jump rope', 'skipping rope', 'speed rope', 'rope'], not: ['battle'], caption: { en: 'Speed Jump Rope', he: 'חבל קפיצה מהירות' } },
    ],
  },

// ====== NEW: KITCHEN, NURSERY, CRAFT ROOM ======

  'kitchen-makeover': {
    slug: 'kitchen-makeover',
    metaTitle: { en: 'Kitchen Makeover: Functional & Beautiful', he: 'מהפך מטבח: פונקציונלי ויפה' },
    metaDesc: { en: 'Upgrade your kitchen: magnetic knife strip, spice jars, utensil crock, cutting board, countertop organizer & dish rack.', he: 'לשדרג את המטבח: פס מגנטי לסכינים, צנצנות תבלינים, כלי כפות, קרש חיתוך, מארגן משטח ומתקן ייבוש.' },
    h1: { en: 'Kitchen Makeover: Beautiful & Functional', he: 'מהפך מטבח: יפה ופונקציונלי' },
    intro: { en: 'A great kitchen is organized, efficient, and a joy to cook in. Magnetic strips, uniform jars, and smart storage transform any kitchen — rental or owned.', he: 'מטבח מעולה הוא מסודר, יעיל וכיף לבשל בו. פסים מגנטיים, צנצנות אחידות ואחסון חכם משנים כל מטבח — שכור או בבעלות.' },
    tags: ['room-design', 'kitchen', 'organization'],
    items: [
      { keywords: ['magnetic knife strip', 'magnetic knife holder wall'], match: ['magnetic', 'knife holder', 'knife strip', 'knife rack'], caption: { en: 'Magnetic Knife Strip', he: 'פס מגנטי לסכינים' } },
      { keywords: ['spice jar set uniform', 'glass spice jars labels'], match: ['spice', 'jar'], caption: { en: 'Uniform Spice Jars (12-16pk)', he: 'צנצנות תבלינים אחידות (12-16)' } },
      { keywords: ['utensil crock ceramic', 'kitchen utensil holder'], match: ['utensil holder', 'utensil crock', 'crock', 'utensil caddy', 'spatula holder', 'utensil jar', 'utensil organizer'], not: ['drawer', 'pot clip', 'pot lid holder'], caption: { en: 'Utensil Crock / Holder', he: 'כלי כפות / מארגן' } },
      { keywords: ['cutting board bamboo', 'large chopping board'], match: ['cutting board', 'chopping board', 'board'], not: ['oil', 'conditioner', 'table'], caption: { en: 'Large Bamboo Cutting Board', he: 'קרש חיתוך במבוק גדול' } },
      { keywords: ['countertop organizer', 'kitchen shelf tiered'], match: ['organizer', 'organiser', 'rack', 'shelf', 'storage'], not: ['dish', 'drying', 'bathroom', 'toilet', 'wall-mounted'], caption: { en: 'Tiered Countertop Organizer', he: 'מארגן משטח מדורג' } },
      { keywords: ['dish drying rack', 'foldable dish drainer'], match: ['dish rack', 'drying rack', 'drainer', 'dish drying', 'dish drainer', 'rack'], caption: { en: 'Foldable Dish Drying Rack', he: 'מתקן ייבוש כלים מתקפל' } },
    ],
  },

  'nursery-room': {
    slug: 'nursery-room',
    metaTitle: { en: 'Nursery Room Setup: Sweet Baby Space', he: 'עיצוב חדר תינוקות: חלל מתוק לקטנטנים' },
    metaDesc: { en: 'Everything for a cozy nursery: crib mobile, night light, sound machine, storage baskets, changing caddy & wall decals.', he: 'כל מה שצריך לחדר תינוקות נעים: מובייל לעריסה, מנורת לילה, מכונת צליל, סלי אחסון, תיק החתלה ומדבקות קיר.' },
    h1: { en: 'Nursery Room: Sweet & Practical', he: 'חדר תינוקות: מתוק ופרקטי' },
    intro: { en: 'Designing a nursery is about calm, safety, and functionality. Soft lighting, gentle sounds, and smart storage create a space both baby and parents love.', he: 'עיצוב חדר תינוקות זה רוגע, בטיחות ופונקציונליות. תאורה רכה, צלילים עדינים ואחסון חכם יוצרים חלל שאהבים גם התינוק וגם ההורים.' },
    tags: ['room-design', 'nursery', 'baby'],
    items: [
      { keywords: ['baby crib mobile', 'musical mobile crib'], match: ['mobile', 'crib'], caption: { en: 'Crib Mobile (Musical)', he: 'מובייל מוזיקלי לעריסה' } },
      { keywords: ['baby night light', 'nursery night lamp'], match: ['night light', 'night lamp', 'lamp', 'light'], caption: { en: 'Soft Night Light', he: 'מנורת לילה רכה' } },
      { keywords: ['white noise machine baby', 'sound machine nursery'], match: ['white noise', 'sound machine', 'noise machine'], caption: { en: 'White Noise / Sound Machine', he: 'מכונת צליל / רעש לבן' } },
      { keywords: ['nursery storage baskets', 'fabric storage bins'], match: ['basket', 'bin', 'storage box'], caption: { en: 'Fabric Storage Baskets (3pk)', he: 'סלי אחסון מבד (3 יחידות)' } },
      { keywords: ['diaper caddy organizer', 'changing table organizer'], match: ['caddy', 'organizer', 'organiser', 'diaper'], caption: { en: 'Diaper Changing Caddy', he: 'מארגן החתלה' } },
      { keywords: ['wall decals nursery', 'removable wall stickers'], match: ['decal', 'sticker', 'wallpaper'], caption: { en: 'Removable Wall Decals', he: 'מדבקות קיר ניתנות להסרה' } },
    ],
    faq: [
      { q: { en: 'When should I set up the nursery?', he: 'מתי להקים את החדר?' }, a: { en: 'Most parents set up 2-3 months before due date. Gives time to air out any new furniture.', he: 'רוב ההורים מקימים 2-3 חודשים לפני הלידה. נותן זמן לאוורר רהיטים חדשים.' } },
    ],
  },

  'craft-room': {
    slug: 'craft-room',
    metaTitle: { en: 'Craft Room Organization: Creative Studio', he: 'חדר יצירה מאורגן: סטודיו יצירתי' },
    metaDesc: { en: 'Organize your craft space: pegboard wall, thread organizer, ribbon dispenser, paper storage, label maker & rolling cart.', he: 'לארגן את חדר היצירה: לוח תלייה מנוקב, מארגן חוטים, מתקן סרטים, אחסון נייר, מכונת תוויות ועגלה ניידת.' },
    h1: { en: 'Dream Craft Room Organization', he: 'חדר יצירה מאורגן' },
    intro: { en: 'A well-organized craft space lets you focus on creating instead of hunting for supplies. Pegboard walls, dedicated organizers for thread/ribbon/paper, a label maker, and a mobile cart keep everything visible and accessible.', he: 'חדר יצירה מאורגן נותן לכם להתמקד ביצירה במקום בחיפוש חומרים. לוחות תלייה מנוקבים, מארגנים ייעודיים לחוטים/סרטים/נייר, מכונת תוויות ועגלה ניידת שומרים הכל גלוי ונגיש.' },
    tags: ['craft', 'organization', 'room-design'],
    items: [
      { keywords: ['pegboard wall organizer', 'tool pegboard panel'], match: ['pegboard', 'peg board', 'wall organizer', 'wall panel'], caption: { en: 'Pegboard Wall Organizer', he: 'לוח תלייה מנוקב לקיר' } },
      { keywords: ['thread organizer rack', 'embroidery floss organizer'], match: ['thread', 'floss', 'bobbin', 'spool'], caption: { en: 'Thread / Floss Organizer', he: 'מארגן חוטים / פלוס' } },
      { keywords: ['ribbon dispenser organizer', 'ribbon storage box'], match: ['ribbon'], caption: { en: 'Ribbon Dispenser Box', he: 'מתקן סרטים' } },
      { keywords: ['paper storage vertical', 'scrapbook paper organizer'], match: ['paper', 'file', 'folder', 'magazine'], not: ['coffee', 'towel', 'toilet', 'tissue'], caption: { en: 'Vertical Paper Storage', he: 'אחסון נייר אנכי' } },
      { keywords: ['label maker portable', 'thermal label printer'], match: ['label'], caption: { en: 'Portable Label Maker', he: 'מכונת תוויות ניידת' } },
      { keywords: ['rolling cart 3 tier', 'utility cart craft room'], match: ['cart', 'trolley'], caption: { en: '3-Tier Rolling Cart', he: 'עגלה ניידת 3 מדפים' } },
    ],
  },

  'back-to-school': {
    slug: 'back-to-school',
    metaTitle: { en: 'Back to School Supplies', he: 'ציוד לבית הספר' },
    metaDesc: { en: 'Everything students need for the new school year: backpack, stationery, lunch box, calculator, and more.', he: 'כל מה שצריך לתלמידים: תיק, כלי כתיבה, קופסת אוכל, מחשבון ועוד.' },
    h1: { en: 'Back to School: Complete Student Kit', he: 'חזרה לבית הספר: ערכת תלמיד מלאה' },
    intro: { en: 'Get ready for the new school year without breaking the bank. From backpacks to calculators, here are the best deals on AliExpress.', he: 'התכוננו לשנת הלימודים החדשה בלי לשבור את הכיס.' },
    tags: ['school', 'kids', 'education'],
    items: [
      { keywords: ['school backpack bags', 'student backpack'], match: ['backpack', 'school bag', 'schoolbag', 'rucksack'], caption: { en: 'School Backpack', he: 'תיק גב לבית הספר' } },
      { keywords: ['mechanical pencil set', 'drafting pencils'], match: ['pencil'], not: ['case', 'bag', 'pouch', 'sharpener', 'woodworking', 'carpenter'], caption: { en: 'Mechanical Pencil Set', he: 'ערכת עפרונות מכניים' } },
      { keywords: ['bento lunch box', 'kids lunch container'], match: ['bento', 'lunch box', 'lunchbox', 'food container'], caption: { en: 'Bento Lunch Box', he: 'קופסת אוכל בנטו' } },
      { keywords: ['sports water bottle', 'insulated water flask'], match: ['bottle', 'flask', 'tumbler'], caption: { en: 'Insulated Water Bottle', he: 'בקבוק מים מבודד' } },
      { keywords: ['scientific calculator', 'basic calculator'], match: ['calculator'], caption: { en: 'Scientific Calculator', he: 'מחשבון מדעי' } },
      { keywords: ['pencil case large capacity', 'pen bag organizer'], match: ['pencil case', 'pen bag', 'pencil bag', 'pen case', 'pencil pouch', 'pencil box'], caption: { en: 'Large Pencil Case', he: 'קלמר גדול' } },
    ],
  },

  // ====== NEW: WIRELESS AUDIO SETUP ======
  'wireless-audio': {
    slug: 'wireless-audio',
    metaTitle: { en: 'Ultimate Wireless Audio Setup: Earbuds, Headphones & Speakers', he: 'מערך אודיו אלחוטי מושלם: אוזניות ורמקולים' },
    metaDesc: { en: 'Build the perfect wireless audio kit: TWS earbuds, over-ear headphones, bluetooth speaker, charging station, and carry case.', he: 'בנו ערכת אודיו אלחוטית מושלמת: אוזניות TWS, אוזניות קשת, רמקול בלוטוס, עמדת טעינה ונרתיק.' },
    h1: { en: 'Build the Ultimate Wireless Audio Setup', he: 'מערך אודיו אלחוטי אולטימטיבי' },
    intro: { en: 'From commuting earbuds to home speakers and over-ear headphones for deep focus — here is the complete wireless audio kit that covers every listening scenario. No wires, no compromises.', he: 'מאוזניות לנסיעה ועד רמקולים ביתיים ואוזניות קשת לריכוז עמוק — הנה ערכת האודיו האלחוטית השלמה שמכסה כל תרחיש האזנה. בלי חוטים, בלי פשרות.' },
    tags: ['tech', 'desk', 'audio'],
    items: [
      { keywords: ['TWS earbuds wireless', 'true wireless earbuds noise cancelling'], match: ['earbud', 'earphone', 'tws', 'in-ear'], not: ['case', 'cover'], caption: { en: 'TWS Noise-Cancelling Earbuds', he: 'אוזניות TWS מבטלות רעשים' }, note: { en: 'Look for ANC and 30h+ battery life', he: 'חפשו ANC וסוללה 30+ שעות' } },
      { keywords: ['over ear bluetooth headphones', 'wireless headphones foldable'], match: ['headphone', 'headset'], not: ['tws', 'earbud', 'in-ear', 'iem', 'ear buds', 'earhook'], caption: { en: 'Over-Ear Bluetooth Headphones', he: 'אוזניות קשת בלוטוס' }, note: { en: 'Get the foldable ones for travel', he: 'קחו מתקפלות לנסיעות' } },
      { keywords: ['portable bluetooth speaker', 'mini wireless speaker'], match: ['speaker'], caption: { en: 'Portable Bluetooth Speaker', he: 'רמקול בלוטוס נייד' } },
      { keywords: ['wireless charging station', 'multi device charger stand'], match: ['charger', 'charging station', 'charging stand'], caption: { en: 'Multi-Device Charging Station', he: 'עמדת טעינה למספר מכשירים' } },
      { keywords: ['earbuds carrying case', 'hard shell earbuds case'], match: ['case', 'cover'], caption: { en: 'Hard Shell Earbuds Case', he: 'נרתיק קשיח לאוזניות' } },
      { keywords: ['USB C to aux adapter', 'bluetooth transmitter receiver'], match: ['transmitter', 'receiver', 'adapter', 'aux'], caption: { en: 'Bluetooth Transmitter / Adapter', he: 'מתאם בלוטוס / משדר' } },
    ],
    faq: [
      { q: { en: 'Which is better: TWS earbuds or over-ear headphones?', he: 'מה עדיף: אוזניות TWS או קשת?' }, a: { en: 'Both serve different needs. Earbuds are portable and great for commuting/gym. Over-ear headphones offer better soundstage and ANC for office/home. Best to have both for different scenarios.', he: 'שתיהן משרתות צרכים שונים. אוזניות TWS ניידות ומעולות לנסיעה/כושר. אוזניות קשת מציעות במת סאונד רחבה יותר ו-ANC טוב יותר למשרד/בית.' } },
    ],
  },

  // ====== NEW: PHONE ACCESSORIES KIT ======
  'phone-accessories': {
    slug: 'phone-accessories',
    metaTitle: { en: 'Complete Phone Accessories Kit: Protect, Charge & Mount', he: 'ערכת אביזרים מלאה לטלפון: הגנה, טעינה והרכבה' },
    metaDesc: { en: 'Everything your phone needs: protective case, tempered glass, car mount, power bank, fast charger cable, pop socket & wireless charger.', he: 'כל מה שהטלפון צריך: כיסוי מגן, זכוכית מחוסמת, אוחז לרכב, בנק כוח, כבל טעינה מהיר, פופ סוקט ומטען אלחוטי.' },
    h1: { en: 'Complete Phone Accessories Kit', he: 'ערכת אביזרים מלאה לטלפון' },
    intro: { en: 'Your phone is your most-used device — protect it, charge it faster, and mount it everywhere. This complete accessories kit covers every need from morning alarm to midnight scroll.', he: 'הטלפון הוא המכשיר הכי בשימוש שלכם — הגנו עליו, טענו אותו מהר יותר, והרכיבו אותו בכל מקום. ערכת האביזרים המלאה הזו מכסה כל צורך משעון מעורר בבוקר ועד גלילה בחצות.' },
    tags: ['tech', 'travel', 'gadgets'],
    items: [
      { keywords: ['phone case shockproof', 'silicone phone case'], match: ['case', 'cover'], not: ['earbud', 'airpod'], caption: { en: 'Shockproof Phone Case', he: 'כיסוי מגן מפני נפילות' } },
      { keywords: ['tempered glass screen protector', 'privacy screen protector'], match: ['screen protector', 'tempered glass', 'protective film', 'protector'], caption: { en: 'Tempered Glass Screen Protector', he: 'זכוכית מחוסמת למסך' }, note: { en: '2-pack recommended', he: 'חבילת 2 מומלצת' } },
      { keywords: ['car phone mount holder', 'car air vent phone holder'], match: ['car phone', 'car mount', 'car holder', 'vent', 'dashboard', 'car'], caption: { en: 'Car Phone Mount', he: 'אוחז לטלפון לרכב' } },
      { keywords: ['power bank 10000mAh', 'portable charger fast charging'], match: ['power bank', 'powerbank', 'portable charger', 'battery pack'], not: ['car adapter', 'car charger', 'wall'], caption: { en: '10000mAh Power Bank', he: 'בנק כוח 10000mAh' } },
      { keywords: ['USB C braided cable', 'fast charging cable 2m'], match: ['cable'], caption: { en: 'Braided USB-C Cable (2m)', he: 'כבל USB-C קלוע (2 מטר)' } },
      { keywords: ['pop socket grip', 'phone stand grip'], match: ['grip', 'pop socket', 'popsocket', 'ring holder', 'phone stand', 'holder'], caption: { en: 'Pop Socket / Phone Grip', he: 'פופ סוקט / אחיזת טלפון' } },
    ],
    faq: [
      { q: { en: 'Do I need a screen protector if I have a case?', he: 'האם צריך מגן מסך אם יש כיסוי?' }, a: { en: 'Yes — a case protects the edges and back, while a tempered glass protector prevents screen cracks from direct impacts. The two work as a team and are both essential.', he: 'כן — כיסוי מגן על השוליים והגב, בעוד מגן מסך מזכוכית מחוסמת מונע סדקים במסך מפגיעות ישירות. השניים עובדים כצוות ושניהם חיוניים.' } },
      { q: { en: 'What power bank capacity do I need?', he: 'איזה קיבולת בנק כוח צריך?' }, a: { en: '10000mAh charges a modern phone 2-3 times. For travel or longer days, 20000mAh gives 4-5 charges. The sweet spot is 10000mAh for daily carry.', he: '10000mAh מטעין טלפון מודרני 2-3 פעמים. לנסיעות או ימים ארוכים יותר, 20000mAh נותן 4-5 טעינות. הנקודה המתוקה היא 10000mAh לנשיאה יומית.' } },
    ],
  },

  // ====== NEW: SUMMER ESSENTIALS SURVIVAL KIT ======
  'summer-essentials': {
    slug: 'summer-essentials',
    metaTitle: { en: 'Summer Essentials Survival Kit: Beat the Heat', he: 'ערכת הישרדות קיץ: לנצח את החום' },
    metaDesc: { en: 'Your complete summer survival kit: portable fan, cooling towel, insulated water bottle, UV umbrella, sunscreen, and beach bag.', he: 'ערכת ההישרדות השלמה לקיץ: מאוורר נייד, מגבת קירור, בקבוק מים מבודד, מטריית UV, קרם הגנה ותיק חוף.' },
    h1: { en: 'Summer Essentials: Complete Heat Survival Kit', he: 'מוצרי חובה לקיץ: ערכת הישרדות מהחום' },
    intro: { en: 'Summer heat can be brutal — especially during heatwaves. This survival kit keeps you cool, hydrated, and protected. Perfect for commutes, outdoor events, beach days, and the daily walk in the sun.', he: 'חום הקיץ יכול להיות אכזרי — במיוחד בגלי חום. ערכת ההישרדות הזו שומרת עליכם קרירים, לחות ומוגנים. מושלם לנסיעות, אירועים בחוץ, ימי חוף וההליכה היומית בשמש.' },
    tags: ['summer', 'travel', 'outdoor', 'wellness'],
    items: [
      { keywords: ['portable electric fan', 'handheld fan rechargeable'], match: ['fan'], not: ['blower', 'vacuum', 'dust'], caption: { en: 'Rechargeable Portable Fan', he: 'מאוורר נייד נטען' }, note: { en: 'Get USB rechargeable, runs 4-8 hours', he: 'קחו נטען USB, עובד 4-8 שעות' } },
      { keywords: ['cooling towel', 'instant cooling towel'], match: ['towel'], caption: { en: 'Cooling Towel', he: 'מגבת קירור מיידית' } },
      { keywords: ['insulated water bottle', 'vacuum flask cold'], match: ['bottle', 'flask', 'tumbler'], not: ['brush'], caption: { en: 'Insulated Water Bottle (1L)', he: 'בקבוק מים מבודד (1 ליטר)' } },
      { keywords: ['UV umbrella', 'sun umbrella folding'], match: ['umbrella', 'parasol'], caption: { en: 'UV Protection Umbrella', he: 'מטריית הגנה מקרינת UV' } },
      { keywords: ['beach bag large', 'straw beach tote'], match: ['bag', 'tote'], caption: { en: 'Large Beach Tote Bag', he: 'תיק חוף גדול' } },
      { keywords: ['sunglasses UV400', 'polarized sunglasses men women'], match: ['sunglasses', 'glasses'], caption: { en: 'UV400 Polarized Sunglasses', he: 'משקפי שמש UV400 מקטבים' } },
    ],
    faq: [
      { q: { en: 'What cooling method works best without electricity?', he: 'איזו שיטת קירור עובדת הכי טוב בלי חשמל?' }, a: { en: 'A cooling towel soaked in water works instantly — evaporation drops the temperature by 15-20°F. Pair with an insulated bottle for ice-cold water all day.', he: 'מגבת קירור טבולה במים עובדת מיידית — האידוי מוריד את הטמפרטורה ב-8-10 מעלות. שלבו עם בקבוק מבודד למים קרים כקרח כל היום.' } },
    ],
  },
  'budget-gaming-setup': {
    slug: 'budget-gaming-setup',
    metaTitle: { en: 'Budget Gaming Setup: Mouse, Keyboard, Headset and More', he: 'עמדת גיימינג תקציבית' },
    metaDesc: { en: 'Everything you need for a complete gaming setup: mouse, keyboard, headset, mouse pad and mic, all from AliExpress.', he: 'כל מה שצריך לעמדת גיימינג שלמה: עכבר, מקלדת, אוזניות, משטח עכבר ומיקרופון, הכל מאליאקספרס.' },
    h1: { en: 'Build a Complete Gaming Setup', he: 'עמדת גיימינג מלאה' },
    intro: { en: 'You don\'t need to spend a fortune on a gaming setup. Here is every piece of a complete budget gaming station, all from AliExpress, with the set total worked out from today\'s prices.', he: 'אתם לא צריכים להוציא אלפי שקלים על עמדת גיימינג. הנה כל חלק של עמדת גיימינג תקציבית מלאה, הכל מאליאקספרס, עם מחיר הסט לפי המחירים של היום.' },
    items: [
      { keywords: ['gaming mouse rgb wired 6400 dpi'], match: ['mouse'], not: ['pad', 'mat'], caption: { en: 'RGB Gaming Mouse', he: 'עכבר גיימינג RGB' } },
      { keywords: ['mechanical keyboard 60% rgb wired'], match: ['keyboard'], not: ['keycap', 'wrist', 'palm'], caption: { en: '60% Mechanical Keyboard', he: 'מקלדת מכנית 60%' } },
      { keywords: ['gaming headset 7.1 surround sound'], match: ['headset', 'headphone'], not: ['in ear', 'in-ear', 'earbud', 'earphone'], caption: { en: '7.1 Surround Headset', he: 'אוזניות גיימינג 7.1' } },
      { keywords: ['gaming mouse pad xxl extended'], match: ['mouse pad', 'mousepad', 'desk mat', 'mouse mat'], caption: { en: 'XXL Mouse Pad', he: 'משטח עכבר XXL' } },
      { keywords: ['condenser microphone usb podcast'], match: ['microphone', 'mic'], caption: { en: 'USB Condenser Mic', he: 'מיקרופון קונדנסר USB' } },
    ],
    faq: [
      { q: { en: 'Do I need a gaming mouse?', he: 'האם אני צריך עכבר גיימינג?' }, a: { en: 'A gaming mouse has higher DPI (precision) and extra programmable buttons. For FPS and MOBA games, it makes a real difference.', he: 'לעכבר גיימינג יש DPI גבוה יותר (דיוק) וכפתורים ניתנים לתכנות. למשחקי FPS ו-MOBA, זה עושה הבדל משמעותי.' } },
    ],
    tags: ['gaming', 'setup', 'desk'],
  },
  'minimalist-desk': {
    slug: 'minimalist-desk',
    metaTitle: { en: 'Minimalist Desk Setup: Clean & Productive Workspace', he: 'שולחן עבודה מינימליסטי: מרחב עבודה נקי ופרודוקטיבי' },
    metaDesc: { en: 'Build a distraction-free minimalist desk: monitor arm, desk mat, cable tray, wooden pen holder, desk lamp, and plant.', he: 'בנו שולחן עבודה מינימליסטי נטול הסחות: זרוע מסך, משטח שולחן, תעלת כבלים, עפרון עץ, מנורת שולחן ועציץ.' },
    h1: { en: 'Design a Minimalist Desk Setup', he: 'שולחן עבודה מינימליסטי' },
    intro: { en: 'A clean desk is a clear mind. Minimalist desk design reduces visual clutter, improves focus, and makes you actually want to sit down and work. Here\'s everything you need for a clean, functional workspace — with nothing unnecessary.', he: 'שולחן נקי = ראש נקי. עיצוב מינימליסטי מפחית עומס ויזואלי, משפר ריכוז וגורם לכם ממש לרצות לשבת ולעבוד. הנה כל מה שצריך למרחב עבודה נקי ופונקציונלי — בלי שום דבר מיותר.' },
    tags: ['room-design', 'desk', 'home-office', 'minimalist'],
    items: [
      { keywords: ['monitor arm gas spring', 'single monitor mount desk'], match: ['monitor arm', 'monitor mount', 'monitor stand', 'monitor bracket', 'monitor holder'], caption: { en: 'Monitor Arm (Gas Spring)', he: 'זרוע מסך (גז)' }, note: { en: 'Frees up desk space instantly', he: 'משחרר מקום על השולחן מיידית' } },
      { keywords: ['large desk mat', 'leather desk pad'], match: ['desk mat', 'desk pad', 'mouse pad', 'mousepad', 'mouse mat'], not: ['nail'], caption: { en: 'Large Desk Mat / Pad', he: 'משטח שולחן גדול' }, note: { en: 'Fabric or leather, choose neutral colors', he: 'בד או עור, בחרו צבעים ניטרליים' } },
      { keywords: ['cable management tray', 'under desk cable organizer'], match: ['cable tray', 'cable management', 'cable organizer', 'wire organizer', 'cable organiser', 'tray'], caption: { en: 'Under-Desk Cable Tray', he: 'תעלת כבלים מתחת לשולחן' } },
      { keywords: ['wooden pen holder', 'desk organizer bamboo'], match: ['pen holder', 'organizer', 'organiser', 'holder'], not: ['cable', 'wire'], caption: { en: 'Wooden Desk Organizer', he: 'מארגן שולחן מעץ' } },
      { keywords: ['LED desk lamp USB', 'minimalist desk lamp'], match: ['lamp', 'light'], caption: { en: 'Minimalist LED Desk Lamp', he: 'מנורת שולחן לד מינימליסטית' } },
      { keywords: ['small desk plant', 'succulent pot ceramic'], match: ['plant', 'succulent', 'pot', 'planter'], not: ['mesh', 'pad', 'mat'], caption: { en: 'Small Desk Plant', he: 'עציץ קטן לשולחן' } },
    ],
    faq: [
      { q: { en: 'What colors work for a minimalist desk?', he: 'איזה צבעים מתאימים לשולחן מינימליסטי?' }, a: { en: 'White, black, warm wood tones, and a single accent color (green from a plant). Keep everything monochrome — the desk mat, organizer, lamp, and accessories should match.', he: 'לבן, שחור, גווני עץ חמים, וצבע מבטא אחד (ירוק מהצמח). שמרו הכל מונוכרומטי.' } },
    ],
  },
  'pet-corner': {
    slug: 'pet-corner',
    metaTitle: { en: 'Pet Corner Setup: Complete Dog & Cat Station', he: 'פינת חיית מחמד: עמדה שלמה לכלב או חתול' },
    metaDesc: { en: 'Everything for a dedicated pet corner: bed, feeding station, toy storage, grooming station, water fountain, and mat.', he: 'כל מה שצריך לפינת חיית מחמד: מיטה, עמדת האכלה, אחסון צעצועים, עמדת טיפוח, מזרקת מים ומשטח.' },
    h1: { en: 'Build the Perfect Pet Corner', he: 'פינת חיית מחמד מושלמת' },
    intro: { en: 'A dedicated pet corner keeps your furry friend\'s things organized and your home tidy. No more stepping on toys or searching for the leash. Here\'s the complete setup — from feeding to grooming to play — all in one spot.', he: 'פינת חיית מחמד ייעודית שומרת על החפצים של החבר הפרוותי מסודרים ועל הבית נקי. בלי לדרוך על צעצועים או לחפש רצועה. הנה הערכה השלמה — מהאכלה לטיפוח למשחק — הכל במקום אחד.' },
    tags: ['pet', 'organization', 'room-design'],
    items: [
      { keywords: ['pet bed orthopedic', 'dog bed washable'], match: ['bed', 'cushion', 'sofa', 'nest'], not: ['pee', 'urine', 'incontinence', 'pad', 'blanket'], caption: { en: 'Orthopedic Pet Bed', he: 'מיטת חיות מחמד אורטופדית' }, note: { en: 'Washable cover is essential', he: 'כיסוי ניתן לכביסה זה חיוני' } },
      { keywords: ['pet water fountain', 'stainless steel pet fountain'], match: ['fountain', 'water dispenser'], caption: { en: 'Pet Water Fountain', he: 'מזרקת מים לחיות מחמד' } },
      { keywords: ['raised pet bowls', 'elevated dog feeder'], match: ['bowl', 'feeder', 'feeding'], not: ['mat'], caption: { en: 'Elevated Feeding Station', he: 'עמדת האכלה מוגבהת' } },
      { keywords: ['pet toy storage bin', 'pet toy basket'], match: ['storage', 'basket', 'bin', 'box'], also: ['toy'], not: ['bed', 'blind box', 'doll'], caption: { en: 'Toy Storage Bin', he: 'סל אחסון צעצועים' } },
      { keywords: ['pet grooming brush kit', 'pet grooming glove'], match: ['brush', 'comb', 'grooming', 'glove', 'deshedding'], caption: { en: 'Grooming Tool Kit', he: 'ערכת כלי טיפוח' } },
      { keywords: ['pet feeding mat', 'waterproof pet mat'], match: ['mat', 'placemat'], not: ['litter', 'sensory', 'inflatable'], caption: { en: 'Waterproof Feeding Mat', he: 'משטח האכלה עמיד מים' } },
    ],
    faq: [
      { q: { en: 'Where should I put the pet corner?', he: 'איפה למקם את פינת חיית המחמד?' }, a: { en: "A quiet corner of the kitchen or living room — away from heavy foot traffic and loud appliances. Make sure it's not in direct sunlight or drafty areas. Cats prefer elevated spots; dogs prefer ground level.", he: 'פינה שקטה במטבח או בסלון — הרחק מתנועה כבדה ומכשירים רועשים. וודאו שזה לא בשמש ישירה או בטיוטות.' } },
    ],
  },
};

export function getMoodBoard(slug: string): MoodBoard | undefined {
  return MOOD_BOARDS[slug];
}

export function getMoodBoardsByTag(tag: string): MoodBoard[] {
  return Object.values(MOOD_BOARDS).filter(b => b.tags.includes(tag));
}

export interface MoodBoardLink {
  slug: string;
  title: string;
}

const SEASONAL_TAGS = ['costume', 'summer', 'school'];

/** A few year-round boards, rotated by day so the row changes. */
export function moodBoardLinks(lang: string, count: number, day = Math.floor(Date.now() / 86400000)): MoodBoardLink[] {
  const boards = Object.values(MOOD_BOARDS).filter((b) => !b.tags.some((t) => SEASONAL_TAGS.includes(t)));
  const start = day % boards.length;
  return [...boards.slice(start), ...boards.slice(0, start)]
    .slice(0, count)
    .map((b) => ({ slug: b.slug, title: b.h1[lang] || b.h1.en }));
}

export function getAllMoodboardSlugs(): string[] {
  return Object.keys(MOOD_BOARDS);
}