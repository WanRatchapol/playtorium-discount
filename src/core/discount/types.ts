//---------------------- Cart types ----------------------
export type Category = "Clothing" | "Accessories" | "Electronics";

export interface CartItem {
  id?: string;
  name: string;
  category: Category;
  unitPrice: number;
  quantity: number;
}

//---------------------- Campaign types ----------------------
// Coupon campaigns
export type CouponCampaign =
  | { type: "coupon"; method: "fixed"; amount: number }
  | { type: "coupon"; method: "percentage"; percentage: number };

// On Top campaigns
export type OnTopCampaign =
  | {
      type: "on_top";
      method: "category_percentage";
      category: Category;
      percentage: number;
    }
  | {
      type: "on_top";
      method: "points";
      points: number;
    };

// Seasonal campaigns
export type SeasonalCampaign = {
  type: "seasonal";
  everyX: number;
  discountY: number;
};

export type Campaign = CouponCampaign | OnTopCampaign | SeasonalCampaign;

//---------------------- Output ----------------------
export interface DiscountBreakdown {
  subtotal: number;

  couponDiscount: number;
  afterCoupon: number;

  onTopDiscount: number;
  afterOnTop: number;

  seasonalDiscount: number;
  afterSeasonal: number;

  finalTotal: number;
}

export interface AppliedCampaignInfo {
  coupon?: CouponCampaign;
  onTop?: OnTopCampaign;
  seasonal?: SeasonalCampaign;
}

export interface CalculateResult {
  breakdown: DiscountBreakdown;
  applied: AppliedCampaignInfo;
  warnings?: string[];
}
