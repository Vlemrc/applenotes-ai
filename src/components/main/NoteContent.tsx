import { Note } from "@/types/notes"

interface NoteContentProps {
  note: Note
}

const NoteContent = ({ note }: NoteContentProps) => {

  const date = new Date(note.createdAt).toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).replace("à ", "à ")

  return (
    <>
      <p className="absolute top-14 left-1/2 -translate-x-1/2 text-center text-grayOpacity text-xs">{date}</p>
      <h2 className="text-2xl font-bold mb-2.5">{note.title}</h2>
      <p className="text-sm">{note.content}</p>
    </>
  )
}

export default NoteContent