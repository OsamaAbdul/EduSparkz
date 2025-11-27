'use client';

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Mic, Link as LinkIcon, StopCircle, FileText, X, CheckCircle, Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useUser } from '@/context/useContext.jsx';
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import Tesseract from 'tesseract.js';
import mammoth from 'mammoth';
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export const FileUploadCard = ({
  accept = "application/pdf,text/plain,image/jpeg,image/png,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  onQuizGenerated,
}) => {
  const [fileName, setFileName] = useState("No file selected");
  const [fileError, setFileError] = useState("");
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Processing...");
  const [userPrompt, setPrompt] = useState("");
  const [quizCount, setQuizCount] = useState("5");
  const [quizType, setQuizType] = useState("mixed");
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("file");
  const [urlInput, setUrlInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);

  // Preview & Save Dialog State
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [previewText, setPreviewText] = useState("");
  const [saveToLibrary, setSaveToLibrary] = useState(true);
  const [pendingPayload, setPendingPayload] = useState(null);

  const { user } = useUser();

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(prev => prev + ' ' + currentTranscript);
      };

      recognitionInstance.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      try {
        recognition.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting recognition:", error);
      }
    } else {
      setFileError("Speech recognition not supported in this browser.");
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  // Reset error after timeout
  useEffect(() => {
    if (fileError) {
      const timer = setTimeout(() => setFileError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [fileError]);

  // Loading text animation
  useEffect(() => {
    if (loading) {
      const texts = ["Initializing AI...", "Reading Content...", "Generating Questions...", "Finalizing Quiz..."];
      let index = 0;
      const interval = setInterval(() => {
        setLoadingText(texts[index]);
        index = (index + 1) % texts.length;
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  // Extract text from different file types
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

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "image/jpeg",
      "image/png",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (!selectedFile || !allowedTypes.includes(selectedFile.type)) {
      setFileError("Only PDF, text, image, or Word (.docx) files allowed");
      setFileName("No file selected");
      setFile(null);
      setExtractedText("");
      return;
    }
    if (selectedFile.size > maxSize) {
      setFileError("File exceeds 10MB limit");
      return;
    }
    setFileName(selectedFile.name);
    setFile(selectedFile);
    setLoading(true);
    try {
      const text = await extractTextFromFile(selectedFile);
      setExtractedText(text);
    } catch (err) {
      setFileError(err.message);
      setFile(null);
      setFileName("No file selected");
      setExtractedText("");
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(["dragenter", "dragover"].includes(e.type));
  };

  const handleDrop = async e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileChange({ target: { files: [droppedFile] } });
  };

  const [existingMaterials, setExistingMaterials] = useState([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);

  // Fetch existing materials when library tab is active
  useEffect(() => {
    if (activeTab === 'library' && user?.id) {
      const fetchMaterials = async () => {
        const { data, error } = await supabase
          .from('materials')
          .select('id, title, content, created_at, file_type')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching materials:", error);
        } else {
          setExistingMaterials(data || []);
        }
      };
      fetchMaterials();
    }
  }, [activeTab, user?.id]);

  const handleMaterialSelect = (material) => {
    setSelectedMaterialId(material.id);
    setExtractedText(material.content); // Pre-fill content for generation
    setFileName(material.title);
  };

  const handleUploadAndGenerate = async () => {
    // Validation based on active tab
    if (activeTab === 'file' && (!file || !extractedText)) {
      setFileError("Please select a valid file.");
      return;
    }
    if (activeTab === 'link' && !urlInput) {
      setFileError("Please enter a valid URL.");
      return;
    }
    if (activeTab === 'audio' && !transcript) {
      setFileError("Please transcribe some speech first.");
      return;
    }
    if (activeTab === 'library' && !selectedMaterialId) {
      setFileError("Please select a material from your library.");
      return;
    }

    // Prepare payload for confirmation
    const count = quizCount ? parseInt(quizCount) : 5;
    if (isNaN(count) || count < 1 || count > 20) {
      setFileError("Quiz count must be 1-20");
      return;
    }

    let payload = {
      userPrompt,
      quizCount: count,
      quizType,
      title: userPrompt || "Generated Quiz"
    };

    let initialText = "";

    if (activeTab === 'file') {
      initialText = extractedText;
      payload.title = file.name;
      payload.sourceType = 'file';
    } else if (activeTab === 'link') {
      initialText = urlInput;
      payload.url = urlInput;
      payload.title = urlInput;
      payload.sourceType = 'link';
    } else if (activeTab === 'audio') {
      initialText = transcript;
      payload.title = "Speech Transcript " + new Date().toLocaleTimeString();
      payload.sourceType = 'audio';
    } else if (activeTab === 'library') {
      initialText = extractedText; // Already set in handleMaterialSelect
      payload.title = fileName;
      payload.sourceType = 'library';
    }

    payload.text = initialText;
    setPreviewText(initialText);
    setPendingPayload(payload);
    setShowPreviewDialog(true);
  };

  const handleConfirmGeneration = async () => {
    setShowPreviewDialog(false);
    setLoading(true);

    try {
      const payload = { ...pendingPayload, text: previewText }; // Use edited text

      // Save material if user confirmed AND it's not already from the library
      if (saveToLibrary && payload.sourceType !== 'library') {
        let fileUrl = null;

        // Upload file to Supabase Storage if it's a file
        if (activeTab === 'file' && file) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}/${Date.now()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('materials')
            .upload(fileName, file);

          if (uploadError) {
            console.error("Error uploading file:", uploadError);
            // Continue without file_url if upload fails, or handle error
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('materials')
              .getPublicUrl(fileName);
            fileUrl = publicUrl;
          }
        }

        // Check for duplicates based on title and user_id
        const { data: existing } = await supabase
          .from('materials')
          .select('id')
          .eq('user_id', user.id)
          .eq('title', payload.title)
          .single();

        if (!existing) {
          await supabase.from('materials').insert({
            user_id: user.id,
            title: payload.title,
            content: payload.text,
            file_type: payload.sourceType || 'text',
            file_url: fileUrl // Save the file URL
          });
        } else {
          console.log("Material already exists, skipping save.");
        }
      }

      const { data, error } = await supabase.functions.invoke('generate-quiz', {
        body: payload,
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || "Failed to generate quiz");

      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 }, colors: ['#00F5FF', '#FF2E63'] });
      onQuizGenerated(data.quizId, data.title);
    } catch (err) {
      console.error("Quiz generation error:", err);
      setFileError(err.message || "Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
      setPendingPayload(null);
    }
  };

  const handleCancel = () => {
    setExtractedText("");
    setFile(null);
    setFileName("No file selected");
    setUrlInput("");
    setTranscript("");
    setIsListening(false);
    setSelectedMaterialId(null);
    if (recognition) recognition.stop();
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto p-4">
      {/* 🌌 Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-electric-cyan/10 rounded-full blur-[50px] sm:blur-[100px] pointer-events-none" />

      {loading ? (
        // 🌀 Loading State: Exploded Orb / Progress
        <div className="flex flex-col items-center justify-center min-h-[500px]">
          <div className="relative w-64 h-64">
            {/* Orbiting Dots */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.2 }}
                className="absolute inset-0 rounded-full border-t-4 border-electric-cyan/50"
                style={{ width: `${100 + i * 20}%`, height: `${100 + i * 20}%`, left: `-${i * 10}%`, top: `-${i * 10}%` }}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-electric-cyan/20 animate-pulse flex items-center justify-center">
                <Upload className="w-12 h-12 text-electric-cyan animate-bounce" />
              </div>
            </div>
          </div>
          <h2 className="mt-12 text-3xl font-bold text-white animate-pulse">{loadingText}</h2>
          <p className="text-gray-400 mt-2">AI is crafting your personalized quiz...</p>
        </div>
      ) : (
        // 🔮 Upload Orb Interface
        <div className="flex flex-col items-center gap-12">

          {/* Mode Switcher (Dock) */}
          <div className="flex gap-4 p-2 rounded-full glass-card overflow-x-auto max-w-full">
            {[
              { id: 'file', icon: Upload, label: 'Upload File' },
              { id: 'link', icon: LinkIcon, label: 'Paste Link' },
              { id: 'audio', icon: Mic, label: 'Record Audio' },
              { id: 'library', icon: FileText, label: 'My Library' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setActiveTab(mode.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 whitespace-nowrap ${activeTab === mode.id
                  ? 'bg-electric-cyan text-space-dark font-bold shadow-[0_0_20px_rgba(0,245,255,0.4)]'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <mode.icon className="w-5 h-5" />
                {mode.label}
              </button>
            ))}
          </div>

          {/* The Orb */}
          <motion.div
            layout
            className="relative group"
          >
            {/* Orb Container */}
            <motion.div
              animate={{
                scale: isDragging ? 1.1 : 1,
                borderColor: isDragging ? '#00F5FF' : 'rgba(255,255,255,0.2)'
              }}
              className={`
                relative flex items-center justify-center w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] rounded-full 
                glass-orb overflow-hidden transition-all duration-500
                ${activeTab === 'file' ? 'cursor-pointer' : ''}
              `}
            >
              {/* Inner Liquid/Ripple Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-electric-cyan/5 to-hot-magenta/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

              {activeTab === 'file' && (
                <label
                  htmlFor="file-upload"
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-4 cursor-pointer z-20"
                >
                  {file ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-electric-cyan/20 p-6 rounded-full">
                      <FileText className="w-16 h-16 text-electric-cyan" />
                    </motion.div>
                  ) : (
                    <Upload className="w-20 h-20 text-white/50 group-hover:text-electric-cyan transition-colors duration-300" />
                  )}

                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {file ? file.name : "Drag & Drop or Click"}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {file ? "Ready to generate" : "PDF, DOCX, TXT, Images (Max 10MB)"}
                    </p>
                  </div>
                </label>
              )}

              {activeTab === 'link' && (
                <div className="relative z-10 w-full px-12 pointer-events-auto">
                  <div className="flex flex-col items-center gap-4">
                    <LinkIcon className="w-16 h-16 text-hot-magenta" />
                    <input
                      type="url"
                      placeholder="Paste URL here..."
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      className="w-full bg-black/30 border border-white/20 rounded-xl p-4 text-white placeholder-gray-500 focus:border-hot-magenta focus:ring-1 focus:ring-hot-magenta outline-none text-center"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'audio' && (
                <div className="relative z-10 w-full px-12 pointer-events-auto flex flex-col items-center gap-6">
                  <motion.button
                    onClick={isListening ? stopListening : startListening}
                    animate={{ scale: isListening ? [1, 1.1, 1] : 1 }}
                    transition={{ repeat: isListening ? Infinity : 0, duration: 1.5 }}
                    className={`w-24 h-24 rounded-full flex items-center justify-center ${isListening ? 'bg-red-500 shadow-[0_0_30px_red]' : 'bg-white/10 hover:bg-white/20'}`}
                  >
                    {isListening ? <StopCircle className="w-10 h-10 text-white" /> : <Mic className="w-10 h-10 text-white" />}
                  </motion.button>
                  <p className="text-gray-400 text-sm text-center max-w-[200px] truncate">
                    {transcript || (isListening ? "Listening..." : "Tap to record")}
                  </p>
                </div>
              )}

              {activeTab === 'library' && (
                <div className="relative z-10 w-full h-full p-8 pointer-events-auto overflow-y-auto scrollbar-thin scrollbar-thumb-electric-cyan/20">
                  <h3 className="text-xl font-bold text-white mb-4 text-center sticky top-0 bg-space-dark/80 backdrop-blur-sm py-2 z-10">Select Material</h3>
                  <div className="space-y-2">
                    {existingMaterials.length > 0 ? (
                      existingMaterials.map(material => (
                        <div
                          key={material.id}
                          onClick={() => handleMaterialSelect(material)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedMaterialId === material.id ? 'bg-electric-cyan/20 border-electric-cyan' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                        >
                          <p className="text-sm font-medium text-white truncate">{material.title}</p>
                          <p className="text-xs text-gray-400">{new Date(material.created_at).toLocaleDateString()}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 mt-10">No materials found.</p>
                    )}
                  </div>
                </div>
              )}

              <input id="file-upload" type="file" accept={accept} onChange={handleFileChange} className="hidden" disabled={activeTab !== 'file'} />
            </motion.div>

            {/* Orbiting Particles around the Orb */}
            <div className="absolute inset-0 pointer-events-none">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-[-20px] rounded-full border border-white/5 border-dashed" />
              <motion.div animate={{ rotate: -360 }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute inset-[-40px] rounded-full border border-white/5 border-dashed opacity-50" />
            </div>
          </motion.div>

          {/* Settings & Generate Button */}
          <div className="w-full max-w-2xl space-y-6 glass-card p-6 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Instruction (Optional)</label>
                <input
                  type="text"
                  value={userPrompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Focus on key dates..."
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-electric-cyan outline-none"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-gray-400 text-sm mb-2 block">Questions</label>
                  <input
                    type="number"
                    value={quizCount}
                    onChange={(e) => setQuizCount(e.target.value)}
                    min="1" max="20"
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-electric-cyan outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-gray-400 text-sm mb-2 block">Type</label>
                  <Select value={quizType} onValueChange={setQuizType}>
                    <SelectTrigger className="bg-black/20 border-white/10 text-white h-[46px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-space-dark border-white/10 text-white">
                      <SelectItem value="mixed">Mixed</SelectItem>
                      <SelectItem value="multiple-choice">MCQ Only</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
              {(extractedText || urlInput || transcript) && (
                <Button variant="ghost" onClick={handleCancel} className="text-gray-400 hover:text-white hover:bg-white/5">
                  Clear
                </Button>
              )}
              <Button
                onClick={handleUploadAndGenerate}
                disabled={loading || (activeTab === 'file' && !extractedText) || (activeTab === 'link' && !urlInput) || (activeTab === 'audio' && !transcript) || (activeTab === 'library' && !selectedMaterialId)}
                className="bg-electric-cyan text-space-dark hover:bg-electric-cyan/90 font-bold px-8 py-6 rounded-xl shadow-[0_0_20px_rgba(0,245,255,0.3)] hover:shadow-[0_0_30px_rgba(0,245,255,0.5)] transition-all"
              >
                Generate Quiz
              </Button>
            </div>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {fileError && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute bottom-10 bg-red-500/10 border border-red-500/50 text-red-500 px-6 py-3 rounded-full backdrop-blur-md"
              >
                {fileError}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Preview & Edit Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="bg-space-dark border-white/10 text-white max-w-3xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-electric-cyan flex items-center gap-2">
              <Edit3 className="w-5 h-5" />
              Review & Edit Content
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Review the extracted content below. You can edit it before generating the quiz.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-hidden py-4">
            <textarea
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className="w-full h-full min-h-[300px] bg-black/20 border border-white/10 rounded-lg p-4 text-white placeholder-gray-500 focus:border-electric-cyan focus:ring-1 focus:ring-electric-cyan outline-none resize-none font-mono text-sm"
              placeholder="Extracted content will appear here..."
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-white/10 pt-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="save-library"
                checked={saveToLibrary}
                onCheckedChange={setSaveToLibrary}
                disabled={activeTab === 'library'}
                className="border-white/30 data-[state=checked]:bg-electric-cyan data-[state=checked]:text-space-dark disabled:opacity-50"
              />
              <Label htmlFor="save-library" className={`text-sm text-gray-300 cursor-pointer ${activeTab === 'library' ? 'opacity-50' : ''}`}>
                {activeTab === 'library' ? 'Already in Library' : 'Save to Knowledge Galaxy'}
              </Label>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="ghost" onClick={() => setShowPreviewDialog(false)} className="flex-1 sm:flex-none text-gray-400 hover:text-white hover:bg-white/5">
                Cancel
              </Button>
              <Button onClick={handleConfirmGeneration} className="flex-1 sm:flex-none bg-electric-cyan text-space-dark hover:bg-electric-cyan/90 font-bold">
                Confirm & Generate
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileUploadCard;
