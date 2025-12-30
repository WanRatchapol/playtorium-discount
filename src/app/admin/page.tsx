"use client";

import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useAppStore } from "@/store/useAppStore";
import OfferDialog from "@/components/admin/OfferDialog";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ProductDialog from "@/components/admin/ProductDialog";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { Campaign } from "@/core/discount/types";
import type { Product, DiscountOffer } from "@/core/domain/types";

function typeChipColor(
  t: DiscountOffer["offerType"]
): "primary" | "secondary" | "success" {
  if (t === "coupon") return "primary";
  if (t === "on_top") return "secondary";
  return "success";
}

//----------------------- Page -----------------------
export default function AdminPage() {
  //----------------------- Store -----------------------s
  const products = useAppStore((s) => s.products);
  const offers = useAppStore((s) => s.offers);

  const addProduct = useAppStore((s) => s.addProduct);
  const updateProduct = useAppStore((s) => s.updateProduct);
  const removeProduct = useAppStore((s) => s.removeProduct);
  const resetProducts = useAppStore((s) => s.resetProducts);

  const addOffer = useAppStore((s) => s.addOffer);
  const updateOffer = useAppStore((s) => s.updateOffer);
  const removeOffer = useAppStore((s) => s.removeOffer);
  const resetOffers = useAppStore((s) => s.resetOffers);

  //----------------------- State -----------------------
  // dialogs
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [productDialogMode, setProductDialogMode] = useState<"create" | "edit">(
    "create"
  );
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(
    undefined
  );

  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [offerDialogMode, setOfferDialogMode] = useState<"create" | "edit">(
    "create"
  );
  const [editingOffer, setEditingOffer] = useState<DiscountOffer | undefined>(
    undefined
  );

  function openCreateProduct() {
    setProductDialogMode("create");
    setEditingProduct(undefined);
    setProductDialogOpen(true);
  }
  function openEditProduct(p: Product) {
    setProductDialogMode("edit");
    setEditingProduct(p);
    setProductDialogOpen(true);
  }

  function openCreateOffer() {
    setOfferDialogMode("create");
    setEditingOffer(undefined);
    setOfferDialogOpen(true);
  }
  function openEditOffer(o: DiscountOffer) {
    setOfferDialogMode("edit");
    setEditingOffer(o);
    setOfferDialogOpen(true);
  }

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h4" fontWeight={900}>
          Admin
        </Typography>
        <Typography color="text.secondary">
          Manage products and discount offers (what users can pick in Cart).
        </Typography>
      </Box>

      <Alert severity="info">
        Tip: Use <strong>Active</strong> to hide/show items. Use{" "}
        <strong>Reset</strong> to restore seed data.
      </Alert>

      <Divider />

      <Grid container spacing={2}>
        {/* Products */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6" fontWeight={900}>
                Products
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<RestartAltIcon />}
                  onClick={resetProducts}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={openCreateProduct}
                >
                  Add
                </Button>
              </Stack>
            </Stack>

            <Box sx={{ mt: 2, overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Category</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Price</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Active</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>

                <TableBody>
                  {products.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell sx={{ fontWeight: 700 }}>{p.name}</TableCell>
                      <TableCell>{p.category}</TableCell>
                      <TableCell>{p.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Switch
                          checked={p.active}
                          onChange={(e) =>
                            updateProduct(p.id, { active: e.target.checked })
                          }
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => openEditProduct(p)}
                          aria-label="edit product"
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => removeProduct(p.id)}
                          aria-label="delete product"
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Grid>

        {/* Offers */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6" fontWeight={900}>
                Discount Offers
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="outlined"
                  startIcon={<RestartAltIcon />}
                  onClick={resetOffers}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={openCreateOffer}
                >
                  Add
                </Button>
              </Stack>
            </Stack>

            <Box sx={{ mt: 2, overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900 }}>Label</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Type</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Active</TableCell>
                    <TableCell sx={{ fontWeight: 900 }}>Campaign</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>

                <TableBody>
                  {offers.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell sx={{ fontWeight: 700 }}>{o.label}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={o.offerType}
                          color={typeChipColor(o.offerType)}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={o.active}
                          onChange={(e) =>
                            updateOffer(o.id, { active: e.target.checked })
                          }
                        />
                      </TableCell>
                      <TableCell sx={{ maxWidth: 240 }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                          title={JSON.stringify(o.campaign)}
                        >
                          {campaignSummary(o.campaign)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          onClick={() => openEditOffer(o)}
                          aria-label="edit offer"
                        >
                          <EditOutlinedIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => removeOffer(o.id)}
                          aria-label="delete offer"
                        >
                          <DeleteOutlineIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* dialogs */}
      <ProductDialog
        key={`product-${productDialogMode}-${productDialogOpen}-${
          editingProduct?.id ?? "new"
        }`}
        open={productDialogOpen}
        mode={productDialogMode}
        initial={editingProduct}
        onClose={() => setProductDialogOpen(false)}
        onSubmit={(data) => {
          if (productDialogMode === "create") {
            addProduct(data);
          } else if (editingProduct) {
            updateProduct(editingProduct.id, data);
          }
          setProductDialogOpen(false);
        }}
      />

      <OfferDialog
        key={`${offerDialogMode}-${offerDialogOpen}-${
          editingOffer?.id ?? "new"
        }`}
        open={offerDialogOpen}
        mode={offerDialogMode}
        initial={editingOffer}
        onClose={() => setOfferDialogOpen(false)}
        onSubmit={(data) => {
          if (offerDialogMode === "create") {
            addOffer({
              label: data.label,
              offerType: data.offerType,
              campaign: data.campaign,
              active: data.active,
            });
          } else if (editingOffer) {
            updateOffer(editingOffer.id, {
              label: data.label,
              offerType: data.offerType,
              campaign: data.campaign,
              active: data.active,
            });
          }
          setOfferDialogOpen(false);
        }}
      />
    </Stack>
  );
}

function campaignSummary(c: Campaign): string {
  if (c.type === "coupon") {
    return c.method === "fixed"
      ? `coupon fixed ฿${c.amount}`
      : `coupon ${c.percentage}%`;
  }
  if (c.type === "on_top") {
    return c.method === "points"
      ? `on_top points ${c.points}`
      : `on_top ${c.category} ${c.percentage}%`;
  }
  return `seasonal every ${c.everyX} get ${c.discountY}`;
}
