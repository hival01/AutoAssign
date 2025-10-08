import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddBatch = () => {
  const navigate = useNavigate();
  const [batchName, setBatchName] = useState("");
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState("");
  const [deptId, setDeptId] = useState("");
  const [departments, setDepartments] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch department list
  useEffect(() => {
    axios
      .get("http://localhost:3007/api/departments")
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Error fetching departments:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!batchName || !semester || !year || !deptId) {
      setMessage("Please fill all fields.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:3007/api/admin/add-batch",
        {
          batch_name: batchName,
          semester: Number(semester),
          year: Number(year),
          dept_id: Number(deptId),
        }
      );

      setMessage(res.data.message || "Batch added successfully!");
      setBatchName("");
      setSemester("");
      setYear("");
      setDeptId("");
    } catch (err) {
      console.error(err);
      setMessage("Error adding batch. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center py-12 px-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Add Batch
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Batch Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Batch Name
            </label>
            <input
              type="text"
              value={batchName}
              onChange={(e) => setBatchName(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="e.g., CE_A1"
              required
            />
          </div>

          {/* Semester */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Semester
            </label>
            <input
              type="number"
              value={semester}
              onChange={(e) => {
                const val = Math.max(1, Math.min(8, Number(e.target.value)));
                setSemester(val);
              }}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="e.g., 4"
              min="1"
              max="8"
              required
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-yellow-400 outline-none"
              placeholder="e.g., 2025"
              required
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Department
            </label>
            <select
              value={deptId}
              onChange={(e) => setDeptId(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-yellow-400 outline-none"
              required
            >
              <option value="">-- Select Department --</option>
              {departments.map((dept) => (
                <option key={dept.dept_id} value={dept.dept_id}>
                  {dept.dept_name} ({dept.dept_code})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
          >
            Add Batch
          </button>
        </form>

        {message && (
          <p className="text-center text-sm text-gray-600 mt-4">{message}</p>
        )}

        <button
          onClick={() => navigate(-1)}
          className="mt-6 w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default AddBatch;
