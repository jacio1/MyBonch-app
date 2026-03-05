'use client';

import { useAuth } from '@/src/lib/AuthContext';
import { AlertCircle } from 'lucide-react';
import { useData } from '@/src/lib/DataContext';

interface ScheduleTaskInfoProps {
  subjectName?: string;
}

export default function ScheduleTaskInfo({ subjectName }: ScheduleTaskInfoProps) {
  const { user } = useAuth();
  const { assignments } = useData();

  if (!user) return null;

  const relatedAssignments = subjectName
    ? assignments.filter(
        (a) => a.subject.toLowerCase() === subjectName.toLowerCase() && !a.completed
      )
    : [];

  if (relatedAssignments.length === 0) {
    return (
      <div className="text-xs text-gray-500 mt-2">
        Нет активных заданий
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-2">
      {relatedAssignments.slice(0, 2).map((assignment) => (
        <div
          key={assignment.id}
          className="flex items-start gap-2 p-2 bg-red-50 rounded text-xs"
        >
          <AlertCircle className="h-3 w-3 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-red-900 truncate">{assignment.title}</p>
            <p className="text-red-700 text-xs">
              Дедлайн: {new Date(assignment.deadline).toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>
      ))}
      {relatedAssignments.length > 2 && (
        <div className="text-xs text-gray-600 px-2">
          +{relatedAssignments.length - 2} еще заданий
        </div>
      )}
    </div>
  );
}