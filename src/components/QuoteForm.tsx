"use client";

import { useState, type FormEvent } from "react";

const SERVICES = [
  "New Door Installation",
  "Garage Door Repair",
  "Spring Replacement",
  "Opener Installation / Repair",
  "Maintenance & Tune-Up",
  "Emergency Service",
  "Not sure / Other",
];

type Status = "idle" | "sending" | "success" | "error";

export default function QuoteForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

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
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-brand-200 bg-brand-50 p-8 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-brand-500 text-2xl text-ink-950">
          ✓
        </div>
        <h3 className="mt-4 font-display text-xl font-bold text-ink-900">
          Request received!
        </h3>
        <p className="mt-2 text-ink-600">
          Thanks — we&apos;ll get back to you shortly, usually within the hour
          during business hours.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 text-sm font-bold text-brand-600 hover:text-brand-500"
        >
          Send another request
        </button>
      </div>
    );
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
      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-1 rounded-xl bg-brand-500 px-6 py-4 text-base font-bold text-ink-950 transition-all hover:bg-brand-400 hover:shadow-lg hover:shadow-brand-500/25 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Request Free Estimate"}
      </button>
      <p className="text-center text-xs text-ink-400">
        No spam, ever. We&apos;ll only use your info to respond to this request.
      </p>
    </form>
  );
}
