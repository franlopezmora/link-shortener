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

  const linksWithLiveVisits = await Promise.all(
    links.map(async (link: any) => {
      const pending = Number(await redis.get(kVisits(link.slug))) || 0;
      return { ...link, visits: (link.visits ?? 0) + pending };
    })
  );

  return (
    <DashboardClient 
      links={linksWithLiveVisits}
      totalLinks={links.length}
      totalVisits={linksWithLiveVisits.reduce((sum: number, link: any) => sum + (link.visits || 0), 0)}
      activeLinks={linksWithLiveVisits.filter((link: any) => !link.expiresAt || link.expiresAt.getTime() > Date.now()).length}
    />
  );
}
