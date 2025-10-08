import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddCourse = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    subject_code: "",
    title: "",
    dept_id: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Fetch departments
  useEffect(() => {
    axios
      .get("http://localhost:3007/api/departments")
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Error fetching departments:", err));
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3007/api/add-course", formData);
      setMessage(res.data.message || "✅ Course added successfully!");
      setFormData({ subject_code: "", title: "", dept_id: "" });
    } catch (error) {
      console.error("Error adding course:", error);
      setMessage("❌ Error adding course.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md border border-gray-200">

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Add New Course
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Subject Code */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Subject Code
            </label>
            <input
              type="text"
              name="subject_code"
              value={formData.subject_code}
              onChange={handleChange}
              required
              placeholder="e.g., CE356"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Course Title */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Course Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Database Management Systems"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Department
            </label>
            <select
              name="dept_id"
              value={formData.dept_id}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">--  Select Department  --</option>
              {departments.map((dept) => (
                <option key={dept.dept_id} value={dept.dept_id}>
                  {dept.dept_name}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white font-medium py-2 rounded-lg hover:bg-indigo-600 transition-all"
          >
            Add Course
          </button>

           
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mt-6 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          ← Back
        </button>
        </form>

        {/* Message */}
        {message && (
          <p className="text-center text-sm text-gray-700 mt-4">{message}</p>
        )}
      </div>
    </div>
  );
};

export default AddCourse;
