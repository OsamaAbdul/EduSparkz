import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DashboardLayout } from "../layouts/DashboardLayout.jsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, FileText, User, Sparkles } from "lucide-react";
import logoIcon from "@/assets/logoIcon.png";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/useContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import Tesseract from 'tesseract.js';
import mammoth from 'mammoth';
import { Plus, Paperclip, X as LucideX, Trash2 } from "lucide-react";

// PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

const ChatWithDocs = () => {
    const { user } = useUser();
    const location = useLocation();
    const context = location.state?.context;
    const [materials, setMaterials] = useState([]);
    const [selectedMaterials, setSelectedMaterials] = useState([]);
    const [messages, setMessages] = useState([
        { role: "assistant", content: context ? `I see you're working on: "${context}". How can I help you with that?` : "Hello! Select the documents you want to chat with from the left, and ask me anything." }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isMaterialsLoading, setIsMaterialsLoading] = useState(true);
    const [canChat, setCanChat] = useState(true);
    const [chatCount, setChatCount] = useState(0);
    const [activeTab, setActiveTab] = useState("chat"); // 'materials' or 'chat'
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadTitle, setUploadTitle] = useState("");
    const fileInputRef = useRef(null);
    const scrollRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Check Chat Limit
    useEffect(() => {
        const checkLimit = async () => {
            if (!user) return;
            try {
                const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
                const { count, error } = await supabase
                    .from('chat_logs')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                    .gte('created_at', oneDayAgo);

                if (error) throw error;

                setChatCount(count || 0);

                // Get followed_socials status from profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('followed_socials, plan')
                    .eq('id', user.id)
                    .single();

                const isFree = !profile?.plan || profile.plan.toLowerCase() === 'free';
                const hasFollowed = profile?.followed_socials || false;
                const dailyLimit = hasFollowed ? 15 : 5;

                if (isFree && (count || 0) >= dailyLimit) {
                    setCanChat(false);
                }
            } catch (error) {
                console.error("Error checking chat limit:", error);
            }
        };
        checkLimit();
    }, [user]);

    // Fetch Materials
    useEffect(() => {
        const fetchMaterials = async () => {
            if (!user?.id) return;
            try {
                const { data, error } = await supabase
                    .from('materials')
                    .select('id, title, content, file_type, created_at')
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

    const extractTextFromFile = async (file) => {
        const fileType = file.type;
        try {
            if (fileType === "application/pdf") {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map(item => item.str).join(' ');
                    fullText += pageText + '\n';
                }
                return fullText;
            } else if (fileType === "text/plain") {
                return new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onload = e => resolve(e.target.result);
                    reader.readAsText(file);
                });
            } else if (["image/jpeg", "image/png"].includes(fileType)) {
                const { data: { text } } = await Tesseract.recognize(file, 'eng');
                return text;
            } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                return result.value;
            } else {
                throw new Error("Unsupported file type");
            }
        } catch (err) {
            throw new Error(`Text extraction failed: ${err.message}`);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = [
            "application/pdf",
            "text/plain",
            "image/jpeg",
            "image/png",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        if (!allowedTypes.includes(file.type)) {
            toast.error("Only PDF, text, image, or Word (.docx) files allowed");
            return;
        }

        setIsUploading(true);
        setUploadTitle(file.name);
        setUploadProgress(10);

        try {
            // Extract text
            setUploadProgress(30);
            const extractedText = await extractTextFromFile(file);
            setUploadProgress(60);

            // Upload 
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('materials')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('materials')
                .getPublicUrl(fileName);

            // Save to database
            const { data: material, error: dbError } = await supabase
                .from('materials')
                .insert({
                    user_id: user.id,
                    title: file.name,
                    content: extractedText,
                    file_type: file.type.includes('image') ? 'image' : (file.type === 'application/pdf' ? 'pdf' : 'document'),
                    file_url: publicUrl
                })
                .select()
                .single();

            if (dbError) throw dbError;

            setUploadProgress(100);
            toast.success("Document uploaded and processed successfully!");

            // Auto-select and refresh materials
            setMaterials(prev => [material, ...prev]);
            setSelectedMaterials(prev => [...prev, material.id]);

        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload document: " + error.message);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
            setUploadTitle("");
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDeleteMaterial = async (e, materialId) => {
        e.stopPropagation(); // Prevent toggling selection
        if (!confirm("Are you sure you want to delete this material? This will also remove it from your Knowledge Galaxy.")) return;

        try {
            const { error } = await supabase
                .from('materials')
                .delete()
                .eq('id', materialId);

            if (error) throw error;

            toast.success("Material deleted successfully");

            // Update local states
            setMaterials(prev => prev.filter(m => m.id !== materialId));
            setSelectedMaterials(prev => prev.filter(id => id !== materialId));
        } catch (error) {
            console.error("Error deleting material:", error);
            toast.error("Failed to delete material: " + error.message);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleSend = async () => {
        if (!input.trim()) return;
        if (selectedMaterials.length === 0) {
            toast.warning("Please select at least one document to chat with.");
            return;
        }

        if (!canChat) {
            toast.error("Daily chat limit reached (5/5). Upgrade to Premium for unlimited chats!");
            return;
        }

        const userMessage = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Log chat attempt
            const { error: logError } = await supabase.from('chat_logs').insert({ user_id: user.id });
            if (logError) console.error("Failed to log chat:", logError);

            setChatCount(prev => {
                const newCount = prev + 1;
                const isFree = !user.plan || user.plan.toLowerCase() === 'free';
                const dailyLimit = user.followed_socials ? 15 : 5;
                if (isFree && newCount >= dailyLimit) setCanChat(false);
                return newCount;
            });

            // Prepare context from selected materials
            const selectedDocs = materials.filter(m => selectedMaterials.includes(m.id));
            const contextString = selectedDocs.map(m => `Document: ${m.title}\nContent: ${m.content?.substring(0, 1000)}...`).join("\n\n");

            // Call AI Endpoint
            const { data, error } = await supabase.functions.invoke('chat-with-materials', {
                body: { query: input, context: contextString, user_id: user?.id }
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
            <div className="flex flex-col h-[calc(100dvh-120px)] lg:h-[calc(100vh-8rem)] w-full mb-0 lg:mb-0">

                {/* Mobile Tabs */}
                <div className="flex lg:hidden mb-4 bg-white/5 p-1 rounded-lg border border-white/10 shrink-0">
                    <button
                        onClick={() => setActiveTab("materials")}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === "materials"
                            ? "bg-electric-cyan text-space-dark shadow-lg"
                            : "text-gray-400 hover:text-white"
                            }`}
                    >
                        Documents
                    </button>
                    <button
                        onClick={() => setActiveTab("chat")}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === "chat"
                            ? "bg-hot-magenta text-white shadow-lg"
                            : "text-gray-400 hover:text-white"
                            }`}
                    >
                        Chat
                    </button>
                </div>

                <div className="flex flex-1 gap-4 overflow-hidden">
                    {/* Left Column: Materials List */}
                    <Card className={`lg:w-1/3 flex-col glass-card border-white/10 ${activeTab === 'materials' ? 'flex w-full' : 'hidden lg:flex'}`}>
                        <CardHeader className="border-b border-white/10 pb-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-electric-cyan" />
                                Select Documents
                            </CardTitle>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="hidden"
                                accept=".pdf,.txt,.docx,image/*"
                            />
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-full border border-white/10 hover:bg-electric-cyan hover:text-space-dark transition-all"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                title="Upload new document"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
                            {isUploading && (
                                <div className="p-4 border-b border-white/10 bg-electric-cyan/5 anim-pulse">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-electric-cyan font-bold truncate max-w-[150px]">
                                            Uploading: {uploadTitle}
                                        </span>
                                        <span className="text-[10px] text-gray-400">{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-electric-cyan"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                            <ScrollArea className="flex-1 p-4">
                                {isMaterialsLoading ? (
                                    <div className="space-y-2">
                                        {[1, 2, 3].map(i => <div key={i} className="h-10 bg-white/5 animate-pulse rounded" />)}
                                    </div>
                                ) : materials.length === 0 ? (
                                    <p className="text-center text-gray-500 mt-4">No materials found. Upload some first!</p>
                                ) : (
                                    <div className="space-y-3">
                                        {materials.map((material) => (
                                            <div key={material.id} className="group flex items-start space-x-3 p-3 rounded-lg border border-transparent hover:bg-white/5 transition-colors">
                                                <Checkbox
                                                    id={material.id}
                                                    checked={selectedMaterials.includes(material.id)}
                                                    onCheckedChange={() => handleMaterialToggle(material.id)}
                                                    className="mt-1 border-white/30 data-[state=checked]:bg-electric-cyan data-[state=checked]:text-space-dark"
                                                />
                                                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleMaterialToggle(material.id)}>
                                                    <div className="text-white font-semibold flex items-center gap-2">
                                                        <span className="truncate">{material.title}</span>
                                                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-gray-400 font-normal shrink-0">
                                                            {material.file_type?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="text-[11px] text-electric-cyan/80 mt-1 font-medium flex items-center gap-1">
                                                        <span className="opacity-60">Added:</span>
                                                        {formatDate(material.created_at)}
                                                    </div>
                                                </div>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-500/20 transition-all shrink-0 bg-white/5"
                                                    onClick={(e) => handleDeleteMaterial(e, material.id)}
                                                    title="Delete material"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    {/* Right Column: Chat Interface */}
                    <Card className={`lg:w-2/3 flex-col glass-card border-white/10 shadow-lg ${activeTab === 'chat' ? 'flex w-full' : 'hidden lg:flex'}`}>
                        <CardHeader className="border-b border-white/10 py-4 bg-white/5">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-white flex items-center gap-2">
                                    <img src={logoIcon} alt="AI" className="w-12 h-12 object-cover" />
                                    AI Tutor
                                </CardTitle>
                                {context && (
                                    <div className="bg-electric-cyan/10 border border-electric-cyan/30 px-3 py-1 rounded-full text-xs text-electric-cyan flex items-center gap-2 max-w-[200px] truncate">
                                        <Sparkles className="w-3 h-3" />
                                        <span className="truncate" title={context}>Context: {context}</span>
                                    </div>
                                )}
                            </div>
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
                                                    {msg.role === 'user' ? <User className="w-24 h-24" /> : <img src={logoIcon} alt="AI" className="w-24 h-24 object-contain" />}
                                                </div>
                                                <div className={`rounded-2xl px-4 py-3 text-sm shadow-md backdrop-blur-sm ${msg.role === 'user'
                                                    ? 'bg-electric-cyan/20 text-white border border-electric-cyan/20 rounded-tr-none'
                                                    : 'bg-white/5 text-gray-200 rounded-tl-none border border-white/10'
                                                    }`}>
                                                    <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-black/50 prose-pre:p-2 prose-pre:rounded-lg">
                                                        <ReactMarkdown
                                                            remarkPlugins={[remarkGfm]}
                                                            components={{
                                                                ul: ({ node, ...props }) => <ul className="list-disc pl-4 my-2 space-y-1" {...props} />,
                                                                ol: ({ node, ...props }) => <ol className="list-decimal pl-4 my-2 space-y-1" {...props} />,
                                                                li: ({ node, ...props }) => <li className="my-0.5" {...props} />,
                                                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                                strong: ({ node, ...props }) => <strong className="font-bold text-electric-cyan" {...props} />,
                                                                a: ({ node, ...props }) => <a className="text-electric-cyan hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                                                            }}
                                                        >
                                                            {msg.content}
                                                        </ReactMarkdown>
                                                    </div>
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
                                            <div className="w-8 h-8 rounded-full bg-hot-magenta/10 flex items-center justify-center shadow-lg border border-hot-magenta/20 overflow-hidden">
                                                <img src={logoIcon} alt="AI" className="w-6 h-6 object-contain" />
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
                                {!canChat && (
                                    <div className="mb-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-400 text-center">
                                        Daily chat limit reached ({chatCount}/{user?.followed_socials ? 15 : 5}). {user?.followed_socials ? "Upgrade to Premium" : "Follow our socials or upgrade"} to continue.
                                    </div>
                                )}
                                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-3 items-center">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="shrink-0 text-gray-400 hover:text-electric-cyan"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isUploading || !canChat}
                                    >
                                        <Paperclip className="w-5 h-5" />
                                    </Button>
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Ask a question about your selected documents..."
                                        className="flex-1 bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus:border-electric-cyan focus:ring-electric-cyan/20"
                                        disabled={isLoading || !canChat}
                                    />
                                    <Button
                                        type="submit"
                                        disabled={isLoading || !input.trim() || selectedMaterials.length === 0 || !canChat}
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
            </div>
        </DashboardLayout >
    );
};

export default ChatWithDocs;
