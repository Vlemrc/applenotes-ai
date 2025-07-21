import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import GlossaryLayout from "@/components/GlossaryLayout"
import useFolderStore from "@/stores/useFolderStore"

jest.mock("@/stores/useFolderStore")
jest.mock("jspdf", () => ({
  jsPDF: jest.fn().mockImplementation(() => ({
    setFont: jest.fn(),
    setFontSize: jest.fn(),
    text: jest.fn(),
    splitTextToSize: jest.fn().mockReturnValue(["line1", "line2"]),
    addPage: jest.fn(),
    save: jest.fn(),
    internal: {
      pageSize: {
        getWidth: jest.fn().mockReturnValue(210),
      },
    },
  })),
}))

const mockUseFolderStore = useFolderStore as jest.MockedFunction<typeof useFolderStore>

// Mock fetch
global.fetch = jest.fn()

describe("GlossaryLayout", () => {
  const mockNote = {
    id: 1,
    title: "Test Note",
    content: "Test content for glossary generation",
    folderId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseFolderStore.mockReturnValue({
      getActiveFolder: jest.fn().mockReturnValue({
        id: 1,
        name: "Test Folder",
        notes: [mockNote],
      }),
    } as any)
  })

  it("should render glossary generation buttons", () => {
    render(<GlossaryLayout note={mockNote} />)

    expect(screen.getByText("Générer un glossaire de cette note")).toBeInTheDocument()
    expect(screen.getByText("Générer un glossaire du dossier Test Folder")).toBeInTheDocument()
  })

  it("should generate glossary for single note", async () => {
    const mockGlossaryData = {
      glossary: [
        { term: "React", definition: "A JavaScript library" },
        { term: "Component", definition: "Reusable UI element" },
      ],
    }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockGlossaryData),
    })

    render(<GlossaryLayout note={mockNote} />)

    const generateButton = screen.getByText("Générer un glossaire de cette note")
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/glossary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteContent: mockNote.content }),
      })
    })
  })

  it("should generate glossary for entire folder", async () => {
    const mockGlossaryData = {
      glossary: [{ term: "Folder Term", definition: "Definition from folder" }],
    }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockGlossaryData),
    })

    render(<GlossaryLayout note={mockNote} />)

    const generateFolderButton = screen.getByText("Générer un glossaire du dossier Test Folder")
    fireEvent.click(generateFolderButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/glossary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          noteContent: `## ${mockNote.title}\n\n${mockNote.content}`,
        }),
      })
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
                json: () => Promise.resolve({ glossary: [] }),
              }),
            100,
          ),
        ),
    )

    render(<GlossaryLayout note={mockNote} />)

    const generateButton = screen.getByText("Générer un glossaire de cette note")
    fireEvent.click(generateButton)

    expect(screen.getByText("Génération en cours...")).toBeInTheDocument()
  })

  it("should disable folder button when no notes in folder", () => {
    mockUseFolderStore.mockReturnValue({
      getActiveFolder: jest.fn().mockReturnValue({
        id: 1,
        name: "Empty Folder",
        notes: [],
      }),
    } as any)

    render(<GlossaryLayout note={mockNote} />)

    const folderButton = screen.getByText("Générer un glossaire du dossier Empty Folder")
    expect(folderButton.closest("button")).toBeDisabled()
  })

  it("should handle API errors gracefully", async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: "Server error" }),
    })

    const consoleSpy = jest.spyOn(console, "error").mockImplementation()

    render(<GlossaryLayout note={mockNote} />)

    const generateButton = screen.getByText("Générer un glossaire de cette note")
    fireEvent.click(generateButton)

    await waitFor(() => {
      expect(consoleSpy).not.toHaveBeenCalled()
    })

    consoleSpy.mockRestore()
  })
})
