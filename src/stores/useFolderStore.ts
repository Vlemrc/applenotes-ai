import { create } from "zustand"
import { getFolders } from "@/lib/getFolders"
import { Folder } from "@/types/folders"

type FolderStore = {
  folders: Folder[]
  activeFolderId: number | null
  setActiveFolder: (id: number) => void
  fetchFolders: () => Promise<void>
  deleteFolder: (id: number) => void
  isLoading: boolean
}

const useFolderStore = create<FolderStore>((set, get) => ({
  folders: [],
  activeFolderId: 1,
  isLoading: false,
  setActiveFolder: (id) => set({ activeFolderId: id }),
  fetchFolders: async () => {
    set({ isLoading: true })
    try {
      const folders = await getFolders()
      set({ folders, isLoading: false })
    } catch (error) {
      console.error("Failed to fetch folders:", error)
      set({ isLoading: false })
    }
  },
  deleteFolder: (id) => {
    const { folders, activeFolderId, setActiveFolder } = get()

    // Supprime le dossier de la liste
    const updatedFolders = folders.filter((folder) => folder.id !== id)

    // Met à jour les dossiers
    set({ folders: updatedFolders })

    // Si le dossier actif est supprimé, définir un nouveau dossier actif
    if (activeFolderId === id) {
      if (updatedFolders.length > 0) {
        setActiveFolder(updatedFolders[0].id) // Définit le premier dossier comme actif
      } else {
        setActiveFolder(null) // Aucun dossier disponible
      }
    }
  },
}))

export default useFolderStore