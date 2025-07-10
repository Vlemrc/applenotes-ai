"use client"

import { useCallback } from "react"
import { useRoadmapItemStore } from "@/stores/roadmapItemStore"

export const useRoadmapItem = (noteId: number) => {
  // Utilisation de sélecteurs spécifiques pour éviter les re-renders inutiles
  const item = useRoadmapItemStore(useCallback((state) => state.getItemByNoteId(noteId), [noteId]))

  const isChecked = useRoadmapItemStore(useCallback((state) => state.getItemCheckedState(noteId), [noteId]))

  const updateItemChecked = useRoadmapItemStore((state) => state.updateItemChecked)
  const updateRoadmapItem = useRoadmapItemStore((state) => state.updateRoadmapItem)

  const updateChecked = useCallback(
    async (checked: boolean) => {
      if (!item) {
        return false
      }
      updateItemChecked(item.id, checked)

      try {
        const response = await fetch("/api/roadmap", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "updateItem",
            itemId: item.id,
            checked: checked,
          }),
        })

        if (response.ok) {
          return true
        } else {
          updateItemChecked(item.id, !checked)
          return false
        }
      } catch (error) {
        console.error("Error updating item status:", error)
        updateItemChecked(item.id, !checked)
        return false
      }
    },
    [item, updateItemChecked],
  )

  return {
    item,
    isChecked,
    updateChecked,
  }
}
