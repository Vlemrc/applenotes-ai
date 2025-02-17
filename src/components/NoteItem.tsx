const NoteItem = ({ note, onNoteSelect, selectedNoteId }) => {
    return (
        <button onClick={() => onNoteSelect(note)} className="w-full">
            <li className={`${selectedNoteId === note.id ? "bg-gray" : ""} py-4 px-7 w-full rounded-md`}>
                <h6 className="font-black text-sm text-left">{note.title}</h6>
                <div className="flex flex-row gap-2.5">
                    <p className="text-medium text-xs">{note.date}</p>
                    <p className="text-grayDark text-xs">{note.content}</p>
                </div>
            </li>
        </button>
    )
}

export default NoteItem 