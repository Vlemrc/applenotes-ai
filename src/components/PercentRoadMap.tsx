"use client"

import { useEffect, useState } from "react"
import { useRoadmapStore } from "@/stores/roadmapStore"
import { useRoadmapItemStore } from "@/stores/roadmapItemStore"

interface PercentRoadMapProps {
  folderId: number
}

export default function PercentRoadMap({ folderId }: PercentRoadMapProps) {
  const { hasRoadmapData, isDataLoaded, setRoadmaps, roadmaps } = useRoadmapStore()
  const { roadmapItems } = useRoadmapItemStore()
  const [animatedPercentage, setAnimatedPercentage] = useState(0)

  useEffect(() => {
    const loadRoadmapData = async () => {
      if (!isDataLoaded(folderId)) {
        try {
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

          if (response.ok) {
            const data = await response.json()
            const roadmapsArray = Array.isArray(data) ? data : []
            setRoadmaps(folderId, roadmapsArray)
          } else {
            setRoadmaps(folderId, [])
          }
        } catch (error) {
          console.error("Erreur lors du chargement des données roadmap:", error)
          setRoadmaps(folderId, [])
        }
      }
    }

    loadRoadmapData()
  }, [folderId, isDataLoaded, setRoadmaps])

  const calculateRealTimePercentage = () => {
    const folderRoadmaps = roadmaps[folderId] || []
    if (folderRoadmaps.length === 0 || !folderRoadmaps[0]?.items) return 0

    const items = folderRoadmaps[0].items
    if (items.length === 0) return 0

    // Pour chaque item, vérifier d'abord dans roadmapItemStore, sinon utiliser roadmapStore
    let checkedCount = 0
    items.forEach((item) => {
      let isChecked = item.checked

      for (const noteId in roadmapItems) {
        const noteItems = roadmapItems[noteId] || []
        const foundItem = noteItems.find((ri) => ri.id === item.id)
        if (foundItem) {
          isChecked = foundItem.checked
          break
        }
      }

      if (isChecked) checkedCount++
    })

    return Math.round((checkedCount / items.length) * 100)
  }

  const percentage = calculateRealTimePercentage()

  useEffect(() => {
    let frameId: number
    const duration = 500
    const start = performance.now()
    const startValue = animatedPercentage
    const change = percentage - startValue

    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1)
      const value = Math.round(startValue + change * progress)
      setAnimatedPercentage(value)

      if (progress < 1) {
        frameId = requestAnimationFrame(animate)
      }
    }

    frameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameId)
  }, [percentage, roadmapItems])

  if (!isDataLoaded(folderId) || !hasRoadmapData(folderId)) {
    return null
  }

  return <p className="text-text text-xs">{animatedPercentage}% terminé</p>
}
