import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redis, K_VISITS_DIRTY } from "@/lib/redis";

export const maxDuration = 50;
const BATCH = 500;

export async function POST() {
  const keys: string[] = (await redis.spop(K_VISITS_DIRTY, BATCH)) as string[];
  if (!keys || keys.length === 0) return NextResponse.json({ processed: 0 });

  const tuples: { slug: string; count: number }[] = [];
  for (const k of keys) {
    // formato: visits:HOST:slug  (HOST lo ignoramos porque usamos host único)
    const parts = k.split(":");
    const slug = parts.slice(2).join(":");
    const count = Number(await redis.get(k)) || 0;
    if (count > 0) tuples.push({ slug, count });
    await redis.del(k).catch(()=>{});
  }

  // agrupar por slug
  const grouped = new Map<string, number>();
  for (const t of tuples) grouped.set(t.slug, (grouped.get(t.slug) || 0) + t.count);

  let updated = 0;
  for (const [slug, inc] of grouped.entries()) {
    await prisma.link.update({
      where: { slug },
      data: { visits: { increment: inc }, lastVisit: new Date() },
    }).then(()=> updated++).catch(()=>{});
  }

  return NextResponse.json({ processed: keys.length, flushed: updated });
}
