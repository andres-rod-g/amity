export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
}

export interface Note {
  id: string;
  content: string;
  createdAt: Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
}

export interface MenstrualCycle {
  id: string;
  startDate: string;
  endDate?: string;
  cycleLength: number;
  periodLength: number;
  symptoms: string[];
  mood: 'muy_bien' | 'bien' | 'normal' | 'mal' | 'muy_mal';
  flow: 'muy_ligero' | 'ligero' | 'normal' | 'abundante' | 'muy_abundante';
  notes?: string;
  createdAt: Date;
}

export interface MenstrualSettings {
  averageCycleLength: number;
  averagePeriodLength: number;
  lastPeriodDate?: string;
  trackingEnabled: boolean;
  remindersEnabled: boolean;
}

export interface AppState {
  // Usuario
  isAuthenticated: boolean;
  userName: string;
  
  // Tareas
  tasks: Task[];
  
  // Notas
  notes: Note[];
  
  // Eventos del calendario
  calendarEvents: CalendarEvent[];
  
  // Ciclo menstrual
  menstrualCycles: MenstrualCycle[];
  menstrualSettings: MenstrualSettings;
  
  // Estadísticas
  stats: {
    completedTasks: number;
    pendingTasks: number;
    productivityPercentage: number;
  };
}
