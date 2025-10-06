import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { isValidSlug, isValidUrl } from "@/lib/validators"
import { redis, kSlug } from "@/lib/redis"

async function isOwner(id: string, email?: string | null) {
  if (!email) return false
  const link = await prisma.link.findUnique({ where: { id } })
  if (!link?.userId) return false
  const user = await prisma.user.findUnique({ where: { email } })
  return user?.id === link.userId
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!(await isOwner(params.id, session?.user?.email))) return new Response("Forbidden", { status: 403 })
  
  const existing = await prisma.link.findUnique({ where: { id: params.id } });
  const body = await req.json()
  const data: any = {}
  
  if (body.url) {
    if (!isValidUrl(body.url)) return new Response("URL inválida", { status: 400 })
    data.url = body.url
  }
  if (body.slug) {
    if (!isValidSlug(body.slug)) return new Response("Slug inválido", { status: 400 })
    data.slug = body.slug
  }
  
  if ("expiresAt" in body) {
    if (body.expiresAt === null || body.expiresAt === "") {
      data.expiresAt = null;
    } else {
      const d = new Date(body.expiresAt);
      if (isNaN(d.getTime()) || d.getTime() <= Date.now())
        return new Response("Expiración inválida", { status: 400 });
      data.expiresAt = d;
    }
  }
  
  try {
    const updated = await prisma.link.update({ where: { id: params.id }, data })
    
    // invalidar viejo y (si cambió) nuevo slug
    await Promise.all([
      existing?.slug ? redis.del(kSlug(existing.slug)).catch(()=>{}) : Promise.resolve(),
      updated.slug !== existing?.slug ? redis.del(kSlug(updated.slug)).catch(()=>{}) : Promise.resolve(),
    ]);
    
    return Response.json(updated)
  } catch {
    return new Response("Slug ya usado", { status: 409 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!(await isOwner(params.id, session?.user?.email))) return new Response("Forbidden", { status: 403 })
  
  const deleted = await prisma.link.delete({ where: { id: params.id } })
  
  // invalidar cache
  await redis.del(kSlug(deleted.slug)).catch(()=>{});
  
  return new Response(null, { status: 204 })
}
