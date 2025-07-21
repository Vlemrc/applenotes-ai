import { render, screen, fireEvent } from "@testing-library/react"
import Quiz from "@/components/main/Quiz"
import { useLearningModeStore } from "@/stores/learningModeStore"
import { useRoadmapItem } from "@/utils/useRoadmapItem"

jest.mock("@/stores/learningModeStore")
jest.mock("@/utils/useRoadmapItem")
jest.mock("@/stores/roadmapItemStore")

const mockUseLearningModeStore = useLearningModeStore as jest.MockedFunction<typeof useLearningModeStore>
const mockUseRoadmapItem = useRoadmapItem as jest.MockedFunction<typeof useRoadmapItem>

describe("Quiz", () => {
  const mockOnBackToNote = jest.fn()
  const mockUpdateChecked = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseLearningModeStore.mockReturnValue({
      isLearningMode: false,
    } as any)

    mockUseRoadmapItem.mockReturnValue({
      item: null,
      isChecked: false,
      updateChecked: mockUpdateChecked,
    })

    const mockQuizData = {
      questions: [
        {
          question: "What is React?",
          answers: [
            { text: "A database", correct: false },
            { text: "A JavaScript library", correct: true },
            { text: "A CSS framework", correct: false },
            { text: "A server", correct: false },
          ],
        },
        {
          question: "What is JSX?",
          answers: [
            { text: "JavaScript XML", correct: true },
            { text: "Java Syntax", correct: false },
            { text: "JSON XML", correct: false },
            { text: "JavaScript eXtension", correct: false },
          ],
        },
      ],
    }

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn().mockReturnValue(JSON.stringify(mockQuizData)),
        setItem: jest.fn(),
      },
      writable: true,
    })
  })

  it("should render quiz question and answers", () => {
    render(<Quiz noteId={1} onBackToNote={mockOnBackToNote} />)

    expect(screen.getByText("What is React?")).toBeInTheDocument()
    expect(screen.getByText("A database")).toBeInTheDocument()
    expect(screen.getByText("A JavaScript library")).toBeInTheDocument()
    expect(screen.getByText("1 / 2")).toBeInTheDocument()
  })

  it("should show feedback when answer is selected", () => {
    render(<Quiz noteId={1} onBackToNote={mockOnBackToNote} />)

    const correctAnswer = screen.getByText("A JavaScript library")
    fireEvent.click(correctAnswer)

    expect(screen.getByText("Bonne réponse !")).toBeInTheDocument()
  })

  it("should show incorrect feedback for wrong answer", () => {
    render(<Quiz noteId={1} onBackToNote={mockOnBackToNote} />)

    const wrongAnswer = screen.getByText("A database")
    fireEvent.click(wrongAnswer)

    expect(screen.getByText("Mauvaise réponse !")).toBeInTheDocument()
  })

  it("should navigate to next question", () => {
    render(<Quiz noteId={1} onBackToNote={mockOnBackToNote} />)

    fireEvent.click(screen.getByText("A JavaScript library"))

    const nextButton = screen.getByRole("button", { name: /next/i })
    fireEvent.click(nextButton)

    expect(screen.getByText("What is JSX?")).toBeInTheDocument()
    expect(screen.getByText("2 / 2")).toBeInTheDocument()
  })

  it("should show final score after completing quiz", () => {
    render(<Quiz noteId={1} onBackToNote={mockOnBackToNote} />)

    fireEvent.click(screen.getByText("A JavaScript library"))
    fireEvent.click(screen.getByRole("button", { name: /next/i }))

    fireEvent.click(screen.getByText("JavaScript XML"))
    fireEvent.click(screen.getByRole("button", { name: /next/i }))

    expect(screen.getByText("Score final")).toBeInTheDocument()
    expect(screen.getByText("2 / 2")).toBeInTheDocument()
    expect(screen.getByText("Parfait ! C'est du propre.")).toBeInTheDocument()
  })

  it("should restart quiz when restart button is clicked", () => {
    render(<Quiz noteId={1} onBackToNote={mockOnBackToNote} />)

    // Complete the quiz
    fireEvent.click(screen.getByText("A JavaScript library"))
    fireEvent.click(screen.getByRole("button", { name: /next/i }))
    fireEvent.click(screen.getByText("JavaScript XML"))
    fireEvent.click(screen.getByRole("button", { name: /next/i }))

    const restartButton = screen.getByText("On réessaye ?")
    fireEvent.click(restartButton)

    expect(screen.getByText("What is React?")).toBeInTheDocument()
    expect(screen.getByText("1 / 2")).toBeInTheDocument()
  })

  it("should call onBackToNote when back button is clicked", () => {
    render(<Quiz noteId={1} onBackToNote={mockOnBackToNote} />)

    fireEvent.click(screen.getByText("A JavaScript library"))
    fireEvent.click(screen.getByRole("button", { name: /next/i }))
    fireEvent.click(screen.getByText("JavaScript XML"))
    fireEvent.click(screen.getByRole("button", { name: /next/i }))

    const backButton = screen.getByText("Revenir sur ma note")
    fireEvent.click(backButton)

    expect(mockOnBackToNote).toHaveBeenCalledWith(1)
  })

  it("should show message when no quiz data", () => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn().mockReturnValue(null),
        setItem: jest.fn(),
      },
      writable: true,
    })

    render(<Quiz noteId={1} onBackToNote={mockOnBackToNote} />)

    expect(screen.getByText("Votre note est trop courte pour demander un quiz.")).toBeInTheDocument()
  })
})
