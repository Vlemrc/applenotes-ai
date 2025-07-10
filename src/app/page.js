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

export default function Home() {
  const [notes, setNotes] = useState([])
  const [activeNote, setActiveNote] = useState(null)
  const { activeFolderId } = useFolderStore()
  const [activeMode, setActiveMode] = useState(null)
  const [bottomBar, setBottomBar] = useState(false)

  useEffect(() => {
    if (activeFolderId) {
      getNotesByFolder(activeFolderId)
        .then((fetchedNotes) => {
          setNotes(fetchedNotes)
          
          if (fetchedNotes.length > 0) {
            setActiveNote(fetchedNotes[0])
          }
        })
        .catch(console.error)
    }
  }, [activeFolderId])

  const handleNoteUpdate = (updatedNote) => {
    setNotes((prevNotes) => prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note)))

    if (activeNote && activeNote.id === updatedNote.id) {
      setActiveNote(updatedNote)
    }
  }

  const breadcrumbItems = activeNote ? [{ label: activeNote.title, href: "#" }] : []

  return (
    <main className="flex flex-row h-full">
      <Leftbar onBackToNote={() => setActiveMode(null)} />
      <div className="flex h-screen w-5/6">
        <aside className="min-w-1/3 w-1/3 h-full border-r border-solid border-gray flex flex-col relative">
          <LeftbarNav activeNote={activeNote} />
          <NotesNav
            notes={notes}
            activeNote={activeNote}
            onNoteSelect={setActiveNote}
            onBackToNote={() => setActiveMode(null)}
          />
        </aside>
        <main className="w-full relative overflow-y-hidden">
          <ActionsNav bottomBar={bottomBar} setBottomBar={setBottomBar} note={activeNote} />
          <div className="pt-2 px-8 pb-8 h-calc-minus-50 overflow-y-scroll">
            {activeNote && (
              <HeaderNote
                note={activeNote}
                mode={activeMode}
                onResetMode={() => setActiveMode(null)}
                onNoteUpdate={handleNoteUpdate}
              />
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
              />
            )}
          </div>
        </main>
      </div>
    </main>
  )
}
