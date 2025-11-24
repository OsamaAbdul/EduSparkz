import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThemeProvider from "@/context/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { UserProvider } from "./context/useContext.jsx";
import ProtectedRoute from "./layouts/ProtectedRoute.jsx";
import Quiz from "./pages/Quiz.jsx";
import QuizResults from "./pages/QuizResults.jsx";
import History from "./pages/History.jsx";
import Leaderboard from "./pages/LeaderBoard.jsx";
import VerifyOtp from "./features/auth/components/VerifyOtp.jsx";
import ResendOtp from "./features/auth/components/ResendOtp.jsx";

import Pricing from "./pages/Pricing.jsx";
import Materials from "./pages/Materials.jsx";

import Onboarding from "./pages/Onboarding.jsx";

const queryClient = new QueryClient();

const App = () => (
  <UserProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/api/auth/login" element={<Login />} />
              <Route path="/api/auth/register" element={<Register />} />
              <Route path="/api/auth/verify-otp" element={<VerifyOtp />} />
              <Route path="/api/auth/resend-otp" element={<ResendOtp />} />
              {/* <Route path="/user/dashboard" element={<Dashboard />} />
              <Route path="/user/quiz" element={<Quiz />} />
              <Route path="/user/quiz-result" element={<QuizResults />} />
              <Route path="/user/history" element={<History />} />
              <Route path="/user/leaderboard" element={<Leaderboard />} /> */}


              {/* Protected Routes */}
              <Route
                path="/user/onboarding"
                element={
                  <ProtectedRoute>
                    <Onboarding />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/materials"
                element={
                  <ProtectedRoute>
                    <Materials />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/quiz"
                element={
                  <ProtectedRoute>
                    <Quiz />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/quiz-result"
                element={
                  <ProtectedRoute>
                    <QuizResults />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/history"
                element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/leaderboard"
                element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </UserProvider>
);

export default App;
