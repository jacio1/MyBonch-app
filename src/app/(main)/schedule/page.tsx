"use client";

import { useState, useMemo } from "react";
import { Plus, Copy, Loader } from "lucide-react";
import { useData } from "@/src/lib/DataContext";
import { useAuth } from "@/src/lib/AuthContext";
import { ScheduleFormData, PeriodFormData, ApplyPresetFormData, ErrorModalData } from "@/src/types/schedule";
import { checkTimeOverlap, formatTime, getWeekDays } from "@/src/utils/schedule";
import { Schedule } from "@/src/types";
import { useWeekNavigation } from "./_hooks/useWeekNavigation";
import { AddScheduleModal } from "./_components/modals/addScheduleModal";
import { ConfirmModal } from "./_components/modals/ConfirmModal";
import { WeekNavigation } from "./_components/WeekNavigation";
import { WeekSchedule } from "./_components/WeekSchedule";
import { ApplyPresetModal } from "./_components/modals/ApplyPresetModal";
import { AddPeriodModal } from "./_components/modals/addPeriodModal";
import { ErrorModal } from "./_components/modals/ErrorModal";
import { COLORS } from "@/src/constants/schedule";


export default function SchedulePage() {
  const { user, loading: authLoading } = useAuth();
  const {
    schedules,
    presets,
    activeStudyPeriod,
    timings,
    loading,
    error,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    createStudyPeriod,
    applyPreset,
    deleteStudyPeriod,
  } = useData();

  const {
    currentWeekStart,
    canGoNext,
    canGoPrev,
    goToCurrentWeek,
    goToNextWeek,
    goToPrevWeek,
  } = useWeekNavigation(activeStudyPeriod);

  // State
  const [showAddPeriod, setShowAddPeriod] = useState(false);
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [showApplyPreset, setShowApplyPreset] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [pendingPeriodData, setPendingPeriodData] = useState<PeriodFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [errorModalData, setErrorModalData] = useState<ErrorModalData>({
    title: "",
    message: "",
    conflictSchedule: null,
  });

  const [periodForm, setPeriodForm] = useState<PeriodFormData>({
    name: "",
    start_date: "",
    end_date: "",
  });

  const [scheduleForm, setScheduleForm] = useState<ScheduleFormData>({
    date: "",
    subject_name: "",
    start_time: "09:00",
    end_time: "10:35",
    room: "",
    color: COLORS[0],
    is_important: false,
  });

  const [applyPresetForm, setApplyPresetForm] = useState<ApplyPresetFormData>({
    preset_id: "",
    start_date: "",
  });

  // Memoized values
  const weekDays = useMemo(() => getWeekDays(currentWeekStart), [currentWeekStart]);

  const weekSchedules = useMemo(() => {
    const start = weekDays[0].toISOString().split("T")[0];
    const end = weekDays[6].toISOString().split("T")[0];
    return schedules
      .filter((s) => s.date >= start && s.date <= end)
      .sort((a, b) => {
        const dateA = new Date(`2000-01-01 ${a.start_time}`);
        const dateB = new Date(`2000-01-01 ${b.start_time}`);
        return dateA.getTime() - dateB.getTime();
      });
  }, [weekDays, schedules]);

  const schedulesByDate = useMemo(() => {
    const grouped: { [key: string]: Schedule[] } = {};
    weekSchedules.forEach((schedule) => {
      if (!grouped[schedule.date]) {
        grouped[schedule.date] = [];
      }
      grouped[schedule.date].push(schedule);
    });
    return grouped;
  }, [weekSchedules]);

  // Handlers
  const handleCreatePeriodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!periodForm.name || !periodForm.start_date || !periodForm.end_date) {
      alert("Заполните все поля");
      return;
    }

    const startYear = new Date(periodForm.start_date).getFullYear();
    const endYear = new Date(periodForm.end_date).getFullYear();
    const currentYear = new Date().getFullYear();
    const prevYear = currentYear - 1;
    const nextYear = currentYear + 1;

    if (startYear < prevYear || startYear > nextYear) {
      alert(`Год начала должен быть ${prevYear}, ${currentYear} или ${nextYear}`);
      return;
    }

    if (endYear < prevYear || endYear > nextYear) {
      alert(`Год окончания должен быть ${prevYear}, ${currentYear} или ${nextYear}`);
      return;
    }

    if (activeStudyPeriod) {
      setPendingPeriodData(periodForm);
      setShowConfirm(true);
      return;
    }

    await createPeriod();
  };

  const createPeriod = async () => {
    try {
      setIsSubmitting(true);

      if (activeStudyPeriod) {
        await deleteStudyPeriod(activeStudyPeriod.id);
      }

      const dataToUse = pendingPeriodData || periodForm;
      await createStudyPeriod({
        name: dataToUse.name,
        start_date: dataToUse.start_date,
        end_date: dataToUse.end_date,
        is_active: true,
        user_id: user!.id,
      });

      setPeriodForm({ name: "", start_date: "", end_date: "" });
      setShowAddPeriod(false);
      goToCurrentWeek();
    } catch (err) {
      console.error("Error:", err);
      alert("Ошибка при создании периода");
    } finally {
      setIsSubmitting(false);
      setShowConfirm(false);
      setPendingPeriodData(null);
    }
  };

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeStudyPeriod) {
      alert("Выберите период обучения");
      return;
    }

    const { overlaps, overlappingSchedule } = checkTimeOverlap(
      schedules,
      scheduleForm.date,
      scheduleForm.start_time,
      scheduleForm.end_time,
      editingSchedule?.id,
    );

    if (overlaps) {
      setErrorModalData({
        title: "Конфликт времени!",
        message: `Нельзя ${editingSchedule ? "сохранить" : "добавить"} пару в это время, так как она пересекается с существующей парой.\n\nПожалуйста, измените время или удалите конфликтующую пару.`,
        conflictSchedule: overlappingSchedule || null,
      });
      setShowErrorModal(true);
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingSchedule) {
        await updateSchedule(editingSchedule.id, {
          subject_name: scheduleForm.subject_name,
          date: scheduleForm.date,
          start_time: scheduleForm.start_time,
          end_time: scheduleForm.end_time,
          room: scheduleForm.room,
          color: scheduleForm.color,
          is_important: scheduleForm.is_important,
        });
      } else {
        await addSchedule({
          user_id: user!.id,
          subject_name: scheduleForm.subject_name,
          date: scheduleForm.date,
          start_time: scheduleForm.start_time,
          end_time: scheduleForm.end_time,
          room: scheduleForm.room,
          color: scheduleForm.color,
          is_important: scheduleForm.is_important,
          study_period_id: activeStudyPeriod.id,
        });
      }

      resetScheduleForm();
      setEditingSchedule(null);
      setShowAddSchedule(false);
    } catch (err) {
      console.error("Error:", err);
      alert(editingSchedule ? "Ошибка при редактировании пары" : "Ошибка при добавлении пары");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetScheduleForm = () => {
    setScheduleForm({
      date: "",
      subject_name: "",
      start_time: "09:00",
      end_time: "10:35",
      room: "",
      color: COLORS[0],
      is_important: false,
    });
  };

  const handleEditSchedule = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setScheduleForm({
      date: schedule.date,
      subject_name: schedule.subject_name,
      start_time: formatTime(schedule.start_time),
      end_time: formatTime(schedule.end_time),
      room: schedule.room || "",
      color: schedule.color || COLORS[0],
      is_important: schedule.is_important || false,
    });
    setShowAddSchedule(true);
  };

  const handleApplyPreset = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!applyPresetForm.preset_id) {
    alert("Выберите шаблон");
    return;
  }

  if (!activeStudyPeriod) {
    alert("Нет активного периода обучения");
    return;
  }

  const preset = presets.find((p) => p.id === Number(applyPresetForm.preset_id));
  if (!preset || !preset.schedules) {
    alert("Шаблон не найден");
    return;
  }

  const startDate = new Date(activeStudyPeriod.start_date);
  const endDate = new Date(activeStudyPeriod.end_date);
  const allDatesInPeriod: string[] = [];
  
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    allDatesInPeriod.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Группируем расписание шаблона по дням недели
  const scheduleByDayOfWeek: { [key: number]: typeof preset.schedules } = {};
  preset.schedules.forEach(schedule => {
    if (!scheduleByDayOfWeek[schedule.day_of_week]) {
      scheduleByDayOfWeek[schedule.day_of_week] = [];
    }
    scheduleByDayOfWeek[schedule.day_of_week].push(schedule);
  });

  // Находим все пары, которые нужно удалить (конфликтующие)
  const schedulesToDelete: Schedule[] = [];
  const schedulesToAdd: Array<{
    date: string;
    subject_name: string;
    start_time: string;
    end_time: string;
    room: string;
    color: string;
    is_important: boolean;
  }> = [];

  // Проверяем все даты в периоде на конфликты и собираем их
  for (const dateStr of allDatesInPeriod) {
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1;
    
    const schedulesForDay = scheduleByDayOfWeek[dayOfWeek];
    if (!schedulesForDay) continue;

    for (const presetSchedule of schedulesForDay) {
      // Находим все существующие пары, которые пересекаются с новой
      const overlappingSchedules = schedules.filter(schedule => 
        schedule.date === dateStr &&
        schedule.id !== editingSchedule?.id && // Исключаем редактируемую пару если есть
        (
          (presetSchedule.start_time >= schedule.start_time && presetSchedule.start_time < schedule.end_time) ||
          (presetSchedule.end_time > schedule.start_time && presetSchedule.end_time <= schedule.end_time) ||
          (presetSchedule.start_time <= schedule.start_time && presetSchedule.end_time >= schedule.end_time)
        )
      );

      // Добавляем конфликтующие пары в список на удаление
      schedulesToDelete.push(...overlappingSchedules);

      // Добавляем новую пару из шаблона
      schedulesToAdd.push({
        date: dateStr,
        subject_name: presetSchedule.subject_name,
        start_time: presetSchedule.start_time,
        end_time: presetSchedule.end_time,
        room: presetSchedule.room || "",
        color: presetSchedule.color || COLORS[0],
        is_important: presetSchedule.is_important || false,
      });
    }
  }

  // Подтверждение от пользователя перед перезаписью
  const deleteCount = schedulesToDelete.length;
  const addCount = schedulesToAdd.length;

  if (deleteCount > 0) {
    const confirmed = confirm(
      `⚠️ Внимание!\n\n` +
      `Применение шаблона "${preset.name}" перезапишет конфликтующие пары.\n\n` +
      `Будет удалено: ${deleteCount} существующих пар(ы)\n` +
      `Будет добавлено: ${addCount} новых пар(ы)\n\n` +
      `Вы уверены, что хотите продолжить?`
    );
    
    if (!confirmed) {
      return;
    }
  }

  try {
    setIsSubmitting(true);
    
    for (const scheduleToDelete of schedulesToDelete) {
      await deleteSchedule(scheduleToDelete.id);
    }
    
    for (const scheduleToAdd of schedulesToAdd) {
      await addSchedule({
        user_id: user!.id,
        ...scheduleToAdd,
        study_period_id: activeStudyPeriod.id,
      });
    }
    
    setApplyPresetForm({ preset_id: "", start_date: "" });
    setShowApplyPreset(false);
    

  } catch (err) {
    console.error("Error:", err);
    alert("Ошибка при применении шаблона");
  } finally {
    setIsSubmitting(false);
  }
};

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Загрузка расписания...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600 dark:text-gray-400">Пожалуйста, войдите в аккаунт</p>
      </div>
    );
  }

  return (
    <div className=" sm:p-8 transition-colors mx-auto space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Расписание
          </h2>
          {activeStudyPeriod ? (
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              {activeStudyPeriod.name} (
              {new Date(activeStudyPeriod.start_date).toLocaleDateString("ru-RU")} -{" "}
              {new Date(activeStudyPeriod.end_date).toLocaleDateString("ru-RU")})
            </p>
          ) : (
            <p className="text-amber-600 dark:text-amber-400 text-sm sm:text-base font-medium">
              Создайте период обучения
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={() => setShowAddPeriod(true)}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm sm:text-base transition"
          >
            <Plus className="h-4 w-4" />
            Новый период
          </button>
          {activeStudyPeriod && presets.length > 0 && (
            <button
              onClick={() => setShowApplyPreset(true)}
              className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm sm:text-base transition"
            >
              <Copy className="h-4 w-4" />
              Применить шаблон
            </button>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddPeriodModal
        isOpen={showAddPeriod}
        onClose={() => setShowAddPeriod(false)}
        onSubmit={handleCreatePeriodSubmit}
        isSubmitting={isSubmitting}
        formData={periodForm}
        onFormChange={setPeriodForm}
      />

      <AddScheduleModal
        isOpen={showAddSchedule}
        onClose={() => {
          setShowAddSchedule(false);
          setEditingSchedule(null);
          resetScheduleForm();
        }}
        onSubmit={handleAddSchedule}
        isSubmitting={isSubmitting}
        activeStudyPeriod={activeStudyPeriod}
        formData={scheduleForm}
        onFormChange={setScheduleForm}
        editingId={editingSchedule?.id}
        timings={timings}
      />

      <ApplyPresetModal
        isOpen={showApplyPreset}
        onClose={() => setShowApplyPreset(false)}
        onSubmit={handleApplyPreset}
        isSubmitting={isSubmitting}
        formData={{ ...applyPresetForm, presets }}
        onFormChange={setApplyPresetForm}
        activeStudyPeriod={activeStudyPeriod}
      />

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => {
          setShowConfirm(false);
          setPendingPeriodData(null);
        }}
        onConfirm={createPeriod}
        title="Внимание!"
        message={`У вас уже есть активный период обучения "${activeStudyPeriod?.name}". При создании нового периода старый период и все его пары будут УДАЛЕНЫ. Вы уверены, что хотите продолжить?`}
      />

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title={errorModalData.title}
        message={errorModalData.message}
        conflictSchedule={errorModalData.conflictSchedule}
      />

      {/* No Period Warning */}
      {!activeStudyPeriod && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 mb-6 text-center">
          <p className="text-amber-800 dark:text-amber-200 font-medium">
            Создайте период обучения для начала работы с расписанием
          </p>
        </div>
      )}

      {/* Week Schedule */}
      {activeStudyPeriod && (
        <>
          <WeekNavigation
            currentWeekStart={currentWeekStart}
            canGoPrev={canGoPrev()}
            canGoNext={canGoNext()}
            onPrev={goToPrevWeek}
            onNext={goToNextWeek}
            onCurrent={goToCurrentWeek}
            weekDays={weekDays}
          />

          <WeekSchedule
            weekDays={weekDays}
            schedulesByDate={schedulesByDate}
            onAddSchedule={(date) => {
              setEditingSchedule(null);
              setScheduleForm({
                date,
                subject_name: "",
                start_time: "09:00",
                end_time: "10:35",
                room: "",
                color: COLORS[0],
                is_important: false,
              });
              setShowAddSchedule(true);
            }}
            onEditSchedule={handleEditSchedule}
            onDeleteSchedule={deleteSchedule}
          />
        </>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 font-medium">Ошибка: {error}</p>
        </div>
      )}
    </div>
  );
}