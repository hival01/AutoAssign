import React, { useState } from "react";
import axios from "axios";

const UploadAssignment = ({ studentId, assignmentId }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  console.log(studentId + assignmentId);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("studentId", studentId);
    formData.append("assignmentId", assignmentId);

    try {
      const response = await axios.post(
        "http://localhost:3007/api/upload-assignment",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      console.error("Error uploading assignment:", error);
      setMessage("An error occurred while uploading the assignment.");
    }
  };

  return (
    <div>
      <h3>Upload Assignment</h3>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          onChange={handleFileChange}
          required
          className="mb-3"
        />

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Upload
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadAssignment;
