import { describe, expect, it } from "vitest";
import { calculateFinalPrice } from "@/core/discount/calculator";
import type { Campaign, CartItem } from "@/core/discount/types";

describe("calculateFinalPrice (calculator)", () => {
  const baseItems: CartItem[] = [
    {
      id: "1",
      name: "T-Shirt",
      category: "Clothing",
      unitPrice: 350,
      quantity: 2,
    },
    {
      id: "2",
      name: "Hat",
      category: "Accessories",
      unitPrice: 250,
      quantity: 1,
    },
    {
      id: "3",
      name: "Headphones",
      category: "Electronics",
      unitPrice: 1200,
      quantity: 1,
    },
  ];

  it("no campaigns -> finalTotal equals subtotal", () => {
    const result = calculateFinalPrice(baseItems, []);
    expect(result.breakdown.subtotal).toBe(2150);
    expect(result.breakdown.finalTotal).toBe(2150);
  });

  it("coupon fixed amount", () => {
    const campaigns: Campaign[] = [
      { type: "coupon", method: "fixed", amount: 50 },
    ];
    const result = calculateFinalPrice(baseItems, campaigns);
    expect(result.breakdown.couponDiscount).toBe(50);
    expect(result.breakdown.finalTotal).toBe(2100);
  });

  it("coupon percentage", () => {
    const campaigns: Campaign[] = [
      { type: "coupon", method: "percentage", percentage: 10 },
    ];
    const result = calculateFinalPrice(baseItems, campaigns);
    expect(result.breakdown.couponDiscount).toBe(215);
    expect(result.breakdown.afterCoupon).toBe(1935);
  });

  it("on_top category percentage applies only to that category subtotal", () => {
    const campaigns: Campaign[] = [
      {
        type: "on_top",
        method: "category_percentage",
        category: "Clothing",
        percentage: 15,
      },
    ];
    const result = calculateFinalPrice(baseItems, campaigns);
    expect(result.breakdown.onTopDiscount).toBe(105);
    expect(result.breakdown.finalTotal).toBe(2045);
  });

  it("points discount is capped at 20% of totalBefore onTop stage", () => {
    const campaigns: Campaign[] = [
      { type: "on_top", method: "points", points: 9999 },
    ];
    const result = calculateFinalPrice(baseItems, campaigns);

    expect(result.breakdown.onTopDiscount).toBe(430);
    expect(result.warnings?.[0]).toMatch(/capped at 20%/i);
    expect(result.breakdown.finalTotal).toBe(1720);
  });

  it("seasonal everyX discountY uses floor(total/X)*Y", () => {
    const campaigns: Campaign[] = [
      { type: "seasonal", everyX: 300, discountY: 40 },
    ];
    const result = calculateFinalPrice(baseItems, campaigns);

    expect(result.breakdown.seasonalDiscount).toBe(280);
    expect(result.breakdown.finalTotal).toBe(1870);
  });

  it("order: Coupon -> On Top -> Seasonal", () => {
    const campaigns: Campaign[] = [
      { type: "coupon", method: "percentage", percentage: 10 },
      { type: "on_top", method: "points", points: 500 },
      { type: "seasonal", everyX: 300, discountY: 40 },
    ];
    const result = calculateFinalPrice(baseItems, campaigns);

    expect(result.breakdown.afterCoupon).toBe(1935);
    expect(result.breakdown.onTopDiscount).toBe(387);
    expect(result.breakdown.afterOnTop).toBe(1548);
    expect(result.breakdown.seasonalDiscount).toBe(200);
    expect(result.breakdown.finalTotal).toBe(1348);
  });

  // -------------------- edge cases (resilience) --------------------

  it("coupon fixed does not go below 0", () => {
    const items: CartItem[] = [
      { name: "Hat", category: "Accessories", unitPrice: 100, quantity: 1 },
    ];
    const campaigns: Campaign[] = [
      { type: "coupon", method: "fixed", amount: 999 },
    ];

    const res = calculateFinalPrice(items, campaigns);
    expect(res.breakdown.subtotal).toBe(100);
    expect(res.breakdown.finalTotal).toBe(0);
  });

  it("seasonal discount does not exceed total", () => {
    const items: CartItem[] = [
      { name: "Hat", category: "Accessories", unitPrice: 50, quantity: 1 },
    ];
    const campaigns: Campaign[] = [
      { type: "seasonal", everyX: 1, discountY: 999 },
    ];

    const res = calculateFinalPrice(items, campaigns);
    expect(res.breakdown.subtotal).toBe(50);
    expect(res.breakdown.finalTotal).toBe(0);
  });

  it("on_top category % gives 0 if no item in that category", () => {
    const items: CartItem[] = [
      { name: "Hat", category: "Accessories", unitPrice: 250, quantity: 1 },
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
    expect(res.breakdown.onTopDiscount).toBe(0);
    expect(res.breakdown.finalTotal).toBe(250);
  });
});
