import { dataNotes } from "@/app/dataNotes"
import AiHelpExtend from "@/components/AiHelpExtend"
import AiInput from "@/components/AiInput"
import { use } from "react"

export default function AssistantIAPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const note = dataNotes.find((n) => n.id === Number.parseInt(resolvedParams.id))
  
  if (!note) {
    return null
  }

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
      <AiHelpExtend />
      <AiInput />
    </>
  )
}