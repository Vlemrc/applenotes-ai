"use client"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

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

  // Variantes pour l'animation de slide horizontal
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
    // Réinitialiser le flip avant de changer de carte
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

  return (
    <div>
      <h1 className="font-semibold text-yellowLight uppercase -mt-1">Flashcard</h1>

      {/* Conteneur pour l'animation de transition entre flashcards */}
      <div className="relative w-full mt-10 min-h-[340px] perspective-1000">
        <AnimatePresence custom={direction} initial={false}>
          <motion.div
            key={currentCardIndex}
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute top-0 left-0 w-full h-full"
          >
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
                  Press to flip
                </motion.p>
              </motion.div>

              {/* Face arrière (réponse) - avec rotation supplémentaire pour corriger l'orientation */}
              <motion.div
                className="absolute w-full h-full flex flex-col justify-center items-center p-6 rounded-xl"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateX(180deg) rotateZ(0deg)", // Ajout de rotateZ pour corriger l'orientation
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
        </AnimatePresence>
      </div>

      <div className="flex flex-row justify-between mt-2.5">
        <p className="font-medium text-text">
          {currentCardIndex + 1} / {totalFlashcards}
        </p>
        <div className="flex gap-4">
          <button
            onClick={handlePreviousCard}
            className={`font-medium text-text animlinkunderline ${
              currentCardIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentCardIndex === 0}
          >
            &lt; Précédente
          </button>
          <button
            onClick={handleNextCard}
            className={`font-medium text-text animlinkunderline ${
              currentCardIndex === totalFlashcards - 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={currentCardIndex === totalFlashcards - 1}
          >
            Suivante &gt;
          </button>
        </div>
      </div>

      {onBackToNote && (
        <button
          onClick={() => onBackToNote(noteId)}
          className="mt-4 bg-gray text-text font-semibold py-1 px-5 rounded-lg hover:opacity-90 transition-opacity"
        >
          Revenir sur ma note
        </button>
      )}
    </div>
  )
}

export default FlashCard