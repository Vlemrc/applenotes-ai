"use client"
import Write from "./icons/Write"
import Text from "./icons/Text"
import CheckList from "./icons/CheckList"
import Array from "./icons/Array"
import Images from "./icons/Images"
import Share from "./icons/Share"
import IconHoverContainer from "./IconHoverContainer"
import Locker from "./icons/Locker"
import Link from "./icons/Link"
import SearchBar from "./SearchBar"
import useFolderStore from "@/stores/useFolderStore"
import Education from "./icons/Education"
import { useLearningModeStore } from "@/stores/learningModeStore"
import Image from "next/image"
import { useEffect, useState } from "react"
import Glossary from "./icons/Glossary"
import GlossaryLayout from "./GlossaryLayout"
import { ChevronLeft } from "lucide-react"

interface ActionsNavProps {
  bottomBar: boolean
  setBottomBar: (value: boolean) => void
  note: any
  tutorialStep: number
  onModeChange: (mode: string | null) => void
  activeMode: string | null
  onNoteCreated: (newNote: any) => void
  setDisplayMode: (mode: string) => void
}

const ActionsNav = ({
  bottomBar,
  setBottomBar,
  note,
  tutorialStep,
  onModeChange,
  activeMode,
  onNoteCreated,
  setDisplayMode,
}: ActionsNavProps) => {
  const { activeFolderId, folders } = useFolderStore()
  const currentFolder = folders?.find((folder) => folder.id === activeFolderId)
  const { toggleLearningMode, deactivateLearningMode, isLearningMode } = useLearningModeStore()
  const [glossary, setGlossary] = useState(false)

  const handleCreateNote = async () => {
    if (!activeFolderId) {
      console.error("Aucun dossier actif sélectionné")
      return
    }

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ folderId: activeFolderId }),
      })

      if (!response.ok) {
        console.error("Erreur lors de la création de la note")
        return
      }

      const newNote = await response.json()

      onNoteCreated(newNote)
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API :", error)
    }
  }

  function handleChangeMode() {
    const wasLearningMode = isLearningMode

    toggleLearningMode()
    setBottomBar(true)

    if (wasLearningMode) {
      const doc = document as Document & {
        webkitExitFullscreen?: () => Promise<void>
        msExitFullscreen?: () => Promise<void>
      }
    } else {
      if (!localStorage.getItem("tutochecked")) {
        onModeChange("tutorial")
        localStorage.setItem("tutochecked", "true")
      }
    }
  }

  const handleGlossaryClick = () => {
    setGlossary(!glossary)
  }

  useEffect(() => {
    if (!isLearningMode && activeMode === "tutorial") {
      onModeChange(null)
    }
  }, [isLearningMode, activeMode, onModeChange])

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isLearningMode) {
        deactivateLearningMode()
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
  }, [isLearningMode, deactivateLearningMode])

  return (
    <div
      className={`${currentFolder && currentFolder._count.notes === 0 ? "" : "lg:border-b lg:border-solid lg:border-gray"} h-[50px] flex flex-row justify-between items-center px-2.5 py-4 w-full`}
    >
      <button 
        className="flex flex-row items-center gap-1 lg:hidden"
        onClick={() => setDisplayMode("notes")}>
        <ChevronLeft
          className="text-yellow h-6 w-6"
        />
        <p className="text-yellow">{currentFolder?.name}</p>
      </button>
      <div className="flex flex-row items-center justify-center absolute top-3 left-1/2 transform -translate-x-1/2 
      lg:justify-between lg:translate-x-o lg:relative lg:top-auto lg:w-full">
        <div className="flex flex-row items-center gap-0.5">
          <div className="hidden lg:flex">
            <IconHoverContainer onClick={handleCreateNote}>
              <Write color="#6F6F6F" />
            </IconHoverContainer>
          </div>
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
                <Glossary color="#6F6F6F" tutorialStep={tutorialStep} />
              </IconHoverContainer>
              {glossary && <GlossaryLayout note={note} />}
            </div>
          )}
        </div>

        <div className="hidden lg:flex flex-row items-center gap-2">
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
        <div className="hidden lg:flex flex-row items-center gap-x-6">
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
  )
}

export default ActionsNav
