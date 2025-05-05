"use client";
import Trash from "./icons/Trash";
import MenuGrid from "./icons/MenuGrid";
import MenuNotes from "./icons/MenuNotes";
import useFolderStore from '@/stores/useFolderStore';

const LeftbarNav = () => {
    const { activeFolderId, folders, fetchFolders } = useFolderStore(); // Ajout de fetchFolders pour rafraîchir les dossiers après suppression
    const currentFolder = folders?.find(folder => folder.id === activeFolderId);

    const handleTrashClick = async () => {
        if (!activeFolderId) {
            console.error("Aucun dossier actif sélectionné.");
            return;
        }

        try {
            const response = await fetch("/api/notes", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id: activeFolderId }), // Utilisation de l'ID du dossier actif
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result.message); // Affiche le message de succès
                fetchFolders(); // Rafraîchit les dossiers après suppression ou déplacement
            } else {
                console.error("Erreur lors de la suppression ou du déplacement de la note.");
            }
        } catch (error) {
            console.error("Erreur lors de la requête :", error);
        }
    };

    return (
        <div className={`${currentFolder && currentFolder._count.notes === 0 ? "" : "border-b border-solid border-gray"} h-[50px] flex flex-row justify-between items-center px-2.5 py-4`}>
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
                onClick={handleTrashClick} // Appel de la fonction au clic
            >
                <Trash color="#6F6F6F" height="22" width="22" />
            </div>
        </div>
    );
};

export default LeftbarNav;