"use client"
import { useEffect, useState } from "react"

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

  const handleNextCard = () => {
    if (!flashcardsData) return
    setIsFlipped(false)
    setCurrentCardIndex((prevIndex) => (prevIndex < flashcardsData.flashcards.length - 1 ? prevIndex + 1 : 0))
  }

  const handlePreviousCard = () => {
    if (!flashcardsData) return
    setIsFlipped(false)
    setCurrentCardIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : flashcardsData.flashcards.length - 1))
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

  const currentCard = flashcardsData.flashcards[currentCardIndex]

  return (
    <div>
      <h1 className="font-semibold text-yellowLight uppercase -mt-1">Flashcard</h1>
      <button
        onClick={toggleFlip}
        className="relative bg-grayLight w-full flex flex-col justify-center items-center p-6 rounded-xl mt-10 min-h-[340px]"
      >
        <h1 className="text-text text-lg font-semibold">{isFlipped ? currentCard.answer : currentCard.question}</h1>
        <p className="text-yellowLight uppercase text-xs font-medium mt-4">
          {isFlipped ? "Retourner à la question" : "Press to flip"}
        </p>
      </button>
      <div className="flex flex-row justify-between mt-2.5">
        <p className="font-medium text-text">
          {currentCardIndex + 1} / {flashcardsData.flashcards.length}
        </p>
        <div className="flex gap-4">
          <button onClick={handlePreviousCard} className="font-medium text-text animlinkunderline">
            &lt; Précédente
          </button>
          <button onClick={handleNextCard} className="font-medium text-text animlinkunderline">
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




// "use client";
// const FlashCard = () => {
//     return (
//         <div>
//             <h1 className="font-semibold text-yellowLight uppercase -mt-1">Flashcard</h1>
//             <button className="relative bg-grayLight w-full flex flex-col justify-center items-center p-6 rounded-xl mt-10 min-h-[340px]">
//                 <h1 className="text-text text-lg font-semibold">Quelle est la nationalité de Dmitry Bivol ?</h1>
//                 <p className="text-yellowLight uppercase text-xs font-medium">Press to flip</p>
//             </button>
//             <div className="flex flex-row justify-between mt-2.5">
//                 <p className="font-medium text-text">8 / 10</p>
//                 <button className="font-medium text-text animlinkunderline">&gt; Question suivante !</button>
//             </div>
//         </div>
//     )
// }

// export default FlashCard