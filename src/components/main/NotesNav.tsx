"use client";
import { useState, useEffect } from "react"
import NoteItem from "../NoteItem"
import { Note } from "@/types/notes"
import useFolderStore from '@/stores/useFolderStore'

interface NotesNavProps {
  notes: Note[];
  activeNote: Note | null;
  onNoteSelect: (note: Note) => void;
}

export default function NotesNav({ notes, activeNote, onNoteSelect }: NotesNavProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { activeFolderId, folders } = useFolderStore();

  const currentFolder = folders?.find(folder => folder.id === activeFolderId);
  if (currentFolder && currentFolder._count.notes === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="font-medium text-2xl text-grayLightDark">Aucune note</p>
      </div>
    )
  }

  const todayNotes: Note[] = []
  const yesterdayNotes: Note[] = []
  const lastWeekNotes: Note[] = []
  const lastMonthNotes: Note[] = []
  const lastYearNotes: Note[] = []
  const olderNotes: Note[] = []

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  
  const lastWeek = new Date(today)
  lastWeek.setDate(today.getDate() - 7)
  
  const lastMonth = new Date(today)
  lastMonth.setMonth(today.getMonth() - 1)
  
  const lastYear = new Date(today)
  lastYear.setFullYear(today.getFullYear() - 1)

  notes.forEach((note) => {
    const noteDate = new Date(note.createdAt)
    noteDate.setHours(0, 0, 0, 0)

    if (noteDate.getTime() === today.getTime()) {
      todayNotes.push(note)
    } else if (noteDate.getTime() === yesterday.getTime()) {
      yesterdayNotes.push(note)
    } else if (noteDate >= lastWeek && noteDate < yesterday) {
      lastWeekNotes.push(note)
    } else if (noteDate >= lastMonth && noteDate < lastWeek) {
      lastMonthNotes.push(note)
    } else if (noteDate >= lastYear && noteDate < lastMonth) {
      lastYearNotes.push(note)
    } else {
      olderNotes.push(note)
    }
  })

  return (
    <ul className=" overflow-x-hidden h-full">
      <div 
        className={`${notes.length >= 7 ? "w-calc-minus-15" : ""} 
        absolute bg-gray top-[50px] w-full h-[33px] z-10`}
      />
      {todayNotes.length !== 0 && (
        <>
          <p className="text-xs text-grayOpacity font-semibold pl-4 py-2 sticky bg-white top-0 z-10">Aujourd&apos;hui</p>
          <div className="p-2.5 pt-0">
            {todayNotes.map((note) => (
              <NoteItem 
                key={note.id} 
                note={note} 
                isActive={activeNote?.id === note.id}
                onClick={() => onNoteSelect(note)}
              />
            ))}
          </div>
        </>
      )}

      {yesterdayNotes.length !== 0 && (
        <>
          <p className="text-xs text-grayOpacity font-semibold pl-4 py-2 sticky bg-white top-0 z-10">Hier</p>
          <div className="p-2.5 pt-0">
            {yesterdayNotes.map((note) => (
              <NoteItem 
                key={note.id} 
                note={note} 
                isActive={activeNote?.id === note.id}
                onClick={() => onNoteSelect(note)}
              />
            ))}
          </div>
        </>
      )}
      {lastWeekNotes.length !== 0 && (
        <>
          <p className="text-xs text-grayOpacity font-semibold pl-4 py-2 sticky bg-white top-0 z-10">Semaine dernière</p>
          <div className="p-2.5 pt-0">
            {lastWeekNotes.map((note) => (
              <NoteItem 
                key={note.id} 
                note={note} 
                isActive={activeNote?.id === note.id}
                onClick={() => onNoteSelect(note)}
              />
            ))}
          </div>
        </>
      )}
      {lastMonthNotes.length !== 0 && (
        <>
          <p className="text-xs text-grayOpacity font-semibold pl-4 py-2 sticky bg-white top-0 z-10">Mois dernier</p>
          <div className="p-2.5 pt-0">
            {lastMonthNotes.map((note) => (
              <NoteItem 
                key={note.id} 
                note={note} 
                isActive={activeNote?.id === note.id}
                onClick={() => onNoteSelect(note)}
              />
            ))}
          </div>
        </>
      )}
      {lastYearNotes.length !== 0 && (
        <>
          <p className="text-xs text-grayOpacity font-semibold pl-4 py-2 sticky bg-white top-0 z-10">Année dernière</p>
          <div className="p-2.5 pt-0">
            {lastYearNotes.map((note) => (
              <NoteItem 
                key={note.id} 
                note={note} 
                isActive={activeNote?.id === note.id}
                onClick={() => onNoteSelect(note)}
              />
            ))}
          </div>
        </>
      )}
      {olderNotes.length !== 0 && (
        <>
          <p className="text-xs text-grayOpacity font-semibold pl-4 py-2 sticky bg-white top-0 z-10">Plus ancien</p>
          <div className="p-2.5 pt-0">
            {olderNotes.map((note) => (
              <NoteItem 
                key={note.id} 
                note={note} 
                isActive={activeNote?.id === note.id}
                onClick={() => onNoteSelect(note)}
              />
            ))}
          </div>
        </>
      )}
    </ul>
  )
}