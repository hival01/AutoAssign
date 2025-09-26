import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AddFaculty = () => {
   const [facultyDetails, setFacultyDetails] = useState({
    facultyName: "",
    department: "",
    email: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFacultyDetails({
      ...facultyDetails,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3007/api/add-faculty",
        facultyDetails // 👈 send only name, dept, email
      );
      setMessage(response.data.message);

      // Reset form
      setFacultyDetails({
        facultyName: "",
        department: "",
        email: "",
      });
    } catch (error) {
      setMessage(
        error.response
          ? error.response.data.error
          : "An error occurred while adding the faculty."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="w-full max-w-lg bg-white/70 backdrop-blur-xl shadow-xl rounded-2xl p-10 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center tracking-wide">
          ➕ Add New Faculty
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* as this will autoincrement by database */}

          {/* <div>
            <label className="block text-gray-600 mb-2 text-sm">Faculty ID</label>
            <input
              type="number"
              name="facultyId"
              value={facultyDetails.facultyId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              placeholder="Enter Faculty ID"
            />
          </div> */}

          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">Faculty Name</label>
            <input
              type="text"
              name="facultyName"
              value={facultyDetails.facultyName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              placeholder="Enter Faculty Name"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">Department</label>
            <input
              type="text"
              name="department"
              value={facultyDetails.department}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              placeholder="Enter Department"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={facultyDetails.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
              placeholder="Enter Email Address"
            />
          </div>

          <div className="flex justify-between items-center mt-6">
            <Link
              to="/AdminDashboard"
              className="px-6 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              ⬅ Back
            </Link>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl bg-indigo-500 text-white font-medium shadow-md hover:bg-indigo-600 transition"
            >
              Add Faculty
            </button>
          </div>
        </form>

        {message && (
          <div className="mt-6 text-center text-sm text-gray-700 font-medium">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddFaculty;
