"use client";

import Link from "next/link";
import * as React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AppBar, Box, Button, Container, Toolbar } from "@mui/material";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import type { NavItem } from "@/core/types";

const NAV: NavItem[] = [
  { label: "Products", href: "/", icon: <StorefrontOutlinedIcon /> },
  { label: "Cart", href: "/cart", icon: <ShoppingCartOutlinedIcon /> },
  { label: "Admin", href: "/admin", icon: <AdminPanelSettingsOutlinedIcon /> },
];

//----------------------- Component -----------------------
export default function AppShell({ children }: { children: React.ReactNode }) {
  //----------------------- Param -----------------------
  const pathname = usePathname();

  //----------------------- Render -----------------------
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="sticky"
        color="default"
        sx={{
          backgroundColor: "white",
        }}
      >
        <Toolbar>
          <Container
            maxWidth="lg"
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Box
              sx={{
                flexGrow: 1,
              }}
            >
              <Box
                sx={{
                  width: "120px",
                  height: "40px",
                  position: "relative",
                }}
              >
                <Image
                  src="/icons/playtorium-logo.png"
                  alt="Playtorium Logo"
                  fill
                />
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              {NAV.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname?.startsWith(item.href);

                return (
                  <Button
                    key={item.href}
                    component={Link}
                    href={item.href}
                    startIcon={item.icon}
                    variant={active ? "contained" : "text"}
                    color={active ? "primary" : "inherit"}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          </Container>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {children}
      </Container>
    </Box>
  );
}
