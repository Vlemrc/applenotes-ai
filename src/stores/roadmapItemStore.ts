import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import type { RoadmapItem } from "@/types/roadmapItems"

interface RoadmapItemStore {
  roadmapItems: Record<number, RoadmapItem[]>
  updateRoadmapItem: (noteId: number, itemId: number, checked: boolean) => void
  removeRoadmapItem: (noteId: number, itemId: number) => void
  getRoadmapItem: (noteId: number, itemId: number) => RoadmapItem | undefined
  getItemByNoteId: (noteId: number) => RoadmapItem | undefined
  setRoadmapItems: (noteId: number, items: RoadmapItem[]) => void
  updateItemChecked: (itemId: number, checked: boolean) => void
  getItemCheckedState: (noteId: number) => boolean
  hasItemsForNote: (noteId: number) => boolean
  refreshItemsFromAPI: (noteId: number) => Promise<void>
  forceSetRoadmapItems: (noteId: number, items: RoadmapItem[]) => void
}

export const useRoadmapItemStore = create<RoadmapItemStore>()(
  subscribeWithSelector((set, get) => ({
    roadmapItems: {},

    updateRoadmapItem: (noteId, itemId, checked) =>
      set((state) => {
        const items = state.roadmapItems[noteId] || []
        const updatedItems = items.map((item) => (item.id === itemId ? { ...item, checked } : item))

        return {
          roadmapItems: {
            ...state.roadmapItems,
            [noteId]: updatedItems,
          },
        }
      }),

    removeRoadmapItem: (noteId, itemId) =>
      set((state) => {
        const items = state.roadmapItems[noteId] || []
        const updatedItems = items.filter((item) => item.id !== itemId)
        return {
          roadmapItems: {
            ...state.roadmapItems,
            [noteId]: updatedItems,
          },
        }
      }),

    getRoadmapItem: (noteId, itemId) => {
      const items = get().roadmapItems[noteId] || []
      return items.find((item) => item.id === itemId)
    },

    getItemByNoteId: (noteId) => {
      const items = get().roadmapItems[noteId] || []
      return items.length > 0 ? items[0] : undefined
    },

    setRoadmapItems: (noteId, items) =>
      set((state) => {
        const existingItems = state.roadmapItems[noteId]

        if (existingItems && existingItems.length > 0) {
          return state
        }
        return {
          roadmapItems: {
            ...state.roadmapItems,
            [noteId]: items,
          },
        }
      }),

    forceSetRoadmapItems: (noteId, items) =>
      set((state) => {
        return {
          roadmapItems: {
            ...state.roadmapItems,
            [noteId]: items,
          },
        }
      }),

    updateItemChecked: (itemId, checked) =>
      set((state) => {
        const newRoadmapItems = { ...state.roadmapItems }

        for (const noteId in newRoadmapItems) {
          const items = newRoadmapItems[noteId]
          const itemIndex = items.findIndex((item) => item.id === itemId)

          if (itemIndex !== -1) {
            newRoadmapItems[noteId] = items.map((item, index) => (index === itemIndex ? { ...item, checked } : item))
            break
          }
        }

        return { roadmapItems: newRoadmapItems }
      }),

    getItemCheckedState: (noteId) => {
      const items = get().roadmapItems[noteId] || []
      return items.length > 0 ? items[0].checked : false
    },

    hasItemsForNote: (noteId) => {
      const items = get().roadmapItems[noteId]
      return items && items.length > 0
    },

    refreshItemsFromAPI: async (noteId) => {
      try {

        const response = await fetch(`/api/notes/${noteId}/roadmap-items`)
        if (response.ok) {
          const items = await response.json()
          get().forceSetRoadmapItems(noteId, items)
        }
      } catch (error) {
        console.error(`Error refreshing items for note ${noteId}:`, error)
      }
    },
  })),
)
