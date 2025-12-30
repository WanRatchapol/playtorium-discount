import type { Product, DiscountOffer } from "./types";

export const SEED_PRODUCTS: Product[] = [
  { id: "p1", name: "T-Shirt", category: "Clothing", price: 350, active: true },
  { id: "p2", name: "Hoodie", category: "Clothing", price: 700, active: true },
  { id: "p3", name: "Hat", category: "Accessories", price: 250, active: true },
  {
    id: "p4",
    name: "Watch",
    category: "Accessories",
    price: 850,
    active: true,
  },
  {
    id: "p5",
    name: "Headphones",
    category: "Electronics",
    price: 1200,
    active: true,
  },
];

export const SEED_OFFERS: DiscountOffer[] = [
  // Coupon offers
  {
    id: "c1",
    label: "฿50 OFF (Coupon)",
    offerType: "coupon",
    campaign: { type: "coupon", method: "fixed", amount: 50 },
    active: true,
  },
  {
    id: "c2",
    label: "10% OFF (Coupon)",
    offerType: "coupon",
    campaign: { type: "coupon", method: "percentage", percentage: 10 },
    active: true,
  },

  // On top offers
  {
    id: "o1",
    label: "15% OFF Clothing (On Top)",
    offerType: "on_top",
    campaign: {
      type: "on_top",
      method: "category_percentage",
      category: "Clothing",
      percentage: 15,
    },
    active: true,
  },
  {
    id: "o2",
    label: "Use 100 points (On Top, cap 20%)",
    offerType: "on_top",
    campaign: { type: "on_top", method: "points", points: 100 },
    active: true,
  },

  // Seasonal offers
  {
    id: "s1",
    label: "Seasonal: Every ฿300 → ฿40 OFF",
    offerType: "seasonal",
    campaign: { type: "seasonal", everyX: 300, discountY: 40 },
    active: true,
  },
];
