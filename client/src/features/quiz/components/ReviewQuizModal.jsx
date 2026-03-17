import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
    Edit3, 
    Trash2, 
    Save, 
    CheckCircle2, 
    XCircle, 
    GripVertical, 
    Plus,
    Eye,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export const ReviewQuizModal = ({ 
    isOpen, 
    onClose, 
    quizData, 
    onConfirm 
}) => {
    const [questions, setQuestions] = useState([]);
    const [title, setTitle] = useState("");
    const [previewMode, setPreviewMode] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState(0);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(Date.now());

    // Debounced Autosave
    useEffect(() => {
        if (!isOpen || !quizData?.id || previewMode) return;

        const timer = setTimeout(async () => {
            try {
                await supabase
                    .from('quizzes')
                    .update({ 
                        questions: questions,
                        title: title 
                    })
                    .eq('id', quizData.id);
                setLastSaved(Date.now());
            } catch (error) {
                console.error("Autosave failed:", error);
            }
        }, 2000); // 2 second debounce

        return () => clearTimeout(timer);
    }, [questions, title, quizData?.id, isOpen, previewMode]);

    useEffect(() => {
        if (quizData) {
            setQuestions(quizData.questions || []);
            setTitle(quizData.title || "");
        }
    }, [quizData]);

    const handleUpdateQuestion = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index] = { ...newQuestions[index], [field]: value };
        setQuestions(newQuestions);
    };

    const handleUpdateOption = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        const newOptions = [...newQuestions[qIndex].options];
        newOptions[oIndex] = value;
        newQuestions[qIndex] = { ...newQuestions[qIndex], options: newOptions };
        setQuestions(newQuestions);
    };

    const handleAddQuestion = () => {
        const newQuestion = {
            question: "New Question",
            options: ["Option 1", "Option 2", "Option 3", "Option 4"],
            answer: "Option 1",
            explanation: "Explanation here",
            reference: ""
        };
        setQuestions([...questions, newQuestion]);
        setExpandedIndex(questions.length);
    };

    const handleDeleteQuestion = (index) => {
        const newQuestions = questions.filter((_, i) => i !== index);
        setQuestions(newQuestions);
        if (expandedIndex >= newQuestions.length) {
            setExpandedIndex(Math.max(0, newQuestions.length - 1));
        }
    };

    const handleSaveAndConfirm = async () => {
        setSaving(true);
        try {
            // Update the quiz in the database
            const { error } = await supabase
                .from('quizzes')
                .update({ 
                    questions: questions,
                    title: title 
                })
                .eq('id', quizData.id);

            if (error) throw error;

            toast.success("Quiz updated and verified!");
            onConfirm({ ...quizData, questions, title });
        } catch (error) {
            console.error("Error updating quiz:", error);
            toast.error("Failed to save changes: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-space-dark border-white/10 text-white p-0">
                <DialogHeader className="p-6 border-b border-white/10 flex-row items-center justify-between space-y-0">
                    <div>
                        <DialogTitle className="text-2xl font-bold text-electric-cyan flex items-center gap-2">
                            <Edit3 className="w-6 h-6" /> Review & Edit Quiz
                        </DialogTitle>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-gray-400 text-sm">{questions.length} Questions Generated</p>
                            <span className="text-white/20">•</span>
                            <p className="text-gray-500 text-xs flex items-center gap-1">
                                <Save className="w-3 h-3" /> 
                                {saving ? "Saving..." : `Auto-saved ${new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`}
                            </p>
                        </div>
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-xl mr-6">
                        <button
                            onClick={() => setPreviewMode(false)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!previewMode ? 'bg-electric-cyan text-space-dark shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Edit View
                        </button>
                        <button
                            onClick={() => setPreviewMode(true)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${previewMode ? 'bg-electric-cyan text-space-dark shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Preview
                        </button>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
                    <div className="space-y-4">
                        <Label className="text-gray-400 text-xs uppercase tracking-widest font-bold">Quiz Title</Label>
                        <Input 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-white/5 border-white/10 text-white h-12 text-lg font-bold"
                            placeholder="Enter quiz title..."
                        />
                    </div>

                    {!previewMode ? (
                        <Reorder.Group axis="y" values={questions} onReorder={setQuestions} className="space-y-4">
                            {questions.map((q, qIndex) => (
                                <Reorder.Item 
                                    key={qIndex} 
                                    value={q}
                                    className="glass-card border border-white/10 rounded-2xl overflow-hidden"
                                >
                                    <div 
                                        className={`p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors ${expandedIndex === qIndex ? 'bg-white/5 border-b border-white/10' : ''}`}
                                        onClick={() => setExpandedIndex(expandedIndex === qIndex ? -1 : qIndex)}
                                    >
                                        <GripVertical className="w-5 h-5 text-gray-500 cursor-grab active:cursor-grabbing" />
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-electric-cyan/20 text-electric-cyan flex items-center justify-center font-bold text-sm">
                                            {qIndex + 1}
                                        </span>
                                        <p className="flex-1 font-medium truncate text-gray-100">{q.question}</p>
                                        <div className="flex items-center gap-2">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteQuestion(qIndex);
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            {expandedIndex === qIndex ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {expandedIndex === qIndex && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="p-6 space-y-6">
                                                    <div className="space-y-2">
                                                        <Label className="text-gray-400 text-xs uppercase tracking-widest font-bold">Question</Label>
                                                        <Textarea 
                                                            value={q.question}
                                                            onChange={(e) => handleUpdateQuestion(qIndex, 'question', e.target.value)}
                                                            className="bg-black/20 border-white/10 text-white min-h-[80px]"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {q.options.map((opt, oIndex) => (
                                                            <div key={oIndex} className="space-y-2">
                                                                <div className="flex justify-between items-center">
                                                                    <Label className="text-gray-400 text-[10px] uppercase tracking-tighter font-bold">Option {String.fromCharCode(65 + oIndex)}</Label>
                                                                    <button 
                                                                        onClick={() => handleUpdateQuestion(qIndex, 'answer', opt)}
                                                                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter transition-all ${q.answer === opt ? 'bg-green-500 text-white' : 'bg-white/10 text-gray-400 hover:text-white'}`}
                                                                    >
                                                                        {q.answer === opt ? 'Correct' : 'Set Correct'}
                                                                    </button>
                                                                </div>
                                                                <Input 
                                                                    value={opt}
                                                                    onChange={(e) => handleUpdateOption(qIndex, oIndex, e.target.value)}
                                                                    className={`bg-black/20 border-white/10 text-white ${q.answer === opt ? 'border-green-500/50 ring-1 ring-green-500/20' : ''}`}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-gray-400 text-xs uppercase tracking-widest font-bold">Explanation</Label>
                                                        <Textarea 
                                                            value={q.explanation}
                                                            onChange={(e) => handleUpdateQuestion(qIndex, 'explanation', e.target.value)}
                                                            className="bg-black/20 border-white/10 text-white text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Reorder.Item>
                            ))}
                            <Button 
                                onClick={handleAddQuestion}
                                variant="outline" 
                                className="w-full border-dashed border-white/10 hover:border-electric-cyan/50 hover:bg-electric-cyan/5 text-gray-400 hover:text-electric-cyan h-12 rounded-2xl transition-all"
                            >
                                <Plus className="w-4 h-4 mr-2" /> Add Question
                            </Button>
                        </Reorder.Group>
                    ) : (
                        <div className="space-y-8 pb-12">
                            {questions.map((q, qIndex) => (
                                <div key={qIndex} className="glass-card p-8 border border-white/10 rounded-3xl space-y-6">
                                    <div className="flex items-start gap-4">
                                        <span className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-electric-cyan to-hot-magenta text-space-dark flex items-center justify-center font-bold">
                                            {qIndex + 1}
                                        </span>
                                        <h3 className="text-xl font-bold text-white leading-relaxed">{q.question}</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-14">
                                        {q.options.map((opt, oIndex) => (
                                            <div 
                                                key={oIndex}
                                                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${q.answer === opt ? 'bg-green-500/10 border-green-500/50 text-white' : 'bg-white/5 border-white/5 text-gray-400'}`}
                                            >
                                                <span>{opt}</span>
                                                {q.answer === opt && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 pl-14">
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                            <Eye className="w-3 h-3" /> Explanation
                                        </p>
                                        <p className="text-sm text-gray-300 leading-relaxed italic">"{q.explanation}"</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 border-t border-white/10 flex-row gap-4 sm:justify-between items-center">
                    <Button 
                        variant="ghost" 
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        Discard Changes
                    </Button>
                    <div className="flex gap-3">
                        <Button 
                            onClick={handleSaveAndConfirm}
                            disabled={saving}
                            className="bg-electric-cyan text-space-dark font-bold px-8 shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:shadow-[0_0_30px_rgba(0,245,255,0.5)] transition-all"
                        >
                            {saving ? "Saving..." : "Confirm & Continue"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
