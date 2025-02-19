import NoteItem from "../NoteItem";
import { dataNotes } from "@/app/dataNotes";

export default function NotesNav() {

  const todayNotes = []
  const yesterdayNotes = []
  const lastWeekNotes = []
  const lastMonthNotes = []
  const lastYearNotes = []
  const olderNotes = []

  dataNotes.forEach((note) => {
    const noteDate = new Date(note.date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    const lastWeek = new Date(today)
    lastWeek.setDate(today.getDate() - 7)
    const lastMonth = new Date(today)
    lastMonth.setMonth(today.getMonth() - 1)
    const lastYear = new Date(today)
    lastYear.setFullYear(today.getFullYear() - 1)

    if (noteDate >= today) {
      todayNotes.push(note)
    } else if (noteDate >= yesterday) {
      yesterdayNotes.push(note)
    } else if (noteDate >= lastWeek) {
      lastWeekNotes.push(note)
    } else if (noteDate >= lastMonth) {
      lastMonthNotes.push(note)
    } else if (noteDate >= lastYear) {
      lastYearNotes.push(note)
    } else {
      olderNotes.push(note)
    }
  })

  return (
    <ul className="overflow-scroll">
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