import React, { useState } from "react";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("faculty");

  // Dummy state for inputs
  const [facultyData, setFacultyData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    subjects: ""
  });

  const [studentData, setStudentData] = useState({
    name: "",
    email: "",
    password: "",
    enrollmentNo: "",
    batch: "",
    course: ""
  });

  const handleFacultySubmit = (e) => {
    e.preventDefault();
    console.log("Faculty Data:", facultyData);

    // 🔗 Here call backend API:
    // fetch("/api/admin/addFaculty", { method: "POST", body: JSON.stringify(facultyData) })
  };

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    console.log("Student Data:", studentData);

    // 🔗 Here call backend API:
    // fetch("/api/admin/addStudent", { method: "POST", body: JSON.stringify(studentData) })
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("faculty")}
          className={`px-4 py-2 rounded ${
            activeTab === "faculty" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Add Faculty
        </button>
        <button
          onClick={() => setActiveTab("student")}
          className={`px-4 py-2 rounded ${
            activeTab === "student" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Add Student
        </button>
      </div>

      {/* Faculty Form */}
      {activeTab === "faculty" && (
        <form
          onSubmit={handleFacultySubmit}
          className="bg-white p-6 rounded-lg shadow-md space-y-4"
        >
          <input
            type="text"
            placeholder="Name"
            className="w-full border p-2 rounded"
            value={facultyData.name}
            onChange={(e) =>
              setFacultyData({ ...facultyData, name: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={facultyData.email}
            onChange={(e) =>
              setFacultyData({ ...facultyData, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={facultyData.password}
            onChange={(e) =>
              setFacultyData({ ...facultyData, password: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Department"
            className="w-full border p-2 rounded"
            value={facultyData.department}
            onChange={(e) =>
              setFacultyData({ ...facultyData, department: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Subjects (comma separated)"
            className="w-full border p-2 rounded"
            value={facultyData.subjects}
            onChange={(e) =>
              setFacultyData({ ...facultyData, subjects: e.target.value })
            }
          />

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Faculty
          </button>
        </form>
      )}

      {/* Student Form */}
      {activeTab === "student" && (
        <form
          onSubmit={handleStudentSubmit}
          className="bg-white p-6 rounded-lg shadow-md space-y-4"
        >
          <input
            type="text"
            placeholder="Name"
            className="w-full border p-2 rounded"
            value={studentData.name}
            onChange={(e) =>
              setStudentData({ ...studentData, name: e.target.value })
            }
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={studentData.email}
            onChange={(e) =>
              setStudentData({ ...studentData, email: e.target.value })
            }
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={studentData.password}
            onChange={(e) =>
              setStudentData({ ...studentData, password: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Enrollment No"
            className="w-full border p-2 rounded"
            value={studentData.enrollmentNo}
            onChange={(e) =>
              setStudentData({ ...studentData, enrollmentNo: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Batch"
            className="w-full border p-2 rounded"
            value={studentData.batch}
            onChange={(e) =>
              setStudentData({ ...studentData, batch: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Course"
            className="w-full border p-2 rounded"
            value={studentData.course}
            onChange={(e) =>
              setStudentData({ ...studentData, course: e.target.value })
            }
          />

          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Student
          </button>
        </form>
      )}
    </div>
  );
};

export default AdminPanel;
