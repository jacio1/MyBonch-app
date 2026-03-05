// 'use client';

// import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
// import { useDatabase } from './useDatabase';
// import { useAuth } from './AuthContext';
// import { Assignment, Note, Subject } from '@/src/types';

// // Кеш для хранения данных между вызовами
// const dataCache = {
//   userId: null as string | null,
//   subjects: null as Subject[] | null,
//   assignments: null as Assignment[] | null,
//   notes: null as Note[] | null,
//   lastFetch: 0,
//   isFetching: false,
// };

// export function useLocalData() {
//   const { user } = useAuth();
//   const db = useDatabase();

//   const [subjects, setSubjects] = useState<Subject[]>([]);
//   const [assignments, setAssignments] = useState<Assignment[]>([]);
//   const [notes, setNotes] = useState<Note[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const isMountedRef = useRef(true);

//   // Загрузка данных ТОЛЬКО при изменении user, и только если кеш инвалиден
//   useEffect(() => {
//     isMountedRef.current = true;

//     return () => {
//       isMountedRef.current = false;
//     };
//   }, []);

//   useEffect(() => {
//     if (!user) {
//       // Очищаем кеш если пользователь вышел
//       dataCache.userId = null;
//       dataCache.subjects = null;
//       dataCache.assignments = null;
//       dataCache.notes = null;
      
//       setSubjects([]);
//       setAssignments([]);
//       setNotes([]);
//       setLoading(false);
//       return;
//     }

//     // Если уже загружали для этого пользователя и прошло меньше 30 сек - используем кеш
//     const now = Date.now();
//     const cacheValid =
//       dataCache.userId === user.id &&
//       dataCache.subjects !== null &&
//       dataCache.assignments !== null &&
//       dataCache.notes !== null &&
//       now - dataCache.lastFetch < 30000; // 30 секунд кеша

//     if (cacheValid && !dataCache.isFetching) {
//       console.log('📦 Используем кешированные данные');
//       if (isMountedRef.current) {
//         setSubjects(dataCache.subjects!);
//         setAssignments(dataCache.assignments!);
//         setNotes(dataCache.notes!);
//         setLoading(false);
//       }
//       return;
//     }

//     // Если уже идет загрузка - не запускаем снова
//     if (dataCache.isFetching) {
//       console.log('⏳ Загрузка уже в процессе, ждем...');
//       return;
//     }

//     const loadData = async () => {
//       try {
//         dataCache.isFetching = true;
//         if (isMountedRef.current) {
//           setLoading(true);
//         }
//         setError(null);

//         console.log('🔄 Загружаем данные для user:', user.id);

//         const [subjectsData, assignmentsData, notesData] = await Promise.all([
//           db.getSubjects(),
//           db.getAssignments(),
//           db.getNotes(),
//         ]);

//         if (isMountedRef.current) {
//           // Кешируем результаты
//           dataCache.userId = user.id;
//           dataCache.subjects = subjectsData;
//           dataCache.assignments = assignmentsData;
//           dataCache.notes = notesData;
//           dataCache.lastFetch = Date.now();

//           setSubjects(subjectsData);
//           setAssignments(assignmentsData);
//           setNotes(notesData);
//           console.log('✅ Данные загружены успешно');
//         }
//       } catch (err) {
//         if (isMountedRef.current) {
//           const message = err instanceof Error ? err.message : 'Ошибка загрузки данных';
//           setError(message);
//           console.error('❌ Error loading data:', err);
//         }
//       } finally {
//         dataCache.isFetching = false;
//         if (isMountedRef.current) {
//           setLoading(false);
//         }
//       }
//     };

//     loadData();
//   }, [user, db]);

//   // Функции с useCallback для мемоизации
//   const addSubjectLocal = useCallback(
//     async (subject: Omit<Subject, 'id'>) => {
//       try {
//         const newSubject = await db.addSubject(subject);
//         setSubjects((prev) => [...prev, newSubject]);
//         // Инвалидируем кеш
//         dataCache.lastFetch = 0;
//         return newSubject;
//       } catch (err) {
//         const message = err instanceof Error ? err.message : 'Ошибка добавления предмета';
//         setError(message);
//         throw err;
//       }
//     },
//     [db]
//   );

//   const updateSubjectLocal = useCallback(
//     async (id: number, subject: Partial<Subject>) => {
//       try {
//         const updated = await db.updateSubject(id, subject);
//         setSubjects((prev) => prev.map((s) => (s.id === id ? updated : s)));
//         // Инвалидируем кеш
//         dataCache.lastFetch = 0;
//         return updated;
//       } catch (err) {
//         const message = err instanceof Error ? err.message : 'Ошибка обновления предмета';
//         setError(message);
//         throw err;
//       }
//     },
//     [db]
//   );

//   const deleteSubjectLocal = useCallback(
//     async (id: number) => {
//       try {
//         await db.deleteSubject(id);
//         setSubjects((prev) => prev.filter((s) => s.id !== id));
//         // Инвалидируем кеш
//         dataCache.lastFetch = 0;
//       } catch (err) {
//         const message = err instanceof Error ? err.message : 'Ошибка удаления предмета';
//         setError(message);
//         throw err;
//       }
//     },
//     [db]
//   );

//   const addAssignmentLocal = useCallback(
//     async (assignment: Omit<Assignment, 'id'>) => {
//       try {
//         const newAssignment = await db.addAssignment(assignment);
//         setAssignments((prev) => [...prev, newAssignment]);
//         dataCache.lastFetch = 0;
//         return newAssignment;
//       } catch (err) {
//         const message = err instanceof Error ? err.message : 'Ошибка добавления задания';
//         setError(message);
//         throw err;
//       }
//     },
//     [db]
//   );

//   const updateAssignmentLocal = useCallback(
//     async (id: number, assignment: Partial<Assignment>) => {
//       try {
//         const updated = await db.updateAssignment(id, assignment);
//         setAssignments((prev) => prev.map((a) => (a.id === id ? updated : a)));
//         dataCache.lastFetch = 0;
//         return updated;
//       } catch (err) {
//         const message = err instanceof Error ? err.message : 'Ошибка обновления задания';
//         setError(message);
//         throw err;
//       }
//     },
//     [db]
//   );

//   const deleteAssignmentLocal = useCallback(
//     async (id: number) => {
//       try {
//         await db.deleteAssignment(id);
//         setAssignments((prev) => prev.filter((a) => a.id !== id));
//         dataCache.lastFetch = 0;
//       } catch (err) {
//         const message = err instanceof Error ? err.message : 'Ошибка удаления задания';
//         setError(message);
//         throw err;
//       }
//     },
//     [db]
//   );

//   const addNoteLocal = useCallback(
//     async (note: Omit<Note, 'id'>) => {
//       try {
//         const newNote = await db.addNote(note);
//         setNotes((prev) => [...prev, newNote]);
//         dataCache.lastFetch = 0;
//         return newNote;
//       } catch (err) {
//         const message = err instanceof Error ? err.message : 'Ошибка добавления заметки';
//         setError(message);
//         throw err;
//       }
//     },
//     [db]
//   );

//   const updateNoteLocal = useCallback(
//     async (id: number, note: Partial<Note>) => {
//       try {
//         const updated = await db.updateNote(id, note);
//         setNotes((prev) => prev.map((n) => (n.id === id ? updated : n)));
//         dataCache.lastFetch = 0;
//         return updated;
//       } catch (err) {
//         const message = err instanceof Error ? err.message : 'Ошибка обновления заметки';
//         setError(message);
//         throw err;
//       }
//     },
//     [db]
//   );

//   const deleteNoteLocal = useCallback(
//     async (id: number) => {
//       try {
//         await db.deleteNote(id);
//         setNotes((prev) => prev.filter((n) => n.id !== id));
//         dataCache.lastFetch = 0;
//       } catch (err) {
//         const message = err instanceof Error ? err.message : 'Ошибка удаления заметки';
//         setError(message);
//         throw err;
//       }
//     },
//     [db]
//   );

//   // Мемоизируем возвращаемый объект
//   return useMemo(
//     () => ({
//       subjects,
//       assignments,
//       notes,
//       loading,
//       error,
//       addSubject: addSubjectLocal,
//       updateSubject: updateSubjectLocal,
//       deleteSubject: deleteSubjectLocal,
//       addAssignment: addAssignmentLocal,
//       updateAssignment: updateAssignmentLocal,
//       deleteAssignment: deleteAssignmentLocal,
//       addNote: addNoteLocal,
//       updateNote: updateNoteLocal,
//       deleteNote: deleteNoteLocal,
//     }),
//     [
//       subjects,
//       assignments,
//       notes,
//       loading,
//       error,
//       addSubjectLocal,
//       updateSubjectLocal,
//       deleteSubjectLocal,
//       addAssignmentLocal,
//       updateAssignmentLocal,
//       deleteAssignmentLocal,
//       addNoteLocal,
//       updateNoteLocal,
//       deleteNoteLocal,
//     ]
//   );
// }