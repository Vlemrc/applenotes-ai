import NoteItem from "./NoteItem";
import { Note, NotesNavProps } from "@/types/notes"

export default function NotesNav({ notes, onNoteSelect, selectedNoteId }: NotesNavProps) {

  if (!notes) {
    return <div>Chargement...</div>;
  }

  return (
    <ul className="p-2.5 overflow-scroll">
      {Array.isArray(notes) && notes.map((note) => (
        <NoteItem key={note.id} note={note} onNoteSelect={onNoteSelect} selectedNoteId={selectedNoteId} />
      ))}
    </ul>
  )
}