import { prisma } from "@/lib/database/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { isValidSlug, isValidUrl } from "@/lib/validation/validators";
import { redis, kSlug } from "@/lib/database/redis";

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
    include: { 
      linkTags: {
        include: {
          tag: true
        }
      }
    },
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
  let url = "", slug = "", description = "", tagIds = undefined;

  if (ctype.includes("application/json")) {
    const body = await req.json();
    url = body.url ?? "";
    slug = body.slug ?? "";
    description = body.description ?? "";
    tagIds = body.tagIds ?? undefined;
  } else {
    const fd = await req.formData();
    url = String(fd.get("url") || "");
    slug = String(fd.get("slug") || "");
  }

  // Establecer expiración automática a 1 año desde ahora
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  if (!isValidUrl(url)) return new Response("URL inválida", { status: 400 });
  if (!isValidSlug(slug)) return new Response("Slug inválido", { status: 400 });

  // Verificar límite de links por usuario
  const user = await prisma.user.findUnique({ 
    where: { email: session.user.email },
    include: { links: true }
  });
  
  if (!user) return new Response("Usuario no encontrado", { status: 404 });
  
  const MAX_LINKS = 10;
  if (user.links.length >= MAX_LINKS) {
    return new Response(`Límite alcanzado. Máximo ${MAX_LINKS} links por usuario`, { status: 403 });
  }

  const exist = await prisma.link.findUnique({ where: { slug } });
  if (exist) return new Response("Slug ya usado", { status: 409 });

  const created = await prisma.link.create({ 
    data: { 
      url, 
      slug, 
      userId: user.id, 
      expiresAt,
      description: description || undefined,
    } 
  });

  // Crear relaciones con etiquetas si se proporcionaron
  if (tagIds && Array.isArray(tagIds) && tagIds.length > 0) {
    // Verificar que todas las etiquetas pertenecen al usuario
    const validTags = await prisma.tag.findMany({
      where: {
        id: { in: tagIds },
        userId: user.id
      }
    });

    if (validTags.length === tagIds.length) {
      // Crear las relaciones
      await prisma.linkTag.createMany({
        data: tagIds.map(tagId => ({
          linkId: created.id,
          tagId: tagId
        }))
      });
    }
  }
  
  // invalidar cache
  await redis.del(kSlug(created.slug)).catch(()=>{});
  
  return Response.json(created, { status: 201 });
}
