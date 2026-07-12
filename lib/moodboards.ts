// Niche mood boards — ultra-specific "build this look/setup" pages
// Each is a complete outfit, kit, or setup with items that go together

export interface MoodBoardItem {
  keywords: string[];     // what to search for this item
  caption: Record<string, string>;  // what this item is (e.g. "Tricorn Hat")
  note?: Record<string, string>;    // buying tip
}

export interface MoodBoard {
  slug: string;
  metaTitle: Record<string, string>;
  metaDesc: Record<string, string>;
  h1: Record<string, string>;
  intro: Record<string, string>;
  // The items that together build the look
  items: MoodBoardItem[];
  totalEstimate?: Record<string, string>; // e.g. "~€25 total"
  faq?: { q: Record<string, string>; a: Record<string, string> }[];
  tags: string[];  // for grouping: 'purim', 'costume', 'home', 'desk', 'kitchen'
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
};

export function getMoodBoard(slug: string): MoodBoard | undefined {
  return MOOD_BOARDS[slug];
}

export function getMoodBoardsByTag(tag: string): MoodBoard[] {
  return Object.values(MOOD_BOARDS).filter(b => b.tags.includes(tag));
}