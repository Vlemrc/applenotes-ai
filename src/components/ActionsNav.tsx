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
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Glossary from './icons/Glossary';
import GlossaryLayout from './GlossaryLayout';

const ActionsNav = ({ bottomBar, setBottomBar, note }) => {
    const { activeFolderId, folders } = useFolderStore();
    const currentFolder = folders?.find(folder => folder.id === activeFolderId);
    const { toggleLearningMode, deactivateLearningMode, isLearningMode } = useLearningModeStore();
    const [glossary, setGlossary] = useState(false);

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
    
        if (!document.fullscreenElement) {
            const elem = document.documentElement as HTMLElement & {
                webkitRequestFullscreen?: () => Promise<void>;
                msRequestFullscreen?: () => Promise<void>;
            };
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        } else {
            const doc = document as Document & {
                webkitExitFullscreen?: () => Promise<void>;
                msExitFullscreen?: () => Promise<void>;
            };
            if (doc.exitFullscreen) {
                doc.exitFullscreen();
            } else if (doc.webkitExitFullscreen) {
                doc.webkitExitFullscreen();
            } else if (doc.msExitFullscreen) {
                doc.msExitFullscreen();
            }
        }
    }

    const handleGlossaryClick = () => {
        setGlossary(!glossary);
    }

    useEffect(() => {
        const handleFullscreenChange = () => {
          if (!document.fullscreenElement && isLearningMode) {
            console.log("Sortie du plein écran détectée, désactivation du LearningMode")
            deactivateLearningMode();
          }
        }

        document.addEventListener("fullscreenchange", handleFullscreenChange)
        document.addEventListener("webkitfullscreenchange", handleFullscreenChange)
        document.addEventListener("mozfullscreenchange", handleFullscreenChange)
    
        return () => {
          document.removeEventListener("fullscreenchange", handleFullscreenChange)
          document.removeEventListener("webkitfullscreenchange", handleFullscreenChange)
          document.removeEventListener("mozfullscreenchange", handleFullscreenChange)
        }
      }, [isLearningMode, deactivateLearningMode]);
    

    return (
        <div className={`${currentFolder && currentFolder._count.notes === 0 ? "" : "border-b border-solid border-gray"} h-[50px] flex flex-row justify-between items-center px-2.5 py-4 w-full`}>
            <div className="flex flex-row items-center justify-between w-full">
                <div className="flex flex-row items-center gap-0.5">
                    <IconHoverContainer onClick={handleCreateNote}>
                        <Write color="#6F6F6F" />
                    </IconHoverContainer>
                    {isLearningMode && (
                        <IconHoverContainer onClick={handleChangeMode}>
                            <div className="translate-y-0.5 transform scale-x-[-1]">
                                <Image src="/education.png" width={20} height={14} alt="Mode learning active" />
                            </div>
                        </IconHoverContainer>
                    )}
                    {!isLearningMode && (
                        <IconHoverContainer onClick={handleChangeMode}>
                            <Education color="#6F6F6F" />
                        </IconHoverContainer>
                    )}
                    {isLearningMode && (
                    <div className="relative" onMouseLeave={() => setGlossary(false)}>
                        <IconHoverContainer onClick={handleGlossaryClick}>
                            <Glossary color="#6F6F6F" />
                        </IconHoverContainer>
                        {glossary && (
                            <GlossaryLayout note={note} />
                        )}
                    </div>
                    )}
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