"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";

/** Draggable before/after comparison slider. */
export default function BeforeAfter({
  before,
  after,
  alt,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: {
  before: string;
  after: string;
  alt: string;
  sizes?: string;
}) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const update = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(4, Math.min(96, p)));
  }, []);

  return (
    <div
      ref={ref}
      className="relative aspect-[3/2] w-full touch-pan-y select-none overflow-hidden bg-ink-100"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).closest("div")?.setPointerCapture?.(e.pointerId);
        update(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      {/* After (full) */}
      <Image src={after} alt={`${alt} — after`} fill sizes={sizes} className="object-cover" />
      {/* Before (clipped) */}
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
      >
        <Image src={before} alt={`${alt} — before`} fill sizes={sizes} className="object-cover" />
      </div>

      {/* Divider + handle */}
      <div
        className="absolute inset-y-0 z-10 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)]"
        style={{ left: `${pos}%` }}
      >
        <div className="absolute left-1/2 top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-white text-ink-900 shadow-lg">
          <span className="text-xs font-bold tracking-tight">⇔</span>
        </div>
      </div>

      {/* Range input for keyboard & screen-reader access */}
      <input
        type="range"
        min={4}
        max={96}
        value={Math.round(pos)}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`${alt} — compare before and after`}
        className="pointer-events-none absolute inset-0 z-20 h-full w-full opacity-0"
      />

      <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-ink-950/80 px-3 py-1 text-xs font-bold text-white backdrop-blur">
        Before
      </span>
      <span className="pointer-events-none absolute right-3 top-3 z-10 rounded-full bg-brand-500/90 px-3 py-1 text-xs font-bold text-ink-950 backdrop-blur">
        After
      </span>
    </div>
  );
}
