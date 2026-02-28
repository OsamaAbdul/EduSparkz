import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout.jsx";
import { FileUploadCard } from "../../features/dashboard/components/FileUploadCard.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    ClipboardList,
    ChevronRight,
    Calendar,
    Clock,
    CheckCircle2,
    BookOpen,
    ArrowLeft
} from "lucide-react";
import { useUser } from "../../context/useContext.jsx";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

const AssignQuiz = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [selectedClass, setSelectedClass] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [duration, setDuration] = useState("30");
    const [step, setStep] = useState(1);
    const [showUpload, setShowUpload] = useState(false);

    // Fetch Instructor's Quizzes
    const { data: quizzes, isLoading: quizzesLoading } = useQuery({
        queryKey: ["instructorQuizzes", user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("quizzes")
                .select("id, title, created_at")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data || [];
        },
    });

    // Fetch Instructor's Classes
    const { data: classes } = useQuery({
        queryKey: ["instructorClasses", user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("classes")
                .select("id, name, school_id, schools(name)")
                .eq("instructor_id", user.id);
            if (error) throw error;
            return data || [];
        },
    });

    // Assign Mutation
    const assignMutation = useMutation({
        mutationFn: async (payload) => {
            const { error } = await supabase
                .from("quiz_assignments")
                .insert(payload);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["instructorAssignments"]);
            toast.success("Quiz assigned successfully!");
            navigate("/instructor/dashboard");
        },
        onError: (error) => {
            toast.error(`Assignment failed: ${error.message}`);
        },
    });

    const handleAssign = () => {
        if (!selectedQuiz || !selectedClass || !startTime || !endTime) {
            toast.error("Please fill all fields.");
            return;
        }

        assignMutation.mutate({
            quiz_id: selectedQuiz.id,
            class_id: selectedClass,
            instructor_id: user.id,
            start_time: new Date(startTime).toISOString(),
            end_time: new Date(endTime).toISOString(),
            duration_minutes: parseInt(duration) || null,
        });
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Assign Quiz</h1>
                        <p className="text-gray-400">Step {step} of 2: {step === 1 ? "Select Quiz" : "Set Schedule"}</p>
                    </div>
                </div>

                <div className="relative h-1 w-full bg-white/5 rounded-full mb-12">
                    <motion.div
                        initial={{ width: "50%" }}
                        animate={{ width: step === 1 ? "50%" : "100%" }}
                        className="h-full bg-electric-cyan rounded-full"
                    />
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <BookOpen className="w-5 h-5 text-hot-magenta" /> Select or Create Quiz
                                </h2>
                                <div className="flex bg-white/5 p-1 rounded-xl">
                                    <button
                                        onClick={() => setShowUpload(false)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!showUpload ? 'bg-electric-cyan text-space-dark shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        My Library
                                    </button>
                                    <button
                                        onClick={() => setShowUpload(true)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${showUpload ? 'bg-electric-cyan text-space-dark shadow-lg' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        Generate New
                                    </button>
                                </div>
                            </div>

                            {!showUpload ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {quizzesLoading ? (
                                        [1, 2, 3, 4].map(i => <div key={i} className="h-24 glass-card animate-pulse bg-white/5 rounded-2xl" />)
                                    ) : quizzes?.length > 0 ? (
                                        quizzes.map((q) => (
                                            <div
                                                key={q.id}
                                                onClick={() => setSelectedQuiz(q)}
                                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex justify-between items-center ${selectedQuiz?.id === q.id ? 'border-electric-cyan bg-electric-cyan/10' : 'border-white/10 hover:border-white/20 bg-white/5'
                                                    }`}
                                            >
                                                <div>
                                                    <p className="font-bold text-white mb-1">{q.title}</p>
                                                    <p className="text-xs text-gray-400">Created: {new Date(q.created_at).toLocaleDateString()}</p>
                                                </div>
                                                {selectedQuiz?.id === q.id && <CheckCircle2 className="w-5 h-5 text-electric-cyan" />}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-12 text-center glass-card border-dashed">
                                            <p className="text-gray-500">No quizzes found. Generate one first!</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full">
                                    <FileUploadCard
                                        onQuizGenerated={(id, title) => {
                                            setSelectedQuiz({ id, title });
                                            setStep(2);
                                        }}
                                    />
                                </div>
                            )}

                            {!showUpload && (
                                <div className="flex justify-end pt-8">
                                    <Button
                                        disabled={!selectedQuiz}
                                        onClick={() => setStep(2)}
                                        className="bg-electric-cyan text-space-dark font-bold px-8 py-6 rounded-xl"
                                    >
                                        Next Step <ChevronRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                        >
                            <div className="glass-card p-8 rounded-3xl space-y-8 border border-white/10">
                                <div className="space-y-2">
                                    <Label className="text-gray-400 text-xs uppercase tracking-widest font-bold">Assign to Class</Label>
                                    <select
                                        className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-electric-cyan"
                                        value={selectedClass}
                                        onChange={(e) => setSelectedClass(e.target.value)}
                                    >
                                        <option value="" disabled>Choose a class...</option>
                                        {classes?.map(c => <option key={c.id} value={c.id}>{c.name} ({c.schools?.name})</option>)}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-gray-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                                            <Calendar className="w-4 h-4" /> Start Window
                                        </Label>
                                        <Input
                                            type="datetime-local"
                                            className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                                            value={startTime}
                                            onChange={(e) => setStartTime(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-gray-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> End Window
                                        </Label>
                                        <Input
                                            type="datetime-local"
                                            className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                                            value={endTime}
                                            onChange={(e) => setEndTime(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-gray-400 text-xs uppercase tracking-widest font-bold flex items-center gap-2">
                                            <Clock className="w-4 h-4" /> Exam Duration (Mins)
                                        </Label>
                                        <Input
                                            type="number"
                                            placeholder="e.g. 30"
                                            className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                                            value={duration}
                                            onChange={(e) => setDuration(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl bg-electric-cyan/5 border border-electric-cyan/20 space-y-2">
                                    <p className="text-sm font-bold text-electric-cyan flex items-center gap-2">
                                        <ClipboardList className="w-4 h-4" /> Assignment Summary
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        Assigning <span className="text-white font-bold">{selectedQuiz?.title}</span> to <span className="text-white font-bold">{classes?.find(c => c.id === selectedClass)?.name}</span>.
                                        Students will have from <span className="text-white font-bold">{startTime ? new Date(startTime).toLocaleString() : "..."}</span> until <span className="text-white font-bold">{endTime ? new Date(endTime).toLocaleString() : "..."}</span> to complete the quiz once started, with a time limit of <span className="text-electric-cyan font-bold">{duration} minutes</span>.
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between pt-4">
                                <Button variant="ghost" onClick={() => setStep(1)} className="text-gray-400 hover:text-white">
                                    Back to Selection
                                </Button>
                                <Button
                                    onClick={handleAssign}
                                    disabled={assignMutation.isPending || !selectedClass || !startTime || !endTime}
                                    className="bg-electric-cyan text-space-dark font-bold px-12 py-6 rounded-xl shadow-[0_4px_30px_rgba(0,245,255,0.3)]"
                                >
                                    {assignMutation.isPending ? "Assigning..." : "Confirm Assignment"}
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
};

export default AssignQuiz;
