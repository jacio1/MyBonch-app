"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/lib/AuthContext";
import { Loader } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push("/sign-in");
    } else {
      router.push("/schedule");
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
        <p className="text-gray-600">Загрузка приложения...</p>
      </div>
    </div>
  );
}
