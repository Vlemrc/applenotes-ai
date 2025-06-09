import { Note } from './notes'

export interface RoadmapItem {
  id: number
  roadmapId: number
  noteId: number
  position: number
  checked: boolean
  note?: Note
}