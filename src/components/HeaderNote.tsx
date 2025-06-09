"use client"

import type { Note } from "@/types/notes"
import { formatDate } from "@/utils/formatDate"
import useFolderStore from "@/stores/useFolderStore"
import { useState, useEffect } from "react"
import { debounce } from "lodash"
import type React from "react"

interface HeaderNoteProps {
  note: Note
  mode: 'quiz' | 'assistant' | 'flashcards' | 'roadmap' | null;
}

const HeaderNote = ({ note, mode }: HeaderNoteProps) => {
  const date = formatDate(note.updatedAt)
  const { activeFolderId, folders } = useFolderStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const [title, setTitle] = useState(note?.title || "")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    setTitle(note?.title || "")
  }, [note?.id, note?.title])

  const saveTitle = debounce(async (newTitle: string) => {
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
          title: newTitle,
        }),
      })

      if (!response.ok) {
        console.error("Failed to save note title")
      }
    } catch (error) {
      console.error("Error saving note title:", error)
    } finally {
      setIsSaving(false)
    }
  }, 500)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value
    setTitle(newTitle)
    saveTitle(newTitle)
  }

  const currentFolder = folders?.find((folder) => folder.id === activeFolderId)
  if (currentFolder && currentFolder._count.notes === 0) {
    return null
  }

  return (
    <div>
      <p
        className={`${isScrolled ? "opacity-0" : "opacity-100"} transition-opacity duration-200 absolute top-14 left-1/2 -translate-x-1/2 text-center text-grayOpacity text-xs`}
      >
        {date}
      </p>
      {mode !== 'roadmap' && 
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="text-2xl font-bold w-full bg-transparent outline-none"
          placeholder="Titre de la note..."
        />
      }
    </div>
  )
}

export default HeaderNote
