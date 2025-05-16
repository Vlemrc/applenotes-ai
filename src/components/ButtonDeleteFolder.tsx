import { useState } from "react";
import useFolderStore from "@/stores/useFolderStore";

export default function ButtonDeleteFolder({ folderId, setEditingFolderId }) {
  const { deleteFolder } = useFolderStore();
  const [isHovered, setIsHovered] = useState(false);

  console.log("folderId", folderId);

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
        deleteFolder(folderId); 
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
        onClick={() => setIsHovered(!isHovered)}
        className="flex items-center justify-center h-3 w-3 bg-grayOpacity rounded-full hover:bg-grayDark"
      >
        <p className="text-xs -translate-y-[3px] text-gray">...</p>
      </button>

      {isHovered && (
        <div className="z-10 bg-grayLight absolute -bottom-2O -right-30 px-4 py-2 shadow-lg rounded-md translate-y-[4px] border border-gray flex flex-col gap-1">
            <button
            className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 whitespace-nowrap pr-10"
            onClick={() => setEditingFolderId(folderId)}
            >
            Renommer le dossier
            </button>
            <div className="w-full h-[1px] bg-gray"></div>
            <button
            className="block w-full text-left text-sm whitespace-nowrap"
            onClick={handleDeleteFolder}
            >
            Supprimer le dossier
            </button>
        </div>
      )}
    </div>
  );
}
