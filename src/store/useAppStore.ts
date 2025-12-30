import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SEED_OFFERS, SEED_PRODUCTS } from "@/core/domain/seed";
import type { CartItem } from "@/core/discount/types";
import type {
  DiscountOffer,
  Product,
  DiscountOfferType,
} from "@/core/domain/types";

type SelectedOfferIds = {
  couponId: string | null;
  onTopId: string | null;
  seasonalId: string | null;
};

type AppState = {
  // Data
  products: Product[];
  offers: DiscountOffer[];

  // Cart
  cart: CartItem[];

  // Selected discounts
  selectedOfferIds: SelectedOfferIds;

  // --- Product actions ---
  addProduct: (p: Omit<Product, "id">) => void;
  updateProduct: (id: string, patch: Partial<Omit<Product, "id">>) => void;
  removeProduct: (id: string) => void;
  resetProducts: () => void;

  // --- Offer actions ---
  addOffer: (o: Omit<DiscountOffer, "id">) => void;
  updateOffer: (id: string, patch: Partial<Omit<DiscountOffer, "id">>) => void;
  removeOffer: (id: string) => void;
  resetOffers: () => void;

  // --- Cart actions ---
  addToCart: (product: Product, qty?: number) => void;
  setCartQty: (cartItemId: string, qty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;

  // --- Discount selection actions ---
  selectOffer: (offerType: DiscountOfferType, offerId: string | null) => void;
  clearSelectedOffers: () => void;

  // --- Derived helpers ---
  getActiveProducts: () => Product[];
  getActiveOffersByType: (offerType: DiscountOfferType) => DiscountOffer[];
  getSelectedCampaigns: () => import("@/core/discount/types").Campaign[];
};

function newId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now()}`;
}

function isDefined<T>(v: T | undefined | null): v is T {
  return v !== undefined && v !== null;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      products: SEED_PRODUCTS,
      offers: SEED_OFFERS,
      cart: [],
      selectedOfferIds: { couponId: null, onTopId: null, seasonalId: null },

      // ---------- Products ----------
      addProduct: (p) =>
        set((state) => ({
          products: [...state.products, { ...p, id: newId("p") }],
        })),

      updateProduct: (id, patch) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...patch } : p
          ),
        })),

      removeProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      resetProducts: () => set({ products: SEED_PRODUCTS }),

      // ---------- Offers ----------
      addOffer: (o) =>
        set((state) => ({
          offers: [...state.offers, { ...o, id: newId("offer") }],
        })),

      updateOffer: (id, patch) =>
        set((state) => ({
          offers: state.offers.map((o) =>
            o.id === id ? { ...o, ...patch } : o
          ),
        })),

      removeOffer: (id) =>
        set((state) => {
          const nextOffers = state.offers.filter((o) => o.id !== id);
          const sel = state.selectedOfferIds;
          const nextSel = {
            couponId: sel.couponId === id ? null : sel.couponId,
            onTopId: sel.onTopId === id ? null : sel.onTopId,
            seasonalId: sel.seasonalId === id ? null : sel.seasonalId,
          };
          return { offers: nextOffers, selectedOfferIds: nextSel };
        }),

      resetOffers: () => set({ offers: SEED_OFFERS }),

      // ---------- Cart ----------
      addToCart: (product, qty = 1) =>
        set((state) => {
          const safeQty = Math.max(1, Math.floor(qty));
          const existing = state.cart.find(
            (it) =>
              it.name === product.name &&
              it.category === product.category &&
              it.unitPrice === product.price
          );

          if (existing) {
            return {
              cart: state.cart.map((it) =>
                it === existing
                  ? { ...it, quantity: it.quantity + safeQty }
                  : it
              ),
            };
          }

          return {
            cart: [
              ...state.cart,
              {
                id: newId("cart"),
                name: product.name,
                category: product.category,
                unitPrice: product.price,
                quantity: safeQty,
              },
            ],
          };
        }),

      setCartQty: (cartItemId, qty) =>
        set((state) => ({
          cart: state.cart.map((it) =>
            it.id === cartItemId
              ? { ...it, quantity: Math.max(1, Math.floor(qty)) }
              : it
          ),
        })),

      removeFromCart: (cartItemId) =>
        set((state) => ({
          cart: state.cart.filter((it) => it.id !== cartItemId),
        })),

      clearCart: () => set({ cart: [] }),

      // ---------- Discount Selection ----------
      selectOffer: (offerType, offerId) =>
        set((state) => {
          const prev = state.selectedOfferIds;
          if (offerType === "coupon")
            return { selectedOfferIds: { ...prev, couponId: offerId } };
          if (offerType === "on_top")
            return { selectedOfferIds: { ...prev, onTopId: offerId } };
          return { selectedOfferIds: { ...prev, seasonalId: offerId } };
        }),

      clearSelectedOffers: () =>
        set({
          selectedOfferIds: { couponId: null, onTopId: null, seasonalId: null },
        }),

      // ---------- Derived Helpers ----------
      getActiveProducts: () => get().products.filter((p) => p.active),

      getActiveOffersByType: (offerType) =>
        get().offers.filter((o) => o.active && o.offerType === offerType),

      getSelectedCampaigns: () => {
        const { offers, selectedOfferIds } = get();

        const selectedIds = [
          selectedOfferIds.couponId,
          selectedOfferIds.onTopId,
          selectedOfferIds.seasonalId,
        ].filter(isDefined);

        return selectedIds
          .map((id) => offers.find((o) => o.id === id)?.campaign)
          .filter(isDefined);
      },
    }),
    {
      name: "playtorium-store",
      version: 1,
      partialize: (state) => ({
        products: state.products,
        offers: state.offers,
        cart: state.cart,
        selectedOfferIds: state.selectedOfferIds,
      }),
    }
  )
);
