"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "light",
  },
  shape: {
    borderRadius: 12,
  },
});

//----------------------- Provider -----------------------
export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  //----------------------- Render -----------------------
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
