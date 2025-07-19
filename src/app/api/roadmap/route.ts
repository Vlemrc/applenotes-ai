import { OpenAI } from "openai"
import { PrismaClient } from "@prisma/client"
import type { NextRequest } from "next/server"

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const { action, folderId, itemId, checked, roadmapId } = await req.json()

    switch (action) {
      case "generate":
        return await generateRoadmap(folderId)
      case "fetch":
        return await fetchRoadmaps(folderId)
      case "updateItem":
        return await updateRoadmapItem(itemId, checked)
      case "delete":
        return await deleteRoadmap(roadmapId)
      case "regenerate":
        return await regenerateRoadmap(folderId)
      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 })
    }
  } catch (error) {
    console.error("Error in roadmap API:", error)
    return new Response(
      JSON.stringify({
        error: "Erreur serveur",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      { status: 500 },
    )
  }
}

async function generateRoadmap(folderId: string) {
  if (!folderId) {
    return new Response(JSON.stringify({ error: "No folder ID provided" }), { status: 400 })
  }

  try {
    const existingRoadmap = await prisma.roadmap.findFirst({
      where: { folderId: Number.parseInt(folderId) },
    })

    if (existingRoadmap) {
      return new Response(
        JSON.stringify({
          error: "Une roadmap existe déjà pour ce dossier",
          code: "ROADMAP_ALREADY_EXISTS",
          existingRoadmap: {
            id: existingRoadmap.id,
            title: existingRoadmap.title,
            createdAt: existingRoadmap.createdAt,
          },
        }),
        { status: 409 },
      )
    }

    // Récupérer les notes avec limite
    const notes = await prisma.note.findMany({
      where: { folderId: Number.parseInt(folderId) },
      select: { id: true, title: true },
      take: 20, // Limiter à 20 notes max
    })

    if (notes.length === 0) {
      return new Response(JSON.stringify({ error: "No notes found in this folder" }), { status: 404 })
    }

    const folder = await prisma.folder.findUnique({
      where: { id: Number.parseInt(folderId) },
      select: { name: true },
    })

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 25000,
    })

    const noteTitles = notes.map((note) => note.title).join("\n- ")

    const prompt = `
      Crée une roadmap d'apprentissage basée sur les titres de notes suivants :
      - ${noteTitles}
      
      Règles strictes :
      - Analyse les titres et détermine l'ordre logique d'apprentissage
      - Commence par les concepts de base et progresse vers les plus avancés
      - Chaque titre de note doit apparaître exactement une fois dans la roadmap
      - Réponds **uniquement** en JSON valide sous la forme suivante :
      
      {
        "roadmapTitle": "Roadmap pour [sujet principal]",
        "items": [
          {
            "noteTitle": "titre exact de la note",
            "position": 1,
            "reasoning": "courte explication"
          }
        ]
      }
      
      **IMPORTANT** : 
      - Utilise exactement les titres fournis, sans modification
      - Échappe les guillemets internes avec \\" pour garantir un JSON valide
    `

    const model = process.env.NODE_ENV === "production" ? "gpt-4o-mini" : "gpt-4"

    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 3000,
    })

    const content = response.choices[0].message.content
    if (!content) {
      throw new Error("No content received from OpenAI")
    }

    let aiResponse
    try {
      aiResponse = JSON.parse(content)
    } catch (parseError) {
      const cleanedContent = content.replace(/```json|```/g, "").trim()
      aiResponse = JSON.parse(cleanedContent)
    }

    // Créer la roadmap en base
    const roadmap = await prisma.roadmap.create({
      data: {
        title: aiResponse.roadmapTitle || `Roadmap - ${folder?.name}`,
        folderId: Number.parseInt(folderId),
      },
    })

    const roadmapItems = []
    for (const item of aiResponse.items) {
      const note = notes.find((n) => n.title === item.noteTitle)
      if (note) {
        const roadmapItem = await prisma.roadmapItem.create({
          data: {
            roadmapId: roadmap.id,
            noteId: note.id,
            position: item.position,
            checked: false,
          },
          include: {
            note: {
              select: { id: true, title: true },
            },
          },
        })
        roadmapItems.push({
          ...roadmapItem,
          reasoning: item.reasoning,
        })
      }
    }

    roadmapItems.sort((a, b) => a.position - b.position)

    const result = {
      roadmap: {
        id: roadmap.id,
        title: roadmap.title,
        createdAt: roadmap.createdAt,
      },
      items: roadmapItems,
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Generate roadmap error:", error)

    if (error.code === "timeout") {
      return new Response(
        JSON.stringify({
          error: "La génération a pris trop de temps. Veuillez réessayer.",
        }),
        { status: 408 },
      )
    }

    throw error
  }
}

async function fetchRoadmaps(folderId: string) {
  const roadmaps = await prisma.roadmap.findMany({
    where: { folderId: Number.parseInt(folderId) },
    include: {
      items: {
        include: {
          note: {
            select: { id: true, title: true },
          },
        },
        orderBy: { position: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return new Response(JSON.stringify(roadmaps), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}

async function updateRoadmapItem(itemId: number, checked: boolean) {
  const updatedItem = await prisma.roadmapItem.update({
    where: { id: itemId },
    data: { checked },
    include: {
      note: {
        select: { id: true, title: true },
      },
    },
  })

  return new Response(JSON.stringify(updatedItem), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}

async function deleteRoadmap(roadmapId: number) {
  try {
    if (!roadmapId) {
      return new Response(JSON.stringify({ error: "ID de roadmap manquant" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    await prisma.roadmapItem.deleteMany({
      where: { roadmapId: roadmapId },
    })

    const deletedRoadmap = await prisma.roadmap.delete({
      where: { id: roadmapId },
    })

    return new Response(
      JSON.stringify({
        success: true,
        message: "Roadmap supprimée avec succès",
        deletedRoadmap: {
          id: deletedRoadmap.id,
          title: deletedRoadmap.title,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    console.error("Error deleting roadmap:", error)
    return new Response(
      JSON.stringify({
        error: "Erreur lors de la suppression de la roadmap",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}

async function regenerateRoadmap(folderId: string) {
  if (!folderId) {
    return new Response(JSON.stringify({ error: "No folder ID provided" }), { status: 400 })
  }

  try {
    // Supprimer l'ancienne roadmap
    const existingRoadmap = await prisma.roadmap.findFirst({
      where: { folderId: Number.parseInt(folderId) },
    })

    if (existingRoadmap) {
      await prisma.roadmapItem.deleteMany({
        where: { roadmapId: existingRoadmap.id },
      })
      await prisma.roadmap.delete({
        where: { id: existingRoadmap.id },
      })
    }

    // Générer une nouvelle roadmap
    return await generateRoadmap(folderId)
  } catch (error) {
    console.error("Error regenerating roadmap:", error)
    return new Response(
      JSON.stringify({
        error: "Erreur lors de la régénération de la roadmap",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    )
  }
}
