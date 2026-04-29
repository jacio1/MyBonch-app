import { useState, useCallback, useMemo } from 'react';
import { StudyPeriod } from '@/src/types';
import { getCurrentWeekStart } from '@/src/utils/schedule';

export const useWeekNavigation = (activeStudyPeriod: StudyPeriod | null) => {
  const getInitialWeekStart = useMemo(() => {
    if (!activeStudyPeriod) return getCurrentWeekStart();

    let currentWeekDate = getCurrentWeekStart();
    const weekEnd = new Date(currentWeekDate);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const weekStartDate = currentWeekDate.toISOString().split('T')[0];

    if (weekEnd.toISOString().split('T')[0] < activeStudyPeriod.start_date) {
      currentWeekDate = new Date(activeStudyPeriod.start_date);
      const startDay = currentWeekDate.getDay();
      const startDiff = currentWeekDate.getDate() - (startDay === 0 ? 6 : startDay - 1);
      currentWeekDate = new Date(currentWeekDate.setDate(startDiff));
    } else if (weekStartDate > activeStudyPeriod.end_date) {
      currentWeekDate = new Date(activeStudyPeriod.end_date);
      const endDay = currentWeekDate.getDay();
      const endDiff = currentWeekDate.getDate() - (endDay === 0 ? 6 : endDay - 1);
      currentWeekDate = new Date(currentWeekDate.setDate(endDiff));
    }

    return currentWeekDate;
  }, [activeStudyPeriod]);

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(getInitialWeekStart);

  const goToCurrentWeek = useCallback(() => {
    if (!activeStudyPeriod) return;

    let currentWeekDate = getCurrentWeekStart();
    const weekEnd = new Date(currentWeekDate);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const weekStartDate = currentWeekDate.toISOString().split('T')[0];

    if (weekEnd.toISOString().split('T')[0] < activeStudyPeriod.start_date) {
      currentWeekDate = new Date(activeStudyPeriod.start_date);
      const startDay = currentWeekDate.getDay();
      const startDiff = currentWeekDate.getDate() - (startDay === 0 ? 6 : startDay - 1);
      currentWeekDate = new Date(currentWeekDate.setDate(startDiff));
    } else if (weekStartDate > activeStudyPeriod.end_date) {
      currentWeekDate = new Date(activeStudyPeriod.end_date);
      const endDay = currentWeekDate.getDay();
      const endDiff = currentWeekDate.getDate() - (endDay === 0 ? 6 : endDay - 1);
      currentWeekDate = new Date(currentWeekDate.setDate(endDiff));
    }

    setCurrentWeekStart(currentWeekDate);
  }, [activeStudyPeriod]);

  const canGoNext = useCallback((): boolean => {
    if (!activeStudyPeriod) return false;
    const nextWeekStart = new Date(currentWeekStart);
    nextWeekStart.setDate(nextWeekStart.getDate() + 7);
    return nextWeekStart.toISOString().split('T')[0] <= activeStudyPeriod.end_date;
  }, [activeStudyPeriod, currentWeekStart]);

  const canGoPrev = useCallback((): boolean => {
    if (!activeStudyPeriod) return false;
    const prevWeekStart = new Date(currentWeekStart);
    prevWeekStart.setDate(prevWeekStart.getDate() - 7);
    const prevWeekEnd = new Date(prevWeekStart);
    prevWeekEnd.setDate(prevWeekEnd.getDate() + 6);
    return prevWeekEnd.toISOString().split('T')[0] >= activeStudyPeriod.start_date;
  }, [activeStudyPeriod, currentWeekStart]);

  const goToNextWeek = useCallback(() => {
    if (!canGoNext()) return;
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekStart(newDate);
  }, [canGoNext, currentWeekStart]);

  const goToPrevWeek = useCallback(() => {
    if (!canGoPrev()) return;
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekStart(newDate);
  }, [canGoPrev, currentWeekStart]);

  return {
    currentWeekStart,
    setCurrentWeekStart,
    canGoNext,
    canGoPrev,
    goToCurrentWeek,
    goToNextWeek,
    goToPrevWeek,
  };
};