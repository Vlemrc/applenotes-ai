import { OpenAI } from "openai"
import type { NextRequest } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { noteContent, questionCount = 8 } = await req.json()

    if (!noteContent) {
      return new Response(JSON.stringify({ error: "No content provided" }), { status: 400 })
    }

    // Limiter le nombre de questions pour éviter les timeouts
    const limitedQuestionCount = Math.min(questionCount, 10)

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 25000,
    })

    const prompt = `
      Crée un quiz basé sur la note suivante :
      ---
      ${noteContent.slice(0, 4000)} // Limiter la taille
      ---
      Règles strictes :
      - Il doit y avoir ${limitedQuestionCount} questions.
      - La langue du quiz doit être identique à celle de la note.
      - Chaque question doit avoir exactement 4 réponses possibles.
      - Une seule réponse correcte par question.
      - Les réponses incorrectes doivent être plausibles et pertinentes.
      - Réponds **uniquement** en JSON valide sous la forme suivante :
      
      {
        "questions": [
          {
            "question": "...",
            "answers": [
              { "text": "...", "correct": false },
              { "text": "...", "correct": true },
              { "text": "...", "correct": false },
              { "text": "...", "correct": false }
            ]
          }
        ]
      }
      
      **IMPORTANT** : Échappe les guillemets internes avec \\" pour garantir un JSON valide.
    `

    const model = process.env.NODE_ENV === "production" ? "gpt-4o-mini" : "gpt-4"

    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 3000
    })

    const content = response.choices[0].message.content

    if (!content) {
      throw new Error("No content received from OpenAI")
    }

    let parsedContent
    try {
      parsedContent = JSON.parse(content)
    } catch (parseError) {
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
    console.error("Quiz API Error:", error)

    if (error.code === "timeout") {
      return new Response(
        JSON.stringify({
          error: "La génération a pris trop de temps. Veuillez réessayer.",
        }),
        { status: 408 },
      )
    }

    return new Response(
      JSON.stringify({
        error: "Erreur lors de la génération du quiz",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      { status: 500 },
    )
  }
}
