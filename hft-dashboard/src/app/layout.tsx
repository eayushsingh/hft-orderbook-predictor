import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { AuthProvider } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import NavigationProgressLoader from "@/components/NavigationProgressLoader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#060608" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "LALAN HFT - High-Frequency Market Microstructure & Order Book Engine",
  description: "Institutional market microstructure analysis, zero-allocation LMAX Disruptor ring buffer, Order Book Imbalance (OBI) forecasting, and sub-millisecond execution for Indian traders.",
  keywords: [
    "HFT",
    "High Frequency Trading",
    "Order Book Imbalance",
    "OBI Signal",
    "LMAX Disruptor",
    "NSE India",
    "NIFTY Options",
    "DhanHQ API",
    "Micro-Price Drift",
    "Quant Trading",
  ],
  authors: [{ name: "LALAN Quant Engineering Team", url: "https://lalan-hft.internal" }],
  openGraph: {
    title: "LALAN HFT - Market Microstructure & L2 Quant Engine",
    description: "Sub-millisecond Level-2 depth stream, Order Book Imbalance (OBI) signals, and DhanHQ integration for Indian options traders.",
    type: "website",
    locale: "en_US",
    siteName: "LALAN HFT Quant Engine",
  },
  twitter: {
    card: "summary_large_image",
    title: "LALAN HFT - Institutional Microstructure Engine",
    description: "Sub-millisecond real-time market microstructure analysis and LMAX Disruptor order book forecasting.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Enterprise SoftwareApplication & FinancialProduct Schema JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "LALAN HFT Quant Engine",
    "operatingSystem": "Web, All Platforms",
    "applicationCategory": "FinanceApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
    },
    "description": "Sub-millisecond lock-free market microstructure and Level-2 Order Book Imbalance engine for option traders.",
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            <SubscriptionProvider>
              <NavigationProgressLoader />
              {children}
              <AuthModal />
            </SubscriptionProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
