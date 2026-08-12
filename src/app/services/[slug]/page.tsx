import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { CtaBanner, ServiceCard } from "@/components/ui";
import { ArrowRightIcon, CheckIcon, PhoneIcon } from "@/components/Icons";
import { getBusiness, getSeo, getService, getServices } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getServices().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  const business = getBusiness();
  return {
    title: `${service.title} in ${business.address.city}, ${business.address.state}`,
    description: service.excerpt,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: {
      title: `${service.title} | ${business.name}`,
      description: service.excerpt,
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const business = getBusiness();
  const others = getServices()
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3);

  const seo = getSeo();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.excerpt,
    provider: {
      "@type": "HomeAndConstructionBusiness",
      name: business.name,
      telephone: business.phoneRaw,
    },
    areaServed: business.serviceArea.map((c) => ({ "@type": "City", name: c })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: seo.siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: `${seo.siteUrl}/services`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: service.title,
        item: `${seo.siteUrl}/services/${service.slug}`,
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
          <nav className="text-sm text-ink-400" aria-label="Breadcrumb">
            <Link href="/services" className="hover:text-brand-400">
              Services
            </Link>{" "}
            / <span className="text-ink-200">{service.title}</span>
          </nav>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {service.title} in {business.address.city},{" "}
            {business.address.state}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-300">
            {service.excerpt}
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
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          <div className="lg:col-span-3">
            <Reveal>
              <div className="relative aspect-[3/2] overflow-hidden rounded-3xl bg-ink-100">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  priority
                />
              </div>
            </Reveal>
            <Reveal>
              <div className="mt-10 space-y-5 text-[17px] leading-relaxed text-ink-600">
                {service.description.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </Reveal>
          </div>

          <aside className="lg:col-span-2">
            <Reveal delay={100}>
              <div className="rounded-3xl border border-ink-100 bg-ink-50/60 p-8">
                <h2 className="font-display text-xl font-bold text-ink-900">
                  What&apos;s included
                </h2>
                <ul className="mt-5 space-y-3.5">
                  {service.features.map((f) => (
                    <li key={f} className="flex gap-3 text-[15px] text-ink-700">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-brand-500 text-ink-950">
                        <CheckIcon width={12} height={12} strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href={`tel:${business.phoneRaw}`}
                  className="mt-8 flex items-center justify-center gap-2.5 rounded-xl bg-ink-950 px-6 py-3.5 font-bold text-white transition-all hover:bg-ink-800"
                >
                  <PhoneIcon width={16} height={16} strokeWidth={2.5} />
                  {business.phone}
                </a>
                <p className="mt-3 text-center text-xs text-ink-400">
                  Free estimates · Licensed &amp; insured ·{" "}
                  {business.warrantyYears}-yr warranty
                </p>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      <section className="border-t border-ink-100 bg-ink-50/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-bold text-ink-900">
            Other services
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </div>
      </section>

      <CtaBanner phone={business.phone} phoneRaw={business.phoneRaw} />
    </>
  );
}
