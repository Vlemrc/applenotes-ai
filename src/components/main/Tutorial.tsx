"use client"

import { useState } from "react"

import React from "react"
import { ArrowRight } from "lucide-react"
import AppleSphere from "../AppleSphere"

interface TutorialProps {
  onModeChange: (mode: "quiz" | "assistant" | "flashcards" | "roadmap" | "tutorial" | null) => void
  step: number
  setStep: (step: number) => void
}

export default function Tutorial({ onModeChange, step, setStep }: TutorialProps) {
  const [mode, setMode] = useState<"quiz" | "assistant" | "flashcards" | "roadmap" | "tutorial" | null>("tutorial")

  const handleNextStep = () => {
    if (step < content.length) {
      setStep(step + 1)
    }
  }

  const handleModeChange = (newMode: "quiz" | "assistant" | "flashcards" | "roadmap" | "tutorial" | null) => {
    setMode(newMode)
    onModeChange(newMode)
    setStep(5)
  }

  const content = [
    {
      subtitle: "",
      title: "Mode Apprentissage",
      description: "Voici votre boîte à outils IA pour booster vos notes.",
      stepNumber: 1,
    },
    {
      subtitle: "Nouveau - Quiz, Flashcard, AI Assistant",
      title: "Apprends Autrement",
      description:
        "Avec un simple clic, génère des quiz pour t'auto-évaluer, des flashcards pour mémoriser, ou dialogue directement avec l'IA pour explorer les idées de ton contenu.",
      stepNumber: 2,
    },
    {
      subtitle: "Nouveau - Roadmap",
      title: "Un dossier. Une direction.",
      description:
        "L'IA lit ton dossier et transforme chaque note en une étape de ta progression. Tu obtiens une roadmap claire, organisée, prête à t'accompagner pas à pas.",
      stepNumber: 3,
    },
    {
      subtitle: "Nouveau - Glossaire",
      title: "Clarifie l'essentiel",
      description:
        "Une petite icône est apparue à côté de l'icône du mode apprentissage. Obtiens un glossaire structuré, avec définitions précises et accessibles. Idéal pour réviser, enseigner, ou mieux comprendre ce que tu viens d'écrire. Moins d'ambiguïtés, plus de clarté. Tu maîtrises ton sujet.",
      stepNumber: 4,
    },
  ]

  const currentContent = content[step - 1]

  return (
    <section className="flex items-center justify-center flex-row h-full">
      <div className="w-full h-full -translate-y-20 flex flex-col items-center justify-center relative">
        <p className="text-sm text-grayDark text-center absolute top-20 left-1/2 -translate-x-1/2">Didacticiel</p>
        {step === 1 && (
          <>
            <h2 className="pt-20 text-2xl font-bold w-full bg-transparent outline-none pb-1 text-center text-[#161828]">
              {currentContent.title}
            </h2>
            <p className="font-bold text-center text-text">{currentContent.description}</p>
            <div className="flex flex-col justify-between gap-8">
            <AppleSphere step={step} />
              <div className="flex flex-row justify-between items-center gap-4 w-full">
                <p className="text-sm">{String(currentContent.stepNumber).padStart(2, "0")}</p>
                <button className="flex flex-row items-center gap-2 animlinkunderline" onClick={handleNextStep}>
                  <p className="text-sm">Suivant</p>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}

        {step > 1 && (
          <>
            <div className="flex flex-row gap-8 h-[85%] items-center justify-center">
              <div className="w-1/2 flex flex-col">
                <h6 className="font-semibold pb-3">{currentContent.subtitle}</h6>
                <h2 className="font-bold text-6xl tracking-tighter pb-5">
                  {currentContent.title.split(" ").map((word, index, array) => (
                    <React.Fragment key={index}>
                      {word}
                      {index === Math.floor(array.length / 2) - 1 && <br />}
                      {index < array.length - 1 && index !== Math.floor(array.length / 2) - 1 && " "}
                    </React.Fragment>
                  ))}
                </h2>
                <p className="text-grayDark font-semibold text-sm">{currentContent.description}</p>
              </div>
              <div className="w-1/2"><AppleSphere step={step} /></div>
            </div>
            <div className="flex flex-row justify-between items-center gap-4 w-full">
              <p className="text-sm">{String(currentContent.stepNumber).padStart(2, "0")}</p>
              {step < content.length && (
                <button className="flex flex-row items-center gap-2 animlinkunderline" onClick={handleNextStep}>
                  <p className="text-sm">Suivant</p>
                  <ArrowRight size={16} />
                </button>
              )}
              {step === content.length && (
                <button
                  className="flex flex-row items-center gap-2 animlinkunderline"
                  onClick={() => handleModeChange(null)}
                >
                  <p className="text-sm">C&apos;est parti ! Découvrez tout ce que votre assistant peut faire.</p>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
