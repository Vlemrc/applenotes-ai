import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const folders = await prisma.folder.findMany({
      include: {
        _count: {
          select: { notes: true },
        },
      },
    })
    return NextResponse.json(folders)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching folders" }, { status: 500 })
  }
}

