import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import FaqAccordion from "@/components/FaqAccordion";
import {
  CtaBanner,
  SectionHeading,
  ServiceCard,
  TestimonialCard,
} from "@/components/ui";
import {
  ArrowRightIcon,
  CheckIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/Icons";
import {
  getBusiness,
  getFaq,
  getSeo,
  getServices,
  getTestimonials,
} from "@/lib/content";
import { citySlug } from "@/lib/slug";

type Props = { params: Promise<{ city: string }> };

const findCity = (slug: string) =>
  getBusiness().serviceArea.find((c) => citySlug(c) === slug);

export function generateStaticParams() {
  return getBusiness().serviceArea.map((c) => ({ city: citySlug(c) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params;
  const city = findCity(slug);
  if (!city) return {};
  const business = getBusiness();
  const state = business.address.state;
  return {
    title: `Garage Door Installation & Repair in ${city}, ${state}`,
    description: `Garage door installation, repair, springs and openers in ${city}, ${state}. Same-day service, free estimates, licensed & insured. Call ${business.phone}.`,
    alternates: { canonical: `/areas/${slug}` },
  };
}

export default async function CityPage({ params }: Props) {
  const { city: slug } = await params;
  const city = findCity(slug);
  if (!city) notFound();

  const business = getBusiness();
  const seo = getSeo();
  const state = business.address.state;
  const services = getServices();
  const faq = getFaq().slice(0, 4);
  const localTestimonials = getTestimonials().filter((t) =>
    t.location.toLowerCase().includes(city.toLowerCase())
  );
  const otherCities = business.serviceArea.filter((c) => c !== city);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Garage door installation & repair in ${city}, ${state}`,
    serviceType: "Garage door installation and repair",
    areaServed: { "@type": "City", name: city },
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: business.name,
      telephone: business.phoneRaw,
      url: seo.siteUrl,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: seo.siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: `${city}, ${state}`,
        item: `${seo.siteUrl}/areas/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([jsonLd, breadcrumbJsonLd]),
        }}
      />

      <section className="bg-ink-950 pb-20 pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-900/70 px-4 py-1.5 text-sm font-semibold text-ink-200">
            <MapPinIcon width={14} height={14} className="text-brand-400" />
            Serving {city} and all of the {business.address.city} area
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Garage door installation &amp; repair in{" "}
            <span className="text-brand-400">
              {city}, {state}
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-300">
            Broken spring, a door off its track, or time for a new look? Our
            technicians are in and around {city} every week — with same-day
            service, upfront written pricing and a {business.warrantyYears}
            -year workmanship warranty.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href={`tel:${business.phoneRaw}`}
              className="flex items-center justify-center gap-2.5 rounded-xl bg-brand-500 px-7 py-3.5 font-bold text-ink-950 transition-all hover:bg-brand-400"
            >
              <PhoneIcon width={18} height={18} strokeWidth={2.5} />
              Call {business.phone}
            </a>
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 rounded-xl border border-ink-700 px-7 py-3.5 font-bold text-white transition-all hover:bg-ink-900"
            >
              Get a Free Estimate
              <ArrowRightIcon width={18} height={18} />
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-300">
            {[
              "Same-day service",
              "Licensed & insured",
              `${business.warrantyYears}-year warranty`,
              "Free estimates",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <CheckIcon
                  width={14}
                  height={14}
                  strokeWidth={3}
                  className="text-brand-400"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow={`Services in ${city}`}
              title={`What we do in ${city}`}
              subtitle="Every service below is available with same-day scheduling in most cases."
            />
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={(i % 3) * 80} className="h-full">
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {localTestimonials.length > 0 && (
        <section className="bg-ink-950 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <SectionHeading
                dark
                eyebrow="Local reviews"
                title={`What your ${city} neighbors say`}
              />
            </Reveal>
            <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
              {localTestimonials.map((t) => (
                <Reveal key={t.name} className="h-full">
                  <TestimonialCard t={t} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-ink-100 bg-ink-50/60 py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <h2 className="font-display text-2xl font-bold text-ink-900">
              Common questions
            </h2>
            <div className="mt-6">
              <FaqAccordion items={faq} />
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-display text-2xl font-bold text-ink-900">
              Nearby areas we also serve
            </h2>
            <ul className="mt-6 grid grid-cols-2 gap-3">
              {otherCities.map((c) => (
                <li key={c}>
                  <Link
                    href={`/areas/${citySlug(c)}`}
                    className="flex items-center gap-2 text-[15px] font-semibold text-ink-700 transition-colors hover:text-brand-600"
                  >
                    <MapPinIcon
                      width={15}
                      height={15}
                      className="text-brand-500"
                    />
                    {c}, {state}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-ink-500">
              Don&apos;t see your town? If you&apos;re within about 30 miles of{" "}
              {business.address.city}, give us a call — we can almost always
              make it work.
            </p>
          </Reveal>
        </div>
      </section>

      <CtaBanner
        phone={business.phone}
        phoneRaw={business.phoneRaw}
        title={`Need a garage door pro in ${city}?`}
        subtitle="Call now for same-day service or request your free written estimate."
      />
    </>
  );
}
