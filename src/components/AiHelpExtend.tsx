"use client";
import { useState } from 'react';

const AiHelpExtend = () => {
    const [isVisible, setIsVisible] = useState(false);

    const HandleVisible = () => {
        setIsVisible(!isVisible);
    }

    return (
        <div className="flex flex-col ">
            <button onMouseEnter={HandleVisible} onMouseLeave={HandleVisible} className="flex flex-row items-center gap-2 w-fit">
                <h1 className="text-yellowLight font-semibold uppercase -mt-1">Enrichir ma note</h1>
                <div className="flex items-center justify-center h-4 w-4 rounded-full bg-yellowLight -mt-1">
                    <p className="text-white font-semibold text-[10px]">i</p>
                </div>
            </button>
            <div className="pb-4">
                <p className={`text-xs transition-all duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}>L’IA se base sur votre note pour répondre à vos besoins. Vous pouvez baser votre prompt sur le contenu de votre note.</p>
                <p className={`text-xs transition-all duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}><span className="font-semibold">Exemple :</span> Peux-tu réécrire ma note dans un langage plus soutenu ?</p>
            </div>
        </div>
    );
}

export default AiHelpExtend