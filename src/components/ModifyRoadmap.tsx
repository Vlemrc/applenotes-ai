"use client"

import { useState } from "react"
import useFolderStore from "@/stores/useFolderStore"

interface ModifyRoadmapProps {
  folderId: number
  roadmapId?: number
  onRoadmapDeleted?: () => void
  onRegenerationStart?: () => void
  onRegenerationComplete?: () => void
  isRegenerating?: boolean
}

export default function ModifyRoadmap({
  folderId,
  roadmapId,
  onRoadmapDeleted,
  onRegenerationStart,
  onRegenerationComplete,
  isRegenerating = false,
}: ModifyRoadmapProps) {
  const [modifyState, setModifyState] = useState(false)
  const { fetchFolders } = useFolderStore()

  const deleteRoadmap = async () => {
    if (!roadmapId) {
      console.error("Aucun ID de roadmap fourni")
      return
    }

    try {
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "delete",
          roadmapId: roadmapId,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        fetchFolders()
        onRoadmapDeleted?.()
        setModifyState(false)
      } else {
        const errorData = await response.json()
        console.error("Erreur lors de la suppression:", errorData.error)
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error)
    }
  }

  const regenerateRoadmap = async () => {
    try {
      // Démarrer l'indicateur de chargement
      onRegenerationStart?.()
      setModifyState(false) // Fermer le menu immédiatement

      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "regenerate",
          folderId: folderId.toString(),
        }),
      })

      if (response.ok) {
        const result = await response.json()
        fetchFolders()
        onRegenerationComplete?.() 
      } else {
        const errorData = await response.json()
        console.error("Erreur lors de la régénération:", errorData.error)
        onRegenerationComplete?.()
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error)
      onRegenerationComplete?.()
    }
  }

  return (
    <div className="relative">
      <button
        className="flex items-center justify-center h-full gap-0.5 min-h-4 w-4 group"
        onClick={() => setModifyState(!modifyState)}
        disabled={isRegenerating}
      >
        <span
          className={`h-1 w-1 rounded-full transition duration-300 ${
            isRegenerating ? "bg-blue-400" : "bg-grayOpacity group-hover:bg-black"
          }`}
        ></span>
        <span
          className={`h-1 w-1 rounded-full transition duration-300 ${
            isRegenerating ? "bg-blue-400" : "bg-grayOpacity group-hover:bg-black"
          }`}
        ></span>
        <span
          className={`h-1 w-1 rounded-full transition duration-300 ${
            isRegenerating ? "bg-blue-400" : "bg-grayOpacity group-hover:bg-black"
          }`}
        ></span>
      </button>
      {modifyState && !isRegenerating && (
        <div className="z-10 bg-grayLight absolute -bottom-18 -right-30 px-4 py-2 shadow-lg rounded-md translate-y-[4px] border border-gray flex flex-col gap-1">
          <button
            className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap pr-10"
            onClick={regenerateRoadmap}
          >
            Régénérer la roadmap
          </button>
          <div className="w-full h-[1px] bg-gray"></div>
          <button
            className="block w-full text-left text-sm whitespace-nowrap"
            onClick={deleteRoadmap}
            disabled={!roadmapId}
          >
            Supprimer ma roadmap
          </button>
        </div>
      )}
    </div>
  )
}
