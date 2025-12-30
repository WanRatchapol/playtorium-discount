//Check Number
export const isFiniteNumber = (n: unknown): n is number =>
  typeof n === "number" && Number.isFinite(n);

//Clamp Min 0
export const clampMin0 = (n: number) => (n < 0 ? 0 : n);

//Round 2 Decimal
export const round2 = (n: number) => Math.round(n * 100) / 100;
