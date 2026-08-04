import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid";
import { CtaBanner, SectionHeading } from "@/components/ui";
import { getBusiness, getGallery } from "@/lib/content";

export const metadata: Metadata = {
  title: "Our Work — Garage Door Gallery",
  description:
    "Recent garage door installations, repairs and opener upgrades. See the quality of our work before you call.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  const items = getGallery();
  const business = getBusiness();

  return (
    <>
      <section className="bg-ink-950 pb-20 pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            dark
            center={false}
            eyebrow="Gallery"
            title="Our recent work"
            subtitle="Real doors, real driveways, real neighbors. Every job photographed with the homeowner's permission."
          />
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <GalleryGrid items={items} />
        </div>
      </section>

      <CtaBanner
        phone={business.phone}
        phoneRaw={business.phoneRaw}
        title="Want your door in this gallery?"
        subtitle="Get a free estimate and see what your garage could look like."
      />
    </>
  );
}
