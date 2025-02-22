import { Note } from './notes'

export interface Folder {
  _count: any
  id: number
  createdAt: string | Date
  name: string
  notes?: Note[]
}
