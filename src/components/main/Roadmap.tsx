"use client"

import { useEffect, useState } from "react"

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
        <h1 className="font-semibold text-yellow-500 uppercase mb-4">Roadmap - Chargement...</h1>
        <p>Folder ID: {folderId}</p>
        <p>Chargement en cours...</p>
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
    <div className="p-4 overflow-scroll">
      <h1 className="font-semibold text-yellow-500 uppercase mb-4">Roadmap</h1>

      {roadmaps.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded">
          <p className="text-gray-600">Aucune roadmap trouvée pour ce dossier</p>
          <p className="text-sm text-gray-400">La roadmap a-t-elle été générée ?</p>
        </div>
      ) : (
        <div className="space-y-4">
          {roadmaps.map((roadmap) => (
            <div key={roadmap.id} className="border rounded p-4 bg-white shadow">
              {roadmap.items && roadmap.items.length > 0 ? (
                <div className="space-y-3">
                  {roadmap.items.map((item) => (
                    <div key={item.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded border">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={(e) => toggleItemCheck(item.id, e.target.checked)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="font-medium">
                          {item.position}. {item.note?.title || "Titre manquant"}
                        </div>
                        {item.reasoning && <div className="text-sm text-gray-600 mt-1">{item.reasoning}</div>}
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
