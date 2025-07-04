"use client"

import { jsPDF } from "jspdf"
import type { Note } from "@/types/notes"
import { useState } from "react"
import Image from "next/image"

export default function GlossaryLayout({ note }: { note: Note }) {
  console.log("GlossaryLayout", note)
  const noteContent = note.content
  const noteTitle = note.title
  const [isLoading, setIsLoading] = useState(false)

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
        console.error("Erreur API:", errorData)
        throw new Error(`Erreur ${response.status}: ${errorData.error || "Erreur lors de la génération du glossaire"}`)
      }

      const data = await response.json()

      // Vérifier que la structure attendue est présente
      if (!data.glossary || !Array.isArray(data.glossary)) {
        throw new Error("Format de données invalide reçu de l'API")
      }

      const doc = new jsPDF()
      let y = 20
      const pageWidth = doc.internal.pageSize.getWidth()
      const margin = 20
      const maxWidth = pageWidth - margin * 2 // Largeur disponible pour le texte

      doc.setFont("Helvetica", "bold")
      doc.setFontSize(18)
      doc.text(noteTitle, margin, y)
      y += 15

      doc.setFontSize(12)
      doc.setFont("Helvetica", "normal")

      data.glossary.forEach(({ term, definition }: { term: string; definition: string }) => {
        // Vérifier si on a assez de place pour au moins le terme + 2 lignes
        if (y > 260) {
          doc.addPage()
          y = 20
        }

        // Afficher le terme en gras
        doc.setFont("Helvetica", "bold")
        doc.text(`${term}:`, margin, y)
        y += 8

        // Diviser la définition en plusieurs lignes si nécessaire
        doc.setFont("Helvetica", "normal")
        const definitionLines = doc.splitTextToSize(definition, maxWidth - 10) // -10 pour l'indentation

        // Vérifier si on a assez de place pour toutes les lignes de la définition
        const linesHeight = definitionLines.length * 6
        if (y + linesHeight > 280) {
          doc.addPage()
          y = 20
          // Répéter le terme sur la nouvelle page
          doc.setFont("Helvetica", "bold")
          doc.text(`${term}:`, margin, y)
          y += 8
          doc.setFont("Helvetica", "normal")
        }

        // Afficher chaque ligne de la définition
        definitionLines.forEach((line: string) => {
          doc.text(line, margin + 10, y) // +10 pour l'indentation
          y += 6
        })

        y += 4 // Espacement entre les entrées
      })

      doc.save(`${noteTitle}.pdf`)
      setIsLoading(false)
    } catch (error) {
      console.error("Erreur : ", error)
      alert(`Erreur: ${error.message}`)
      setIsLoading(false)
    }
  }

  return (
    <div className="p-2 absolute -bottom-[75px] -left-[8px] z-10">
      <div
        onClick={handleGenerateGlossaireClick}
        className=" bg-grayLight px-4 py-2 shadow-lg rounded-md translate-y-[4px] border border-gray flex flex-col gap-1"
      >
        <button
          disabled={isLoading}
          className={`block w-full text-left text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap pr-10 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {!isLoading ? (
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
        <button className="block w-full text-left text-sm whitespace-nowrap">
          Générer un glossaire du dossier actif
        </button>
      </div>
    </div>
  )
}
