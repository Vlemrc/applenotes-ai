import { dataNotes } from "@/app/dataNotes"
import Quiz from "@/components/main/Quiz"

export default function QuizPage({ params }: { params: { id: string } }) {
  
  const note = dataNotes.find((n) => n.id === Number.parseInt(params.id))
  const date = new Date(note.date).toLocaleString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).replace("à ", "à ")

  return (
    <>
      <p className="absolute top-14 left-1/2 -translate-x-1/2 text-center text-grayOpacity text-xs">{date}</p>
      <h2 className="text-2xl font-bold">{note.title}</h2>
      <Quiz />
    </>
  )
}