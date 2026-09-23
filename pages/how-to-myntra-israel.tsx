import MarketplaceIwishbagHowTo from '../components/MarketplaceIwishbagHowTo';

/**
 * /how-to-myntra-israel — lean Myntra→IL how-to with iWishBag 「17% body still wrong」
 * foil (Apr-29 body bug: body/FAQ 「17% VAT」 vs duties table Standard VAT/GST 18%;
 * same pattern as Amazon US #48 / India #49 / Japan #50). Presentation only;
 * estimator math unchanged. Skills IL customs v1.4.0 + shekel v2.2.0 · Sep 23 stamp.
 * Honest 18% + BoI+0.5% + $75 ptur. Keep #19–#50.
 */
export default function HowToMyntraIsraelPage() {
  return <MarketplaceIwishbagHowTo marketplace="myntra" />;
}
