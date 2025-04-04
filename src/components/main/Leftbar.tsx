"use client";
import React, { useState, useEffect } from "react";
import Trash from "../icons/Trash";
import FolderIcon from "../icons/FolderIcon";
import Sidebar from "../icons/Sidebar";
import IconHoverContainer from "../IconHoverContainer";
import useFolderStore from "@/stores/useFolderStore";
import { Folder } from "@/types/folders";
import AddFolderInput from "../AddFolderInput";
import ButtonDeleteFolder from "../ButtonDeleteFolder";

interface LeftbarProps {
  onBackToNote: () => void;
}

const Leftbar = ({ onBackToNote }: LeftbarProps) => {
  const { folders, activeFolderId, setActiveFolder, fetchFolders, isLoading } =
    useFolderStore();
  const [addFolder, setAddFolder] = useState(false);
  const [hoveredFolderId, setHoveredFolderId] = useState<number | null>(null); // Correction du type

  useEffect(() => {
    fetchFolders();
  }, [fetchFolders]);

  const handleFolderClick = (folder: Folder) => {
    setActiveFolder(folder.id);
    onBackToNote();
  };

  const handleFolderAdded = () => {
    fetchFolders();
  };

  return (
    <div className="w-1/6 h-full bg-[#E9E5E1] p-3 pt-3 flex flex-col gap-4 border-r border-solid border-gray">
      <div className="nav-leftbar flex flex-row gap-2 pl-1 items-center">
        <div className="bg-[#FF5F57] h-3 w-3 rounded-full"></div>
        <div className="bg-[#FFBD2F] h-3 w-3 rounded-full"></div>
        <div className="bg-[#28C840] h-3 w-3 rounded-full mr-2"></div>
        <IconHoverContainer>
          <Sidebar />
        </IconHoverContainer>
      </div>

      <div className="notes">
        <h6 className="font-bold text-xs text-grayDark pb-[5px]">iCloud</h6>
        <ul>
          {isLoading ? (
            <div className="text-sm text-grayDark p-2">Chargement...</div>
          ) : (
            folders
              .sort((a, b) => {
                if (a.name === "Suppr. récentes") return 1;
                if (b.name === "Suppr. récentes") return -1;
                return 0;
              })
              .map((folder) => (
                <li
                  key={folder.id}
                  onClick={() => handleFolderClick(folder)}
                  onMouseOver={() => setHoveredFolderId(folder.id)} // Mise à jour du dossier survolé
                  onMouseLeave={() => setHoveredFolderId(null)} // Réinitialisation lorsque la souris quitte le dossier
                  className={`flex flex-row justify-between w-full px-2 py-1 rounded-md cursor-pointer transition-colors ${
                    activeFolderId === folder.id
                      ? "bg-[#D2CDC9]"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex flex-row gap-2 items-center">
                    {folder.name === "Suppr. récentes" ? (
                      <Trash color="#DC9F3A" height="18" width="18" />
                    ) : (
                      <FolderIcon color="#DC9F3A" />
                    )}
                    <p className={`font-medium text-sm text-text`}>
                      {folder.name}
                    </p>
                  </div>

                  <div className="flex flex-row gap-2 items-center">
                    {hoveredFolderId === folder.id && ( // Vérifie si le dossier est celui survolé
                      <ButtonDeleteFolder folderId={folder.id} />
                    )}
                    <p className={`font-medium text-sm text-grayOpacity`}>
                      {folder._count?.notes ?? 0}
                    </p>
                  </div>
                </li>
              ))
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

      {addFolder && (
        <AddFolderInput
          setAddFolder={setAddFolder}
          onFolderAdded={handleFolderAdded}
        />
      )}
    </div>
  );
};

export default Leftbar;