import { create } from "zustand"
import { getFolders } from "@/lib/getFolders"
import { Folder } from "@/types/folders"

type FolderStore = {
  folders: Folder[]
  activeFolderId: number | null
  setActiveFolder: (id: number) => void
  fetchFolders: () => Promise<void>
  isLoading: boolean
}

const useFolderStore = create<FolderStore>((set) => ({
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
}))

export default useFolderStore

