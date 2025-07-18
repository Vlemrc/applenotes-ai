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
import { useRoadmapItem } from "@/utils/useRoadmapItem"
import { useRoadmapItemStore } from "@/stores/roadmapItemStore"

interface HeaderNoteProps {
  note: Note
  mode: "quiz" | "assistant" | "flashcards" | "roadmap" | null
  onResetMode: () => void
  onNoteUpdate?: (updatedNote: Note) => void 
}

const HeaderNote = ({ note, mode, onResetMode, onNoteUpdate }: HeaderNoteProps) => {
  const date = formatDate(note.updatedAt)
  const { activeFolderId, folders } = useFolderStore()
  const [title, setTitle] = useState(note?.title || "")
  const [isSaving, setIsSaving] = useState(false)
  const { isLearningMode } = useLearningModeStore()

  const { setRoadmapItems, hasItemsForNote, refreshItemsFromAPI } = useRoadmapItemStore()

  const { item, isChecked, updateChecked } = useRoadmapItem(note.id)

  useEffect(() => {
    setTitle(note?.title || "")
  }, [note?.id, note?.title])

  useEffect(() => {
    if (note.roadmapItems && note.roadmapItems.length > 0) {
      if (!hasItemsForNote(note.id)) {
        setRoadmapItems(note.id, note.roadmapItems)
      }
    }
  }, [note.id, note.roadmapItems, setRoadmapItems, hasItemsForNote, refreshItemsFromAPI])

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
      } else {
        if (onNoteUpdate) {
          const updatedNote = { ...note, title: newTitle }
          onNoteUpdate(updatedNote)
        }
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
    if (!item) {
      return
    }
    const success = await updateChecked(!isChecked)

    if (!success) {
    }
  }

  const handleRefreshData = async () => {
    await refreshItemsFromAPI(note.id)
  }

  const currentFolder = folders?.find((folder) => folder.id === activeFolderId)
  if (currentFolder && currentFolder._count.notes === 0) {
    return null
  }

  return (
    <div>
      <p className={`text-center text-grayOpacity text-xs`}>{date}</p>
      <Breadcrumb note={note} mode={mode} onResetMode={onResetMode} />
      {mode !== "roadmap" && (
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className={`${mode ? "" : "pt-4"} text-2xl font-bold w-full bg-transparent outline-none pb-1`}
          placeholder="Titre de la note..."
        />
      )}
      {isLearningMode && mode !== "roadmap" && item && currentFolder?.roadmaps.length > 0 && (
        <div className="flex items-center gap-2 absolute right-4 top-16">
          <button className="flex flex-row items-center gap-2" onClick={toggleItemCheck}>
            <div
              className={`${isChecked ? "bg-yellow-gradient" : "bg-grayLight"} h-4 w-4 rounded-full cursor-pointer flex items-center justify-center transition-colors duration-200`}
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
        </div>
      )}
    </div>
  )
}

export default HeaderNote
