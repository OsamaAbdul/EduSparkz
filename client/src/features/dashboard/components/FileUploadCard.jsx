'use client';

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Mic, Link as LinkIcon, StopCircle } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

// Spinner CSS
const spinnerStyles = `
  .custom-spinner {
    width: 32px;
    height: 32px;
    border: 4px solid rgba(172, 189, 170, 0.2);
    border-top: 4px solid #ACBDAA;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .blob {
    background: rgba(255, 82, 82, 1);
    box-shadow: 0 0 0 0 rgba(255, 82, 82, 1);
    animation: pulse-red 2s infinite;
  }
  @keyframes pulse-red {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 82, 82, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(255, 82, 82, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(255, 82, 82, 0); }
  }
`;

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
  const [quizCount, setQuizCount] = useState("");
  const [quizType, setQuizType] = useState("mixed");
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("file");
  const [urlInput, setUrlInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [recognition, setRecognition] = useState(null);

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

  // Confirmation Dialog State
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [pendingPayload, setPendingPayload] = useState(null);

  const { user } = useUser();

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
      const texts = ["Getting ready...", "Processing...", "Almost ready...", "Hold on a little..."];
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

  const convertBlobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
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

    if (activeTab === 'file') {
      payload.text = extractedText;
      payload.title = file.name;
      payload.sourceType = 'file';
    } else if (activeTab === 'link') {
      payload.url = urlInput;
      payload.title = urlInput;
      payload.sourceType = 'link';
    } else if (activeTab === 'audio') {
      payload.title = "Speech Transcript " + new Date().toLocaleTimeString();
      payload.sourceType = 'audio'; // Keep as audio or change to text, but backend might expect 'audio' source type logic. 
      // Actually, since we have text now, we can treat it as text content.
      payload.text = transcript;
      // We don't need audio blob anymore.
    }

    setPendingPayload(payload);
    setShowSaveDialog(true);
  };

  const processQuizGeneration = async (shouldSave) => {
    setShowSaveDialog(false);
    setLoading(true);

    try {
      const payload = pendingPayload;

      // Save material if user confirmed
      if (shouldSave) {
        if (payload.sourceType === 'file') {
          await supabase.from('materials').insert({
            user_id: user.id,
            title: payload.title,
            content: payload.text,
            file_type: file.type.split('/')[1] || 'text',
          });
        }
        // For link and audio, we might save after generation if we get extracted text back,
        // or we can save the URL/metadata now.
        // The original logic saved extracted text for audio/link AFTER generation.
        // We'll keep that logic but flag it.
      }

      const { data, error } = await supabase.functions.invoke('generate-quiz', {
        body: payload,
      });

      if (error) throw error;
      if (!data.success) throw new Error(data.error || "Failed to generate quiz");

      // Save extracted text for audio/link if requested and available
      if (shouldSave && (payload.sourceType === 'audio' || payload.sourceType === 'link') && data.extractedText) {
        await supabase.from('materials').insert({
          user_id: user.id,
          title: payload.title,
          content: data.extractedText,
          file_type: payload.sourceType,
        });
      }

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
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
    if (recognition) recognition.stop();
  };

  return (
    <div className="space-y-6">
      <style>{spinnerStyles}</style>
      <Card className="bg-white/80 dark:bg-[#1E2D4C]/80 backdrop-blur-xl border border-[#ACBDAA]/30 w-full flex flex-col shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-[#1E2D4C] dark:text-[#ACBDAA]">Upload Study Materials</CardTitle>
          <CardDescription className="text-[#1E2D4C]/70 dark:text-[#ACBDAA]/70">
            Upload a file, share a link, or record audio to generate a quiz.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <div className="custom-spinner" />
              <span className="text-[#1E2D4C] dark:text-[#ACBDAA] animate-pulse">{loadingText}</span>
            </div>
          ) : (
            <div className="w-full space-y-6">
              <Tabs defaultValue="file" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-[#ACBDAA]/20">
                  <TabsTrigger value="file" className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#1E2D4C]">
                    <Upload className="w-4 h-4 mr-2" /> File
                  </TabsTrigger>
                  <TabsTrigger value="link" className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#1E2D4C]">
                    <LinkIcon className="w-4 h-4 mr-2" /> Link
                  </TabsTrigger>
                  <TabsTrigger value="audio" className="data-[state=active]:bg-white dark:data-[state=active]:bg-[#1E2D4C]">
                    <Mic className="w-4 h-4 mr-2" /> Audio
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <TabsContent value="file" className="space-y-4">
                    <motion.label
                      htmlFor="file"
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      whileHover={{ scale: 1.01 }}
                      className={`block w-full p-6 sm:p-8 rounded-xl text-center cursor-pointer border-2 border-dashed transition-all
                        ${isDragging ? "border-[#ACBDAA] bg-[#ACBDAA]/20" : "border-[#ACBDAA]/30 bg-white/50 dark:bg-[#1E2D4C]/30"}
                      `}
                    >
                      <motion.div
                        animate={{ scale: file ? 1.05 : 1 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="flex flex-col items-center gap-2"
                      >
                        <div className="p-4 rounded-full bg-[#ACBDAA]/10">
                          <Upload className="h-8 w-8 text-[#1E2D4C] dark:text-[#ACBDAA]" />
                        </div>
                        <span className="font-medium text-[#1E2D4C] dark:text-[#ACBDAA]">
                          {fileName !== "No file selected" ? fileName : "Click to upload or drag & drop"}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          PDF, DOCX, TXT, JPG, PNG (Max 10MB)
                        </span>
                      </motion.div>
                      <input id="file" type="file" accept={accept} onChange={handleFileChange} className="hidden" />
                    </motion.label>
                  </TabsContent>

                  <TabsContent value="link" className="space-y-4">
                    <div className="p-8 rounded-xl border-2 border-dashed border-[#ACBDAA]/30 bg-white/50 dark:bg-[#1E2D4C]/30">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 rounded-full bg-[#ACBDAA]/10">
                          <LinkIcon className="h-8 w-8 text-[#1E2D4C] dark:text-[#ACBDAA]" />
                        </div>
                        <input
                          type="url"
                          placeholder="Paste your article or website URL here..."
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          className="w-full p-3 rounded-lg text-[#1E2D4C] dark:text-[#ACBDAA] placeholder-[#1E2D4C]/50 dark:placeholder-[#ACBDAA]/70 bg-white dark:bg-[#0D1117] focus:outline-none focus:ring-2 focus:ring-[#ACBDAA] border border-[#ACBDAA]/30"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="audio" className="space-y-4">
                    <div className="p-8 rounded-xl border-2 border-dashed border-[#ACBDAA]/30 bg-white/50 dark:bg-[#1E2D4C]/30">
                      <div className="flex flex-col items-center gap-6">
                        <div className={`relative p-6 rounded-full transition-all duration-300 ${isListening ? 'blob' : 'bg-[#ACBDAA]/10'}`}>
                          <Mic className={`h-10 w-10 ${isListening ? 'text-white' : 'text-[#1E2D4C] dark:text-[#ACBDAA]'}`} />
                        </div>

                        <div className="flex gap-4">
                          {!isListening ? (
                            <Button
                              onClick={startListening}
                              className="bg-[#1E2D4C] dark:bg-[#ACBDAA] text-white dark:text-[#1E2D4C] hover:opacity-90"
                            >
                              Start Listening
                            </Button>
                          ) : (
                            <Button
                              onClick={stopListening}
                              variant="destructive"
                              className="animate-pulse"
                            >
                              <StopCircle className="w-4 h-4 mr-2" /> Stop Listening
                            </Button>
                          )}
                        </div>

                        <div className="w-full max-w-md">
                          <textarea
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            placeholder="Speak to transcribe..."
                            className="w-full h-32 p-3 rounded-lg bg-white dark:bg-[#0D1117] border border-[#ACBDAA]/30 text-[#1E2D4C] dark:text-[#ACBDAA] focus:outline-none focus:ring-2 focus:ring-[#ACBDAA]"
                          />
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {isListening ? 'Listening...' : 'Click start to convert speech to text'}
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>

              <AnimatePresence>
                {fileError && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className="text-red-500 dark:text-red-400 text-sm text-center"
                  >
                    {fileError}
                  </motion.p>
                )}
              </AnimatePresence>

              <div className="space-y-4 pt-4 border-t border-[#ACBDAA]/20">
                <motion.input
                  type="text"
                  placeholder="Add specific instructions for the AI (optional)"
                  value={userPrompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  maxLength={500}
                  whileFocus={{ scale: 1.01 }}
                  className="w-full p-3 rounded-lg text-[#1E2D4C] dark:text-[#ACBDAA] placeholder-[#1E2D4C]/50 dark:placeholder-[#ACBDAA]/70 bg-white/50 dark:bg-[#1E2D4C]/30 focus:outline-none focus:ring-2 focus:ring-[#ACBDAA] border border-[#ACBDAA]/30"
                />

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.input
                    type="number"
                    placeholder="Count (5)"
                    value={quizCount}
                    onChange={(e) => setQuizCount(e.target.value)}
                    min="1" max="20"
                    whileFocus={{ scale: 1.01 }}
                    className="w-full sm:w-1/3 p-3 rounded-lg text-[#1E2D4C] dark:text-[#ACBDAA] placeholder-[#1E2D4C]/50 dark:placeholder-[#ACBDAA]/70 bg-white/50 dark:bg-[#1E2D4C]/30 focus:outline-none focus:ring-2 focus:ring-[#ACBDAA] border border-[#ACBDAA]/30"
                  />

                  <Select value={quizType} onValueChange={setQuizType}>
                    <SelectTrigger className="w-full sm:w-2/3 p-3 h-auto rounded-lg text-[#1E2D4C] dark:text-[#ACBDAA] bg-white/50 dark:bg-[#1E2D4C]/30 border-[#ACBDAA]/30 focus:ring-[#ACBDAA]">
                      <SelectValue placeholder="Quiz Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#1E2D4C] border-[#ACBDAA]/30">
                      <SelectItem value="mixed">Mixed (MCQ & T/F)</SelectItem>
                      <SelectItem value="multiple-choice">Multiple Choice Only</SelectItem>
                      <SelectItem value="true-false">True/False Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  {(extractedText || urlInput || transcript) && (
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="text-[#1E2D4C] dark:text-[#ACBDAA] border-[#ACBDAA]/30 hover:bg-[#ACBDAA]/10"
                    >
                      Clear
                    </Button>
                  )}
                  <Button
                    onClick={handleUploadAndGenerate}
                    className="bg-[#ACBDAA] text-[#1E2D4C] hover:opacity-90 px-8"
                    disabled={loading || (activeTab === 'file' && !extractedText) || (activeTab === 'link' && !urlInput) || (activeTab === 'audio' && !transcript)}
                  >
                    Generate Quiz
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        {/* Text Preview for File Upload only */}
        {activeTab === 'file' && extractedText && !loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-[#ACBDAA]/30"
          >
            <div className="p-6">
              <h3 className="text-sm font-semibold text-[#1E2D4C] dark:text-[#ACBDAA] mb-2">Extracted Text Preview</h3>
              <textarea
                value={extractedText}
                onChange={(e) => setExtractedText(e.target.value)}
                className="w-full h-48 p-3 rounded-lg bg-white/50 dark:bg-[#1E2D4C]/30 text-[#1E2D4C] dark:text-[#ACBDAA] text-sm font-mono border border-[#ACBDAA]/30 focus:outline-none"
              />
            </div>
          </motion.div>
        )}
      </Card>

      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent className="bg-white dark:bg-[#1E2D4C] border-[#ACBDAA]/30">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#1E2D4C] dark:text-[#ACBDAA]">Save Material?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-500 dark:text-[#ACBDAA]/70">
              Do you want to save this material to your library for future use?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => processQuizGeneration(false)}
              className="border-[#ACBDAA]/30 text-[#1E2D4C] dark:text-[#ACBDAA] hover:bg-[#ACBDAA]/10"
            >
              Don't Save
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => processQuizGeneration(true)}
              className="bg-[#ACBDAA] text-[#1E2D4C] hover:bg-[#ACBDAA]/90"
            >
              Save & Generate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FileUploadCard;
