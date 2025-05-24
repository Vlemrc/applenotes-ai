"use client"
import { useEffect, useState } from "react"
import type React from "react"

import type { Note } from "@/types/notes"
import useFolderStore from "@/stores/useFolderStore"
import { debounce } from "lodash"

interface NoteContentProps {
  note: Note
}

const NoteContent = ({ note }: NoteContentProps) => {
  const { activeFolderId, folders } = useFolderStore()
  const [content, setContent] = useState(note?.content || "")
  const [isSaving, setIsSaving] = useState(false)
  const [fetchedNote, setFetchedNote] = useState<Note | null>(null)

  // Refetch la note à partir de l'API
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await fetch(`/api/notes?id=${note.id}`)
        if (response.ok) {
          const data = await response.json()
          setFetchedNote(data)
          setContent(data.content)
        } else {
          console.error("Failed to fetch note")
        }
      } catch (error) {
        console.error("Error fetching note:", error)
      }
    }

    if (note?.id) {
      fetchNote()
    }
  }, [note?.id])

  const saveNote = debounce(async (newContent: string) => {
    if (!note) return

    setIsSaving(true)
    try {
      const response = await fetch("/api/notes", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: note.id,
          content: newContent,
        }),
      })

      if (!response.ok) {
        console.error("Failed to save note")
      }
    } catch (error) {
      console.error("Error saving note:", error)
    } finally {
      setIsSaving(false)
    }
  }, 500)

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setContent(newContent)
    saveNote(newContent)
  }

  const currentFolder = folders?.find((folder) => folder.id === activeFolderId)
  if (currentFolder && currentFolder._count.notes === 0) {
    return null
  }

  if (!note) {
    return null
  }

  return (
    <div className="relative h-full w-full">
      <textarea
        value={content}
        onChange={handleContentChange}
        className="w-full h-full resize-none outline-none bg-transparent text-sm pb-6"
        placeholder="Note..."
        autoFocus
      />
      {isSaving && <div className="absolute bottom-2 right-2 text-xs text-gray-400">Enregistrement...</div>}
    </div>
  )
}

export default NoteContent