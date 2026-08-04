import { NextResponse } from "next/server";

// Step 2 of the GitHub OAuth flow for the /admin CMS.
// Exchanges the code for a token, then completes the standard
// Netlify/Decap/Sveltia postMessage handshake with the CMS popup opener.
export const runtime = "nodejs";

function handshakePage(payload: string) {
  // The CMS window expects: "authorizing:github" ping, then
  // "authorization:github:success:{json}" (or :error:).
  const script = `
    (function () {
      function send(e) {
        window.opener.postMessage(${JSON.stringify(payload)}, e.origin);
        window.removeEventListener("message", send, false);
      }
      window.addEventListener("message", send, false);
      window.opener.postMessage("authorizing:github", "*");
    })();
  `;
  return new NextResponse(
    `<!doctype html><html><body><p>Authorizing…</p><script>${script}</script></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieState = req.headers
    .get("cookie")
    ?.match(/(?:^|;\s*)oauth_state=([^;]+)/)?.[1];

  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return handshakePage(
      'authorization:github:error:{"error":"OAuth not configured"}'
    );
  }
  if (!code || !state || !cookieState || state !== cookieState) {
    return handshakePage(
      'authorization:github:error:{"error":"Invalid OAuth state"}'
    );
  }

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });
  const data = (await tokenRes.json()) as {
    access_token?: string;
    error_description?: string;
  };

  if (!data.access_token) {
    return handshakePage(
      `authorization:github:error:${JSON.stringify({
        error: data.error_description ?? "Token exchange failed",
      })}`
    );
  }

  return handshakePage(
    `authorization:github:success:${JSON.stringify({
      token: data.access_token,
      provider: "github",
    })}`
  );
}
