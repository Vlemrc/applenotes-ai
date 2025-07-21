"use client"

import { useEffect, useState } from "react"
import ActionsNav from "@/components/ActionsNav"
import AiButton from "@/components/main/AiButton"
import Leftbar from "@/components/main/Leftbar"
import NoteContent from "@/components/main/NoteContent"
import NotesNav from "@/components/main/NotesNav"
import { getNotesByFolder } from "@/lib/getFolders"
import useFolderStore from "@/stores/useFolderStore"
import LeftbarNav from "@/components/LeftbarNav"
import Quiz from "@/components/main/Quiz"
import AiHelpExtend from "@/components/AiHelpExtend"
import FlashCard from "@/components/main/Flashcard"
import AiInput from "@/components/AiInput"
import HeaderNote from "@/components/HeaderNote"
import Roadmap from "@/components/main/Roadmap"
import Tutorial from "@/components/main/Tutorial"

export default function Home() {
  const [notes, setNotes] = useState([])
  const [activeNote, setActiveNote] = useState(null)
  const { activeFolderId } = useFolderStore()
  const [activeMode, setActiveMode] = useState(null)
  const [bottomBar, setBottomBar] = useState(false)
  const [tutorialStep, setTutorialStep] = useState(1)
  const [displayMode, setDisplayMode] = useState("folder")
  console.log(displayMode)

  const fetchNotes = async () => {
    if (activeFolderId) {
      try {
        const fetchedNotes = await getNotesByFolder(activeFolderId)
        setNotes(fetchedNotes)

        if (fetchedNotes.length > 0 && !activeNote) {
          setActiveNote(fetchedNotes[0])
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [activeFolderId])

  const handleNoteCreated = async (newNote) => {
    await fetchNotes()
    setActiveNote(newNote)
  }

  const handleNoteUpdate = (updatedNote) => {
    setNotes((prevNotes) => prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note)))

    if (activeNote && activeNote.id === updatedNote.id) {
      setActiveNote(updatedNote)
    }
  }

  const handleNoteDeleted = async () => {
    if (activeFolderId) {
      try {
        const fetchedNotes = await getNotesByFolder(activeFolderId)
        setNotes(fetchedNotes)

        if (fetchedNotes.length > 0) {
          const sortedNotes = [...fetchedNotes].sort((a, b) => {
            const dateA = new Date(a.updatedAt || a.createdAt)
            const dateB = new Date(b.updatedAt || b.createdAt)
            return dateB - dateA 
          })

          const mostRecentNote = sortedNotes[0]
          setActiveNote(mostRecentNote)
        } else {
          setActiveNote(null)
        }
      } catch (error) {
        console.error("Erreur lors du rechargement des notes:", error)
      }
    }
  }

  const breadcrumbItems = activeNote ? [{ label: activeNote.title, href: "#" }] : []

  

  return (
    <main className="flex flex-row h-full w-full overflow-hidden">
      <Leftbar onBackToNote={() => setActiveMode(null)} setDisplayMode={setDisplayMode} displayMode={displayMode} />
      <div className={`flex h-screen w-full
      lg:w-5/6`}>
        <aside className={`min-w-[100vw] w-full h-full border-r border-solid border-gray flex flex-col relative transition-opacity duration-300 delay-200 ease-in-out bg-[#FAFAFA]
        ${displayMode === "notes" ? "translate-x-0 opacity-100" : "translate-x-[-100%] opacity-0"}
        lg:min-w-[25%] lg:w-1/3 lg:translate-x-0 lg:bg-white lg:opacity-100`}>
          <LeftbarNav 
            activeNote={activeNote} 
            onNoteDeleted={handleNoteDeleted} 
            setDisplayMode={setDisplayMode} 
            onNoteCreated={handleNoteCreated}
          />
          <NotesNav
            notes={notes}
            activeNote={activeNote}
            onNoteSelect={setActiveNote}
            onBackToNote={() => setActiveMode(null)}
            setDisplayMode={setDisplayMode}
            displayMode={displayMode}
          />
        </aside>
        <main className={`w-full relative overflow-y-hidden transition-opacity duration-300 delay-200 ease-in-out
        ${displayMode === "content" ? "min-w-[100vw] translate-x-[-100%] lg:translate-x-0 lg:min-w-0 opacity-100" : "opacity-0"}
        lg:min-w-0 lg:opacity-100`}>
          <ActionsNav
            bottomBar={bottomBar}
            setBottomBar={setBottomBar}
            note={activeNote}
            tutorialStep={tutorialStep}
            onModeChange={setActiveMode}
            activeMode={activeMode}
            onNoteCreated={handleNoteCreated}
            setDisplayMode={setDisplayMode} 
          />
          <div className="pt-2 px-8 pb-8 h-calc-minus-50 overflow-y-scroll">
            {activeNote && activeMode !== "tutorial" && (
              <HeaderNote
                note={activeNote}
                mode={activeMode}
                onResetMode={() => setActiveMode(null)}
                onNoteUpdate={handleNoteUpdate}
              />
            )}
            {activeMode === "tutorial" && (
              <Tutorial onModeChange={setActiveMode} step={tutorialStep} setStep={setTutorialStep} />
            )}
            {activeMode === null && <NoteContent note={activeNote} />}
            {activeMode === "quiz" && <Quiz noteId={Number(activeNote.id)} onBackToNote={() => setActiveMode(null)} />}
            {activeMode === "assistant" && (
              <>
                <AiHelpExtend />
                <AiInput noteId={Number(activeNote.id)} folderId={activeFolderId} noteContent={activeNote.content} />
              </>
            )}
            {activeMode === "flashcards" && (
              <FlashCard noteId={Number(activeNote.id)} onBackToNote={() => setActiveMode(null)} />
            )}
            {activeMode === "roadmap" && <Roadmap folderId={activeFolderId} onBackToNote={() => setActiveMode(null)} />}
            {activeNote && (
              <AiButton
                noteId={Number(activeNote.id)}
                noteContent={activeNote.content}
                onModeChange={setActiveMode}
                bottomBar={bottomBar}
                setBottomBar={setBottomBar}
                tutorialStep={tutorialStep}
              />
            )}
          </div>
        </main>
      </div>
    </main>
  )
}
