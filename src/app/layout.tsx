import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "~/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "MelodyAI - AI Music Generation",
  description: "Create music with AI magic. Generate original songs from text descriptions.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SessionProvider>

    <html lang="en" className={`${geist.variable}`}>
      <body>
        <Analytics/>
          {children}
          <Toaster />
      </body>
    </html>
    </SessionProvider>

  );
}
