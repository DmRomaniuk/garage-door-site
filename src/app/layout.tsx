import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const manrope = localFont({
  src: "../fonts/manrope-latin-wght-normal.woff2",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
});

const spaceGrotesk = localFont({
  src: "../fonts/space-grotesk-latin-wght-normal.woff2",
  variable: "--font-space-grotesk",
  weight: "300 700",
  display: "swap",
});
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getBusiness, getSeo } from "@/lib/content";

const business = getBusiness();
const seo = getSeo();

export const metadata: Metadata = {
  metadataBase: new URL(seo.siteUrl),
  title: {
    default: seo.defaultTitle,
    template: `%s | ${business.name}`,
  },
  description: seo.defaultDescription,
  keywords: seo.keywords,
  openGraph: {
    type: "website",
    siteName: business.name,
    title: seo.defaultTitle,
    description: seo.defaultDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0f16",
  width: "device-width",
  initialScale: 1,
};

function LocalBusinessJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    name: business.name,
    legalName: business.legalName,
    description: seo.defaultDescription,
    url: seo.siteUrl,
    telephone: business.phoneRaw,
    email: business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      addressRegion: business.address.state,
      postalCode: business.address.zip,
      addressCountry: "US",
    },
    areaServed: business.serviceArea.map((city) => ({
      "@type": "City",
      name: city,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: business.googleRating,
      reviewCount: business.reviewCount,
    },
    openingHours: ["Mo-Fr 07:00-19:00", "Sa 08:00-17:00"],
    priceRange: "$$",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${manrope.variable} ${spaceGrotesk.variable}`}>
      <body>
        <LocalBusinessJsonLd />
        <a
          href="#main"
          className="sr-only z-[60] rounded-lg bg-brand-500 px-4 py-2 font-bold text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Header
          businessName={business.name}
          phone={business.phone}
          phoneRaw={business.phoneRaw}
        />
        <main id="main">{children}</main>
        <Footer business={business} />
      </body>
    </html>
  );
}
