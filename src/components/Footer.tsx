import Link from "next/link";
import type { Business } from "@/lib/content";
import { DoorIcon, MailIcon, MapPinIcon, PhoneIcon } from "./Icons";

export default function Footer({ business }: { business: Business }) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink-950 text-ink-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Link href="/" className="flex items-center gap-2.5 text-white">
            <span className="grid size-9 place-items-center rounded-lg bg-brand-500 text-ink-950">
              <DoorIcon width={20} height={20} strokeWidth={2.4} />
            </span>
            <span className="font-display text-lg font-bold">{business.name}</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed">
            {business.tagline}. Serving {business.address.city},{" "}
            {business.address.state} and surrounding communities for over{" "}
            {business.yearsExperience} years.
          </p>
          <p className="mt-4 text-xs text-ink-400">
            Licensed & Insured · {business.warrantyYears}-Year Workmanship
            Warranty
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ["/services", "All Services"],
              ["/gallery", "Our Work"],
              ["/about", "About Us"],
              ["/contact", "Free Estimate"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="transition-colors hover:text-brand-400">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href={`tel:${business.phoneRaw}`}
                className="flex items-center gap-2.5 font-semibold text-brand-400 hover:text-brand-300"
              >
                <PhoneIcon width={16} height={16} /> {business.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${business.email}`}
                className="flex items-center gap-2.5 hover:text-brand-400"
              >
                <MailIcon width={16} height={16} /> {business.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPinIcon width={16} height={16} className="mt-0.5 shrink-0" />
              <span>
                {business.address.street}
                <br />
                {business.address.city}, {business.address.state}{" "}
                {business.address.zip}
              </span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Hours
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {business.hours.map((h) => (
              <li key={h.days} className="flex justify-between gap-4">
                <span>{h.days}</span>
                <span className="text-ink-200">{h.hours}</span>
              </li>
            ))}
          </ul>
          {business.emergency247 && (
            <p className="mt-4 rounded-lg bg-ink-900 px-3 py-2 text-xs font-semibold text-brand-400">
              24/7 Emergency Service Available
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-ink-900">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-ink-400 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {year} {business.legalName}. All rights reserved.
          </p>
          <p>
            Serving {business.serviceArea.slice(0, 4).join(", ")} &amp; nearby
            areas
          </p>
        </div>
      </div>
    </footer>
  );
}
