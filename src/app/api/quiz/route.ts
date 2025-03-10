import { OpenAI } from "openai";

export async function POST(req: Request) {
  try {
    const { noteContent, questionCount = 8 } = await req.json();

    if (!noteContent) {
      return new Response(JSON.stringify({ error: "No content provided" }), { status: 400 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `
      Crée un quiz basé sur la note suivante :
      ---
      ${noteContent}
      ---
      Règles strictes :
      - Il doit y avoir ${questionCount} questions.
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
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const quizJson = response.choices[0].message.content;

    return new Response(quizJson, { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
