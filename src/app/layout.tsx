import "./globals.css";
import '@mantine/core/styles.css';

import type { Metadata } from "next";
import { Inter } from 'next/font/google'

import { MantineProvider, createTheme } from '@mantine/core';
import Header from "@/component/Header/Header";
import { SessionLayout } from "@/component/Layout/Session";
import ThemeProviders from "@/component/Layout/theme";
import Footer from "@/component/Footer/Footer";
import { YouTubePlayerProvider } from "@/component/Layout/YoutubeContext";
import GlobalPlayer from "@/component/GlobalMusic";

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
      <ThemeProviders>
      <SessionLayout>
      <YouTubePlayerProvider>
        <GlobalPlayer />
        <div id="wrap">
          <Header />
          {children}
        </div>
        <Footer />
      </YouTubePlayerProvider>
      </SessionLayout>
      </ThemeProviders>
      </MantineProvider>
      </body>
    </html>
  );
}
