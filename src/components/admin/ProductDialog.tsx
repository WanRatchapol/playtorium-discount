"use client";

import { toNumber } from "@/core/utils";
import { useEffect, useState } from "react";
import { CATEGORIES } from "@/core/constant";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import type { Product } from "@/core/domain/types";
import type { Category } from "@/core/discount/types";

//----------------------- Component -----------------------
export default function ProductDialog({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: Product;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    category: Category;
    price: number;
    active: boolean;
  }) => void;
}) {
  //----------------------- State -----------------------
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState<Category>(
    initial?.category ?? "Clothing"
  );
  const [price, setPrice] = useState<string>(String(initial?.price ?? 0));
  const [active, setActive] = useState<boolean>(initial?.active ?? true);

  //----------------------- Effect -----------------------
  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setCategory(initial?.category ?? "Clothing");
    setPrice(String(initial?.price ?? 0));
    setActive(initial?.active ?? true);
  }, [open, initial]);

  const canSubmit = name.trim().length > 0 && toNumber(price) >= 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode === "create" ? "Add Product" : "Edit Product"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            autoFocus
          />

          <FormControl fullWidth>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Price (THB)"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            inputProps={{ min: 0, step: 1 }}
            fullWidth
          />

          <FormControlLabel
            control={
              <Switch
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
              />
            }
            label="Active"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="text">
          Cancel
        </Button>
        <Button
          onClick={() =>
            onSubmit({
              name: name.trim(),
              category,
              price: toNumber(price),
              active,
            })
          }
          disabled={!canSubmit}
          variant="contained"
        >
          {mode === "create" ? "Add" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
