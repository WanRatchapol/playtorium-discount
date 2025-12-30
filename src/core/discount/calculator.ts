import { round2 } from "./utils";
import { validateInput } from "./validate";
import { applyCoupon } from "./rules/coupon";
import { applySeasonal } from "./rules/seasonal";
import { applyOnTop, calcSubtotal } from "./rules/onTop";
import type {
  AppliedCampaignInfo,
  Campaign,
  CalculateResult,
  CartItem,
  CouponCampaign,
  OnTopCampaign,
  SeasonalCampaign,
} from "./types";

//Claculate Final Price
export function calculateFinalPrice(
  items: CartItem[],
  campaigns: Campaign[]
): CalculateResult {
  const v = validateInput(items, campaigns);
  if (!v.ok) {
    throw new Error(v.error);
  }

  const coupon = campaigns.find(
    (c): c is CouponCampaign => c.type === "coupon"
  );
  const onTop = campaigns.find((c): c is OnTopCampaign => c.type === "on_top");
  const seasonal = campaigns.find(
    (c): c is SeasonalCampaign => c.type === "seasonal"
  );

  const warnings: string[] = [];

  //Subtotal
  const subtotal = calcSubtotal(items);

  //Coupon
  const couponRes = applyCoupon(subtotal, coupon);

  //On top
  const onTopRes = applyOnTop(items, couponRes.totalAfter, onTop);
  if (onTopRes.warning) warnings.push(onTopRes.warning);

  //Seasonal
  const seasonalRes = applySeasonal(onTopRes.totalAfter, seasonal);

  const breakdown = {
    subtotal: round2(subtotal),

    couponDiscount: round2(couponRes.discount),
    afterCoupon: round2(couponRes.totalAfter),

    onTopDiscount: round2(onTopRes.discount),
    afterOnTop: round2(onTopRes.totalAfter),

    seasonalDiscount: round2(seasonalRes.discount),
    afterSeasonal: round2(seasonalRes.totalAfter),

    finalTotal: round2(seasonalRes.totalAfter),
  };

  const applied: AppliedCampaignInfo = {
    coupon,
    onTop,
    seasonal,
  };

  return warnings.length > 0
    ? { breakdown, applied, warnings }
    : { breakdown, applied };
}
