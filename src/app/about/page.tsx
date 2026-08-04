import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { CtaBanner, SectionHeading } from "@/components/ui";
import { AwardIcon, CheckIcon } from "@/components/Icons";
import { getAbout, getBusiness } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "A family-owned garage door company serving our community for over 15 years. Meet the team behind the doors.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const about = getAbout();
  const business = getBusiness();

  return (
    <>
      <section className="bg-ink-950 pb-20 pt-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            dark
            center={false}
            eyebrow="About us"
            title={about.heading}
          />
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl items-start gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <div className="space-y-5 text-[17px] leading-relaxed text-ink-600">
              {about.story.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="mt-10 rounded-2xl border border-ink-100 bg-ink-50/60 p-7">
              <h2 className="flex items-center gap-2.5 font-display text-lg font-bold text-ink-900">
                <AwardIcon width={20} height={20} className="text-brand-500" />
                Credentials
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {about.certifications.map((c) => (
                  <li key={c} className="flex gap-2.5 text-[15px] text-ink-700">
                    <CheckIcon
                      width={16}
                      height={16}
                      strokeWidth={3}
                      className="mt-0.5 shrink-0 text-brand-500"
                    />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-ink-100">
              <Image
                src="/images/hero.svg"
                alt={`${business.name} — our work`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {about.values.map((v) => (
                <div
                  key={v.title}
                  className="rounded-2xl border border-ink-100 p-5"
                >
                  <h3 className="font-display font-bold text-ink-900">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">
                    {v.text}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBanner phone={business.phone} phoneRaw={business.phoneRaw} />
    </>
  );
}
