import ActionsNav from "../components/ActionsNav";
import Leftbar from "@/components/main/Leftbar";
import Sidebar from "@/components/main/Sidebar";
import AiButton from "@/components/AiButton";
import Breadcrumb from "@/components/Breadcrumb";

export default function Home() {
  return (
    <main className="flex flex-row h-full">
      <Leftbar />
      <Sidebar />
      <div className="relative flex flex-col w-full">
        <ActionsNav />
        <div className="px-8 py-4">
          <Breadcrumb />
        </div>
        <AiButton />
      </div>
    </main>
  );
}