import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { Habit } from "../types/habit";
import { habitService } from "../services/habitService";
import HabitCard from "../components/HabitCard";
import AddHabitModal from "../components/AddHabitModal";

const Dashboard = () => {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    if (user) {
      habitService.getHabits(user.uid).then(setHabits);
    }
  }, [user]);

  const handleCompleteHabit = async (habitId: string) => {
    if (!user) return;

    await habitService.completeHabit(habitId, user.uid);
    setHabits(
      habits.map((habit) =>
        habit.id === habitId
          ? { ...habit, streak: habit.streak + 1, lastCompleted: new Date() }
          : habit
      )
    );
  };

  const handleAddHabit = (newHabit: Habit) => {
    setHabits([...habits, newHabit]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-surface-800">Your Habits</h2>
        <AddHabitModal onHabitAdded={handleAddHabit} />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onComplete={handleCompleteHabit}
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
