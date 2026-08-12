import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getBusiness } from "@/lib/content";

export const runtime = "nodejs";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );

interface QuotePhoto {
  name: string;
  type: string;
  data: string; // base64
}

interface Quote {
  name: string;
  phone: string;
  email: string;
  zip: string;
  service: string;
  message: string;
  photos: QuotePhoto[];
}

const MAX_PHOTOS = 3;
const MAX_PHOTO_BYTES = 1_500_000; // per photo, after client compression

function sanitizePhotos(v: unknown): QuotePhoto[] {
  if (!Array.isArray(v)) return [];
  return v
    .slice(0, MAX_PHOTOS)
    .filter(
      (p): p is QuotePhoto =>
        !!p &&
        typeof p.name === "string" &&
        typeof p.data === "string" &&
        /^image\/(jpeg|png|webp)$/.test(p?.type ?? "") &&
        p.data.length > 0 &&
        p.data.length < (MAX_PHOTO_BYTES * 4) / 3 &&
        /^[A-Za-z0-9+/=]+$/.test(p.data)
    )
    .map((p, i) => ({
      name: `photo-${i + 1}.jpg`,
      type: p.type,
      data: p.data,
    }));
}

async function sendEmail(q: Quote): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_EMAIL_TO;
  if (!apiKey || !to) return false;

  const business = getBusiness();
  const resend = new Resend(apiKey);

  const html = `
    <div style="font-family:sans-serif;max-width:560px">
      <h2 style="margin:0 0 4px">New estimate request</h2>
      <p style="margin:0 0 16px;color:#666">via ${esc(business.name)} website</p>
      <table style="border-collapse:collapse;width:100%">
        ${[
          ["Name", q.name],
          ["Phone", q.phone],
          ["Email", q.email || "—"],
          ["ZIP", q.zip || "—"],
          ["Service", q.service],
        ]
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 12px 6px 0;font-weight:bold;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:6px 0">${esc(v)}</td></tr>`
          )
          .join("")}
      </table>
      ${q.message ? `<p style="margin-top:16px"><strong>Message:</strong><br/>${esc(q.message).replace(/\n/g, "<br/>")}</p>` : ""}
    </div>`;

  const { error } = await resend.emails.send({
    from: process.env.QUOTE_EMAIL_FROM ?? "Website <onboarding@resend.dev>",
    to: [to],
    replyTo: q.email || undefined,
    subject: `New estimate request: ${q.service} — ${q.name}`,
    html,
    attachments: q.photos.map((p) => ({
      filename: p.name,
      content: p.data,
    })),
  });

  if (error) {
    console.error("[quote] Resend error:", error);
    return false;
  }
  return true;
}

async function sendTelegram(q: Quote): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  const lines = [
    `🚪 <b>New estimate request</b>`,
    ``,
    `<b>Name:</b> ${esc(q.name)}`,
    `<b>Phone:</b> ${esc(q.phone)}`,
    q.email ? `<b>Email:</b> ${esc(q.email)}` : null,
    q.zip ? `<b>ZIP:</b> ${esc(q.zip)}` : null,
    `<b>Service:</b> ${esc(q.service)}`,
    q.message ? `` : null,
    q.message ? `💬 ${esc(q.message)}` : null,
  ].filter((l): l is string => l !== null);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join("\n"),
        parse_mode: "HTML",
      }),
    });
    if (!res.ok) {
      console.error("[quote] Telegram error:", res.status, await res.text());
      return false;
    }

    // Photos are best-effort: the lead is already delivered above.
    for (const p of q.photos) {
      const form = new FormData();
      form.append("chat_id", chatId);
      form.append(
        "photo",
        new Blob([Buffer.from(p.data, "base64")], { type: p.type }),
        p.name
      );
      const pr = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: "POST",
        body: form,
      });
      if (!pr.ok) {
        console.error("[quote] Telegram photo error:", pr.status);
      }
    }
    return true;
  } catch (err) {
    console.error("[quote] Telegram error:", err);
    return false;
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: bots fill every field. Pretend success.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const str = (v: unknown, max: number) =>
    typeof v === "string" ? v.trim().slice(0, max) : "";

  const quote: Quote = {
    name: str(body.name, 100),
    phone: str(body.phone, 30),
    email: str(body.email, 150),
    zip: str(body.zip, 10),
    service: str(body.service, 100),
    message: str(body.message, 2000),
    photos: sanitizePhotos(body.photos),
  };

  if (!quote.name || !quote.phone || !quote.service) {
    return NextResponse.json(
      { error: "Please fill in your name, phone and the service you need." },
      { status: 400 }
    );
  }

  const emailConfigured = Boolean(
    process.env.RESEND_API_KEY && process.env.QUOTE_EMAIL_TO
  );
  const telegramConfigured = Boolean(
    process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID
  );

  if (!emailConfigured && !telegramConfigured) {
    console.warn("[quote] No delivery channel configured. Request:", quote);
    return NextResponse.json(
      {
        error:
          "The request form isn't configured yet. Please call us directly instead.",
      },
      { status: 503 }
    );
  }

  const results = await Promise.all([
    emailConfigured ? sendEmail(quote) : Promise.resolve(false),
    telegramConfigured ? sendTelegram(quote) : Promise.resolve(false),
  ]);

  // Success if the request reached at least one channel.
  if (!results.some(Boolean)) {
    return NextResponse.json(
      { error: "Couldn't send your request. Please call us directly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
