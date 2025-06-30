import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const folderId = searchParams.get("folderId")
    const noteId = searchParams.get("id")

    if (noteId) {
      // Si un id de note est fourni, récupérer cette note spécifique
      const note = await prisma.note.findUnique({
        where: { id: Number.parseInt(noteId) },
        include: {
          folder: true,
          roadmapItems: {
            include: {
              roadmap: true, // Inclut aussi la roadmap liée
            },
          },
        },
      })

      if (!note) {
        return NextResponse.json({ error: "Note not found" }, { status: 404 })
      }

      return NextResponse.json(note)
    }

    // Si aucun id de note, récupérer les notes par folderId
    const notes = await prisma.note.findMany({
      where: folderId
        ? {
            folderId: Number.parseInt(folderId),
          }
        : undefined,
      include: {
        folder: true,
        roadmapItems: {
          include: {
            roadmap: true, // Inclut aussi la roadmap liée
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(notes)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching notes" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, title, content } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Note ID is required" }, { status: 400 })
    }

    const updatedNote = await prisma.note.update({
      where: { id: Number(id) },
      data: {
        ...(title && { title }),
        ...(content && { content }),
      },
    })

    return NextResponse.json(updatedNote, { status: 200 })
  } catch (error) {
    console.error("Erreur API PATCH :", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Note ID is required" }, { status: 400 })
    }

    const note = await prisma.note.findUnique({
      where: { id: Number(id) },
      include: { folder: true },
    })

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 })
    }

    const trashFolder = await prisma.folder.findFirst({
      where: { name: "Suppr. récentes" },
    })

    if (!trashFolder) {
      return NextResponse.json({ error: "Trash folder not found" }, { status: 404 })
    }

    if (note.folderId === trashFolder.id) {
      // Si la note est déjà dans "Suppr. récentes", on la supprime définitivement
      // D'abord supprimer tous les roadmapItems liés à cette note
      await prisma.roadmapItem.deleteMany({
        where: { noteId: Number(id) },
      })

      // Puis supprimer la note
      await prisma.note.delete({
        where: { id: Number(id) },
      })

      return NextResponse.json({ message: "Note deleted permanently" }, { status: 200 })
    } else {
      // Sinon, on déplace la note dans "Suppr. récentes"
      // ET on supprime tous les roadmapItems liés à cette note
      await prisma.roadmapItem.deleteMany({
        where: { noteId: Number(id) },
      })

      const updatedNote = await prisma.note.update({
        where: { id: Number(id) },
        data: { folderId: trashFolder.id },
      })

      return NextResponse.json(
        { message: "Note moved to trash and detached from roadmaps", note: updatedNote },
        { status: 200 },
      )
    }
  } catch (error) {
    console.error("Error deleting note:", error)
    return NextResponse.json({ error: "Error deleting note" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, folderId } = await request.json()

    if (!folderId) {
      return NextResponse.json({ error: "Folder ID is required" }, { status: 400 })
    }

    const newNote = await prisma.note.create({
      data: {
        title: title || "Nouvelle note", // Titre par défaut si non fourni
        content: content || "",
        folderId: Number(folderId),
      },
    })

    return NextResponse.json(newNote, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de la note :", error)
    return NextResponse.json({ error: "Erreur lors de la création de la note" }, { status: 500 })
  }
}
