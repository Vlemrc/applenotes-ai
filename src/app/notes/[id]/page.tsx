import { notFound } from "next/navigation"
import NoteContent from "@/components/main/NoteContent"
import { getNotes } from "@/lib/getNotes"

export default async function NotePage({ params }: { params: { id: string } }) {
  const notes = await getNotes()
  const note = notes.find((n) => n.id === Number.parseInt(params.id))

  if (!note) {
    notFound()
  }

  return <NoteContent note={note} />
}

