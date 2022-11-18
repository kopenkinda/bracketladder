import { AppShell } from "@mantine/core";
import type { PropsWithChildren } from "react";
import AppHeader from "./layout/Header";
import AppNavbar from "./layout/Navbar";

export default function DefaultLayout({
  children,
}: PropsWithChildren<unknown>) {
  return (
    <AppShell padding="md" navbar={<AppNavbar />} header={<AppHeader />}>
      {children}
    </AppShell>
  );
}
