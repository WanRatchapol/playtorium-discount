# Playtorium Discount Campaign Demo

**Full Name:** <Ratchapol Kunthong>

This project implements a discount campaign engine and a small demo UI (Products → Cart → Admin) to visualize how campaigns affect the final price.

## Features

- Coupon campaigns: fixed amount, percentage
- On Top campaigns:
  - Category percentage discount
  - Points discount (1 point = 1 THB) capped at **20%** of the price at the On Top stage
- Seasonal campaigns: every X THB discount Y THB
- Campaign application order: **Coupon → On Top → Seasonal**
- Only one campaign per type can be applied at once (one coupon + one on_top + one seasonal)

## Tech Stack

- Next.js (App Router)
- TypeScript
- Zustand (client state)
- MUI (UI)
- Vitest (unit tests)

## How to Run

```bash
pnpm install
pnpm dev
```
