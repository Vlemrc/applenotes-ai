"use client"
import type { Note } from "@/types/notes"
import { useLearningModeStore } from '@/stores/learningModeStore';

interface NoteItemProps {
  note: Note
  isActive: boolean
  nextIsActive?: boolean
  isTopNote?: boolean
  onClick: () => void
  isChecked?: boolean
}

const NoteItem = ({ note, isActive, nextIsActive, isTopNote, onClick, isChecked }: NoteItemProps) => {
  const { isLearningMode } = useLearningModeStore()
  const date = new Date(note.updatedAt).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  return (
    <ul
      onClick={onClick}
      className={`cursor-pointer ${isActive || nextIsActive ? "" : "border-nav-note"} ${isTopNote ? "mt-3" : ""}`}
    >
      <li className={`${isActive ? "bg-gray" : "bg-white"} pt-3 pl-7 w-full rounded-md transition-colors`}>
        <h6 className="font-black text-sm text-left">{note.title}</h6>
        <div className={`flex flex-row gap-2.5 pr-7 ${isLearningMode ? "" : "pb-[12px]"}`}>
          <p className="text-medium text-xs">{date}</p>
          <p className="truncate-text text-grayDark text-xs">{note.content ? note.content : "Pas d'autre texte"}</p>
        </div>
        {isLearningMode && (
          isChecked ? (
            <p className="text-medium text-xs text-green-600 pb-[12px] pt-0.5">Maitrisé</p>
          ) : (
            <p className="text-medium text-xs text-red-800 pb-[12px] pt-0.5">À explorer</p>
          )
        )}
      </li>
    </ul>
  )
}

export default NoteItem

