"use client";

import { money } from "@/core/utils";
import { Alert, Divider, Paper, Stack, Typography } from "@mui/material";
import type { CalculateResult } from "@/core/discount/types";

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <Stack direction="row" justifyContent="space-between" spacing={2}>
      <Typography fontWeight={strong ? 900 : 600}>{label}</Typography>
      <Typography fontWeight={strong ? 900 : 700}>{value}</Typography>
    </Stack>
  );
}

//----------------------- Component -----------------------
export default function ResultPanel({
  result,
  error,
}: {
  result: CalculateResult | null;
  error: string | null;
}) {
  //----------------------- Render -----------------------
  return (
    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
      <Typography variant="h6" fontWeight={700}>
        Result
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {!error && !result && (
        <Alert severity="info" sx={{ mt: 2 }}>
          Click <strong>Calculate</strong> to see the breakdown.
        </Alert>
      )}

      {result && (
        <Stack spacing={1} sx={{ mt: 2 }}>
          <Row
            label="Subtotal"
            value={`${money(result.breakdown.subtotal)} THB`}
          />
          <Row
            label="Coupon discount"
            value={`- ${money(result.breakdown.couponDiscount)} THB`}
          />
          <Row
            label="On Top discount"
            value={`- ${money(result.breakdown.onTopDiscount)} THB`}
          />
          <Row
            label="Seasonal discount"
            value={`- ${money(result.breakdown.seasonalDiscount)} THB`}
          />
          <Divider sx={{ my: 1 }} />
          <Row
            label="Final total"
            value={`${money(result.breakdown.finalTotal)} THB`}
            strong
          />

          {result.warnings?.length ? (
            <Alert severity="warning" sx={{ mt: 1 }}>
              <Typography fontWeight={800}>Warnings</Typography>
              <ul style={{ margin: "8px 0 0 18px" }}>
                {result.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </Alert>
          ) : null}
        </Stack>
      )}
    </Paper>
  );
}
