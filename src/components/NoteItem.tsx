"use client";
import Link from 'next/link'
import { usePathname } from "next/navigation"
import { Note } from "@/types/notes"

interface NoteItemProps {
  note: Note
}

const NoteItem = ({ note }: NoteItemProps) => {
    const pathname = usePathname()
    const isActive = pathname.includes(`/notes/${note.id}`)

    // Je rends mes dates lisibles
    const date = new Date(note.date).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    })
    
    return (
        <Link href={`/notes/${note.id}`} className={`${isActive ? "" : "border-nav-note"}`}>
            <li className={`${isActive ? "bg-gray" : "bg-white"} pt-4 pl-7 w-full rounded-md transition-colors`}>
                <h6 className="font-black text-sm text-left">{note.title}</h6>
                <div className="flex flex-row gap-2.5 pb-4 pr-7">
                    <p className="text-medium text-xs">{date}</p>
                    <p className="truncate-text text-grayDark text-xs">{note.content}</p>
                </div>
            </li>
        </Link>
    )
}

export default NoteItem