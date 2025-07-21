import { NextRequest } from "next/server"
import { POST } from "@/app/api/roadmap/route"


jest.mock("openai", () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  })),
}))

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    roadmap: {
      findFirst: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
    },
    roadmapItem: {
      create: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
    note: {
      findMany: jest.fn(),
    },
    folder: {
      findUnique: jest.fn(),
    },
    $disconnect: jest.fn(),
  })),
}))

import { OpenAI } from "openai"
import { PrismaClient } from "@prisma/client"

const mockOpenAI = new OpenAI() as unknown as {
  chat: {
    completions: {
      create: jest.Mock<any, any>
    }
  }
}

const mockPrisma = new PrismaClient() as unknown as {
  roadmap: {
    findFirst: jest.Mock<any, any>
    create: jest.Mock<any, any>
    delete: jest.Mock<any, any>
    findMany: jest.Mock<any, any>
  }
  roadmapItem: {
    create: jest.Mock<any, any>
    update: jest.Mock<any, any>
    deleteMany: jest.Mock<any, any>
  }
  note: {
    findMany: jest.Mock<any, any>
  }
  folder: {
    findUnique: jest.Mock<any, any>
  }
  $disconnect: jest.Mock<any, any>
}

describe("/api/roadmap", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("POST - generate action", () => {
    it("should return error when roadmap already exists", async () => {
      const existingRoadmap = {
        id: 1,
        title: "Existing Roadmap",
        createdAt: new Date(),
      }

      mockPrisma.roadmap.findFirst.mockResolvedValue(existingRoadmap)

      const request = new NextRequest("http://localhost/api/roadmap", {
        method: "POST",
        body: JSON.stringify({
          action: "generate",
          folderId: "1",
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe("Une roadmap existe déjà pour ce dossier")
      expect(data.code).toBe("ROADMAP_ALREADY_EXISTS")
    })

    it("should return error when no notes found in folder", async () => {
      mockPrisma.roadmap.findFirst.mockResolvedValue(null)
      mockPrisma.note.findMany.mockResolvedValue([])

      const request = new NextRequest("http://localhost/api/roadmap", {
        method: "POST",
        body: JSON.stringify({
          action: "generate",
          folderId: "1",
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe("No notes found in this folder")
    })

    it("should generate roadmap successfully", async () => {
      const mockNotes = [
        { id: 1, title: "Introduction" },
        { id: 2, title: "Advanced Topics" },
      ]

      const mockFolder = { name: "Test Folder" }

      const mockAIResponse = {
        roadmapTitle: "Test Roadmap",
        items: [
          { noteTitle: "Introduction", position: 1, reasoning: "Start with basics" },
          { noteTitle: "Advanced Topics", position: 2, reasoning: "Build on fundamentals" },
        ],
      }

      const mockCreatedRoadmap = {
        id: 1,
        title: "Test Roadmap",
        createdAt: new Date(),
      }

      mockPrisma.roadmap.findFirst.mockResolvedValue(null)
      mockPrisma.note.findMany.mockResolvedValue(mockNotes)
      mockPrisma.folder.findUnique.mockResolvedValue(mockFolder)
      mockPrisma.roadmap.create.mockResolvedValue(mockCreatedRoadmap)
      mockPrisma.roadmapItem.create.mockResolvedValue({
        id: 1,
        roadmapId: 1,
        noteId: 1,
        position: 1,
        checked: false,
        note: { id: 1, title: "Introduction" },
      })

      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(mockAIResponse),
            },
          },
        ],
      } as any)

      const request = new NextRequest("http://localhost/api/roadmap", {
        method: "POST",
        body: JSON.stringify({
          action: "generate",
          folderId: "1",
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.roadmap.title).toBe("Test Roadmap")
      expect(data.items).toHaveLength(1)
    })
  })

  describe("POST - updateItem action", () => {
    it("should update roadmap item successfully", async () => {
      const mockUpdatedItem = {
        id: 1,
        checked: true,
        note: { id: 1, title: "Test Note" },
      }

      mockPrisma.roadmapItem.update.mockResolvedValue(mockUpdatedItem)

      const request = new NextRequest("http://localhost/api/roadmap", {
        method: "POST",
        body: JSON.stringify({
          action: "updateItem",
          itemId: 1,
          checked: true,
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.checked).toBe(true)
      expect(mockPrisma.roadmapItem.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { checked: true },
        include: {
          note: {
            select: { id: true, title: true },
          },
        },
      })
    })
  })

  describe("POST - invalid action", () => {
    it("should return 400 for invalid action", async () => {
      const request = new NextRequest("http://localhost/api/roadmap", {
        method: "POST",
        body: JSON.stringify({
          action: "invalid_action",
        }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("Invalid action")
    })
  })
})
