"use client"
import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { useLearningModeStore } from "@/stores/learningModeStore"
import { useRoadmapItem } from "@/utils/useRoadmapItem"
import { useRoadmapItemStore } from "@/stores/roadmapItemStore"

interface Answer {
  text: string
  correct: boolean
}

interface Question {
  question: string
  answers: Answer[]
}

interface QuizData {
  questions: Question[]
}

const Quiz = ({
  noteId,
  onBackToNote,
}: {
  noteId: number
  onBackToNote: (noteId: number) => void
}) => {
  const [quizData, setQuizData] = useState<QuizData | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null)
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number | null>(null)
  const { isLearningMode } = useLearningModeStore()
  
  // Utiliser le hook comme dans HeaderNote
  const { item, isChecked, updateChecked } = useRoadmapItem(noteId)
  const { setRoadmapItems, hasItemsForNote } = useRoadmapItemStore()

  useEffect(() => {
    const storedQuiz = localStorage.getItem(`generated-quiz-${noteId}`)
    if (storedQuiz) {
      try {
        setQuizData(JSON.parse(storedQuiz))
      } catch (error) {
        console.error("Erreur de parsing JSON :", error)
      }
    }

    // Récupérer les infos du roadmapItem
  }, [noteId])

  const handleBackToNote = () => {
    onBackToNote(noteId)
  }

  const handleAnswerClick = (answerIndex: number) => {
    if (selectedAnswerIndex !== null) return

    setSelectedAnswerIndex(answerIndex)
    const correctIndex = quizData?.questions[currentQuestionIndex].answers.findIndex((a) => a.correct) ?? null
    setCorrectAnswerIndex(correctIndex)

    const isCorrect = quizData?.questions[currentQuestionIndex].answers[answerIndex].correct
    setFeedback({
      message: isCorrect ? "Bonne réponse !" : "Mauvaise réponse !",
      isCorrect: !!isCorrect,
    })
  }

  const handleNextQuestion = () => {
    if (selectedAnswerIndex === null) return

    // Save the user's answer
    const newUserAnswers = [...userAnswers]
    newUserAnswers[currentQuestionIndex] = selectedAnswerIndex
    setUserAnswers(newUserAnswers)

    // Update score if answer is correct
    if (quizData?.questions[currentQuestionIndex].answers[selectedAnswerIndex].correct) {
      setScore((prevScore) => prevScore + 1)
    }

    // Reset feedback
    setFeedback(null)
    setCorrectAnswerIndex(null)

    // Move to next question or show results
    if (quizData && currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
      setSelectedAnswerIndex(null)
    } else {
      setShowResults(true)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1)
      const prevAnswerIndex = userAnswers[currentQuestionIndex - 1] || null
      setSelectedAnswerIndex(prevAnswerIndex)

      // Restore feedback if there was an answer
      if (prevAnswerIndex !== null && quizData) {
        const isCorrect = quizData.questions[currentQuestionIndex - 1].answers[prevAnswerIndex].correct
        setFeedback({
          message: isCorrect ? "Bonne réponse !" : "Mauvaise réponse !",
          isCorrect,
        })
      } else {
        setFeedback(null)
      }
    }
  }

  const restartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswerIndex(null)
    setUserAnswers([])
    setShowResults(false)
    setScore(0)
    setFeedback(null)
    setCorrectAnswerIndex(null)
  }

  const updateRoadmapItemStatus = async () => {
    if (!item) return
    await updateChecked(!isChecked)
  }

  if (!quizData) {
    return (
      <div>
        <h1 className="font-semibold text-yellowLight uppercase -mt-1">Quiz</h1>
        <div className="relative bg-grayLight flex flex-col items-center p-6 rounded-xl mt-10">
          <p>Votre note est trop courte pour demander un quiz.</p>
        </div>
      </div>
    )
  }

  const currentQuestion = quizData.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100

  return (
    <div>
      <h1 className="font-semibold text-yellowLight uppercase -mt-1">Quiz</h1>
      <div className="relative bg-grayLight flex flex-col items-center p-6 rounded-xl mt-10">
        <div id="progress" className="w-full flex flex-col items-center justify-center gap-1">
          <Progress value={progress} />
          <p className="text-xs text-grayOpacity">
            {currentQuestionIndex + 1} / {quizData.questions.length}
          </p>
        </div>
        {!showResults ? (
          <>
            <h1 className="text-text text-lg text-center font-semibold pt-5">{currentQuestion.question}</h1>
            <div id="answers" className="w-full py-9">
              <ul className="flex flex-wrap flex-row gap-5 items-center justify-center">
                {currentQuestion.answers.map((answer, index) => (
                  <li
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    className={`font-semibold text-center text-sm w-full lg:w-1/3 flex items-center justify-center px-4 py-5 rounded-lg cursor-pointer transition-all duration-300
                    ${
                      selectedAnswerIndex !== null
                        ? index === selectedAnswerIndex
                          ? answer.correct
                            ? "bg-green text-white"
                            : "bg-alert text-white"
                          : index === correctAnswerIndex
                            ? "bg-green text-white"
                            : "bg-white text-yellow"
                        : "bg-white text-yellow hover:text-white hover:bg-yellow-gradient"
                    }
                  `}
                    style={{ height: "110px" }}
                  >
                    {answer.text}
                  </li>
                ))}
              </ul>
            </div>
            {feedback && (
              <div
                className={`mt-4 absolute bottom-2.5 text-xs text-alert uppercase text-center font-semibold text-lg ${
                  feedback.isCorrect ? "text-green-600" : "text-red-600"
                }`}
              >
                {feedback.message}
              </div>
            )}
            <div className="flex justify-between w-full">
              {currentQuestionIndex > 0 && (
                <button
                  onClick={handlePreviousQuestion}
                  className="flex items-center justify-center bg-yellow-gradient h-10 w-10 rounded-full absolute top-1/2 -left-5 -translate-y-1/2"
                >
                  <svg height="12px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5.28 9.21">
                    <path
                      fill="#fff"
                      d="M5.08,9.01c.27-.27.27-.71,0-.98l-3.43-3.43,3.43-3.43c.27-.27.27-.71,0-.98s-.71-.27-.98,0L.2,4.11C.06,4.24,0,4.42,0,4.6c0,.18.06.36.2.5l3.91,3.91c.27.27.71.27.98,0Z"
                    />
                  </svg>
                </button>
              )}
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswerIndex === null}
                className={`flex items-center justify-center rotate-180 bg-yellow-gradient h-10 w-10 rounded-full ml-auto absolute top-1/2 -right-5 -translate-y-1/2 ${
                  selectedAnswerIndex === null ? "opacity-100 cursor-not-allowed" : ""
                }`}
              >
                <svg
                  height="12px"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 5.28 9.21"
                  className="-translate-x-[1px]"
                >
                  <path
                    fill="#fff"
                    d="M5.08,9.01c.27-.27.27-.71,0-.98l-3.43-3.43,3.43-3.43c.27-.27.27-.71,0-.98s-.71-.27-.98,0L.2,4.11C.06,4.24,0,4.42,0,4.6c0,.18.06.36.2.5l3.91,3.91c.27.27.71.27.98,0Z"
                  />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center py-8">
            <h2 className="text-xl font-semibold mb-6 uppercase">Score final</h2>
            <div className="text-8xl font-semibold text-text mb-6">
              {score} / {quizData.questions.length}
            </div>
            <p className="mb-2.5 text-xs font-semibold text-center">
              {score === quizData.questions.length
                ? "Parfait ! C'est du propre."
                : score > quizData.questions.length / 2
                  ? "Pas mal mais on veut toujours plus !"
                  : "Tu peux encore t'améliorer ne lâche pas !"}
            </p>
            <div className="flex flex-row gap-2">
              <button
                onClick={handleBackToNote}
                className="text-sm border border-solid border-grayLight shadow-sm px-2 bg-white rounded-md font-medium hover:bg-grayLight transition-colors duration-300"
              >
                Revenir sur ma note
              </button>
              <button
                onClick={restartQuiz}
                className="text-sm bg-yellowLight text-white px-4 rounded-md font-medium hover:bg-yellow transition-colors duration-300"
              >
                On réessaye ?
              </button>
            </div>
            {isLearningMode && item && (
              <button
                onClick={updateRoadmapItemStatus}
                className={`text-sm text-white px-4 rounded-md font-medium hover:bg-yellow transition-colors duration-300 mt-2 ${
                  isChecked ? "bg-orange-500 text-white" : "bg-green text-white"
                }`}
              >
                {isChecked
                  ? "Marquer comme à explorer"
                  : "Marquer comme maitrisé"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Quiz