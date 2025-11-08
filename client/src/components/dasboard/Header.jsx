// import { Button } from "@/components/ui/button";
// import { Menu, User } from 'lucide-react';
// import { useUser } from "../../context/useContext.jsx";
// import { ThemeToggle } from "@/components/ThemeToggle";
// import {
//   AlertDialog,
//   AlertDialogTrigger,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogCancel,
// } from "@/components/ui/alert-dialog";

// export const Header = ({ toggleSidebar }) => {
//   const { user } = useUser();

//     // == greet user ===

//     const getGreetings = () => {
//     const formatter = new Intl.DateTimeFormat("en-NG", {
//       hour: "numeric",
//       hour12: false,
//       timeZone: "Africa/Lagos",
//     });

//     const hour = Number(formatter.format(new Date()));

//     if (hour < 12) return "Good Morning";
//     if (hour < 17) return "Good Afternoon";
//     return "Good Evening";
//   };


//   return (
//     <header className="w-full bg-black/30 backdrop-blur-xl border-b border-white/10 px-6 py-4">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={toggleSidebar}
//             className="text-white "
//           >
//             <Menu className="w-5 h-5" />
//           </Button>
//           <h1 className="text-2xl font-bold text-white">{getGreetings()}, {"Guest"}</h1>
//         </div>

//         <div className="flex items-center space-x-4">
//           <AlertDialog>
//             <AlertDialogTrigger asChild>
//               <Button variant="ghost" size="sm" className="text-white">
//                 <User className="w-5 h-5 mr-2" />
//                 Profile
//               </Button>
//             </AlertDialogTrigger>
//             <AlertDialogContent>
//               <AlertDialogHeader>
//                 <AlertDialogTitle>User Profile</AlertDialogTitle>
//                 <AlertDialogDescription>
//                   <div className="space-y-2 text-left text-sm text-black dark:text-white">
//                     <p><strong>Name:</strong> {user?.name || "N/A"}</p>
//                     <p><strong>Email:</strong> {user?.email || "N/A"}</p>
//                   </div>
//                 </AlertDialogDescription>
//               </AlertDialogHeader>
//               <AlertDialogFooter>
//                 <AlertDialogCancel>Close</AlertDialogCancel>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>
//         <ThemeToggle />
//         </div>
    
//       </div>
//     </header>
//   );
// };


import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import { useUser } from "../../context/useContext.jsx";
import { ThemeToggle } from "@/components/ThemeToggle";
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
    <header
      className="
        w-full sticky top-0 z-50 
        border-b transition-colors duration-300
        bg-white/80 border-[#ACBDAA]/40 
        dark:bg-[#1E2D4C]/80 dark:border-[#ACBDAA]/30
        backdrop-blur-xl
      "
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="
              text-[#1E2D4C] dark:text-[#ACBDAA] hover:opacity-80
              transition-colors duration-200
            "
          >
            <Menu className="w-5 h-5" />
          </Button>

          <h1
            className="
              text-xl sm:text-2xl font-bold 
              text-[#1E2D4C] dark:text-[#ACBDAA]
            "
          >
            {getGreetings()}, {user?.name || "Guest"}
          </h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="
                  border-[#1E2D4C] text-[#1E2D4C]
                  hover:opacity-90
                  dark:border-[#ACBDAA] dark:text-[#ACBDAA]
                "
              >
                <User className="w-5 h-5 mr-2" />
                Profile
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>User Profile</AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="space-y-2 text-left text-sm text-black dark:text-white">
                    <p>
                      <strong>Name:</strong> {user?.name || "N/A"}
                    </p>
                    <p>
                      <strong>Email:</strong> {user?.email || "N/A"}
                    </p>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Close</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
