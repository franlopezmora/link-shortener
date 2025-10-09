import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// helpers (host único)
export const BASE_HOST = process.env.NEXT_PUBLIC_BASE_HOST || process.env.VERCEL_URL || "link-shortener-flm.vercel.app";
export const kSlug   = (slug: string) => `slug:${BASE_HOST}:${slug}`;
export const kVisits = (slug: string)   => `visits:${BASE_HOST}:${slug}`;
export const K_VISITS_DIRTY = "visits:dirty";

export type Cached = { url: string; exp?: number }; // exp en epoch ms (opcional)
