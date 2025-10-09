import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const tags = await prisma.tag.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { name } = await request.json();
    
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });
    }

    if (name.trim().length > 50) {
      return NextResponse.json({ error: "El nombre no puede tener más de 50 caracteres" }, { status: 400 });
    }

    // Buscar el usuario por email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Verificar si ya existe una etiqueta con ese nombre
    const existingTag = await prisma.tag.findFirst({
      where: { 
        userId: user.id,
        name: name.trim()
      },
    });

    if (existingTag) {
      return NextResponse.json({ error: "Ya existe una etiqueta con ese nombre" }, { status: 409 });
    }

    // Generar color aleatorio para la etiqueta
    const colors = [
      "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16", 
      "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9", 
      "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef", 
      "#ec4899", "#f43f5e"
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const tag = await prisma.tag.create({
      data: {
        name: name.trim(),
        color: randomColor,
        userId: user.id,
      },
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
