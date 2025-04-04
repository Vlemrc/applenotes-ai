import { Note } from "@/types/notes"
import { formatDate } from "@/utils/formatDate"
import useFolderStore from "@/stores/useFolderStore"
import { useState, useEffect } from "react"

interface HeaderNoteProps {
  note: Note;
}

const HeaderNote = ({ note }: HeaderNoteProps) => {
  const date = formatDate(note.createdAt)
  const { activeFolderId, folders } = useFolderStore()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
      
  },[])

  const currentFolder = folders?.find((folder) => folder.id === activeFolderId)
  if (currentFolder && currentFolder._count.notes === 0) {
    return
  }

  return (
    <div>
      <p className={`${isScrolled ? "opacity-0" : "opacity-100"} transition-opacity duration-200 absolute top-14 left-1/2 -translate-x-1/2 text-center text-grayOpacity text-xs`}>
        {date}
      </p>
      <h2 className="text-2xl font-bold">
        {note.title}
      </h2>
    </div>
  )
}

export default HeaderNote