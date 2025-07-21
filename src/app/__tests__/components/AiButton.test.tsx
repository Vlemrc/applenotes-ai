import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import AiButton from "@/components/main/AiButton"
import useFolderStore from "@/stores/useFolderStore"

jest.mock("@/stores/useFolderStore")
jest.mock("@/components/ui/progress", () => ({
  Progress: ({ value }: { value: number }) => <div data-testid="progress" data-value={value} />,
}))

const mockUseFolderStore = useFolderStore as jest.MockedFunction<typeof useFolderStore>

global.fetch = jest.fn()

describe("AiButton", () => {
  const mockOnModeChange = jest.fn()
  const mockSetBottomBar = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseFolderStore.mockReturnValue({
      activeFolderId: 1,
      folders: [
        {
          id: 1,
          name: "Test Folder",
          _count: { notes: 1 },
        },
      ],
    } as any)

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
      },
      writable: true,
    })
  })

  it("should render AI buttons when content is available", () => {
    render(
      <AiButton
        noteId={1}
        noteContent="Test content"
        onModeChange={mockOnModeChange}
        bottomBar={true}
        setBottomBar={mockSetBottomBar}
      />,
    )

    expect(screen.getByText("Générer un quiz")).toBeInTheDocument()
    expect(screen.getByText("Enrichir cette note")).toBeInTheDocument()
    expect(screen.getByText("Accéder à la roadmap")).toBeInTheDocument()
    expect(screen.getByText("Créer des flashcards")).toBeInTheDocument()
  })

  it("should not render when no content", () => {
    const { container } = render(
      <AiButton
        noteId={1}
        noteContent=""
        onModeChange={mockOnModeChange}
        bottomBar={true}
        setBottomBar={mockSetBottomBar}
      />,
    )

    expect(container.firstChild).toBeNull()
  })

  it("should toggle bottom bar when arrow is clicked", () => {
    render(
      <AiButton
        noteId={1}
        noteContent="Test content"
        onModeChange={mockOnModeChange}
        bottomBar={false}
        setBottomBar={mockSetBottomBar}
      />,
    )

    const toggleButton = screen.getByRole("button", { name: "" })
    fireEvent.click(toggleButton)

    expect(mockSetBottomBar).toHaveBeenCalledWith(true)
  })

  it("should generate quiz when quiz button is clicked", async () => {
    const mockQuizData = { questions: [] }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockQuizData),
    })

    render(
      <AiButton
        noteId={1}
        noteContent="Test content"
        onModeChange={mockOnModeChange}
        bottomBar={true}
        setBottomBar={mockSetBottomBar}
      />,
    )

    const quizButton = screen.getByText("Générer un quiz").closest("button")
    fireEvent.click(quizButton!)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteContent: "Test content", questionCount: 8 }),
      })
    })

    await waitFor(() => {
      expect(mockOnModeChange).toHaveBeenCalledWith("quiz")
      expect(mockSetBottomBar).toHaveBeenCalledWith(false)
    })
  })

  it("should generate flashcards when flashcard button is clicked", async () => {
    const mockFlashcardData = { flashcards: [] }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockFlashcardData),
    })

    render(
      <AiButton
        noteId={1}
        noteContent="Test content"
        onModeChange={mockOnModeChange}
        bottomBar={true}
        setBottomBar={mockSetBottomBar}
      />,
    )

    const flashcardButton = screen.getByText("Créer des flashcards").closest("button")
    fireEvent.click(flashcardButton!)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/flashcard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteContent: "Test content", flashcardsCount: 8 }),
      })
    })

    await waitFor(() => {
      expect(mockOnModeChange).toHaveBeenCalledWith("flashcards")
    })
  })

  it("should show loading state during generation", async () => {
    ;(global.fetch as jest.Mock).mockImplementationOnce(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: () => Promise.resolve({ questions: [] }),
              }),
            100,
          ),
        ),
    )

    render(
      <AiButton
        noteId={1}
        noteContent="Test content"
        onModeChange={mockOnModeChange}
        bottomBar={true}
        setBottomBar={mockSetBottomBar}
      />,
    )

    const quizButton = screen.getByText("Générer un quiz").closest("button")
    fireEvent.click(quizButton!)

    expect(screen.getByText("Quiz en cours de création...")).toBeInTheDocument()
    expect(screen.getByTestId("progress")).toBeInTheDocument()
  })

  it("should handle assistant mode", () => {
    render(
      <AiButton
        noteId={1}
        noteContent="Test content"
        onModeChange={mockOnModeChange}
        bottomBar={true}
        setBottomBar={mockSetBottomBar}
      />,
    )

    const assistantButton = screen.getByText("Enrichir cette note").closest("button")
    fireEvent.click(assistantButton!)

    expect(mockOnModeChange).toHaveBeenCalledWith("assistant")
    expect(mockSetBottomBar).toHaveBeenCalledWith(false)
  })
})
