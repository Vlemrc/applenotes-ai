"use client";
import { useState, useEffect } from "react";
import NoteItem from "../../components/NoteItem";
import { dataNotes } from '@/app/dataNotes';

export default function NotesPage() {
  const [notes, setNotes] = useState([]);

  // Charger les notes depuis localStorage
  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(storedNotes);
  }, []);

  const notes2 = dataNotes

  return (
    <div className="p-4 overflow-scroll overflow-x-hidden" style={{ height: "calc(100vh - 50px)" }}>
      <ul>
        {notes2.map((note, index) => (
          <NoteItem key={index} note={note} />
        ))}
      </ul>
    </div>
  );
}