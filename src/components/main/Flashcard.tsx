"use client";
import { useEffect, useState } from "react";

const FlashCard = ({ noteId }: { noteId: number }) => {
    const [flashcards, setFlashcards] = useState<string | null>(null);

    useEffect(() => {
        const storedFlashcards = localStorage.getItem(`generated-flashcards-${noteId}`);
        if (storedFlashcards) {
            setFlashcards(JSON.parse(storedFlashcards));
        }
    }, [noteId]);

    return (
        <div>
            <h1 className="font-semibold text-yellowLight uppercase -mt-1">Flashcard</h1>
            <div className="relative bg-grayLight flex flex-col items-center p-6 rounded-xl mt-10">
                {flashcards ? (
                    <pre className="whitespace-pre-wrap">{flashcards}</pre>
                ) : (
                    <p>Chargement des flashcards...</p>
                )}
            </div>
        </div>
    );
};

export default FlashCard;


// "use client";
// const FlashCard = () => {
//     return (
//         <div>
//             <h1 className="font-semibold text-yellowLight uppercase -mt-1">Flashcard</h1>
//             <button className="relative bg-grayLight w-full flex flex-col justify-center items-center p-6 rounded-xl mt-10 min-h-[340px]">
//                 <h1 className="text-text text-lg font-semibold">Quelle est la nationalité de Dmitry Bivol ?</h1>
//                 <p className="text-yellowLight uppercase text-xs font-medium">Press to flip</p>
//             </button>
//             <div className="flex flex-row justify-between mt-2.5">
//                 <p className="font-medium text-text">8 / 10</p>
//                 <button className="font-medium text-text animlinkunderline">&gt; Question suivante !</button>
//             </div>
//         </div>
//     )
// }

// export default FlashCard