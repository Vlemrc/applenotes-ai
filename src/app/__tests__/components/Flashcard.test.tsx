import { render, screen, fireEvent } from "@testing-library/react"
import FlashCard from "@/components/main/Flashcard"
import { useLearningModeStore } from "@/stores/learningModeStore"
import { useRoadmapItem } from "@/utils/useRoadmapItem"
import { useRoadmapItemStore } from "@/stores/roadmapItemStore"

// Mock des stores et hooks
jest.mock("@/stores/learningModeStore")
jest.mock("@/utils/useRoadmapItem")
jest.mock("@/stores/roadmapItemStore")
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}))

const mockUseLearningModeStore = useLearningModeStore as jest.MockedFunction<typeof useLearningModeStore>
const mockUseRoadmapItem = useRoadmapItem as jest.MockedFunction<typeof useRoadmapItem>
const mockUseRoadmapItemStore = useRoadmapItemStore as jest.MockedFunction<typeof useRoadmapItemStore>

describe("FlashCard", () => {
  const mockOnBackToNote = jest.fn()
  const mockUpdateChecked = jest.fn()
  const mockSetRoadmapItems = jest.fn()

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

    mockUseRoadmapItemStore.mockReturnValue({
      setRoadmapItems: mockSetRoadmapItems,
      hasItemsForNote: jest.fn().mockReturnValue(false),
    } as any)

    // Mock localStorage
    const mockFlashcards = {
      flashcards: [
        { question: "What is React?", answer: "A JavaScript library" },
        { question: "What is JSX?", answer: "JavaScript XML syntax" },
      ],
    }

    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn().mockReturnValue(JSON.stringify(mockFlashcards)),
        setItem: jest.fn(),
      },
      writable: true,
    })
  })

  it("should render flashcard with question initially", () => {
    render(<FlashCard noteId={1} onBackToNote={mockOnBackToNote} />)

    expect(screen.getByText("What is React?")).toBeInTheDocument()
    expect(screen.getByText("Appuie pour retourner")).toBeInTheDocument()
    expect(screen.getByText("1 / 2")).toBeInTheDocument()
  })

  it("should flip card when clicked", () => {
    render(<FlashCard noteId={1} onBackToNote={mockOnBackToNote} />)

    const card = screen.getByText("What is React?").closest("div")
    fireEvent.click(card!)

    expect(screen.getByText("A JavaScript library")).toBeInTheDocument()
    expect(screen.getByText("Retourner à la question")).toBeInTheDocument()
  })

  it("should navigate to next card", () => {
    render(<FlashCard noteId={1} onBackToNote={mockOnBackToNote} />)

    const nextButton = screen.getByText("Suivante >")
    fireEvent.click(nextButton)

    expect(screen.getByText("What is JSX?")).toBeInTheDocument()
    expect(screen.getByText("2 / 2")).toBeInTheDocument()
  })

  it("should navigate to previous card", () => {
    render(<FlashCard noteId={1} onBackToNote={mockOnBackToNote} />)

    fireEvent.click(screen.getByText("Suivante >"))

    const prevButton = screen.getByText("< Précédente")
    fireEvent.click(prevButton)

    expect(screen.getByText("What is React?")).toBeInTheDocument()
    expect(screen.getByText("1 / 2")).toBeInTheDocument()
  })

  it("should show back to note button on last card", () => {
    render(<FlashCard noteId={1} onBackToNote={mockOnBackToNote} />)

    fireEvent.click(screen.getByText("Suivante >"))

    const backButton = screen.getByText("Revenir sur ma note")
    expect(backButton).toBeInTheDocument()

    fireEvent.click(backButton)
    expect(mockOnBackToNote).toHaveBeenCalledWith(1)
  })

  it("should show roadmap button in learning mode on last card", () => {
    mockUseLearningModeStore.mockReturnValue({
      isLearningMode: true,
    } as any)

    mockUseRoadmapItem.mockReturnValue({
      item: {
        id: 1,
        roadmapId: 1,
        noteId: 1,
        position: 0,
        checked: false,
      },
      isChecked: false,
      updateChecked: mockUpdateChecked,
    })

    render(<FlashCard noteId={1} onBackToNote={mockOnBackToNote} />)

    fireEvent.click(screen.getByText("Suivante >"))

    const roadmapButton = screen.getByText("Marquer comme maitrisé")
    expect(roadmapButton).toBeInTheDocument()

    fireEvent.click(roadmapButton)
    expect(mockUpdateChecked).toHaveBeenCalledWith(true)
  })

  it("should show message when no flashcards data", () => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn().mockReturnValue(null),
        setItem: jest.fn(),
      },
      writable: true,
    })

    render(<FlashCard noteId={1} onBackToNote={mockOnBackToNote} />)

    expect(screen.getByText("Votre note est trop courte pour demander des flashcards.")).toBeInTheDocument()
  })
})
