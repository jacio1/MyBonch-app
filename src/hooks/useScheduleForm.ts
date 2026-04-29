import { useState, useCallback } from "react";
import { Timing } from "@/src/types";
import { SCHEDULE_COLORS } from "../components/features/schedule/constants";

interface ScheduleFormState {
  day_of_week: number;
  subject_name: string;
  start_time: string;
  end_time: string;
  room: string;
  color: string;
  is_important: boolean;
}

const initialScheduleForm: ScheduleFormState = {
  day_of_week: 0,
  subject_name: "",
  start_time: "",
  end_time: "",
  room: "",
  color: SCHEDULE_COLORS[0],
  is_important: false,
};

export function useScheduleForm(defaultTimings: Timing[]) {
  const [form, setForm] = useState<ScheduleFormState>(initialScheduleForm);

  const resetForm = useCallback((day: number = 0) => {
    const firstTiming = defaultTimings[0];
    setForm({
      ...initialScheduleForm,
      day_of_week: day,
      start_time: firstTiming?.start_time || "",
      end_time: firstTiming?.end_time || "",
    });
  }, [defaultTimings]);

  const updateField = useCallback(<K extends keyof ScheduleFormState>(
    field: K,
    value: ScheduleFormState[K]
  ) => {
    setForm(prev => ({ ...prev, [field]: value }));
  }, []);

  const setTiming = useCallback((timing: Timing) => {
    setForm(prev => ({
      ...prev,
      start_time: timing.start_time,
      end_time: timing.end_time,
    }));
  }, []);

  return {
    form,
    resetForm,
    updateField,
    setTiming,
    setForm,
  };
}