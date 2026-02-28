import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "../../layouts/DashboardLayout.jsx";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Plus,
    School,
    Users,
    ClipboardList,
    LayoutDashboard,
    GraduationCap,
    X,
    ChevronRight,
    ListOrdered,
    Trash2,
    Edit
} from "lucide-react";
import { useUser } from "../../context/useContext.jsx";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";


const InstructorDashboard = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
    const [newSchoolName, setNewSchoolName] = useState("");
    const [schoolAddress, setSchoolAddress] = useState("");

    // Edit Assignment Modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [editQuizTitle, setEditQuizTitle] = useState("");
    const [editQuestions, setEditQuestions] = useState([]);
    const [editEndTime, setEditEndTime] = useState("");
    const [editDuration, setEditDuration] = useState("");

    // Create School Mutation
    const createSchoolMutation = useMutation({
        mutationFn: async (payload) => {
            const { error } = await supabase
                .from("schools")
                .insert({ ...payload, instructor_id: user.id });
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["instructorSchools"]);
            setIsSchoolModalOpen(false);
            setNewSchoolName("");
            setSchoolAddress("");
            toast.success("School added successfully!");
        },
        onError: (error) => {
            toast.error(`Failed to add school: ${error.message}`);
        }
    });

    // Delete Assignment Mutation
    const deleteAssignmentMutation = useMutation({
        mutationFn: async (assignmentId) => {
            const { error } = await supabase
                .from("quiz_assignments")
                .delete()
                .eq("id", assignmentId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["instructorAssignments"]);
            toast.success("Assignment deleted successfully!");
        },
        onError: (error) => {
            toast.error(`Failed to delete assignment: ${error.message}`);
        }
    });

    // Update Assignment Mutation
    const updateAssignmentMutation = useMutation({
        mutationFn: async ({ id, payload }) => {
            const { error } = await supabase
                .from("quiz_assignments")
                .update(payload)
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["instructorAssignments"]);
            toast.success("Assignment updated successfully!");
        },
        onError: (error) => {
            toast.error(`Failed to update assignment: ${error.message}`);
        }
    });

    // Update Quiz Mutation
    const updateQuizMutation = useMutation({
        mutationFn: async ({ id, payload }) => {
            const { error } = await supabase
                .from("quizzes")
                .update(payload)
                .eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["instructorAssignments"]);
            toast.success("Quiz updated successfully!");
        },
        onError: (error) => {
            toast.error(`Failed to update quiz: ${error.message}`);
        }
    });

    // Delete School Mutation
    const deleteSchoolMutation = useMutation({
        mutationFn: async (schoolId) => {
            const { error } = await supabase
                .from("schools")
                .delete()
                .eq("id", schoolId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["instructorSchools"]);
            queryClient.invalidateQueries(["instructorClassesStats"]);
            toast.success("School deleted successfully!");
        },
        onError: (error) => {
            toast.error(`Failed to delete school: ${error.message}`);
        }
    });

    // Fetch Schools
    const { data: schools, isLoading: schoolsLoading } = useQuery({
        queryKey: ["instructorSchools", user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("schools")
                .select("*")
                .eq("instructor_id", user.id);
            if (error) throw error;
            return data || [];
        },
        enabled: !!user?.id,
    });

    // Fetch Classes and Student count
    const { data: classData, isLoading: classesLoading } = useQuery({
        queryKey: ["instructorClassesStats", user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("classes")
                .select("id, name, class_enrollments(id)")
                .eq("instructor_id", user.id);
            if (error) throw error;
            return data || [];
        },
        enabled: !!user?.id,
    });

    const totalStudents = classData?.reduce((acc, cls) => acc + (cls.class_enrollments?.length || 0), 0) || 0;

    // Fetch Assignments
    const { data: assignments, isLoading: assignmentsLoading } = useQuery({
        queryKey: ["instructorAssignments", user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("quiz_assignments")
                .select(`
          *,
          quizzes (title),
          classes (name)
        `)
                .eq("instructor_id", user.id)
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data || [];
        },
        enabled: !!user?.id,
    });

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <DashboardLayout>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-7xl mx-auto space-y-8"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            Instructor <span className="text-electric-cyan">Dashboard</span>
                        </h1>
                        <p className="text-gray-400">Manage your schools, classes, and quiz assignments.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            onClick={() => setIsSchoolModalOpen(true)}
                            className="bg-white/10 text-white hover:bg-white/20 border border-white/10"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add School
                        </Button>
                        <Button
                            onClick={() => navigate("/instructor/manage-classes")}
                            className="bg-white/10 text-white hover:bg-white/20 border border-white/10"
                        >
                            <ClipboardList className="mr-2 h-4 w-4" /> Manage Classes
                        </Button>
                        <Button
                            onClick={() => navigate("/instructor/assign-quiz")}
                            className="bg-electric-cyan text-space-dark hover:bg-electric-cyan/90 font-bold"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Assign Quiz
                        </Button>
                    </div>
                </motion.div>

                {/* Schools & Classes Overview */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Schools List */}
                    <div className="lg:col-span-1 glass-card p-6 rounded-3xl flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <School className="text-electric-cyan w-5 h-5" /> Your Schools
                            </h3>
                        </div>
                        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {schoolsLoading ? (
                                [1, 2].map(i => <Skeleton key={i} className="h-12 w-full bg-white/5 rounded-xl" />)
                            ) : schools?.length > 0 ? (
                                 schools.map((school) => (
                                    <div key={school.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-electric-cyan/30 transition-all flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-electric-cyan/10 flex items-center justify-center group-hover:bg-electric-cyan/20 transition-colors">
                                                <School className="w-4 h-4 text-electric-cyan" />
                                            </div>
                                            <span className="text-sm font-medium text-white">{school.name}</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (window.confirm(`Are you sure you want to delete "${school.name}"? This will also delete all associated classes.`)) {
                                                    deleteSchoolMutation.mutate(school.id);
                                                }
                                            }}
                                            className="text-gray-500 hover:text-red-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-xs text-gray-500 italic">No schools added yet.</p>
                                    <Button variant="ghost" size="sm" onClick={() => setIsSchoolModalOpen(true)} className="mt-2 text-electric-cyan text-[10px] uppercase font-bold tracking-widest">Add First School</Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Classes Grid Preview */}
                    <div className="lg:col-span-2 glass-card p-6 rounded-3xl flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <LayoutDashboard className="text-hot-magenta w-5 h-5" /> Active Classes
                            </h3>
                            <Button variant="ghost" size="sm" onClick={() => navigate("/instructor/manage-classes")} className="text-gray-400 hover:text-white text-xs">View All</Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 h-full">
                            {classesLoading ? (
                                [1, 2].map(i => <Skeleton key={i} className="h-32 w-full bg-white/5 rounded-2xl" />)
                            ) : classData?.length > 0 ? (
                                classData.slice(0, 4).map((cls) => (
                                    <div key={cls.id} className="p-5 rounded-2xl bg-white/5 border border-white/10 flex flex-col justify-between hover:border-hot-magenta/30 transition-all cursor-pointer" onClick={() => navigate("/instructor/manage-classes")}>
                                        <div>
                                            <h4 className="font-bold text-white mb-1">{cls.name}</h4>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest">{cls.class_enrollments?.length || 0} Students</p>
                                        </div>
                                        <div className="flex justify-end mt-4">
                                            <ChevronRight className="w-4 h-4 text-gray-600" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full h-full flex flex-col items-center justify-center text-center py-8">
                                    <p className="text-xs text-gray-500 italic mb-4">No active classes found.</p>
                                    <Button onClick={() => navigate("/instructor/manage-classes")} size="sm" className="bg-hot-magenta text-white font-bold h-8 text-[10px]">Create Class</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Recent Assignments Table */}
                <motion.div variants={itemVariants} className="glass-card rounded-3xl overflow-hidden border border-white/10">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-hot-magenta" /> Recent Assignments
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest font-bold">
                                <tr>
                                    <th className="px-6 py-4">Quiz Title</th>
                                    <th className="px-6 py-4">Class</th>
                                    <th className="px-6 py-4">End Time</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {assignmentsLoading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i}>
                                            <td colSpan="4" className="px-6 py-4"><Skeleton className="h-6 w-full bg-white/5" /></td>
                                        </tr>
                                    ))
                                ) : assignments?.length > 0 ? (
                                    assignments.map((as) => (
                                        <tr key={as.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{as.quizzes?.title}</td>
                                            <td className="px-6 py-4 text-gray-400">{as.classes?.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(as.end_time).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${new Date(as.end_time) > new Date() ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                                                    }`}>
                                                    {new Date(as.end_time) > new Date() ? "Active" : "Expired"}
                                                </span>
                                            </td>
                                             <td className="px-6 py-4 text-right">
                                                 <div className="flex justify-end gap-2">
                                                     <Button
                                                         variant="ghost"
                                                         size="sm"
                                                         className="text-electric-cyan hover:bg-electric-cyan/10 text-[10px] font-bold uppercase"
                                                         onClick={() => navigate(`/user/assignment-leaderboard/${as.id}`)}
                                                     >
                                                         <ListOrdered className="w-4 h-4 mr-1" /> Ranking
                                                     </Button>
                                                     <Button
                                                         variant="ghost"
                                                         size="sm"
                                                         className="text-hot-magenta hover:bg-hot-magenta/10 text-[10px] font-bold uppercase"
                                                         onClick={async () => {
                                                             setSelectedAssignment(as);
                                                             setEditQuizTitle(as.quizzes?.title);
                                                             setEditEndTime(new Date(as.end_time).toISOString().slice(0, 16));
                                                             setEditDuration(as.duration_minutes || "");
                                                             
                                                             // Fetch full quiz content including questions
                                                             if (as.quiz_id) {
                                                                 const { data, error } = await supabase.from('quizzes').select('questions').eq('id', as.quiz_id).single();
                                                                 if (!error && data) {
                                                                     setEditQuestions(data.questions || []);
                                                                 }
                                                             }
                                                             setIsEditModalOpen(true);
                                                         }}
                                                     >
                                                         <Edit className="w-4 h-4 mr-1" /> Edit
                                                     </Button>
                                                     <Button
                                                         variant="ghost"
                                                         size="sm"
                                                         className="text-red-500 hover:bg-red-500/10 text-[10px] font-bold uppercase"
                                                         onClick={() => {
                                                             if (window.confirm("Are you sure you want to delete this assignment?")) {
                                                                 deleteAssignmentMutation.mutate(as.id);
                                                             }
                                                         }}
                                                     >
                                                         <Trash2 className="w-4 h-4 mr-1" /> Delete
                                                     </Button>
                                                 </div>
                                             </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500 italic">
                                            No assignments found. Start by assigning a quiz!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Create School Modal */}
                <AnimatePresence>
                    {isSchoolModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => setIsSchoolModalOpen(false)}
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                                className="relative glass-card border-white/10 w-full max-w-md p-8 rounded-3xl shadow-2xl z-10"
                            >
                                <button onClick={() => setIsSchoolModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                                <h2 className="text-2xl font-bold text-white mb-6">Add New School</h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-gray-400">School Name</Label>
                                        <Input
                                            placeholder="e.g. Green Valley High"
                                            className="bg-white/5 border-white/10 text-white"
                                            value={newSchoolName}
                                            onChange={(e) => setNewSchoolName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-gray-400">Address (Optional)</Label>
                                        <Input
                                            placeholder="School location..."
                                            className="bg-white/5 border-white/10 text-white"
                                            value={schoolAddress}
                                            onChange={(e) => setSchoolAddress(e.target.value)}
                                        />
                                    </div>
                                    <Button
                                        onClick={() => createSchoolMutation.mutate({ name: newSchoolName, address: schoolAddress })}
                                        disabled={createSchoolMutation.isPending || !newSchoolName}
                                        className="w-full bg-electric-cyan text-space-dark font-bold py-6 rounded-xl mt-4"
                                    >
                                        {createSchoolMutation.isPending ? "Adding..." : "Add School"}
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Edit Assignment Modal */}
                <AnimatePresence>
                    {isEditModalOpen && selectedAssignment && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                                onClick={() => setIsEditModalOpen(false)}
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                                className="relative glass-card border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 rounded-3xl shadow-2xl z-10 custom-scrollbar"
                            >
                                <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Edit className="text-hot-magenta w-6 h-6" /> Edit Assignment & Quiz
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Assignment Schedule</h3>
                                        <div className="space-y-2">
                                            <Label className="text-gray-400">End Time</Label>
                                            <Input
                                                type="datetime-local"
                                                className="bg-white/5 border-white/10 text-white"
                                                value={editEndTime}
                                                onChange={(e) => setEditEndTime(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-gray-400">Duration (Minutes)</Label>
                                            <Input
                                                type="number"
                                                className="bg-white/5 border-white/10 text-white"
                                                value={editDuration}
                                                onChange={(e) => setEditDuration(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Quiz Info</h3>
                                        <div className="space-y-2">
                                            <Label className="text-gray-400">Quiz Title</Label>
                                            <Input
                                                className="bg-white/5 border-white/10 text-white"
                                                value={editQuizTitle}
                                                onChange={(e) => setEditQuizTitle(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Questions</h3>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setEditQuestions([...editQuestions, { question: "", optionA: "", optionB: "", optionC: "", optionD: "", correctAnswerText: "", explanation: "" }])}
                                            className="text-electric-cyan border-electric-cyan/20 hover:bg-electric-cyan/10"
                                        >
                                            <Plus className="w-4 h-4 mr-1" /> Add Question
                                        </Button>
                                    </div>

                                    {editQuestions.map((q, idx) => (
                                        <div key={idx} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 relative group">
                                            <button
                                                onClick={() => setEditQuestions(editQuestions.filter((_, i) => i !== idx))}
                                                className="absolute top-4 right-4 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                            <div className="space-y-2">
                                                <Label className="text-xs text-gray-500 uppercase">Question {idx + 1}</Label>
                                                <Input
                                                    className="bg-white/5 border-white/10 text-white font-medium"
                                                    value={q.question}
                                                    onChange={(e) => {
                                                        const newQs = [...editQuestions];
                                                        newQs[idx].question = e.target.value;
                                                        setEditQuestions(newQs);
                                                    }}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {['optionA', 'optionB', 'optionC', 'optionD'].map(opt => (
                                                    <div key={opt} className="space-y-1">
                                                        <Label className="text-[10px] text-gray-500 uppercase">{opt.replace('option', 'Option ')}</Label>
                                                        <Input
                                                            className="bg-white/5 border-white/10 text-white text-sm"
                                                            value={q[opt]}
                                                            onChange={(e) => {
                                                                const newQs = [...editQuestions];
                                                                newQs[idx][opt] = e.target.value;
                                                                setEditQuestions(newQs);
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] text-gray-500 uppercase">Correct Answer (Exact text)</Label>
                                                    <Input
                                                        className="bg-white/5 border-white/10 text-electric-cyan text-sm font-bold"
                                                        value={q.correctAnswerText}
                                                        onChange={(e) => {
                                                            const newQs = [...editQuestions];
                                                            newQs[idx].correctAnswerText = e.target.value;
                                                            setEditQuestions(newQs);
                                                        }}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-[10px] text-gray-500 uppercase">Explanation (Optional)</Label>
                                                    <Input
                                                        className="bg-white/5 border-white/10 text-gray-400 text-sm"
                                                        value={q.explanation}
                                                        onChange={(e) => {
                                                            const newQs = [...editQuestions];
                                                            newQs[idx].explanation = e.target.value;
                                                            setEditQuestions(newQs);
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-4 mt-12 pb-4">
                                    <Button
                                        onClick={async () => {
                                            try {
                                                // 1. Update Assignment
                                                await updateAssignmentMutation.mutateAsync({
                                                    id: selectedAssignment.id,
                                                    payload: {
                                                        end_time: new Date(editEndTime).toISOString(),
                                                        duration_minutes: parseInt(editDuration) || null
                                                    }
                                                });
                                                // 2. Update Quiz
                                                await updateQuizMutation.mutateAsync({
                                                    id: selectedAssignment.quiz_id,
                                                    payload: {
                                                        title: editQuizTitle,
                                                        questions: editQuestions
                                                    }
                                                });
                                                setIsEditModalOpen(false);
                                            } catch (err) {
                                                console.error("Save failure", err);
                                            }
                                        }}
                                        disabled={updateAssignmentMutation.isPending || updateQuizMutation.isPending}
                                        className="flex-1 bg-electric-cyan text-space-dark font-black py-8 rounded-2xl shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:shadow-[0_0_30px_rgba(0,245,255,0.5)] transition-all text-lg"
                                    >
                                        {updateAssignmentMutation.isPending || updateQuizMutation.isPending ? "Saving Changes..." : "Save All Changes"}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="px-8 border-white/10 text-gray-400 hover:text-white"
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </motion.div>
        </DashboardLayout>
    );
};

export default InstructorDashboard;
