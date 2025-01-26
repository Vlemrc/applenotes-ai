import ActionsNav from "./components/ActionsNav";
import Leftbar from "./components/main/Leftbar";
import Sidebar from "./components/main/Sidebar";

export default function Home() {
  return (
    <main className="flex flex-row h-full">
      <Leftbar />
      <Sidebar />
      <ActionsNav />
    </main>
  );
}
