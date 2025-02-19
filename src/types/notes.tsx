export interface Folder {
  id: number
  createdAt: string | Date
  name: string
  notes?: Note[]
}

export interface Note {
  id: number
  createdAt: string | Date
  updatedAt: string | Date
  title: string
  content: string
  folderId: number
  folder?: Folder
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