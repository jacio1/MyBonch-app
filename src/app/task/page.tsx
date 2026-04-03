import TaskPage from "@/src/components/TaskPage";

export default function TaskRoute() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto p-8">
          <TaskPage />
        </main>
      </div>
    </div>
  );
}
