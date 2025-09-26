import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import UploadAssignment from "./UploadAssignment";

const StudentDashboard = () => {
  const location = useLocation();
  const { user } = location.state || {};
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState({ pending: [], submitted: [] });
  const [selectedCourse, setSelectedCourse] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.id) {
      axios
        .get(`http://localhost:3007/api/student/courses/${user.id}`)
        .then((response) => {
          const data = response.data.courses;
          if (Array.isArray(data)) {
            setCourses(data);
          } else {
            setCourses([data]);
          }
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            setError(error.response.data.error);
          } else {
            setError("An error occurred. Please try again.");
          }
        });
    }
  }, [user]);

  const handleCourseChange = (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);
    if (courseId) {
      axios
        .get(`http://localhost:3007/api/student/assignments/${user.id}/${courseId}`)
        .then((response) => {
          setAssignments(response.data.assignments || { pending: [], submitted: [] });
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            setError(error.response.data.error);
          } else {
            setError("An error occurred. Please try again.");
          }
        });
    } else {
      setAssignments({ pending: [], submitted: [] });
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3007/api/logout");
      navigate("/");
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response ? error.response.data.error : error.message
      );
    }
  };

  const handleChangePassword = () => {
    navigate("/ChangePassword", { state: { userId: user.id, role: "student" } });
  };

  const pendingAssignments = assignments.pending || [];
  const submittedAssignments = assignments.submitted || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-800 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white/70 backdrop-blur-md shadow-md px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-purple-700 tracking-wide">Student Dashboard</h1>
        <ul className="flex gap-4">
          <li>
            <button className="px-4 py-2 rounded-xl bg-purple-500 text-white shadow hover:bg-purple-600 transition">
              View Assignment
            </button>
          </li>
          <li>
            <button
              onClick={handleChangePassword}
              className="px-4 py-2 rounded-xl bg-blue-500 text-white shadow hover:bg-blue-600 transition"
            >
              Change Password
            </button>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-red-500 text-white shadow hover:bg-red-600 transition"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 gap-8 p-8">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white/80 backdrop-blur-md rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Select Course</h2>
          <select
            value={selectedCourse}
            onChange={handleCourseChange}
            className="w-full p-3 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">--Select a Course--</option>
            {courses.map((course, index) => (
              <option key={index} value={course.CourseID}>
                {course.Title}
              </option>
            ))}
          </select>
          {error && <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>}
        </aside>

        {/* Assignments */}
        <main className="flex-1 bg-white/80 backdrop-blur-md rounded-2xl shadow p-8">
          {pendingAssignments.length > 0 || submittedAssignments.length > 0 ? (
            <div>
              {/* Tabs */}
              <div className="flex space-x-4 mb-6">
                <button
                  className={`px-4 py-2 rounded-xl shadow transition ${
                    activeTab === "pending"
                      ? "bg-purple-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("pending")}
                >
                  Pending
                </button>
                <button
                  className={`px-4 py-2 rounded-xl shadow transition ${
                    activeTab === "submitted"
                      ? "bg-purple-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab("submitted")}
                >
                  Submitted
                </button>
              </div>

              {/* Assignment List */}
              <div className="space-y-6">
                {(activeTab === "pending" ? pendingAssignments : submittedAssignments).map(
                  (a) => (
                    <div
                      key={a.AssignmentID}
                      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl shadow p-6 space-y-4"
                    >
                      <div>
                        <h2 className="text-xl font-semibold text-purple-700">{a.Title}</h2>
                        <p className="text-gray-700">
                          <strong>Subject:</strong> {a.CourseTitle}
                        </p>
                        <p className="text-gray-700">
                          <strong>Faculty:</strong> {a.FacultyNames.join(", ")}
                        </p>
                        <p className="text-gray-700">
                          <strong>Status:</strong>{" "}
                          <span
                            className={`font-semibold ${
                              a.Status === "submitted" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {a.Status}
                          </span>
                        </p>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-2">Questions</h3>
                        <ol className="list-decimal list-inside space-y-1 text-gray-700">
                          {a.Questions.map((q) => (
                            <li key={q.question_id}>{q.text}</li>
                          ))}
                        </ol>
                      </div>

                      {a.Status !== "submitted" && (
                        <div className="bg-blue-50 p-4 rounded-xl shadow">
                          <UploadAssignment studentId={user.id} assignmentId={a.AssignmentID} />
                        </div>
                      )}

                      {a.FilePath && (
                        <div className="bg-green-50 p-4 rounded-xl shadow">
                          <p>
                            ✅ Submitted File:{" "}
                            <a
                              href={`http://localhost:3007/${a.FilePath}`}
                              download
                              className="text-blue-600 underline hover:text-blue-800"
                            >
                              Download
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No assignments assigned yet.</p>
          )}
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;
