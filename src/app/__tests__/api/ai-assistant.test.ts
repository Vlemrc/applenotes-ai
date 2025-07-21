import { NextRequest } from "next/server"
import { POST as flashcardsPost } from "@/app/api/flashcard/route"
import { POST as quizPost } from "@/app/api/quiz/route"
import { POST as glossaryPost } from "@/app/api/glossary/route"
import { OpenAI } from "openai"

// Mock OpenAI
jest.mock("openai", () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  })),
}))

const mockOpenAI = new OpenAI() as unknown as {
  chat: {
    completions: {
      create: jest.Mock<any, any>
    }
  }
}

describe("AI Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("/api/flashcards POST", () => {
    it("should return 400 when noteContent is missing", async () => {
      const request = new NextRequest("http://localhost/api/flashcards", {
        method: "POST",
        body: JSON.stringify({}),
      })

      const response = await flashcardsPost(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("No content provided")
    })

    it("should generate flashcards successfully", async () => {
      const mockResponse = {
        flashcards: [
          { question: "What is React?", answer: "A JavaScript library" },
          { question: "What is JSX?", answer: "JavaScript XML syntax" },
        ],
      }

      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(mockResponse),
            },
          },
        ],
      } as any)

      const request = new NextRequest("http://localhost/api/flashcards", {
        method: "POST",
        body: JSON.stringify({
          noteContent: "React is a JavaScript library for building user interfaces.",
          flashcardsCount: 2,
        }),
      })

      const response = await flashcardsPost(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.flashcards).toHaveLength(2)
      expect(data.flashcards[0]).toHaveProperty("question")
      expect(data.flashcards[0]).toHaveProperty("answer")
    })
  })

  describe("/api/quiz POST", () => {
    it("should return 400 when noteContent is missing", async () => {
      const request = new NextRequest("http://localhost/api/quiz", {
        method: "POST",
        body: JSON.stringify({}),
      })

      const response = await quizPost(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("No content provided")
    })

    it("should limit question count to maximum of 10", async () => {
      const mockResponse = {
        questions: Array(10).fill({
          question: "Test question?",
          answers: [
            { text: "Answer 1", correct: false },
            { text: "Answer 2", correct: true },
            { text: "Answer 3", correct: false },
            { text: "Answer 4", correct: false },
          ],
        }),
      }

      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(mockResponse),
            },
          },
        ],
      } as any)

      const request = new NextRequest("http://localhost/api/quiz", {
        method: "POST",
        body: JSON.stringify({
          noteContent: "Test content",
          questionCount: 15, // Should be limited to 10
        }),
      })

      const response = await quizPost(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.questions).toHaveLength(10)
    })
  })

  describe("/api/glossary POST", () => {
    it("should return 400 when noteContent is missing", async () => {
      const request = new NextRequest("http://localhost/api/glossary", {
        method: "POST",
        body: JSON.stringify({}),
      })

      const response = await glossaryPost(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe("No content provided")
    })

    it("should generate glossary successfully", async () => {
      const mockResponse = {
        glossary: [
          { term: "React", definition: "JavaScript library for UI" },
          { term: "Component", definition: "Reusable UI element" },
        ],
      }

      mockOpenAI.chat.completions.create.mockResolvedValue({
        choices: [
          {
            message: {
              content: JSON.stringify(mockResponse),
            },
          },
        ],
      } as any)

      const request = new NextRequest("http://localhost/api/glossary", {
        method: "POST",
        body: JSON.stringify({
          noteContent: "React is a JavaScript library. Components are reusable.",
        }),
      })

      const response = await glossaryPost(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.glossary).toHaveLength(2)
      expect(data.glossary[0]).toHaveProperty("term")
      expect(data.glossary[0]).toHaveProperty("definition")
    })
  })
})
