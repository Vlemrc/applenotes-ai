"use client"
import type { Note } from "@/types/notes"
import useFolderStore from "@/stores/useFolderStore"
import Paragraph from "../Paragraph"

interface NoteContentProps {
  note: Note
}

const NoteContent = ({ note }: NoteContentProps) => {
  const { activeFolderId, folders } = useFolderStore()

  const currentFolder = folders?.find((folder) => folder.id === activeFolderId)
  if (currentFolder && currentFolder._count.notes === 0) {
    return
  }

  if (note) {
    return (
      <Paragraph key={note.id} content={note.content} />
    )
  }
}

export default NoteContent

