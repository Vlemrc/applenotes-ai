"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import Brain from "../icons/Brain"
import Dices from "../icons/Dices"
import FlashCard from "../icons/FlashCard"
import Roadmap from "../icons/Roadmap"
import LabelAiNav from "../LabelAiNav"
import useFolderStore from "@/stores/useFolderStore"

interface AiButtonProps {
  noteId: number
  noteContent: string
  onModeChange: (mode: "quiz" | "assistant" | "flashcards" | "roadmap" | "tutorial" | null) => void
  bottomBar: boolean
  setBottomBar: (value: boolean) => void
  tutorialStep?: number
}

const AiButton = ({ noteId, noteContent, onModeChange, bottomBar, setBottomBar, tutorialStep }: AiButtonProps) => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [mode, setMode] = useState<"quiz" | "assistant" | "flashcards" | "roadmap" | "tutorial" | null>(null)
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0)

  const { activeFolderId, folders } = useFolderStore()

  const quizMessages = [
    "Quiz en cours de création...",
    "Analyse du sujet...",
    "Extraction des concepts clés...",
    "Génération des questions...",
    "Révision du niveau de difficulté...",
    "Formulation des réponses...",
    "Finalisation du quiz...",
    "Prêt à tester vos connaissances ?",
  ]

  const flashcardsMessages = [
    "Flashcards en cours de création...",
    "Analyse du contenu...",
    "Identification des points clés...",
    "Génération des cartes...",
    "Optimisation des questions...",
    "Création des réponses...",
    "Finalisation des flashcards...",
    "Prêt pour la révision ?",
  ]

  const roadmapMessages = [
    "Roadmap en cours de création...",
    "Analyse de la structure...",
    "Identification des étapes...",
    "Organisation du parcours...",
    "Définition des objectifs...",
    "Création des jalons...",
    "Finalisation de la roadmap...",
    "Votre parcours est prêt !",
  ]

  useEffect(() => {
    let messageInterval: NodeJS.Timeout | null = null

    if (loading && mode) {
      setCurrentMessageIndex(0)

      messageInterval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => {
          const messages = mode === "quiz" ? quizMessages : mode === "flashcards" ? flashcardsMessages : roadmapMessages
          return (prevIndex + 1) % messages.length
        })
      }, 3000)
    }

    return () => {
      if (messageInterval) {
        clearInterval(messageInterval)
      }
    }
  }, [loading, mode])

  const simulateProgress = (duration: number) => {
    setProgress(0)
    const interval = 50
    const steps = duration / interval
    const increment = 100 / steps

    let currentProgress = 0
    const progressInterval = setInterval(() => {
      currentProgress += increment
      if (currentProgress >= 95) {
        setProgress(95)
        clearInterval(progressInterval)
      } else {
        setProgress(currentProgress)
      }
    }, interval)

    return progressInterval
  }

  const fetchAIResponse = async (mode: "quiz" | "flashcards") => {
    let progressInterval: NodeJS.Timeout | null = null

    try {
      if (!noteContent) throw new Error("Note vide")

      setLoading(true)
      setProgress(0)

      progressInterval = simulateProgress(15000)

      const endpoint = mode === "quiz" ? "/api/quiz" : "/api/flashcard"
      const payload = mode === "quiz" ? { noteContent, questionCount: 8 } : { noteContent, flashcardsCount: 8 }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        return null
      }

      const data = await response.json()

      if (progressInterval) {
        clearInterval(progressInterval)
      }
      setProgress(100)

      await new Promise((resolve) => setTimeout(resolve, 500))

      return data
    } catch (error) {
      return null
    } finally {
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      setLoading(false)
      setProgress(0)
    }
  }

  const generateRoadmap = async () => {
    let progressInterval: NodeJS.Timeout | null = null

    if (!activeFolderId) {
      return null
    }

    try {
      setLoading(true)
      setProgress(0)

      progressInterval = simulateProgress(10000)

      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate",
          folderId: activeFolderId.toString(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erreur inconnue" }))

        if (response.status === 409 && errorData.code === "ROADMAP_ALREADY_EXISTS") {
          const existingRoadmapResponse = await fetch("/api/roadmap", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "get",
              folderId: activeFolderId.toString(),
            }),
          })

          if (existingRoadmapResponse.ok) {
            const data = await existingRoadmapResponse.json()

            if (progressInterval) {
              clearInterval(progressInterval)
            }
            setProgress(100)
            await new Promise((resolve) => setTimeout(resolve, 500))

            return data
          } else {
            return null
          }
        } else {
          alert(`Erreur: ${errorData.error}`)
          return null
        }
        return null
      }

      const contentType = response.headers.get("content-type")

      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text()
        return null
      }

      const data = await response.json()

      if (progressInterval) {
        clearInterval(progressInterval)
      }
      setProgress(100)
      await new Promise((resolve) => setTimeout(resolve, 500))

      return data
    } catch (error) {
      return null
    } finally {
      if (progressInterval) {
        clearInterval(progressInterval)
      }
      setLoading(false)
      setProgress(0)
    }
  }

  const handleClick = async (mode: "quiz" | "assistant" | "flashcards" | "roadmap") => {
    if (loading) return
    setMode(mode)

    if (mode === "quiz" || mode === "flashcards") {
      const generatedContent = await fetchAIResponse(mode)
      if (generatedContent) {
        localStorage.setItem(`generated-${mode}-${noteId}`, JSON.stringify(generatedContent))
      }
    } else if (mode === "roadmap") {
      const roadmapData = await generateRoadmap()
      if (roadmapData) {
        localStorage.setItem(`generated-roadmap-${activeFolderId}`, JSON.stringify(roadmapData))
      }
    }
    setBottomBar(false)
    onModeChange(mode)
  }

  const handleShowBottomBar = () => {
    setBottomBar(!bottomBar)
  }

  const activeFolder = folders.find((folder) => folder.id === activeFolderId)

  let shouldShowButton = false
  if (activeFolder && activeFolder._count) {
    if (activeFolder._count.notes) {
      shouldShowButton = activeFolder._count.notes === 0 || noteContent.trim().length <= 0
    } else {
      shouldShowButton = true
    }
  } else {
    shouldShowButton = true
  }

  if (shouldShowButton) {
    return null
  }

  const getLoadingMessage = () => {
    if (!mode) return "Chargement en cours"

    const messages = mode === "quiz" ? quizMessages : mode === "flashcards" ? flashcardsMessages : roadmapMessages

    return messages[currentMessageIndex] || messages[0]
  }

  return (
    <>
      <div
        className={`
                absolute left-1/2 ${bottomBar ? "bottom-0" : "-bottom-[209px] lg:-bottom-[113px]"} -translate-x-1/2 
                border-t border-solid border-gray w-full
                flex flex-row items-center justify-center gap-5
                transition-all duration-300 ease-in-out group bg-white
            `}
      >
        <button
          className={`
                    absolute -top-6 left-1/2 -translate-x-1/2
                    transition-transform duration-400
                    ${bottomBar ? "rotate-180" : ""}
                `}
          onClick={handleShowBottomBar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="arrow-up"
            data-name="arrow-up"
            height="16px"
            width="16px"
            viewBox="0 0 234.61 204.66"
          >
            <path
              fill="#A19D99"
              d="M114.67.27c3.08-.64,6.38-.2,8.73,1.98l108.96,108.96c7.18,8.88-4.2,20.84-13.44,14.05L117.5,23.98,15.64,125.26c-9.02,6.63-20.15-4.57-13.74-13.74L110.85,2.55c1-.93,2.49-2.01,3.82-2.28Z"
            />
            <path
              fill="#A19D99"
              d="M114.67,77.67c3.08-.64,6.38-.2,8.73,1.98l108.96,108.96c7.18,8.88-4.2,20.84-13.44,14.05l-101.41-101.28L15.64,202.66c-9.02,6.63-20.15-4.57-13.74-13.74l108.95-108.97c1-.93,2.49-2.01,3.82-2.28Z"
            />
          </svg>
        </button>
        <div className="relative flex flex-col items-center justify-between w-full gap-4 m-4
        lg:flex-row
        ">
          {!loading && (
            <>
              <div className="flex flex-row gap-4 w-full">
                <button
                  onClick={() => handleClick("quiz")}
                  id="icon-quiz"
                  className={`
                            flex flex-col align-center rounded-lg flex items-center justify-center bg-grayLight min-h-20
                              transition-all duration-300 w-1/2 ease-in-out delay-0 group-hover:delay-300
                            ${tutorialStep === 2 ? "blinking-background" : ""}
                          `}
                  aria-label="Quiz"
                  onMouseEnter={() => setHoveredButton("quiz")}
                  onMouseLeave={() => setHoveredButton(null)}
                  disabled={loading}
                >
                  <Dices tutorialStep={tutorialStep} />
                  <LabelAiNav content="Générer un quiz" />
                </button>
                <button
                  onClick={() => handleClick("assistant")}
                  id="icon-brain"
                  className={`flex items-center justify-center flex-col h-full min-h-20 p-2 w-1/2 bg-grayLight rounded-lg ${tutorialStep === 2 ? "blinking-background" : ""}`}
                  aria-label="AI Assistant"
                  onMouseEnter={() => setHoveredButton("brain")}
                  onMouseLeave={() => setHoveredButton(null)}
                  disabled={loading}
                >
                  <Brain tutorialStep={tutorialStep} />
                  <LabelAiNav content="Enrichir cette note" />
                </button>
              </div>
              <div className="flex flex-row gap-4 w-full">
                <button
                  onClick={() => handleClick("roadmap")}
                  id="icon-roadmap"
                  className={`
                              flex flex-col align-center rounded-lg flex items-center justify-center bg-grayLight min-h-20
                              transition-all duration-300 w-1/2 ease-in-out delay-0 group-hover:delay-300 ${tutorialStep === 3 ? "blinking-background" : ""}
                          `}
                  aria-label="Roadmaps"
                  onMouseEnter={() => setHoveredButton("roadmap")}
                  onMouseLeave={() => setHoveredButton(null)}
                  disabled={loading}
                >
                  <Roadmap tutorialStep={tutorialStep} />
                  <LabelAiNav content="Accéder à la roadmap" />
                </button>
                <button
                  onClick={() => handleClick("flashcards")}
                  id="icon-flashcard"
                  className={`
                              flex flex-col align-center rounded-lg flex items-center justify-center bg-grayLight min-h-20
                              transition-all duration-300 w-1/2 ease-in-out delay-0 group-hover:delay-300 ${tutorialStep === 2 ? "blinking-background" : ""}
                          `}
                  aria-label="Flashcards"
                  onMouseEnter={() => setHoveredButton("flashcard")}
                  onMouseLeave={() => setHoveredButton(null)}
                  disabled={loading}
                >
                  <FlashCard tutorialStep={tutorialStep} />
                  <LabelAiNav content="Créer des flashcards" />
                </button>
              </div>
            </>
          )}
          {loading && (
            <div className="w-full flex flex-col items-center justify-center h-20 space-y-3">
              <div className="w-full max-w-md">
                <div className="flex justify-between text-xs text-gray-600 mb-2">
                  <div className="w-full text-center animate-gray-gradient text-[14px] whitespace-nowrap flex items-center">
                    {getLoadingMessage()}
                  </div>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="w-full h-1" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AiButton
