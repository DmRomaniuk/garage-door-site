"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/content";

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="divide-y divide-ink-100 rounded-2xl border border-ink-100 bg-white">
      {items.map((item, i) => {
        const open = openIdx === i;
        return (
          <div key={item.question}>
            <button
              type="button"
              onClick={() => setOpenIdx(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="font-display text-base font-bold text-ink-900">
                {item.question}
              </span>
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full border text-lg font-semibold transition-all ${
                  open
                    ? "rotate-45 border-brand-500 bg-brand-500 text-ink-950"
                    : "border-ink-200 text-ink-400"
                }`}
                aria-hidden
              >
                +
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ${
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-6 text-[15px] leading-relaxed text-ink-500">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
