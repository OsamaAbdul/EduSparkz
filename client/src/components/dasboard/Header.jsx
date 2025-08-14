import { Button } from "@/components/ui/button";
import { Menu, User } from 'lucide-react';
import { useUser } from "../../context/useContext.jsx";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export const Header = ({ toggleSidebar }) => {
  const { user } = useUser();

    // == greet user ===

    const getGreetings = () => {
    const formatter = new Intl.DateTimeFormat("en-NG", {
      hour: "numeric",
      hour12: false,
      timeZone: "Africa/Lagos",
    });

    const hour = Number(formatter.format(new Date()));

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };





  return (
    <header className="bg-black/30 backdrop-blur-xl border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="text-white hover:bg-white/10"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-white">{getGreetings()}, {user.name}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white">
                <User className="w-5 h-5 mr-2" />
                Profile
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>User Profile</AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="space-y-2 text-left text-sm text-black dark:text-white">
                    <p><strong>Name:</strong> {user?.name || "N/A"}</p>
                    <p><strong>Email:</strong> {user?.email || "N/A"}</p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </header>
  );
};
