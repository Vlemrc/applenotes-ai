import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      include: { folder: true },
    })
    return NextResponse.json(notes)
  } catch (error) {
    console.error("Request error", error)
    return NextResponse.json({ error: "Error fetching notes" }, { status: 500 })
  }
}