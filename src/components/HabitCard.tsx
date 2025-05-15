import { motion } from "framer-motion";
import type { Habit } from "../types/habit";

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
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 hover:shadow-md transition-all duration-200 border border-surface-200"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-primary-600">
            {habit.title}
          </h3>
          {habit.description && (
            <p className="mt-1 text-sm text-surface-300">{habit.description}</p>
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onComplete(habit.id)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-primary-500 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
        >
          Complete
        </motion.button>
      </div>
    </motion.div>
  );
}
