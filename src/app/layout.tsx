import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../contexts/CartContext";
import ToastProvider from "../contexts/ToastContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartLock Store - Innovatieve Slottechnologie | Fietsslot & Kabelslot",
  description: "Ontdek onze revolutionaire smartlocks met smartphone bediening. Fietssloten en kabelsloten met alarm en GPS-tracking. Gratis verzending binnen Nederland.",
  keywords: "smartlock, fietsslot, kabelslot, smartphone slot, alarm, GPS tracking, veiligheid, Nederland, slim slot",
  authors: [{ name: "SmartLock Store" }],
  creator: "SmartLock Store",
  publisher: "SmartLock Store",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://smartlockstore.nl"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://smartlockstore.nl",
    title: "SmartLock Store - Innovatieve Slottechnologie",
    description: "Ontdek onze revolutionaire smartlocks met smartphone bediening. Fietssloten en kabelsloten met alarm en GPS-tracking.",
    siteName: "SmartLock Store",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SmartLock Store - Innovatieve Slottechnologie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartLock Store - Innovatieve Slottechnologie",
    description: "Ontdek onze revolutionaire smartlocks met smartphone bediening. Fietssloten en kabelsloten met alarm en GPS-tracking.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SmartLock Store" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-tap-highlight" content="no" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "SmartLock Store",
              "alternateName": "SmartLock Store Nederland",
              "url": "https://smartlockstore.nl",
              "description": "Ontdek onze revolutionaire smartlocks met smartphone bediening. Fietssloten en kabelsloten met alarm en GPS-tracking.",
              "publisher": {
                "@type": "Organization",
                "name": "SmartLock Store",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://smartlockstore.nl/logo.png"
                }
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://smartlockstore.nl/producten?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              "name": "SmartLock Store",
              "image": "https://smartlockstore.nl/logo.png",
              "description": "Specialist in innovatieve slottechnologie met smartphone bediening",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "NL",
                "addressLocality": "Nederland"
              },
              "url": "https://smartlockstore.nl",
              "telephone": "+31-6-12345678",
              "email": "info@smartlockstore.nl",
              "openingHours": "Mo-Fr 09:00-18:00",
              "paymentAccepted": "Cash, Credit Card, Bank Transfer",
              "currenciesAccepted": "EUR"
            })
          }}
        />
      </head>
      <body className={inter.className}>
        <CartProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
