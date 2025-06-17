import { RoadmapItem } from "@/types/roadmapItems"

interface PercentRoadMapProps {
    roadmapItems: RoadmapItem[]
  }
  
export default function PercentRoadMap ({ roadmapItems }: PercentRoadMapProps) {

    if (!roadmapItems) {
        return 
    }

    const totalItems = roadmapItems.length
    const checkedItems = roadmapItems.filter(item => item.checked).length
    const percentage = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0

    return (
        <p className="text-text text-xs">{percentage}% terminé</p>
    )
}