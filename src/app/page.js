import Leftbar from "@/components/main/Leftbar";
import NotesLayout from "@/components/main/NotesLayout";
import { dataNotes } from "./dataNotes"

export default function Home() {
  return (
    <main className="flex flex-row h-full">
      <Leftbar />
      <div className="relative flex flex-col w-full">
        <NotesLayout notes={dataNotes} />
      </div>
    </main>
  );
}