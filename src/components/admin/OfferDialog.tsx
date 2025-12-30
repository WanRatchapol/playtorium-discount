"use client";

import { toNumber } from "@/core/utils";
import { CATEGORIES } from "@/core/constant";
import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import type { DiscountOffer } from "@/core/domain/types";
import type { Campaign, Category } from "@/core/discount/types";

type OfferType = "coupon" | "on_top" | "seasonal";
type CouponMethod = "fixed" | "percentage";
type OnTopMethod = "category_percentage" | "points";

function buildDefaultCampaign(type: OfferType): Campaign {
  if (type === "coupon") return { type: "coupon", method: "fixed", amount: 50 };
  if (type === "on_top")
    return {
      type: "on_top",
      method: "category_percentage",
      category: "Clothing",
      percentage: 15,
    };
  return { type: "seasonal", everyX: 300, discountY: 40 };
}

//----------------------- Component -----------------------
export default function OfferDialog({
  open,
  mode,
  initial,
  onClose,
  onSubmit,
}: {
  open: boolean;
  mode: "create" | "edit";
  initial?: DiscountOffer;
  onClose: () => void;
  onSubmit: (data: {
    label: string;
    offerType: OfferType;
    campaign: Campaign;
    active: boolean;
  }) => void;
}) {
  //----------------------- State -----------------------
  const [label, setLabel] = useState(initial?.label ?? "");
  const [offerType, setOfferType] = useState<OfferType>(
    initial?.offerType ?? "coupon"
  );
  const [active, setActive] = useState<boolean>(initial?.active ?? true);

  // Coupon state
  const [couponMethod, setCouponMethod] = useState<CouponMethod>("fixed");
  const [couponAmount, setCouponAmount] = useState("50");
  const [couponPct, setCouponPct] = useState("10");

  // OnTop state
  const [onTopMethod, setOnTopMethod] = useState<OnTopMethod>(
    "category_percentage"
  );
  const [onTopCategory, setOnTopCategory] = useState<Category>("Clothing");
  const [onTopPct, setOnTopPct] = useState("15");
  const [onTopPoints, setOnTopPoints] = useState("100");

  // Seasonal state
  const [everyX, setEveryX] = useState("300");
  const [discountY, setDiscountY] = useState("40");

  //----------------------- Effect -----------------------
  useEffect(() => {
    if (!open) return;

    setLabel(initial?.label ?? "");
    setOfferType((initial?.offerType as OfferType) ?? "coupon");
    setActive(initial?.active ?? true);

    const campaign =
      initial?.campaign ??
      buildDefaultCampaign((initial?.offerType as OfferType) ?? "coupon");

    if (campaign.type === "coupon") {
      setOfferType("coupon");
      setCouponMethod(campaign.method);
      if (campaign.method === "fixed") setCouponAmount(String(campaign.amount));
      else setCouponPct(String(campaign.percentage));
    } else if (campaign.type === "on_top") {
      setOfferType("on_top");
      setOnTopMethod(campaign.method);
      if (campaign.method === "category_percentage") {
        setOnTopCategory(campaign.category);
        setOnTopPct(String(campaign.percentage));
      } else {
        setOnTopPoints(String(campaign.points));
      }
    } else {
      setOfferType("seasonal");
      setEveryX(String(campaign.everyX));
      setDiscountY(String(campaign.discountY));
    }
  }, [open, initial]);

  //----------------------- Memo -----------------------
  const campaign: Campaign = useMemo(() => {
    if (offerType === "coupon") {
      if (couponMethod === "fixed") {
        return {
          type: "coupon",
          method: "fixed",
          amount: Math.max(0, toNumber(couponAmount)),
        };
      }
      return {
        type: "coupon",
        method: "percentage",
        percentage: Math.max(0, Math.min(100, toNumber(couponPct))),
      };
    }

    if (offerType === "on_top") {
      if (onTopMethod === "category_percentage") {
        return {
          type: "on_top",
          method: "category_percentage",
          category: onTopCategory,
          percentage: Math.max(0, Math.min(100, toNumber(onTopPct))),
        };
      }
      return {
        type: "on_top",
        method: "points",
        points: Math.max(0, toNumber(onTopPoints)),
      };
    }

    // seasonal
    return {
      type: "seasonal",
      everyX: Math.max(1, toNumber(everyX)),
      discountY: Math.max(0, toNumber(discountY)),
    };
  }, [
    offerType,
    couponMethod,
    couponAmount,
    couponPct,
    onTopMethod,
    onTopCategory,
    onTopPct,
    onTopPoints,
    everyX,
    discountY,
  ]);

  //----------------------- Variable -----------------------
  const canSubmit = label.trim().length > 0;

  //----------------------- Render -----------------------
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {mode === "create" ? "Add Discount Offer" : "Edit Discount Offer"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Label (what users see)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            fullWidth
            autoFocus
            placeholder='e.g. "10% OFF (Coupon)"'
          />

          <Divider />

          <Stack spacing={1}>
            <Typography fontWeight={800}>Offer Type</Typography>
            <RadioGroup
              row
              value={offerType}
              onChange={(_, v) => setOfferType(v as OfferType)}
            >
              <FormControlLabel
                value="coupon"
                control={<Radio />}
                label="Coupon"
              />
              <FormControlLabel
                value="on_top"
                control={<Radio />}
                label="On Top"
              />
              <FormControlLabel
                value="seasonal"
                control={<Radio />}
                label="Seasonal"
              />
            </RadioGroup>
          </Stack>

          {/* Coupon editor */}
          {offerType === "coupon" && (
            <Stack
              spacing={2}
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Typography fontWeight={800}>Coupon Settings</Typography>
              <RadioGroup
                row
                value={couponMethod}
                onChange={(_, v) => setCouponMethod(v as CouponMethod)}
              >
                <FormControlLabel
                  value="fixed"
                  control={<Radio />}
                  label="Fixed"
                />
                <FormControlLabel
                  value="percentage"
                  control={<Radio />}
                  label="Percentage"
                />
              </RadioGroup>

              {couponMethod === "fixed" ? (
                <TextField
                  label="Amount (THB)"
                  type="number"
                  value={couponAmount}
                  onChange={(e) => setCouponAmount(e.target.value)}
                  inputProps={{ min: 0, step: 1 }}
                />
              ) : (
                <TextField
                  label="Percentage (%)"
                  type="number"
                  value={couponPct}
                  onChange={(e) => setCouponPct(e.target.value)}
                  inputProps={{ min: 0, max: 100, step: 1 }}
                />
              )}
            </Stack>
          )}

          {/* On top editor */}
          {offerType === "on_top" && (
            <Stack
              spacing={2}
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Typography fontWeight={800}>On Top Settings</Typography>

              <RadioGroup
                row
                value={onTopMethod}
                onChange={(_, v) => setOnTopMethod(v as OnTopMethod)}
              >
                <FormControlLabel
                  value="category_percentage"
                  control={<Radio />}
                  label="Category %"
                />
                <FormControlLabel
                  value="points"
                  control={<Radio />}
                  label="Points"
                />
              </RadioGroup>

              {onTopMethod === "category_percentage" ? (
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <FormControl fullWidth>
                    <Select
                      value={onTopCategory}
                      onChange={(e) =>
                        setOnTopCategory(e.target.value as Category)
                      }
                    >
                      {CATEGORIES.map((c) => (
                        <MenuItem key={c} value={c}>
                          {c}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Percentage (%)"
                    type="number"
                    value={onTopPct}
                    onChange={(e) => setOnTopPct(e.target.value)}
                    inputProps={{ min: 0, max: 100, step: 1 }}
                    fullWidth
                  />
                </Stack>
              ) : (
                <TextField
                  label="Points"
                  type="number"
                  value={onTopPoints}
                  onChange={(e) => setOnTopPoints(e.target.value)}
                  inputProps={{ min: 0, step: 1 }}
                />
              )}
            </Stack>
          )}

          {/* Seasonal editor */}
          {offerType === "seasonal" && (
            <Stack
              spacing={2}
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Typography fontWeight={800}>Seasonal Settings</Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Every X (THB)"
                  type="number"
                  value={everyX}
                  onChange={(e) => setEveryX(e.target.value)}
                  inputProps={{ min: 1, step: 1 }}
                  fullWidth
                />
                <TextField
                  label="Discount Y (THB)"
                  type="number"
                  value={discountY}
                  onChange={(e) => setDiscountY(e.target.value)}
                  inputProps={{ min: 0, step: 1 }}
                  fullWidth
                />
              </Stack>
            </Stack>
          )}

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
              label: label.trim(),
              offerType,
              campaign,
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
