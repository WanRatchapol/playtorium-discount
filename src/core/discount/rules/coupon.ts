import { clampMin0 } from "../utils";
import type { CouponCampaign } from "../types";

export interface CouponApplyResult {
  discount: number;
  totalAfter: number;
}

export function applyCoupon(
  totalBefore: number,
  coupon?: CouponCampaign
): CouponApplyResult {
  const base = clampMin0(totalBefore);
  if (!coupon) return { discount: 0, totalAfter: base };

  let discount = 0;

  if (coupon.method === "fixed") {
    discount = Math.min(coupon.amount, base);
  } else {
    discount = base * (coupon.percentage / 100);
    discount = Math.min(discount, base);
  }

  const totalAfter = clampMin0(base - discount);
  return { discount, totalAfter };
}
