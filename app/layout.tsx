"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { LoginWidgetProvider } from "@mochi-web3/login-widget";
import { Platform } from "@consolelabs/mochi-formatter";
import { AUTH_TELEGRAM_ID, MOCHI_PROFILE_API } from "@/envs";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LoginWidgetProvider
          socials={[
            Platform.Discord,
            Platform.Telegram,
            Platform.Email,
            Platform.Twitter,
          ]}
          telegramBotId={AUTH_TELEGRAM_ID}
          profileApi={MOCHI_PROFILE_API}
        >
          {children as any}
        </LoginWidgetProvider>
      </body>
    </html>
  );
}
