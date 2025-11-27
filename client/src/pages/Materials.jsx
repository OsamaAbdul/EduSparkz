import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "../context/useContext";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { useState } from "react";
import { FileText, Search, Eye, Download, Trash2 } from "lucide-react";
import React from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Materials = () => {
    const { user } = useUser();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    // Fetch Materials
    const { data: materials, isLoading } = useQuery({
        queryKey: ["materials", user?.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("materials")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) throw error;
            return data;
        },
        enabled: !!user?.id,
    });

    // Delete Material
    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            const { error } = await supabase.from("materials").delete().eq("id", id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["materials"]);
            toast.success("Material deleted successfully");
        },
        onError: (error) => {
            toast.error("Failed to delete material: " + error.message);
        },
    });

    const handleDownload = (material) => {
        const element = document.createElement("a");
        const file = new Blob([material.content], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = `${material.title}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const filteredMaterials = materials?.filter((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            My Materials
                        </h1>
                        <p className="text-gray-400 mt-1">
                            Manage and review your uploaded study materials
                        </p>
                    </div>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search materials..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white focus:outline-none focus:ring-2 focus:ring-electric-cyan focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-48 w-full bg-white/10 rounded-2xl" />
                        ))}
                    </div>
                ) : filteredMaterials?.length === 0 ? (
                    <div className="text-center py-32 glass-card rounded-3xl">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FileText className="h-10 w-10 text-gray-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">
                            No materials found
                        </h3>
                        <p className="text-gray-400 mt-2">
                            Upload documents in the Dashboard to see them here.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredMaterials.map((material, index) => (
                                <motion.div
                                    key={material.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card className="group relative overflow-hidden glass-card border-white/10 hover:border-electric-cyan/50 transition-all duration-300 h-full flex flex-col">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <div className="p-3 bg-gradient-to-br from-electric-cyan/20 to-hot-magenta/20 rounded-xl group-hover:scale-110 transition-transform">
                                                    <FileText className="h-6 w-6 text-electric-cyan" />
                                                </div>
                                                <div className="flex gap-1">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 hover:bg-white/10 text-gray-400 hover:text-white"
                                                                onClick={() => setSelectedMaterial(material)}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-space-dark border-white/10 text-white">
                                                            <DialogHeader>
                                                                <DialogTitle className="text-electric-cyan text-xl">
                                                                    {material.title}
                                                                </DialogTitle>
                                                            </DialogHeader>
                                                            <div className="mt-4 whitespace-pre-wrap break-words text-gray-300 font-mono text-sm p-4 bg-black/30 rounded-xl border border-white/5">
                                                                {material.content}
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-white/10 text-gray-400 hover:text-white"
                                                        onClick={() => handleDownload(material)}
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>

                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-red-500/20 text-gray-400 hover:text-red-500"
                                                        onClick={() => {
                                                            if (confirm("Are you sure you want to delete this material?")) {
                                                                deleteMutation.mutate(material.id);
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <CardTitle className="mt-4 text-lg font-bold text-white truncate group-hover:text-electric-cyan transition-colors">
                                                {material.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="flex-1 flex flex-col justify-end">
                                            <div className="mt-2 text-sm text-gray-400 line-clamp-3 break-words mb-4">
                                                {material.content?.substring(0, 150)}...
                                            </div>
                                            <p className="text-xs text-gray-600 pt-4 border-t border-white/5">
                                                Added on {new Date(material.created_at).toLocaleDateString()}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Materials;
