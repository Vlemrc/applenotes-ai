"use client";
import Write from './icons/Write'
import Text from './icons/Text'
import CheckList from './icons/CheckList'
import Array from './icons/Array'
import Images from './icons/Images'
import Share from './icons/Share'
import IconHoverContainer from './IconHoverContainer'
import Locker from './icons/Locker'
import Link from './icons/Link'
import SearchBar from './SearchBar'
import useFolderStore from '@/stores/useFolderStore'
import Education from './icons/Education';
import { useLearningModeStore } from '@/stores/learningModeStore';

const ActionsNav = ({ bottomBar, setBottomBar }) => {
    const { activeFolderId, folders } = useFolderStore();
    const currentFolder = folders?.find(folder => folder.id === activeFolderId);
    const { toggleLearningMode } = useLearningModeStore();

    const handleCreateNote = async () => {
        if (!activeFolderId) {
            console.error("Aucun dossier actif sélectionné");
            return;
        }

        try {
            const response = await fetch('/api/notes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ folderId: activeFolderId }),
            });

            if (!response.ok) {
                console.error("Erreur lors de la création de la note");
                return;
            }

            const newNote = await response.json();
            window.location.reload()
        } catch (error) {
            console.error("Erreur lors de l'appel à l'API :", error);
        }
    };

    const handleChangeMode = () => {
        toggleLearningMode();
        setBottomBar(true);
    }

    return (
        <div className={`${currentFolder && currentFolder._count.notes === 0 ? "" : "border-b border-solid border-gray"} h-[50px] flex flex-row justify-between items-center px-2.5 py-4 w-full`}>
            <div className="flex flex-row items-center justify-between w-full">
                <div className="flex flex-row items-center gap-0.5">
                    <IconHoverContainer onClick={handleCreateNote}>
                        <Write color="#6F6F6F" />
                    </IconHoverContainer>
                    <IconHoverContainer onClick={handleChangeMode}>
                        <Education color="#6F6F6F" />
                    </IconHoverContainer>
                </div>

                <div className="flex flex-row items-center gap-2">
                    <IconHoverContainer>
                         <Text color="#6F6F6F" />
                    </IconHoverContainer>
                    <IconHoverContainer>
                         <CheckList color="#6F6F6F" />
                    </IconHoverContainer>
                    <IconHoverContainer>
                        <Array color="#6F6F6F" />
                    </IconHoverContainer>
                    <IconHoverContainer>
                         <Images color="#6F6F6F" />
                    </IconHoverContainer>
                </div>
                <div className="flex flex-row items-center gap-x-6">
                    <div className="flex flex-row items-center">
                        <IconHoverContainer>
                            <Link color="#6F6F6F" />
                        </IconHoverContainer>
                        <IconHoverContainer>
                            <Locker color="#6F6F6F" />
                        </IconHoverContainer>
                    </div>
                    <div className="flex flex-row items-center gap-2">
                        <IconHoverContainer>
                            <Share color="#6F6F6F" />
                        </IconHoverContainer>
                        <SearchBar />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionsNav;