import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Placeholder artwork ships as SVG; safe to serve since we control it.
    // When you replace placeholders with real photos (jpg/png/webp),
    // Next.js will optimize them automatically.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
