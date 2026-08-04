import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import FaqAccordion from "@/components/FaqAccordion";
import {
  CtaBanner,
  SectionHeading,
  ServiceCard,
  Stars,
  TestimonialCard,
} from "@/components/ui";
import {
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldIcon,
  ZapIcon,
} from "@/components/Icons";
import {
  getBusiness,
  getFaq,
  getFeaturedServices,
  getGallery,
  getTestimonials,
} from "@/lib/content";

export default function HomePage() {
  const business = getBusiness();
  const services = getFeaturedServices();
  const testimonials = getTestimonials();
  const faq = getFaq();
  const gallery = getGallery().slice(0, 3);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-ink-950 pt-18">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.svg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25 sm:opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/80 via-ink-950/60 to-ink-950" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 sm:pt-24 lg:px-8">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-ink-700 bg-ink-900/70 px-4 py-1.5 text-sm font-semibold text-ink-200 backdrop-blur">
              <span className="size-2 rounded-full bg-brand-400" />
              Serving {business.address.city}, {business.address.state} &amp;
              surrounding areas
            </p>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-6xl">
              Garage doors installed &amp; repaired{" "}
              <span className="text-brand-400">the right way.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-200">
              Family-owned, licensed &amp; insured. Same-day repairs, honest
              written quotes, and a {business.warrantyYears}-year workmanship
              warranty on every installation.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <a
                href={`tel:${business.phoneRaw}`}
                className="flex items-center justify-center gap-2.5 rounded-xl bg-brand-500 px-8 py-4 text-base font-bold text-ink-950 transition-all hover:bg-brand-400 hover:shadow-xl hover:shadow-brand-500/30"
              >
                <PhoneIcon width={18} height={18} strokeWidth={2.5} />
                Call {business.phone}
              </a>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 rounded-xl border border-ink-600 bg-ink-900/60 px-8 py-4 text-base font-bold text-white backdrop-blur transition-all hover:border-ink-400 hover:bg-ink-800"
              >
                Free Estimate
                <ArrowRightIcon width={18} height={18} />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-300">
              <span className="flex items-center gap-2">
                <Stars rating={5} />
                <strong className="text-white">{business.googleRating}</strong>
                ({business.reviewCount}+ reviews)
              </span>
              <span className="flex items-center gap-2">
                <ShieldIcon width={16} height={16} className="text-brand-400" />
                Licensed &amp; Insured
              </span>
              <span className="flex items-center gap-2">
                <ClockIcon width={16} height={16} className="text-brand-400" />
                24/7 Emergency Service
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS BAR ============ */}
      <section className="border-b border-ink-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 lg:grid-cols-4 lg:divide-x lg:divide-ink-100 lg:px-8">
          {[
            [`${business.yearsExperience}+`, "Years in business"],
            [`${business.doorsInstalled.toLocaleString()}+`, "Doors installed"],
            [`${business.googleRating}★`, "Average rating"],
            [`${business.warrantyYears}-yr`, "Workmanship warranty"],
          ].map(([num, label]) => (
            <div key={label} className="px-4 py-8 text-center">
              <p className="font-display text-3xl font-bold text-ink-900 sm:text-4xl">
                {num}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink-500 sm:text-sm">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="bg-ink-50/60 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="What we do"
              title="Every garage door problem, solved"
              subtitle="From brand-new installations to emergency spring replacements — one call covers it all."
            />
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={i * 80} className="h-full">
                <ServiceCard service={service} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-bold text-brand-600 hover:text-brand-500"
            >
              View all services
              <ArrowRightIcon width={18} height={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ WHY US ============ */}
      <section className="py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                <Image
                  src="/images/service-installation.svg"
                  alt="Professional garage door installation"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-4 rounded-2xl bg-ink-950 p-5 text-white shadow-2xl sm:-right-6">
                <p className="font-display text-3xl font-bold text-brand-400">
                  {business.yearsExperience}+
                </p>
                <p className="mt-0.5 text-sm text-ink-300">
                  years of doors
                  <br />
                  done right
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <SectionHeading
              center={false}
              eyebrow="Why homeowners choose us"
              title="Big-company capability. Small-company accountability."
            />
            <ul className="mt-8 space-y-5">
              {[
                {
                  icon: ShieldIcon,
                  title: "Honest, written quotes",
                  text: "The price we quote is the price you pay. No surprise fees, no pressure upsells — and we'll tell you when a cheap fix beats a replacement.",
                },
                {
                  icon: ZapIcon,
                  title: "Same-day service",
                  text: "Fully stocked trucks mean most repairs are finished the same day you call — including springs, cables and openers.",
                },
                {
                  icon: CheckIcon,
                  title: `${business.warrantyYears}-year workmanship warranty`,
                  text: "Every installation is backed by a decade-long warranty from a local company that answers its own phone.",
                },
                {
                  icon: MapPinIcon,
                  title: "Local & family-owned",
                  text: `We live where we work. Your neighbors in ${business.serviceArea.slice(0, 3).join(", ")} are our customers — and our references.`,
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-500/12 text-brand-600">
                    <item.icon width={20} height={20} />
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-ink-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-[15px] leading-relaxed text-ink-500">
                      {item.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section className="bg-ink-950 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              dark
              eyebrow="How it works"
              title="From first call to finished door"
              subtitle="A simple, transparent process — most jobs are done within days of your first call."
            />
          </Reveal>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Call or request online", "Tell us what's going on — stuck door, new build, or just time for an upgrade."],
              ["Free on-site estimate", "We measure, inspect and hand you a written, itemized quote. No obligation."],
              ["We do the work", "On time, tidy, and safety-tested. Old doors and parts hauled away free."],
              ["Backed for years", `You get our ${business.warrantyYears}-year workmanship warranty and a real local number to call.`],
            ].map(([title, text], i) => (
              <Reveal key={title} delay={i * 100} className="h-full">
                <div className="relative h-full rounded-2xl border border-ink-800 bg-ink-900/50 p-6">
                  <span className="font-display text-5xl font-bold text-ink-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-white">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-300">
                    {text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ RECENT WORK ============ */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              eyebrow="Recent work"
              title="Doors we're proud of"
              subtitle="A few recent installations and repairs from around the area."
            />
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <figure className="group overflow-hidden rounded-2xl border border-ink-100">
                  <div className="relative aspect-[3/2] overflow-hidden bg-ink-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <figcaption className="p-5">
                    <p className="font-display font-bold text-ink-900">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-ink-500">
                      {item.description}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 font-bold text-brand-600 hover:text-brand-500"
            >
              See the full gallery
              <ArrowRightIcon width={18} height={18} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="bg-ink-950 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <SectionHeading
              dark
              eyebrow="Reviews"
              title={`Rated ${business.googleRating} by ${business.reviewCount}+ neighbors`}
              subtitle="We don't ask for reviews — we earn them."
            />
          </Reveal>
          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((t, i) => (
              <Reveal key={t.name} delay={i * 80} className="h-full">
                <TestimonialCard t={t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SERVICE AREA ============ */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <SectionHeading
                center={false}
                eyebrow="Service area"
                title={`Proudly serving ${business.address.city} & beyond`}
                subtitle="If you're within about 30 miles, we've got you covered — and yes, we confirm arrival windows by text."
              />
              <ul className="mt-8 grid grid-cols-2 gap-3">
                {business.serviceArea.map((city) => (
                  <li
                    key={city}
                    className="flex items-center gap-2.5 text-[15px] font-semibold text-ink-700"
                  >
                    <MapPinIcon width={16} height={16} className="text-brand-500" />
                    {city}, {business.address.state}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={100}>
              <div className="rounded-3xl border border-ink-100 bg-ink-50/60 p-8 sm:p-10">
                <h3 className="font-display text-2xl font-bold text-ink-900">
                  Frequently asked questions
                </h3>
                <div className="mt-6">
                  <FaqAccordion items={faq.slice(0, 4)} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBanner phone={business.phone} phoneRaw={business.phoneRaw} />
    </>
  );
}
