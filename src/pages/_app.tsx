import type { ColorScheme } from "@mantine/core";
import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { getCookie, setCookie } from "cookies-next";
import { type Session } from "next-auth";
import { getSession, SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { type AppType } from "next/app";
import { useEffect, useState } from "react";
import { RouterTransition } from "../components/RouterTransition";
import "../styles/globals.css";
import { trpc } from "../utils/trpc";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import DefaultLayout from "../components/DefaultLayout";

dayjs.extend(relativeTime);
dayjs.locale("fr");

const MyApp = (({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps & {
  pageProps: { session: Session | null; colorScheme: ColorScheme };
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
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ loader: "bars", colorScheme }}
      >
        <RouterTransition />
        <SessionProvider session={session}>
          <ModalsProvider>
            <NotificationsProvider>
              <DefaultLayout>
                <Component {...pageProps} />
              </DefaultLayout>
            </NotificationsProvider>
          </ModalsProvider>
        </SessionProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}) as AppType<{
  pageProps: { session: Session | null; colorScheme: ColorScheme };
}>;

MyApp.getInitialProps = async ({ ctx }) => {
  const session = await getSession(ctx);
  const colorScheme = (getCookie("mantine-color-scheme", ctx) ||
    "light") as ColorScheme;
  return {
    pageProps: {
      session,
      colorScheme,
    },
  };
};

const App = trpc.withTRPC(MyApp);

export default App;
