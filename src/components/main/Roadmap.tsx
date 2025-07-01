"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useLearningModeStore } from "@/stores/learningModeStore"
import ModifyRoadmap from "../ModifyRoadmap"
import { useRoadmapStore } from "@/stores/roadmapStore"
import { RoadmapItem } from "@/types/roadmapItems"
import { Roadmap } from "@/types/roadmaps"

interface RoadmapProps {
  folderId: number
  onBackToNote: () => void
}

const Roadmap = ({ folderId, onBackToNote }: RoadmapProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null)
  const { isLearningMode } = useLearningModeStore()

  const {
    roadmaps: allRoadmaps,
    setRoadmaps,
    updateRoadmapItem: updateStoreItem,
    removeRoadmapItem,
  } = useRoadmapStore()
  const roadmaps = allRoadmaps[folderId] || []

  const roadmapItemsCount = roadmaps[0]?.items.length
  const checkedItemsCount = roadmaps[0]?.items.filter((item) => item.checked).length
  const percentItems = roadmapItemsCount > 0 ? Math.round((checkedItemsCount / roadmapItemsCount) * 100) : 0
  const [animatedPercent, setAnimatedPercent] = useState(percentItems)

  useEffect(() => {
    let frameId: number
    const duration = 500
    const start = performance.now()
    const startValue = animatedPercent
    const change = percentItems - startValue

    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1)
      const value = Math.round(startValue + change * progress)
      setAnimatedPercent(value)

      if (progress < 1) {
        frameId = requestAnimationFrame(animate)
      }
    }

    frameId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frameId)
  }, [percentItems])

  useEffect(() => {
    if (folderId) {
      fetchRoadmaps()
    } else {
      setIsLoading(false)
    }
  }, [folderId])

  const fetchRoadmaps = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "fetch",
          folderId: folderId.toString(),
        }),
      })
      const data = await response.json()
      if (response.ok) {
        const roadmapsArray = Array.isArray(data) ? data : []
        setRoadmaps(folderId, roadmapsArray) // Utilise le store
      } else {
        setError(data.error || "Erreur inconnue")
      }
    } catch (error) {
      setError(`Erreur de connexion: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleItemCheck = async (itemId: number, checked: boolean) => {
    try {
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "updateItem",
          itemId: itemId,
          checked: checked,
        }),
      })

      if (response.ok) {
        updateStoreItem(folderId, itemId, checked) // Utilise le store
      } else {
        const errorData = await response.json()
        console.error("Erreur lors de la mise à jour:", errorData)
      }
    } catch (error) {
      console.error("Erreur lors de la requête:", error)
    }
  }

  const deleteRoadmapItem = async (itemId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      return
    }

    try {
      setDeletingItemId(itemId)

      const response = await fetch("/api/roadmapitem", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      })

      const data = await response.json()

      if (response.ok) {
        removeRoadmapItem(folderId, itemId) // Utilise le store
      } else {
        console.error("Erreur lors de la suppression:", data.error)
        alert(`Erreur: ${data.error}`)
      }
    } catch (error) {
      console.error("Erreur lors de la requête de suppression:", error)
      alert("Erreur de connexion lors de la suppression")
    } finally {
      setDeletingItemId(null)
    }
  }

  const handleRoadmapDeleted = () => {
    fetchRoadmaps()
  }

  const handleRegenerationStart = () => {
    setIsRegenerating(true)
  }

  const handleRegenerationComplete = () => {
    setIsRegenerating(false)
    fetchRoadmaps()
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="p-2 absolute top-1/2 left-1/2 -translate-x-1/2 animate-gray-gradient text-md whitespace-nowrap">
          Chargement de votre roadmap...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="font-semibold text-red-500 uppercase mb-4">Roadmap - Erreur</h1>
        <p>Folder ID: {folderId}</p>
        <p className="text-red-600">Erreur: {error}</p>
        <button onClick={fetchRoadmaps} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Réessayer
        </button>
        <button onClick={onBackToNote} className="mt-2 ml-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Retour
        </button>
      </div>
    )
  }

  if (roadmaps.length === 0) {
    return (
      <div>
        <div className="flex flex-row gap-2 items-center mb-4">
          <h1 className="font-bold text-2xl uppercase">Roadmap</h1>
        </div>
        <div className="text-center py-8 bg-gray-50 rounded">
          <p className="text-gray-600">Aucune roadmap trouvée pour ce dossier</p>
          <p className="text-sm text-gray-400">La roadmap a-t-elle été générée ?</p>
        </div>
        <button onClick={onBackToNote} className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
          Retour aux notes
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Overlay de régénération */}
      {isRegenerating && (
        <div className="absolute inset-0 bg-white z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg border border-gray flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8">
              <Image src="/encoursgray.svg" width={32} height={32} alt="Chargement" />
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-900">Régénération en cours...</p>
              <p className="text-sm text-gray-600">Création de votre nouvelle roadmap</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-row gap-2 items-center">
        <h1 className="font-bold text-2xl uppercase">Roadmap</h1>
        <ModifyRoadmap
          folderId={folderId}
          roadmapId={roadmaps[0]?.id}
          onRoadmapDeleted={handleRoadmapDeleted}
          onRegenerationStart={handleRegenerationStart}
          onRegenerationComplete={handleRegenerationComplete}
          isRegenerating={isRegenerating}
        />
      </div>
      <div className="flex flex-row gap-2 items-center mb-5">
        <p className="bg-yellow-gradient p-[2px] px-[6px] text-sm rounded-md ">{animatedPercent}%</p>
        <p className="text-sm">
          {checkedItemsCount} sur {roadmapItemsCount} maitrisés
        </p>
      </div>

      <div className="space-y-4">
        {roadmaps.map((roadmap) => (
          <div key={roadmap.id}>
            {roadmap.items && roadmap.items.length > 0 ? (
              <div className="flex flex-col gap-8">
                {roadmap.items.map((item, idx) => (
                  <div key={item.id} className="flex justify-between flex-row relative border-b border-grayLight pb-1">
                    <div>
                      <div className="font-medium">
                        {idx + 1}. {item.note?.title || "Titre manquant"}
                      </div>
                      {item.checked ? (
                        <p className="text-xs">Note maitrisée</p>
                      ) : (
                        <p className="text-xs">Note à explorer</p>
                      )}
                      <button
                        className="text-xs font-medium transform -translate-y-[3px] hover:text-red-600 transition duration-300 disabled:opacity-50"
                        onClick={() => deleteRoadmapItem(item.id)}
                        disabled={deletingItemId === item.id}
                      >
                        {deletingItemId === item.id ? "Suppression..." : "Supprimer"}
                      </button>
                    </div>
                    <div
                      className={`${
                        idx !== roadmap.items.length - 1
                          ? `roadmap-checkdiv ${item.checked ? "bg-yellowLight" : "bg-grayLight"}`
                          : `${item.checked ? "bg-yellowLight" : "bg-grayLight"}`
                      } h-6 w-6 rounded-full cursor-pointer flex items-center justify-center absolute right-1/2 translate-y-2`}
                      onClick={() => toggleItemCheck(item.id, !item.checked)}
                    >
                      {item.checked ? (
                        <Image src="/checkmark.svg" width={10} height={10} alt="acquis" />
                      ) : (
                        <div className="animate-spin-slow">
                          <Image src="/encours.svg" width={10} height={10} alt="en cours d'acquisition" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Aucun élément dans cette roadmap</p>
            )}
          </div>
        ))}
      </div>

      <button onClick={onBackToNote} className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
        Retour aux notes
      </button>
    </div>
  )
}

export default Roadmap
