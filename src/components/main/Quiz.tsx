const Quiz = () => {
    return (
        <div>
            <h1 className="font-semibold text-yellowLight uppercase -mt-1">Quiz</h1>
            <div className="relative bg-grayLight flex flex-col items-center p-6 rounded-xl mt-10">
                <div id="progress" className="w-full flex flex-col items-center justify-center gap-1">
                    <p className="text-xs text-grayOpacity">3 / 10</p>
                </div>
                <h1 className="text-text text-lg font-semibold pt-5">Quelle est la nationalité de Dmitry Bivol ?</h1>
                <div id="answers" className="w-1/2 py-9">
                    <ul className="flex flex-wrap flex-row gap-5 items-center justify-center">
                        <li className="font-semibold text-center w-[170px] bg-white px-14 py-5 rounded-lg text-yellow hover:text-white hover:bg-yellow-gradient transition-all duration-300">Brésilien</li>
                        <li className="font-semibold text-center w-[170px] bg-white px-14 py-5 rounded-lg text-yellow hover:text-white hover:bg-yellow-gradient transition-all duration-300">Russe</li>
                        <li className="font-semibold text-center w-[170px] bg-white px-14 py-5 rounded-lg text-yellow hover:text-white hover:bg-yellow-gradient transition-all duration-300">Français</li>
                        <li className="font-semibold text-center w-[170px] bg-white px-14 py-5 rounded-lg text-yellow hover:text-white hover:bg-yellow-gradient transition-all duration-300">Arménien</li>
                    </ul>
                </div>
                <button id="next-question" className="flex items-center justify-center rotate-180 absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2 bg-yellow-gradient h-6 w-6 rounded-full">
                    <svg height="12px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5.28 9.21" className="-translate-x-[1px]">
                        <path fill="#fff" d="M5.08,9.01c.27-.27.27-.71,0-.98l-3.43-3.43,3.43-3.43c.27-.27.27-.71,0-.98s-.71-.27-.98,0L.2,4.11C.06,4.24,0,4.42,0,4.6c0,.18.06.36.2.5l3.91,3.91c.27.27.71.27.98,0Z"/>
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default Quiz