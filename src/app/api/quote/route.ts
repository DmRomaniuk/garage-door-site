import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getBusiness } from "@/lib/content";

export const runtime = "nodejs";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );

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

  const name = str(body.name, 100);
  const phone = str(body.phone, 30);
  const email = str(body.email, 150);
  const zip = str(body.zip, 10);
  const service = str(body.service, 100);
  const message = str(body.message, 2000);

  if (!name || !phone || !service) {
    return NextResponse.json(
      { error: "Please fill in your name, phone and the service you need." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.QUOTE_EMAIL_TO;

  if (!apiKey || !to) {
    // Not configured yet — log so the request isn't silently lost in dev.
    console.warn("[quote] RESEND_API_KEY / QUOTE_EMAIL_TO not set. Request:", {
      name,
      phone,
      email,
      zip,
      service,
    });
    return NextResponse.json(
      {
        error:
          "The request form isn't configured yet. Please call us directly instead.",
      },
      { status: 503 }
    );
  }

  const business = getBusiness();
  const resend = new Resend(apiKey);

  const html = `
    <div style="font-family:sans-serif;max-width:560px">
      <h2 style="margin:0 0 4px">New estimate request</h2>
      <p style="margin:0 0 16px;color:#666">via ${esc(business.name)} website</p>
      <table style="border-collapse:collapse;width:100%">
        ${[
          ["Name", name],
          ["Phone", phone],
          ["Email", email || "—"],
          ["ZIP", zip || "—"],
          ["Service", service],
        ]
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 12px 6px 0;font-weight:bold;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:6px 0">${esc(v)}</td></tr>`
          )
          .join("")}
      </table>
      ${message ? `<p style="margin-top:16px"><strong>Message:</strong><br/>${esc(message).replace(/\n/g, "<br/>")}</p>` : ""}
    </div>`;

  const { error } = await resend.emails.send({
    from: process.env.QUOTE_EMAIL_FROM ?? "Website <onboarding@resend.dev>",
    to: [to],
    replyTo: email || undefined,
    subject: `New estimate request: ${service} — ${name}`,
    html,
  });

  if (error) {
    console.error("[quote] Resend error:", error);
    return NextResponse.json(
      { error: "Couldn't send your request. Please call us directly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
