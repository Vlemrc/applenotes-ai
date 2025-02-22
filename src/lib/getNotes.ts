export async function getNotes() {
  const url = '/api/notes'

  try {
    const res = await fetch(url, {
      next: { revalidate: 10 },
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error fetching notes:", error)
    return []
  }
}