import { NextRequest } from "next/server"
import { GET, POST, DELETE } from "@/app/api/notes/route"

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    note: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    folder: {
      findFirst: jest.fn(),
    },
    roadmapItem: {
      deleteMany: jest.fn(),
    },
  },
}))

import prisma from "@/lib/prisma"

const mockPrisma = prisma as unknown as {
  note: {
    findUnique: jest.Mock<any, any>
    findMany: jest.Mock<any, any>
    create: jest.Mock<any, any>
    update: jest.Mock<any, any>
    delete: jest.Mock<any, any>
  }
  folder: {
    findFirst: jest.Mock<any, any>
  }
  roadmapItem: {
    deleteMany: jest.Mock<any, any>
  }
}

describe("/api/notes", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET", () => {
    it("should return a specific note when id is provided", async () => {
      const mockNote = {
        id: 1,
        title: "Test Note",
        content: "Test content",
        folder: { id: 1, name: "Test Folder" },
        roadmapItems: [],
      }

      mockPrisma.note.findUnique.mockResolvedValue(mockNote)

      const request = new NextRequest("http://localhost/api/notes?id=1")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockNote)
      expect(mockPrisma.note.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          folder: true,
          roadmapItems: {
            include: {
              roadmap: true,
            },
          },
        },
      })
    })

    it("should return 404 when note is not found", async () => {
      mockPrisma.note.findUnique.mockResolvedValue(null)

      const request = new NextRequest("http://localhost/api/notes?id=999")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe("Note not found")
    })

    it("should return notes by folderId when no specific id is provided", async () => {
      const mockNotes = [
        { id: 1, title: "Note 1", folder: { id: 1 }, roadmapItems: [] },
        { id: 2, title: "Note 2", folder: { id: 1 }, roadmapItems: [] },
      ]

      mockPrisma.note.findMany.mockResolvedValue(mockNotes)

      const request = new NextRequest("http://localhost/api/notes?folderId=1")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockNotes)
    })
  })

  describe("POST", () => {
    it("should create a new note successfully", async () => {
      const mockNote = {
        id: 1,
        title: "New Note",
        content: "New content",
        folderId: 1,
      }

      mockPrisma.note.create.mockResolvedValue(mockNote)

      const request = new NextRequest("http://localhost/api/notes", {
        method: "POST",
        body: JSON.stringify({
          title: "New Note",
          content: "New content",
          folderId: 1,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(mockNote)
    })

    it("should return 400 when folderId is missing", async () => {
      const request = new NextRequest("http://localhost/api/notes", {
        method: "POST",
        body: JSON.stringify({
          title: "New Note",
          content: "New content",
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Folder ID is required")
    })
  })

  describe("DELETE", () => {
    it("should move note to trash when not already in trash", async () => {
      const mockNote = {
        id: 1,
        title: "Test Note",
        folderId: 1,
        folder: { id: 1, name: "Regular Folder" },
      }

      const mockTrashFolder = {
        id: 2,
        name: "Suppr. récentes",
      }

      const mockUpdatedNote = {
        ...mockNote,
        folderId: 2,
      }

      mockPrisma.note.findUnique.mockResolvedValue(mockNote)
      mockPrisma.folder.findFirst.mockResolvedValue(mockTrashFolder)
      mockPrisma.roadmapItem.deleteMany.mockResolvedValue({ count: 0 })
      mockPrisma.note.update.mockResolvedValue(mockUpdatedNote)

      const request = new NextRequest("http://localhost/api/notes", {
        method: "DELETE",
        body: JSON.stringify({ id: 1 }),
      })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Note moved to trash and detached from roadmaps")
      expect(mockPrisma.roadmapItem.deleteMany).toHaveBeenCalledWith({
        where: { noteId: 1 },
      })
    })

    it("should permanently delete note when already in trash", async () => {
      const mockTrashFolder = {
        id: 2,
        name: "Suppr. récentes",
      }

      const mockNote = {
        id: 1,
        title: "Test Note",
        folderId: 2, // Already in trash
        folder: mockTrashFolder,
      }

      mockPrisma.note.findUnique.mockResolvedValue(mockNote)
      mockPrisma.folder.findFirst.mockResolvedValue(mockTrashFolder)
      mockPrisma.roadmapItem.deleteMany.mockResolvedValue({ count: 0 })
      mockPrisma.note.delete.mockResolvedValue(mockNote)

      const request = new NextRequest("http://localhost/api/notes", {
        method: "DELETE",
        body: JSON.stringify({ id: 1 }),
      })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Note deleted permanently")
      expect(mockPrisma.note.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      })
    })

    it("should return 400 when id is missing", async () => {
      const request = new NextRequest("http://localhost/api/notes", {
        method: "DELETE",
        body: JSON.stringify({}),
      })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Note ID is required")
    })
  })
})
