"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightIcon, MessageIcon, PhoneIcon } from "./Icons";

/** Mobile-only bottom bar with the two conversion actions.
 *  Slides in after the user scrolls past the hero. */
export default function StickyCallBar({
  phone,
  phoneRaw,
}: {
  phone: string;
  phoneRaw: string;
}) {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The contact page already IS the conversion point.
  if (pathname === "/contact") return null;

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-ink-800 bg-ink-950/95 px-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 backdrop-blur-md transition-transform duration-300 lg:hidden ${
        show ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="mx-auto flex max-w-md gap-2.5">
        <a
          href={`tel:${phoneRaw}`}
          tabIndex={show ? 0 : -1}
          title={`Call ${phone}`}
          className="press flex flex-[1.2] items-center justify-center gap-2 rounded-xl bg-brand-500 px-3 py-3 text-sm font-bold text-ink-950"
        >
          <PhoneIcon width={16} height={16} strokeWidth={2.5} />
          Call
        </a>
        <a
          href={`sms:${phoneRaw}`}
          tabIndex={show ? 0 : -1}
          className="press flex flex-1 items-center justify-center gap-2 rounded-xl border border-ink-600 px-3 py-3 text-sm font-bold text-white"
        >
          <MessageIcon width={16} height={16} />
          Text us
        </a>
        <Link
          href="/contact"
          tabIndex={show ? 0 : -1}
          className="press flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-ink-600 px-3 py-3 text-sm font-bold text-white"
        >
          Estimate
          <ArrowRightIcon width={14} height={14} />
        </Link>
      </div>
    </div>
  );
}
