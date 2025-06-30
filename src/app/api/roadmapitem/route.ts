import { PrismaClient } from "@prisma/client"
import type { NextRequest } from "next/server"

const prisma = new PrismaClient()

export async function DELETE(request: NextRequest) {
  try {
    const { itemId } = await request.json()

    if (!itemId || typeof itemId !== "number") {
      return Response.json({ error: "itemId manquant ou invalide" }, { status: 400 })
    }

    const existingItem = await prisma.roadmapItem.findUnique({
      where: { id: itemId },
    })

    if (!existingItem) {
      return Response.json({ error: "RoadmapItem introuvable" }, { status: 404 })
    }

    await prisma.roadmapItem.delete({
      where: { id: itemId },
    })

    return Response.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Erreur lors de la suppression:", error)
    return Response.json({ error: "Erreur lors de la suppression" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
