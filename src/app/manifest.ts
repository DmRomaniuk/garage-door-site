import type { MetadataRoute } from "next";
import { getBusiness, getSeo } from "@/lib/content";

export default function manifest(): MetadataRoute.Manifest {
  const business = getBusiness();
  const seo = getSeo();
  return {
    name: business.name,
    short_name: business.name,
    description: seo.defaultDescription,
    start_url: "/",
    display: "browser",
    background_color: "#0a0f16",
    theme_color: "#0a0f16",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
