import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";
import { Sidebar } from "../layouts/Sidebar.jsx";
import Header from "../layouts/Header.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, Loader2, FileText, Bot, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/useContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useMediaQuery } from "react-responsive";

const ChatWithDocs = () => {
    const { user } = useUser();
    const [materials, setMaterials] = useState([]);
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hello! Select the documents you want to chat with from the left, and ask me anything." }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isMaterialsLoading, setIsMaterialsLoading] = useState(true);
    const scrollRef = useRef(null);

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const isLaptop = useMediaQuery({ minWidth: 1024 });

    useEffect(() => {
        setSidebarOpen(isLaptop);
    }, [isLaptop]);

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    // Fetch Materials
    useEffect(() => {
        const fetchMaterials = async () => {
            if (!user?.id) return;
            try {
                const { data, error } = await supabase
                    .from('materials')
                    .select('id, title, content, file_type')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setMaterials(data || []);
            } catch (error) {
                console.error("Error fetching materials:", error);
                toast.error("Failed to load materials");
            } finally {
                setIsMaterialsLoading(false);
            }
        };

        fetchMaterials();
    }, [user?.id]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleMaterialToggle = (id) => {
        setSelectedMaterials(prev =>
            prev.includes(id)
                ? prev.filter(item => item !== id)
                : [...prev, id]
        );
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        if (selectedMaterials.length === 0) {
            toast.warning("Please select at least one document to chat with.");
            return;
        }

        const userMessage = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Prepare context from selected materials
            const selectedDocs = materials.filter(m => selectedMaterials.includes(m.id));
            const context = selectedDocs.map(m => `Document: ${m.title}\nContent: ${m.content?.substring(0, 1000)}...`).join("\n\n");

            // Call AI Endpoint
            const { data, error } = await supabase.functions.invoke('chat-with-materials', {
                body: { query: input, context }
            });

            if (error) {
                console.warn("Edge function error or not found:", error);
                // Fallback simulation
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        role: "assistant",
                        content: "I'm processing your request based on the selected documents: " + selectedDocs.map(d => d.title).join(", ") + ". (Backend integration pending)"
                    }]);
                    setIsLoading(false);
                }, 1000);
                return;
            }

            const aiMessage = { role: "assistant", content: data?.reply || "I couldn't generate a response." };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: "assistant", content: "Sorry, something went wrong." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="relative flex flex-col lg:flex-row min-h-screen bg-gray-50 dark:bg-[#0D1117] transition-colors duration-300 w-full">
                {/* Background Accent */}
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ACBDAA]/10 via-transparent to-transparent dark:from-[#ACBDAA]/10" />

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
                overflow-hidden lg:overflow-visible`}
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
                <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
                    <header className="w-full sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#1E2D4C]/70 border-b border-[#ACBDAA]/20 transition-colors duration-300">
                        <Header toggleSidebar={toggleSidebar} className="w-full" />
                    </header>

                    <main className="flex-1 p-4 sm:p-6 lg:p-8 h-[calc(100vh-4rem)] overflow-hidden">
                        <div className="flex flex-col lg:flex-row h-full gap-4">
                            {/* Left Column: Materials List */}
                            <Card className="w-full lg:w-1/3 flex flex-col bg-white dark:bg-[#1E2D4C] border-[#ACBDAA]/30">
                                <CardHeader className="border-b border-[#ACBDAA]/20 pb-4">
                                    <CardTitle className="text-[#1E2D4C] dark:text-[#ACBDAA] flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Select Documents
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 p-0 overflow-hidden">
                                    <ScrollArea className="h-full p-4">
                                        {isMaterialsLoading ? (
                                            <div className="space-y-2">
                                                {[1, 2, 3].map(i => <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />)}
                                            </div>
                                        ) : materials.length === 0 ? (
                                            <p className="text-center text-gray-500 mt-4">No materials found. Upload some first!</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {materials.map((material) => (
                                                    <div key={material.id} className="flex items-start space-x-3 p-3 rounded-lg border border-transparent hover:bg-gray-100 dark:hover:bg-[#ACBDAA]/10 transition-colors">
                                                        <Checkbox
                                                            id={material.id}
                                                            checked={selectedMaterials.includes(material.id)}
                                                            onCheckedChange={() => handleMaterialToggle(material.id)}
                                                            className="mt-1 border-[#ACBDAA] data-[state=checked]:bg-[#ACBDAA]"
                                                        />
                                                        <label
                                                            htmlFor={material.id}
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                                                        >
                                                            <div className="text-[#1E2D4C] dark:text-[#ACBDAA] font-semibold">{material.title}</div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                                                                {material.file_type?.toUpperCase()} • {new Date().toLocaleDateString()}
                                                            </div>
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </ScrollArea>
                                </CardContent>
                            </Card>

                            {/* Right Column: Chat Interface */}
                            <Card className="w-full lg:w-2/3 flex flex-col bg-white dark:bg-[#1E2D4C] border-[#ACBDAA]/30 shadow-lg">
                                <CardHeader className="border-b border-[#ACBDAA]/20 py-4 bg-[#ACBDAA]/10">
                                    <CardTitle className="text-[#1E2D4C] dark:text-[#ACBDAA] flex items-center gap-2">
                                        <Bot className="w-6 h-6" />
                                        AI Study Assistant
                                    </CardTitle>
                                </CardHeader>

                                <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                                    {/* Messages Area */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-[#0D1117]/50" ref={scrollRef}>
                                        {messages.map((msg, idx) => (
                                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-[#ACBDAA]' : 'bg-[#1E2D4C] text-white'
                                                        }`}>
                                                        {msg.role === 'user' ? <User className="w-5 h-5 text-[#1E2D4C]" /> : <Bot className="w-5 h-5" />}
                                                    </div>
                                                    <div className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${msg.role === 'user'
                                                        ? 'bg-[#ACBDAA] text-[#1E2D4C] rounded-tr-none'
                                                        : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-600'
                                                        }`}>
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {isLoading && (
                                            <div className="flex justify-start">
                                                <div className="flex gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#1E2D4C] text-white flex items-center justify-center">
                                                        <Bot className="w-5 h-5" />
                                                    </div>
                                                    <div className="bg-white dark:bg-slate-700 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-gray-100 dark:border-gray-600 flex items-center">
                                                        <Loader2 className="w-4 h-4 animate-spin text-gray-500 dark:text-gray-400 mr-2" />
                                                        <span className="text-gray-500 dark:text-gray-400 text-sm">Thinking...</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Input Area */}
                                    <div className="p-4 bg-white dark:bg-[#1E2D4C] border-t border-[#ACBDAA]/20">
                                        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3">
                                            <Input
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                placeholder="Ask a question about your selected documents..."
                                                className="flex-1 bg-gray-100 dark:bg-slate-800 border-transparent focus:border-[#ACBDAA] focus:ring-[#ACBDAA]"
                                                disabled={isLoading}
                                            />
                                            <Button
                                                type="submit"
                                                disabled={isLoading || !input.trim() || selectedMaterials.length === 0}
                                                className="bg-[#ACBDAA] text-[#1E2D4C] hover:bg-[#ACBDAA]/90"
                                            >
                                                <Send className="w-4 h-4 mr-2" />
                                                Send
                                            </Button>
                                        </form>
                                    </div>
                                </CardContent>
                            </Card>
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

export default ChatWithDocs;
