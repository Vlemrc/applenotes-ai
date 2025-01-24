"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);

  // Charger les notes depuis localStorage
  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(storedNotes);
  }, []);

  // Ajouter une nouvelle note
  const addNote = () => {
    const newNote = { id: Date.now(), title: "Nouvelle note", content: "" };
    const updatedNotes = [...notes, newNote];

    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Mes Notes</h1>
      <button className="mt-4 p-2 bg-blue-500 text-white" onClick={addNote}>
        Ajouter une note
      </button>
      <ul className="mt-4">
        {notes.map((note) => (
          <li key={note.id} className="border-b p-2">
            <Link href={`/notes/${note.id}`} className="text-blue-500">
              {note.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
