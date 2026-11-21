export interface BuyCopy {
  cta: string;
  positive: string;
  orders: string;
  protection: string;
  note: string;
  now: string;
}

const BUY_COPY: Record<string, BuyCopy> = {
  en: { cta: 'View deal on AliExpress', positive: '% positive', orders: '+ orders', protection: 'AliExpress buyer protection', note: 'We may earn a commission. Your price stays the same.', now: 'on AliExpress now' },
  he: { cta: 'לצפייה בדיל באליאקספרס', positive: '% ביקורות חיוביות', orders: '+ הזמנות', protection: 'הגנת הקונה של אליאקספרס', note: 'ייתכן שנקבל עמלה. המחיר שלכם לא משתנה.', now: 'באליאקספרס עכשיו' },
  fr: { cta: "Voir l'offre sur AliExpress", positive: ' % d’avis positifs', orders: '+ commandes', protection: 'Protection acheteur AliExpress', note: 'Nous pouvons toucher une commission. Votre prix ne change pas.', now: 'sur AliExpress' },
  de: { cta: 'Angebot auf AliExpress ansehen', positive: ' % positive Bewertungen', orders: '+ Bestellungen', protection: 'AliExpress-Käuferschutz', note: 'Wir erhalten eventuell eine Provision. Dein Preis bleibt gleich.', now: 'auf AliExpress' },
  es: { cta: 'Ver oferta en AliExpress', positive: '% de valoraciones positivas', orders: '+ pedidos', protection: 'Protección al comprador de AliExpress', note: 'Podemos recibir una comisión. Tu precio no cambia.', now: 'en AliExpress' },
  it: { cta: "Vedi l'offerta su AliExpress", positive: '% di feedback positivi', orders: '+ ordini', protection: 'Protezione acquirenti AliExpress', note: 'Potremmo ricevere una commissione. Il tuo prezzo non cambia.', now: 'su AliExpress' },
  ru: { cta: 'Открыть предложение на AliExpress', positive: '% положительных отзывов', orders: '+ заказов', protection: 'Защита покупателя AliExpress', note: 'Мы можем получить комиссию. Цена для вас не меняется.', now: 'на AliExpress' },
};

export function buyCopy(lang: string | undefined): BuyCopy {
  return BUY_COPY[lang || 'en'] || BUY_COPY.en;
}
