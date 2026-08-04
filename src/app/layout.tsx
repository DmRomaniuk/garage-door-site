import type { Metadata } from "next";
import "./globals.css";
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
    <html lang="en">
      <body>
        <LocalBusinessJsonLd />
        <Header
          businessName={business.name}
          phone={business.phone}
          phoneRaw={business.phoneRaw}
        />
        <main>{children}</main>
        <Footer business={business} />
      </body>
    </html>
  );
}
