import { ImageResponse } from "next/og";
import { getBusiness, getSeo } from "@/lib/content";

export const alt = "Garage door installation & repair";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  const business = getBusiness();
  const seo = getSeo();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0a0f16 0%, #1e2936 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 14,
              background: "#f97f0b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
            }}
          >
            🚪
          </div>
          <div style={{ fontSize: 40, fontWeight: 700 }}>{business.name}</div>
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.1,
            maxWidth: 900,
          }}
        >
          Garage doors installed &amp; repaired the right way.
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#a3b2c2", marginTop: 32 }}>
          {`${business.address.city}, ${business.address.state} · ${business.phone} · ${seo.siteUrl.replace(/^https?:\/\//, "")}`}
        </div>
      </div>
    ),
    size
  );
}
