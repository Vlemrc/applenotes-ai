import OpenAI from "openai"
import type { NextRequest } from "next/server"
export const runtime = "nodejs";   // déploie en Node Function (pas Edge)
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { noteContent, questionCount = 8, complexity = "moyen" } = await req.json()

    // Validation plus robuste du contenu
    if (!noteContent || typeof noteContent !== 'string' || noteContent.trim().length === 0) {
      return new Response(JSON.stringify({ 
        error: "Contenu de note manquant ou invalide",
        details: "Le contenu de la note est requis pour générer un quiz"
      }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }

    // Vérifier que le contenu est suffisant
    const wordCount = noteContent.trim().split(/\s+/).length
    if (wordCount < 10) {
      return new Response(JSON.stringify({ 
        error: "Note trop courte",
        details: `La note doit contenir au moins 10 mots (actuellement: ${wordCount} mots)`
      }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }

    const limitedQuestionCount = Math.min(Math.max(questionCount, 3), 15)

    // Vérifier que l'API key existe
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY manquante")
      return new Response(JSON.stringify({ 
        error: "Configuration serveur incorrecte",
        details: "Clé API OpenAI manquante"
      }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      })
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      timeout: 60000,
    })

    const getComplexityInstructions = (level: string) => {
      switch (level) {
        case "facile":
          return "Les questions doivent être simples et directes, portant sur les faits et concepts de base présents dans la note."
        case "moyen":
          return "Les questions doivent être équilibrées, mélangeant des questions factuelles et des questions nécessitant une compréhension plus approfondie."
        case "difficile":
          return "Les questions doivent être complexes, nécessitant une analyse approfondie, des connexions entre concepts et une réflexion critique."
        default:
          return "Les questions doivent être équilibrées, mélangeant des questions factuelles et des questions nécessitant une compréhension plus approfondie."
      }
    }

    const prompt = `
      Crée un quiz basé sur la note suivante :
      ---
      ${noteContent}
      ---
      Règles strictes :
      - Il doit y avoir exactement ${limitedQuestionCount} questions.
      - Complexité : ${complexity.toUpperCase()}
      - ${getComplexityInstructions(complexity)}
      - La langue du quiz doit être identique à celle de la note.
      - Chaque question doit avoir exactement 4 réponses possibles.
      - Une seule réponse correcte par question.
      - Les réponses incorrectes doivent être plausibles et pertinentes.
      - Réponds **uniquement** en JSON valide sous la forme suivante :
      
      {
        "questions": [
          {
            "question": "Votre question ici",
            "answers": [
              { "text": "Réponse A", "correct": false },
              { "text": "Réponse B", "correct": true },
              { "text": "Réponse C", "correct": false },
              { "text": "Réponse D", "correct": false }
            ]
          }
        ]
      }
      
      **IMPORTANT** : 
      - Échappe tous les guillemets internes avec \\"
      - N'inclus AUCUN texte avant ou après le JSON
      - Assure-toi que le JSON est parfaitement valide
    `

    console.log(`Génération quiz - Mots: ${wordCount}, Questions: ${limitedQuestionCount}, Complexité: ${complexity}`)

    const model = "gpt-4o"

    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: "user", content: prompt }],
      temperature: complexity === "difficile" ? 0.8 : complexity === "facile" ? 0.5 : 0.7,
      max_tokens: 5000,
    })

    const content = response.choices[0].message.content

    if (!content) {
      throw new Error("Aucun contenu reçu d'OpenAI")
    }

    console.log("Réponse OpenAI reçue, tentative de parsing...")

    let parsedContent
    try {
      // Nettoyer le contenu de potentiels marqueurs de code
      const cleanedContent = content
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim()
      
      parsedContent = JSON.parse(cleanedContent)
      
      // Validation de la structure
      if (!parsedContent.questions || !Array.isArray(parsedContent.questions)) {
        throw new Error("Structure de questions invalide")
      }

      if (parsedContent.questions.length === 0) {
        throw new Error("Aucune question générée")
      }

      // Validation de chaque question
      for (let i = 0; i < parsedContent.questions.length; i++) {
        const question = parsedContent.questions[i]
        if (!question.question || !question.answers || !Array.isArray(question.answers)) {
          throw new Error(`Question ${i + 1} mal formatée`)
        }
        
        if (question.answers.length !== 4) {
          throw new Error(`Question ${i + 1} doit avoir exactement 4 réponses`)
        }

        const correctAnswers = question.answers.filter(a => a.correct === true)
        if (correctAnswers.length !== 1) {
          throw new Error(`Question ${i + 1} doit avoir exactement une réponse correcte`)
        }
      }

      console.log(`Quiz généré avec succès: ${parsedContent.questions.length} questions`)

    } catch (parseError) {
      console.error("Erreur de parsing JSON:", parseError)
      console.error("Contenu reçu:", content)
      
      return new Response(JSON.stringify({
        error: "Erreur de format dans la réponse générée",
        details: `Impossible de parser la réponse: ${parseError.message}`,
        rawContent: process.env.NODE_ENV === "development" ? content : undefined
      }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      })
    }

    return new Response(JSON.stringify(parsedContent), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      },
    })

  } catch (error) {
    console.error("Erreur Quiz API:", error)

    // Gestion spécifique des erreurs OpenAI
    if (error.code === "timeout") {
      return new Response(JSON.stringify({
        error: "Timeout",
        details: "La génération a pris trop de temps. Veuillez réessayer."
      }), { 
        status: 408,
        headers: { "Content-Type": "application/json" }
      })
    }

    if (error.code === "insufficient_quota") {
      return new Response(JSON.stringify({
        error: "Quota insuffisant",
        details: "Limite de l'API OpenAI atteinte"
      }), { 
        status: 429,
        headers: { "Content-Type": "application/json" }
      })
    }

    if (error.code === "invalid_api_key") {
      return new Response(JSON.stringify({
        error: "Clé API invalide",
        details: "Vérifiez la configuration de la clé OpenAI"
      }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      })
    }

    return new Response(JSON.stringify({
      error: "Erreur lors de la génération du quiz",
      details: process.env.NODE_ENV === "development" ? error.message : "Une erreur inattendue s'est produite",
      errorCode: error.code || "unknown"
    }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}