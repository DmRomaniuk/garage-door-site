import type { Metadata } from "next";
import QuoteForm from "@/components/QuoteForm";
import GoogleRatingCard from "@/components/GoogleRatingCard";
import OpenNowBadge from "@/components/OpenNowBadge";
import { SectionHeading } from "@/components/ui";
import {
  ClockIcon,
  MailIcon,
  MapPinIcon,
  MessageIcon,
  PhoneIcon,
} from "@/components/Icons";
import { getBusiness } from "@/lib/content";

export const metadata: Metadata = {
  title: "Free Estimate & Contact",
  description:
    "Request a free garage door estimate online or call us directly. Same-day service available across our service area.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const business = getBusiness();

  return (
    <>
      <section className="bg-ink-950 pb-20 pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            dark
            center={false}
            eyebrow="Contact"
            title="Get your free estimate"
            subtitle="Call for the fastest response — or send the form and we'll get back to you, usually within the hour during business hours."
          />
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          <div className="lg:col-span-3">
            <div className="rounded-3xl border border-ink-100 bg-white p-8 shadow-sm sm:p-10">
              <QuoteForm />
            </div>
          </div>

          <aside className="space-y-6 lg:col-span-2">
            <a
              href={`tel:${business.phoneRaw}`}
              className="press flex items-center gap-4 rounded-2xl bg-ink-950 p-6 text-white transition-all hover:bg-ink-900"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-500 text-ink-950">
                <PhoneIcon width={22} height={22} strokeWidth={2.5} />
              </span>
              <span>
                <span className="block text-sm text-ink-300">
                  Fastest — call now
                </span>
                <span className="font-display text-xl font-bold">
                  {business.phone}
                </span>
              </span>
            </a>

            <a
              href={`sms:${business.phoneRaw}`}
              className="press flex items-center gap-4 rounded-2xl border border-ink-100 p-6 transition-all hover:border-ink-300 hover:bg-ink-50"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-ink-100 text-ink-800">
                <MessageIcon width={22} height={22} />
              </span>
              <span>
                <span className="block text-sm text-ink-500">
                  Prefer texting? Send a photo of the problem
                </span>
                <span className="font-display text-lg font-bold text-ink-900">
                  Text {business.phone}
                </span>
              </span>
            </a>

            <div className="rounded-2xl border border-ink-100 p-6">
              <h2 className="flex items-center gap-2.5 font-display font-bold text-ink-900">
                <ClockIcon width={18} height={18} className="text-brand-500" />
                Hours
              </h2>
              <OpenNowBadge
                hours={business.hours}
                emergency247={business.emergency247}
                className="mt-3 text-ink-700"
              />
              <ul className="mt-4 space-y-2.5 text-sm text-ink-600">
                {business.hours.map((h) => (
                  <li key={h.days} className="flex justify-between gap-4">
                    <span>{h.days}</span>
                    <span className="font-semibold text-ink-800">
                      {h.hours}
                    </span>
                  </li>
                ))}
              </ul>
              {business.emergency247 && (
                <p className="mt-4 rounded-lg bg-brand-50 px-3 py-2 text-xs font-bold text-brand-700">
                  Emergencies? We answer 24/7.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-ink-100 p-6">
              <h2 className="flex items-center gap-2.5 font-display font-bold text-ink-900">
                <MapPinIcon width={18} height={18} className="text-brand-500" />
                Service area
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                {business.serviceArea.join(" · ")} — and everywhere within
                about 30 miles of {business.address.city},{" "}
                {business.address.state}.
              </p>
            </div>

            <div className="rounded-2xl border border-ink-100 p-6">
              <h2 className="flex items-center gap-2.5 font-display font-bold text-ink-900">
                <MailIcon width={18} height={18} className="text-brand-500" />
                Email
              </h2>
              <a
                href={`mailto:${business.email}`}
                className="mt-2 block text-sm font-semibold text-brand-600 hover:text-brand-500"
              >
                {business.email}
              </a>
            </div>

            <div className="rounded-2xl bg-ink-950 p-6">
              <p className="mb-4 text-sm font-semibold text-ink-300">
                Not sure about us yet? See what your neighbors say:
              </p>
              <GoogleRatingCard
                rating={business.googleRating}
                reviewCount={business.reviewCount}
                reviewsUrl={business.googleReviewsUrl}
                businessName={business.name}
                city={`${business.address.city}, ${business.address.state}`}
              />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
