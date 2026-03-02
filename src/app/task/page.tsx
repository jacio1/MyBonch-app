import AssignmentsPage from "@/src/components/TaskPage";
import { initialAssignments } from "@/src/data/initalData";

export default function AssignmentsRoute() {
  const assignmentsCount = initialAssignments.filter((a) => !a.completed).length;
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto p-8">
            <AssignmentsPage assignments={initialAssignments}/>
        </main>
      </div>
    </div>
  );
}