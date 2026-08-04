import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { CtaBanner, SectionHeading, ServiceCard } from "@/components/ui";
import { getBusiness, getServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Garage Door Services",
  description:
    "Garage door installation, repair, spring replacement, opener installation and 24/7 emergency service. Licensed & insured, free estimates.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  const services = getServices();
  const business = getBusiness();

  return (
    <>
      <section className="bg-ink-950 pb-20 pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            dark
            center={false}
            eyebrow="Services"
            title="Everything your garage door needs"
            subtitle="One local team for installation, repair, springs, openers and maintenance — with upfront pricing on all of it."
          />
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={(i % 3) * 80}>
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        phone={business.phone}
        phoneRaw={business.phoneRaw}
        title="Not sure what your door needs?"
        subtitle="Describe the symptom — we'll diagnose it over the phone for free."
      />
    </>
  );
}
