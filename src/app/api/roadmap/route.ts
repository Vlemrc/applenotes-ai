import { OpenAI } from "openai"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
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
        return await deleteRoadmap(roadmapId) // Utilisation du bon paramètre
      case "regenerate":
        return await regenerateRoadmap(folderId)
      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 })
    }
  } catch (error) {
    console.error("Error in roadmap API:", error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}

async function generateRoadmap(folderId: string) {
  if (!folderId) {
    return new Response(JSON.stringify({ error: "No folder ID provided" }), { status: 400 })
  }

  // Vérifier si une roadmap existe déjà pour ce dossier
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
      { status: 409 }, // 409 Conflict
    )
  }

  // Récupérer toutes les notes du dossier
  const notes = await prisma.note.findMany({
    where: { folderId: Number.parseInt(folderId) },
    select: { id: true, title: true },
  })

  if (notes.length === 0) {
    return new Response(JSON.stringify({ error: "No notes found in this folder" }), { status: 404 })
  }

  // Récupérer le nom du dossier
  const folder = await prisma.folder.findUnique({
    where: { id: Number.parseInt(folderId) },
    select: { name: true },
  })

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

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
          "reasoning": "courte explication de pourquoi cette note vient à cette position"
        }
      ]
    }
    
    **IMPORTANT** : 
    - Utilise exactement les titres fournis, sans modification
    - Échappe les guillemets internes avec \\" pour garantir un JSON valide
    - L'ordre doit être logique pour l'apprentissage progressif
  `

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
  })

  const aiResponse = JSON.parse(response.choices[0].message.content || "{}")

  // Créer la roadmap en base de données
  const roadmap = await prisma.roadmap.create({
    data: {
      title: aiResponse.roadmapTitle || `Roadmap - ${folder?.name}`,
      folderId: Number.parseInt(folderId),
    },
  })

  // Créer les items de la roadmap
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

  // Trier les items par position
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
      return new Response(
        JSON.stringify({
          error: "ID de roadmap manquant",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Supprimer d'abord tous les items de la roadmap
    await prisma.roadmapItem.deleteMany({
      where: { roadmapId: roadmapId },
    })

    // Ensuite supprimer la roadmap elle-même
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
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("Error deleting roadmap:", error)
    return new Response(
      JSON.stringify({
        error: "Erreur lors de la suppression de la roadmap",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

async function regenerateRoadmap(folderId: string) {
  if (!folderId) {
    return new Response(JSON.stringify({ error: "No folder ID provided" }), { status: 400 })
  }

  try {
    // Supprimer l'ancienne roadmap si elle existe
    const existingRoadmap = await prisma.roadmap.findFirst({
      where: { folderId: Number.parseInt(folderId) },
    })

    if (existingRoadmap) {
      // Supprimer d'abord tous les items de l'ancienne roadmap
      await prisma.roadmapItem.deleteMany({
        where: { roadmapId: existingRoadmap.id },
      })

      // Ensuite supprimer l'ancienne roadmap
      await prisma.roadmap.delete({
        where: { id: existingRoadmap.id },
      })
    }

    // Récupérer toutes les notes du dossier
    const notes = await prisma.note.findMany({
      where: { folderId: Number.parseInt(folderId) },
      select: { id: true, title: true },
    })

    if (notes.length === 0) {
      return new Response(JSON.stringify({ error: "No notes found in this folder" }), { status: 404 })
    }

    // Récupérer le nom du dossier
    const folder = await prisma.folder.findUnique({
      where: { id: Number.parseInt(folderId) },
      select: { name: true },
    })

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

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
            "reasoning": "courte explication de pourquoi cette note vient à cette position"
          }
        ]
      }
      
      **IMPORTANT** : 
      - Utilise exactement les titres fournis, sans modification
      - Échappe les guillemets internes avec \\" pour garantir un JSON valide
      - L'ordre doit être logique pour l'apprentissage progressif
    `

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    })

    const aiResponse = JSON.parse(response.choices[0].message.content || "{}")

    // Créer la nouvelle roadmap en base de données
    const roadmap = await prisma.roadmap.create({
      data: {
        title: aiResponse.roadmapTitle || `Roadmap - ${folder?.name}`,
        folderId: Number.parseInt(folderId),
      },
    })

    // Créer les items de la roadmap
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

    // Trier les items par position
    roadmapItems.sort((a, b) => a.position - b.position)

    const result = {
      roadmap: {
        id: roadmap.id,
        title: roadmap.title,
        createdAt: roadmap.createdAt,
      },
      items: roadmapItems,
      message: "Roadmap régénérée avec succès",
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error regenerating roadmap:", error)
    return new Response(
      JSON.stringify({
        error: "Erreur lors de la régénération de la roadmap",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
