"use client";

import { useMemo, useState } from "react";
import { CATEGORIES } from "@/core/constant";
import { useAppStore } from "@/store/useAppStore";
import ResultPanel from "@/components/ResultPanel";
import DiscountPicker from "@/components/DiscountPicker";
import CalculateIcon from "@mui/icons-material/Calculate";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Alert,
  Box,
  Button,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import type { CartItem } from "@/core/discount/types";
import type { DiscountOffer } from "@/core/domain/types";
import type { Campaign, CalculateResult } from "@/core/discount/types";

function toInt(v: string) {
  const n = Math.floor(Number(v));
  return Number.isFinite(n) ? n : 1;
}

function money(n: number) {
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

//----------------------- Page -----------------------
export default function CartPage() {
  //----------------------- Store -----------------------
  const cart = useAppStore((s) => s.cart);
  const offers = useAppStore((s) => s.offers);
  const selectedOfferIds = useAppStore((s) => s.selectedOfferIds);

  const clearCart = useAppStore((s) => s.clearCart);
  const setCartQty = useAppStore((s) => s.setCartQty);
  const removeFromCart = useAppStore((s) => s.removeFromCart);

  //----------------------- State -----------------------
  const [result, setResult] = useState<CalculateResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  //----------------------- Memo -----------------------
  // Derived
  const subtotal = useMemo(
    () => cart.reduce((sum, it) => sum + it.unitPrice * it.quantity, 0),
    [cart]
  );

  // Convert selected offer IDs
  const campaigns: Campaign[] = useMemo(() => {
    const map = new Map<string, DiscountOffer>(offers.map((o) => [o.id, o]));

    const ids = [
      selectedOfferIds.couponId,
      selectedOfferIds.onTopId,
      selectedOfferIds.seasonalId,
    ].filter((x): x is string => !!x);

    return ids
      .map((id) => map.get(id))
      .filter((o): o is DiscountOffer => !!o && o.active)
      .map((o) => o.campaign);
  }, [offers, selectedOfferIds]);

  //----------------------- API call -----------------------
  async function calculate() {
    setError(null);
    setResult(null);

    if (cart.length === 0) {
      setError("Cart is empty. Please add products first.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, campaigns }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Failed to calculate.");
        return;
      }
      setResult(data as CalculateResult);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setIsLoading(false);
    }
  }

  //----------------------- Render -----------------------
  return (
    <Stack spacing={2}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ sm: "center" }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4" fontWeight={900}>
            Cart
          </Typography>
          <Typography color="text.secondary">
            Review items, pick discounts, then calculate final price.
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteSweepIcon />}
            onClick={() => {
              clearCart();
              setResult(null);
              setError(null);
            }}
            disabled={cart.length === 0}
          >
            Clear Cart
          </Button>
          <Button
            variant="contained"
            startIcon={<CalculateIcon />}
            onClick={calculate}
            disabled={isLoading || cart.length === 0}
          >
            {isLoading ? "Calculating..." : "Calculate"}
          </Button>
        </Stack>
      </Stack>

      <Divider />

      <Grid container spacing={2}>
        {/* Left: Cart table */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight={900}>
              Items
            </Typography>

            {cart.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                Your cart is empty. Go to <strong>Products</strong> to add
                items.
              </Alert>
            ) : (
              <Box sx={{ mt: 2, overflowX: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 800 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Unit Price</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Qty</TableCell>
                      <TableCell sx={{ fontWeight: 800 }}>Line Total</TableCell>
                      <TableCell />
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {cart.map((it: CartItem) => (
                      <TableRow key={it.id}>
                        <TableCell>{it.name}</TableCell>

                        <TableCell sx={{ minWidth: 150 }}>
                          {/* Category is fixed from product; keep as read-only select for clarity */}
                          <Select
                            size="small"
                            value={it.category}
                            fullWidth
                            disabled
                          >
                            {CATEGORIES.map((c) => (
                              <MenuItem key={c} value={c}>
                                {c}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>

                        <TableCell>{money(it.unitPrice)}</TableCell>

                        <TableCell sx={{ minWidth: 90 }}>
                          <TextField
                            size="small"
                            type="number"
                            value={it.quantity}
                            onChange={(e) =>
                              setCartQty(
                                it.id!,
                                Math.max(1, toInt(e.target.value))
                              )
                            }
                            inputProps={{ min: 1, step: 1 }}
                            fullWidth
                          />
                        </TableCell>

                        <TableCell sx={{ fontWeight: 800 }}>
                          {money(it.unitPrice * it.quantity)}
                        </TableCell>

                        <TableCell align="right">
                          <IconButton
                            onClick={() => removeFromCart(it.id!)}
                            aria-label="remove"
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Typography sx={{ mt: 2 }} fontWeight={900}>
                  Subtotal: {money(subtotal)} THB
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right: Discount picker + result */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack spacing={2}>
            <DiscountPicker />
            <ResultPanel result={result} error={error} />
          </Stack>
        </Grid>
      </Grid>
    </Stack>
  );
}
