import SchedulePage from "@/src/components/SchedulePage";

export default function ScheduleRoute() {
  return (
    <div className=" flex flex-col ">
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-auto p-4 sm:p-8">
          <SchedulePage />
        </main>
      </div>
    </div>
  );
}
