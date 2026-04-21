import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|login|dashboard).*)"],
};

export default async function middleware(req: NextRequest) {
  try {
    const path = req.nextUrl.pathname.replace(/^\/+/, "");
    if (!path) return NextResponse.next();

    const r = await fetch(new URL(`/api/r/${encodeURIComponent(path)}`, req.url));
    if (r.ok) {
      const { url } = (await r.json()) as { url?: string };
      if (url) {
        return NextResponse.redirect(url, 301);
      }
    }

    return NextResponse.next();
  } catch {
    // Never break public link resolution because of middleware runtime issues.
    return NextResponse.next();
  }
}
