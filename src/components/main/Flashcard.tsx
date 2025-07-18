"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useLearningModeStore } from "@/stores/learningModeStore"
import { useRoadmapItem } from "@/utils/useRoadmapItem"
import { useRoadmapItemStore } from "@/stores/roadmapItemStore"

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

  // Utiliser le hook comme dans HeaderNote
  const { item, isChecked, updateChecked } = useRoadmapItem(noteId)
  const { setRoadmapItems, hasItemsForNote } = useRoadmapItemStore()

  useEffect(() => {
    const storedFlashcards = localStorage.getItem(`generated-flashcards-${noteId}`)
    if (storedFlashcards) {
      try {
        setFlashcardsData(JSON.parse(storedFlashcards))
      } catch (error) {
        console.error("Erreur de parsing JSON :", error)
      }
    }
  }, [noteId])

  const updateRoadmapItemStatus = async () => {
    if (!item) return
    await updateChecked(!isChecked)
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

      <div className="relative w-full mt-10 min-h-[340px] perspective-1000">
        <motion.div key={currentCardIndex} className="absolute top-0 left-0 w-full h-full">
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

          {isLastCard && isLearningMode && item && (
            <button
              onClick={updateRoadmapItemStatus}
              className={`text-sm text-white px-4 rounded-md font-medium hover:bg-yellow transition-colors duration-300 ${
                isChecked ? "bg-orange-500 text-white" : "bg-green text-white"
              }`}
            >
              {isChecked
                ? "Marquer comme à explorer"
                : "Marquer comme maitrisé"}
            </button>
          )}

          {isLastCard ? (
            <button
              onClick={() => onBackToNote && onBackToNote(noteId)}
              className="text-sm border border-solid border-grayLight shadow-sm px-2 bg-white rounded-md font-medium hover:bg-grayLight transition-colors duration-300"
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