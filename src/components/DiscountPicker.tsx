"use client";

import { useMemo } from "react";
import { useAppStore } from "@/store/useAppStore";
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";
import type { DiscountOfferType } from "@/core/domain/types";

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Typography fontWeight={900}>{title}</Typography>
      {subtitle ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      ) : null}
      <Box sx={{ mt: 1 }}>{children}</Box>
    </Box>
  );
}

function OfferRadioGroup({
  value,
  offers,
  onChange,
}: {
  value: string | null;
  offers: { id: string; label: string }[];
  onChange: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
}) {
  const selected = value ?? "";

  if (offers.length === 0) {
    return (
      <Alert severity="warning" sx={{ mt: 1 }}>
        No offers available. Add some in Admin.
      </Alert>
    );
  }

  return (
    <FormControl>
      <RadioGroup value={selected} onChange={onChange}>
        <FormControlLabel value="" control={<Radio />} label="None" />
        {offers.map((o) => (
          <FormControlLabel
            key={o.id}
            value={o.id}
            control={<Radio />}
            label={o.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

//----------------------- Component -----------------------
export default function DiscountPicker() {
  //----------------------- Store -----------------------
  const offers = useAppStore((s) => s.offers);
  const selectOffer = useAppStore((s) => s.selectOffer);
  const selectedOfferIds = useAppStore((s) => s.selectedOfferIds);
  const clearSelectedOffers = useAppStore((s) => s.clearSelectedOffers);

  //----------------------- Memo -----------------------
  const activeCoupons = useMemo(
    () => offers.filter((o) => o.active && o.offerType === "coupon"),
    [offers]
  );
  const activeOnTops = useMemo(
    () => offers.filter((o) => o.active && o.offerType === "on_top"),
    [offers]
  );
  const activeSeasonals = useMemo(
    () => offers.filter((o) => o.active && o.offerType === "seasonal"),
    [offers]
  );

  //----------------------- Handler -----------------------
  const onChange =
    (type: DiscountOfferType) =>
    (_: React.ChangeEvent<HTMLInputElement>, value: string) => {
      selectOffer(type, value === "" ? null : value);
    };

  //----------------------- Render -----------------------
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
      <Stack spacing={1}>
        <Typography variant="h6" fontWeight={900}>
          Choose Discounts
        </Typography>

        <Alert severity="info">
          Discounts are applied in order:{" "}
          <strong>Coupon → On Top → Seasonal</strong>. (Max 1 per category)
        </Alert>

        <Button
          onClick={clearSelectedOffers}
          variant="outlined"
          sx={{ alignSelf: "flex-start" }}
        >
          Clear selections
        </Button>

        <Stack spacing={2} sx={{ mt: 1 }}>
          <Section
            title="Coupon"
            subtitle="Choose one coupon (fixed or percentage)."
          >
            <OfferRadioGroup
              value={selectedOfferIds.couponId}
              offers={activeCoupons.map((o) => ({ id: o.id, label: o.label }))}
              onChange={onChange("coupon")}
            />
          </Section>

          <Section
            title="On Top"
            subtitle="Choose one on-top discount (category % or points)."
          >
            <OfferRadioGroup
              value={selectedOfferIds.onTopId}
              offers={activeOnTops.map((o) => ({ id: o.id, label: o.label }))}
              onChange={onChange("on_top")}
            />
          </Section>

          <Section title="Seasonal" subtitle="Choose one seasonal campaign.">
            <OfferRadioGroup
              value={selectedOfferIds.seasonalId}
              offers={activeSeasonals.map((o) => ({
                id: o.id,
                label: o.label,
              }))}
              onChange={onChange("seasonal")}
            />
          </Section>
        </Stack>
      </Stack>
    </Paper>
  );
}
