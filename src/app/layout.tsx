import type { Metadata } from "next";
import AppShell from "@/components/AppShell";
import ThemeRegistry from "@/components/ThemeRegistry";

export const metadata: Metadata = {
  title: "Playtorium Discount Demo",
  description: "Discount module demo (Products → Cart → Admin)",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          <AppShell>{children}</AppShell>
        </ThemeRegistry>
      </body>
    </html>
  );
}
