import Leftbar from "@/components/main/Leftbar";
import { dataNotes } from "./dataNotes";
import { redirect } from "next/navigation"

export default function Home() {
  if (dataNotes.length > 0) {
    redirect(`/notes/${dataNotes[0].id}`)
  }

  return (
    <main className="flex flex-row h-full">
      <Leftbar />
      <div className="relative flex flex-col w-full">
      </div>
    </main>
  );
}