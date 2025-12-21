const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const pdfService = require('./services/pdfService');
const vectorStore = require('./services/vectorStore');
const qaService = require('./services/qaService');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are supported'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Service is running' });
});

// Upload PDF file
app.post('/api/upload', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a PDF file' });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    // Parse PDF
    const text = await pdfService.parsePDF(filePath);
    
    // Split text into chunks
    const chunks = pdfService.splitText(text);
    
    // Generate embeddings and store
    const documentId = await vectorStore.addDocument(fileName, chunks);
    
    // Delete temporary file
    fs.unlinkSync(filePath);

    res.json({
      success: true,
      message: 'PDF uploaded and processed successfully',
      documentId,
      fileName,
      chunksCount: chunks.length
    });
  } catch (error) {
    console.error('Upload error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message || 'Error processing PDF file' });
  }
});

// Q&A endpoint
app.post('/api/ask', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({ error: 'Please enter a question' });
    }

    // Search for relevant document chunks
    const relevantChunks = await vectorStore.search(question, 3);
    
    if (relevantChunks.length === 0) {
      return res.json({
        answer: 'Sorry, no relevant document content found. Please upload a PDF file first.',
        sources: []
      });
    }

    // Call OpenAI API to generate answer
    const answer = await qaService.generateAnswer(question, relevantChunks);

    res.json({
      answer,
      sources: relevantChunks.map(chunk => ({
        text: chunk.text.substring(0, 200) + '...',
        documentName: chunk.documentName
      }))
    });
  } catch (error) {
    console.error('Q&A error:', error);
    res.status(500).json({ error: error.message || 'Error generating answer' });
  }
});

// Get all documents
app.get('/api/documents', (req, res) => {
  try {
    const documents = vectorStore.getAllDocuments();
    res.json({ documents });
  } catch (error) {
    console.error('Error getting documents:', error);
    res.status(500).json({ error: error.message || 'Error getting documents list' });
  }
});

// Clear all documents
app.delete('/api/documents', (req, res) => {
  try {
    vectorStore.clearAll();
    res.json({ success: true, message: 'All documents cleared' });
  } catch (error) {
    console.error('Error clearing documents:', error);
    res.status(500).json({ error: error.message || 'Error clearing documents' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

