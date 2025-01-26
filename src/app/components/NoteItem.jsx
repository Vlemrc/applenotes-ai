import Link from "next/link";

const NoteItem = ({ note }) => {
    const isActive = true
    return (
        <Link key={note.id} href={`/notes/${note.id}`} className="w-full h-full">
            <li className={`${isActive ? "bg-gray" : ""} py-4 px-7 w-full rounded-lg`}>
                <h6 className="font-black text-sm">{note.title}</h6>
                <div className="flex flex-row gap-2.5">
                    <p className="text-medium text-xs">{note.date}</p>
                    <p className="text-grayDark text-xs">{note.content}</p>
                </div>
            </li>
        </Link>
    )
}

export default NoteItem 