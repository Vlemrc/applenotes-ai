"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

interface QuizDetailsInputProps {
  setShowQuizDetails: (show: boolean) => void
  onQuizGenerate: (complexity: string, questionCount: number) => void
  noteContent: string
  showQuizDetails: boolean
}

export default function QuizDetailsInput({ showQuizDetails, setShowQuizDetails, onQuizGenerate, noteContent }: QuizDetailsInputProps) {
  const [complexity, setComplexity] = useState("moyen")
  const [questionCount, setQuestionCount] = useState(0)

  const calculateQuestionCount = (content: string, complexityLevel: string) => {
    const wordCount = content.trim().split(/\s+/).length
    const baseQuestions = Math.max(3, Math.min(15, Math.floor(wordCount / 20)))

    switch (complexityLevel) {
      case "facile":
        return Math.max(3, Math.floor(baseQuestions * 0.7))
      case "moyen":
        return baseQuestions
      case "difficile":
        return Math.min(20, Math.floor(baseQuestions * 1.3))
      default:
        return baseQuestions
    }
  }

  useEffect(() => {
    const calculatedCount = calculateQuestionCount(noteContent, complexity)
    setQuestionCount(calculatedCount)
  }, [noteContent, complexity])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onQuizGenerate(complexity, questionCount)
  }

  const getComplexityDescription = (level: string) => {
    switch (level) {
      case "facile":
        return "Questions simples et directes"
      case "moyen":
        return "Questions équilibrées avec un peu de réflexion"
      case "difficile":
        return "Questions complexes nécessitant une analyse approfondie"
      default:
        return ""
    }
  }

  return (
    <div
      className={`absolute flex items-center justify-center left-1/2 transform -translate-x-1/2 transition-[bottom] ease-in-out duration-300 z-[1000000] w-full ${
        showQuizDetails ? "bottom-0" : "-bottom-[600px]"
      }`}
    >

      <div
        className="bg-white w-full p-6 flex flex-col gap-4 border-t border-gray"
      >
        <h2 className="text-black font-bold text-sm">Configuration du Quiz</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 border-b border-gray pb-4">
            <label className="text-sm font-medium">Complexité :</label>
            <div className="flex flex-col gap-2">
              {["facile", "moyen", "difficile"].map((level) => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="complexity"
                    value={level}
                    checked={complexity === level}
                    onChange={(e) => setComplexity(e.target.value)}
                    className="w-4 h-4 text-yellow bg-gray-100 border-gray-300 focus:ring-yellow focus:ring-2"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium capitalize">{level}</span>
                    <span className="text-xs text-gray-600">{getComplexityDescription(level)}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 border-b border-gray pb-4">
            <label className="text-sm font-medium">Nombre de questions :</label>
            <div className="p-2 bg-grayLight rounded-lg">
              <span className="text-sm font-semibold text-yellow">{questionCount} questions</span>
              <p className="text-xs text-gray-600 mt-1">
                Calculé automatiquement selon la longueur de votre note et la complexité choisie
              </p>
            </div>
          </div>

          <div className="flex flex-row justify-end gap-2">
            <button
              type="button"
              className="text-sm border border-solid border-grayLight shadow-sm w-[80px] rounded-md font-medium hover:bg-grayLight transition-colors duration-300"
              onClick={() => setShowQuizDetails(false)}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="text-sm bg-yellowButton w-[120px] rounded-md font-medium hover:bg-yellow transition-colors duration-300"
            >
              Générer le quiz
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
