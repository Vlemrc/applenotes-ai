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

export async function POST(req) {
  try {
    const { name } = await req.json();
    
    if (!name) {
      return NextResponse.json({ error: "Folder name is required" }, { status: 400 });
    }

    const newFolder = await prisma.folder.create({
      data: { name },
    });

    return NextResponse.json(newFolder, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error creating folder" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json({ error: "Folder ID is required" }, { status: 400 })
    }

    const deletedFolder = await prisma.folder.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Folder deleted successfully", folder: deletedFolder })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error deleting folder" }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const { id, name } = await req.json();

    if (!id || !name) {
      return NextResponse.json(
        { error: "Folder ID and new name are required" },
        { status: 400 }
      );
    }

    const updatedFolder = await prisma.folder.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json({ message: "Folder updated successfully", folder: updatedFolder });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error updating folder" }, { status: 500 });
  }
}