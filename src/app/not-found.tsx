import Link from "next/link";
import { getBusiness } from "@/lib/content";
import { PhoneIcon } from "@/components/Icons";

export default function NotFound() {
  const business = getBusiness();
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center bg-ink-950 px-4 pt-18 text-center">
      <p className="font-display text-7xl font-bold text-brand-500">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold text-white">
        This page rolled off its track
      </h1>
      <p className="mt-3 max-w-md text-ink-300">
        The page you&apos;re looking for doesn&apos;t exist — but unlike a
        broken spring, this one&apos;s an easy fix.
      </p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <Link
          href="/"
          className="rounded-xl bg-brand-500 px-7 py-3.5 font-bold text-ink-950 transition-all hover:bg-brand-400"
        >
          Back to homepage
        </Link>
        <a
          href={`tel:${business.phoneRaw}`}
          className="flex items-center justify-center gap-2 rounded-xl border border-ink-700 px-7 py-3.5 font-bold text-white transition-all hover:bg-ink-900"
        >
          <PhoneIcon width={16} height={16} />
          {business.phone}
        </a>
      </div>
    </section>
  );
}
