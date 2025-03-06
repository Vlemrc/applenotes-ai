import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Brain from "./icons/Brain";
import Dices from "./icons/Dices";
import FlashCard from "./icons/FlashCard";
import LabelAiNav from "./LabelAiNav";

interface AiButtonProps {
  noteId: number;
  noteContent: string;
  onModeChange: (mode: 'quiz' | 'assistant' | 'flashcards' | null) => void;
}

const AiButton = ({ noteId, noteContent, onModeChange }: AiButtonProps) => {
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false); // 🔥 État de chargement

    const fetchAIResponse = async (mode: "quiz" | "flashcards") => {
        try {
            if (!noteContent) throw new Error("Note vide");

            setLoading(true); // 🟢 Démarrer le chargement

            const response = await fetch("/api/openai", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ noteContent, type: mode }),
            });

            if (!response.ok) {
                console.error("Erreur lors de la génération du quiz", await response.text());
                return null;
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Erreur dans fetchAIResponse :", error);
            return null;
        } finally {
            setLoading(false); // 🔴 Arrêter le chargement
        }
    };

    const handleClick = async (mode: "quiz" | "assistant" | "flashcards") => {
        if (loading) return; // 🔥 Empêcher le clic multiple

        if (mode === "quiz" || mode === "flashcards") {
            const generatedContent = await fetchAIResponse(mode);
            if (generatedContent) {
                localStorage.setItem(`generated-${mode}-${noteId}`, JSON.stringify(generatedContent));
            }
        }

        const path = `/notes/${noteId}/${mode === "assistant" ? "assistant-ia" : mode}`;
        window.history.pushState({}, "", path);
        onModeChange(mode);
    };

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
                    onClick={() => handleClick('quiz')}
                    id="icon-quiz" 
                    className={`
                        absolute w-10 h-10 rounded-full flex items-center justify-center
                        transition-all duration-300 ease-in-out -translate-x-11 -translate-y-0.5 opacity-0 group-hover:opacity-100 delay-0 group-hover:delay-300
                        ${loading ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                    aria-label="Quiz"
                    onMouseEnter={() => setHoveredButton('quiz')}
                    onMouseLeave={() => setHoveredButton(null)}
                    disabled={loading} // 🔥 Désactive le bouton pendant le chargement
                >
                    {loading ? (
                        <div className="animate-spin h-6 w-6 border-4 border-gray-300 border-t-transparent rounded-full"></div> // 🔄 Loader
                    ) : (
                        <Dices />
                    )}
                    <AnimatePresence>
                        {hoveredButton === 'quiz' && <LabelAiNav content="Générer un quiz" />}
                    </AnimatePresence>
                </button>

                <button 
                    onClick={() => handleClick('assistant')}
                    id="icon-brain" 
                    className="w-10 h-10 p-2 rounded-full"
                    aria-label="AI Assistant"
                    onMouseEnter={() => setHoveredButton('brain')}
                    onMouseLeave={() => setHoveredButton(null)}
                    disabled={loading}
                >
                    <Brain />
                    <AnimatePresence>
                        {hoveredButton === 'brain' && <LabelAiNav content="Utiliser l'IA pour enrichir cette note" />}
                    </AnimatePresence>
                </button>

                <button
                    onClick={() => handleClick('flashcards')}
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
    );
};

export default AiButton;
