import { Note } from './notes'
import { Roadmap } from './roadmaps'

export interface Folder {
  _count: any
  id: number
  createdAt: string | Date
  name: string
  notes?: Note[]
  roadmaps?: Roadmap[]
}
