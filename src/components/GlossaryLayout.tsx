"use client"

import { jsPDF } from "jspdf"
import type { Note } from "@/types/notes"
import { useState } from "react"
import Image from "next/image"
import useFolderStore from "@/stores/useFolderStore"

export default function GlossaryLayout({ note }: { note: Note }) {
  const noteContent = note.content
  const noteTitle = note.title
  const [isLoading, setIsLoading] = useState(false)
  const [isFolderLoading, setIsFolderLoading] = useState(false)
  const { getActiveFolder } = useFolderStore()

  // Je récupère mon active folder
  const activeFolder = getActiveFolder()

  const handleGenerateGlossaireClick = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/glossary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteContent }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erreur inconnue" }))
        throw new Error(`Erreur ${response.status}: ${errorData.error || "Erreur lors de la génération du glossaire"}`)
      }

      const data = await response.json()

      if (!data.glossary || !Array.isArray(data.glossary)) {
        throw new Error("Format de données invalide reçu de l'API")
      }

      generatePDF(data.glossary, noteTitle)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  const handleGenerateFolderGlossaryClick = async () => {
    if (!activeFolder || !activeFolder.notes || activeFolder.notes.length === 0) {
      alert("Aucune note trouvée dans ce dossier")
      return
    }

    setIsFolderLoading(true)
    try {
      // Combiner le contenu de toutes les notes du dossier
      const combinedContent = activeFolder.notes
        .map((note) => `## ${note.title}\n\n${note.content}`)
        .join("\n\n---\n\n")

      const response = await fetch("/api/glossary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteContent: combinedContent }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Erreur inconnue" }))
        throw new Error(`Erreur ${response.status}: ${errorData.error || "Erreur lors de la génération du glossaire"}`)
      }

      const data = await response.json()

      if (!data.glossary || !Array.isArray(data.glossary)) {
        throw new Error("Format de données invalide reçu de l'API")
      }

      generatePDF(data.glossary, `Glossaire - ${activeFolder.name}`)
      setIsFolderLoading(false)
    } catch (error) {
      setIsFolderLoading(false)
      console.error("Erreur lors de la génération du glossaire du dossier:", error)
    }
  }

  const generatePDF = (glossary: Array<{ term: string; definition: string }>, title: string) => {
    const doc = new jsPDF()
    let y = 20
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    const maxWidth = pageWidth - margin * 2

    doc.setFont("Helvetica", "bold")
    doc.setFontSize(18)
    doc.text(title, margin, y)
    y += 15

    doc.setFontSize(12)
    doc.setFont("Helvetica", "normal")

    glossary.forEach(({ term, definition }) => {
      if (y > 260) {
        doc.addPage()
        y = 20
      }

      doc.setFont("Helvetica", "bold")
      doc.text(`${term}:`, margin, y)
      y += 8

      doc.setFont("Helvetica", "normal")
      const definitionLines = doc.splitTextToSize(definition, maxWidth - 10)

      const linesHeight = definitionLines.length * 6
      if (y + linesHeight > 280) {
        doc.addPage()
        y = 20
        doc.setFont("Helvetica", "bold")
        doc.text(`${term}:`, margin, y)
        y += 8
        doc.setFont("Helvetica", "normal")
      }

      definitionLines.forEach((line: string) => {
        doc.text(line, margin + 10, y)
        y += 6
      })

      y += 4
    })

    doc.save(`${title}.pdf`)
  }

  return (
    <div className="p-2 absolute -bottom-[75px] -left-[8px] z-10">
      <div className=" bg-grayLight px-4 py-2 shadow-lg rounded-md translate-y-[4px] border border-gray flex flex-col gap-1">
        <button
          onClick={handleGenerateGlossaireClick}
          disabled={isLoading}
          className={`block w-full text-left text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap pr-10 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span>Génération en cours...</span>
              <div className="animate-spin rounded-full h-3 w-3">
                <Image src="/encoursgray.svg" width={12} height={12} alt="Chargement" />
              </div>
            </div>
          ) : (
            "Générer un glossaire de cette note"
          )}
        </button>
        <div className="w-full h-[1px] bg-gray"></div>
        <button
          onClick={handleGenerateFolderGlossaryClick}
          disabled={isFolderLoading || !activeFolder?.notes?.length}
          className={`block w-full text-left text-sm whitespace-nowrap ${
            isFolderLoading || !activeFolder?.notes?.length
              ? "opacity-50 cursor-not-allowed text-gray-400"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {isFolderLoading ? (
            <div className="flex items-center gap-2">
              <span>Génération en cours...</span>
              <div className="animate-spin rounded-full h-3 w-3">
                <Image src="/encoursgray.svg" width={12} height={12} alt="Chargement" />
              </div>
            </div>
          ) : (
            `Générer un glossaire du dossier actif ${activeFolder?.notes?.length ? `(${activeFolder.notes.length} notes)` : "(aucune note)"}`
          )}
        </button>
      </div>
    </div>
  )
}
