"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, PhoneIcon, XIcon, DoorIcon } from "./Icons";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Our Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header({
  businessName,
  phone,
  phoneRaw,
}: {
  businessName: string;
  phone: string;
  phoneRaw: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "bg-ink-950/95 backdrop-blur-md shadow-lg shadow-ink-950/30"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 text-white">
          <span className="grid size-9 place-items-center rounded-lg bg-brand-500 text-ink-950">
            <DoorIcon width={20} height={20} strokeWidth={2.4} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            {businessName}
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-semibold transition-colors ${
                pathname.startsWith(item.href)
                  ? "text-brand-400"
                  : "text-ink-100 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={`tel:${phoneRaw}`}
            className="group flex items-center gap-2 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-bold text-ink-950 transition-all hover:bg-brand-400 hover:shadow-lg hover:shadow-brand-500/25"
          >
            <PhoneIcon width={16} height={16} strokeWidth={2.5} />
            {phone}
          </a>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="grid size-10 place-items-center rounded-lg text-white lg:hidden"
        >
          {open ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-800 bg-ink-950/95 backdrop-blur-md lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-semibold text-ink-100 hover:bg-ink-900 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
            <a
              href={`tel:${phoneRaw}`}
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-brand-500 px-4 py-3.5 text-base font-bold text-ink-950"
            >
              <PhoneIcon width={18} height={18} strokeWidth={2.5} />
              Call {phone}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
