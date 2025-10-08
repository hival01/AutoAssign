import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddTeaches = () => {
  const navigate = useNavigate();
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);

  const [selectedDept, setSelectedDept] = useState("");
  const [formData, setFormData] = useState({
    faculty_id: "",
    subject_code: "",
    batch_id: "",
  });

  const [message, setMessage] = useState("");

  // Fetch all faculties and departments on mount
  useEffect(() => {
    axios.get("http://localhost:3007/api/faculties")
      .then((res) => setFaculties(res.data))
      .catch((err) => console.error("Error fetching faculties:", err));

    axios.get("http://localhost:3007/api/departments")
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Error fetching departments:", err));

    axios.get("http://localhost:3007/api/courses")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Error fetching courses:", err));
  }, []);

  // Fetch batches when department changes
  useEffect(() => {
    if (!selectedDept) return;
    axios
      .get(`http://localhost:3007/api/batches/${selectedDept}`)
      .then((res) => setBatches(res.data))
      .catch((err) => console.error("Error fetching batches:", err));
  }, [selectedDept]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "dept_id") {
      setSelectedDept(value);
      setBatches([]);
      setFormData({ ...formData, batch_id: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.faculty_id || !formData.subject_code || !formData.batch_id) {
      setMessage("❌ Please fill all fields properly.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3007/api/add-teaches", formData);
      setMessage(res.data.message || "✅ Faculty assigned successfully!");
      setFormData({ faculty_id: "", subject_code: "", batch_id: "" });
      setSelectedDept("");
    } catch (error) {
      console.error("Error adding teaches:", error);
      setMessage("❌ Error while assigning faculty.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-6">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-md border border-gray-200">

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Assign Faculty to Course
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Faculty */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Select Faculty
            </label>
            <select
              name="faculty_id"
              value={formData.faculty_id}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select Faculty</option>
              {faculties.map((f) => (
                <option key={f.faculty_id} value={f.faculty_id}>
                  {f.name} ({f.email})
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Select Department
            </label>
            <select
              name="dept_id"
              value={selectedDept}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.dept_id} value={dept.dept_id}>
                  {dept.dept_name}
                </option>
              ))}
            </select>
          </div>

          {/* Batch */}
          {selectedDept && (
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Select Batch
              </label>
              <select
                name="batch_id"
                value={formData.batch_id}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Select Batch</option>
                {batches.map((b) => (
                  <option key={b.batch_id} value={b.batch_id}>
                    {b.batch_name} - Sem {b.semester} ({b.year})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Course */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Select Course
            </label>
            <select
              name="subject_code"
              value={formData.subject_code}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">Select Course</option>
              {courses.map((c) => (
                <option key={c.subject_code} value={c.subject_code}>
                  {c.title} ({c.subject_code})
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white font-medium py-2 rounded-lg hover:bg-indigo-600 transition-all"
          >
            Assign Faculty
          </button>

          <button
          onClick={() => navigate(-1)}
          className=" w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          ← Back
        </button>
        
        </form>

        {message && (
          <p className="text-center text-sm text-gray-700 mt-4">{message}</p>
        )}
      </div>
    </div>
  );
};

export default AddTeaches;
