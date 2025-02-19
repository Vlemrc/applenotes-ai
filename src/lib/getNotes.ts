export async function getNotes() {
  // En développement, utiliser localhost
  // En production, utiliser l'URL de Vercel
  const baseUrl = process.env.NODE_ENV === "production" ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"

  try {
    const res = await fetch(`${baseUrl}/api/notes`, {
      next: { revalidate: 10 },
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json()
    console.log("Fetched notes:", data) // Pour le débogage
    return data
  } catch (error) {
    console.error("Error fetching notes:", error)
    return [] // Retourner un tableau vide en cas d'erreur
  }
}

