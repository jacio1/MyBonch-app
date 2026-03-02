import { BookOpen, Search, BellRing, User } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <BookOpen className="h-8 w-8 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">МойБонч</h1>
            <p className="text-sm text-gray-500">
              Ваш персональный помощник в учебе
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Search className="h-5 w-5 text-gray-500 cursor-pointer" />
          <BellRing className="h-5 w-5 text-gray-500 cursor-pointer" />
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="font-medium">Гоглев Слава</p>
              <p className="text-sm text-gray-500">4 курс, ИТПИ</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}