export default function NoteContent({ note }) {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{note.title}</h2>
      <p>{note.content}</p>
    </div>
  )
}

