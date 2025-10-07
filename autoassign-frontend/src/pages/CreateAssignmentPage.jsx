import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function CreateAssignment() {
  const location = useLocation();
  const navigate = useNavigate();
  const facultyId = location.state?.user?.id;

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [lateSubmission, setLateSubmission] = useState(0);

  // Fetch subjects for faculty
  useEffect(() => {
    if (facultyId) {
      axios
        .get(`http://localhost:3007/api/faculty/subjects/${facultyId}`)
        .then((res) => setSubjects(res.data))
        .catch((err) => console.error("Error fetching subjects:", err));
    }
  }, [facultyId]);

  // Fetch questions when subject is selected
  useEffect(() => {
    if (selectedSubject) {
      axios
        .get(`http://localhost:3007/api/faculty/questions/${selectedSubject}`)
        .then((res) => setQuestions(res.data))
        .catch((err) => console.error("Error fetching questions:", err));
    }
  }, [selectedSubject]);

  // Handle checkbox toggle
  const handleQuestionSelect = (qid) => {
    setSelectedQuestions((prev) =>
      prev.includes(qid) ? prev.filter((id) => id !== qid) : [...prev, qid]
    );
  };

  // Submit assignment
  const handleCreateAssignment = () => {
    if (!title || !selectedSubject || selectedQuestions.length === 0) {
      alert("Please fill all fields and select at least one question.");
      return;
    }

    axios
      .post("http://localhost:3007/api/faculty/create-assignment", {
        title,
        subject_code: selectedSubject,
        deadline,
        lateSubmission,
        questions: selectedQuestions,
      })
      .then(() => {
        alert("Assignment created successfully!");
        navigate(-1); // Go back after creation
      })
      .catch((err) => console.error("Error creating assignment:", err));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 p-8">
      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center tracking-tight">
          ✨ Create Assignment
        </h2>

        {/* Select Subject */}
        <label className="block mb-2 text-sm font-semibold text-gray-600">
          Select Subject
        </label>
        <select
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg bg-white/70 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          <option value="">-- Choose a subject --</option>
          {subjects.map((subj) => (
            <option key={subj.subject_code} value={subj.subject_code}>
              {subj.title} ({subj.subject_code})
            </option>
          ))}
        </select>

        {/* Assignment Title */}
        <label className="block mb-2 text-sm font-semibold text-gray-600">
          Assignment Title
        </label>
        <input
          type="text"
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg bg-white/70 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter assignment title"
        />

        {/* Deadline Field */}
        <label className="block mb-2 text-sm font-semibold text-gray-600">
          Deadline
        </label>
        <input
          type="datetime-local"
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-lg bg-white/70 shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        {/* Late Submission Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-semibold">
            Allow Late Submission?
          </span>
          <button
            type="button"
            onClick={() => setLateSubmission((prev) => (prev === 1 ? 0 : 1))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              lateSubmission ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                lateSubmission ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-1 mb-6 ">
          {lateSubmission ? "✅ Late submission allowed" : "❌ Not allowed"}
        </p>

        {/* Questions */}
        {questions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Select Questions
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-white/50 shadow-inner">
              {questions.map((q) => (
                <label
                  key={q.question_id}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-indigo-50 transition cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedQuestions.includes(q.question_id)}
                    onChange={() => handleQuestionSelect(q.question_id)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-500 focus:ring-indigo-400"
                  />
                  <span className="text-gray-700">{q.text}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={handleCreateAssignment}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-md hover:shadow-lg hover:scale-105 transform transition"
          >
            ✅ Create Assignment
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 hover:scale-105 transform transition"
          >
            ⬅️ Back
          </button>
        </div>
      </div>
    </div>
  );
}
