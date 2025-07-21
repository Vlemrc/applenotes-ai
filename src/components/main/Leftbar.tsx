"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Trash from "../icons/Trash"
import FolderIcon from "../icons/FolderIcon"
import Sidebar from "../icons/Sidebar"
import IconHoverContainer from "../IconHoverContainer"
import useFolderStore from "@/stores/useFolderStore"
import type { Folder } from "@/types/folders"
import AddFolderInput from "../AddFolderInput"
import ButtonDeleteFolder from "../ButtonDeleteFolder"
import { useLearningModeStore } from "@/stores/learningModeStore"
import PercentRoadMap from "../PercentRoadMap"
import { ChevronRight } from "lucide-react"

interface LeftbarProps {
  onBackToNote: () => void
  displayMode: string
  setDisplayMode: (mode: string) => void 
}

const Leftbar = ({ onBackToNote, displayMode, setDisplayMode }: LeftbarProps) => {
  const { folders, activeFolderId, setActiveFolder, fetchFolders, isLoading } = useFolderStore()
  const [addFolder, setAddFolder] = useState(false)
  const [hoveredFolderId, setHoveredFolderId] = useState<number | null>(null)
  const [editingFolderId, setEditingFolderId] = useState<number | null>(null)
  const [newFolderName, setNewFolderName] = useState<string>("")
  const { isLearningMode } = useLearningModeStore()
  const [isModifying, setIsModifying] = useState<boolean>(false)

  useEffect(() => {
    fetchFolders()
  }, [fetchFolders])

  const handleFolderClick = (folder: Folder) => {
    setActiveFolder(folder.id)
    onBackToNote()
    setDisplayMode("notes")
  }

  const handleFolderAdded = () => {
    fetchFolders()
  }

  const handleRenameFolder = async (folderId: number) => {
    try {
      const response = await fetch(`/api/folders`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: folderId, name: newFolderName }),
      })

      if (response.ok) {
        setEditingFolderId(null)
        fetchFolders()
      } else {
        console.error("Erreur lors de la mise à jour du dossier")
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du dossier", error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, folderId: number) => {
    if (e.key === "Enter") {
      handleRenameFolder(folderId)
    }
  }

  return (
    <div
      className={`${displayMode === "folder" ? "" : "translate-x-0"} translate-x-[100%] w-full h-full bg-[#FAFAFA] p-3 pt-3 flex flex-col gap-4 border-r border-solid border-gray min-w-full 
    lg:min-w-[0] lg:bg-[#E9E5E1] lg:w-1/6 lg:translate-x-0`}
    >
      <div className="nav-leftbar flex flex-row gap-2 pl-1 items-center hidden lg:flex">
        <div className="bg-[#FF5F57] h-3 w-3 rounded-full"></div>
        <div className="bg-[#FFBD2F] h-3 w-3 rounded-full"></div>
        <div className="bg-[#28C840] h-3 w-3 rounded-full mr-2"></div>
        <IconHoverContainer>
          <Sidebar />
        </IconHoverContainer>
      </div>

      <div className="notes">
        <h6
          className="font-bold text-md text-text pt-10 pb-[5px]
        lg:text-sm lg:text-grayDark lg:pt-0
        "
        >
          iCloud
        </h6>
        <ul
          className="
        bg-white rounded-md pt-1
        lg:bg-transparent pt-0"
        >
          {isLoading ? (
            <div className="text-sm text-grayDark p-2">Chargement...</div>
          ) : (
            folders
              .sort((a, b) => {
                if (a.name === "Suppr. récentes") return 1
                if (b.name === "Suppr. récentes") return -1
                return 0
              })
              .map((folder, index) => {
                const isLast = index === folders.length - 1

                return (
                  <li
                    key={folder.id}
                    onClick={() => handleFolderClick(folder)}
                    onMouseOver={() => setHoveredFolderId(folder.id)}
                    onMouseLeave={() => setHoveredFolderId(null)}
                    className={`
                      flex flex-col justify-between w-full px-2 py-1 rounded-md cursor-pointer transition-colors
                      ${activeFolderId === folder.id ? "lg:bg-[#D2CDC9]" : "lg:hover:bg-gray-100"}
                    `}
                  >
                    <div className="flex flex-row justify-between items-center pb-1 lg:pb-0">
                      <div className="flex flex-row gap-2 items-center">
                        {folder.name === "Suppr. récentes" ? (
                          <Trash color="#DC9F3A" height="18" width="18" />
                        ) : (
                          <FolderIcon color="#DC9F3A" />
                        )}
                        <div className="flex flex-col">
                          {editingFolderId === folder.id ? (
                            <input
                              type="text"
                              value={newFolderName}
                              onChange={(e) => setNewFolderName(e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, folder.id)}
                              className="h-[20px] text-sm pl-1 border-2 border-yellowInput"
                            />
                          ) : (
                            <p className="font-medium text-sm text-text">{folder.name}</p>
                          )}
                          {isLearningMode && <PercentRoadMap folderId={folder.id} />}
                        </div>
                      </div>
                      <div className="flex flex-row gap-2 items-center">
                        {(hoveredFolderId === folder.id || isModifying) &&
                          folder.name !== "Notes" &&
                          folder.name !== "Suppr. récentes" && (
                            <ButtonDeleteFolder
                              folderId={folder.id}
                              setEditingFolderId={setEditingFolderId}
                            />
                          )}
                        <p className="font-medium text-sm text-grayOpacity">{folder._count?.notes ?? 0}</p>
                        <ChevronRight className="h-4 w-4 text-grayOpacity lg:hidden" />
                      </div>
                    </div>
                    {!isLast && <div className="h-[1px] w-full bg-grayLight lg:hidden" />}
                  </li>
                )
              })
          )}
        </ul>
      </div>

      {/* ADD FOLDER */}
      <button
        className="absolute left-2.5 bottom-2.5 flex flex-row items-center gap-1.5 group"
        onClick={() => setAddFolder(!addFolder)}
      >
        <div className="relative rounded-full h-3 w-3 border border-grayDark group-hover:border-black flex items-center justify-center transition-colors duration-300">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[6px] bg-grayDark rounded-xs group-hover:bg-black transition-colors duration-300"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1px] h-[6px] bg-grayDark rotate-90 rounded-xs group-hover:bg-black transition-colors duration-300"></div>
        </div>
        <p className="font-medium text-xs text-grayDark group-hover:text-black transition-colors duration-300">
          Nouveau dossier
        </p>
      </button>

      {addFolder && <AddFolderInput setAddFolder={setAddFolder} onFolderAdded={handleFolderAdded} />}

      {/* MODIFY FOLDER MOBILE */}
      <button
        className="
      absolute right-4 top-4 text-yellow
      lg:hidden"
        onClick={() => setIsModifying(!isModifying)}
      >
        {isModifying ? "OK" : "Modifier"}
      </button>
    </div>
  )
}

export default Leftbar
