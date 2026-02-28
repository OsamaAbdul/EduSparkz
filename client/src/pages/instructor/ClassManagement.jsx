import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardLayout } from "../../layouts/DashboardLayout.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Plus,
    Users,
    Trash2,
    UserPlus,
    ChevronRight,
    School as SchoolIcon,
    Search,
    X
} from "lucide-react";
import { useUser } from "../../context/useContext.jsx";
import { supabase } from "../../lib/supabase";
import { toast } from "sonner";

const ClassManagement = () => {
    const { user } = useUser();
    const queryClient = useQueryClient();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
    const [isStudentListModalOpen, setIsStudentListModalOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState(null);
    const [newClassName, setNewClassName] = useState("");
    const [selectedSchool, setSelectedSchool] = useState("");
    const [enrollInput, setEnrollInput] = useState(""); // Can be email or unique_id
    const [isBulk, setIsBulk] = useState(false);

    // Fetch Schools
    const { data: schools } = useQuery({
        queryKey: ["instructorSchools", user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("schools")
                .select("*")
                .eq("instructor_id", user.id);
            if (error) throw error;
            return data || [];
        },
    });

    // Fetch Classes
    const { data: classes, isLoading: classesLoading } = useQuery({
        queryKey: ["instructorClasses", user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("classes")
                .select(`
          *,
          schools (name),
          class_enrollments (id, user_id, profiles (full_name, email))
        `)
                .eq("instructor_id", user.id);
            if (error) throw error;
            return data || [];
        },
    });

    // Create Class Mutation
    const createClassMutation = useMutation({
        mutationFn: async ({ name, school_id }) => {
            const { data, error } = await supabase
                .from("classes")
                .insert({ name, school_id, instructor_id: user.id })
                .select()
                .single();
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["instructorClasses"]);
            setIsModalOpen(false);
            setNewClassName("");
            toast.success("Class created successfully!");
        },
        onError: (error) => {
            toast.error(`Error creating class: ${error.message}`);
        },
    });

    // Enroll Learner(s) Mutation
    const enrollMutation = useMutation({
        mutationFn: async ({ classId, input, isBulk }) => {
            const inputs = isBulk ? input.split(',').map(s => s.trim()).filter(Boolean) : [input.trim()];
            const results = { success: 0, failed: 0, errors: [] };

            for (const val of inputs) {
                try {
                    // 1. Find user by email OR unique_id
                    const isEmail = val.includes('@');
                    const { data: profile, error: profileError } = await supabase
                        .from("profiles")
                        .select("id, unique_id, email")
                        .or(`email.eq.${val},unique_id.eq.${val}`)
                        .maybeSingle();

                    if (profileError || !profile) {
                        results.failed++;
                        results.errors.push(`${val}: User not found`);
                        continue;
                    }

                    // 2. Enroll
                    const { error: enrollError } = await supabase
                        .from("class_enrollments")
                        .insert({ class_id: classId, user_id: profile.id });

                    if (enrollError) {
                        if (enrollError.code === "23505") {
                            results.failed++;
                            results.errors.push(`${val}: Already enrolled`);
                        } else throw enrollError;
                    } else {
                        results.success++;
                    }
                } catch (err) {
                    results.failed++;
                    results.errors.push(`${val}: ${err.message}`);
                }
            }
            return results;
        },
        onSuccess: (results) => {
            queryClient.invalidateQueries(["instructorClasses"]);
            if (results.failed === 0) {
                toast.success(`Successfully enrolled ${results.success} student(s)!`);
                setIsEnrollModalOpen(false);
                setEnrollInput("");
            } else {
                toast.warning(`Enrolled ${results.success}, but ${results.failed} failed.`);
                console.error("Enrollment failures:", results.errors);
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    // Remove Student Mutation
    const removeStudentMutation = useMutation({
        mutationFn: async (enrollmentId) => {
            const { error } = await supabase
                .from("class_enrollments")
                .delete()
                .eq("id", enrollmentId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["instructorClasses"]);
            toast.success("Student removed from class.");
        },
        onError: (error) => {
            toast.error(`Error removing student: ${error.message}`);
        },
    });

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Class Management</h1>
                        <p className="text-gray-400">Organize your learners into classes and schools.</p>
                    </div>
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-electric-cyan text-space-dark hover:bg-electric-cyan/90 font-bold"
                    >
                        <Plus className="mr-2 h-4 w-4" /> New Class
                    </Button>
                </div>

                {/* Classes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classesLoading ? (
                        [1, 2, 3].map(i => <div key={i} className="h-48 glass-card rounded-3xl animate-pulse bg-white/5" />)
                    ) : classes?.length > 0 ? (
                        classes.map((cls) => (
                            <motion.div
                                key={cls.id}
                                whileHover={{ y: -5 }}
                                className="glass-card p-6 rounded-3xl border border-white/10 hover:border-electric-cyan/50 hover:shadow-[0_0_20px_rgba(0,245,255,0.1)] transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                                            <Users className="w-6 h-6 text-hot-magenta" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            {cls.schools?.name || "No School"}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-1">{cls.name}</h3>
                                    <p className="text-sm text-gray-400 mb-4">{cls.class_enrollments?.length || 0} Students Enrolled</p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-white/10 hover:bg-white/10 hover:text-white"
                                            onClick={() => {
                                                setSelectedClass(cls);
                                                setIsEnrollModalOpen(true);
                                            }}
                                        >
                                            <UserPlus className="mr-2 h-4 w-4" /> Enroll
                                        </Button>
                                        <Button 
                                            variant="ghost" 
                                            className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 p-2"
                                            onClick={() => {
                                                if (window.confirm(`Are you sure you want to delete the class "${cls.name}"?`)) {
                                                    // Add delete class logic if needed, for now just placeholder
                                                    toast.info("Delete class functionality goes here");
                                                }
                                            }}
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </Button>
                                    </div>
                                    <Button
                                        variant="secondary"
                                        className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10"
                                        onClick={() => {
                                            setSelectedClass(cls);
                                            setIsStudentListModalOpen(true);
                                        }}
                                    >
                                        <Users className="mr-2 h-4 w-4" /> View Students
                                    </Button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center glass-card rounded-3xl border border-dashed border-white/10">
                            <SchoolIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg">No classes created yet. Get started by creating your first class!</p>
                        </div>
                    )}
                </div>

                {/* Create Class Modal */}
                <AnimatePresence>
                    {isModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => setIsModalOpen(false)}
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                                className="relative glass-card border-white/10 w-full max-w-md p-8 rounded-3xl shadow-2xl z-10"
                            >
                                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                                <h2 className="text-2xl font-bold text-white mb-6">Create New Class</h2>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-gray-400">Class Name</Label>
                                        <Input
                                            placeholder="e.g. Physics 101"
                                            className="bg-white/5 border-white/10 text-white"
                                            value={newClassName}
                                            onChange={(e) => setNewClassName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-gray-400">Select School</Label>
                                        <select
                                            className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-electric-cyan"
                                            value={selectedSchool}
                                            onChange={(e) => setSelectedSchool(e.target.value)}
                                        >
                                            <option value="" disabled>Choose a school...</option>
                                            {schools?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                        </select>
                                    </div>
                                    <Button
                                        onClick={() => createClassMutation.mutate({ name: newClassName, school_id: selectedSchool })}
                                        disabled={createClassMutation.isPending || !newClassName || !selectedSchool}
                                        className="w-full bg-electric-cyan text-space-dark font-bold py-6 rounded-xl mt-4"
                                    >
                                        {createClassMutation.isPending ? "Creating..." : "Create Class"}
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Enroll Learner Modal */}
                <AnimatePresence>
                    {isEnrollModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => setIsEnrollModalOpen(false)}
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                                className="relative glass-card border-white/10 w-full max-w-md p-8 rounded-3xl shadow-2xl z-10"
                            >
                                <button onClick={() => setIsEnrollModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                                <h2 className="text-2xl font-bold text-white mb-2">Enroll Students</h2>
                                <p className="text-sm text-gray-400 mb-6">Add students to <span className="text-white font-bold">{selectedClass?.name}</span> using Email or Unique ID.</p>
                                <div className="space-y-4">
                                    <div className="flex bg-white/5 p-1 rounded-lg mb-4">
                                        <button onClick={() => setIsBulk(false)} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${!isBulk ? 'bg-electric-cyan text-space-dark' : 'text-gray-400 hover:text-white'}`}>Single</button>
                                        <button onClick={() => setIsBulk(true)} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${isBulk ? 'bg-hot-magenta text-white' : 'text-gray-400 hover:text-white'}`}>Bulk Add</button>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-gray-400">{isBulk ? "Unique IDs (comma separated)" : "Email or Unique ID"}</Label>
                                        {isBulk ? (
                                            <textarea
                                                className="w-full h-32 p-3 bg-white/5 border border-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-hot-magenta"
                                                placeholder="ID-123, ID-456, student@email.com"
                                                value={enrollInput}
                                                onChange={(e) => setEnrollInput(e.target.value)}
                                            />
                                        ) : (
                                            <Input
                                                placeholder="student@example.com or STU-8821"
                                                className="bg-white/5 border-white/10 text-white"
                                                value={enrollInput}
                                                onChange={(e) => setEnrollInput(e.target.value)}
                                            />
                                        )}
                                    </div>
                                    <Button
                                        onClick={() => enrollMutation.mutate({ classId: selectedClass.id, input: enrollInput, isBulk })}
                                        disabled={enrollMutation.isPending || !enrollInput}
                                        className={`w-full font-bold py-6 rounded-xl mt-4 transition-all ${isBulk ? 'bg-hot-magenta text-white hover:bg-hot-magenta/90' : 'bg-electric-cyan text-space-dark hover:bg-electric-cyan/90'}`}
                                    >
                                        {enrollMutation.isPending ? "Processing..." : isBulk ? "Bulk Enroll" : "Add to Class"}
                                    </Button>
                                    {isBulk && <p className="text-[10px] text-gray-500 text-center">Separate multiple entries with commas.</p>}
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* View Students Modal */}
                <AnimatePresence>
                    {isStudentListModalOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                                onClick={() => setIsStudentListModalOpen(false)}
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                                className="relative glass-card border-white/10 w-full max-w-2xl p-8 rounded-3xl shadow-2xl z-10"
                            >
                                <button onClick={() => setIsStudentListModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                                <h2 className="text-2xl font-bold text-white mb-2">Enrolled Students</h2>
                                <p className="text-sm text-gray-400 mb-6">List of students in <span className="text-white font-bold">{selectedClass?.name}</span></p>
                                
                                <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {selectedClass?.class_enrollments?.length > 0 ? (
                                        <div className="space-y-3">
                                            {selectedClass.class_enrollments.map((enrollment) => (
                                                <div 
                                                    key={enrollment.id}
                                                    className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-electric-cyan/20 flex items-center justify-center text-electric-cyan font-bold">
                                                            {enrollment.profiles?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-bold">{enrollment.profiles?.full_name || "Unknown Student"}</p>
                                                            <p className="text-xs text-gray-400">{enrollment.profiles?.email}</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-full"
                                                        onClick={() => {
                                                            if (window.confirm(`Remove ${enrollment.profiles?.full_name} from this class?`)) {
                                                                removeStudentMutation.mutate(enrollment.id);
                                                            }
                                                        }}
                                                        disabled={removeStudentMutation.isPending}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10 text-gray-500">
                                            <Users className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                            <p>No students enrolled in this class yet.</p>
                                        </div>
                                    )}
                                </div>
                                <Button
                                    onClick={() => setIsStudentListModalOpen(false)}
                                    className="w-full bg-white/10 hover:bg-white/20 text-white mt-6 rounded-xl"
                                >
                                    Close
                                </Button>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
};

export default ClassManagement;
