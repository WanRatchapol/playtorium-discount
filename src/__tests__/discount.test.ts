import { describe, expect, it } from "vitest";
import { calculateFinalPrice } from "@/core/discount/calculator";
import type { Campaign, CartItem } from "@/core/discount/types";

describe("Discount Engine (validation + example cases)", () => {
  it("rejects multiple coupon campaigns", () => {
    const items: CartItem[] = [
      { name: "Hat", category: "Accessories", unitPrice: 250, quantity: 1 },
    ];
    const campaigns: Campaign[] = [
      { type: "coupon", method: "fixed", amount: 10 },
      { type: "coupon", method: "percentage", percentage: 10 },
    ];

    expect(() => calculateFinalPrice(items, campaigns)).toThrow(
      /Only one coupon/i
    );
  });

  it("rejects multiple on_top campaigns", () => {
    const items: CartItem[] = [
      { name: "Hat", category: "Accessories", unitPrice: 250, quantity: 1 },
    ];
    const campaigns: Campaign[] = [
      { type: "on_top", method: "points", points: 10 },
      { type: "on_top", method: "points", points: 5 },
    ];

    expect(() => calculateFinalPrice(items, campaigns)).toThrow(
      /Only one on_top/i
    );
  });

  it("rejects multiple seasonal campaigns", () => {
    const items: CartItem[] = [
      { name: "Hat", category: "Accessories", unitPrice: 250, quantity: 1 },
    ];
    const campaigns: Campaign[] = [
      { type: "seasonal", everyX: 300, discountY: 40 },
      { type: "seasonal", everyX: 300, discountY: 40 },
    ];

    expect(() => calculateFinalPrice(items, campaigns)).toThrow(
      /Only one seasonal/i
    );
  });

  it("rejects invalid item quantity", () => {
    const badItems: CartItem[] = [
      { name: "Bad", category: "Clothing", unitPrice: 100, quantity: 0 },
    ];

    expect(() => calculateFinalPrice(badItems, [])).toThrow(/quantity/i);
  });

  it("example-like: on_top category percentage produces decimal discount (2382.5)", () => {
    const items: CartItem[] = [
      { name: "T-Shirt", category: "Clothing", unitPrice: 350, quantity: 1 },
      { name: "Hoodie", category: "Clothing", unitPrice: 700, quantity: 1 },
      { name: "Watch", category: "Accessories", unitPrice: 850, quantity: 1 },
      { name: "Bag", category: "Accessories", unitPrice: 640, quantity: 1 },
    ];
    const campaigns: Campaign[] = [
      {
        type: "on_top",
        method: "category_percentage",
        category: "Clothing",
        percentage: 15,
      },
    ];

    const res = calculateFinalPrice(items, campaigns);
    expect(res.breakdown.subtotal).toBe(2540);
    expect(res.breakdown.onTopDiscount).toBe(157.5);
    expect(res.breakdown.finalTotal).toBe(2382.5);
  });
});
