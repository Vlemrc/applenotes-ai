import { dataNotes } from "@/app/dataNotes"
import { notFound } from "next/navigation"
import NoteContent from "@/components/main/NoteContent"

export default function NotePage({ params }: { params: { id: string } }) {
  const note = dataNotes.find((n) => n.id === Number.parseInt(params.id))

  if (!note) {
    notFound()
  }
  return (
    <NoteContent note={note} />
  )
}
