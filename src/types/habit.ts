export interface Habit {
  id: string;
  title: string;
  description?: string;
  frequency: "daily" | "weekly" | "monthly";
  createdAt: Date;
  userId: string;
  streak: number;
  lastCompleted?: Date | null;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  completedAt: Date;
  userId: string;
}
