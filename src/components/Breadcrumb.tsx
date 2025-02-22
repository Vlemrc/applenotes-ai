"use client";
import { ChevronRight } from "lucide-react"
import { Note } from "@/types/notes"

interface BreadcrumbProps {
  note: Note | null;
  mode: 'quiz' | 'assistant' | 'flashcards' | null;
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
    default:
      return '';
  }
}

export default function Breadcrumb({ note, mode, onResetMode }: BreadcrumbProps) {
  if (!note) return null;

  const items = [
    { label: note.title, onClick: onResetMode },
    ...(mode ? [{ label: getModeLabel(mode) }] : [])
  ];

  return (
    <nav className="flex flex-row group font-medium text-sm text-grayOpacity mb-1">
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
  )
}