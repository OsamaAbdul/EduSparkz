import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, Circle, Loader2, Sparkles, Map, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const LearningPath = ({ userId }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [isGenerating, setIsGenerating] = useState(false);

    // Fetch Learning Path
    const { data: learningPath, isLoading } = useQuery({
        queryKey: ["learningPath", userId],
        queryFn: async () => {
            const { data: path, error } = await supabase
                .from("learning_paths")
                .select("*, items:learning_path_items(*)")
                .eq("user_id", userId)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // Ignore not found error

            if (path?.items) {
                path.items.sort((a, b) => a.order_index - b.order_index);
            }
            return path;
        },
        enabled: !!userId,
    });

    // Generate Path Mutation
    const generatePathMutation = useMutation({
        mutationFn: async () => {
            setIsGenerating(true);
            const { data, error } = await supabase.functions.invoke("generate-learning-path", {
                body: { user_id: userId }
            });
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["learningPath", userId]);
            toast.success("Learning path generated successfully!");
            setIsGenerating(false);
        },
        onError: (error) => {
            console.error("Error generating path:", error);
            toast.error("Failed to generate learning path.");
            setIsGenerating(false);
        }
    });

    // Toggle Item Completion Mutation
    const toggleItemMutation = useMutation({
        mutationFn: async ({ itemId, isCompleted }) => {
            const { error } = await supabase
                .from("learning_path_items")
                .update({ is_completed: isCompleted })
                .eq("id", itemId);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["learningPath", userId]);
        },
        onError: () => {
            toast.error("Failed to update progress.");
        }
    });

    if (isLoading) return <div className="h-48 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-electric-cyan" /></div>;

    if (!learningPath) {
        return (
            <Card className="glass-card border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-electric-cyan/5 to-hot-magenta/5" />
                <CardContent className="flex flex-col items-center justify-center py-12 text-center relative z-10">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                        <Map className="w-8 h-8 text-electric-cyan" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Learning Path Found</h3>
                    <p className="text-gray-400 max-w-md mb-6">
                        Generate a personalized learning path based on your goals and learning style to get started.
                    </p>
                    <Button
                        onClick={() => generatePathMutation.mutate()}
                        disabled={isGenerating}
                        className="bg-electric-cyan text-space-dark hover:bg-electric-cyan/90 font-bold shadow-[0_0_20px_rgba(0,245,255,0.3)]"
                    >
                        {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                        {isGenerating ? "Generating..." : "Generate My Path"}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const completedCount = learningPath.items?.filter(i => i.is_completed).length || 0;
    const totalCount = learningPath.items?.length || 0;
    const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <Card className="glass-card border-white/10">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                            <Map className="w-5 h-5 text-electric-cyan" />
                            {learningPath.title}
                        </CardTitle>
                        <CardDescription className="text-gray-400 mt-1">
                            {learningPath.description}
                        </CardDescription>
                    </div>
                    <div className="text-right">
                        <span className="text-2xl font-bold text-electric-cyan">{Math.round(progress)}%</span>
                        <p className="text-xs text-gray-500">Completed</p>
                    </div>
                </div>
                {/* Progress Bar */}
                <div className="w-full h-2 bg-white/10 rounded-full mt-4 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-electric-cyan to-hot-magenta"
                    />
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    {learningPath.items?.map((item, index) => (
                        <div
                            key={item.id}
                            className={`p-4 rounded-xl border transition-all ${item.is_completed
                                    ? 'bg-electric-cyan/5 border-electric-cyan/20'
                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <button
                                    onClick={() => toggleItemMutation.mutate({ itemId: item.id, isCompleted: !item.is_completed })}
                                    className={`mt-1 flex-shrink-0 transition-colors ${item.is_completed ? 'text-electric-cyan' : 'text-gray-500 hover:text-white'}`}
                                >
                                    {item.is_completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                                </button>
                                <div className="flex-1">
                                    <h4 className={`font-medium ${item.is_completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                                        {item.title}
                                    </h4>
                                    <p className="text-sm text-gray-400 mt-1">{item.description}</p>

                                    <div className="flex gap-2 mt-3">
                                        {item.resource_url && (
                                            <a
                                                href={item.resource_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-electric-cyan hover:underline flex items-center gap-1"
                                            >
                                                View Resource <ArrowRight className="w-3 h-3" />
                                            </a>
                                        )}
                                        <button
                                            onClick={() => navigate("/user/chat", { state: { context: `I am learning about "${item.title}". ${item.description}` } })}
                                            className="text-xs text-hot-magenta hover:underline flex items-center gap-1 ml-auto"
                                        >
                                            Ask AI Tutor <Sparkles className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
