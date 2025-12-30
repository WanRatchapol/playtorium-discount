"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { categoryColor, money } from "@/core/utils";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

//----------------------- Page -----------------------
export default function Page() {
  //----------------------- Store -----------------------
  const products = useAppStore((s) => s.products);
  const addToCart = useAppStore((s) => s.addToCart);

  //----------------------- State -----------------------
  const [qtyMap, setQtyMap] = useState<Record<string, string>>({});

  //----------------------- Memo -----------------------
  const activeProducts = useMemo(
    () => products.filter((p) => p.active),
    [products]
  );

  //----------------------- Util -----------------------
  const getQty = (productId: string) => {
    const raw = qtyMap[productId] ?? "1";
    const n = Math.floor(Number(raw));
    return Number.isFinite(n) && n >= 1 ? n : 1;
  };

  const setQty = (productId: string, value: string) => {
    setQtyMap((prev) => ({ ...prev, [productId]: value }));
  };

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
            Products
          </Typography>
          <Typography color="text.secondary">
            Select products to add into cart. Then go to Cart to apply
            discounts.
          </Typography>
        </Box>
      </Stack>

      <Divider />

      {/* Empty state */}
      {activeProducts.length === 0 ? (
        <Box sx={{ py: 6 }}>
          <Typography variant="h6" fontWeight={800}>
            No active products
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Go to Admin to add products or enable existing ones.
          </Typography>
          <Button
            component={Link}
            href="/admin"
            sx={{ mt: 2 }}
            variant="outlined"
          >
            Go to Admin
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {activeProducts.map((p) => (
            <Grid
              key={p.id}
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
            >
              <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography fontWeight={900}>{p.name}</Typography>
                      <Chip
                        size="small"
                        label={p.category}
                        color={categoryColor(p.category)}
                        variant="outlined"
                      />
                    </Stack>

                    <Typography fontWeight={800} sx={{ fontSize: 18 }}>
                      {money(p.price)} THB
                    </Typography>
                  </Stack>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ width: "100%" }}
                    alignItems="center"
                  >
                    <TextField
                      label="Qty"
                      type="number"
                      size="small"
                      value={qtyMap[p.id] ?? "1"}
                      onChange={(e) => setQty(p.id, e.target.value)}
                      inputProps={{ min: 1, step: 1 }}
                      sx={{ width: 110 }}
                    />
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<AddShoppingCartIcon />}
                      onClick={() => addToCart(p, getQty(p.id))}
                    >
                      Add to cart
                    </Button>
                  </Stack>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
}
