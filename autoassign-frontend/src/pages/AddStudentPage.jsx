import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AddStudent = () => {
  const [studentDetails, setStudentDetails] = useState({
    studentId: "",
    studentName: "",
    department: "",
    semester: "",
    email: "",
    dob: "",
    batch: "",
  });

  const [batches, setBatches] = useState([]);
  const [message, setMessage] = useState("");

  const departments = ["CE", "IT"];
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  useEffect(() => {
    const fetchBatches = async () => {
      if (studentDetails.department && studentDetails.semester) {
        try {
          const response = await axios.get("http://localhost:3007/api/batches", {
            params: {
              department: studentDetails.department,
              semester: studentDetails.semester,
            },
          });
          setBatches(response.data);
        } catch (error) {
          console.error("Error fetching batches:", error);
          setBatches([]);
        }
      } else {
        setBatches([]);
      }
    };
    fetchBatches();
  }, [studentDetails.department, studentDetails.semester]);

  const handleChange = (e) => {
    setStudentDetails({
      ...studentDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3007/api/add-student",
        studentDetails
      );
      setMessage(response.data.message);
      setStudentDetails({
        studentId: "",
        studentName: "",
        department: "",
        semester: "",
        email: "",
        dob: "",
        batch: "",
      });
      setBatches([]);
    } catch (error) {
      setMessage(
        error.response
          ? error.response.data.error
          : "An error occurred while adding the student."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-10 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Add New Student
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Student ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student ID
            </label>
            <input
              type="text"
              name="studentId"
              value={studentDetails.studentId}
              onChange={handleChange}
              required
              className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition shadow-sm p-3"
              placeholder="Enter Student ID"
            />
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student Name
            </label>
            <input
              type="text"
              name="studentName"
              value={studentDetails.studentName}
              onChange={handleChange}
              required
              className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition shadow-sm p-3"
              placeholder="Enter Full Name"
            />
          </div>

          {/* Department & Semester */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              <select
                name="department"
                value={studentDetails.department}
                onChange={handleChange}
                required
                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition shadow-sm p-3"
              >
                <option value="">-- Select Department --</option>
                {departments.map((dep) => (
                  <option key={dep} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>
              <select
                name="semester"
                value={studentDetails.semester}
                onChange={handleChange}
                required
                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition shadow-sm p-3"
              >
                <option value="">-- Select Semester --</option>
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Batch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batch
            </label>
            <select
              name="batch"
              value={studentDetails.batch}
              onChange={handleChange}
              required
              className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition shadow-sm p-3"
            >
              <option value="">-- Select Batch --</option>
              {batches.length > 0 ? (
                batches.map((b) => (
                  <option key={b.batch_id} value={b.batch_id}>
                    {b.batch_name}
                  </option>
                ))
              ) : (
                <option disabled>No batches available</option>
              )}
            </select>
          </div>

          {/* Email & DOB */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={studentDetails.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition shadow-sm p-3"
                placeholder="student@charusat.edu.in"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={studentDetails.dob}
                onChange={handleChange}
                required
                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition shadow-sm p-3"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center mt-8">

            {/* <Link
              to="/AdminDashboard"
              className="px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium border border-gray-300 hover:bg-gray-200 transition"
            >
              Back
            </Link>  */}
            <Link
              to="/AdminDashboard"
              className="px-6 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              ⬅ Back
            </Link>

            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-indigo-500 text-white font-medium shadow hover:bg-indigo-600 transition"
            >
              Add Student
            </button>
            
          </div>
        </form>

        {message && (
          <div className="mt-6 text-center text-sm text-indigo-600 font-medium">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddStudent;
