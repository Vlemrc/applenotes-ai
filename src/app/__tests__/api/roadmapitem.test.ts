import { NextRequest } from "next/server"
import { DELETE } from "@/app/api/roadmapitem/route"

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    roadmapItem: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    $disconnect: jest.fn(),
  })),
}))

import { PrismaClient } from "@prisma/client"

const mockPrisma = new PrismaClient() as unknown as {
  roadmapItem: {
    findUnique: jest.Mock<any, any>,
    delete: jest.Mock<any, any>,
  },
  $disconnect: jest.Mock<any, any>,
}

describe("/api/roadmap-item DELETE", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should delete roadmap item successfully", async () => {
    const mockItem = {
      id: 1,
      roadmapId: 1,
      noteId: 1,
    }

    mockPrisma.roadmapItem.findUnique.mockResolvedValue(mockItem)
    mockPrisma.roadmapItem.delete.mockResolvedValue(mockItem)

    const request = new NextRequest("http://localhost/api/roadmap-item", {
      method: "DELETE",
      body: JSON.stringify({ itemId: 1 }),
    })

    const response = await DELETE(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(mockPrisma.roadmapItem.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    })
  })

  it("should return 400 when itemId is missing", async () => {
    const request = new NextRequest("http://localhost/api/roadmap-item", {
      method: "DELETE",
      body: JSON.stringify({}),
    })

    const response = await DELETE(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe("itemId manquant ou invalide")
  })

  it("should return 400 when itemId is not a number", async () => {
    const request = new NextRequest("http://localhost/api/roadmap-item", {
      method: "DELETE",
      body: JSON.stringify({ itemId: "invalid" }),
    })

    const response = await DELETE(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe("itemId manquant ou invalide")
  })

  it("should return 404 when roadmap item not found", async () => {
    mockPrisma.roadmapItem.findUnique.mockResolvedValue(null)

    const request = new NextRequest("http://localhost/api/roadmap-item", {
      method: "DELETE",
      body: JSON.stringify({ itemId: 999 }),
    })

    const response = await DELETE(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe("RoadmapItem introuvable")
  })
})
