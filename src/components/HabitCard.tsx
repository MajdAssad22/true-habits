import { motion } from "framer-motion";
import type { Habit } from "../types/habit";
import { Button } from "./ui/button";

interface HabitCardProps {
  habit: Habit;
  onComplete: (habitId: string) => void;
}

export default function HabitCard({ habit, onComplete }: HabitCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.02 }}
      className="dark:bg-neutral-800 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-200 "
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-primary-600">
            {habit.title}
          </h3>
          {habit.description && (
            <p className="mt-1 text-sm">{habit.description}</p>
          )}
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-600">
          {habit.frequency}
        </span>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-surface-300">Streak:</span>
          <span className="text-sm font-medium text-primary-600">
            {habit.streak}
          </span>
        </div>
        <Button onClick={() => onComplete(habit.id)}>Complete</Button>
      </div>
    </motion.div>
  );
}
