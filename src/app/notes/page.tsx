import NotesPage from "@/src/components/NotesPage";
import { initialNotes } from "@/src/data/initalData";

export default function NotesRoute() {
  const assignmentsCount = 0; // Здесь нужно будет получить реальное количество
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto p-8">
          <NotesPage notes={initialNotes} />
        </main>
      </div>
    </div>
  );
}