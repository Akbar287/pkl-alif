import type { Metadata, Viewport } from "next";
import { Spectral, Sono, Poppins } from "next/font/google";
import { ThemeProvider } from "@/provider/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Providers from "../provider/auth-providers";
import "nprogress/nprogress.css";
import "./globals.css";
import { getSession } from "@/provider/api";
import LayoutAuth from "@/components/layout/layout-auth";
import LayoutNoauth from "@/components/layout/layout-noauth";
import { RouteProgress } from "@/lib/router-progress";

const spectralSans = Spectral({
  variable: "--font-spectral",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  subsets: ["latin"],
});

const SonoMono = Sono({
  variable: "--font-sono",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "PKL Alif",
  description: "Untuk memenuhi tugas PKL Alif",
  icons: {
    icon: "/icon/favicon.ico",
    shortcut: "/icon/favicon.ico",
    apple: "/icon/apple-touch-icon.png",
  },
  keywords: ["PKL Alif", "PKL"],
  robots: {
    index: true,
    follow: true,
    nocache: false,
    noarchive: false,
    noimageindex: false,
    notranslate: false,
    nosnippet: false,
    "max-image-preview": "large",
    "max-video-preview": -1,
    "max-snippet": -1,
  },
  appleWebApp: {
    capable: true,
    title: "PKL Alif",
    statusBarStyle: "default",
    startupImage: "/icon/apple-touch-icon.png",
  },
  verification: {
    google:
      "google-site-verification=FUCYTTrKjmtMwajX-4vs5QxlBl0GWI_i2xuoaw4pbVM",
  },
  alternates: {
    canonical: "https://www.iti.ac.id",
    languages: {
      en: "/en",
      id: "/",
    },
  },
  facebook: {
    appId: "471953908653450",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en">
      <body
        className={`${spectralSans.variable} ${SonoMono.variable} ${poppins.variable} antialiased`}
      >
        <RouteProgress />
        <Providers session={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {session !== null ? (
              <LayoutAuth>{children}</LayoutAuth>
            ) : (
              <LayoutNoauth>{children}</LayoutNoauth>
            )}
            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 3000,
              }}
            />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
