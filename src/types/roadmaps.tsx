import { RoadmapItem } from './roadmapItems'

export interface Roadmap {
  id: number
  createdAt: string | Date
  updatedAt: string | Date
  title: string
  folderId: number
  items?: RoadmapItem[]
}