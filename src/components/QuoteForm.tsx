"use client";

import { useRef, useState, type FormEvent } from "react";

const SERVICES = [
  "New Door Installation",
  "Garage Door Repair",
  "Spring Replacement",
  "Opener Installation / Repair",
  "Maintenance & Tune-Up",
  "Emergency Service",
  "Not sure / Other",
];

const MAX_PHOTOS = 3;

type Status = "idle" | "sending" | "success" | "error";

interface Photo {
  name: string;
  type: string;
  data: string; // base64, no prefix
  preview: string;
}

/** Downscale + compress an image in the browser so uploads stay tiny. */
async function compressImage(file: File): Promise<Photo | null> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1280 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const dataUrl = canvas.toDataURL("image/jpeg", 0.72);
    return {
      name: file.name.replace(/\.[^.]+$/, "") + ".jpg",
      type: "image/jpeg",
      data: dataUrl.split(",")[1],
      preview: dataUrl,
    };
  } catch {
    return null;
  }
}

function SuccessPanel({ onReset }: { onReset: () => void }) {
  const steps = [
    {
      title: "We call you back",
      text: "Usually within the hour during business hours — from a real local number.",
    },
    {
      title: "We schedule a visit",
      text: "Same-day for most repairs. You'll get an arrival window by text.",
    },
    {
      title: "Free written estimate",
      text: "A clear, itemized price on the spot. No obligation, no pressure.",
    },
  ];
  return (
    <div className="rounded-2xl border border-brand-200 bg-brand-50 p-8">
      <div className="flex items-center gap-4">
        <div className="grid size-12 shrink-0 place-items-center rounded-full bg-brand-500 text-xl text-ink-950">
          ✓
        </div>
        <div>
          <h3 className="font-display text-xl font-bold text-ink-900">
            Request received!
          </h3>
          <p className="text-sm text-ink-600">Here&apos;s what happens next:</p>
        </div>
      </div>
      <ol className="mt-6 space-y-5">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-4">
            <span className="grid size-8 shrink-0 place-items-center rounded-full border-2 border-brand-500 font-display text-sm font-bold text-brand-700">
              {i + 1}
            </span>
            <div>
              <p className="font-display font-bold text-ink-900">{s.title}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-ink-600">
                {s.text}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <button
        type="button"
        onClick={onReset}
        className="mt-7 text-sm font-bold text-brand-600 hover:text-brand-500"
      >
        Send another request
      </button>
    </div>
  );
}

export default function QuoteForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);

  async function addPhotos(files: FileList | null) {
    if (!files) return;
    const room = MAX_PHOTOS - photos.length;
    const picked = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, room);
    const compressed = await Promise.all(picked.map(compressImage));
    setPhotos((p) => [...p, ...compressed.filter((c): c is Photo => !!c)]);
    if (fileInput.current) fileInput.current.value = "";
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          photos: photos.map(({ name, type, data }) => ({ name, type, data })),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setStatus("success");
      setPhotos([]);
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return <SuccessPanel onReset={() => setStatus("idle")} />;
  }

  const input =
    "w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-[15px] text-ink-900 placeholder:text-ink-300 outline-none transition-all focus:border-brand-500 focus:ring-4 focus:ring-brand-500/15";

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {/* honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="qf-name" className="mb-1.5 block text-sm font-bold text-ink-800">
            Name *
          </label>
          <input id="qf-name" name="name" required maxLength={100} placeholder="John Smith" className={input} />
        </div>
        <div>
          <label htmlFor="qf-phone" className="mb-1.5 block text-sm font-bold text-ink-800">
            Phone *
          </label>
          <input
            id="qf-phone"
            name="phone"
            type="tel"
            required
            maxLength={30}
            placeholder="(555) 000-0000"
            className={input}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="qf-email" className="mb-1.5 block text-sm font-bold text-ink-800">
            Email
          </label>
          <input
            id="qf-email"
            name="email"
            type="email"
            maxLength={150}
            placeholder="you@example.com"
            className={input}
          />
        </div>
        <div>
          <label htmlFor="qf-zip" className="mb-1.5 block text-sm font-bold text-ink-800">
            ZIP code
          </label>
          <input id="qf-zip" name="zip" maxLength={10} placeholder="62704" className={input} />
        </div>
      </div>
      <div>
        <label htmlFor="qf-service" className="mb-1.5 block text-sm font-bold text-ink-800">
          What do you need? *
        </label>
        <select id="qf-service" name="service" required className={input} defaultValue="">
          <option value="" disabled>
            Select a service…
          </option>
          {SERVICES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="qf-message" className="mb-1.5 block text-sm font-bold text-ink-800">
          Tell us about the job
        </label>
        <textarea
          id="qf-message"
          name="message"
          rows={4}
          maxLength={2000}
          placeholder="e.g. Double door won't open, makes a loud bang when we press the remote…"
          className={input}
        />
      </div>

      {/* ── Photo upload ── */}
      <div>
        <span className="mb-1.5 block text-sm font-bold text-ink-800">
          Photos of the problem{" "}
          <span className="font-semibold text-ink-400">
            (optional, up to {MAX_PHOTOS})
          </span>
        </span>
        <div className="flex flex-wrap gap-3">
          {photos.map((p, i) => (
            <div key={i} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.preview}
                alt={`Attached photo ${i + 1}`}
                className="size-20 rounded-xl border border-ink-200 object-cover"
              />
              <button
                type="button"
                onClick={() => setPhotos((ps) => ps.filter((_, j) => j !== i))}
                aria-label={`Remove photo ${i + 1}`}
                className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-ink-900 text-xs text-white shadow"
              >
                ✕
              </button>
            </div>
          ))}
          {photos.length < MAX_PHOTOS && (
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="grid size-20 place-items-center rounded-xl border-2 border-dashed border-ink-200 text-2xl text-ink-300 transition-colors hover:border-brand-400 hover:text-brand-500"
              aria-label="Add photo"
            >
              +
            </button>
          )}
        </div>
        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          multiple
          capture="environment"
          onChange={(e) => addPhotos(e.target.files)}
          className="hidden"
        />
        <p className="mt-1.5 text-xs text-ink-400">
          A quick phone photo helps us bring the right parts on the first visit.
        </p>
      </div>

      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-shine press mt-1 rounded-xl bg-brand-500 px-6 py-4 text-base font-bold text-ink-950 transition-all hover:bg-brand-400 hover:shadow-lg hover:shadow-brand-500/25 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Request Free Estimate"}
      </button>
      <p className="text-center text-xs text-ink-400">
        No spam, ever. We&apos;ll only use your info to respond to this request.
      </p>
    </form>
  );
}
