"use client"
import Trash from "./icons/Trash"
import MenuGrid from "./icons/MenuGrid"
import MenuNotes from "./icons/MenuNotes"
import useFolderStore from "@/stores/useFolderStore"
import { ChevronLeft } from "lucide-react"
import IconHoverContainer from "./IconHoverContainer"
import Write from "./icons/Write"

interface LeftbarNavProps {
  activeNote: any
  onNoteDeleted?: () => void
  setDisplayMode: (mode: string) => void
  onNoteCreated: (newNote: any) => void
}

const LeftbarNav = ({ activeNote, onNoteDeleted, setDisplayMode, onNoteCreated }: LeftbarNavProps) => {
  const { activeFolderId, folders, fetchFolders } = useFolderStore()
  const currentFolder = folders?.find((folder) => folder.id === activeFolderId)
  const noteId = activeNote?.id

  const handleCreateNote = async () => {
    if (!activeFolderId) {
      console.error("Aucun dossier actif sélectionné")
      return
    }

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ folderId: activeFolderId }),
      })

      if (!response.ok) {
        console.error("Erreur lors de la création de la note")
        return
      }

      const newNote = await response.json()

      onNoteCreated(newNote)
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API :", error)
    }
  }

  const handleTrashClick = async () => {
    if (!activeNote || !activeNote.id) {
      console.error("Aucune note active sélectionnée.")
      return
    }

    try {
      const response = await fetch("/api/notes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: noteId }),
      })

      if (response.ok) {
        const result = await response.json()
        fetchFolders()
        if (onNoteDeleted) {
          onNoteDeleted()
        }
      } else {
        console.error("Erreur lors de la suppression ou du déplacement de la note.")
      }
    } catch (error) {
      console.error("Erreur lors de la requête :", error)
    }
  }

  return (
    <div
      className={`${currentFolder && currentFolder._count.notes === 0 ? "" : "border-b border-solid border-gray"} h-[50px] flex flex-row justify-between items-center px-2.5 py-4`}
    >
      <button 
        className="flex flex-row items-center gap-1 lg:hidden"
        onClick={() => setDisplayMode("folder")}>
        <ChevronLeft
          className="text-yellow h-6 w-6"
        />
        <p className="text-yellow">Dossier</p>
      </button>
      <p className="text-text font-bold text-md absolute left-1/2 top-3 translate-x-[-50%] lg:hidden">{currentFolder?.name}</p>
      <div className="hidden lg:flex flex-row items-center">
        <div className="bg-grayLight rounded-md cursor-pointer transition-colors duration-300 h-7 w-8 flex items-center justify-center">
          <MenuNotes />
        </div>
        <div className="hover:bg-grayLight rounded-md cursor-pointer transition-colors duration-300 h-7 w-8 flex items-center justify-center">
          <MenuGrid />
        </div>
      </div>
      <div className="flex flex-row items-center">
        <div className="lg:hidden">
          <IconHoverContainer onClick={handleCreateNote}>
            <Write color="#6F6F6F" />
          </IconHoverContainer>
        </div>
        <div
          className="hover:bg-grayLight rounded-md cursor-pointer transition-colors duration-300 h-7 w-8 flex items-center justify-center"
          onClick={handleTrashClick}
        >
          <Trash color="#6F6F6F" height="22" width="22" />
        </div>
      </div>
    </div>
  )
}

export default LeftbarNav
