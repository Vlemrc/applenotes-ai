"use client"

import { useEffect, useState } from "react";
import ActionsNav from "@/components/ActionsNav";
import AiButton from "@/components/main/AiButton";
import Breadcrumb from "@/components/Breadcrumb";
import Leftbar from "@/components/main/Leftbar";
import NoteContent from "@/components/main/NoteContent";
import NotesNav from "@/components/main/NotesNav";
import { getNotesByFolder } from "@/lib/getFolders";
import useFolderStore from "@/stores/useFolderStore";
import LeftbarNav from "@/components/LeftbarNav";
import Quiz from "@/components/main/Quiz";
import AiHelpExtend from "@/components/AiHelpExtend";
import FlashCard from "@/components/main/Flashcard";
import AiInput from "@/components/AiInput";
import HeaderNote from "@/components/HeaderNote";


export default function Home() {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const { activeFolderId } = useFolderStore();
  const [activeMode, setActiveMode] = useState(null);

  // Charger les notes quand le dossier actif change
  useEffect(() => {
    if (activeFolderId) {
      getNotesByFolder(activeFolderId)
        .then(fetchedNotes => {
          setNotes(fetchedNotes);
          // Définir la première note comme active si elle existe
          if (fetchedNotes.length > 0) {
            setActiveNote(fetchedNotes[0]);
          }
        })
        .catch(console.error);
    }
  }, [activeFolderId]);

  const breadcrumbItems = activeNote ? [{ label: activeNote.title, href: "#" }] : [];

  return (
    <main className="flex flex-row h-full">
      <Leftbar onBackToNote={() => setActiveMode(null)} />
      <div className="flex h-screen w-5/6">
        <aside className="min-w-1/3 w-1/3 h-full border-r border-solid border-gray flex flex-col relative">
          <LeftbarNav />
          <NotesNav 
            notes={notes} 
            activeNote={activeNote}
            onNoteSelect={setActiveNote}
            onBackToNote={() => setActiveMode(null)}
          />
        </aside>
        <main className="w-full relative">
          <ActionsNav />
          <div className="pt-10 px-8 pb-8">
            {activeMode !== null && <Breadcrumb note={activeNote} mode={activeMode} onResetMode={() => setActiveMode(null)}  />}
            {activeNote && <HeaderNote note={activeNote} />}
            {activeMode === null && <NoteContent note={activeNote} />}
            {activeMode === 'quiz' && (<Quiz noteId={Number(activeNote.id)} onBackToNote={() => setActiveMode(null)} />)}
            {activeMode === 'assistant' && <><AiHelpExtend note={activeNote} /><AiInput /></>}
            {activeMode === 'flashcards' && <FlashCard noteId={Number(activeNote.id)} onBackToNote={() => setActiveMode(null)} />}
            {activeNote && (
              <AiButton 
                noteId={Number(activeNote.id)}
                noteContent={activeNote.content}
                onModeChange={setActiveMode} 
              />
            )}
          </div>
        </main>
      </div>
    </main>
  );
}