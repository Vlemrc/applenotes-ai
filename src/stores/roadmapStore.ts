import { create } from "zustand"
import { RoadmapItem } from "@/types/roadmapItems"
import { Roadmap } from "@/types/roadmaps"

interface RoadmapStore {
  roadmaps: Record<number, Roadmap[]>
  loadedFolders: Set<number>
  setRoadmaps: (folderId: number, roadmaps: Roadmap[]) => void
  updateRoadmapItem: (folderId: number, itemId: number, checked: boolean) => void
  removeRoadmapItem: (folderId: number, itemId: number) => void
  clearRoadmaps: (folderId: number) => void
  getRoadmapItems: (folderId: number) => RoadmapItem[]
  getCompletionPercentage: (folderId: number) => number
  hasRoadmapData: (folderId: number) => boolean
  isDataLoaded: (folderId: number) => boolean
}

export const useRoadmapStore = create<RoadmapStore>((set, get) => ({
  roadmaps: {},
  loadedFolders: new Set(),

  setRoadmaps: (folderId, roadmaps) =>
    set((state) => ({
      roadmaps: {
        ...state.roadmaps,
        [folderId]: roadmaps,
      },
      loadedFolders: new Set([...state.loadedFolders, folderId]),
    })),

  updateRoadmapItem: (folderId, itemId, checked) =>
    set((state) => {
      const folderRoadmaps = state.roadmaps[folderId] || []
      const updatedRoadmaps = folderRoadmaps.map((roadmap) => ({
        ...roadmap,
        items: roadmap.items.map((item) => (item.id === itemId ? { ...item, checked } : item)),
      }))

      return {
        roadmaps: {
          ...state.roadmaps,
          [folderId]: updatedRoadmaps,
        },
      }
    }),

  removeRoadmapItem: (folderId, itemId) =>
    set((state) => {
      const folderRoadmaps = state.roadmaps[folderId] || []
      const updatedRoadmaps = folderRoadmaps.map((roadmap) => ({
        ...roadmap,
        items: roadmap.items.filter((item) => item.id !== itemId),
      }))

      return {
        roadmaps: {
          ...state.roadmaps,
          [folderId]: updatedRoadmaps,
        },
      }
    }),

  clearRoadmaps: (folderId) =>
    set((state) => {
      const newRoadmaps = { ...state.roadmaps }
      delete newRoadmaps[folderId]
      return { roadmaps: newRoadmaps }
    }),

  getRoadmapItems: (folderId) => {
    const folderRoadmaps = get().roadmaps[folderId] || []
    return folderRoadmaps[0]?.items || []
  },

  getCompletionPercentage: (folderId) => {
    const items = get().getRoadmapItems(folderId)
    if (items.length === 0) return 0
    const checkedItems = items.filter((item) => item.checked).length
    return Math.round((checkedItems / items.length) * 100)
  },

  hasRoadmapData: (folderId) => {
    const folderRoadmaps = get().roadmaps[folderId] || []
    return folderRoadmaps.length > 0 && folderRoadmaps[0]?.items?.length > 0
  },

  isDataLoaded: (folderId) => {
    return get().loadedFolders.has(folderId)
  },
}))
