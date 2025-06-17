"use client";
import { ChevronRight } from "lucide-react"
import { Note } from "@/types/notes"
import { useState, useEffect } from "react"
import useFolderStore from "@/stores/useFolderStore";

interface BreadcrumbProps {
  note: Note | null;
  mode: 'quiz' | 'assistant' | 'flashcards' | 'roadmap' | null;
  onResetMode: () => void;
}

const getModeLabel = (mode: string): string => {
  switch (mode) {
    case 'quiz':
      return 'Quiz';
    case 'assistant':
      return 'Assistant IA';
    case 'flashcards':
      return 'Flashcards';
    case 'roadmap':
      return 'Roadmap';
    default:
      return '';
  }
}

export default function Breadcrumb({ note, mode, onResetMode }: BreadcrumbProps) {
  const { activeFolderId } = useFolderStore();

  const activeFolder = useFolderStore(state => state.getActiveFolder());
  const folderTitle = activeFolder?.name;
  if (!note) return null;

  const items = [
    { label: note.title, onClick: onResetMode },
    ...(mode ? [{ label: getModeLabel(mode) }] : [])
  ];

  if (!mode) return null;

  return (
    <>
      {mode !== 'roadmap' && (
        <nav className="flex flex-row group font-medium text-sm text-grayOpacity mt-4">
          {items.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && <ChevronRight className="h-4 w-4 ml-1" />}
              <span 
                onClick={item.onClick}
                className={`
                  transition-colors duration-300
                  ${item.onClick ? 'cursor-pointer' : ''}
                  ${index === items.length - 1 
                    ? "text-text group-hover:text-grayOpacity" 
                    : "hover:text-text animlinkunderline"
                  }
                `}
              >
                {item.label}
              </span>
            </div>
          ))}
        </nav>
      )}
      {mode === 'roadmap' && (
        <div className="flex items-center text-sm text-grayOpacity mt-8">
          <span className="cursor-pointer" onClick={onResetMode}>
            {folderTitle}
          </span>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-text">Roadmap</span>
        </div>
      )}
    </>
  )
}