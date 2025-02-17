const IconHoverContainer = ({ children }) => {
    return (
        <div className="h-7 px-2 flex items-center justify-center bg-transparent hover:bg-grayLight rounded-md cursor-pointer transition-colors duration-300">
            {children}
        </div>
    )
}

export default IconHoverContainer;