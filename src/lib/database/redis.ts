import { Redis } from "@upstash/redis";

type RedisLike = {
  get: <T = unknown>(key: string) => Promise<T | null>;
  set: (key: string, value: unknown, options?: { ex?: number }) => Promise<unknown>;
  del: (key: string) => Promise<number>;
  incr: (key: string) => Promise<number>;
  sadd: (key: string, ...members: string[]) => Promise<number>;
  spop: (key: string, count?: number) => Promise<string[] | string | null>;
};

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const noopRedis: RedisLike = {
  async get() {
    return null;
  },
  async set() {
    return "OK";
  },
  async del() {
    return 0;
  },
  async incr() {
    return 0;
  },
  async sadd() {
    return 0;
  },
  async spop() {
    return [];
  },
};

export const redis: RedisLike =
  redisUrl && redisToken
    ? new Redis({ url: redisUrl, token: redisToken })
    : noopRedis;

// helpers (host unico)
export const BASE_HOST =
  process.env.NEXT_PUBLIC_BASE_HOST ||
  process.env.VERCEL_URL ||
  "link-shortener-flm.vercel.app";
export const kSlug = (slug: string) => `slug:${BASE_HOST}:${slug}`;
export const kVisits = (slug: string) => `visits:${BASE_HOST}:${slug}`;
export const K_VISITS_DIRTY = "visits:dirty";

export type Cached = { url: string; exp?: number }; // exp en epoch ms (opcional)
