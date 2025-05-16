import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { Link, Outlet } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

export default function Layout() {
  const { user, signOut } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-neutral-50 dark:bg-neutral-900"
    >
      <header className="bg-white dark:bg-neutral-800 shadow-sm border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/dashboard">
              <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                True Habits
              </h1>
            </Link>

            <div className="flex items-center space-x-4">
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center space-x-3 outline-none focus:outline-none hover:opacity-80 transition-opacity">
                    <img
                      src={
                        user.photoURL ||
                        `https://ui-avatars.com/api/?name=${
                          user.displayName || user.email
                        }&background=random`
                      }
                      alt={user.displayName || user.email || "User"}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-700"
                    />
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
                      {user.displayName || user.email}
                    </span>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={signOut}
                      className="cursor-pointer text-destructive font-medium"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </motion.div>
  );
}
