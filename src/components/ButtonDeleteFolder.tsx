"use client";
import { useState } from "react";
import useFolderStore from "@/stores/useFolderStore";

export default function ButtonDeleteFolder({ folderId }) {
  const [actionsVisible, setActionsVisible] = useState(false);
  const { deleteFolder } = useFolderStore(); // Récupère la méthode deleteFolder du store

  const handleDeleteFolder = async () => {
    try {
      const response = await fetch(`/api/folders`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: folderId }),
      });

      if (response.ok) {
        deleteFolder(folderId); // Supprime le dossier dans le store
      } else {
        console.error("Erreur lors de la suppression du dossier");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du dossier", error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setActionsVisible(!actionsVisible)}
        className="flex items-center justify-center h-3 w-3 bg-grayOpacity rounded-full"
      >
        <p className="text-xs -translate-y-[3px] text-gray">...</p>
      </button>

      {actionsVisible && (
        <div className="bg-white absolute -bottom-4 -right-4 p-2 shadow-lg rounded-md">
          <button
            className="block w-full text-left text-sm text-gray-600 hover:text-gray-900"
            onClick={() => console.log("Renommer le dossier")}
          >
            Renommer le dossier
          </button>
          <button
            className="block w-full text-left text-sm text-red-600 hover:text-red-800"
            onClick={handleDeleteFolder}
          >
            Supprimer le dossier
          </button>
        </div>
      )}
    </div>
  );
}