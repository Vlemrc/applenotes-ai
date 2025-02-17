"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import NoteContent from "../NoteContent"
import NotesNav from "../NotesNav"
import LeftbarNav from "../LeftbarNav"
import ActionsNav from "../ActionsNav"
import AiButton from "@/components/AiButton"
import { Note, NotesLayoutProps } from "@/types/notes"

const NotesLayout = ({ notes }: NotesLayoutProps) => {
  const [selectedNote, setSelectedNote] = useState<Note | null>(() => notes[0] || null)
  const router = useRouter()

  const handleNoteSelect = (note: Note): void => {
    setSelectedNote(note)
    router.push(`/?id=${note.id}`, undefined, { shallow: true })
  }

  if (!notes || notes.length === 0) {
    return <div>Aucune note disponible</div>
  }

  return (
    <div className="flex h-screen">
      <div className="w-1/3 h-full border-r border-solid border-gray flex flex-col">
        <LeftbarNav />
        <NotesNav notes={notes} onNoteSelect={handleNoteSelect} selectedNoteId={selectedNote?.id || null}  />
      </div>
      <div className="w-full relative">
        <ActionsNav />
        {selectedNote && <NoteContent note={selectedNote} />}
        <AiButton />
      </div>
    </div>
  )
}

export default NotesLayout