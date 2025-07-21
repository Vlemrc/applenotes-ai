import { NextRequest } from "next/server"
import { GET, POST, DELETE } from "@/app/api/folders/route"

// Mock Prisma
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    folder: {
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
    note: {
      updateMany: jest.fn(),
    },
  },
}))

import prisma from "@/lib/prisma"

const mockPrisma = prisma as unknown as {
  folder: {
    findMany: jest.Mock<any, any>
    create: jest.Mock<any, any>
    delete: jest.Mock<any, any>
    update: jest.Mock<any, any>
    findUnique: jest.Mock<any, any>
    findFirst: jest.Mock<any, any>
  }
  note: {
    updateMany: jest.Mock<any, any>
  }
}

describe("/api/folders", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET", () => {
    it("should return all folders with counts and related data", async () => {
      const mockFolders = [
        {
          id: 1,
          name: "Test Folder",
          _count: { notes: 5, roadmaps: 1 },
          notes: [],
          roadmaps: [],
        },
      ]

      mockPrisma.folder.findMany.mockResolvedValue(mockFolders)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockFolders)
      expect(mockPrisma.folder.findMany).toHaveBeenCalledWith({
        include: {
          _count: {
            select: {
              notes: true,
              roadmaps: true,
            },
          },
          notes: {
            select: {
              id: true,
              title: true,
              content: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          roadmaps: {
            include: {
              items: {
                include: {
                  note: {
                    select: {
                      id: true,
                      title: true,
                      content: true,
                      createdAt: true,
                      updatedAt: true,
                    },
                  },
                },
              },
            },
          },
        },
      })
    })
  })

  describe("POST", () => {
    it("should create a new folder successfully", async () => {
      const mockFolder = {
        id: 1,
        name: "New Folder",
      }

      mockPrisma.folder.create.mockResolvedValue(mockFolder)

      const request = new NextRequest("http://localhost/api/folders", {
        method: "POST",
        body: JSON.stringify({ name: "New Folder" }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(mockFolder)
    })

    it("should return 400 when name is missing", async () => {
      const request = new NextRequest("http://localhost/api/folders", {
        method: "POST",
        body: JSON.stringify({}),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Folder name is required")
    })
  })

  describe("DELETE", () => {
    it("should delete folder and move notes to trash", async () => {
      const mockFolder = {
        id: 1,
        name: "Test Folder",
        notes: [
          { id: 1, title: "Note 1" },
          { id: 2, title: "Note 2" },
        ],
      }

      const mockTrashFolder = {
        id: 2,
        name: "Suppr. récentes",
      }

      mockPrisma.folder.findUnique.mockResolvedValue(mockFolder)
      mockPrisma.folder.findFirst.mockResolvedValue(mockTrashFolder)
      mockPrisma.note.updateMany.mockResolvedValue({ count: 2 })
      mockPrisma.folder.delete.mockResolvedValue(mockFolder)

      const request = new NextRequest("http://localhost/api/folders", {
        method: "DELETE",
        body: JSON.stringify({ id: 1 }),
      })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe("Folder deleted successfully")
      expect(data.notesMovedCount).toBe(2)
      expect(mockPrisma.note.updateMany).toHaveBeenCalledWith({
        where: { folderId: 1 },
        data: { folderId: 2 },
      })
    })

    it("should return 404 when folder not found", async () => {
      mockPrisma.folder.findUnique.mockResolvedValue(null)

      const request = new NextRequest("http://localhost/api/folders", {
        method: "DELETE",
        body: JSON.stringify({ id: 999 }),
      })

      const response = await DELETE(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe("Folder not found")
    })
  })
})
