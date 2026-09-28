import MarketplaceIwishbagHowTo from '../components/MarketplaceIwishbagHowTo';

/**
 * /how-to-costco-israel — lean Costco→IL how-to with iWishBag 「17% body still wrong」
 * foil (Apr-29 body bug: body/FAQ 「customs duty plus 17% VAT」 thrice vs duties table
 * Standard VAT/GST 18%; same MarketplaceIwishbagHowTo pattern as Myntra #51).
 * Presentation only; estimator math unchanged. Cite gov.il 18% + Skills IL.
 * hermes-filed for moat merge (2026-09-28 ~16:40).
 */
export default function HowToCostcoIsraelPage() {
  return <MarketplaceIwishbagHowTo marketplace="costco" />;
}
