import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import InstallPrompt from "@/components/features/InstallPrompt";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const inter = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-jetbrains-mono",
  display: "swap",
});

const SITE_URL = "https://coinglance.app";
const SITE_NAME = "CoinGlance";
const TITLE = "CoinGlance — Live Crypto Markets at a Glance";
const DESCRIPTION =
  "A glance at crypto, worldwide. Live prices, market data, Fear & Greed index, and trusted exchange reviews — always free.";

export const viewport: Viewport = {
  themeColor: "#D4A545",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:  TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: DESCRIPTION,

  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  keywords: [
    "cryptocurrency", "crypto prices", "bitcoin price", "ethereum price",
    "crypto market data", "fear greed index", "crypto exchange comparison",
    "live crypto", "NGN crypto", "crypto Africa",
  ],

  // PWA / Apple
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
    startupImage: [
      {
        url: "/apple-touch-icon.png",
        media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)",
      },
    ],
  },

  icons: {
    icon: [
      { url: "/favicon.svg",    type: "image/svg+xml"       },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
    ],
    apple:    [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.svg",
  },

  manifest: "/manifest.webmanifest",

  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         SITE_URL,
    siteName:    SITE_NAME,
    title:       TITLE,
    description: DESCRIPTION,
    images: [
      {
        url:    "/og-image.svg",
        width:  1200,
        height: 630,
        alt:    TITLE,
        type:   "image/svg+xml",
      },
    ],
  },

  twitter: {
    card:        "summary_large_image",
    site:        "@coinglance",
    title:       TITLE,
    description: DESCRIPTION,
    images:      ["/og-image.svg"],
  },

  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet":       -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-bg-light dark:bg-bg-dark`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <CurrencyProvider>
            {children}
            <InstallPrompt />
          </CurrencyProvider>
        </ThemeProvider>
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
