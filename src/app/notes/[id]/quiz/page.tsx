import { notFound } from "next/navigation"
import Quiz from "@/components/main/Quiz"
import { getNotes } from "@/lib/getNotes"
import { formatDate } from "@/utils/formatDate"

export default async function QuizPage({ params }: { params: { id: string } }) {
  const notes = await getNotes()
  const note = notes.find((n) => n.id === Number.parseInt(params.id))

  if (!note) {
    notFound()
  }

  const date = formatDate(note.createdAt)

  return (
    <>
      <p className="absolute top-14 left-1/2 -translate-x-1/2 text-center text-grayOpacity text-xs">{date}</p>
      <h2 className="text-2xl font-bold">{note.title}</h2>
      <Quiz />
    </>
  )
}