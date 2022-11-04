import type { ColorScheme } from "@mantine/core";
import { ColorSchemeProvider } from "@mantine/core";
import { MantineProvider } from "@mantine/core";
import { type Session } from "next-auth";
import { getSession, SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { trpc } from "../utils/trpc";

import { RouterTransition } from "../components/RouterTransition";
import "../styles/globals.css";
import { NotificationsProvider } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";
import { useEffect, useState } from "react";
import { getCookie, setCookie } from "cookies-next";

const MyApp: AppType<{ session: Session | null; colorScheme: ColorScheme }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    pageProps.colorScheme
  );
  const toggleColorScheme = (value?: ColorScheme) => {
    const nextColorScheme =
      value || (colorScheme === "dark" ? "light" : "dark");
    setColorScheme(nextColorScheme);
    setCookie("mantine-color-scheme", nextColorScheme, {
      maxAge: 60 * 60 * 24 * 30,
    });
    if (document.body.classList.contains("dark")) {
      document.body.classList.remove("dark");
    } else {
      document.body.classList.add("dark");
    }
  };

  useEffect(() => {
    if (colorScheme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [colorScheme]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <RouterTransition />
        <SessionProvider session={session}>
          <ModalsProvider>
            <NotificationsProvider>
              <Component {...pageProps} />
            </NotificationsProvider>
          </ModalsProvider>
        </SessionProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
};

MyApp.getInitialProps = async ({ ctx }) => {
  const session = await getSession(ctx);
  const colorScheme = (getCookie("mantine-color-scheme", ctx) ||
    "light") as ColorScheme;
  console.log(colorScheme);
  if (session != null) {
    return {
      colorScheme,
      session: session,
    };
  }
  return {
    session: null,
    colorScheme,
  };
};

export default trpc.withTRPC(MyApp);
