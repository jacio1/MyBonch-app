import SchedulePage from "@/src/components/SchedulePage";
import { initialSubjects } from "@/src/data/initalData";

export default function ScheduleRoute() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto p-4 sm:p-8">
          <SchedulePage subjects={initialSubjects} />
        </main>
      </div>
    </div>
  );
}