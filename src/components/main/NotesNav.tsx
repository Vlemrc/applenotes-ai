import NoteItem from "../NoteItem"
import { Note } from "@/types/notes"

interface NotesNavProps {
  notes: Note[]
}

export default function NotesNav({ notes }: NotesNavProps) {
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
    const noteDate = new Date(note.createdAt) // Changé de note.date à note.createdAt
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
    <ul className="overflow-scroll overflow-x-hidden">
      <div className="absolute bg-gray top-[50px] w-calc-minus-15 w-full h-[33px] z-10"></div>
      {todayNotes.length !== 0 && (
        <>
          <p className="text-xs text-grayOpacity font-semibold pl-4 py-2 sticky bg-white top-0 z-10">Aujourd&apos;hui</p>
          <div className="p-2.5 pt-0">
            {todayNotes.map((note) => (
              <NoteItem key={note.id} note={note} />
            ))}
          </div>
        </>
      )}

      {yesterdayNotes.length !== 0 && (
        <>
          <p className="text-xs text-grayOpacity font-semibold pl-4 py-2 sticky bg-white top-0 z-10">Hier</p>
          <div className="p-2.5 pt-0">
            {yesterdayNotes.map((note) => (
              <NoteItem key={note.id} note={note} />
            ))}
          </div>
        </>
      )}
      {lastWeekNotes.length !== 0 && (
        <>
          <p className="text-xs text-grayOpacity font-semibold pl-4 py-2 sticky bg-white top-0 z-10">Semaine dernière</p>
          <div className="p-2.5 pt-0">
            {lastWeekNotes.map((note) => (
              <NoteItem key={note.id} note={note} />
            ))}
          </div>
        </>
      )}
      {lastMonthNotes.length !== 0 && (
        <>
          <p className="text-xs text-grayOpacity font-semibold pl-4 py-2 sticky bg-white top-0 z-10">Mois dernier</p>
          <div className="p-2.5 pt-0">
            {lastMonthNotes.map((note) => (
              <NoteItem key={note.id} note={note} />
            ))}
          </div>
        </>
      )}
      {lastYearNotes.length !== 0 && (
        <>
          <p className="text-xs text-grayOpacity font-semibold pl-4 py-2 sticky bg-white top-0 z-10">Année dernière</p>
          <div className="p-2.5 pt-0">
            {lastYearNotes.map((note) => (
              <NoteItem key={note.id} note={note} />
            ))}
          </div>
        </>
      )}
      {olderNotes.length !== 0 && (
        <>
          <p className="text-xs text-grayOpacity font-semibold pl-4 py-2 sticky bg-white top-0 z-10">Plus ancien</p>
          <div className="p-2.5 pt-0">
            {olderNotes.map((note) => (
              <NoteItem key={note.id} note={note} />
            ))}
          </div>
        </>
      )}
    </ul>
  )
}