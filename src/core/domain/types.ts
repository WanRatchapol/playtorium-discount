import type { Campaign, Category } from "@/core/discount/types";

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  active: boolean;
}

export type DiscountOfferType = "coupon" | "on_top" | "seasonal";

export interface DiscountOffer {
  id: string;
  label: string;
  offerType: DiscountOfferType;
  campaign: Campaign;
  active: boolean;
}
