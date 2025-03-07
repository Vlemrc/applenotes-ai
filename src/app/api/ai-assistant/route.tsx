import { OpenAI } from "openai";

export async function POST(req: Request) {
  try {
    const { noteContent, userMessage } = await req.json();

    if (!userMessage || !noteContent) {
      return new Response(JSON.stringify({ error: "Message ou contenu de la note manquant" }), { status: 400 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `
      Voici le contenu de la note de l'utilisateur :
      ---
      ${noteContent}
      ---
      L'utilisateur pose la question suivante :
      "${userMessage}"
      
      Réponds de manière claire et concise, en respectant le contexte de la note. Utilise un ton neutre et professionnel.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const aiResponse = response.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
