"use client"

import Brain from "./icons/Brain"
import Dices from "./icons/Dices"
import FlashCard from "./icons/FlashCard"
import { useState } from "react"
import LabelAiNav from "./LabelAiNav"
import { AnimatePresence } from "framer-motion"

const AiButton = () => {
    const [hoveredButton, setHoveredButton] = useState<string | null>(null)

    return (
        <div
            className={`
                absolute left-1/2 bottom-20 -translate-x-1/2 
                bg-grayLight py-[6px] rounded-lg 
                flex flex-row items-center justify-center gap-5
                transition-all duration-300 ease-in-out delay-500 hover:delay-0 w-[70px] hover:w-[146px] group
            `}
        >
            <div className="relative flex items-center justify-center">
                <button 
                    id="icon-quiz" 
                    className={`
                        absolute w-10 h-10 rounded-full
                        transition-all duration-300 ease-in-out -translate-x-11 -translate-y-0.5 opacity-0 group-hover:opacity-100 delay-0 group-hover:delay-300
                    `}
                    aria-label="Quiz"
                    onMouseEnter={() => setHoveredButton('quiz')}
                    onMouseLeave={() => setHoveredButton(null)}
                >
                    <Dices />
                    <AnimatePresence>
                        {hoveredButton === 'quiz' && <LabelAiNav content="Générer un quiz" />}
                    </AnimatePresence>
                </button>
                <button 
                    id="icon-brain" 
                    className="w-10 h-10 p-2 rounded-full"
                    aria-label="AI Assistant"
                    onMouseEnter={() => setHoveredButton('brain')}
                    onMouseLeave={() => setHoveredButton(null)}
                >
                    <Brain />
                    <AnimatePresence>
                        {hoveredButton === 'brain' && <LabelAiNav content="Utiliser l'IA pour enrichir cette note" />}
                    </AnimatePresence>
                </button>
                <button
                    id="icon-flashcard"
                    className={`
                        absolute -left-0 w-10 h-10 -translate-y-[3px] rounded-full
                        transition-all duration-300 ease-in-out translate-x-10 opacity-0 group-hover:opacity-100 delay-0 group-hover:delay-300
                    `}
                    aria-label="Flashcards"
                    onMouseEnter={() => setHoveredButton('flashcard')}
                    onMouseLeave={() => setHoveredButton(null)}
                >
                    <FlashCard />
                    <AnimatePresence>
                        {hoveredButton === 'flashcard' && <LabelAiNav content="Créer des flashcards" />}
                    </AnimatePresence>
                </button>
            </div>
        </div>
    )
}

export default AiButton