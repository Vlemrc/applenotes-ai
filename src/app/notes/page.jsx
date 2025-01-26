"use client";
import { useState, useEffect } from "react";
import NoteItem from "../components/NoteItem";
import { dataNotes } from '@/app/dataNotes';

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

  const notes2 = dataNotes

  return (
    <div className="p-4">
      {/* <button className="mt-4 p-2 bg-blue-500 text-white" onClick={addNote}>
        Ajouter une note
      </button> */}
      <ul>
        {notes2.map((note, index) => (
          <NoteItem key={index} note={note} />
        ))}
      </ul>
    </div>
  );
}