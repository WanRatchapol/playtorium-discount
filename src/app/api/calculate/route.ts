import { NextResponse } from "next/server";
import { calculateFinalPrice } from "@/core/discount/calculator";
import type { Campaign, CartItem } from "@/core/discount/types";

// -------------------- helpers --------------------
function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function isNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v);
}

function isCategory(v: unknown): v is CartItem["category"] {
  return v === "Clothing" || v === "Accessories" || v === "Electronics";
}

function isCartItem(v: unknown): v is CartItem {
  if (!isObject(v)) return false;

  const id = v["id"];
  if (id !== undefined && !isString(id)) return false;

  return (
    isString(v["name"]) &&
    isCategory(v["category"]) &&
    isNumber(v["unitPrice"]) &&
    isNumber(v["quantity"]) &&
    Number.isInteger(v["quantity"]) &&
    v["quantity"] > 0 &&
    v["unitPrice"] >= 0
  );
}

function isCampaign(v: unknown): v is Campaign {
  if (!isObject(v) || !isString(v["type"])) return false;

  const type = v["type"];

  if (type === "coupon") {
    if (!isString(v["method"])) return false;
    if (v["method"] === "fixed")
      return isNumber(v["amount"]) && v["amount"] >= 0;
    if (v["method"] === "percentage")
      return (
        isNumber(v["percentage"]) &&
        v["percentage"] >= 0 &&
        v["percentage"] <= 100
      );
    return false;
  }

  if (type === "on_top") {
    if (!isString(v["method"])) return false;

    if (v["method"] === "category_percentage") {
      return (
        isCategory(v["category"]) &&
        isNumber(v["percentage"]) &&
        v["percentage"] >= 0 &&
        v["percentage"] <= 100
      );
    }

    if (v["method"] === "points") {
      return isNumber(v["points"]) && v["points"] >= 0;
    }

    return false;
  }

  if (type === "seasonal") {
    return (
      isNumber(v["everyX"]) &&
      isNumber(v["discountY"]) &&
      v["everyX"] >= 1 &&
      v["discountY"] >= 0
    );
  }

  return false;
}

// -------------------- route --------------------
export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();

    if (!isObject(body)) {
      return NextResponse.json(
        { error: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const itemsUnknown = body["items"];
    const campaignsUnknown = body["campaigns"];

    if (!Array.isArray(itemsUnknown) || !Array.isArray(campaignsUnknown)) {
      return NextResponse.json(
        { error: "Body must include 'items' and 'campaigns' arrays." },
        { status: 400 }
      );
    }

    // Deep validation + helpful index errors
    const items: CartItem[] = [];
    for (let i = 0; i < itemsUnknown.length; i++) {
      const it = itemsUnknown[i];
      if (!isCartItem(it)) {
        return NextResponse.json(
          { error: `Invalid item in 'items' at index ${i}.` },
          { status: 400 }
        );
      }
      items.push(it);
    }

    const campaigns: Campaign[] = [];
    for (let i = 0; i < campaignsUnknown.length; i++) {
      const c = campaignsUnknown[i];
      if (!isCampaign(c)) {
        return NextResponse.json(
          { error: `Invalid campaign in 'campaigns' at index ${i}.` },
          { status: 400 }
        );
      }
      campaigns.push(c);
    }

    const result = calculateFinalPrice(items, campaigns);
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected server error.";
    const status =
      /allowed|invalid|must be|required|between|integer|array/i.test(message)
        ? 400
        : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
