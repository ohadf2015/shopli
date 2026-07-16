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
// ====== PURIM / COSTUMES ======
  'jack-sparrow': {
    slug: 'jack-sparrow',
    metaTitle: { en: 'The Complete Jack Sparrow Costume: Pirate Cosplay Under €30', he: 'תחפושת ג\'ק ספארו המלאה: קוספליי שודד ים בפחות מ-₪120' },
    metaDesc: { en: 'Every item you need for an authentic Jack Sparrow look: tricorn hat, pirate shirt, compass necklace, wig, boots & sword. Complete cosplay guide.', he: 'כל מה שצריך למראה ג\'ק ספארו אותנטי: כובע משולש, חולצת פיראט, שרשרת מצפן, פאה, מגפיים וחרב. מדריך קוספליי מלא.' },
    h1: { en: 'Build the Perfect Jack Sparrow Costume Under €30', he: 'תחפושת ג\'ק ספארו מושלמת בפחות מ-₪120' },
    intro: { en: 'Captain Jack Sparrow is one of the most iconic pirate costumes — and you can build an authentic-looking outfit without spending a fortune. Here\'s every piece you need, from the tricorn hat to the pirate boots.', he: 'ג\'ק ספארו הוא אחת מתחפושות הפיראטים האייקוניות ביותר — ואתם יכולים לבנות מראה אותנטי בלי להוציא הון. הנה כל חלק שאתם צריכים, מהכובע המשולש ועד המגפיים.' },
    tags: ['purim', 'costume', 'halloween'],
    items: [
      { keywords: ['tricorn pirate hat', 'captain hat pirate'], caption: { en: 'Tricorn Hat', he: 'כובע משולש פיראט' }, note: { en: 'Get the weathered leather look', he: 'לכו על מראה עור שחוק' } },
      { keywords: ['pirate shirt men', 'renaissance poet shirt'], caption: { en: 'Pirate Shirt / Poet Blouse', he: 'חולצת פיראט' }, note: { en: 'White billowy cotton, unbutton at collar', he: 'כותנה לבנה רפויה, כפתור עליון פתוח' } },
      { keywords: ['cosplay wig long dreadlocks', 'pirate dreadlock wig'], caption: { en: 'Dreadlock Wig with Beads', he: 'פאה עם ראסטות וחרוזים' } },
      { keywords: ['compass necklace pirate', 'astrolabe pendant'], caption: { en: 'Compass Pendant Necklace', he: 'שרשרת עם תליון מצפן' } },
      { keywords: ['pirate boots costume', 'faux leather pirate boots'], caption: { en: 'Pirate Boots', he: 'מגפי פיראט' } },
      { keywords: ['pirate sword prop', 'cosplay sword pirate'], caption: { en: 'Pirate Sword (Prop)', he: 'חרב פיראט (אביזר)' } },
    ],
    totalEstimate: { en: 'Complete look: ~€25-40', he: 'מראה שלם: ~₪100-160' },
  },

  'sushi-night': {
    slug: 'sushi-night',
    metaTitle: { en: 'DIY Sushi Night Kit: Make Restaurant-Quality Sushi at Home Under €25', he: 'ערכת סושי ביתית: להכין סושי ברמה של מסעדה בפחות מ-₪100' },
    metaDesc: { en: 'Everything for a sushi night at home: sushi maker, rice paddle, soy sauce dish, chopsticks, bamboo mat & nori seaweed.', he: 'כל מה שצריך לערב סושי ביתי: מכונת סושי, מצקת אורז, צלוחית סויה, מקלות אכילה, מחצלת במבוק ואצות נורי.' },
    h1: { en: 'Complete Sushi Making Kit Under €25', he: 'ערכת סושי מלאה בפחות מ-₪100' },
    intro: { en: 'Making sushi at home is cheaper than takeout and way more fun. Here\'s the complete kit — tools, accessories, and ingredients you need to roll like a pro.', he: 'להכין סושי בבית זה זול יותר ממשלוח והרבה יותר כיף. הערכה המלאה — כלים, אביזרים ומרכיבים כדי לגלגל כמו מקצוען.' },
    tags: ['kitchen', 'japanese', 'cooking'],
    items: [
      { keywords: ['sushi maker kit', 'sushi making mold'], caption: { en: 'Sushi Maker / Mold', he: 'מכונת סושי / תבנית' } },
      { keywords: ['bamboo sushi mat', 'makisu'], caption: { en: 'Bamboo Rolling Mat', he: 'מחצלת גלגול במבוק' } },
      { keywords: ['nori seaweed sheets', 'sushi nori'], caption: { en: 'Nori Seaweed Sheets (50pk)', he: 'דפי נורי (50 יחידות)' } },
      { keywords: ['sushi rice paddle', 'rice spatula'], caption: { en: 'Rice Paddle (Shamoji)', he: 'מצקת אורז' } },
      { keywords: ['sushi chopsticks set', 'reusable chopsticks'], caption: { en: 'Reusable Chopsticks', he: 'מקלות אכילה רב-פעמיים' }, note: { en: 'Get the dishwasher-safe ones', he: 'קחו כאלה שמתאימים למדיח' } },
      { keywords: ['soy sauce dish ceramic', 'dipping sauce bowl'], caption: { en: 'Soy Sauce Dishes (2-4pk)', he: 'צלוחיות סויה' } },
    ],
    totalEstimate: { en: 'Full kit: ~€15-25', he: 'ערכה מלאה: ~₪60-100' },
    faq: [
      { q: { en: 'Do I need a rice cooker too?', he: 'צריך גם סיר אורז?' }, a: { en: 'Not essential — any pot works. But a rice cooker makes perfect sushi rice every time.', he: 'לא חייב — כל סיר עובד. אבל סיר אורז עושה אורז סושי מושלם כל פעם.' } },
    ],
  },

  'mechanical-keyboard': {
    slug: 'mechanical-keyboard',
    metaTitle: { en: 'Custom Mechanical Keyboard Setup: Build Your Dream Typing Experience Under €70', he: 'מקלדת מכאנית מותאמת אישית בפחות מ-₪300' },
    metaDesc: { en: 'Complete custom keyboard setup: hot-swap keyboard, PBT keycaps, artisan keycap, coiled cable, wrist rest & switch puller.', he: 'מקלדת מכאנית מותאמת אישית: מקלדת hot-swap, כפתורי PBT, כבל מפותל, משענת יד ומוציא סוויצ\'ים.' },
    h1: { en: 'Build Your Custom Mechanical Keyboard Under €70', he: 'מקלדת מכאנית מותאמת אישית בפחות מ-₪300' },
    intro: { en: 'A custom mechanical keyboard isn\'t just a tool — it\'s a daily joy. Hot-swap switches, satisfying keycaps, a coiled cable, and a wrist rest that makes typing effortless. Here\'s how to build yours.', he: 'מקלדת מכאנית מותאמת אישית זה לא רק כלי — זה תענוג יומיומי. סוויצ\'ים שאפשר להחליף, כפתורים מספקים, כבל מפותל ומשענת יד שהופכים את ההקלדה לקלה.' },
    tags: ['desk', 'tech', 'gaming'],
    items: [
      { keywords: ['AJAZZ AK820 mechanical keyboard', 'hot swap mechanical keyboard 75%'], caption: { en: 'Hot-Swap Mechanical Keyboard (75%)', he: 'מקלדת מכאנית Hot-Swap 75%' } },
      { keywords: ['PBT keycaps 108', 'custom keycaps OEM'], caption: { en: 'PBT Keycap Set', he: 'ערכת כפתורי PBT' } },
      { keywords: ['artisan keycap resin', 'custom keycap'], caption: { en: 'Artisan Keycap (Esc)', he: 'כפתור ארטיזן (Esc)' } },
      { keywords: ['coiled keyboard cable USB C', 'aviator coiled cable'], caption: { en: 'Coiled USB-C Cable', he: 'כבל USB-C מפותל' } },
      { keywords: ['mechanical keyboard wrist rest', 'palm rest keyboard'], caption: { en: 'Wrist Rest', he: 'משענת יד' } },
      { keywords: ['keycap puller switch puller', 'keyboard tool kit'], caption: { en: 'Switch & Keycap Puller Set', he: 'ערכת מוציא כפתורים וסוויצ\'ים' } },
    ],
    totalEstimate: { en: 'Full setup: ~€55-70', he: 'ערכה מלאה: ~₪220-280' },
  },

  'study-corner': {
    slug: 'study-corner',
    metaTitle: { en: 'Aesthetic Study Corner: Build a Focused Workspace Under €40', he: 'פינת לימוד אסתטית: מרחב למידה ממוקד בפחות מ-₪160' },
    metaDesc: { en: 'Everything for a distraction-free study space: desk lamp, cork board, storage caddy, desk mat, timer & plant.', he: 'כל מה שצריך לפינת לימוד: מנורת שולחן, לוח שעם, מארגן, משטח שולחן, טיימר ועציץ.' },
    h1: { en: 'Design Your Perfect Study Corner Under €40', he: 'פינת לימוד מושלמת בפחות מ-₪160' },
    intro: { en: 'A well-designed study space makes focusing easier and studying more enjoyable. Here\'s how to build an aesthetic, functional corner that actually helps you learn.', he: 'פינת לימוד מעוצבת הופכת את ההתרכזות לקלה יותר והלימודים לנעימים יותר. הנה איך לבנות פינה אסתטית ופונקציונלית שבאמת עוזרת ללמוד.' },
    tags: ['desk', 'students', 'home-office'],
    items: [
      { keywords: ['LED desk lamp USB', 'clip on reading light'], caption: { en: 'LED Desk Lamp (USB-C)', he: 'מנורת לד (USB-C)' }, note: { en: 'Warm white recommended', he: 'לבן חם מומלץ' } },
      { keywords: ['cork bulletin board', 'pin board wall'], caption: { en: 'Cork Pin Board', he: 'לוח שעם' } },
      { keywords: ['desk storage caddy', 'pencil holder organizer'], caption: { en: 'Desk Organizer Caddy', he: 'מארגן שולחן' } },
      { keywords: ['desk pad mouse pad large', 'writing desk mat'], caption: { en: 'Large Desk Pad / Mouse Mat', he: 'משטח שולחן גדול' } },
      { keywords: ['mechanical timer kitchen', 'focus timer'], caption: { en: 'Study Timer (Pomodoro)', he: 'טיימר לימוד (פומודורו)' } },
      { keywords: ['small desk plant fake', 'succulent pot'], caption: { en: 'Small Desk Plant', he: 'עציץ קטן לשולחן' } },
    ],
    totalEstimate: { en: 'Complete corner: ~€25-40', he: 'פינה שלמה: ~₪100-160' },
  },

  'beach-day': {
    slug: 'beach-day',
    metaTitle: { en: 'Beach Day Essentials: Stress-Free Beach Kit Under €30', he: 'ערכת יום חוף מושלמת בפחות מ-₪120' },
    metaDesc: { en: 'Everything for the perfect beach day: waterproof phone pouch, beach mat, cooler bag, float, hat, and speaker.', he: 'כל מה שצריך ליום חוף מושלם: שקית פלאפון אטומה, מזרן חוף, צידנית, מתנפח, כובע ורמקול.' },
    h1: { en: 'Your Complete Beach Day Kit Under €30', he: 'ערכת יום חוף שלמה בפחות מ-₪120' },
    intro: { en: 'No more rushing before the beach or overpaying at the kiosk. Pack this kit once and have the perfect beach day every time — from the waterproof phone case to the inflatable float.', he: 'בלי למהר לפני הים או לשלם ביוקר בקיוסק. ארזו את הערכה הזו פעם אחת ושיהיה לכם יום חוף מושלם בכל פעם.' },
    tags: ['summer', 'travel', 'outdoor'],
    items: [
      { keywords: ['waterproof phone pouch', 'dry bag phone'], caption: { en: 'Waterproof Phone Pouch', he: 'שקית פלאפון אטומה למים' } },
      { keywords: ['beach mat sand proof', 'picnic blanket portable'], caption: { en: 'Sand-Proof Beach Mat', he: 'מזרן חוף נגד חול' } },
      { keywords: ['insulated cooler bag', 'beach cooler tote'], caption: { en: 'Insulated Cooler Bag', he: 'תיק צידנית מבודד' } },
      { keywords: ['inflatable pool float', 'beach floatie'], caption: { en: 'Inflatable Pool Float', he: 'מזרון מתנפח' } },
      { keywords: ['sun hat UV protection', 'wide brim beach hat'], caption: { en: 'UV Protection Sun Hat', he: 'כובע שמש עם הגנת UV' } },
      { keywords: ['portable bluetooth speaker', 'waterproof speaker'], caption: { en: 'Waterproof Bluetooth Speaker', he: 'רמקול בלוטות\' עמיד מים' } },
    ],
    totalEstimate: { en: 'Full beach kit: ~€20-30', he: 'ערכת חוף מלאה: ~₪80-120' },
    faq: [
      { q: { en: 'Are the floats durable?', he: 'המתנפחים עמידים?' }, a: { en: 'Most inflatables on AliExpress are made of thick PVC and last multiple seasons. Just avoid sharp objects.', he: 'רוב המתנפחים באליאקספרס עשויים PVC עבה שמחזיק עונות שלמות. רק להתרחק מחפצים חדים.' } },
    ],
  },

  'home-bar': {
    slug: 'home-bar',
    metaTitle: { en: 'Home Bar Starter Kit: Mix Cocktails Like a Bartender Under €35', he: 'בר ביתי למתחילים: להכין קוקטיילים כמו ברמן בפחות מ-₪140' },
    metaDesc: { en: 'Complete bar setup: shaker set, jigger, muddler, strainer, cocktail glasses, ice molds & garnish tools.', he: 'ערכת בר שלמה: שייקר, מידות, מודלר, מסנן, כוסות קוקטייל, תבניות קרח וכלי קישוט.' },
    h1: { en: 'Build a Home Bar That Impresses (Under €35)', he: 'בר ביתי שמרשים (פחות מ-₪140)' },
    intro: { en: 'Why pay €15 for a cocktail when you can make better ones at home? With these 6 tools, you can mix anything from an Old Fashioned to a Margarita.', he: 'למה לשלם ₪60 על קוקטייל כשאפשר להכין טוב יותר בבית? עם 6 הכלים האלה, אפשר לערבב הכל מאולד פאשנד ועד מרגריטה.' },
    tags: ['kitchen', 'party', 'home'],
    items: [
      { keywords: ['cocktail shaker set', 'boston shaker stainless steel'], caption: { en: 'Cocktail Shaker Set (Boston)', he: 'ערכת שייקר קוקטיילים' } },
      { keywords: ['jigger double sided', 'measuring jigger bartender'], caption: { en: 'Double Jigger (30/45ml)', he: 'מידות כפולות' } },
      { keywords: ['muddler wooden', 'cocktail muddler'], caption: { en: 'Wooden Muddler', he: 'מודלר עץ' } },
      { keywords: ['cocktail strainer', 'hawthorne strainer'], caption: { en: 'Hawthorne Strainer', he: 'מסננת קוקטיילים' } },
      { keywords: ['whiskey tumbler glasses', 'old fashioned glasses set'], caption: { en: 'Whiskey Tumbler Glasses (4pk)', he: 'כוסות וויסקי (4 יחידות)' } },
      { keywords: ['ice ball mold silicone', 'whiskey ice mold'], caption: { en: 'Large Ice Ball / Ice Mold', he: 'תבנית קרח כדור גדול' } },
    ],
    totalEstimate: { en: 'Complete bar: ~€20-35', he: 'בר שלם: ~₪80-140' },
  },

  'morning-routine': {
    slug: 'morning-routine',
    metaTitle: { en: 'Perfect Morning Routine Kit: Start Your Day Right Under €25', he: 'ערכת בוקר מושלמת: להתחיל את היום נכון בפחות מ-₪100' },
    metaDesc: { en: 'Everything for a calm, productive morning: smart alarm clock, French press, gratitude journal, yoga mat, water bottle, and diffuser.', he: 'כל מה שצריך לבוקר רגוע ופרודוקטיבי: שעון מעורר חכם, פרנץ\' פרס, יומן הכרת תודה, מזרן יוגה, בקבוק מים ומפזר.' },
    h1: { en: 'Your Perfect Morning Routine Starts Here (Under €25)', he: 'בוקר מושלם מתחיל כאן (בפחות מ-₪100)' },
    intro: { en: 'A great morning sets the tone for the entire day. Instead of hitting snooze and scrolling your phone, try this morning kit — designed to wake you up gently and set you up for focus.', he: 'בוקר טוב קובע את הטון לכל היום. במקום לסנוז ולגלול בטלפון, נסו את ערכת הבוקר הזו — מעוצבת להעיר בעדינות ולהכין אתכם לריכוז.' },
    tags: ['wellness', 'mindfulness', 'home'],
    items: [
      { keywords: ['sunrise alarm clock', 'wake up light alarm'], caption: { en: 'Sunrise Alarm Clock', he: 'שעון מעורר מדמה זריחה' } },
      { keywords: ['french press coffee maker', 'coffee plunger'], caption: { en: 'French Press (Stainless)', he: 'פרנץ\' פרס מנירוסטה' } },
      { keywords: ['gratitude journal notebook', 'morning pages journal'], caption: { en: 'Morning Journal / Notebook', he: 'יומן בוקר / מחברת' } },
      { keywords: ['yoga mat exercise', 'non slip workout mat'], caption: { en: 'Yoga Mat (6mm+)', he: 'מזרן יוגה (6מ"מ+)' } },
      { keywords: ['large water bottle time marker', 'motivational water bottle'], caption: { en: 'Water Bottle with Time Marks', he: 'בקבוק מים עם סימוני שעות' } },
      { keywords: ['essential oil diffuser', 'aromatherapy diffuser'], caption: { en: 'Aromatherapy Diffuser', he: 'מפזר ארומתרפיה' } },
    ],
    totalEstimate: { en: 'Full kit: ~€18-25', he: 'ערכה שלמה: ~₪70-100' },
  },

  'camping-coffee': {
    slug: 'camping-coffee',
    metaTitle: { en: 'Camping Coffee Kit: Brew in the Wild Under €20', he: 'ערכת קפה לקמפינג: קפה בשטח בפחות מ-₪80' },
    metaDesc: { en: 'Everything for great coffee while camping: portable espresso maker, camping stove, folding mug, coffee grinder, and aeropress.', he: 'כל מה שצריך לקפה מעולה בקמפינג: מכונת אספרסו ניידת, כיריים מתקפלות, ספל, מטחנה ואירופרס.' },
    h1: { en: 'Great Coffee in the Wilderness Under €20', he: 'קפה מעולה בטבע בפחות מ-₪80' },
    intro: { en: 'Instant coffee in the woods? Not anymore. With these compact tools, you can brew proper coffee at your campsite — from espresso on a pocket stove to pour-over with a view.', he: 'קפה נמס ביער? כבר לא. עם הכלים הקומפקטיים האלה, תבשלו קפה אמיתי במחנה.' },
    tags: ['camping', 'coffee', 'outdoor'],
    items: [
      { keywords: ['portable espresso maker', 'manual espresso machine camping'], caption: { en: 'Portable Espresso Maker', he: 'מכונת אספרסו ניידת' } },
      { keywords: ['camping stove portable', 'pocket stove backpacking'], caption: { en: 'Camping Stove (Pocket)', he: 'כיריים ניידות' } },
      { keywords: ['folding camping mug', 'collapsible silicone cup'], caption: { en: 'Folding Silicone Mug', he: 'ספל סיליקון מתקפל' } },
      { keywords: ['hand coffee grinder', 'mini manual burr grinder'], caption: { en: 'Manual Coffee Grinder', he: 'מטחנת קפה ידנית' } },
      { keywords: ['aero press go camping', 'Aeropress travel'], caption: { en: 'Aeropress / Pour Over', he: 'אירופרס / פור-אובר' } },
    ],
    totalEstimate: { en: 'Full coffee kit: ~€15-20', he: 'ערכת קפה מלאה: ~₪60-80' },
  },

  // ====== MORE COSTUME PAGES ======
  'queen-esther': {
    slug: 'queen-esther',
    metaTitle: { en: 'Queen Esther Costume: Royal Purim Look Under €25', he: 'תחפושת אסתר המלכה: מראה מלכותי לפורים בפחות מ-₪100' },
    metaDesc: { en: 'Complete Queen Esther costume: royal dress, crown, jewelry, scepter, and cape. Perfect for Purim celebrations.', he: 'תחפושת אסתר המלכה המלאה: שמלה מלכותית, כתר, תכשיטים, שרביט וגלימה. מושלם לחג פורים.' },
    h1: { en: 'Queen Esther Costume: Royal & Elegant (Under €25)', he: 'תחפושת אסתר המלכה: מלכותית ואלגנטית (פחות מ-₪100)' },
    intro: { en: 'Queen Esther is the most iconic Purim costume. Here\'s how to build a regal, elegant look that feels royal without breaking the bank.', he: 'אסתר המלכה היא התחפושת הכי אייקונית בפורים. הנה איך לבנות מראה מלכותי ואלגנטי שלא שובר את הכיס.' },
    tags: ['purim', 'costume', 'israel'],
    items: [
      { keywords: ['queen dress costume', 'royal medieval dress women'], caption: { en: 'Royal Dress / Gown', he: 'שמלת מלכה' } },
      { keywords: ['queen crown tiara', 'royal crown gold'], caption: { en: 'Crown / Tiara', he: 'כתר / טיארה' } },
      { keywords: ['royal necklace jewelry set', 'gold statement necklace'], caption: { en: 'Royal Jewelry Set', he: 'ערכת תכשיטים מלכותית' } },
      { keywords: ['scepter royal prop', 'queen scepter wand'], caption: { en: 'Scepter (Royal Prop)', he: 'שרביט מלכותי' } },
      { keywords: ['royal cape cloak', 'velvet cape women'], caption: { en: 'Velvet Cape / Cloak', he: 'גלימת קטיפה' } },
    ],
    totalEstimate: { en: 'Full costume: ~€15-25', he: 'תחפושת שלמה: ~₪60-100' },
  },

  'pikachu': {
    slug: 'pikachu',
    metaTitle: { en: 'Pikachu Costume: Cutest Pokemon Cosplay Under €20', he: 'תחפושת פיקאצ\'ו: הקוספליי הכי חמוד לפורים בפחות מ-₪80' },
    metaDesc: { en: 'Everything for a perfect Pikachu costume: onesie, hat with ears, cheek stickers, tail, gloves and Pokéball prop.', he: 'כל מה שצריך לתחפושת פיקאצ\'ו מושלמת: סרבל, כובע עם אוזניים, מדבקות לחיים, זנב, כפפות וכדור פוקימון.' },
    h1: { en: 'Pikachu Costume: Be the Cutest Pokémon Under €20', he: 'תחפושת פיקאצ\'ו: להיות הפוקימון הכי חמוד בפחות מ-₪80' },
    intro: { en: 'Pikachu is a timeless favorite — kids and adults love it. Here\'s the complete costume: from the yellow onesie to the cheek blush stickers and Pokéball.', he: 'פיקאצ\'ו הוא אהוב נצחי — ילדים ומבוגרים אוהבים אותו. התחפושת המלאה: מהסרבל הצהוב ועד מדבקות הלחיים וכדור הפוקימון.' },
    tags: ['purim', 'costume', 'kids', 'halloween'],
    items: [
      { keywords: ['pikachu onesie pajama', 'pokemon costume kigurumi'], caption: { en: 'Pikachu Onesie', he: 'סרבל פיקאצ\'ו' } },
      { keywords: ['pikachu hat ears', 'pokemon hat cap'], caption: { en: 'Pikachu Hat with Ears', he: 'כובע פיקאצ\'ו עם אוזניים' } },
      { keywords: ['pokemon tail prop', 'pikachu tail'], caption: { en: 'Pikachu Tail', he: 'זנב פיקאצ\'ו' } },
      { keywords: ['pokeball prop toy', 'pokemon ball plush'], caption: { en: 'Pokéball (Prop)', he: 'כדור פוקימון' } },
    ],
    totalEstimate: { en: 'Full costume: ~€12-20', he: 'תחפושת שלמה: ~₪50-80' },
  },

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
    metaTitle: { en: 'Home Gym Pro: Serious Workout Setup Under €80', he: 'חדר כושר ביתי מקצועי: מתקדם בפחות מ-₪320' },
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

// ====== NEW: KITCHEN, NURSERY, CRAFT ROOM ======

  'kitchen-makeover': {
    slug: 'kitchen-makeover',
    metaTitle: { en: 'Kitchen Makeover: Functional & Beautiful Under €50', he: 'מהפך מטבח: פונקציונלי ויפה בפחות מ-₪200' },
    metaDesc: { en: 'Upgrade your kitchen: magnetic knife strip, spice jars, utensil crock, cutting board, countertop organizer & dish rack.', he: 'לשדרג את המטבח: פס מגנטי לסכינים, צנצנות תבלינים, כלי כפות, קרש חיתוך, מארגן משטח ומתקן ייבוש.' },
    h1: { en: 'Kitchen Makeover: Beautiful & Functional Under €50', he: 'מהפך מטבח: יפה ופונקציונלי בפחות מ-₪200' },
    intro: { en: 'A great kitchen is organized, efficient, and a joy to cook in. Magnetic strips, uniform jars, and smart storage transform any kitchen — rental or owned.', he: 'מטבח מעולה הוא מסודר, יעיל וכיף לבשל בו. פסים מגנטיים, צנצנות אחידות ואחסון חכם משנים כל מטבח — שכור או בבעלות.' },
    tags: ['room-design', 'kitchen', 'organization'],
    items: [
      { keywords: ['magnetic knife strip', 'magnetic knife holder wall'], caption: { en: 'Magnetic Knife Strip', he: 'פס מגנטי לסכינים' } },
      { keywords: ['spice jar set uniform', 'glass spice jars labels'], caption: { en: 'Uniform Spice Jars (12-16pk)', he: 'צנצנות תבלינים אחידות (12-16)' } },
      { keywords: ['utensil crock ceramic', 'kitchen utensil holder'], caption: { en: 'Utensil Crock / Holder', he: 'כלי כפות / מארגן' } },
      { keywords: ['cutting board bamboo', 'large chopping board'], caption: { en: 'Large Bamboo Cutting Board', he: 'קרש חיתוך במבוק גדול' } },
      { keywords: ['countertop organizer', 'kitchen shelf tiered'], caption: { en: 'Tiered Countertop Organizer', he: 'מארגן משטח מדורג' } },
      { keywords: ['dish drying rack', 'foldable dish drainer'], caption: { en: 'Foldable Dish Drying Rack', he: 'מתקן ייבוש כלים מתקפל' } },
    ],
    totalEstimate: { en: 'Full makeover: ~€35-50', he: 'מהפך מלא: ~₪140-200' },
  },

  'nursery-room': {
    slug: 'nursery-room',
    metaTitle: { en: 'Nursery Room Setup: Sweet Baby Space Under €60', he: 'עיצוב חדר תינוקות: חלל מתוק לקטנטנים בפחות מ-₪240' },
    metaDesc: { en: 'Everything for a cozy nursery: crib mobile, night light, sound machine, storage baskets, changing caddy & wall decals.', he: 'כל מה שצריך לחדר תינוקות נעים: מובייל לעריסה, מנורת לילה, מכונת צליל, סלי אחסון, תיק החתלה ומדבקות קיר.' },
    h1: { en: 'Nursery Room: Sweet & Practical Under €60', he: 'חדר תינוקות: מתוק ופרקטי בפחות מ-₪240' },
    intro: { en: 'Designing a nursery is about calm, safety, and functionality. Soft lighting, gentle sounds, and smart storage create a space both baby and parents love.', he: 'עיצוב חדר תינוקות זה רוגע, בטיחות ופונקציונליות. תאורה רכה, צלילים עדינים ואחסון חכם יוצרים חלל שאהבים גם התינוק וגם ההורים.' },
    tags: ['room-design', 'nursery', 'baby'],
    items: [
      { keywords: ['baby crib mobile', 'musical mobile crib'], caption: { en: 'Crib Mobile (Musical)', he: 'מובייל מוזיקלי לעריסה' } },
      { keywords: ['baby night light', 'nursery night lamp'], caption: { en: 'Soft Night Light', he: 'מנורת לילה רכה' } },
      { keywords: ['white noise machine baby', 'sound machine nursery'], caption: { en: 'White Noise / Sound Machine', he: 'מכונת צליל / רעש לבן' } },
      { keywords: ['nursery storage baskets', 'fabric storage bins'], caption: { en: 'Fabric Storage Baskets (3pk)', he: 'סלי אחסון מבד (3 יחידות)' } },
      { keywords: ['diaper caddy organizer', 'changing table organizer'], caption: { en: 'Diaper Changing Caddy', he: 'מארגן החתלה' } },
      { keywords: ['wall decals nursery', 'removable wall stickers'], caption: { en: 'Removable Wall Decals', he: 'מדבקות קיר ניתנות להסרה' } },
    ],
    totalEstimate: { en: 'Full nursery: ~€40-60', he: 'חדר שלם: ~₪160-240' },
    faq: [
      { q: { en: 'When should I set up the nursery?', he: 'מתי להקים את החדר?' }, a: { en: 'Most parents set up 2-3 months before due date. Gives time to air out any new furniture.', he: 'רוב ההורים מקימים 2-3 חודשים לפני הלידה. נותן זמן לאוורר רהיטים חדשים.' } },
    ],
  },

  'craft-room': {
    slug: 'craft-room',
    metaTitle: { en: 'Craft Room Organization: Creative Studio Under €50', he: 'חדר יצירה מאורגן: סטודיו יצירתי בפחות מ-₪200' },
    metaDesc: { en: 'Organize your craft space: pegboard wall, thread organizer, ribbon dispenser, paper storage, label maker & rolling cart.', he: 'לארגן את חדר היצירה: לוח פגבורד, מארגן חוטים, מתקן סרטים, אחסון נייר, מכונת תוויות ועגלה ניידת.' },
    h1: { en: 'Dream Craft Room Organization Under €70', he: 'חדר יצירה מאורגן בפחות מ-₪280' },
    intro: { en: 'A well-organized craft space lets you focus on creating instead of hunting for supplies. Pegboard walls, dedicated organizers for thread/ribbon/paper, a label maker, and a mobile cart keep everything visible and accessible.', he: 'חדר יצירה מאורגן נותן לכם להתמקד ביצירה במקום בחיפוש חומרים. קירות פגבורד, מארגנים ייעודיים לחוטים/סרטים/נייר, מכונת תוויות ועגלה ניידת שומרים הכל גלוי ונגיש.' },
    tags: ['craft', 'organization', 'room-design'],
    items: [
      { keywords: ['pegboard wall organizer', 'tool pegboard panel'], caption: { en: 'Pegboard Wall Organizer', he: 'לוח פגבורד לקיר' } },
      { keywords: ['thread organizer rack', 'embroidery floss organizer'], caption: { en: 'Thread / Floss Organizer', he: 'מארגן חוטים / פלוס' } },
      { keywords: ['ribbon dispenser organizer', 'ribbon storage box'], caption: { en: 'Ribbon Dispenser Box', he: 'מתקן סרטים' } },
      { keywords: ['paper storage vertical', 'scrapbook paper organizer'], caption: { en: 'Vertical Paper Storage', he: 'אחסון נייר אנכי' } },
      { keywords: ['label maker portable', 'thermal label printer'], caption: { en: 'Portable Label Maker', he: 'מכונת תוויות ניידת' } },
      { keywords: ['rolling cart 3 tier', 'utility cart craft room'], caption: { en: '3-Tier Rolling Cart', he: 'עגלה ניידת 3 מדפים' } },
    ],
    totalEstimate: { en: 'Full craft room: ~€40-70', he: 'חדר מלא: ~₪160-280' },
  },

  'back-to-school': {
    slug: 'back-to-school',
    metaTitle: { en: 'Back to School Supplies Under €20', he: 'ציוד לבית הספר בפחות מ-₪80' },
    metaDesc: { en: 'Everything students need for the new school year: backpack, stationery, lunch box, calculator, and more.', he: 'כל מה שצריך לתלמידים: תיק, כלי כתיבה, קופסת אוכל, מחשבון ועוד.' },
    h1: { en: 'Back to School: Complete Student Kit Under €20', he: 'חזרה לבית הספר: ערכת תלמיד מלאה בפחות מ-₪80' },
    intro: { en: 'Get ready for the new school year without breaking the bank. From backpacks to calculators, here are the best deals on AliExpress.', he: 'התכוננו לשנת הלימודים החדשה בלי לשבור את הכיס.' },
    tags: ['school', 'kids', 'education'],
    items: [
      { keywords: ['school backpack bags', 'student backpack'], caption: { en: 'School Backpack', he: 'תיק גב לבית הספר' } },
      { keywords: ['mechanical pencil set', 'drafting pencils'], caption: { en: 'Mechanical Pencil Set', he: 'ערכת עפרונות מכניים' } },
      { keywords: ['bento lunch box', 'kids lunch container'], caption: { en: 'Bento Lunch Box', he: 'קופסת אוכל בנטו' } },
      { keywords: ['sports water bottle', 'insulated water flask'], caption: { en: 'Insulated Water Bottle', he: 'בקבוק מים מבודד' } },
      { keywords: ['scientific calculator', 'basic calculator'], caption: { en: 'Scientific Calculator', he: 'מחשבון מדעי' } },
      { keywords: ['pencil case large capacity', 'pen bag organizer'], caption: { en: 'Large Pencil Case', he: 'קלמר גדול' } },
    ],
    totalEstimate: { en: 'Complete kit: ~€15-25', he: 'ערכה מלאה: ~₪60-100' },
  },

  // ====== NEW: WIRELESS AUDIO SETUP ======
  'wireless-audio': {
    slug: 'wireless-audio',
    metaTitle: { en: 'Ultimate Wireless Audio Setup: Earbuds, Headphones & Speakers Under €60', he: 'מערך אודיו אלחוטי מושלם: אוזניות ורמקולים בפחות מ-₪240' },
    metaDesc: { en: 'Build the perfect wireless audio kit: TWS earbuds, over-ear headphones, bluetooth speaker, charging station, and carry case.', he: 'בנו ערכת אודיו אלחוטית מושלמת: אוזניות TWS, אוזניות קשת, רמקול בלוטוס, עמדת טעינה ונרתיק.' },
    h1: { en: 'Build the Ultimate Wireless Audio Setup Under €60', he: 'מערך אודיו אלחוטי אולטימטיבי בפחות מ-₪240' },
    intro: { en: 'From commuting earbuds to home speakers and over-ear headphones for deep focus — here is the complete wireless audio kit that covers every listening scenario. No wires, no compromises.', he: 'מאוזניות לנסיעה ועד רמקולים ביתיים ואוזניות קשת לריכוז עמוק — הנה ערכת האודיו האלחוטית השלמה שמכסה כל תרחיש האזנה. בלי חוטים, בלי פשרות.' },
    tags: ['tech', 'desk', 'audio'],
    items: [
      { keywords: ['TWS earbuds wireless', 'true wireless earbuds noise cancelling'], caption: { en: 'TWS Noise-Cancelling Earbuds', he: 'אוזניות TWS מבטלות רעשים' }, note: { en: 'Look for ANC and 30h+ battery life', he: 'חפשו ANC וסוללה 30+ שעות' } },
      { keywords: ['over ear bluetooth headphones', 'wireless headphones foldable'], caption: { en: 'Over-Ear Bluetooth Headphones', he: 'אוזניות קשת בלוטוס' }, note: { en: 'Get the foldable ones for travel', he: 'קחו מתקפלות לנסיעות' } },
      { keywords: ['portable bluetooth speaker', 'mini wireless speaker'], caption: { en: 'Portable Bluetooth Speaker', he: 'רמקול בלוטוס נייד' } },
      { keywords: ['wireless charging station', 'multi device charger stand'], caption: { en: 'Multi-Device Charging Station', he: 'עמדת טעינה למספר מכשירים' } },
      { keywords: ['earbuds carrying case', 'hard shell earbuds case'], caption: { en: 'Hard Shell Earbuds Case', he: 'נרתיק קשיח לאוזניות' } },
      { keywords: ['USB C to aux adapter', 'bluetooth transmitter receiver'], caption: { en: 'Bluetooth Transmitter / Adapter', he: 'מתאם בלוטוס / משדר' } },
    ],
    totalEstimate: { en: 'Full setup: ~€40-60', he: 'מערך מלא: ~₪160-240' },
    faq: [
      { q: { en: 'Which is better: TWS earbuds or over-ear headphones?', he: 'מה עדיף: אוזניות TWS או קשת?' }, a: { en: 'Both serve different needs. Earbuds are portable and great for commuting/gym. Over-ear headphones offer better soundstage and ANC for office/home. Best to have both for different scenarios.', he: 'שתיהן משרתות צרכים שונים. אוזניות TWS ניידות ומעולות לנסיעה/כושר. אוזניות קשת מציעות במת סאונד רחבה יותר ו-ANC טוב יותר למשרד/בית.' } },
    ],
  },

  // ====== NEW: PHONE ACCESSORIES KIT ======
  'phone-accessories': {
    slug: 'phone-accessories',
    metaTitle: { en: 'Complete Phone Accessories Kit: Protect, Charge & Mount Under €25', he: 'ערכת אביזרים מלאה לטלפון: הגנה, טעינה והרכבה בפחות מ-₪100' },
    metaDesc: { en: 'Everything your phone needs: protective case, tempered glass, car mount, power bank, fast charger cable, pop socket & wireless charger.', he: 'כל מה שהטלפון צריך: כיסוי מגן, זכוכית מחוסמת, אוחז לרכב, בנק כוח, כבל טעינה מהיר, פופ סוקט ומטען אלחוטי.' },
    h1: { en: 'Complete Phone Accessories Kit Under €25', he: 'ערכת אביזרים מלאה לטלפון בפחות מ-₪100' },
    intro: { en: 'Your phone is your most-used device — protect it, charge it faster, and mount it everywhere. This complete accessories kit covers every need from morning alarm to midnight scroll.', he: 'הטלפון הוא המכשיר הכי בשימוש שלכם — הגנו עליו, טענו אותו מהר יותר, והרכיבו אותו בכל מקום. ערכת האביזרים המלאה הזו מכסה כל צורך משעון מעורר בבוקר ועד גלילה בחצות.' },
    tags: ['tech', 'travel', 'gadgets'],
    items: [
      { keywords: ['phone case shockproof', 'silicone phone case'], caption: { en: 'Shockproof Phone Case', he: 'כיסוי מגן מפני נפילות' } },
      { keywords: ['tempered glass screen protector', 'privacy screen protector'], caption: { en: 'Tempered Glass Screen Protector', he: 'זכוכית מחוסמת למסך' }, note: { en: '2-pack recommended', he: 'חבילת 2 מומלצת' } },
      { keywords: ['car phone mount holder', 'car air vent phone holder'], caption: { en: 'Car Phone Mount', he: 'אוחז לטלפון לרכב' } },
      { keywords: ['power bank 10000mAh', 'portable charger fast charging'], caption: { en: '10000mAh Power Bank', he: 'בנק כוח 10000mAh' } },
      { keywords: ['USB C braided cable', 'fast charging cable 2m'], caption: { en: 'Braided USB-C Cable (2m)', he: 'כבל USB-C קלוע (2 מטר)' } },
      { keywords: ['pop socket grip', 'phone stand grip'], caption: { en: 'Pop Socket / Phone Grip', he: 'פופ סוקט / אחיזת טלפון' } },
    ],
    totalEstimate: { en: 'Full kit: ~€15-25', he: 'ערכה מלאה: ~₪60-100' },
    faq: [
      { q: { en: 'Do I need a screen protector if I have a case?', he: 'האם צריך מגן מסך אם יש כיסוי?' }, a: { en: 'Yes — a case protects the edges and back, while a tempered glass protector prevents screen cracks from direct impacts. The two work as a team and are both essential.', he: 'כן — כיסוי מגן על השוליים והגב, בעוד מגן מסך מזכוכית מחוסמת מונע סדקים במסך מפגיעות ישירות. השניים עובדים כצוות ושניהם חיוניים.' } },
      { q: { en: 'What power bank capacity do I need?', he: 'איזה קיבולת בנק כוח צריך?' }, a: { en: '10000mAh charges a modern phone 2-3 times. For travel or longer days, 20000mAh gives 4-5 charges. The sweet spot is 10000mAh for daily carry.', he: '10000mAh מטעין טלפון מודרני 2-3 פעמים. לנסיעות או ימים ארוכים יותר, 20000mAh נותן 4-5 טעינות. הנקודה המתוקה היא 10000mAh לנשיאה יומית.' } },
    ],
  },

  // ====== NEW: SUMMER ESSENTIALS SURVIVAL KIT ======
  'summer-essentials': {
    slug: 'summer-essentials',
    metaTitle: { en: 'Summer Essentials Survival Kit: Beat the Heat Under €25', he: 'ערכת הישרדות קיץ: לנצח את החום בפחות מ-₪100' },
    metaDesc: { en: 'Your complete summer survival kit: portable fan, cooling towel, insulated water bottle, UV umbrella, sunscreen, and beach bag.', he: 'ערכת ההישרדות השלמה לקיץ: מאוורר נייד, מגבת קירור, בקבוק מים מבודד, מטריית UV, קרם הגנה ותיק חוף.' },
    h1: { en: 'Summer Essentials: Complete Heat Survival Kit Under €25', he: 'קיץ הכרחי: ערכת הישרדות מחום מלאה בפחות מ-₪100' },
    intro: { en: 'Summer heat can be brutal — especially during heatwaves. This survival kit keeps you cool, hydrated, and protected. Perfect for commutes, outdoor events, beach days, and the daily walk in the sun.', he: 'חום הקיץ יכול להיות אכזרי — במיוחד בגלי חום. ערכת ההישרדות הזו שומרת עליכם קרירים, לחות ומוגנים. מושלם לנסיעות, אירועים בחוץ, ימי חוף וההליכה היומית בשמש.' },
    tags: ['summer', 'travel', 'outdoor', 'wellness'],
    items: [
      { keywords: ['portable electric fan', 'handheld fan rechargeable'], caption: { en: 'Rechargeable Portable Fan', he: 'מאוורר נייד נטען' }, note: { en: 'Get USB rechargeable, runs 4-8 hours', he: 'קחו נטען USB, עובד 4-8 שעות' } },
      { keywords: ['cooling towel', 'instant cooling towel'], caption: { en: 'Cooling Towel', he: 'מגבת קירור מיידית' } },
      { keywords: ['insulated water bottle', 'vacuum flask cold'], caption: { en: 'Insulated Water Bottle (1L)', he: 'בקבוק מים מבודד (1 ליטר)' } },
      { keywords: ['UV umbrella', 'sun umbrella folding'], caption: { en: 'UV Protection Umbrella', he: 'מטריית הגנה מקרינת UV' } },
      { keywords: ['beach bag large', 'straw beach tote'], caption: { en: 'Large Beach Tote Bag', he: 'תיק חוף גדול' } },
      { keywords: ['sunglasses UV400', 'polarized sunglasses men women'], caption: { en: 'UV400 Polarized Sunglasses', he: 'משקפי שמש UV400 מקטבים' } },
    ],
    totalEstimate: { en: 'Full survival kit: ~€18-30', he: 'ערכת הישרדות מלאה: ~₪72-120' },
    faq: [
      { q: { en: 'What cooling method works best without electricity?', he: 'איזו שיטת קירור עובדת הכי טוב בלי חשמל?' }, a: { en: 'A cooling towel soaked in water works instantly — evaporation drops the temperature by 15-20°F. Pair with an insulated bottle for ice-cold water all day.', he: 'מגבת קירור טבולה במים עובדת מיידית — האידוי מוריד את הטמפרטורה ב-8-10 מעלות. שלבו עם בקבוק מבודד למים קרים כקרח כל היום.' } },
    ],
  },
  'budget-gaming-setup': {
    slug: 'budget-gaming-setup',
    metaTitle: { en: 'Budget Gaming Setup Under $100 — Mouse, Keyboard, Headset & More', he: 'עמדת גיימינג תקציבית בפחות מ-₪400' },
    metaDesc: { en: 'Everything you need for a complete gaming setup: mouse, keyboard, headset, mousepad, mic. All under $100 from AliExpress.', he: 'כל מה שצריך לעמדת גיימינג שלמה: עכבר, מקלדת, אוזניות, משטח עכבר, מיקרופון. הכל בפחות מ-₪400 מאליאקספרס.' },
    h1: { en: 'Build a Complete Gaming Setup Under $100', he: 'עמדת גיימינג מלאה בפחות מ-₪400' },
    intro: { en: 'You dont need to spend thousands on a gaming setup. Here is every piece you need for a complete budget-friendly gaming station, all sourced from AliExpress for under $100.', he: 'אתם לא צריכים להוציא אלפי שקלים על עמדת גיימינג. הנה כל חלק שאתם צריכים לעמדת גיימינג תקציבית מלאה, הכל מאליאקספרס בפחות מ-₪400.' },
    items: [
      { keywords: ['gaming mouse rgb wired 6400 dpi'], caption: { en: 'RGB Gaming Mouse', he: 'עכבר גיימינג RGB' } },
      { keywords: ['mechanical keyboard 60% rgb wired'], caption: { en: '60% Mechanical Keyboard', he: 'מקלדת מכנית 60%' } },
      { keywords: ['gaming headset 7.1 surround sound'], caption: { en: '7.1 Surround Headset', he: 'אוזניות גיימינג 7.1' } },
      { keywords: ['gaming mouse pad xxl extended'], caption: { en: 'XXL Mouse Pad', he: 'משטח עכבר XXL' } },
      { keywords: ['condenser microphone usb podcast'], caption: { en: 'USB Condenser Mic', he: 'מיקרופון קונדנסר USB' } },
    ],
    totalEstimate: { en: '~$25-75', he: '~₪100-280' },
    faq: [
      { q: { en: 'Do I need a gaming mouse?', he: 'האם אני צריך עכבר גיימינג?' }, a: { en: 'A gaming mouse has higher DPI (precision) and extra programmable buttons. For FPS and MOBA games, it makes a real difference.', he: 'לעכבר גיימינג יש DPI גבוה יותר (דיוק) וכפתורים ניתנים לתכנות. למשחקי FPS ו-MOBA, זה עושה הבדל משמעותי.' } },
    ],
    tags: ['gaming', 'setup', 'desk'],
  },
  'minimalist-desk': {
    slug: 'minimalist-desk',
    metaTitle: { en: 'Minimalist Desk Setup: Clean & Productive Workspace Under €50', he: 'שולחן עבודה מינימליסטי: מרחב עבודה נקי ופרודוקטיבי בפחות מ-₪200' },
    metaDesc: { en: 'Build a distraction-free minimalist desk: monitor arm, desk mat, cable tray, wooden pen holder, desk lamp, and plant.', he: 'בנו שולחן עבודה מינימליסטי נטול הסחות: זרוע מסך, משטח שולחן, תעלת כבלים, עפרון עץ, מנורת שולחן ועציץ.' },
    h1: { en: 'Design a Minimalist Desk Setup Under €50', he: 'שולחן עבודה מינימליסטי בפחות מ-₪200' },
    intro: { en: 'A clean desk is a clear mind. Minimalist desk design reduces visual clutter, improves focus, and makes you actually want to sit down and work. Here\'s everything you need for a clean, functional workspace — with nothing unnecessary.', he: 'שולחן נקי = ראש נקי. עיצוב מינימליסטי מפחית עומס ויזואלי, משפר ריכוז וגורם לכם ממש לרצות לשבת ולעבוד. הנה כל מה שצריך למרחב עבודה נקי ופונקציונלי — בלי שום דבר מיותר.' },
    tags: ['room-design', 'desk', 'home-office', 'minimalist'],
    items: [
      { keywords: ['monitor arm gas spring', 'single monitor mount desk'], caption: { en: 'Monitor Arm (Gas Spring)', he: 'זרוע מסך (גז)' }, note: { en: 'Frees up desk space instantly', he: 'משחרר מקום על השולחן מיידית' } },
      { keywords: ['large desk mat', 'leather desk pad'], caption: { en: 'Large Desk Mat / Pad', he: 'משטח שולחן גדול' }, note: { en: 'Fabric or leather, choose neutral colors', he: 'בד או עור, בחרו צבעים ניטרליים' } },
      { keywords: ['cable management tray', 'under desk cable organizer'], caption: { en: 'Under-Desk Cable Tray', he: 'תעלת כבלים מתחת לשולחן' } },
      { keywords: ['wooden pen holder', 'desk organizer bamboo'], caption: { en: 'Wooden Desk Organizer', he: 'מארגן שולחן מעץ' } },
      { keywords: ['LED desk lamp USB', 'minimalist desk lamp'], caption: { en: 'Minimalist LED Desk Lamp', he: 'מנורת שולחן לד מינימליסטית' } },
      { keywords: ['small desk plant', 'succulent pot ceramic'], caption: { en: 'Small Desk Plant', he: 'עציץ קטן לשולחן' } },
    ],
    totalEstimate: { en: 'Full desk setup: ~€30-50', he: 'שולחן שלם: ~₪120-200' },
    faq: [
      { q: { en: 'What colors work for a minimalist desk?', he: 'איזה צבעים מתאימים לשולחן מינימליסטי?' }, a: { en: 'White, black, warm wood tones, and a single accent color (green from a plant). Keep everything monochrome — the desk mat, organizer, lamp, and accessories should match.', he: 'לבן, שחור, גווני עץ חמים, וצבע מבטא אחד (ירוק מהצמח). שמרו הכל מונוכרומטי.' } },
    ],
  },
  'pet-corner': {
    slug: 'pet-corner',
    metaTitle: { en: 'Pet Corner Setup: Complete Dog & Cat Station Under €40', he: 'פינת חיית מחמד: עמדה שלמה לכלב או חתול בפחות מ-₪160' },
    metaDesc: { en: 'Everything for a dedicated pet corner: bed, feeding station, toy storage, grooming station, water fountain, and mat.', he: 'כל מה שצריך לפינת חיית מחמד: מיטה, עמדת האכלה, אחסון צעצועים, עמדת טיפוח, מזרקת מים ומשטח.' },
    h1: { en: 'Build the Perfect Pet Corner Under €40', he: 'פינת חיית מחמד מושלמת בפחות מ-₪160' },
    intro: { en: 'A dedicated pet corner keeps your furry friend\'s things organized and your home tidy. No more stepping on toys or searching for the leash. Here\'s the complete setup — from feeding to grooming to play — all in one spot.', he: 'פינת חיית מחמד ייעודית שומרת על החפצים של החבר הפרוותי מסודרים ועל הבית נקי. בלי לדרוך על צעצועים או לחפש רצועה. הנה הערכה השלמה — מהאכלה לטיפוח למשחק — הכל במקום אחד.' },
    tags: ['pet', 'organization', 'room-design'],
    items: [
      { keywords: ['pet bed orthopedic', 'dog bed washable'], caption: { en: 'Orthopedic Pet Bed', he: 'מיטת חיות מחמד אורטופדית' }, note: { en: 'Washable cover is essential', he: 'כיסוי ניתן לכביסה זה חיוני' } },
      { keywords: ['pet water fountain', 'stainless steel pet fountain'], caption: { en: 'Pet Water Fountain', he: 'מזרקת מים לחיות מחמד' } },
      { keywords: ['raised pet bowls', 'elevated dog feeder'], caption: { en: 'Elevated Feeding Station', he: 'עמדת האכלה מוגבהת' } },
      { keywords: ['pet toy storage bin', 'pet toy basket'], caption: { en: 'Toy Storage Bin', he: 'סל אחסון צעצועים' } },
      { keywords: ['pet grooming brush kit', 'pet grooming glove'], caption: { en: 'Grooming Tool Kit', he: 'ערכת כלי טיפוח' } },
      { keywords: ['pet feeding mat', 'waterproof pet mat'], caption: { en: 'Waterproof Feeding Mat', he: 'משטח האכלה עמיד מים' } },
    ],
    totalEstimate: { en: 'Complete pet corner: ~€25-40', he: 'פינה שלמה: ~₪100-160' },
    faq: [
      { q: { en: 'Where should I put the pet corner?', he: 'איפה למקם את פינת חיית המחמד?' }, a: { en: 'A quiet corner of the kitchen or living room — away from heavy foot traffic and loud appliances. Make sure it\'s not in direct sunlight or drafty areas. Cats prefer elevated spots; dogs prefer ground level.', he: 'פינה שקטה במטבח או בסלון — הרחק מתנועה כבדה ומכשירים רועשים. וודאו שזה לא בשמש ישירה או בטיוטות.' } },
    ],
  },
};

export function getMoodBoard(slug: string): MoodBoard | undefined {
  return MOOD_BOARDS[slug];
}

export function getMoodBoardsByTag(tag: string): MoodBoard[] {
  return Object.values(MOOD_BOARDS).filter(b => b.tags.includes(tag));
}

export function getAllMoodboardSlugs(): string[] {
  return Object.keys(MOOD_BOARDS);
}
