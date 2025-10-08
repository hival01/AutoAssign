import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddDepartment = () => {
  const navigate = useNavigate();
  const [deptCode, setDeptCode] = useState("");
  const [deptName, setDeptName] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3007/api/admin/add-department", {
        dept_code: deptCode,
        dept_name: deptName,
      });
      setMessage(res.data.message || "Department added successfully!");
      setDeptCode("");
      setDeptName("");
    } catch (err) {
      console.error(err);
      setMessage("Error adding department. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center py-12 px-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Add Department
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Department Code
            </label>
            <input
              type="text"
              value={deptCode}
              onChange={(e) => setDeptCode(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="e.g., CE"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Department Name
            </label>
            <input
              type="text"
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
              placeholder="e.g., Computer Engineering"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Add Department
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
export default AddDepartment;
