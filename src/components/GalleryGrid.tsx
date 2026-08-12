"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { GalleryItem } from "@/lib/content";
import BeforeAfter from "./BeforeAfter";
import { XIcon } from "./Icons";

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.category)))],
    [items]
  );
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered =
    active === "All" ? items : items.filter((i) => i.category === active);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setLightbox((cur) =>
        cur === null ? cur : (cur + dir + filtered.length) % filtered.length
      ),
    [filtered.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, step]);

  const current = lightbox === null ? null : filtered[lightbox];

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              setActive(c);
              setLightbox(null);
            }}
            className={`press rounded-full px-5 py-2 text-sm font-bold transition-all ${
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
        {filtered.map((item, i) => (
          <figure
            key={item.title}
            className="group overflow-hidden rounded-2xl border border-ink-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-ink-900/8"
          >
            {item.beforeImage ? (
              <BeforeAfter
                before={item.beforeImage}
                after={item.image}
                alt={item.title}
              />
            ) : (
              <button
                type="button"
                onClick={() => setLightbox(i)}
                aria-label={`View ${item.title} full size`}
                className="relative block aspect-[3/2] w-full cursor-zoom-in overflow-hidden bg-ink-100"
              >
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
                <span className="absolute inset-0 grid place-items-center bg-ink-950/0 transition-colors duration-300 group-hover:bg-ink-950/25">
                  <span className="scale-75 rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-ink-900 opacity-0 shadow-lg transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                    View photo
                  </span>
                </span>
              </button>
            )}
            <figcaption className="p-5">
              <p className="font-display font-bold text-ink-900">{item.title}</p>
              <p className="mt-1 text-sm text-ink-500">{item.description}</p>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* ── Lightbox ── */}
      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.title}
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-ink-950/95 p-4 backdrop-blur-sm sm:p-8"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="press absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-ink-800/80 text-white transition-colors hover:bg-ink-700"
          >
            <XIcon width={20} height={20} />
          </button>

          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-ink-900 shadow-2xl">
              <Image
                key={current.image}
                src={current.image}
                alt={current.title}
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover"
                priority
              />
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <div>
                <p className="font-display font-bold text-white">
                  {current.title}
                </p>
                <p className="mt-0.5 text-sm text-ink-300">
                  {current.description}
                </p>
              </div>
              {filtered.length > 1 && (
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    aria-label="Previous photo"
                    className="press grid size-11 place-items-center rounded-full bg-ink-800/80 text-white transition-colors hover:bg-ink-700"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    aria-label="Next photo"
                    className="press grid size-11 place-items-center rounded-full bg-ink-800/80 text-white transition-colors hover:bg-ink-700"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
