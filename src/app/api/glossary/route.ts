import { OpenAI } from "openai";

export async function POST(req: Request) {
  try {
    const { noteContent } = await req.json();

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
      - Ne crée que des entrées vraiment utiles pour l’apprentissage (mots-clés, concepts, lieux, dates importantes, personnages, etc.)
      - Chaque terme est composé de deux champs : "term" (le mot ou concept à retenir) et "definition" (sa courte explication).
      - La langue des définitions doit être la même que celle de la note.
      - Chaque "term" doit faire entre 1 et 3 mots maximum.
      - Chaque "definition" doit être claire, concise et informative (30 à 150 caractères).
      - Réponds **uniquement** en JSON valide sous la forme suivante :
      
      {
            "glossary": [
                { "term": "Mot-clé 1", "definition": "Définition concise 1" },
                { "term": "Mot-clé 2", "definition": "Définition concise 2" },
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

    const glossaryContent = response.choices[0].message.content

    return new Response(glossaryContent, { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
