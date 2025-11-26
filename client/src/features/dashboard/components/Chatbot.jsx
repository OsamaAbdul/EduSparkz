import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Chatbot = () => {
    const navigate = useNavigate();

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
            <Button
                onClick={() => navigate("/user/chat")}
                className="rounded-full w-12 h-12 sm:w-14 sm:h-14 bg-[#ACBDAA] hover:bg-[#ACBDAA]/90 text-[#1E2D4C] shadow-lg flex items-center justify-center transition-transform hover:scale-110"
            >
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8" />
            </Button>
        </div>
    );
};
