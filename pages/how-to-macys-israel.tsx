import MarketplaceIwishbagHowTo from '../components/MarketplaceIwishbagHowTo';

/**
 * /how-to-macys-israel — lean Macy's→IL how-to with iWishBag 「17% body still wrong」
 * foil (Apr-29 body bug: body/FAQ 「customs duty plus 17% VAT」 thrice vs duties table
 * Standard VAT/GST 18%; same MarketplaceIwishbagHowTo pattern as Costco #52).
 * Presentation only; estimator math unchanged. Cite gov.il 18% + Skills IL.
 * hermes-filed for moat merge (2026-09-28 ~19:20).
 */
export default function HowToMacysIsraelPage() {
  return <MarketplaceIwishbagHowTo marketplace="macys" />;
}
