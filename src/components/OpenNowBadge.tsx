"use client";

import { useEffect, useState } from "react";

interface HoursRow {
  days: string;
  hours: string;
}

const DAY_NAMES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

/** "7:00 AM" → minutes since midnight, or null. */
function parseTime(s: string): number | null {
  const m = s.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10) % 12;
  if (/pm/i.test(m[3])) h += 12;
  return h * 60 + (m[2] ? parseInt(m[2], 10) : 0);
}

/** "Monday – Friday" / "Saturday" → set of day indexes (0=Sun). */
function parseDays(s: string): number[] {
  const norm = s.toLowerCase().replace(/[–—]/g, "-");
  const range = norm.match(/([a-z]+)\s*-\s*([a-z]+)/);
  const idx = (name: string) =>
    DAY_NAMES.findIndex((d) => d.startsWith(name.slice(0, 3)));
  if (range) {
    const a = idx(range[1]);
    const b = idx(range[2]);
    if (a < 0 || b < 0) return [];
    const days: number[] = [];
    for (let i = a; ; i = (i + 1) % 7) {
      days.push(i);
      if (i === b) break;
    }
    return days;
  }
  const single = idx(norm.trim());
  return single >= 0 ? [single] : [];
}

function computeState(rows: HoursRow[], now: Date) {
  const day = now.getDay();
  const minutes = now.getHours() * 60 + now.getMinutes();
  for (const row of rows) {
    if (!parseDays(row.days).includes(day)) continue;
    const times = row.hours.replace(/[–—]/g, "-").split("-");
    if (times.length !== 2) continue;
    const open = parseTime(times[0]);
    const close = parseTime(times[1]);
    if (open === null || close === null) continue;
    if (minutes >= open && minutes < close) {
      const h = Math.floor(close / 60) % 12 || 12;
      const mm = String(close % 60).padStart(2, "0");
      const ampm = close >= 720 ? "PM" : "AM";
      return { open: true, label: `Open now · closes ${h}:${mm} ${ampm}` };
    }
  }
  return { open: false, label: "" };
}

/** Live "Open now" indicator computed from the business hours in settings.
 *  Uses the visitor's clock — fine for a local-service audience. */
export default function OpenNowBadge({
  hours,
  emergency247,
  className = "",
}: {
  hours: HoursRow[];
  emergency247: boolean;
  className?: string;
}) {
  const [state, setState] = useState<{ open: boolean; label: string } | null>(
    null
  );

  useEffect(() => {
    const update = () => setState(computeState(hours, new Date()));
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [hours]);

  // Render nothing on the server / first paint to avoid hydration mismatch.
  if (!state) return <span className={className} />;

  const open = state.open;
  const label = open
    ? state.label
    : emergency247
      ? "Closed · 24/7 emergency line available"
      : "Currently closed";

  return (
    <span
      className={`inline-flex items-center gap-2 text-sm font-semibold ${className}`}
    >
      <span className="relative flex size-2.5">
        {open && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        )}
        <span
          className={`relative inline-flex size-2.5 rounded-full ${
            open ? "bg-emerald-400" : "bg-brand-400"
          }`}
        />
      </span>
      {label}
    </span>
  );
}
