import { clampMin0 } from "../utils";
import type { CartItem, OnTopCampaign } from "../types";

export interface OnTopApplyResult {
  discount: number;
  totalAfter: number;
  warning?: string;
}

export function calcSubtotal(items: CartItem[]): number {
  return items.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
}

export function calcCategorySubtotal(
  items: CartItem[],
  category: CartItem["category"]
): number {
  return items
    .filter((it) => it.category === category)
    .reduce((sum, it) => sum + it.unitPrice * it.quantity, 0);
}

export function applyOnTop(
  items: CartItem[],
  totalBefore: number,
  onTop?: OnTopCampaign
): OnTopApplyResult {
  const base = clampMin0(totalBefore);
  if (!onTop) return { discount: 0, totalAfter: base };

  let discount = 0;
  let warning: string | undefined;

  if (onTop.method === "category_percentage") {
    const catSubtotal = calcCategorySubtotal(items, onTop.category);
    discount = catSubtotal * (onTop.percentage / 100);
    discount = Math.min(discount, base);
  } else {
    const maxDiscount = base * 0.2;
    discount = Math.min(onTop.points, maxDiscount, base);
    if (onTop.points > maxDiscount) {
      warning = `Points discount capped at 20% of total (${maxDiscount.toFixed(
        2
      )} THB).`;
    }
  }

  const totalAfter = clampMin0(base - discount);
  return { discount, totalAfter, warning };
}
