import { useState, useEffect } from "react";
import Layout from "./components/Layout";
import HabitCard from "./components/HabitCard";
import Login from "./pages/Login";
import type { Habit } from "./types/habit";
import { useAuth } from "./contexts/AuthContext";
import { habitService } from "./services/habitService";

function App() {
  const { user, signOut } = useAuth();
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

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Your Habits</h2>
          <div className="flex gap-4">
            <button
              onClick={signOut}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign Out
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Add New Habit
            </button>
          </div>
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
    </Layout>
  );
}

export default App;
