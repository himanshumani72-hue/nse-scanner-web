/**
 * Pricing & promo config — single source of truth.
 *
 * Toggle the launch offer on/off by changing OFFER_ENABLED below.
 * Both the landing page and the billing page read from here, so prices
 * stay in sync.
 */

export const REGULAR_PRICE_INR = 99;

export const OFFER = {
  enabled:           true,                    // turn off when promo ends
  price_inr:         49,                      // discounted price
  duration_months:   3,                       // promo applies to first N months only
  label:             "Launch Offer · 50% OFF",
  tagline:           "First 3 months only · then ₹99/mo",
};

/**
 * Given how many successful payments the user has already made,
 * return what they should pay NEXT.
 *
 *   - 0 payments so far → first payment of the promo → ₹49
 *   - 1 payment so far  → second promo payment       → ₹49
 *   - 2 payments so far → third (last) promo payment → ₹49
 *   - 3 payments so far → promo exhausted → regular  → ₹99
 *
 * If OFFER.enabled is false, everyone always pays ₹99.
 */
export function priceForUser(paidCount: number): {
  amount:        number;
  isPromo:       boolean;
  promoLeft:     number;   // how many more discounted payments user can claim
  originalPrice: number;
} {
  const original = REGULAR_PRICE_INR;
  if (!OFFER.enabled) {
    return { amount: original, isPromo: false, promoLeft: 0, originalPrice: original };
  }
  if (paidCount < OFFER.duration_months) {
    return {
      amount:        OFFER.price_inr,
      isPromo:       true,
      promoLeft:     OFFER.duration_months - paidCount,
      originalPrice: original,
    };
  }
  return { amount: original, isPromo: false, promoLeft: 0, originalPrice: original };
}
