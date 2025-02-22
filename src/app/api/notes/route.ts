import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const folderId = searchParams.get("folderId")

    const notes = await prisma.note.findMany({
      where: folderId
        ? {
            folderId: Number.parseInt(folderId),
          }
        : undefined,
      include: {
        folder: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(notes)
  } catch (error) {
    return NextResponse.json({ error: "Error fetching notes" }, { status: 500 })
  }
}

