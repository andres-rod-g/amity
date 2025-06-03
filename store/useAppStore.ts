import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, Note, CalendarEvent, MenstrualCycle, MenstrualSettings, AppState } from '@/types';

interface AppStoreState extends AppState {
  // Acciones para tareas
  addTask: (title: string, description: string, dueDate?: Date) => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  
  // Acciones para notas
  addNote: (content: string) => void;
  deleteNote: (noteId: string) => void;
  updateNote: (noteId: string, content: string) => void;
  
  // Acciones para eventos del calendario
  addCalendarEvent: (title: string, description: string, date: string, time?: string) => void;
  deleteCalendarEvent: (eventId: string) => void;
  updateCalendarEvent: (eventId: string, updates: Partial<CalendarEvent>) => void;
  
  // Acciones para ciclo menstrual
  addMenstrualCycle: (startDate: string, symptoms: string[], mood: MenstrualCycle['mood'], flow: MenstrualCycle['flow'], notes?: string) => void;
  endMenstrualCycle: (cycleId: string, endDate: string) => void;
  updateMenstrualCycle: (cycleId: string, updates: Partial<MenstrualCycle>) => void;
  deleteMenstrualCycle: (cycleId: string) => void;
  updateMenstrualSettings: (settings: Partial<MenstrualSettings>) => void;
  getPredictedNextPeriod: () => string | null;
  getCurrentCycleDay: () => number | null;
  isInPeriod: (date: string) => boolean;
  isPredictedPeriod: (date: string) => boolean;
  isPredictedOvulation: (date: string) => boolean;
  
  // Acciones para autenticación
  login: (userName: string) => void;
  logout: () => void;
  
  // Acción para actualizar estadísticas
  updateStats: () => void;
  
  // Acción para reiniciar la app
  resetApp: () => void;
}

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const initialState: AppState = {
  isAuthenticated: false,
  userName: '',
  tasks: [],
  notes: [],
  calendarEvents: [],
  menstrualCycles: [],
  menstrualSettings: {
    averageCycleLength: 28,
    averagePeriodLength: 5,
    trackingEnabled: true,
    remindersEnabled: true,
  },
  stats: {
    completedTasks: 0,
    pendingTasks: 0,
    productivityPercentage: 0,
  },
};

export const useAppStore = create<AppStoreState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Acciones para tareas
      addTask: (title: string, description: string, dueDate?: Date) => {
        const newTask: Task = {
          id: generateId(),
          title,
          description,
          completed: false,
          createdAt: new Date(),
          dueDate,
        };
        
        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));
        
        get().updateStats();
      },
      
      toggleTask: (taskId: string) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          ),
        }));
        
        get().updateStats();
      },
      
      deleteTask: (taskId: string) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        }));
        
        get().updateStats();
      },
      
      updateTask: (taskId: string, updates: Partial<Task>) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        }));
        
        get().updateStats();
      },
      
      // Acciones para notas
      addNote: (content: string) => {
        const newNote: Note = {
          id: generateId(),
          content,
          createdAt: new Date(),
        };
        
        set((state) => ({
          notes: [...state.notes, newNote],
        }));
      },
      
      deleteNote: (noteId: string) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== noteId),
        }));
      },
      
      updateNote: (noteId: string, content: string) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === noteId ? { ...note, content } : note
          ),
        }));
      },
      
      // Acciones para eventos del calendario
      addCalendarEvent: (title: string, description: string, date: string, time?: string) => {
        const newEvent: CalendarEvent = {
          id: generateId(),
          title,
          description,
          date,
          time,
        };
        
        set((state) => ({
          calendarEvents: [...state.calendarEvents, newEvent],
        }));
      },
      
      deleteCalendarEvent: (eventId: string) => {
        set((state) => ({
          calendarEvents: state.calendarEvents.filter((event) => event.id !== eventId),
        }));
      },
      
      updateCalendarEvent: (eventId: string, updates: Partial<CalendarEvent>) => {
        set((state) => ({
          calendarEvents: state.calendarEvents.map((event) =>
            event.id === eventId ? { ...event, ...updates } : event
          ),
        }));
      },
      
      // Acciones para autenticación
      login: (userName: string) => {
        set({
          isAuthenticated: true,
          userName,
        });
      },
      
      logout: () => {
        set({
          isAuthenticated: false,
          userName: '',
        });
      },
      
      // Actualizar estadísticas
      updateStats: () => {
        const { tasks } = get();
        const completedTasks = tasks.filter((task) => task.completed).length;
        const pendingTasks = tasks.filter((task) => !task.completed).length;
        const totalTasks = tasks.length;
        const productivityPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
        
        set({
          stats: {
            completedTasks,
            pendingTasks,
            productivityPercentage,
          },
        });
      },
      
      // Acciones para ciclo menstrual
      addMenstrualCycle: (startDate: string, symptoms: string[], mood: MenstrualCycle['mood'], flow: MenstrualCycle['flow'], notes?: string) => {
        const { menstrualSettings } = get();
        const newCycle: MenstrualCycle = {
          id: generateId(),
          startDate,
          symptoms,
          mood,
          flow,
          notes,
          cycleLength: menstrualSettings.averageCycleLength,
          periodLength: menstrualSettings.averagePeriodLength,
          createdAt: new Date(),
        };
        
        set((state) => ({
          menstrualCycles: [...state.menstrualCycles, newCycle],
          menstrualSettings: {
            ...state.menstrualSettings,
            lastPeriodDate: startDate,
          },
        }));
      },
      
      endMenstrualCycle: (cycleId: string, endDate: string) => {
        set((state) => ({
          menstrualCycles: state.menstrualCycles.map((cycle) => {
            if (cycle.id === cycleId) {
              const start = new Date(cycle.startDate);
              const end = new Date(endDate);
              const periodLength = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
              return { ...cycle, endDate, periodLength };
            }
            return cycle;
          }),
        }));
      },
      
      updateMenstrualCycle: (cycleId: string, updates: Partial<MenstrualCycle>) => {
        set((state) => ({
          menstrualCycles: state.menstrualCycles.map((cycle) =>
            cycle.id === cycleId ? { ...cycle, ...updates } : cycle
          ),
        }));
      },
      
      deleteMenstrualCycle: (cycleId: string) => {
        set((state) => ({
          menstrualCycles: state.menstrualCycles.filter((cycle) => cycle.id !== cycleId),
        }));
      },
      
      updateMenstrualSettings: (settings: Partial<MenstrualSettings>) => {
        set((state) => ({
          menstrualSettings: { ...state.menstrualSettings, ...settings },
        }));
      },
      
      getPredictedNextPeriod: () => {
        const { menstrualCycles, menstrualSettings } = get();
        if (menstrualCycles.length === 0) return null;
        
        const lastCycle = menstrualCycles[menstrualCycles.length - 1];
        const lastPeriodDate = new Date(lastCycle.startDate);
        const nextPeriodDate = new Date(lastPeriodDate);
        nextPeriodDate.setDate(lastPeriodDate.getDate() + menstrualSettings.averageCycleLength);
        
        return nextPeriodDate.toISOString().split('T')[0];
      },
      
      getCurrentCycleDay: () => {
        const { menstrualCycles } = get();
        if (menstrualCycles.length === 0) return null;
        
        const lastCycle = menstrualCycles[menstrualCycles.length - 1];
        const today = new Date();
        const cycleStart = new Date(lastCycle.startDate);
        const daysDiff = Math.ceil((today.getTime() - cycleStart.getTime()) / (1000 * 60 * 60 * 24));
        
        return daysDiff > 0 ? daysDiff : 1;
      },
      
      isInPeriod: (date: string) => {
        const { menstrualCycles } = get();
        const checkDate = new Date(date);
        
        return menstrualCycles.some(cycle => {
          const startDate = new Date(cycle.startDate);
          const endDate = cycle.endDate ? new Date(cycle.endDate) : new Date(startDate.getTime() + (cycle.periodLength - 1) * 24 * 60 * 60 * 1000);
          
          return checkDate >= startDate && checkDate <= endDate;
        });
      },
      
      isPredictedPeriod: (date: string) => {
        const predictedStart = get().getPredictedNextPeriod();
        if (!predictedStart) return false;
        
        const { menstrualSettings } = get();
        const checkDate = new Date(date);
        const startDate = new Date(predictedStart);
        const endDate = new Date(startDate.getTime() + (menstrualSettings.averagePeriodLength - 1) * 24 * 60 * 60 * 1000);
        
        return checkDate >= startDate && checkDate <= endDate;
      },
      
      isPredictedOvulation: (date: string) => {
        const predictedStart = get().getPredictedNextPeriod();
        if (!predictedStart) return false;
        
        const { menstrualSettings } = get();
        const checkDate = new Date(date);
        const ovulationDate = new Date(predictedStart);
        ovulationDate.setDate(ovulationDate.getDate() - 14); // Ovulación típicamente 14 días antes del próximo período
        
        // Ventana de fertilidad de 3 días (1 día antes, día de ovulación, 1 día después)
        const ovulationStart = new Date(ovulationDate.getTime() - 24 * 60 * 60 * 1000);
        const ovulationEnd = new Date(ovulationDate.getTime() + 24 * 60 * 60 * 1000);
        
        return checkDate >= ovulationStart && checkDate <= ovulationEnd;
      },
      
      // Reiniciar la app
      resetApp: () => {
        set(initialState);
      },
    }),
    {
      name: 'amity-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userName: state.userName,
        tasks: state.tasks,
        notes: state.notes,
        calendarEvents: state.calendarEvents,
        menstrualCycles: state.menstrualCycles,
        menstrualSettings: state.menstrualSettings,
        stats: state.stats,
      }),
    }
  )
);
