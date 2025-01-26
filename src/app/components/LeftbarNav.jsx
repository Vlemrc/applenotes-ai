import Bin from "./icons/Bin";
import MenuGrid from "./icons/MenuGrid";
import MenuNotes from "./icons/MenuNotes";

const LeftbarNav = () => {
    return (
        <div className="h-[50px] border-b border-solid border-gray flex flex-row justify-between items-center px-2.5 py-4">
            <div className="flex flex-row items-center">
                <div className="hover:bg-grayLight rounded-md cursor-pointer transition-colors duration-300 h-7 w-8 flex items-center justify-center">
                    <MenuNotes />
                </div>
                <div className="hover:bg-grayLight rounded-md cursor-pointer transition-colors duration-300 h-7 w-8 flex items-center justify-center">
                    <MenuGrid />
                </div>
            </div>
            <div className="hover:bg-grayLight rounded-md cursor-pointer transition-colors duration-300 h-7 w-8 flex items-center justify-center">
                <Bin color="#BFBFBF" />
            </div>
        </div>
    )
}

export default LeftbarNav;