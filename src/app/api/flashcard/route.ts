import { OpenAI } from "openai";

export async function POST(req: Request) {
  try {
    const { noteContent, flashcardsCount = 8 } = await req.json();

    if (!noteContent) {
      return new Response(JSON.stringify({ error: "No content provided" }), { status: 400 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `
      Crée des cartes basé sur la note suivante :
      ---
      ${noteContent}
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
            { "question": "...", "answer": "..." },
            ...
        ]
      }
      
      **IMPORTANT** : Échappe les guillemets internes avec \\" pour garantir un JSON valide.
      Ne mets aucun texte hors de cet objet JSON, pas de \`\`\` ni commentaire. Le JSON doit être valide et se conformer à ces règles.
      Le JSON doit se terminer proprement, sans espace ou caractère supplémentaire.
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
