"use client"

import type { Note } from "@/types/notes"
import { useLearningModeStore } from "@/stores/learningModeStore"
import { useRoadmapItem } from "@/utils/useRoadmapItem"
import { useRoadmapItemStore } from "@/stores/roadmapItemStore"
import { useEffect } from "react"

interface NoteItemProps {
  note: Note
  isActive: boolean
  nextIsActive?: boolean
  isTopNote?: boolean
  onClick: () => void
}

const NoteItem = ({ note, isActive, nextIsActive, isTopNote, onClick }: NoteItemProps) => {
  const { isLearningMode } = useLearningModeStore()
  const { setRoadmapItems, hasItemsForNote } = useRoadmapItemStore()

  // Utilisation du hook pour récupérer l'état
  const { item, isChecked } = useRoadmapItem(note.id)

  // Initialiser le store seulement si on n'a pas déjà les données
  useEffect(() => {
    if (note.roadmapItems && note.roadmapItems.length > 0) {
      if (!hasItemsForNote(note.id)) {
        console.log("NoteItem: Initializing store with roadmap items for note", note.id)
        setRoadmapItems(note.id, note.roadmapItems)
      } else {
        console.log("NoteItem: Store already has data for note", note.id)
      }
    }
  }, [note.id, note.roadmapItems, setRoadmapItems, hasItemsForNote])

  const date = new Date(note.updatedAt).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  // Debug: afficher l'état actuel
  console.log(`NoteItem ${note.id} render - item:`, item, "isChecked:", isChecked)

  return (
    <ul
      onClick={onClick}
      className={`cursor-pointer ${isActive || nextIsActive ? "" : "border-nav-note"} ${isTopNote ? "mt-3" : ""}`}
    >
      <li className={`${isActive ? "bg-gray" : "bg-white"} pt-3 pl-7 w-full rounded-md transition-colors`}>
        <h6 className="font-black text-sm text-left">
          {note.title.length > 30 ? note.title.slice(0, 30) + "…" : note.title}
        </h6>

        <div className={`flex flex-row gap-2.5 pr-7 ${item ? "" : "pb-[12px]"} ${isLearningMode ? "" : "pb-[12px]"}`}>
          <p className="text-medium text-xs">{date}</p>
          <p className="truncate-text text-grayDark text-xs">
            {note.content
              ? note.content.length > 30
                ? note.content.slice(0, 30) + "…"
                : note.content
              : "Pas d'autre texte"}
          </p>
        </div>

        {isLearningMode &&
          item &&
          (isChecked ? (
            <p className="text-medium text-xs text-yellowLight font-semibold pb-[12px] pt-0.5">Maitrisé</p>
          ) : (
            <p className="text-medium text-xs text-grayOpacity font-semibold pb-[12px] pt-0.5">À explorer</p>
          ))}
      </li>
    </ul>
  )
}

export default NoteItem
