const IconHoverContainer = ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => {
    return (
        <div
            className="h-7 px-2 flex items-center justify-center bg-transparent hover:bg-grayLight rounded-md cursor-pointer transition-colors duration-300"
            onClick={onClick} // Ajout du gestionnaire d'événements
        >
            {children}
        </div>
    )
}

export default IconHoverContainer;