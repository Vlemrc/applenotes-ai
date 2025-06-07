import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Brain from "../icons/Brain";
import Dices from "../icons/Dices";
import FlashCard from "../icons/FlashCard";
import Roadmap from "../icons/Roadmap";
import LabelAiNav from "../LabelAiNav";
import useFolderStore from "@/stores/useFolderStore"

interface AiButtonProps {
  noteId: number;
  noteContent: string;
  onModeChange: (mode: 'quiz' | 'assistant' | 'flashcards' | 'roadmap' | null) => void;
}

const AiButton = ({ noteId, noteContent, onModeChange }: AiButtonProps) => {
    const [hoveredButton, setHoveredButton] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [mode, setMode] = useState<"quiz" | "assistant" | "flashcards" | 'roadmap' | null>(null);
    const [bottomBar, setBottomBar] = useState<boolean>(false);

    const { activeFolderId, folders } = useFolderStore()

    const fetchAIResponse = async (mode: "quiz" | "flashcards") => {
        try {
            if (!noteContent) throw new Error("Note vide")

            setLoading(true)

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
            return data
        } catch (error) {
            return null
        } finally {
            setLoading(false)
        }
    }

    const generateRoadmap = async () => {
        if (!activeFolderId) {
            return null
        }

        try {
            setLoading(true)

            const response = await fetch("/api/roadmap", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    action: "generate",
                    folderId: activeFolderId.toString()
                }),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Erreur inconnue" }))
                
                if (response.status === 409 && errorData.code === "ROADMAP_ALREADY_EXISTS") {
                    alert("Une roadmap existe déjà pour ce dossier. Consultez la roadmap existante.")
                } else {
                    alert(`Erreur: ${errorData.error}`)
                }
                return null
            }

            // Vérifier le type de contenu avant de parser en JSON
            const contentType = response.headers.get("content-type")

            if (!contentType || !contentType.includes("application/json")) {
                const textResponse = await response.text()
                return null
            }

            const data = await response.json()
            return data
        } catch (error) {
            return null
        } finally {
            setLoading(false)
        }
    }

    const handleClick = async (mode: "quiz" | "assistant" | "flashcards" | 'roadmap') => {
        if (loading) return;
        setMode(mode);

        if (mode === "quiz" || mode === "flashcards") {
            const generatedContent = await fetchAIResponse(mode);
            if (generatedContent) {
                localStorage.setItem(`generated-${mode}-${noteId}`, JSON.stringify(generatedContent));
            }
        } else if (mode === "roadmap") {
            // Générer la roadmap avant de changer de mode
            const roadmapData = await generateRoadmap();
            if (roadmapData) {
                // Optionnel : stocker la roadmap générée
                localStorage.setItem(`generated-roadmap-${activeFolderId}`, JSON.stringify(roadmapData));
            }
        }
        
        onModeChange(mode);
    };

    const handleShowBottomBar = () => {
        setBottomBar(!bottomBar);
    };
    
    // Si le dossier actif n'a pas de notes, on ne peut pas générer de quiz ou de flashcards
    const activeFolder = folders.find(folder => folder.id === activeFolderId);

    let shouldShowButton = false;
    if (activeFolder && activeFolder._count) {
        if (activeFolder._count.notes) {
            shouldShowButton = activeFolder._count.notes === 0 || noteContent.trim().length <= 0;
        } else {
            shouldShowButton = true;
        }
    } else {
        shouldShowButton = true;
    }

    if (shouldShowButton) {
        return null;
    }

    return (
        <>
        {loading && (
            mode === "quiz" ? (
                <div className="p-2 absolute top-1/2 left-1/2 -translate-x-1/2 animate-gray-gradient text-md whitespace-nowrap">
                    Quiz en cours de création
                </div>
            ) : mode === "flashcards" ? (
                <div className="p-2 absolute top-1/2 left-1/2 -translate-x-1/2 animate-gray-gradient text-md whitespace-nowrap">
                    Flashcards en cours de création
                </div>
            ) : mode === "roadmap" ? (
                <div className="p-2 absolute top-1/2 left-1/2 -translate-x-1/2 animate-gray-gradient text-md whitespace-nowrap">
                    Roadmap en cours de création
                </div>
            ) : null
        )}
        <div
            className={`
                absolute left-1/2 ${bottomBar ? "bottom-0" :"-bottom-[113px]"} -translate-x-1/2 
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
                <svg xmlns="http://www.w3.org/2000/svg" id="arrow-up" data-name="arrow-up" height="16px" width="16px" viewBox="0 0 234.61 204.66">
                    <path fill="#A19D99" d="M114.67.27c3.08-.64,6.38-.2,8.73,1.98l108.96,108.96c7.18,8.88-4.2,20.84-13.44,14.05L117.5,23.98,15.64,125.26c-9.02,6.63-20.15-4.57-13.74-13.74L110.85,2.55c1-.93,2.49-2.01,3.82-2.28Z"/>
                    <path fill="#A19D99" d="M114.67,77.67c3.08-.64,6.38-.2,8.73,1.98l108.96,108.96c7.18,8.88-4.2,20.84-13.44,14.05l-101.41-101.28L15.64,202.66c-9.02,6.63-20.15-4.57-13.74-13.74l108.95-108.97c1-.93,2.49-2.01,3.82-2.28Z"/>
                </svg>
            </button>
            <div className="relative flex items-center justify-between w-full gap-4 m-4">
                <button
                    onClick={() => handleClick('quiz')}
                    id="icon-quiz" 
                    className={`
                       flex flex-col align-center rounded-lg flex items-center justify-center bg-grayLight min-h-20
                        transition-all duration-300 w-1/4 ease-in-out delay-0 group-hover:delay-300
                    `}
                    aria-label="Quiz"
                    onMouseEnter={() => setHoveredButton('quiz')}
                    onMouseLeave={() => setHoveredButton(null)}
                    disabled={loading}
                >
                    <Dices />
                    <LabelAiNav content="Générer un quiz" />
                </button>
                <button 
                    onClick={() => handleClick('assistant')}
                    id="icon-brain" 
                    className="flex items-center justify-center flex-col h-full min-h-20 p-2 w-1/4 bg-grayLight rounded-lg"
                    aria-label="AI Assistant"
                    onMouseEnter={() => setHoveredButton('brain')}
                    onMouseLeave={() => setHoveredButton(null)}
                    disabled={loading}
                >
                    <Brain />
                    <LabelAiNav content="Enrichir cette note" />
                </button>
                <button
                    onClick={() => handleClick('roadmap')}
                    id="icon-roadmap"
                    className={`
                        flex flex-col align-center rounded-lg flex items-center justify-center bg-grayLight min-h-20
                        transition-all duration-300 w-1/4 ease-in-out delay-0 group-hover:delay-300
                    `}
                    aria-label="Roadmaps"
                    onMouseEnter={() => setHoveredButton('roadmap')}
                    onMouseLeave={() => setHoveredButton(null)}
                    disabled={loading}
                >
                    <Roadmap />
                    <LabelAiNav content="Accéder à la roadmap" />
                </button>
                <button
                    onClick={() => handleClick('flashcards')}
                    id="icon-flashcard"
                    className={`
                        flex flex-col align-center rounded-lg flex items-center justify-center bg-grayLight min-h-20
                        transition-all duration-300 w-1/4 ease-in-out delay-0 group-hover:delay-300
                    `}
                    aria-label="Flashcards"
                    onMouseEnter={() => setHoveredButton('flashcard')}
                    onMouseLeave={() => setHoveredButton(null)}
                    disabled={loading}
                >
                    <FlashCard />
                    <LabelAiNav content="Créer des flashcards" />
                </button>
            </div>
        </div>
        </>
    );
};

export default AiButton;