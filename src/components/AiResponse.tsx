"use client"

import { useState } from "react"
import Dislike from "./icons/Dislike"
import Replace from "./icons/Replace"
import Copy from "./icons/Copy"

interface AiResponseProps {
  aiResponse: string
  userMessage: string
  onBack: () => void
  folderId?: number
  noteId?: number
}

const AiResponse = ({ aiResponse, userMessage, onBack, folderId, noteId }: AiResponseProps) => {
  const [copied, setCopied] = useState(false)
  const [isCreatingNote, setIsCreatingNote] = useState(false)
  const [noteCreated, setNoteCreated] = useState(false)
  const [isReplacingNote, setIsReplacingNote] = useState(false)
  const [noteReplaced, setNoteReplaced] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(aiResponse)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  const handleCreateNote = async () => {
    if (!folderId) {
      alert("Aucun dossier sélectionné")
      return
    }

    setIsCreatingNote(true)
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `Note générée par IA - ${new Date().toLocaleDateString()}`,
          content: aiResponse,
          folderId: folderId,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la création de la note")
      }

      setNoteCreated(true)
      setTimeout(() => setNoteCreated(false), 3000)
    } catch (error) {
      console.error("Erreur:", error)
      alert("Erreur lors de la création de la note")
    } finally {
      setIsCreatingNote(false)
      window.location.reload()
    }
  }

  const handleReplaceNote = async () => {
    if (!noteId) {
      alert("Aucune note sélectionnée à remplacer")
      return
    }

    setIsReplacingNote(true)
    try {
      const response = await fetch("/api/notes", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: noteId,
          content: aiResponse,
        }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors du remplacement de la note")
      }

      setNoteReplaced(true)
      setTimeout(() => setNoteReplaced(false), 3000)

      // ✅ Ajout d'un rechargement de la page pour voir les changements
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error("Erreur:", error)
      alert("Erreur lors du remplacement de la note")
    } finally {
      setIsReplacingNote(false)
    }
  }

  return (
    <>
      <div className="flex justify-end">
        <div className="w-fit bg-grayLight p-4 px-6 mb-6 rounded-lg rounded-tr-none">
          <p>{userMessage}</p>
        </div>
      </div>
      <div>
        <p className="text-md whitespace-pre-line">{aiResponse}</p>
      </div>
      <div id="nav-buttons" className="flex flex-row pt-4 gap-2">
        <button
          className="text-grayOpacity font-medium text-sm px-2.5 py-1 rounded-lg transition-all hover:bg-zinc-50"
          style={{ border: "1px solid var(--gray)" }}
          onClick={handleCopy}
          title="Copier la réponse"
        >
          {copied ? (
            <svg width="18" height="18" fill="none" viewBox="0 0 16 16">
              <path
                d="M4 8.5L7 11.5L12 5.5"
                stroke="#6F6F6F"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <Copy color="#6F6F6F" />
          )}
        </button>
        <button
          className="text-grayOpacity font-medium text-sm px-2.5 py-1 rounded-lg transition-all hover:bg-zinc-50"
          style={{ border: "1px solid var(--gray)" }}
          onClick={handleCreateNote}
          disabled={isCreatingNote}
        >
          <span className="italic text-grayDark font-semibold text-[16px] mr-1.5">+</span>
          {isCreatingNote ? "Création..." : noteCreated ? "✓ Créée" : "Nouvelle note"}
        </button>
        {noteId && (
          <button
            className="text-grayOpacity font-medium text-sm px-2.5 py-1 rounded-lg transition-all hover:bg-zinc-50 flex flex-row gap-2"
            style={{ border: "1px solid var(--gray)" }}
            onClick={handleReplaceNote}
            disabled={isReplacingNote}
          >
            <Replace color="#6F6F6F" />
            {isReplacingNote ? "Remplacement..." : noteReplaced ? "✓ Remplacée" : "Remplacer"}
          </button>
        )}
        <button
          className="text-grayOpacity font-medium text-sm px-2.5 py-1 rounded-lg transition-all hover:bg-zinc-50 flex flex-row gap-2"
          style={{ border: "1px solid var(--gray)" }}
          onClick={onBack}
        >
          <Dislike color="#6F6F6F" /> Recommencer
        </button>
        <button
          className={`text-grayOpacity font-medium text-sm px-2.5 py-1 rounded-lg transition-all hover:bg-zinc-50`}
          style={{ border: "1px solid var(--gray)" }}
        >
          <span className="italic font-semibold text-[16px] text-grayDark mr-1.5">?</span>Questions fréquentes
        </button>
      </div>
    </>
  )
}

export default AiResponse
