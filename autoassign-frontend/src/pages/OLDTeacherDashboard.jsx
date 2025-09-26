import React, { useEffect, useMemo, useState } from "react";

/**
 * TeacherDashboard.jsx — standalone page for teacher workflow
 *
 * Features:
 *  1) Teacher selects a course (only those they teach) and batch
 *  2) Generate questions via topic or PDF
 *  3) Pick questions → edit/remove
 *  4) Finalize → create assignment + save questions + distribute to students
 *
 * Notes:
 *  - This file uses dummy data by default (BACKEND_ENABLED = false)
 *  - Search for `// TODO(API)` comments to wire your backend endpoints later
 *  - Styling: TailwindCSS utility classes
 */

// --- CONFIG ---
const BACKEND_ENABLED = true; // toggle to true when your backend is ready
const BASE_URL = "http://localhost:3007"; // your Express server

// Simulated logged-in teacher id (replace with your auth context later)
const TEACHER_ID = "F001";

// --- DUMMY DATA (used when BACKEND_ENABLED = false) ---
const DUMMY_TEACHES = [
  {
    facultyId: "F001",
    courseId: "CS101",
    title: "Data Structures",
    department: "CSE",
    batches: ["2025", "2026"],
    semester: 4,
  },
  {
    facultyId: "F001",
    courseId: "CS102",
    title: "Database Management",
    department: "CSE",
    batches: ["2025"],
    semester: 4,
  },
  {
    facultyId: "F001",
    courseId: "MA201",
    title: "Engineering Mathematics",
    department: "Math",
    batches: ["2025", "2024"],
    semester: 3,
  },
];

const DUMMY_GENERATED = [
  "Explain the time complexity of merge sort and compare it with quicksort.",
  "Design a stack that supports push, pop, and getMin in O(1) time.",
  "Describe how hashing works and discuss collision resolution strategies.",
  "Prove that a binary search tree can degrade to a linked list and explain why.",
  "Implement DFS and BFS; compare their use-cases.",
  "What is a heap? Show how heapify builds a heap from an array.",
  "Explain amortized analysis with an example from dynamic arrays.",
  "Given a graph, detect if it contains a cycle (directed/undirected).",
  "Differentiate between adjacency list and adjacency matrix with space trade-offs.",
  "Write test cases for a queue implementation using two stacks.",
];

// --- SMALL UI PARTS ---
function Pill({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
      {children}
    </span>
  );
}

function SectionCard({ title, right, children }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {right}
      </div>
      {children}
    </div>
  );
}

function QuestionRow({ text, onAdd }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl border p-3">
      <p className="text-sm leading-6">{text}</p>
      <button
        onClick={onAdd}
        className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
      >
        Add
      </button>
    </div>
  );
}

function SelectedQuestionCard({ value, index, onUpdate, onRemove }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  return (
    <div className="rounded-xl border p-3">
      {isEditing ? (
        <textarea
          className="w-full resize-y rounded-lg border p-2 text-sm"
          rows={3}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
      ) : (
        <p className="text-sm leading-6">{value}</p>
      )}

      <div className="mt-2 flex items-center gap-2">
        {isEditing ? (
          <button
            onClick={() => {
              onUpdate(index, draft);
              setIsEditing(false);
            }}
            className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Edit
          </button>
        )}
        <button
          onClick={() => onRemove(index)}
          className="rounded-xl border px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  // 1) Course + Batch state
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [semester, setSemester] = useState("-");

  // 2) Generation state
  const [mode, setMode] = useState("topic"); // "topic" | "pdf"
  const [topic, setTopic] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [loadingGen, setLoadingGen] = useState(false);

  // 3) Questions state
  const [generated, setGenerated] = useState([]);
  const [selected, setSelected] = useState([]);

  // 4) Finalize state
  const [creating, setCreating] = useState(false);
  const [toast, setToast] = useState("");

  // Load teacher courses
  useEffect(() => {
    const load = async () => {
      if (!BACKEND_ENABLED) {
        // Use dummy teaches
        const rows = DUMMY_TEACHES.filter((t) => t.facultyId === TEACHER_ID);
        setCourses(rows);
        return;
      }

      // TODO(API): Replace with a real endpoint to fetch teacher's courses/batches
      // Example suggestion:
      // const res = await fetch(`${BASE_URL}/teachers/${TEACHER_ID}/courses`);
      // const data = await res.json();
      // setCourses(data.courses);
    };
    load();
  }, []);

  // Update batch/semester options when course changes
  const activeCourse = useMemo(
    () => courses.find((c) => c.courseId === selectedCourseId) || null,
    [courses, selectedCourseId]
  );

  useEffect(() => {
    if (!activeCourse) {
      setSelectedBatch("");
      setSemester("-");
      return;
    }
    setSemester(activeCourse.semester ?? "-");
    if (activeCourse.batches?.length) setSelectedBatch(activeCourse.batches[0]);
  }, [activeCourse]);

  // Generate questions (topic/pdf)
  const handleGenerate = async (e) => {
    e.preventDefault();
    // if (!selectedCourseId || !selectedBatch) {
    //   setToast("Please pick course & batch first.");
    //   console.log("Missing course or batch");
    //   return;
    // }

    setLoadingGen(true);
    try {
      if (!BACKEND_ENABLED) {
        // Use dummy questions
        await new Promise((r) => setTimeout(r, 600));
        setGenerated(DUMMY_GENERATED);
        setToast("Generated 10 questions (dummy)");
        return;
      }
      //handleGenerate - generate question from topic or pdf endpoint 
      if (mode === "topic") {
        const res = await fetch(`${BASE_URL}/generate-questions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ topic }),
        });
        const data = await res.json();
        console.log(data);
        const qArray = Array.isArray(data.questions)
          ? data.questions
          : (data.questions || "").split("\n").filter(Boolean);
        setGenerated(qArray);
      } else {
        const fd = new FormData();
        fd.append("pdf", pdfFile);
        const res = await fetch(`${BASE_URL}/upload-pdf`, {
          method: "POST",
          body: fd,
        });
        const data = await res.json();
        console.log(data);

        const qArray = Array.isArray(data.questions)
          ? data.questions
          : (data.questions || "").split("\n").filter(Boolean);
        setGenerated(qArray);
      }
    } catch (err) {
      console.error(err);
      setToast("Failed to generate questions.");
    } finally {
      setLoadingGen(false);
    }
  };

  // Selection helpers
  const addQuestion = (q) => {
    setSelected((prev) => (prev.includes(q) ? prev : [...prev, q]));
  };
  const removeQuestion = (idx) => {
    setSelected((prev) => prev.filter((_, i) => i !== idx));
  };
  const updateQuestion = (idx, val) => {
    setSelected((prev) => prev.map((q, i) => (i === idx ? val : q)));
  };

  // Finalize: create assignment → save selected questions → distribute
  const handleFinalize = async () => {
    if (!selectedCourseId || !selectedBatch) {
      setToast("Pick course & batch first.");
      return;
    }
    if (selected.length === 0) {
      setToast("No questions selected.");
      return;
    }

    setCreating(true);
    try {
      if (!BACKEND_ENABLED) {
        await new Promise((r) => setTimeout(r, 800));
        setToast("✅ Assignment created & distributed to students (dummy)");
        setSelected([]);
        return;
      }

      // --- REAL FLOW (when backend ready) ---
      // 1) Create assignment (server will auto-pick year & assignmentNumber)
      // const createRes = await fetch(`${BASE_URL}/assignments`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     courseId: selectedCourseId,
      //     batch: selectedBatch,
      //     createdByFacultyId: TEACHER_ID,
      //     title: `Assignment for ${selectedCourseId} (${selectedBatch})`,
      //   }),
      // });
      // const assignment = await createRes.json(); // { assignmentId, year, assignmentNumber }

      // 2) Save selected questions for that assignment
      // await fetch(`${BASE_URL}/assignments/${assignment.assignmentId}/questions`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ questions: selected }),
      // });

      // 3) Distribute to students of that batch (server allocates per Takes table)
      // await fetch(`${BASE_URL}/assignments/${assignment.assignmentId}/distribute`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ batch: selectedBatch }),
      // });

      // setToast("✅ Assignment created & distributed to students");
      // setSelected([]);
    } catch (err) {
      console.error(err);
      setToast("Failed to finalize assignment.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
            <p className="text-sm text-gray-500">
              Create AI-powered assignments and distribute to your students.
            </p>
          </div>
          <Pill>Logged in: {TEACHER_ID}</Pill>
        </div>

        {/* Row: course & batch selection */}
        <SectionCard
          title="Select Course & Batch"
          right={<Pill>Semester: {semester}</Pill>}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Course</label>
              <select
                className="rounded-xl border bg-white p-2"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
              >
                <option value="">-- Select Course --</option>
                {courses.map((c) => (
                  <option key={c.courseId} value={c.courseId}>
                    {c.courseId} • {c.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Batch</label>
              <select
                className="rounded-xl border bg-white p-2"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                disabled={!activeCourse}
              >
                {!activeCourse && (
                  <option value="">-- Pick course first --</option>
                )}
                {activeCourse?.batches?.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Info</label>
              <div className="flex items-center gap-2 rounded-xl border bg-gray-50 p-2 text-sm">
                <span className="font-medium">Course:</span>
                <span>{selectedCourseId || "–"}</span>
                <span className="mx-1">•</span>
                <span className="font-medium">Batch:</span>
                <span>{selectedBatch || "–"}</span>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Row: generate + results */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard
            title="Generate Questions"
            right={
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMode("topic")}
                  className={`rounded-xl border px-3 py-1.5 text-sm ${
                    mode === "topic"
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  Topic
                </button>
                <button
                  onClick={() => setMode("pdf")}
                  className={`rounded-xl border px-3 py-1.5 text-sm ${
                    mode === "pdf"
                      ? "bg-gray-900 text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  PDF
                </button>
              </div>
            }
          >
            <form onSubmit={handleGenerate} className="space-y-3">
              {mode === "topic" ? (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium">Topic</label>
                  <input
                    type="text"
                    className="rounded-xl border bg-white p-2"
                    placeholder="e.g., Graph Algorithms, Photosynthesis..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium">Upload PDF</label>
                  <input
                    type="file"
                    accept=".pdf"
                    className="rounded-xl border bg-white p-2"
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  />
                  {pdfFile && (
                    <p className="text-xs text-gray-500">
                      Selected: {pdfFile.name}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={loadingGen || (!topic && mode === "topic")}
                  className="rounded-xl border bg-gray-900 px-4 py-2 text-sm text-white disabled:opacity-60"
                >
                  {loadingGen ? "Generating..." : "Generate"}
                </button>
                {!BACKEND_ENABLED && <Pill>Dummy mode</Pill>}
              </div>
            </form>
          </SectionCard>

          <SectionCard
            title="Generated Questions"
            right={<Pill>{generated.length}</Pill>}
          >
            {generated.length === 0 ? (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
                Questions will appear here after you generate.
              </div>
            ) : (
              <div className="flex max-h-[480px] flex-col gap-3 overflow-y-auto pr-1">
                {generated.map((q, i) => (
                  <QuestionRow key={i} text={q} onAdd={() => addQuestion(q)} />
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Row: selected & finalize */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SectionCard
            title="Selected Questions"
            right={<Pill>{selected.length}</Pill>}
          >
            {selected.length === 0 ? (
              <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-500">
                No questions selected yet. Click{" "}
                <span className="font-medium">Add</span> on any generated
                question.
              </div>
            ) : (
              <div className="flex max-h-[480px] flex-col gap-3 overflow-y-auto pr-1">
                {selected.map((q, i) => (
                  <SelectedQuestionCard
                    key={i}
                    value={q}
                    index={i}
                    onUpdate={updateQuestion}
                    onRemove={removeQuestion}
                  />
                ))}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Finalize Assignment">
            <ol className="list-inside list-decimal text-sm text-gray-700">
              <li>Review selected questions</li>
              <li>
                Create the assignment (server auto-generates codes like{" "}
                <code>2025-CS101-A2-Q1</code>)
              </li>
              <li>Distribute to all students in the chosen batch</li>
            </ol>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={handleFinalize}
                disabled={creating || selected.length === 0}
                className="rounded-xl border bg-emerald-600 px-4 py-2 text-sm text-white disabled:opacity-60"
              >
                {creating ? "Working..." : "Create & Distribute"}
              </button>
              {!BACKEND_ENABLED && <Pill>Dummy mode</Pill>}
            </div>

            {toast && (
              <div className="mt-3 rounded-xl border bg-gray-50 p-3 text-sm">
                {toast}
              </div>
            )}

            {/*
              TODO(API) — Backend endpoints you should wire:
              1) GET   /teachers/:facultyId/courses                → list of { courseId, title, batches[], semester }
              2) POST  /generate-questions   { topic }             → returns { questions: string[] }
              3) POST  /upload-pdf          (multipart pdf)       → returns { questions: string[] }
              4) POST  /assignments         { courseId, batch, createdByFacultyId, title }
                    → returns { assignmentId, year, assignmentNumber }
              5) POST  /assignments/:id/questions  { questions: string[] }
              6) POST  /assignments/:id/distribute { batch }
            */}
          </SectionCard>
        </div>
      </div>
    </div>
  );
} 
