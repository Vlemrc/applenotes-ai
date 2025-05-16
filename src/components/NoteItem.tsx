"use client"
import type { Note } from "@/types/notes"

interface NoteItemProps {
  note: Note
  isActive: boolean
  nextIsActive?: boolean
  isTopNote?: boolean
  onClick: () => void
}

const NoteItem = ({ note, isActive, nextIsActive, isTopNote, onClick }: NoteItemProps) => {
  const date = new Date(note.updatedAt).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer ${isActive || nextIsActive ? "" : "border-nav-note"} ${isTopNote ? "mt-3" : ""}`}
    >
      <li className={`${isActive ? "bg-gray" : "bg-white"} pt-3 pl-7 w-full rounded-md transition-colors`}>
        <h6 className="font-black text-sm text-left">{note.title}</h6>
        <div className="flex flex-row gap-2.5 pb-[12px] pr-7">
          <p className="text-medium text-xs">{date}</p>
          <p className="truncate-text text-grayDark text-xs">{note.content ? note.content : "Pas d'autre texte"}</p>
        </div>
      </li>
    </div>
  )
}

export default NoteItem

