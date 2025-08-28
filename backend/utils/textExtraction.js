import pdf from 'pdf-parse';
import { createWorker } from 'tesseract.js';
import { convert } from 'pdf-img-convert'; // Fixed import
import mammoth from 'mammoth';
import sharp from 'sharp';
import chardet from 'chardet';
import iconv from 'iconv-lite';

// Validate PDF integrity
const isValidPDF = async (pdfBuffer) => {
  try {
    await pdf(pdfBuffer, { max: 1 });
    return true;
  } catch (err) {
    return false;
  }
};

// For regular PDFs
export const extractTextFromPDF = async (pdfBuffer) => {
  try {
    if (!(await isValidPDF(pdfBuffer))) {
      throw new Error('Invalid or corrupted PDF file');
    }

    const data = await pdf(pdfBuffer);
    
    if (data.text.trim().length < 50 && data.numpages > 0) {
      return await extractTextFromScannedPDF(pdfBuffer);
    }
    
    return data.text;
  } catch (error) {
    console.error('PDF extraction failed, trying OCR fallback:', error.message);
    return await extractTextFromScannedPDF(pdfBuffer);
  }
};

// For scanned/image-based PDFs
export const extractTextFromScannedPDF = async (pdfBuffer) => {
  const worker = await createWorker();
  let fullText = '';
  
  try {
    const images = await convert(pdfBuffer, { // Updated to use named export
      scale: 2.0,
      page_numbers: [1, 2, 3, 4, 5],
    });
    
    for (const [index, image] of images.entries()) {
      const preprocessed = await sharp(image)
        .grayscale()
        .normalize()
        .toBuffer();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');
      const { data } = await worker.recognize(preprocessed);
      fullText += `\n\nPage ${index + 1}:\n${data.text}\n`;
    }
    
    return fullText;
  } catch (err) {
    throw new Error(`OCR failed: ${err.message}`);
  } finally {
    await worker.terminate();
  }
};

// For DOCX files
export const extractTextFromDOCX = async (docxBuffer) => {
  try {
    const result = await mammoth.extractRawText({ buffer: docxBuffer });
    if (!result.value?.trim()) {
      throw new Error('No extractable text in DOCX file');
    }
    return result.value;
  } catch (err) {
    throw new Error(`DOCX extraction failed: ${err.message}`);
  }
};

// For images (JPG/PNG)
export const extractTextFromImage = async (imageBuffer) => {
  const worker = await createWorker();
  try {
    const preprocessed = await sharp(imageBuffer)
      .grayscale()
      .normalize()
      .toBuffer();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data } = await worker.recognize(preprocessed);
    return data.text;
  } catch (err) {
    throw new Error(`Image OCR failed: ${err.message}`);
  } finally {
    await worker.terminate();
  }
};

// For plain text files
export const extractTextFromTXT = async (txtBuffer) => {
  try {
    const encoding = chardet.detect(txtBuffer) || 'utf-8';
    const text = iconv.decode(txtBuffer, encoding);
    if (!text?.trim()) {
      throw new Error('No extractable text in TXT file');
    }
    return text;
  } catch (err) {
    throw new Error(`TXT extraction failed: ${err.message}`);
  }
};