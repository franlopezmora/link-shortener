import { prisma } from "@/lib/database/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  if (!email) return new Response("Missing ?email=", { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email },
    include: { accounts: true },
  });

  return Response.json({
    found: !!user,
    user: user ? { id: user.id, email: user.email, name: user.name } : null,
    accounts: user?.accounts?.map(a => ({
      provider: a.provider,
      providerAccountId: a.providerAccountId,
      type: a.type,
    })) ?? [],
  });
}
