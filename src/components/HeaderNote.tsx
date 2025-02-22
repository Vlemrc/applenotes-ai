import { Note } from "@/types/notes"
import { formatDate } from "@/utils/formatDate"

interface HeaderNoteProps {
  note: Note;
}

const HeaderNote = ({ note }: HeaderNoteProps) => {
  const date = formatDate(note.createdAt)

  return (
    <div>
      <p className="absolute top-14 left-1/2 -translate-x-1/2 text-center text-grayOpacity text-xs">
        {date}
      </p>
      <h2 className="text-2xl font-bold">
        {note.title}
      </h2>
    </div>
  )
}

export default HeaderNote