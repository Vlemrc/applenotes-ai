import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

export default function AddFolderInput({ setAddFolder, onFolderAdded }) {
    const modalRef = useRef(null);
    const containerRef = useRef(null);
    const [folderName, setFolderName] = useState("Nouveau dossier");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const tl = gsap.timeline();
        tl.fromTo(
            containerRef.current,
            { opacity: 0, backgroundColor: "rgba(0, 0, 0, 0)" },
            { opacity: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", duration: 0.3 }
        );
        tl.fromTo(
            modalRef.current,
            { opacity: 0, y: -40 },
            { opacity: 1, y: 0, duration: 0.3 },
            "-=0.1"
        );
    }, []);

    const handleClose = () => {
        const tl = gsap.timeline({
            onComplete: () => setAddFolder(false),
        });
        tl.to(modalRef.current, { opacity: 0, y: -40, duration: 0.3 });
        tl.to(containerRef.current, { opacity: 0, duration: 0.3 }, "-=0.1");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!folderName.trim()) {
            setError("Le nom du dossier ne peut pas être vide.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/folders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: folderName }),
            });

            if (!res.ok) {
                throw new Error("Erreur lors de la création du dossier");
            }

            const newFolder = await res.json();
            onFolderAdded(newFolder); // Met à jour la liste des dossiers dans ton UI
            handleClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div ref={containerRef} className="fixed flex items-center justify-center inset-0 bg-gray__container z-50">
            <div ref={modalRef} className="bg-white w-4/5 lg:w-1/3 rounded-lg p-6 flex flex-col gap-4 border border-grayOpacity">
                <h2 className="text-black font-bold text-sm">Nouveau dossier</h2>

                {error && <p className="text-red-500 text-xs">{error}</p>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-row gap-3 items-center border-b border-gray pb-4">
                        <label className="text-sm whitespace-nowrap">Nom :</label>
                        <div className="p-1 bg-yellowInput rounded-lg flex items-center w-full">
                            <input
                                type="text"
                                value={folderName}
                                onChange={(e) => setFolderName(e.target.value)}
                                onFocus={(e) => e.target.select()}
                                style={{ lineHeight: "12px" }}
                                className="rounded-md w-full h-[20px] shadow-sm text-sm pl-2 focus:outline-none custom-selection"
                            />
                        </div>
                    </div>

                    <div className="flex flex-row justify-end gap-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="text-sm border border-solid border-grayLight shadow-sm w-[80px] rounded-md font-medium hover:bg-grayLight transition-colors duration-300"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="text-sm bg-yellowButton w-[80px] rounded-md font-medium hover:bg-yellow transition-colors duration-300"
                            disabled={loading}
                        >
                            {loading ? "Ajout..." : "OK"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
