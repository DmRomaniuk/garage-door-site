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
  async rewrites() {
    // The CMS lives at public/admin/index.html; make /admin (and /admin/)
    // resolve to it — without this, /admin is a 404 on Vercel.
    return [{ source: "/admin", destination: "/admin/index.html" }];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
