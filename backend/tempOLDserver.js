import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import prisma from "./db.js";
import pdfParse from "pdf-parse";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3007;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Vite default port
    credentials: true,
  })
);
app.use(express.json());

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

// Groq API function
async function callGroqAPI(prompt) {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not set in environment variables");
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Groq API Error: ${errorData.error?.message || "Unknown error"}`
      );
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Groq API Error:", error);
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
}

// Route: Generate questions from topic
app.post("/generate-questions", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic || !topic.trim())
      return res.status(400).json({ error: "Topic is required" });

    const prompt = `Generate only the questions (no answers) for the topic "${topic}". 
    Create 10 unique and diverse assignment questions. 

    Include a mix of:
    - Multiple choice questions (just the question, no options)
    - Short answer questions  
    - Essay questions
    - Problem-solving questions
    - Critical thinking questions

    Do not give answers or explanations or introductory text or main topic title.
    Format them clearly as:
    1. 
    2.
    ...
    10.`;

    const questionsText = await callGroqAPI(prompt);

    // Save questions to DB
    const questionList = questionsText
      .split(/\n\d+\./) // splits on "1. ", "2. ", etc.
      .filter(Boolean)
      .map((q) => q.trim());

    // for (const content of questionList) {
    //   await prisma.question.create({
    //     data: {
    //       content,
    //       source: "TOPIC",
    //       topic: topic.trim(),
    //     },
    //   });
    // }

    res.json({ questions: questionsText });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate and store questions" });
  }
});

// Route: Upload PDF and generate questions (simplified without pdf-parse)
app.post("/upload-pdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required" });
    }

    console.log(`Processing real PDF: ${req.file.originalname}`);

    // ✅ Read actual content from the uploaded PDF
    const pdfBuffer = req.file.buffer;
    const pdfData = await pdfParse(pdfBuffer);
    const extractedText = pdfData.text;

    // ✅ Prepare the prompt using real content
    const prompt = `You are given the following educational content extracted from a PDF document.

1. First, identify the **main topic** or subject based on the text.
2. Then, generate **10 assignment questions** based on that identified topic.

 Very Important:
Do not give answers or explanations or introductory text or main topic title.
    Format them clearly as:
    1. 
    2. 
    ...
    10.

Ensure the questions are educational and diverse, including:
- Multiple choice (just the question, no options)
- Short answer
- Essay
- Problem-solving
- Critical thinking

 Extracted PDF Content:
"""
${extractedText}
"""`;

    // ✅ Ask Groq to generate questions
    const questionsText = await callGroqAPI(prompt);

    // ✅ Save questions to DB
    const questionList = questionsText
      .split(/\n\d+\./)
      .filter(Boolean)
      .map((q) => q.trim());
    // Extract file name without extension
    const originalFileName = req.file.originalname;
    const fileNameWithoutExtension = originalFileName
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]/g, " ");

    // for (const content of questionList) {
    //   await prisma.question.create({
    //     data: {
    //       content,
    //       source: "PDF",
    //       topic: fileNameWithoutExtension,
    //     },
    //   });
    // }

    res.json({ questions: questionsText });
  } catch (error) {
    console.error("Error processing real PDF:", error);
    res.status(500).json({ error: error.message || "Failed to process PDF" });
  }
});

// Health check route
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "AutoAssign API is running",
    timestamp: new Date().toISOString(),
    groqApiKey: process.env.GROQ_API_KEY ? "Set" : "Not Set",
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Server Error:", error);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(` AutoAssign server running on http://localhost:${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/health`);
  console.log(
    ` Groq API Key: ${process.env.GROQ_API_KEY ? "Loaded" : "NOT FOUND"}`
  );
});
