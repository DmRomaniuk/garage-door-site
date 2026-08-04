import { NextResponse } from "next/server";

// Step 1 of the GitHub OAuth flow for the /admin CMS.
// Redirects the CMS popup to GitHub's authorization screen.
export const runtime = "nodejs";

export async function GET(req: Request) {
  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  if (!clientId) {
    return new NextResponse(
      "OAuth is not configured. Set OAUTH_GITHUB_CLIENT_ID and OAUTH_GITHUB_CLIENT_SECRET in your Vercel environment variables.",
      { status: 500 }
    );
  }

  const state = crypto.randomUUID();
  const origin = new URL(req.url).origin;

  const url = new URL("https://github.com/login/oauth/authorize");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", `${origin}/api/callback`);
  url.searchParams.set("scope", "repo,user");
  url.searchParams.set("state", state);

  const res = NextResponse.redirect(url);
  res.cookies.set("oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return res;
}
