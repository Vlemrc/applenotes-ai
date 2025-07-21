import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import NoteContent from "@/components/main/NoteContent"
import useFolderStore from "@/stores/useFolderStore"

jest.mock("@/stores/useFolderStore")
jest.mock("lodash", () => ({
  debounce: (fn: any) => fn,
}))

const mockUseFolderStore = useFolderStore as jest.MockedFunction<typeof useFolderStore>

// Mock fetch
global.fetch = jest.fn()

describe("NoteContent", () => {
  const mockNote = {
    id: 1,
    title: "Test Note",
    content: "Initial content",
    folderId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    jest.clearAllMocks()

    mockUseFolderStore.mockReturnValue({
      activeFolderId: 1,
      folders: [
        {
          id: 1,
          name: "Test Folder",
          _count: { notes: 1, roadmaps: 0 },
        },
      ],
    } as any)

    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockNote),
      })
      .mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      })
  })

  it("should render textarea with note content", async () => {
    render(<NoteContent note={mockNote} />)

    await waitFor(() => {
      const textarea = screen.getByPlaceholderText("Note...")
      expect(textarea).toBeInTheDocument()
      expect(textarea).toHaveValue("Initial content")
    })
  })

  it("should update content when typing", async () => {
    render(<NoteContent note={mockNote} />)

    await waitFor(() => {
      const textarea = screen.getByPlaceholderText("Note...")
      fireEvent.change(textarea, { target: { value: "Updated content" } })
      expect(textarea).toHaveValue("Updated content")
    })
  })

  it("should save note when content changes", async () => {
    render(<NoteContent note={mockNote} />)

    await waitFor(() => {
      const textarea = screen.getByPlaceholderText("Note...")
      fireEvent.change(textarea, { target: { value: "New content" } })
    })

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/notes", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: 1,
          content: "New content",
        }),
      })
    })
  })

  it("should show saving indicator", async () => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockNote),
      })
      .mockImplementationOnce(() => new Promise((resolve) => setTimeout(resolve, 1000)))

    render(<NoteContent note={mockNote} />)

    await waitFor(() => {
      const textarea = screen.getByPlaceholderText("Note...")
      fireEvent.change(textarea, { target: { value: "New content" } })
    })

    expect(screen.getByText("Enregistrement...")).toBeInTheDocument()
  })

  it("should not render when folder has no notes", () => {
    mockUseFolderStore.mockReturnValue({
      activeFolderId: 1,
      folders: [
        {
          id: 1,
          name: "Empty Folder",
          _count: { notes: 0, roadmaps: 0 },
        },
      ],
    } as any)

    const { container } = render(<NoteContent note={mockNote} />)
    expect(container.firstChild).toBeNull()
  })

  it("should not render when no note provided", () => {
    const { container } = render(<NoteContent note={null as any} />)
    expect(container.firstChild).toBeNull()
  })
})
