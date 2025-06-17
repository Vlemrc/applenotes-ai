"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
interface RoadmapItem {
  id: number
  position: number
  checked: boolean
  note: {
    id: number
    title: string
  }
  reasoning?: string
}

interface Roadmap {
  id: number
  title: string
  createdAt: string
  items: RoadmapItem[]
}

interface RoadmapProps {
  folderId: number
  onBackToNote: () => void
}

const Roadmap = ({ folderId, onBackToNote }: RoadmapProps) => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        setRoadmaps(Array.isArray(data) ? data : [])
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
        setRoadmaps((prev) =>
          prev.map((roadmap) => ({
            ...roadmap,
            items: roadmap.items.map((item) => (item.id === itemId ? { ...item, checked } : item)),
          })),
        )
      } else {
        const errorData = await response.json()
      }
    } catch (error) {
    }
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

  return (
    <div className="">
      <h1 className="font-bold text-2xl uppercase mb-4">Roadmap</h1>

      {roadmaps.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded">
          <p className="text-gray-600">Aucune roadmap trouvée pour ce dossier</p>
          <p className="text-sm text-gray-400">La roadmap a-t-elle été générée ?</p>
        </div>
      ) : (
        <div className="space-y-4">
          {roadmaps.map((roadmap) => (
            <div key={roadmap.id}>
              {roadmap.items && roadmap.items.length > 0 ? (
                <div className="flex flex-col gap-8">
                  {roadmap.items.map((item, idx) => (
                    <div key={item.id} className="flex justify-between flex-row">
                      <div className="flex-1">
                        <div className="font-medium">
                          {item.position}. {item.note?.title || "Titre manquant"}
                        </div>
                        {item.checked ? (
                          <p className="text-xs">Note maitrisée</p>
                        ) : (
                          <p className="text-xs">Note à explorer</p>
                        )}
                        <div className="w-full h-[1px] bg-[#F6F6F6] mt-2"></div>
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
      )}

      <button onClick={onBackToNote} className="mt-6 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
        Retour aux notes
      </button>
    </div>
  )
}

export default Roadmap
