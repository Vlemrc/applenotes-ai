"use client"

import type { Note } from "@/types/notes"
import { formatDate } from "@/utils/formatDate"
import useFolderStore from "@/stores/useFolderStore"
import { useState, useEffect } from "react"
import { debounce } from "lodash"
import type React from "react"
import { useLearningModeStore } from "@/stores/learningModeStore"
import Image from "next/image"
import Breadcrumb from "./Breadcrumb"

interface HeaderNoteProps {
  note: Note
  mode: "quiz" | "assistant" | "flashcards" | "roadmap" | null
  onResetMode: () => void;
}

const HeaderNote = ({ note, mode, onResetMode }: HeaderNoteProps) => {
  const date = formatDate(note.updatedAt)
  const { activeFolderId, folders } = useFolderStore()
  const [title, setTitle] = useState(note?.title || "")
  const [isSaving, setIsSaving] = useState(false)
  const { isLearningMode } = useLearningModeStore()
  const [isChecked, setIsChecked] = useState(note.roadmapItems[0]?.checked || false)

  useEffect(() => {
    setTitle(note?.title || "")
  }, [note?.id, note?.title])

  useEffect(() => {
    if (note.roadmapItems && note.roadmapItems.length > 0) {
      setIsChecked(note.roadmapItems[0].checked)
    }
  }, [note.roadmapItems])

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

  const toggleItemCheck = async () => {
    if (!note.roadmapItems || note.roadmapItems.length === 0) return

    const itemId = note.roadmapItems[0].id
    const newCheckedState = !isChecked

    try {
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "updateItem",
          itemId: itemId,
          checked: newCheckedState,
        }),
      })

      if (response.ok) {
        setIsChecked(newCheckedState)
      } else {
        console.error("Failed to update item status")
      }
    } catch (error) {
      console.error("Error updating item status:", error)
    }
  }

  const currentFolder = folders?.find((folder) => folder.id === activeFolderId)
  if (currentFolder && currentFolder._count.notes === 0) {
    return null
  }

  return (
    <div>
      <p className={`text-center text-grayOpacity text-xs`}>{date}</p>
      <Breadcrumb note={note} mode={mode} onResetMode={onResetMode}  />
      {mode !== "roadmap" && (
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className={`${mode ? "" : "pt-4"} text-2xl font-bold w-full bg-transparent outline-none pb-1`}
          placeholder="Titre de la note..."
        />
      )}
      {isLearningMode && mode !== "roadmap" && note.roadmapItems[0] && (
        <button className="flex flex-row items-center gap-2 absolute right-4 top-16" onClick={toggleItemCheck}>
          <div
            className={`${isChecked ? "bg-yellow-gradient" : "bg-grayLight"} h-4 w-4 rounded-full cursor-pointer flex items-center justify-center`}
          >
            {isChecked ? (
              <Image src="/checkmark.svg" width={7} height={7} alt="acquis" />
            ) : (
              <Image src="/encours.svg" width={7} height={7} alt="en cours d'acquisition" />
            )}
          </div>
          {isChecked ? (
            <p className="text-sm font-semibold text-yellowLight translate-y-[0.5px]">Maitrisé</p>
          ) : (
            <p className="text-sm font-semibold text-grayOpacity translate-y-[0.5px]">À explorer</p>
          )}
        </button>
      )}
    </div>
  )
}

export default HeaderNote
