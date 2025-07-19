"use client"
import Trash from "./icons/Trash"
import MenuGrid from "./icons/MenuGrid"
import MenuNotes from "./icons/MenuNotes"
import useFolderStore from "@/stores/useFolderStore"

interface LeftbarNavProps {
  activeNote: any
  onNoteDeleted?: () => void
}

const LeftbarNav = ({ activeNote, onNoteDeleted }: LeftbarNavProps) => {
  const { activeFolderId, folders, fetchFolders } = useFolderStore()
  const currentFolder = folders?.find((folder) => folder.id === activeFolderId)
  const noteId = activeNote?.id

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
        // Appeler le callback pour notifier le parent de la suppression
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
      <div className="flex flex-row items-center">
        <div className="bg-grayLight rounded-md cursor-pointer transition-colors duration-300 h-7 w-8 flex items-center justify-center">
          <MenuNotes />
        </div>
        <div className="hover:bg-grayLight rounded-md cursor-pointer transition-colors duration-300 h-7 w-8 flex items-center justify-center">
          <MenuGrid />
        </div>
      </div>
      <div
        className="hover:bg-grayLight rounded-md cursor-pointer transition-colors duration-300 h-7 w-8 flex items-center justify-center"
        onClick={handleTrashClick}
      >
        <Trash color="#6F6F6F" height="22" width="22" />
      </div>
    </div>
  )
}

export default LeftbarNav
