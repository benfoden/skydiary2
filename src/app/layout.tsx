import "~/styles/globals.css";

import { Inter } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { getUserLocale } from "~/i18n";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "skydiary",
  description:
    "Write a daily entry and you're done. You get recaps and advice in total privacy with an AI friend, coach, and mentor.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getUserLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`font-sans ${inter.variable} bg-gradient-to-b from-[#cce3f1] to-[#F3F6F6]`}
      >
        <TRPCReactProvider>
          <NextIntlClientProvider messages={messages}>
            <div className="container mx-auto min-h-screen">{children}</div>
          </NextIntlClientProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
