import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Plus, Loader2 } from "lucide-react";
import type { Habit } from "../types/habit";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const habitSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  frequency: z.enum(["daily", "weekly", "monthly"]),
});

type HabitFormData = z.infer<typeof habitSchema>;

interface AddHabitModalProps {
  onHabitAdded: (habit: Habit) => void;
}

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.1,
    },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export default function AddHabitModal({ onHabitAdded }: AddHabitModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      title: "",
      description: "",
      frequency: "daily",
    },
  });

  const onSubmit = async (data: HabitFormData) => {
    if (!user) return;

    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, "habits"), {
        ...data,
        userId: user.uid,
        createdAt: new Date(),
        streak: 0,
      });

      const newHabit: Habit = {
        id: docRef.id,
        ...data,
        userId: user.uid,
        createdAt: new Date(),
        streak: 0,
      };

      onHabitAdded(newHabit);
      setIsOpen(false);
      reset();
    } catch (error) {
      console.error("Error adding habit:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (isDirty) {
        const confirmClose = window.confirm(
          "You have unsaved changes. Are you sure you want to close?"
        );
        if (!confirmClose) return;
      }
      reset();
      setIsOpen(open);
    } else {
      setIsOpen(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" size="lg">
          <Plus className="size-4" />
          Add Habit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-neutral-900 dark:text-white">
            Add New Habit
          </DialogTitle>
        </DialogHeader>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 py-6"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fieldVariants} className="space-y-3">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Title
            </label>
            <input
              {...register("title")}
              type="text"
              id="title"
              placeholder="Enter habit title"
              className="block w-full px-4 py-3 rounded-xl border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white text-base transition-all duration-200 hover:border-primary-400 focus:ring-2 focus:ring-primary-500/20 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            />
            <AnimatePresence>
              {errors.title && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-sm text-error-600 dark:text-error-400 mt-1"
                >
                  {errors.title.message}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={fieldVariants} className="space-y-3">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Description
            </label>
            <textarea
              {...register("description")}
              id="description"
              placeholder="Add a description for your habit"
              rows={4}
              className="block w-full px-4 py-3 rounded-xl border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-neutral-800 dark:border-neutral-700 dark:text-white text-base transition-all duration-200 hover:border-primary-400 focus:ring-2 focus:ring-primary-500/20 resize-none placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
            />
          </motion.div>

          <motion.div variants={fieldVariants} className="space-y-3">
            <label
              htmlFor="frequency"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Frequency
            </label>
            <Select {...register("frequency")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <DialogFooter className="gap-3 pt-4 border-none">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Habit"
              )}
            </Button>
          </DialogFooter>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
}
