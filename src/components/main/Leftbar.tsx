"use client";
import React from 'react';
import Trash from '../icons/Trash';
import Folder from '../icons/Folder';
import Sidebar from '../icons/Sidebar';
import IconHoverContainer from '../IconHoverContainer';
import { useEffect, useState } from 'react';
import useFolderStore from '@/stores/useFolderStore';

const Leftbar = () => {
  const { folders, activeFolderId, setActiveFolder, fetchFolders, isLoading } = useFolderStore()

  useEffect(() => {
    fetchFolders()
  }, [fetchFolders])

  return (
    <div className="w-1/6 h-full bg-gray p-4 pt-3 flex flex-col gap-8">
      <div className="nav-leftbar flex flex-row gap-2 items-center">
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
                  onClick={() => setActiveFolder(folder.id)}
                  className={`flex flex-row justify-between w-full px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                    activeFolderId === folder.id ? "bg-yellowDark" : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex flex-row gap-2 items-center">
                    {folder.name === "Suppr. récentes" ? 
                      (<Trash color={activeFolderId === folder.id ? "#FFFFFF" : "#DC9F3A"} height="18" width="18" />) : 
                      (<Folder color={activeFolderId === folder.id ? "#FFFFFF" : "#DC9F3A"} />)
                    }
                    <p className={`font-semibold ${activeFolderId === folder.id ? "text-white" : "text-text"}`}>
                      {folder.name}
                    </p>
                  </div>
                  <p className={`font-semibold ${activeFolderId === folder.id ? "text-white" : "text-grayOpacity"}`}>{folder._count.notes}</p>
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