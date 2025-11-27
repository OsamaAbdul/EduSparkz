import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, FileText, Bot, User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/useContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

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
    const messagesEndRef = useRef(null);

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
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    // Load chat history from localStorage
    useEffect(() => {
        const savedMessages = localStorage.getItem('chatHistory');
        if (savedMessages) {
            try {
                setMessages(JSON.parse(savedMessages));
            } catch (e) {
                console.error("Failed to parse chat history", e);
            }
        }
    }, []);

    // Save chat history to localStorage
    useEffect(() => {
        if (messages.length > 0) {
            localStorage.setItem('chatHistory', JSON.stringify(messages));
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
                console.error("Edge function error:", error);
                toast.error("Failed to get response from AI.");
                setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error processing your request." }]);
                setIsLoading(false);
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
            <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-4 w-full">
                {/* Left Column: Materials List */}
                <Card className="w-full lg:w-1/3 flex flex-col glass-card border-white/10">
                    <CardHeader className="border-b border-white/10 pb-4">
                        <CardTitle className="text-white flex items-center gap-2">
                            <FileText className="w-5 h-5 text-electric-cyan" />
                            Select Documents
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <ScrollArea className="h-full p-4">
                            {isMaterialsLoading ? (
                                <div className="space-y-2">
                                    {[1, 2, 3].map(i => <div key={i} className="h-10 bg-white/5 animate-pulse rounded" />)}
                                </div>
                            ) : materials.length === 0 ? (
                                <p className="text-center text-gray-500 mt-4">No materials found. Upload some first!</p>
                            ) : (
                                <div className="space-y-3">
                                    {materials.map((material) => (
                                        <div key={material.id} className="flex items-start space-x-3 p-3 rounded-lg border border-transparent hover:bg-white/5 transition-colors">
                                            <Checkbox
                                                id={material.id}
                                                checked={selectedMaterials.includes(material.id)}
                                                onCheckedChange={() => handleMaterialToggle(material.id)}
                                                className="mt-1 border-white/30 data-[state=checked]:bg-electric-cyan data-[state=checked]:text-space-dark"
                                            />
                                            <label
                                                htmlFor={material.id}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                                            >
                                                <div className="text-white font-semibold">{material.title}</div>
                                                <div className="text-xs text-gray-400 mt-1 truncate">
                                                    {material.file_type?.toUpperCase()} • {new Date(material.created_at).toLocaleDateString()}
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
                <Card className="w-full lg:w-2/3 flex flex-col glass-card border-white/10 shadow-lg">
                    <CardHeader className="border-b border-white/10 py-4 bg-white/5">
                        <CardTitle className="text-white flex items-center gap-2">
                            <Bot className="w-6 h-6 text-hot-magenta" />
                            AI Tutor
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20 scroll-smooth" ref={scrollRef}>
                            <AnimatePresence mode="popLayout">
                                {messages.map((msg, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-electric-cyan text-space-dark' : 'bg-hot-magenta text-white'
                                                }`}>
                                                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                            </div>
                                            <div className={`rounded-2xl px-4 py-3 text-sm shadow-md backdrop-blur-sm ${msg.role === 'user'
                                                ? 'bg-electric-cyan/20 text-white border border-electric-cyan/20 rounded-tr-none'
                                                : 'bg-white/5 text-gray-200 rounded-tl-none border border-white/10'
                                                }`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-hot-magenta text-white flex items-center justify-center shadow-lg">
                                            <Bot className="w-5 h-5" />
                                        </div>
                                        <div className="bg-white/5 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-white/10 flex items-center backdrop-blur-sm">
                                            <div className="flex space-x-1">
                                                <motion.div
                                                    className="w-2 h-2 bg-electric-cyan rounded-full"
                                                    animate={{ y: [0, -5, 0] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0 }}
                                                />
                                                <motion.div
                                                    className="w-2 h-2 bg-hot-magenta rounded-full"
                                                    animate={{ y: [0, -5, 0] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                                                />
                                                <motion.div
                                                    className="w-2 h-2 bg-electric-lime rounded-full"
                                                    animate={{ y: [0, -5, 0] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white/5 border-t border-white/10">
                            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask a question about your selected documents..."
                                    className="flex-1 bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-electric-cyan focus:ring-electric-cyan/20"
                                    disabled={isLoading}
                                />
                                <Button
                                    type="submit"
                                    disabled={isLoading || !input.trim() || selectedMaterials.length === 0}
                                    className="bg-electric-cyan text-space-dark hover:bg-electric-cyan/90 font-bold"
                                >
                                    <Send className="w-4 h-4 mr-2" />
                                    Send
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default ChatWithDocs;
