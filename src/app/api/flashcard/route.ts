import { OpenAI } from "openai"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { noteContent, flashcardsCount = 8 } = await req.json()

    if (!noteContent) {
      return new Response(JSON.stringify({ error: "No content provided" }), { status: 400 })
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 25000, // 25 secondes max
    })

    const prompt = `
      Crée des cartes basé sur la note suivante :
      ---
      ${noteContent.slice(0, 4000)} // Limiter la taille du contenu
      ---
      Règles strictes :
      - Il doit y avoir ${flashcardsCount} cartes, pas plus, pas moins.
      - Chaque carte a un champ "question" et un champ "answer".
      - La langue des différentes cartes doit être identique à celle de la note.
      - Chaque question doit être claire et concise. Elle doit faire entre 30 et 150 caractères.
      - Chaque réponse doit être claire et concise. Elle doit faire entre 30 et 150 caractères.
      - Réponds **uniquement** en JSON valide sous la forme suivante :
      
      {
        "flashcards": [
            { "question": "...", "answer": "..." },
            { "question": "...", "answer": "..." }
        ]
      }
      
      **IMPORTANT** : Échappe les guillemets internes avec \\" pour garantir un JSON valide.
      Ne mets aucun texte hors de cet objet JSON, pas de \`\`\` ni commentaire.
    `

    // Utiliser un modèle plus rapide pour la production
    const model = process.env.NODE_ENV === "production" ? "gpt-4o-mini" : "gpt-4"

    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 3000,
    })

    const content = response.choices[0].message.content

    if (!content) {
      throw new Error("No content received from OpenAI")
    }

    // Validation du JSON
    let parsedContent
    try {
      parsedContent = JSON.parse(content)
    } catch (parseError) {
      // Tentative de nettoyage du JSON
      const cleanedContent = content.replace(/```json|```/g, "").trim()
      parsedContent = JSON.parse(cleanedContent)
    }

    return new Response(JSON.stringify(parsedContent), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    })
  } catch (error) {
    console.error("Flashcards API Error:", error)

    if (error.code === "timeout") {
      return new Response(
        JSON.stringify({
          error: "La génération a pris trop de temps. Veuillez réessayer avec un contenu plus court.",
        }),
        { status: 408 },
      )
    }

    return new Response(
      JSON.stringify({
        error: "Erreur lors de la génération des flashcards",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      { status: 500 },
    )
  }
}
