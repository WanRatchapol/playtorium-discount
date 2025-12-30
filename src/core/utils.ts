import type { Product } from "./domain/types";

//Change String to Number
export function toNumber(v: string): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

//Check Number to Money format
export function money(n: number) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

//Format Cateogry Color
export function categoryColor(
  category: Product["category"]
): "default" | "primary" | "secondary" | "success" {
  if (category === "Clothing") return "primary";
  if (category === "Accessories") return "secondary";
  return "success";
}
