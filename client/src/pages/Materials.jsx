import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "react-responsive";
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
import { FileText, Search } from "lucide-react";
import React from "react";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { Sidebar } from "../layouts/Sidebar";
import Header from "../layouts/Header";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Download, Trash2 } from "lucide-react";

const Materials = () => {
    const { user } = useUser();
    const queryClient = useQueryClient();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const isLaptop = useMediaQuery({ minWidth: 1024 });
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedMaterial, setSelectedMaterial] = useState(null);

    React.useEffect(() => {
        setSidebarOpen(isLaptop);
    }, [isLaptop]);

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

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
            <div className="relative flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-[#0D1117] transition-colors duration-300 w-full">
                {/* Sidebar */}
                <AnimatePresence initial={false}>
                    {sidebarOpen && (
                        <motion.aside
                            key="sidebar"
                            initial={{ x: isLaptop ? 0 : -300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: isLaptop ? 0 : -300, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 120, damping: 20 }}
                            className={`fixed lg:sticky top-0 left-0 z-50 lg:z-40 h-screen 
                bg-white/80 dark:bg-[#1E2D4C]/70 border-r border-[#ACBDAA]/20 backdrop-blur-xl 
                overflow-hidden lg:overflow-visible w-64`}
                        >
                            <Sidebar
                                isOpen={sidebarOpen}
                                iconOnly={!sidebarOpen && isLaptop}
                                toggleSidebar={toggleSidebar}
                            />
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <div className="flex-1 flex flex-col min-h-screen">
                    <header className="w-full sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#1E2D4C]/70 border-b border-[#ACBDAA]/20 transition-colors duration-300">
                        <Header toggleSidebar={toggleSidebar} className="w-full" />
                    </header>

                    <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                        <div className="max-w-7xl mx-auto space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-[#1E2D4C] dark:text-[#ACBDAA]">
                                        My Materials
                                    </h1>
                                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                                        Manage and review your uploaded study materials
                                    </p>
                                </div>
                                <div className="relative w-full sm:w-64">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search materials..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#ACBDAA]/30 bg-white/50 dark:bg-[#1E2D4C]/30 text-[#1E2D4C] dark:text-[#ACBDAA] focus:outline-none focus:ring-2 focus:ring-[#ACBDAA]"
                                    />
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton key={i} className="h-48 w-full bg-[#ACBDAA]/20 rounded-xl" />
                                    ))}
                                </div>
                            ) : filteredMaterials?.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="w-16 h-16 bg-[#ACBDAA]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FileText className="h-8 w-8 text-[#ACBDAA]" />
                                    </div>
                                    <h3 className="text-xl font-medium text-[#1E2D4C] dark:text-[#ACBDAA]">
                                        No materials found
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                                        Upload documents in the Dashboard to see them here.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredMaterials.map((material) => (
                                        <Card
                                            key={material.id}
                                            className="group relative overflow-hidden bg-white/80 dark:bg-[#1E2D4C]/80 border border-[#ACBDAA]/30 hover:border-[#ACBDAA] transition-all duration-300"
                                        >
                                            <CardHeader className="pb-2">
                                                <div className="flex justify-between items-start">
                                                    <div className="p-2 bg-[#ACBDAA]/10 rounded-lg">
                                                        <FileText className="h-6 w-6 text-[#1E2D4C] dark:text-[#ACBDAA]" />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 hover:bg-[#ACBDAA]/20 text-[#1E2D4C] dark:text-[#ACBDAA]"
                                                                    onClick={() => setSelectedMaterial(material)}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white dark:bg-[#0D1117] border-[#ACBDAA]/30">
                                                                <DialogHeader>
                                                                    <DialogTitle className="text-[#1E2D4C] dark:text-[#ACBDAA]">
                                                                        {material.title}
                                                                    </DialogTitle>
                                                                </DialogHeader>
                                                                <div className="mt-4 whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-mono text-sm">
                                                                    {material.content}
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 hover:bg-[#ACBDAA]/20 text-[#1E2D4C] dark:text-[#ACBDAA]"
                                                            onClick={() => handleDownload(material)}
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </Button>

                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 hover:bg-red-100 text-red-500"
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
                                                <CardTitle className="mt-4 text-lg font-semibold text-[#1E2D4C] dark:text-[#ACBDAA] truncate">
                                                    {material.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    Added on {new Date(material.created_at).toLocaleDateString()}
                                                </p>
                                                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                                                    {material.content?.substring(0, 150)}...
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </div>
                    </main>
                </div>

                {/* Mobile Overlay */}
                <AnimatePresence>
                    {!isLaptop && sidebarOpen && (
                        <motion.div
                            key="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm lg:hidden"
                        />
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
};

export default Materials;
