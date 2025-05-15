import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";
import type { Habit } from "../types/habit";

const habitsCollection = collection(db, "habits");
const completionsCollection = collection(db, "completions");

export const habitService = {
  async createHabit(habit: Omit<Habit, "id" | "createdAt" | "streak">) {
    const docRef = await addDoc(habitsCollection, {
      ...habit,
      streak: 0,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  async getHabits(userId: string) {
    const q = query(habitsCollection, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
      lastCompleted: doc.data().lastCompleted?.toDate(),
    })) as Habit[];
  },

  async completeHabit(habitId: string, userId: string) {
    const habitRef = doc(db, "habits", habitId);
    const habitDoc = await getDocs(
      query(habitsCollection, where("id", "==", habitId))
    );
    const habit = habitDoc.docs[0].data() as Habit;

    await addDoc(completionsCollection, {
      habitId,
      userId,
      completedAt: serverTimestamp(),
    });

    await updateDoc(habitRef, {
      streak: habit.streak + 1,
      lastCompleted: serverTimestamp(),
    });
  },
};
