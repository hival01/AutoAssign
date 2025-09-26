import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function SelectedQuestionCard({ question, index, onRemove, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(question);

  const handleSave = () => {
    onUpdate(editText);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between bg-white/70 backdrop-blur-lg p-4 rounded-xl shadow-md hover:shadow-lg transition">
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
      ) : (
        <p className="flex-1 text-gray-700">{question}</p>
      )}

      <div className="flex gap-2 ml-4">
        {isEditing ? (
          <button
            onClick={handleSave}
            className="px-3 py-1 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            Edit
          </button>
        )}
        <button
          onClick={() => onRemove(question)}
          className="px-3 py-1 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

function GenerateQuestionsPage() {
  const location = useLocation();
  const { user } = location.state || {};
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("topic");

  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");

  // fetch subjects taught by faculty
  useEffect(() => {
    if (!user?.id) return;
    axios
      .get(`http://localhost:3007/api/faculty/subjects/${user.id}`)
      .then((res) => setSubjects(res.data))
      .catch((err) => console.error("Error fetching subjects:", err));
  }, [user?.id]);

  const handleTopicSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:3007/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();
      const qArray = Array.isArray(data.questions)
        ? data.questions
        : (data.questions || "").split("\n").filter((q) => q.trim());
      setQuestions(qArray);
    } catch (error) {
      console.error("Error generating questions:", error);
      setQuestions(["Error: Could not connect to server."]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await fetch("http://localhost:3007/upload-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      const qArray = Array.isArray(data.questions)
        ? data.questions
        : (data.questions || "").split("\n").filter((q) => q.trim());
      setQuestions(qArray);
    } catch (error) {
      console.error("Error uploading PDF:", error);
      setQuestions(["Error: Could not connect to server."]);
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = (question) => {
    if (!selectedQuestions.includes(question)) {
      setSelectedQuestions([...selectedQuestions, question]);
    }
  };

  const removeQuestion = (question) => {
    setSelectedQuestions(selectedQuestions.filter((q) => q !== question));
  };

  const handleSubmitSelected = async () => {
    if (selectedQuestions.length === 0) return alert("No questions selected");
    if (!selectedSubject) return alert("Please select a subject first");

    try {
      const response = await fetch(
        "http://localhost:3007/api/faculty/save-questions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questions: selectedQuestions,
            source: activeTab === "topic" ? "TOPIC" : "PDF",
            topic: topic || (file ? file.name.replace(/\.[^/.]+$/, "") : null),
            subject_code: selectedSubject,
            created_by: user.id,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert(`✅ ${data.count} questions saved successfully!`);
        setSelectedQuestions([]);
      } else {
        alert("❌ Failed to save questions.");
      }
    } catch (error) {
      console.error("Error saving questions:", error);
      alert("Error: Could not save questions.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex flex-col items-center py-10 px-6">
      {/* Header */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          AutoAssign
        </h1>
        <p className="text-gray-600 mt-2">
          Generate unique assignment questions with AI
        </p>
      </header>

      {/* Subject dropdown */}
      <div className="w-full max-w-lg mb-6 bg-white/70 backdrop-blur-lg p-5 rounded-xl shadow-lg">
        <label className="block text-gray-700 font-medium mb-2">
          Select Subject:
        </label>
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
        >
          <option value="">--Select--</option>
          {subjects.map((sub) => (
            <option key={sub.subject_code} value={sub.subject_code}>
              {sub.title} ({sub.subject_code})
            </option>
          ))}
        </select>
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-10 px-6 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 shadow-md transition"
      >
        ⬅ Back
      </button>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-7xl">
        {/* Input Section */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Generate Questions
          </h2>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab("topic")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                activeTab === "topic"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } transition`}
            >
              Topic
            </button>
            <button
              onClick={() => setActiveTab("pdf")}
              className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                activeTab === "pdf"
                  ? "bg-purple-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } transition`}
            >
              PDF Upload
            </button>
          </div>

          {activeTab === "topic" ? (
            <form onSubmit={handleTopicSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="topic"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Topic Name
                </label>
                <input
                  id="topic"
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading || !topic.trim()}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-400 to-purple-600 text-white font-medium shadow-md hover:from-purple-500 hover:to-purple-700 transition disabled:opacity-80"
              >
                {loading ? "Generating..." : "Generate Questions"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div>
                <label
                  htmlFor="pdf"
                  className="block text-gray-700 font-medium mb-1"
                >
                  Upload PDF Document
                </label>
                <input
                  id="pdf"
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full text-gray-700"
                />
                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {file.name}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || !file}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 text-white font-medium shadow-md hover:from-blue-500 hover:to-blue-700 transition disabled:opacity70"
              >
                {loading ? "Processing..." : "Upload & Generate"}
              </button>
            </form>
          )}
        </div>

        {/* Generated Questions */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Generated Questions
          </h2>
          {questions.length > 0 ? (
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-gray-50 rounded-lg p-3 shadow-sm hover:shadow-md transition"
                >
                  <p className="text-gray-700">{q}</p>
                  <button
                    onClick={() => addQuestion(q)}
                    className="px-3 py-1 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              Generated questions will appear here
            </p>
          )}
        </div>

        {/* Selected Questions */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Selected Questions
          </h2>
          {selectedQuestions.length > 0 ? (
            <div className="space-y-3">
              {selectedQuestions.map((q, idx) => (
                <SelectedQuestionCard
                  key={idx}
                  question={q}
                  index={idx}
                  onRemove={removeQuestion}
                  onUpdate={(newText) => {
                    const updated = [...selectedQuestions];
                    updated[idx] = newText;
                    setSelectedQuestions(updated);
                  }}
                />
              ))}
              <button
                onClick={handleSubmitSelected}
                className="w-full py-2 rounded-lg bg-gradient-to-r from-green-400 to-green-600 text-white font-medium shadow-md hover:from-green-500 hover:to-green-700 transition"
              >
                Submit All
              </button>
            </div>
          ) : (
            <p className="text-gray-500">No questions selected yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default GenerateQuestionsPage;
