"use client";
import React from 'react';
import Trash from '../icons/Trash';
import FolderIcon from '../icons/FolderIcon';
import Sidebar from '../icons/Sidebar';
import IconHoverContainer from '../IconHoverContainer';
import { useEffect, useState } from 'react';
import useFolderStore from '@/stores/useFolderStore';
import { Folder } from '@/types/folders';

interface LeftbarProps {
  onBackToNote: () => void;
}

const Leftbar = ({ onBackToNote }: LeftbarProps) => {
  const { folders, activeFolderId, setActiveFolder, fetchFolders, isLoading } = useFolderStore()

  useEffect(() => {
    fetchFolders()
  }, [fetchFolders])

  const handleFolderClick = (folder: Folder) => {
    setActiveFolder(folder.id);
    onBackToNote();
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
            <>
              {folders.map((folder) => (
                <li
                  key={folder.id}
                  onClick={() => handleFolderClick(folder)}
                  className={`flex flex-row justify-between w-full px-2 py-1 rounded-md cursor-pointer transition-colors ${
                    activeFolderId === folder.id ? "bg-[#D2CDC9]" : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex flex-row gap-2 items-center">
                    {folder.name === "Suppr. récentes" ? 
                      (<Trash color="#DC9F3A" height="18" width="18" />) : 
                      (<FolderIcon color="#DC9F3A" />)
                    }
                    <p className={`font-medium text-sm text-text`}>
                      {folder.name}
                    </p>
                  </div>
                  <p className={`font-medium text-sm text-grayOpacity`}>{folder._count.notes}</p>
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Leftbar;