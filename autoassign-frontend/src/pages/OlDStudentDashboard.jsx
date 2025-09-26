import { useState } from "react";

export default function StudentDashboard() {
  // ================== DUMMY DATA ==================
  // TODO: Replace with API call -> fetch student's enrolled courses
  const [courses] = useState([
    {
      id: 1,
      name: "Computer Networks",
      assignments: [
        { id: 101, title: "Assignment 1: TCP/IP", status: "pending" },
        { id: 102, title: "Assignment 2: Routing", status: "completed" },
      ],
    },
    {
      id: 2,
      name: "Database Systems",
      assignments: [
        { id: 201, title: "Assignment 1: SQL Basics", status: "pending" },
      ],
    },
  ]);

  const [selectedFile, setSelectedFile] = useState(null);

  // ================== HANDLE FILE SUBMIT ==================
  const handleFileChange = (event) => {
    setSelectedFile(event.target.filePs[0]);
  };

  const handleSubmit = (assignmentId) => {
    if (!selectedFile) {
      alert("Please select a PDF file first!");
      return;
    }

    // TODO: Replace with API call -> Upload PDF to backend
    console.log(`Submitting ${selectedFile.name} for assignment ID ${assignmentId}`);

    alert("Assignment submitted successfully!");
    setSelectedFile(null);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📘 Student Dashboard</h1>

      {courses.map((course) => (
        <div key={course.id} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{course.name}</h2>

          <div className="grid grid-cols-2 gap-6">
            {/* Pending Assignments */}
            <div className="bg-yellow-50 p-4 rounded-xl shadow">
              <h3 className="text-lg font-bold mb-2 text-yellow-700">
                ⏳ Pending Assignments
              </h3>
              {course.assignments.filter(a => a.status === "pending").length > 0 ? (
                course.assignments
                  .filter((a) => a.status === "pending")
                  .map((a) => (
                    <div
                      key={a.id}
                      className="flex justify-between items-center p-3 bg-white rounded-lg shadow mb-3"
                    >
                      <span>{a.title}</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="text-sm"
                        />
                        <button
                          onClick={() => handleSubmit(a.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500">No pending assignments 🎉</p>
              )}
            </div>

            {/* Completed Assignments */}
            <div className="bg-green-50 p-4 rounded-xl shadow">
              <h3 className="text-lg font-bold mb-2 text-green-700">
                Completed Assignments
              </h3>
              {course.assignments.filter(a => a.status === "completed").length > 0 ? (
                course.assignments
                  .filter((a) => a.status === "completed")
                  .map((a) => (
                    <div
                      key={a.id}
                      className="p-3 bg-white rounded-lg shadow mb-3 flex justify-between"
                    >
                      <span>{a.title}</span>
                      <span className="text-green-600 font-semibold">✔ Done</span>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500">No completed assignments yet</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
