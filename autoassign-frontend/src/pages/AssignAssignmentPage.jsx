import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AssignAssignmentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = location.state || {};

  const [subjects, setSubjects] = useState([]);
  const [batches, setBatches] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Fetch subjects taught by faculty
  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:3007/api/faculty/subjects/${user.id}`)
        .then((res) => res.json())
        .then((data) => setSubjects(data))
        .catch((err) => console.error("Error fetching subjects", err));
    }
  }, [user]);

  // Fetch batches + assignments when subject changes
  useEffect(() => {
    if (user?.id && selectedSubject) {
      fetch(
        `http://localhost:3007/api/faculty/batches?facultyId=${user.id}&subjectCode=${selectedSubject}`
      )
        .then((res) => res.json())
        .then((data) => setBatches(data.batches))
        .catch((err) => console.error("Error fetching batches", err));

      // fetch assignments for the subject
      fetch(`http://localhost:3007/api/assignments/${selectedSubject}`)
        .then((res) => res.json())
        .then((data) => setAssignments(data))
        .catch((err) => console.error("Error fetching assignments", err));
    }
  }, [user, selectedSubject]);

  // Fetch students in selected batch
  useEffect(() => {
    if (selectedBatch) {
      fetch(`http://localhost:3007/api/students/${selectedBatch}`)
        .then((res) => res.json())
        .then((data) => setStudents(data.students))
        .catch((err) => console.error("Error fetching students", err));
    }
  }, [selectedBatch]);

  const handleStudentSelect = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((s) => s.student_id));
    }
  };

  const handleAssign = () => {
    if (
      !selectedSubject ||
      !selectedBatch ||
      !selectedAssignment ||
      selectedStudents.length === 0
    ) {
      alert(
        "Please select subject, assignment, batch, and at least one student."
      );
      return;
    }

    const payload = {
      assignmentId: selectedAssignment,
      studentIds: selectedStudents,
    };

    fetch("http://localhost:3007/api/faculty/assign-assignment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        if (res.ok) {
          alert("Assignment assigned successfully!");
          navigate(-1);
        } else {
          alert("Failed to assign assignment.");
        }
      })
      .catch((err) => console.error("Error assigning assignment", err));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center tracking-tight">
          📘 Assign Assignment
        </h1>

        {/* Subject Dropdown */}
        <div className="mb-6">
          <label className="block font-medium text-gray-700 mb-2">
            Select Subject:
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white/60 backdrop-blur-md shadow-sm"
          >
            <option value="">-- Select Subject --</option>
            {subjects.map((s) => (
              <option key={s.subject_code} value={s.subject_code}>
                {s.title}
              </option>
            ))}
          </select>
        </div>

        {/* Assignment Dropdown */}
        {selectedSubject && (
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">
              Select Assignment:
            </label>
            <select
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white/60 backdrop-blur-md shadow-sm"
            >
              <option value="">-- Select Assignment --</option>
              {assignments.map((a) => (
                <option key={a.assignment_id} value={a.assignment_id}>
                  {a.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Batch Dropdown */}
        {selectedSubject && (
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">
              Select Batch:
            </label>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(Number(e.target.value))}
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white/60 backdrop-blur-md shadow-sm"
            >
              <option value="">-- Select Batch --</option>
              {batches.map((b) => (
                <option key={b.batch_id} value={b.batch_id}>
                  {b.batch_name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Students List */}
        {students.length > 0 && (
          <div className="mb-6 bg-white/60 backdrop-blur-md border border-gray-200 rounded-2xl p-5 shadow-inner">
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={selectedStudents.length === students.length}
                onChange={handleSelectAll}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-400"
              />
              <span className="ml-3 font-medium text-gray-800">Select All</span>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {students.map((student) => (
                <div
                  key={student.student_id}
                  className="flex items-center p-2 rounded-lg hover:bg-indigo-50 transition"
                >
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.student_id)}
                    onChange={() => handleStudentSelect(student.student_id)}
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-400"
                  />
                  <span className="ml-3 text-gray-700">{student.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-center gap-6 mt-8">
          <button
            onClick={handleAssign}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium shadow-md hover:bg-indigo-700 transition-all"
          >
            ✅ Assign
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl bg-gray-400 text-white font-medium shadow-md hover:bg-gray-500 transition-all"
          >
            ⬅ Back
          </button>
        </div>
      </div>
    </div>
  );
}
