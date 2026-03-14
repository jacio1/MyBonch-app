import NotesPage from "@/src/components/NotesPage";

export default function NotesRoute() {
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto p-8">
          <NotesPage />
        </main>
      </div>
    </div>
  );
}