import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/database/prisma";
import { redis, kVisits } from "@/lib/database/redis";
import DashboardClient from "@/components/dashboard/DashboardClient";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const links = await prisma.link.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
  });

  // Obtener etiquetas usando consulta SQL directa
  const tagsResult = await prisma.$queryRaw`
    SELECT t.id, t.name, t.color
    FROM "Tag" t
    JOIN "User" u ON t."userId" = u.id
    WHERE u.email = ${session.user.email}
    ORDER BY t.name ASC
  ` as any[];

  const tags = tagsResult.map((t: any) => ({
    id: t.id,
    name: t.name,
    color: t.color
  }));

  // Obtener las relaciones LinkTag usando una consulta SQL directa
  const linkTagsResult = await prisma.$queryRaw`
    SELECT lt.id, lt."linkId", lt."tagId", t.id as "tag_id", t.name as "tag_name", t.color as "tag_color"
    FROM "LinkTag" lt
    JOIN "Tag" t ON lt."tagId" = t.id
    JOIN "Link" l ON lt."linkId" = l.id
    JOIN "User" u ON l."userId" = u.id
    WHERE u.email = ${session.user.email}
  ` as any[];

  // Transformar los datos para incluir las etiquetas
  const linksWithTags = links.map(link => ({
    ...link,
    linkTags: linkTagsResult
      .filter((lt: any) => lt.linkId === link.id)
      .map((lt: any) => ({ 
        tag: { 
          id: lt.tag_id, 
          name: lt.tag_name, 
          color: lt.tag_color 
        } 
      }))
  }));

  const linksWithLiveVisits = await Promise.all(
    linksWithTags.map(async (l) => {
      const pending = Number(await redis.get(kVisits(l.slug))) || 0;
      return { ...l, visits: (l.visits ?? 0) + pending };
    })
  );

  return (
    <DashboardClient 
      links={linksWithLiveVisits}
      tags={tags}
      totalLinks={links.length}
      totalVisits={linksWithLiveVisits.reduce((sum, link) => sum + (link.visits || 0), 0)}
      activeLinks={linksWithTags.filter(link => !link.expiresAt || link.expiresAt.getTime() > Date.now()).length}
    />
  );
}
