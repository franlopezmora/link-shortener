import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
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

    // Verificar que la etiqueta pertenece al usuario
    const tag = await prisma.tag.findFirst({
      where: { 
        id: id,
        userId: user.id
      },
    });

    if (!tag) {
      return NextResponse.json({ error: "Etiqueta no encontrada" }, { status: 404 });
    }

    // Verificar si ya existe otra etiqueta con ese nombre
    const existingTag = await prisma.tag.findFirst({
      where: { 
        userId: user.id,
        name: name.trim(),
        id: { not: id }
      },
    });

    if (existingTag) {
      return NextResponse.json({ error: "Ya existe una etiqueta con ese nombre" }, { status: 409 });
    }

    const updatedTag = await prisma.tag.update({
      where: { id: id },
      data: { name: name.trim() },
    });

    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error("Error updating tag:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;

    // Buscar el usuario por email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Verificar que la etiqueta pertenece al usuario
    const tag = await prisma.tag.findFirst({
      where: { 
        id: id,
        userId: user.id
      },
    });

    if (!tag) {
      return NextResponse.json({ error: "Etiqueta no encontrada" }, { status: 404 });
    }

    // Eliminar la etiqueta (los links se actualizarán automáticamente por la relación)
    await prisma.tag.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Etiqueta eliminada" });
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
