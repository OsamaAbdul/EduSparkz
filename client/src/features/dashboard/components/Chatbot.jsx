import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/useContext";

export const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi! I can help you study. Ask me anything about your uploaded materials." }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useUser();
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            // Fetch relevant materials context (simplified)
            const { data: materials } = await supabase
                .from('materials')
                .select('content, title')
                .eq('user_id', user.id)
                .limit(3);

            const context = materials?.map(m => `Title: ${m.title}\nContent: ${m.content?.substring(0, 500)}...`).join("\n\n") || "";

            // Call AI Endpoint (Simulated for now if function doesn't exist)
            // In a real scenario, we would call supabase.functions.invoke('chat-with-materials', ...)
            // For this implementation, we will mock a response if the function call fails or just use a simple echo with context info.

            // Attempt to call edge function
            const { data, error } = await supabase.functions.invoke('chat-with-materials', {
                body: { query: input, context }
            });

            if (error) {
                // Fallback if function is not deployed
                console.warn("Edge function not found, using fallback response.");
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        role: "assistant",
                        content: "I'm currently in beta mode. I see you have some materials uploaded. I can't process them deeply yet without the backend function, but I'm ready to help!"
                    }]);
                    setIsLoading(false);
                }, 1000);
                return;
            }

            const aiMessage = { role: "assistant", content: data?.reply || "I'm sorry, I couldn't process that." };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I encountered an error. Please try again later." }]);
        } finally {
            if (!isLoading) setIsLoading(false); // Ensure loading state is cleared if not handled in fallback
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="rounded-full w-14 h-14 bg-[#ACBDAA] hover:bg-[#ACBDAA]/90 text-[#1E2D4C] shadow-lg flex items-center justify-center"
                >
                    <MessageCircle className="w-8 h-8" />
                </Button>
            )}

            {isOpen && (
                <div className="bg-white dark:bg-[#1E2D4C] border border-[#ACBDAA]/30 rounded-2xl shadow-2xl w-80 sm:w-96 flex flex-col overflow-hidden transition-all duration-300 ease-in-out h-[500px]">
                    {/* Header */}
                    <div className="bg-[#ACBDAA] p-4 flex justify-between items-center">
                        <h3 className="font-bold text-[#1E2D4C] flex items-center gap-2">
                            <MessageCircle className="w-5 h-5" />
                            Study Assistant
                        </h3>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-[#1E2D4C] hover:bg-black/10" onClick={() => setIsOpen(false)}>
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#1E2D4C]/50" ref={scrollRef}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.role === 'user'
                                    ? 'bg-[#ACBDAA] text-[#1E2D4C] rounded-br-none'
                                    : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm border border-gray-100 dark:border-gray-600'
                                    }`}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-slate-700 rounded-2xl rounded-bl-none px-4 py-2 shadow-sm border border-gray-100 dark:border-gray-600">
                                    <Loader2 className="w-4 h-4 animate-spin text-gray-500 dark:text-gray-400" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white dark:bg-[#1E2D4C] border-t border-[#ACBDAA]/30">
                        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about your studies..."
                                className="flex-1 bg-gray-100 dark:bg-slate-800 border-none focus-visible:ring-1 focus-visible:ring-[#ACBDAA] text-[#1E2D4C] dark:text-[#ACBDAA]"
                            />
                            <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="bg-[#ACBDAA] text-[#1E2D4C] hover:bg-[#ACBDAA]/90">
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
