import { clampMin0 } from "../utils";
import type { SeasonalCampaign } from "../types";

export interface SeasonalApplyResult {
  discount: number;
  totalAfter: number;
}

export function applySeasonal(
  totalBefore: number,
  seasonal?: SeasonalCampaign
): SeasonalApplyResult {
  const base = clampMin0(totalBefore);
  if (!seasonal) return { discount: 0, totalAfter: base };

  const times = Math.floor(base / seasonal.everyX);
  let discount = times * seasonal.discountY;

  discount = Math.min(discount, base);
  const totalAfter = clampMin0(base - discount);

  return { discount, totalAfter };
}
