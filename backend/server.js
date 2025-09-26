import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";
import session from "express-session";
import prisma from "./db.js";
import bcrypt from "bcrypt";
import pdfParse from "pdf-parse";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3007;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Vite default port
    credentials: true,
  }),
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);
app.use(express.json());

// Configure multer for file uploads
// Student uploads
const studentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const studentUpload = multer({ storage: studentStorage });

//Faculty Uploads
const facultyUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
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

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  

  try {
    // Check student first
    const student = await prisma.student.findUnique({
      where: { email },
    });

    if (student) {
      const isMatch = await bcrypt.compare(password, student.passwordHash);
      if (!isMatch) return res.status(401).json({ error: 'Invalid email or password.' });

      req.session.user = {
        id: student.student_id,
        email: student.email,
        name: student.name,
        role: 'student',
      };
      return res.status(200).json({ role: 'student', user: req.session.user });
    }
    

    // If not student, check faculty
    const faculty = await prisma.faculty.findUnique({
      where: { email },
    });
    console.log("Faculty found:", faculty);

    if (faculty) {
      const isMatch = await bcrypt.compare(password, faculty.passwordHash);
      console.log("Password match:", isMatch);
      if (!isMatch) return res.status(401).json({ error: 'Invalid email or password.' });

      req.session.user = {
        id: faculty.faculty_id,
        email: faculty.email,
        name: faculty.name,
        role: 'faculty',
      };
      return res.status(200).json({ role: 'faculty', user: req.session.user });
    }
    console.log("No user found");
    return res.status(401).json({ error: 'Invalid email or password.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed.' });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error during logout:', err);
      return res.status(500).json({ error: 'An error occurred during logout.' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logout successful' });
  });
});

// Function to validate password
const validatePassword = (password) => {
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,10}$/;
  return passwordPattern.test(password);
};

app.post('/api/change-password', async (req, res) => {
  const { userId, role, newPassword, currentPassword } = req.body;

  try {
    let user;

    // 🔹 Find the user based on role
    if (role === 'student') {
      user = await prisma.student.findUnique({ where: { student_id: userId } });
    } else if (role === 'faculty') {
      user = await prisma.faculty.findUnique({ where: { faculty_id: userId } });
    } else {
      return res.status(400).json({ error: 'Invalid role provided.' });
    }

    // 🔹 Check if user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // 🔹 Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    // 🔹 Validate new password
    if (!validatePassword(newPassword)) {
      return res.status(400).json({ error: 'Password does not meet criteria.' });
    }

    // 🔹 Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 🔹 Update password in the correct table
    if (role === 'student') {
      await prisma.student.update({
        where: { student_id: userId },
        data: { passwordHash: hashedPassword },
      });
    } else if (role === 'faculty') {
      await prisma.faculty.update({
        where: { faculty_id: userId },
        data: { passwordHash: hashedPassword },
      });
    }

    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});


// Add new faculty
app.post('/api/add-faculty', async (req, res) => {
  try {
    const { facultyName, department, email } = req.body;
    const password = email.split('@')[0]; // Initial password = email prefix
    console.log("Initial password:", password);
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("Hashed password:", hashedPassword);

    // Insert into DB
    const newFaculty = await prisma.faculty.create({
      data: {
        name: facultyName,
        department,
        email,
        passwordHash: hashedPassword
      }
    });

    res.status(201).json({ message: 'Faculty added successfully', faculty: newFaculty });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
});

app.get('/api/batches', async (req, res) => {
  const { department, semester } = req.query;

  try {
    const currentYear = new Date().getFullYear();

    const batches = await prisma.batch.findMany({
      where: {
        department,
        semester: Number(semester),
        year: currentYear
      }
    });

    res.json(batches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch batches" });
  }
});


// Add new Student
app.post('/api/add-student', async (req, res) => {
  try {
    const { studentId, studentName, department, email, dob, batch } = req.body;
    const dobDate = new Date(dob);
    const dobString = dobDate.toISOString().split('T')[0];

    // Default password = ddmmyyyy
    const rawPassword = `${('0' + dobDate.getDate()).slice(-2)}${('0' + (dobDate.getMonth() + 1)).slice(-2)}${dobDate.getFullYear()}`;

    // Hash password
    const hashedPassword = await bcrypt.hash(rawPassword, 10); // 10 = salt rounds

    await prisma.student.create({
      data: {
        student_id: studentId,
        name: studentName,
        email,
        dob: dobString,
        batch_id: parseInt(batch, 10),
        passwordHash: hashedPassword,
      },
    });

    res.status(201).json({ message: 'Student added successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
});

// GET all courses a student is enrolled in
app.get('/api/student/courses/:studentId', async (req, res) => {
  const { studentId } = req.params;

  try {
    const studentCourses = await prisma.takes.findMany({
      where: {
        student_id: studentId,
      },
      include: {
        course: true,
      },
    });

    // Map to return only distinct courses with CourseID + Title
    const courses = studentCourses.map(sc => ({
      CourseID: sc.course.subject_code,
      Title: sc.course.title,
    }));

    res.status(200).json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'An error occurred while fetching courses.' });
  }
});

// get assignments on student dashboard
app.get('/api/student/assignments/:studentId/:courseId', async (req, res) => {
  const { studentId, courseId } = req.params;

  try {
    const allocations = await prisma.assignmentAllocation.findMany({
      where: {
        student_id: studentId,
        assignment: {
          subject_code: courseId,
        },
      },
      select: {
        assignment_id: true,
        status: true,
        file_path: true,
        assignment: {
          select: {
            title: true,
            course: {
              select: { title: true },
            },
            questions: {
              select: {
                question: {
                  select: {
                    question_id: true,
                    text: true,
                    source: true,
                    topic: true,
                  },
                },
              },
            },
          },
        },
        student: {
          select: {
            batch: {
              select: {
                teaches: {
                  select: {
                    faculty: {
                      select: { name: true },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const formatted = allocations.map(a => ({
      AssignmentID: a.assignment_id,
      Title: a.assignment.title,
      Status: a.status,
      FilePath: a.file_path,
      CourseTitle: a.assignment.course?.title,
      FacultyNames: a.student.batch.teaches.map(t => t.faculty.name), // multiple possible
      Questions: a.assignment.questions.map(q => q.question),         // clean mapping
    }));
    const grouped = {
      pending: formatted.filter(a => a.Status !== "submitted"),
      submitted: formatted.filter(a => a.Status === "submitted"),
    };

    res.status(200).json({ assignments: grouped });
  } catch (err) {
    console.error('Error fetching assignments:', err);
    res.status(500).json({ error: 'An error occurred while fetching assignments.' });
  }
});

// Route: Generate questions from topic (NO DB save here)
app.post("/generate-questions", async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic || !topic.trim())
      return res.status(400).json({ error: "Topic is required" });

    const prompt = `Generate only the questions (no answers , no extra numbering , no extra formatting) for the topic "${topic}". 
    Create 10 unique assignment questions in this format:
    1. 
    2. 
    ...
    10.`;

    const questionsText = await callGroqAPI(prompt);

    // return parsed list
    const questionList = questionsText
      .split(/\n\d+\./)
      .filter(Boolean)
      .map((q) => q.trim());

    res.json({ questions: questionList });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});


// Upload assignment
app.post('/api/upload-assignment', studentUpload.single('file'), async (req, res) => {
  const { studentId, assignmentId } = req.body;
  const filePath = req.file.path;

  try {
    const updated = await prisma.assignmentAllocation.updateMany({
      where: {
        student_id: studentId,
        assignment_id: parseInt(assignmentId),
      },
      data: {
        file_path: filePath,
        status: "submitted",
        submitted_on: new Date(),
      },
    });

    if (updated.count === 0) {
      return res.status(404).json({ error: 'No matching allocation found' });
    }

    res.status(200).json({ message: 'Assignment uploaded successfully.' });
  } catch (err) {
    console.error('Error uploading assignment:', err);
    res.status(500).json({ error: 'An error occurred while uploading the assignment.' });
  }
});

app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, 'uploads', filename);
  res.sendFile(filepath);
});

// Route: Upload PDF → extract content → generate questions
app.post("/upload-pdf", facultyUpload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "PDF file is required" });

    const pdfBuffer = req.file.buffer;
    const pdfData = await pdfParse(pdfBuffer);
    const extractedText = pdfData.text;

    const prompt = `Generate 10 assignment questions (no answers , no extra numbering , no extra formatting) based on this content:
"""
${extractedText}
"""
Format:
1. 
2.
...`;

    const questionsText = await callGroqAPI(prompt);

    const questionList = questionsText
      .split(/\n\d+\./)
      .filter(Boolean)
      .map((q) => q.trim());

    res.json({ questions: questionList });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).json({ error: "Failed to process PDF" });
  }
});

// Route: Save selected questions into DB
app.post("/api/faculty/save-questions", async (req, res) => {
  const { questions, source, topic, subject_code, created_by } = req.body;

  if (!questions || questions.length === 0) {
    return res.status(400).json({ error: "No questions provided" });
  }

  try {
    const created = await prisma.question.createMany({
      data: questions.map(q => ({
        text: q,
        source,
        topic,
        subject_code,
        created_by: parseInt(created_by),
      })),
    });

    res.json({ success: true, count: created.count });
  } catch (err) {
    console.error("Error saving questions:", err);
    res.status(500).json({ error: "Failed to save questions" });
  }
});


// Returns all subjects a faculty teaches.
app.get("/api/faculty/subjects/:facultyId", async (req, res) => {
  const { facultyId } = req.params;
  try {
    const subjects = await prisma.teaches.findMany({
      where: { faculty_id: parseInt(facultyId) },
      select: {
        subject_code: true,
        course: {
          select: {
            title: true,
          },
        },
      },
      distinct: ["subject_code"], // unique subjects
    });

    const formatted = subjects.map(s => ({
      subject_code: s.subject_code,
      title: s.course.title
    }));
    res.status(200).json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch subjects." });
  }
});

// reutrn all available assignments of a given subject
app.get("/api/assignments/:subjectCode", async (req, res) => {
  try {
    const { subjectCode } = req.params;

    // fetch all assignments for that subject
    const assignments = await prisma.assignment.findMany({
      where: { subject_code: subjectCode },
      select: {
        assignment_id: true,
        title: true,
        created_on: true
      }
    });

    res.status(200).json(assignments);
  } catch (err) {
    console.error("Error fetching assignments:", err);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
});

// returns all batches a faculty teaches
app.get("/api/faculty/batches", async (req, res) => {
  const { facultyId, subjectCode } = req.query;

  if (!facultyId || !subjectCode) {
    return res.status(400).json({ error: "facultyId and subjectCode are required" });
  }

  try {
    const teaches = await prisma.teaches.findMany({
      where: {
        faculty_id: parseInt(facultyId),
        subject_code: subjectCode,
      },
      include: {
        batch: true,
      },
    });

    if (teaches.length === 0) {
      return res.status(404).json({ error: "No batches found for this faculty and subject" });
    }

    // Extract just batch_name(s)
    const batchNames = teaches.map((t) => t.batch);

    res.json({ batches: batchNames });
  } catch (error) {
    console.error("Error fetching batches:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Returns all students in a batch
app.get("/api/students/:batchId", async (req, res) => {
  const { batchId } = req.params;

  try {
    const batch = await prisma.batch.findFirst({
      where: { batch_id: Number(batchId) },
      include: {
        students: true,
      },
    });

    if (!batch) {
      return res.status(404).json({ error: "Batch not found" });
    }
    console.log(batch.students);
    res.json({ students: batch.students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Returns all students who were allocated a specific assignment of a subject
app.get("/api/faculty/students/:facultyId/:subjectCode/:assignmentId", async (req, res) => {
  const { facultyId, subjectCode, assignmentId } = req.params;
  try {
    // Find batches where this faculty teaches the subject
    const teaches = await prisma.teaches.findMany({
      where: {
        faculty_id: parseInt(facultyId),
        subject_code: subjectCode,
      },
      select: { batch_id: true },
    });

    const batchIds = teaches.map((t) => t.batch_id);

    // Get students in these batches who have this specific assignment allocated
    const students = await prisma.student.findMany({
      where: { batch_id: { in: batchIds } },
      select: {
        student_id: true,
        name: true,
        allocations: {
          where: {
            assignment_id: parseInt(assignmentId), // ✅ restrict to chosen assignment
          },
          select: {
            status: true,
            file_path: true,
          },
        },
      },
    });

    // Map to simpler response
    const result = students
      .filter((s) => s.allocations.length > 0) // only students who got this assignment
      .map((s) => ({
        student_id: s.student_id,
        name: s.name,
        status: s.allocations[0].status,
        filePath: s.allocations[0].file_path,
      }));

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch students." });
  }
});


// Returns all stored questions for the selected subject
app.get("/api/faculty/questions/:subjectCode", async (req, res) => {
  const { subjectCode } = req.params;
  try {
    const questions = await prisma.question.findMany({
      where: { subject_code: subjectCode },
      select: {
        question_id: true,
        text: true,
        topic: true,
        source: true,
      },
    });
    res.status(200).json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch questions." });
  }
});

// Creates an assignment with selected questions
app.post("/api/faculty/create-assignment", async (req, res) => {
  const { title, subject_code, questions } = req.body;

  if (!subject_code || !questions || !questions.length) {
    return res.status(400).json({ error: "Invalid data." });
  }

  try {
    // Create assignment
    const assignment = await prisma.assignment.create({
      data: {
        subject_code,
        title,
        questions: {
          create: questions.map((qid) => ({
            question_id: qid,
          })),
        },
      },
    });

    res.status(201).json({ assignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create assignment." });
  }
});

// Assigns an assignment to selected students.
app.post("/api/faculty/assign-assignment", async (req, res) => {
  const { assignmentId, studentIds } = req.body;

  if (!assignmentId || !studentIds || !studentIds.length) {
    return res.status(400).json({ error: "Invalid data." });
  }

  try {
    const allocations = await Promise.all(
      studentIds.map((sid) =>
        prisma.assignmentAllocation.create({
          data: {
            assignment_id: assignmentId,
            student_id: sid,
            status: "assigned",
          },
        })
      )
    );

    res.status(201).json({ message: "Assignment assigned successfully.", allocations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to assign assignment." });
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
