import { OpenAI } from "openai"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(req: Request) {
  try {
    const { action, folderId, itemId, checked } = await req.json()

    switch (action) {
      case "generate":
        return await generateRoadmap(folderId)
      case "fetch":
        return await fetchRoadmaps(folderId)
      case "updateItem":
        return await updateRoadmapItem(itemId, checked)
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
          createdAt: existingRoadmap.createdAt
        }
      }), 
      { status: 409 } // 409 Conflict
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