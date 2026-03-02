export default function QuickAccessCard() {
  return (
    <div className="mt-auto pt-6 border-t">
      <div className="bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
        <p className="text-sm font-medium text-gray-800">До экзаменов</p>
        <p className="text-2xl font-bold text-indigo-700 mt-1">24 дня</p>
        <p className="text-xs text-gray-500 mt-2">
          У вас 3 незавершенных задания
        </p>
      </div>
    </div>
  );
}