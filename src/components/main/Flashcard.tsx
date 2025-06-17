"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useLearningModeStore } from "@/stores/learningModeStore"

interface FlashcardItem {
  question: string
  answer: string
}

interface FlashcardsData {
  flashcards: FlashcardItem[]
}

const FlashCard = ({
  noteId,
  onBackToNote,
}: {
  noteId: number
  onBackToNote?: (noteId: number) => void
}) => {
  const [flashcardsData, setFlashcardsData] = useState<FlashcardsData | null>(null)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [direction, setDirection] = useState(1) // 1 pour next, -1 pour previous
  const { isLearningMode } = useLearningModeStore()
  const [roadmapItemId, setRoadmapItemId] = useState<number | null>(null)
  const [isUpdatingRoadmap, setIsUpdatingRoadmap] = useState(false)
  const [isRoadmapItemChecked, setIsRoadmapItemChecked] = useState<boolean>(false)

  useEffect(() => {
    const storedFlashcards = localStorage.getItem(`generated-flashcards-${noteId}`)
    if (storedFlashcards) {
      try {
        setFlashcardsData(JSON.parse(storedFlashcards))
      } catch (error) {
        console.error("Erreur de parsing JSON :", error)
      }
    }

    // Récupérer les infos du roadmapItem
    fetchNoteRoadmapInfo()
  }, [noteId])

  const fetchNoteRoadmapInfo = async () => {
    try {
      const response = await fetch(`/api/notes?id=${noteId}`)
      if (response.ok) {
        const note = await response.json()
        // Récupérer le premier roadmapItem associé à cette note
        if (note.roadmapItems && note.roadmapItems.length > 0) {
          const roadmapItem = note.roadmapItems[0]
          setRoadmapItemId(roadmapItem.id)
          setIsRoadmapItemChecked(roadmapItem.checked)
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des infos de la note:", error)
    }
  }

  const updateRoadmapItemStatus = async () => {
    if (!roadmapItemId) return

    setIsUpdatingRoadmap(true)
    const newCheckedState = !isRoadmapItemChecked

    try {
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "updateItem",
          itemId: roadmapItemId,
          checked: newCheckedState,
        }),
      })

      if (response.ok) {
        setIsRoadmapItemChecked(newCheckedState)
        console.log(`Roadmap item ${newCheckedState ? "marqué comme appris" : "marqué comme non-appris"}`)
      } else {
        console.error("Erreur lors de la mise à jour du roadmap item")
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error)
    } finally {
      setIsUpdatingRoadmap(false)
    }
  }

  const slideVariants = {
    initial: (direction: number) => ({
      x: direction > 0 ? "calc(100% + 20px)" : "calc(-100% - 20px)",
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "calc(-100% - 20px)" : "calc(100% + 20px)",
      opacity: 0,
      transition: { duration: 0.5 },
    }),
  }

  const changeFlashcard = (newIndex: number, dir: number) => {
    setIsFlipped(false)
    setDirection(dir)
    setCurrentCardIndex(newIndex)
  }

  const handleNextCard = () => {
    if (!flashcardsData) return
    if (currentCardIndex < flashcardsData.flashcards.length - 1) {
      changeFlashcard(currentCardIndex + 1, 1)
    }
  }

  const handlePreviousCard = () => {
    if (!flashcardsData) return
    if (currentCardIndex > 0) {
      changeFlashcard(currentCardIndex - 1, -1)
    }
  }

  const toggleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  if (!flashcardsData) {
    return (
      <div>
        <h1 className="font-semibold text-yellowLight uppercase -mt-1">Flashcard</h1>
        <div className="relative bg-grayLight flex flex-col items-center p-6 rounded-xl mt-10">
          <p>Votre note est trop courte pour demander des flashcards.</p>
        </div>
      </div>
    )
  }

  const totalFlashcards = flashcardsData.flashcards.length
  const currentCard = flashcardsData.flashcards[currentCardIndex]
  const isLastCard = currentCardIndex === totalFlashcards - 1

  return (
    <div>
      <h1 className="font-semibold text-yellowLight uppercase -mt-1">Flashcard</h1>

      {/* Conteneur pour l'animation de transition entre flashcards */}
      <div className="relative w-full mt-10 min-h-[340px] perspective-1000">
        <motion.div key={currentCardIndex} className="absolute top-0 left-0 w-full h-full">
          {/* Composant contenant l'animation de flip */}
          <motion.div
            className="relative w-full h-full bg-grayLight rounded-xl cursor-pointer"
            onClick={toggleFlip}
            initial={{ rotateX: 0 }}
            animate={{ rotateX: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{
              transformStyle: "preserve-3d",
              transformOrigin: "center center",
            }}
          >
            {/* Face avant (question) */}
            <motion.div
              className="absolute w-full h-full flex flex-col justify-center items-center p-6 rounded-xl"
              style={{
                backfaceVisibility: "hidden",
              }}
            >
              <motion.h1
                className="text-text text-lg font-semibold text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: isFlipped ? 0 : 1 }}
                transition={{ duration: 0.3, delay: isFlipped ? 0 : 0.3 }}
              >
                {currentCard.question}
              </motion.h1>
              <motion.p
                className="text-yellowLight uppercase text-xs font-medium mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: isFlipped ? 0 : 1 }}
                transition={{ duration: 0.3, delay: isFlipped ? 0 : 0.3 }}
              >
                Appuie pour retourner
              </motion.p>
            </motion.div>

            {/* Face arrière (réponse) */}
            <motion.div
              className="absolute w-full h-full flex flex-col justify-center items-center p-6 rounded-xl"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateX(180deg) rotateZ(0deg)",
              }}
            >
              <motion.h1
                className="text-text text-lg font-semibold text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: isFlipped ? 1 : 0 }}
                transition={{ duration: 0.3, delay: isFlipped ? 0.3 : 0 }}
              >
                {currentCard.answer}
              </motion.h1>
              <motion.p
                className="text-yellowLight uppercase text-xs font-medium mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: isFlipped ? 1 : 0 }}
                transition={{ duration: 0.3, delay: isFlipped ? 0.3 : 0 }}
              >
                Retourner à la question
              </motion.p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <div className="flex flex-row justify-between mt-2.5">
        <p className="font-medium text-text">
          {currentCardIndex + 1} / {totalFlashcards}
        </p>
        <div className="flex gap-4 items-center">
          <button
            onClick={handlePreviousCard}
            className={`font-medium text-text animlinkunderline ${
              currentCardIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentCardIndex === 0}
          >
            &lt; Précédente
          </button>

          {/* Bouton de gestion de l'état d'apprentissage - affiché seulement sur la dernière carte */}
          {isLastCard && isLearningMode && roadmapItemId && (
            <button
              onClick={updateRoadmapItemStatus}
              disabled={isUpdatingRoadmap}
              className={`font-semibold py-1 px-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm ${
                isRoadmapItemChecked ? "bg-orange-500 text-white" : "bg-green text-white"
              }`}
            >
              {isUpdatingRoadmap
                ? "Mise à jour..."
                : isRoadmapItemChecked
                  ? "Marquer comme non-appris"
                  : "Marquer comme appris"}
            </button>
          )}

          {isLastCard ? (
            <button
              onClick={() => onBackToNote && onBackToNote(noteId)}
              className="font-medium text-text animlinkunderline"
            >
              Revenir sur ma note
            </button>
          ) : (
            <button
              onClick={handleNextCard}
              className={`font-medium text-text animlinkunderline ${
                currentCardIndex === totalFlashcards - 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentCardIndex === totalFlashcards - 1}
            >
              Suivante &gt;
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default FlashCard
