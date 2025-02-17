export interface Note {
  id: number
  title: string
  content: string
  date: string
}

export interface NotesLayoutProps {
  notes: Note[]
}

export interface NoteContentProps {
  note: Note
}

export interface NotesNavProps {
  notes: Note[]
  onNoteSelect: (note: Note) => void
  selectedNoteId: number | null
}