"use client"
import { useState, useEffect } from "react"
import NoteItem from "../NoteItem"
import type { Note } from "@/types/notes"
import useFolderStore from "@/stores/useFolderStore"

interface NotesNavProps {
  notes: Note[]
  activeNote: Note | null
  onNoteSelect: (note: Note) => void
  onBackToNote?: (noteId: number) => void
}

export default function NotesNav({ notes, activeNote, onNoteSelect, onBackToNote }: NotesNavProps) {
  const [isLoading, setIsLoading] = useState(true)
  const { activeFolderId, folders } = useFolderStore()


  const currentFolder = folders?.find((folder) => folder.id === activeFolderId)
  const isEmptyFolder = currentFolder && currentFolder._count.notes === 0

  useEffect(() => {
    setIsLoading(true)

    if (notes.length > 0 || isEmptyFolder) {
      setIsLoading(false)
    }
  }, [notes, isEmptyFolder])

  const handleNoteClick = (note: Note) => {
    onNoteSelect(note);
    onBackToNote && onBackToNote(note.id);
  };

  if (isEmptyFolder) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="font-medium text-2xl text-grayLightDark">Aucune note</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p className="font-medium text-xl text-grayLightDark">Chargement...</p>
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
    const noteDate = new Date(note.updatedAt)
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

  const firstNonEmptyCategory =
    todayNotes.length > 0
      ? "today"
      : yesterdayNotes.length > 0
        ? "yesterday"
        : lastWeekNotes.length > 0
          ? "lastWeek"
          : lastMonthNotes.length > 0
            ? "lastMonth"
            : lastYearNotes.length > 0
              ? "lastYear"
              : olderNotes.length > 0
                ? "older"
                : null

  return (
    <ul className=" overflow-x-hidden h-full">
      <div
      // ${notes.length >= 7 ? "w-calc-minus-15" : ""}
        className={` 
        absolute bg-gray top-[50px] w-full h-[33px] z-10`}
      />
      {todayNotes.length !== 0 && (
        <>
          <p className="text-xs text-grayOpacity font-semibold pl-4 py-2 sticky bg-white top-0 z-10">
            Aujourd&apos;hui
          </p>
          <div className="p-2.5 pt-0">
            {todayNotes.map((note, index) => (
              <>
                <NoteItem
                  key={note.id}
                  note={note}
                  isActive={activeNote?.id === note.id}
                  nextIsActive={index < todayNotes.length - 1 ? activeNote?.id === todayNotes[index + 1].id : false}
                  isTopNote={firstNonEmptyCategory === "today" && index === 0}
                  onClick={() => handleNoteClick(note)}
                  isRoadmapItem={note.roadmapItems?.[0]}
                  isChecked={note?.roadmapItems?.[0]?.checked ?? false}
                />
              </>
            ))}
          </div>
        </>
      )}

      {yesterdayNotes.length !== 0 && (
        <>
          <p className="text-xs text-grayOpacity font-semibold pl-4 py-2 sticky bg-white top-0 z-10">Hier</p>
          <div className="p-2.5 pt-0">
            {yesterdayNotes.map((note, index) => (
              <NoteItem
                key={note.id}
                note={note}
                isActive={activeNote?.id === note.id}
                nextIsActive={
                  index < yesterdayNotes.length - 1 ? activeNote?.id === yesterdayNotes[index + 1].id : false
                }
                isTopNote={firstNonEmptyCategory === "yesterday" && index === 0}
                onClick={() => handleNoteClick(note)}
                isRoadmapItem={note.roadmapItems?.[0]}
                isChecked={note?.roadmapItems?.[0]?.checked ?? false}
              />
            ))}
          </div>
        </>
      )}
      {lastWeekNotes.length !== 0 && (
        <>
          <p className="text-xs text-grayOpacity font-semibold pl-4 py-2 sticky bg-white top-0 z-10">
            Semaine dernière
          </p>
          <div className="p-2.5 pt-0">
            {lastWeekNotes.map((note, index) => (
              <NoteItem
                key={note.id}
                note={note}
                isActive={activeNote?.id === note.id}
                nextIsActive={index < lastWeekNotes.length - 1 ? activeNote?.id === lastWeekNotes[index + 1].id : false}
                isTopNote={firstNonEmptyCategory === "lastWeek" && index === 0}
                onClick={() => handleNoteClick(note)}
                isRoadmapItem={note.roadmapItems?.[0]}
                isChecked={note?.roadmapItems?.[0]?.checked ?? false}
              />
            ))}
          </div>
        </>
      )}
      {lastMonthNotes.length !== 0 && (
        <>
          <p className="text-xs text-grayOpacity font-semibold pl-4 py-2 sticky bg-white top-0 z-10">Mois dernier</p>
          <div className="p-2.5 pt-0">
            {lastMonthNotes.map((note, index) => (
              <NoteItem
                key={note.id}
                note={note}
                isActive={activeNote?.id === note.id}
                nextIsActive={
                  index < lastMonthNotes.length - 1 ? activeNote?.id === lastMonthNotes[index + 1].id : false
                }
                isTopNote={firstNonEmptyCategory === "lastMonth" && index === 0}
                onClick={() => handleNoteClick(note)}
                isRoadmapItem={note.roadmapItems?.[0]}
                isChecked={note?.roadmapItems?.[0]?.checked ?? false}
              />
            ))}
          </div>
        </>
      )}
      {lastYearNotes.length !== 0 && (
        <>
          <p className="text-xs text-grayOpacity font-semibold pl-4 py-2 sticky bg-white top-0 z-10">Année dernière</p>
          <div className="p-2.5 pt-0">
            {lastYearNotes.map((note, index) => (
              <NoteItem
                key={note.id}
                note={note}
                isActive={activeNote?.id === note.id}
                nextIsActive={index < lastYearNotes.length - 1 ? activeNote?.id === lastYearNotes[index + 1].id : false}
                isTopNote={firstNonEmptyCategory === "lastYear" && index === 0}
                onClick={() => handleNoteClick(note)}
                isRoadmapItem={note.roadmapItems?.[0]}
                isChecked={note?.roadmapItems?.[0]?.checked ?? false}
              />
            ))}
          </div>
        </>
      )}
      {olderNotes.length !== 0 && (
        <>
          <p className="text-xs text-grayOpacity font-semibold pl-4 py-2 sticky bg-white top-0 z-10">Plus ancien</p>
          <div className="p-2.5 pt-0">
            {olderNotes.map((note, index) => (
              <NoteItem
                key={note.id}
                note={note}
                isActive={activeNote?.id === note.id}
                nextIsActive={index < olderNotes.length - 1 ? activeNote?.id === olderNotes[index + 1].id : false}
                isTopNote={firstNonEmptyCategory === "older" && index === 0}
                onClick={() => handleNoteClick(note)}
                isRoadmapItem={note.roadmapItems?.[0]}
                isChecked={note?.roadmapItems?.[0]?.checked ?? false}
              />
            ))}
          </div>
        </>
      )}
    </ul>
  )
}

