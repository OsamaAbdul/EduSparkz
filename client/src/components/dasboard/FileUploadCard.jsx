'use client';

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useUser } from '../../context/useContext.jsx';
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import Tesseract from 'tesseract.js';
import mammoth from 'mammoth';

// PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

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
  const [isDragging, setIsDragging] = useState(false);

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
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/extract-pdf-text`, { method: 'POST', body: formData });
        if (!response.ok) throw new Error('PDF text extraction failed');
        const { text } = await response.json();
        return text;
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
    setIsDragging(["dragenter","dragover"].includes(e.type));
  };

  const handleDrop = async e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFileChange({ target: { files: [droppedFile] } });
  };

  const handleUploadAndGenerate = async () => {
    if (!file || !extractedText) {
      setFileError("Please select a valid file with extractable text.");
      return;
    }
    setLoading(true);
    try {
      const count = quizCount ? parseInt(quizCount) : 5;
      if (isNaN(count) || count < 1 || count > 20) throw new Error("Quiz count must be 1-20");
      const payload = { text: extractedText, userPrompt, quizCount: count, title: file.name || userPrompt || "Generated Quiz" };
      const token = user.token;
      if (!token) throw new Error("No auth token found.");
      localStorage.setItem("authToken", token);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/generate-quiz`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Server error");
      }
      const result = await response.json();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onQuizGenerated(result.quizId, file.name || userPrompt || "Generated Quiz");
    } catch (err) {
      setFileError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setExtractedText("");
    setFile(null);
    setFileName("No file selected");
  };

  return (
    <div className="space-y-6">
      <style>{spinnerStyles}</style>
      <Card className="bg-[#1E2D4C]/90 backdrop-blur-xl border border-[#ACBDAA]/30 w-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center text-[#ACBDAA]">Upload Study Materials</CardTitle>
          <CardDescription className="text-[#ACBDAA]/70">Upload only .docx, PDF or Image to start quizzing...</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="custom-spinner" />
              <span className="text-[#ACBDAA]">{loadingText}</span>
            </div>
          ) : (
            <div className="w-full max-w-md space-y-4">
              <motion.label
                htmlFor="file"
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                whileHover={{ scale: 1.02 }}
                className={`block w-full p-4 rounded-full text-center cursor-pointer border-2 transition-all
                  ${isDragging ? "border-[#ACBDAA] bg-[#ACBDAA]/20" : "border-[#ACBDAA]/30 bg-[#1E2D4C]/30"}
                `}
              >
                <motion.div
                  animate={{ scale: file ? 1.05 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Upload className="mx-auto h-8 w-8 text-[#ACBDAA]" />
                  <span className="font-medium text-[#ACBDAA]">{fileName}</span>
                </motion.div>
                <input id="file" type="file" accept={accept} onChange={handleFileChange} className="hidden" />
              </motion.label>

              <AnimatePresence>
                {fileError && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.3 }}
                    className="text-red-400 text-sm text-center"
                  >
                    {fileError}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.input
                type="text"
                placeholder="Enter a prompt (optional)"
                value={userPrompt}
                onChange={(e) => setPrompt(e.target.value)}
                maxLength={500}
                whileFocus={{ scale: 1.02 }}
                className="w-full p-3 rounded-lg text-[#ACBDAA] placeholder-[#ACBDAA]/70 bg-[#1E2D4C]/30 focus:outline-none focus:ring-2 focus:ring-[#ACBDAA] border-[#ACBDAA]/30 bg-[#1E2D4C]/30"
              />
              <motion.input
                type="number"
                placeholder="Number of quiz questions (default: 5)"
                value={quizCount}
                onChange={(e) => setQuizCount(e.target.value)}
                min="1" max="20"
                whileFocus={{ scale: 1.02 }}
                className="w-full p-3 rounded-lg text-[#ACBDAA] placeholder-[#ACBDAA]/70 bg-[#1E2D4C]/30 focus:outline-none focus:ring-2 focus:ring-[#ACBDAA]"
              />
            </div>
          )}
        </CardContent>
        {extractedText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <Card className="bg-[#1E2D4C]/80 border border-[#ACBDAA]/30">
              <CardHeader>
                <CardTitle className="text-[#ACBDAA]">Preview Document Texts</CardTitle>
                <CardDescription className="text-[#ACBDAA]/70">
                  Review below. Click <span className="text-[#ACBDAA]">Generate Quiz</span> or "Cancel".
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="custom-spinner" />
                    <span className="text-[#ACBDAA]">{loadingText}</span>
                  </div>
                ) : (
                  <>
                    <textarea
                      value={extractedText}
                      readOnly
                      className="w-full h-64 p-3 rounded-lg bg-[#1E2D4C]/30 text-[#ACBDAA] placeholder-[#ACBDAA]/50 border border-[#ACBDAA]/30 focus:outline-none"
                    />
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="text-[#ACBDAA] border-[#ACBDAA]/30"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUploadAndGenerate}
                        className="bg-[#ACBDAA] text-[#1E2D4C] hover:opacity-90"
                      >
                        Generate Quiz
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </Card>
    </div>
  );
};

export default FileUploadCard;
