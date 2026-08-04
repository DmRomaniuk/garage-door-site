import type { MetadataRoute } from "next";
import { getSeo } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  const base = getSeo().siteUrl.replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
