"use client"
import { useState } from "react";
import QuestionsFreq from "./icons/QuestionFreq";

const AiInput = () => {
    const [ questionsVisible, setQuestionsVisible ] = useState(false);

    const handleQuestionsVisible = () => {
        setQuestionsVisible(!questionsVisible);
    }

    return (
        <>
            <div className="bg-grayLight relative w-full rounded-xl p-2.5 flex flex-col gap-2.5">
                <h1 className="font-semibold">Besoin d&apos;améliorer votre note ?</h1>
                <form action="">
                    <input
                        type="text"
                        placeholder="Votre message"
                        className="bg-white w-full rounded-lg p-2.5 text-sm placeholder:text-gray border border-gray pb-14 focus:outline-none focus:ring-1 focus:ring-yellowLight focus:border-yellow-400"
                    />
                    <button type="submit" className="hover:opacity-70 transition-all duration-300 h-8 w-8 bg-text rounded-full absolute right-5 bottom-5 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" height="14px" width="14px" viewBox="0 0 233.23 251.64">
                            <path fill="white" d="M228.84,106.01L127.22,4.39c-.35-.35-.72-.68-1.1-1-.17-.14-.35-.26-.53-.4-.21-.16-.42-.33-.65-.48-.22-.14-.44-.27-.66-.4-.2-.12-.39-.24-.6-.35-.23-.12-.46-.22-.69-.33-.21-.1-.42-.21-.64-.3-.23-.09-.46-.17-.69-.25-.23-.08-.46-.17-.7-.24-.23-.07-.47-.12-.7-.18-.24-.06-.48-.13-.72-.18-.27-.05-.55-.09-.82-.13-.21-.03-.42-.07-.63-.09-.99-.1-1.98-.1-2.96,0-.21.02-.42.06-.63.09-.27.04-.55.07-.82.13-.24.05-.48.12-.72.18-.23.06-.47.11-.7.18-.24.07-.47.16-.7.24-.23.08-.46.16-.69.25-.22.09-.43.2-.64.3-.23.11-.46.21-.69.33-.2.11-.4.23-.6.35-.22.13-.44.26-.66.4-.22.15-.43.32-.65.48-.18.13-.36.25-.53.4-.38.31-.75.65-1.1,1L4.39,106.01c-5.86,5.86-5.86,15.36,0,21.21,2.93,2.93,6.77,4.39,10.61,4.39s7.68-1.46,10.61-4.39L101.61,51.21v185.43c0,8.28,6.72,15,15,15s15-6.72,15-15V51.21l76.01,76.01c2.93,2.93,6.77,4.39,10.61,4.39s7.68-1.46,10.61-4.39c5.86-5.86,5.86-15.36,0-21.21Z"/>
                        </svg>
                    </button>
                </form>
                <button onClick={handleQuestionsVisible} className={`${questionsVisible ? "bg-yellow-50" : ""} absolute left-5 bottom-5 text-grayOpacity font-medium text-sm px-2.5 py-1 rounded-lg transition-all hover:bg-zinc-50`} style={{ border: "1px solid var(--gray)" }}><span className="italic font-semibold text-[16px] mr-1.5">?</span>Questions fréquentes</button>
            </div>
            <div className={` ${questionsVisible ? "mt-4 opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-all duration-300`}>
                <div className="border-grayLight border-b w-full p-2.5 hover:bg-grayLight transition-colors duration-300 rounded-lg">
                    <button className="w-full h-full flex flex-row items-center gap-6">
                        <div className="w-[20px] h-3">
                            <QuestionsFreq color="#A19D99" />
                        </div>
                        <p className="text-grayDark">Réécris cette note de façon plus claire</p>
                    </button>
                </div>
                <div className="border-grayLight border-b w-full p-2.5 hover:bg-grayLight transition-colors duration-300 rounded-lg">
                    <button className="w-full h-full flex flex-row items-center gap-6">
                        <div className="w-[20px] h-3">
                            <QuestionsFreq color="#A19D99" />
                        </div>
                        <p className="text-grayDark">Corrige les éventuelles erreurs de ma note</p>
                    </button>
                </div>
                <div className="border-grayLight border-b w-full p-2.5 hover:bg-grayLight transition-colors duration-300 rounded-lg">
                    <button className="w-full h-full flex flex-row items-center gap-6">
                        <div className="w-[20px] h-3">
                            <QuestionsFreq color="#A19D99" />
                        </div>
                        <p className="text-grayDark">Résume cette note en quelques mots</p>
                    </button>
                </div>
                <div className="w-full p-2.5 hover:bg-grayLight transition-colors duration-300 rounded-lg">
                    <button className="w-full h-full flex flex-row items-center gap-6">
                        <div className="w-[20px] h-3">
                            <QuestionsFreq color="#A19D99" />
                        </div>
                        <p className="text-grayDark">Génère un résumé détaillé de ma note</p>
                    </button>
                </div>
            </div>
        </>
    );
}

export default AiInput