"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NoteDetailPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const [note, setNote] = useState(null);

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    const foundNote = storedNotes.find((n) => n.id === Number(id));
    if (!foundNote) {
      router.push("/notes"); // Redirection si la note n'existe pas
    }
    setNote(foundNote);
  }, [id, router]);

  // Mettre à jour la note
  const updateNote = (field, value) => {
    if (!note) return;
    const updatedNote = { ...note, [field]: value };
    setNote(updatedNote);

    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    const updatedNotes = storedNotes.map((n) => (n.id === Number(id) ? updatedNote : n));
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  return (
    <div className="p-4">
      {note ? (
        <>
          <input
            type="text"
            value={note.title}
            onChange={(e) => updateNote("title", e.target.value)}
            className="text-xl font-bold w-full"
          />
          <textarea
            value={note.content}
            onChange={(e) => updateNote("content", e.target.value)}
            className="w-full h-40 mt-4 border p-2"
          />
          <button onClick={() => router.push("/notes")} className="mt-4 p-2 bg-gray-500 text-white">
            Retour
          </button>
        </>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
}
