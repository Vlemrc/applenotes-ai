"use client"
import { Note } from "@/types/notes"
import useFolderStore from '@/stores/useFolderStore'
import { formatDate } from "@/utils/formatDate"

interface NoteContentProps {
  note: Note
}

const NoteContent = ({ note }: NoteContentProps) => {
  const { activeFolderId, folders } = useFolderStore();

  const currentFolder = folders?.find(folder => folder.id === activeFolderId);
  console.log(currentFolder)
    if ( currentFolder && currentFolder._count.notes === 0) {
      return
    }

  if (note) {
    return (
        <p className="text-sm mt-2.5">{note.content}</p>
    )
  }
}

export default NoteContent