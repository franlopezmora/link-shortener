import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isValidSlug, isValidUrl } from "@/lib/validators";
import { redis, kSlug } from "@/lib/redis";

// ——— RATE LIMIT (simple en memoria) ———
const windowMs = 60_000;        // 1 minuto
const maxCreates = 5;           // máx 5
const buckets = new Map<string, number[]>();
function rlKey(email?: string | null) { return email || "anon"; }

function recordAndCheckRateLimit(key: string) {
  const now = Date.now();
  const arr = (buckets.get(key) || []).filter(ts => now - ts < windowMs);
  arr.push(now);
  buckets.set(key, arr);
  return arr.length <= maxCreates;
}
// ————————————————————————————————

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return Response.json([], { status: 200 });

  const links = await prisma.link.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(links);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return new Response("Unauthorized", { status: 401 });

  // Rate limit
  const key = rlKey(session.user.email);
  if (!recordAndCheckRateLimit(key)) {
    return new Response("Demasiados intentos, probá en un minuto", { status: 429 });
  }

  const ctype = req.headers.get("content-type") || "";
  let url = "", slug = "", expiresAt: Date | null = null;

  if (ctype.includes("application/json")) {
    const body = await req.json();
    url = body.url ?? "";
    slug = body.slug ?? "";
    if (body.expiresAt) {
      const d = new Date(body.expiresAt);
      if (isNaN(d.getTime()) || d.getTime() <= Date.now())
        return new Response("Expiración inválida", { status: 400 });
      expiresAt = d;
    }
  } else {
    const fd = await req.formData();
    url = String(fd.get("url") || "");
    slug = String(fd.get("slug") || "");
  }

  if (!isValidUrl(url)) return new Response("URL inválida", { status: 400 });
  if (!isValidSlug(slug)) return new Response("Slug inválido", { status: 400 });

  const exist = await prisma.link.findUnique({ where: { slug } });
  if (exist) return new Response("Slug ya usado", { status: 409 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const created = await prisma.link.create({ data: { url, slug, userId: user?.id, expiresAt } });
  
  // invalidar cache
  await redis.del(kSlug(created.slug)).catch(()=>{});
  
  return Response.json(created, { status: 201 });
}
