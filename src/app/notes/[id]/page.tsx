import { dataNotes } from "@/app/dataNotes"
import { notFound } from "next/navigation"
import NoteContent from "@/components/main/NoteContent"
import { use } from "react"

export default function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const note = dataNotes.find((n) => n.id === Number.parseInt(resolvedParams.id))

  if (!note) {
    notFound()
  }

  return (
    <NoteContent note={note} />
  )
}