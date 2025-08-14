
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dasboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { UserProvider } from "./context/useContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Quiz from './pages/Quiz.jsx';
import QuizResults from './pages/QuizResults.jsx';
import History from "./pages/History.jsx";
import Leaderboard from "./pages/LeaderBoard.jsx";



const queryClient = new QueryClient();

const App = () => (
  <UserProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/api/auth/login" element={<Login />} />
          <Route path="/api/auth/Register" element={<Register />} />
        

          {/**Protected Route */}

            <Route path="/user/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/user/quiz" element={<ProtectedRoute><Quiz /></ProtectedRoute>} />
            <Route path="/user/quiz-result" element={<ProtectedRoute><QuizResults /></ProtectedRoute>} />
            <Route path="/user/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/user/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </UserProvider>
);

export default App;
