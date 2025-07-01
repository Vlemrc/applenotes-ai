"use client"

import { useEffect, useState } from "react"
import { useRoadmapStore } from "@/stores/roadmapStore"

interface PercentRoadMapProps {
  folderId: number
}

export default function PercentRoadMap({ folderId }: PercentRoadMapProps) {
  const { getCompletionPercentage, hasRoadmapData, isDataLoaded, setRoadmaps } = useRoadmapStore()
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

  // Animation de pourcentage
  const percentage = getCompletionPercentage(folderId)

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
  }, [percentage])

  if (!isDataLoaded(folderId) || !hasRoadmapData(folderId)) {
    return null
  }

  return <p className="text-text text-xs">{animatedPercentage}% terminé</p>
}
