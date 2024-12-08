import "./globals.css";
import '@mantine/core/styles.css';

import type { Metadata } from "next";
import { Inter } from 'next/font/google'

import { MantineProvider, createTheme } from '@mantine/core';
import Header from "@/component/Header/Header";
import { SessionLayout } from "@/component/Layout/Session";
import ThemeProviders from "@/component/Layout/theme";
import { ModalsProvider } from "@mantine/modals";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "캐롤 추천",
  description: "christmas carols",
};

const theme = createTheme({
  fontFamily: 'Montserrat, sans-serif',
  defaultRadius: 'md',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
      <MantineProvider theme={theme} >
      <ModalsProvider>
      <ThemeProviders>
      <SessionLayout>
        <Header />
        {children}
      </SessionLayout>
      </ThemeProviders>
      </ModalsProvider>
      </MantineProvider>
      </body>
    </html>
  );
}
