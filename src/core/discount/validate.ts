import { isFiniteNumber } from "./utils";
import type { Campaign, CartItem } from "./types";

export type ValidationResult = { ok: true } | { ok: false; error: string };

//Validation Input
export function validateInput(
  items: CartItem[],
  campaigns: Campaign[]
): ValidationResult {
  //Check Type
  if (!Array.isArray(items))
    return { ok: false, error: "Items must be an array." };
  if (!Array.isArray(campaigns))
    return { ok: false, error: "Campaigns must be an array." };

  // Validate items
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (!it || typeof it !== "object")
      return { ok: false, error: `Item #${i + 1} is invalid.` };
    if (typeof it.name !== "string" || it.name.trim().length === 0)
      return { ok: false, error: `Item #${i + 1} name is required.` };
    if (!["Clothing", "Accessories", "Electronics"].includes(it.category))
      return { ok: false, error: `Item #${i + 1} category is invalid.` };
    if (!isFiniteNumber(it.unitPrice) || it.unitPrice < 0)
      return {
        ok: false,
        error: `Item #${i + 1} unitPrice must be a number >= 0.`,
      };
    if (
      !isFiniteNumber(it.quantity) ||
      !Number.isInteger(it.quantity) ||
      it.quantity < 1
    )
      return {
        ok: false,
        error: `Item #${i + 1} quantity must be an integer >= 1.`,
      };
  }

  // Enforce only one per category
  const counts = { coupon: 0, on_top: 0, seasonal: 0 };

  for (const c of campaigns) {
    if (!c || typeof c !== "object" || !("type" in c)) {
      return { ok: false, error: "Campaign is invalid." };
    }
    if (c.type === "coupon") {
      counts.coupon++;
      if (c.method === "fixed") {
        if (!isFiniteNumber(c.amount) || c.amount < 0)
          return { ok: false, error: "Coupon fixed amount must be >= 0." };
      } else if (c.method === "percentage") {
        if (
          !isFiniteNumber(c.percentage) ||
          c.percentage < 0 ||
          c.percentage > 100
        )
          return {
            ok: false,
            error: "Coupon percentage must be between 0 and 100.",
          };
      } else {
        return { ok: false, error: "Coupon method is invalid." };
      }
    } else if (c.type === "on_top") {
      counts.on_top++;
      if (c.method === "category_percentage") {
        if (!["Clothing", "Accessories", "Electronics"].includes(c.category))
          return { ok: false, error: "On Top category is invalid." };
        if (
          !isFiniteNumber(c.percentage) ||
          c.percentage < 0 ||
          c.percentage > 100
        )
          return {
            ok: false,
            error: "On Top category percentage must be between 0 and 100.",
          };
      } else if (c.method === "points") {
        if (!isFiniteNumber(c.points) || c.points < 0)
          return { ok: false, error: "On Top points must be a number >= 0." };
      } else {
        return { ok: false, error: "On Top method is invalid." };
      }
    } else if (c.type === "seasonal") {
      counts.seasonal++;
      if (!isFiniteNumber(c.everyX) || c.everyX <= 0)
        return { ok: false, error: "Seasonal everyX must be a number > 0." };
      if (!isFiniteNumber(c.discountY) || c.discountY < 0)
        return {
          ok: false,
          error: "Seasonal discountY must be a number >= 0.",
        };
    } else {
      return { ok: false, error: "Campaign type is invalid." };
    }
  }

  if (counts.coupon > 1)
    return { ok: false, error: "Only one coupon campaign is allowed." };
  if (counts.on_top > 1)
    return { ok: false, error: "Only one on_top campaign is allowed." };
  if (counts.seasonal > 1)
    return { ok: false, error: "Only one seasonal campaign is allowed." };

  return { ok: true };
}
