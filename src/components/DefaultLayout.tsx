import { AppShell } from '@mantine/core';
import Head from 'next/head';
import type { PropsWithChildren } from 'react';
import AppHeader from './layout/Header';
import AppNavbar from './layout/Navbar';

export default function DefaultLayout({
  children,
}: PropsWithChildren<unknown>) {
  return (
    <>
      <Head>
        <title>BracketLadder</title>
      </Head>
      <AppShell padding='md' navbar={<AppNavbar />} header={<AppHeader />}>
        {children}
      </AppShell>
    </>
  );
}
