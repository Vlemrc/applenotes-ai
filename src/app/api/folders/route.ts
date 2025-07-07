import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const folders = await prisma.folder.findMany({
      include: {
        _count: {
          select: {
            notes: true,
            roadmaps: true,
          },
        },
        // Ajouter les notes avec leur contenu
        notes: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        roadmaps: {
          include: {
            items: {
              include: {
                note: {
                  select: {
                    id: true,
                    title: true,
                    content: true,
                    createdAt: true,
                    updatedAt: true,
                  },
                },
              },
            },
          },
        },
      },
    })
    return NextResponse.json(folders)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching folders" }, { status: 500 })
  }
}

// ... reste du code inchangé
export async function POST(req) {
  try {
    const { name } = await req.json()

    if (!name) {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 })
    }

    const newFolder = await prisma.folder.create({
      data: { name },
    })

    return NextResponse.json(newFolder, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error creating folder" }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "Folder ID is required" }, { status: 400 })
    }

    // Vérifier si le dossier contient des notes
    const folder = await prisma.folder.findUnique({
      where: { id },
      include: {
        notes: true,
      },
    })

    if (!folder) {
      return NextResponse.json({ error: "Folder not found" }, { status: 404 })
    }

    // Si le dossier contient des notes, les déplacer vers "Suppr. récentes"
    if (folder.notes.length > 0) {
      // Trouver ou créer le dossier "Suppr. récentes"
      let recentlyDeletedFolder = await prisma.folder.findFirst({
        where: { name: "Suppr. récentes" },
      })

      if (!recentlyDeletedFolder) {
        recentlyDeletedFolder = await prisma.folder.create({
          data: { name: "Suppr. récentes" },
        })
      }

      // Déplacer toutes les notes vers le dossier "Suppr. récentes"
      await prisma.note.updateMany({
        where: { folderId: id },
        data: { folderId: recentlyDeletedFolder.id },
      })
    }

    // Maintenant que le dossier est vide, on peut le supprimer
    const deletedFolder = await prisma.folder.delete({
      where: { id },
    })

    return NextResponse.json({
      message: "Folder deleted successfully",
      folder: deletedFolder,
      notesMovedCount: folder.notes.length,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error deleting folder" }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const { id, name } = await req.json()

    if (!id || !name) {
      return NextResponse.json({ error: "Folder ID and new name are required" }, { status: 400 })
    }

    const updatedFolder = await prisma.folder.update({
      where: { id },
      data: { name },
    })

    return NextResponse.json({ message: "Folder updated successfully", folder: updatedFolder })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error updating folder" }, { status: 500 })
  }
}
