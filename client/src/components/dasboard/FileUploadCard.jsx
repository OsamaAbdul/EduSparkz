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

// Set up pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

// Custom CSS for spinner
const spinnerStyles = `
  .custom-spinner {
    width: 32px;
    height: 32px;
    border: 4px solid rgba(255, 255, 255, 0.1);
    border-top: 4px solid #a855f7; /* Matches purple-400 */
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

  useEffect(() => {
    if (fileError) {
      const timer = setTimeout(() => setFileError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [fileError]);

  useEffect(() => {
    if (loading) {
      const texts = ["Getting ready...", "Processing...", "Almost ready...", "Hold on a little....."];
      let index = 0;
      const interval = setInterval(() => {
        setLoadingText(texts[index]);
        index = (index + 1) % texts.length;
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  const extractTextFromFile = async (file) => {
    const fileType = file.type;
    try {
      if (fileType === "application/pdf") {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/extract-pdf-text`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('PDF text extraction failed');
      }
      const { text } = await response.json();
      return text;
      } else if (fileType === "text/plain") {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsText(file);
        });
      } else if (fileType === "image/jpeg" || fileType === "image/png") {
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
    const maxSize = 10 * 1024 * 1024; // 10MB limit
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      if (selectedFile.size > maxSize) {
        setFileError("File size exceeds 10MB limit.");
        return;
      }
      setFileError("");
      setFileName(selectedFile.name);
      setFile(selectedFile);
      setLoading(true);
      try {
        const text = await extractTextFromFile(selectedFile);
        console.log("Extracted text length:", text.length);
        setExtractedText(text);
      } catch (err) {
        setFileError(`Text extraction failed: ${err.message}. Try a different file.`);
        setFileName("No file selected");
        setFile(null);
        setExtractedText("");
      } finally {
        setLoading(false);
      }
    } else {
      setFileError("Only PDF, text (.txt), image (JPEG, PNG), or Word (.docx) files are allowed");
      setFileName("No file selected");
      setFile(null);
      setExtractedText("");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    const allowedTypes = [
      "text/plain",
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB limit
    if (droppedFile && allowedTypes.includes(droppedFile.type)) {
      if (droppedFile.size > maxSize) {
        setFileError("File size exceeds 10MB limit.");
        return;
      }
      setFileError("");
      setFileName(droppedFile.name);
      setFile(droppedFile);
      setLoading(true);
      try {
        const text = await extractTextFromFile(droppedFile);
        console.log("Extracted text length:", text.length);
        setExtractedText(text);
      } catch (err) {
        setFileError(`Text extraction failed: ${err.message}. Try a different file.`);
        setFileName("No file selected");
        setFile(null);
        setExtractedText("");
      } finally {
        setLoading(false);
      }
    } else {
      setFileError("Only PDF, text (.txt), image (JPEG, PNG), or Word (.docx) files are allowed");
    }
  };

  const handleUploadAndGenerate = async () => {
    if (!file || !extractedText) {
      setFileError("Please select a valid file with extractable text.");
      return;
    }
    setLoading(true);
    try {
      const parsedQuizCount = quizCount ? parseInt(quizCount) : 5;
      if (isNaN(parsedQuizCount) || parsedQuizCount < 1 || parsedQuizCount > 20) {
        throw new Error("Quiz count must be a number between 1 and 20");
      }
      const payload = {
        text: extractedText,
        userPrompt,
        quizCount: parsedQuizCount,
        title: file.name || userPrompt || "Generated Quiz",
      };
      console.log("Sending payload to backend:", payload);
      const token = user.token;
      if (!token) {
        navigate('/api/auth/login');
        throw new Error("No authentication token found. Please log in.");
      }
      localStorage.setItem("authToken", token);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/generate-quiz`, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.statusText}`);
      }
      const result = await response.json();
      console.log("API response:", result);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      onQuizGenerated(result.quizId, file.name || userPrompt || "Generated Quiz");
    } catch (err) {
      console.error("🚨 Error:", err);
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
      <Card className="bg-black/50 backdrop-blur-xl border-white/10 w-full h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-white">Upload Study Materials</CardTitle>
          <CardDescription className="text-gray-400">Upload only .docx, PDF or Image to start quizzing.....</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="custom-spinner" />
              <span className="text-white">{loadingText}</span>
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
                className={`block w-full p-4 bg-white/5 rounded-lg text-gray-300 text-center cursor-pointer border-2 transition-all ${
                  isDragging ? "border-purple-500 bg-purple-600/20" : "border-white/10"
                }`}
              >
                <motion.div
                  animate={{ scale: file ? 1.1 : 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Upload className="mx-auto h-8 w-8 text-purple-400" />
                  <span className="font-medium">{fileName}</span>
                </motion.div>
                <input
                  id="file"
                  type="file"
                  accept={accept}
                  onChange={handleFileChange}
                  className="hidden"
                />
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
              <div className="relative">
                <motion.input
                  type="text"
                  placeholder="Enter a prompt (optional). e.g, the quiz should cover a particular topic from the file"
                  value={userPrompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  maxLength={500}
                  whileFocus={{ scale: 1.02 }}
                  className="w-full p-3 bg-white/5 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <span className="absolute right-3 top-3 text-gray-500 text-xs">
                  {userPrompt.length}/500
                </span>
              </div>
              <motion.input
                type="number"
                placeholder="Number of quiz questions (default: 5)"
                value={quizCount}
                onChange={(e) => setQuizCount(e.target.value)}
                min="1"
                max="20"
                whileFocus={{ scale: 1.02 }}
                className="w-full p-3 bg-white/5 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {extractedText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-black/50 backdrop-blur-xl border-white/10 w-full">
              <CardHeader>
                <CardTitle className="text-white">Preview Document Texts</CardTitle>
                <CardDescription className="text-gray-400">
                  Review the text below. Click <span className="text-red-500">Generate Quiz</span> to proceed or "Cancel" to select a different file.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex flex-col items-center space-y-2">
                    <div className="custom-spinner" />
                    <span className="text-white">{loadingText}</span>
                  </div>
                ) : (
                  <>
                    <textarea
                      value={extractedText}
                      readOnly
                      className="w-full h-64 p-3 bg-white/5 rounded-lg text-white placeholder-gray-400 focus:outline-none border border-white/10"
                      placeholder="Extracted text will appear here..."
                    />
                    <div className="mt-4 flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="text-black border-white/20 "
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUploadAndGenerate}
                        className="bg-purple-600 "
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
      </AnimatePresence>
    </div>
  );
};

export default FileUploadCard;