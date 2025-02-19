"use client"

import type React from "react"

import { use, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import NotesNav from "@/components/main/NotesNav"
import AiButton from "@/components/AiButton"
import Breadcrumb from "@/components/Breadcrumb"
import LeftbarNav from "@/components/LeftbarNav"
import Leftbar from "@/components/main/Leftbar"
import ActionsNav from "@/components/ActionsNav"
import { getNotes } from "@/lib/getNotes"

export default function NoteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const resolvedParams = use(params)
  const [notes, setNotes] = useState([])
  const [note, setNote] = useState(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    getNotes().then(setNotes).catch(console.error)
  }, [])

  useEffect(() => {
    const currentNote = notes.find((n) => n.id === Number.parseInt(resolvedParams.id))
    if (currentNote) {
      setNote(currentNote)
    } else if (notes.length > 0) {
      router.push("/")
    }
  }, [resolvedParams.id, notes, router])

  if (!note) {
    return null
  }

  const breadcrumbItems = [{ label: note.title, href: `/notes/${resolvedParams.id}` }]

  if (pathname !== `/notes/${resolvedParams.id}`) {
    const currentPath = pathname.split("/").pop()
    breadcrumbItems.push({
      label: currentPath!.charAt(0).toUpperCase() + currentPath!.slice(1),
      href: pathname,
    })
  }

  return (
    <div className="flex flex-row h-full">
      <Leftbar />
      <div className="flex h-screen w-5/6">
        <aside className="w-1/3 h-full border-r border-solid border-gray flex flex-col relative">
          <LeftbarNav />
          <NotesNav notes={notes} />
        </aside>
        <main className="w-full relative">
          <ActionsNav />
          <div className="pt-10 px-8 pb-8">
            <AiButton noteId={resolvedParams.id} />
            <Breadcrumb items={breadcrumbItems} />
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

