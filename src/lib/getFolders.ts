export async function getFolders() {
  try {
    const res = await fetch('/api/folders', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!res.ok) throw new Error("Failed to fetch folders")
    return res.json()
  } catch (error) {
    console.error("Error fetching folders:", error)
    return []
  }
}

export async function getNotesByFolder(folderId: number) {
  try {
    const res = await fetch(`/api/notes?folderId=${folderId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    if (!res.ok) throw new Error("Failed to fetch notes")
    return res.json()
  } catch (error) {
    console.error("Error fetching notes by folder:", error)
    return []
  }
}