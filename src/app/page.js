import Leftbar from "./components/main/Leftbar";
import Sidebar from "./components/main/Sidebar";

export default function Home() {
  return (
    <main className="flex flex-row h-full">
      <Leftbar />
      <Sidebar />
      <div>
        <p>contenu de la note</p>
      </div>
    </main>
  );
}
