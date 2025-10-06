import { prisma } from "@/lib/prisma";
import { redis, kSlug } from "@/lib/redis";
import { NextResponse } from "next/server";

function ttlFor(expiresAt?: Date | null) {
  if (!expiresAt) return 60 * 60 * 24; // 24h
  const msLeft = expiresAt.getTime() - Date.now();
  if (msLeft <= 0) return 60; // expirado → cache corto
  return Math.max(60, Math.min(60 * 60 * 24, Math.floor(msLeft / 1000)));
}

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const { slug } = params;

  const link = await prisma.link.findUnique({ where: { slug } });
  if (!link) return NextResponse.json({ url: null }, { status: 404 });

  if (link.expiresAt && link.expiresAt.getTime() <= Date.now()) {
    await redis.set(kSlug(slug), { url: null, exp: Date.now() - 1 }, { ex: 60 });
    return new NextResponse("Expired", { status: 410 });
  }

  const payload = { url: link.url, exp: link.expiresAt?.getTime() };
  await redis.set(kSlug(slug), payload, { ex: ttlFor(link.expiresAt) });

  return NextResponse.json({ url: link.url }, { status: 200 });
}