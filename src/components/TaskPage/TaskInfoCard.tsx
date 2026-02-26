import { CheckSquare, Clock, FileText } from "lucide-react";

export default function TaskInfoCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-[#0a0a0a] p-6 rounded-xl border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Всего заданий</p>
            <p className="text-3xl font-bold mt-2">3</p>
          </div>
          <div className="w-12 h-12 bg-[#1c1c1c] rounded-full flex items-center justify-center">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>
      <div className="bg-[#0a0a0a] p-6 rounded-xl border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Выполнено</p>
            <p className="text-3xl font-bold mt-2">3 </p>
          </div>
          <div className="w-12 h-12 bg-[#1c1c1c] rounded-full flex items-center justify-center">
            <CheckSquare className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>
      <div className="bg-[#0a0a0a] p-6 rounded-xl border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">С высоким приоритетом</p>
            <p className="text-3xl font-bold mt-2">3 </p>
          </div>
          <div className="w-12 h-12 bg-[#1c1c1c] rounded-full flex items-center justify-center">
            <Clock className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
}
