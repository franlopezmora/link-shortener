import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|login|dashboard).*)"],
};

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const BASE_HOST = process.env.NEXT_PUBLIC_BASE_HOST || "localhost:3000";
const K_VISITS_DIRTY = "visits:dirty";
const kSlug   = (slug: string) => `slug:${BASE_HOST}:${slug}`;
const kVisits = (slug: string) => `visits:${BASE_HOST}:${slug}`;

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname.replace(/^\/+/, "");
  if (!path) return NextResponse.next();

  // 1) Intentar cache
  const cached = await redis.get<{ url?: string; exp?: number }>(kSlug(path));
  const now = Date.now();

  if (cached?.url && (!cached.exp || cached.exp > now)) {
    // Contar visita (no bloqueante) y marcar dirty
    const vKey = kVisits(path);
    redis.incr(vKey).catch(() => {});
    redis.sadd(K_VISITS_DIRTY, vKey).catch(() => {});
    return NextResponse.redirect(cached.url, 301);
  }

  // 2) Resolver en API (cachea y devuelve)
  const r = await fetch(new URL(`/api/r/${encodeURIComponent(path)}`, req.url));
  if (r.ok) {
    const { url } = (await r.json()) as { url?: string };
    if (url) {
      const vKey = kVisits(path);
      redis.incr(vKey).catch(() => {});
      redis.sadd(K_VISITS_DIRTY, vKey).catch(() => {});
      return NextResponse.redirect(url, 301);
    }
  }
  return NextResponse.next();
}