import Link from "next/link";
import Image from "next/image";
import type { Service, Testimonial } from "@/lib/content";
import { ArrowRightIcon, PhoneIcon, StarIcon } from "./Icons";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  dark = false,
  center = true,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-brand-500">
        {eyebrow}
      </p>
      <h2
        className={`mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl ${
          dark ? "text-white" : "text-ink-900"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-lg leading-relaxed ${dark ? "text-ink-300" : "text-ink-500"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-300 hover:shadow-xl hover:shadow-ink-900/8"
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-ink-100">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-bold text-ink-900">
          {service.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
          {service.excerpt}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 transition-colors group-hover:text-brand-500">
          Learn more
          <ArrowRightIcon
            width={16}
            height={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </span>
      </div>
    </Link>
  );
}

export function Stars({ rating = 5 }: { rating?: number }) {
  return (
    <div
      role="img"
      className="flex gap-0.5 text-brand-400"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          width={16}
          height={16}
          className={i < rating ? "" : "opacity-25"}
        />
      ))}
    </div>
  );
}

export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-ink-800 bg-ink-900/60 p-6">
      <Stars rating={t.rating} />
      <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-100">
        &ldquo;{t.text}&rdquo;
      </blockquote>
      <figcaption className="mt-5 border-t border-ink-800 pt-4">
        <p className="font-semibold text-white">{t.name}</p>
        <p className="mt-0.5 text-xs text-ink-400">
          {t.location} · {t.service}
        </p>
      </figcaption>
    </figure>
  );
}

export function CtaBanner({
  phone,
  phoneRaw,
  title = "Ready for a door that just works?",
  subtitle = "Free estimates. Same-day service. A warranty we actually honor.",
}: {
  phone: string;
  phoneRaw: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink-950">
      <div
        aria-hidden
        className="absolute -top-32 right-0 size-96 rounded-full bg-brand-500/15 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 left-0 size-96 rounded-full bg-brand-500/10 blur-3xl"
      />
      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
        <p className="mt-4 max-w-xl text-lg text-ink-300">{subtitle}</p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <a
            href={`tel:${phoneRaw}`}
            className="flex items-center justify-center gap-2.5 rounded-xl bg-brand-500 px-8 py-4 text-base font-bold text-ink-950 transition-all hover:bg-brand-400 hover:shadow-xl hover:shadow-brand-500/25"
          >
            <PhoneIcon width={18} height={18} strokeWidth={2.5} />
            Call {phone}
          </a>
          <Link
            href="/contact"
            className="flex items-center justify-center gap-2 rounded-xl border border-ink-700 bg-ink-900/60 px-8 py-4 text-base font-bold text-white transition-all hover:border-ink-500 hover:bg-ink-800"
          >
            Get a Free Estimate
            <ArrowRightIcon width={18} height={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
