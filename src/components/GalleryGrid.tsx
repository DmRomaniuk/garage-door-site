"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/content";

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.category)))],
    [items]
  );
  const [active, setActive] = useState("All");
  const filtered =
    active === "All" ? items : items.filter((i) => i.category === active);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(c)}
            className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${
              active === c
                ? "bg-ink-950 text-white shadow-md"
                : "bg-ink-50 text-ink-500 hover:bg-ink-100 hover:text-ink-800"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <figure
            key={item.title}
            className="group overflow-hidden rounded-2xl border border-ink-100 bg-white"
          >
            <div className="relative aspect-[3/2] overflow-hidden bg-ink-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-3 top-3 rounded-full bg-ink-950/80 px-3 py-1 text-xs font-bold text-white backdrop-blur">
                {item.category}
              </span>
            </div>
            <figcaption className="p-5">
              <p className="font-display font-bold text-ink-900">{item.title}</p>
              <p className="mt-1 text-sm text-ink-500">{item.description}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
