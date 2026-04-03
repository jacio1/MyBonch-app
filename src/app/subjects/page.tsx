import SubjectsPage from "@/src/components/SubjectsPage";

export default function ScheduleRoute() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto p-4 sm:p-8">
          <SubjectsPage />
        </main>
      </div>
    </div>
  );
}
