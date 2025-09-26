import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const location = useLocation();
  const { userId, role } = location.state || {};
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3007/api/change-password",
        { userId, role, newPassword, currentPassword }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(
        error.response
          ? error.response.data.error
          : "An error occurred while changing the password."
      );
    }
  };

  const handleBack = () => {
    if (role === "faculty") {
      navigate("/FacultyDashboard", { state: { user: { FacultyID: userId } } });
    } else if (role === "student") {
      navigate("/StudentDashboard", { state: { user: { StudentId: userId } } });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 px-4">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Change Password
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-5">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-sm bg-white/60 placeholder-gray-400"
          />

          {/* Password checklist */}
          <div className="text-sm space-y-1 p-3 rounded-lg bg-red-50 border border-red-200">
            <div>
              {newPassword.length >= 6 && newPassword.length <= 10
                ? "✅ Password is 6–10 characters"
                : "❌ Password must be 6–10 characters"}
            </div>
            <div>
              {/[A-Z]/.test(newPassword)
                ? "✅ Contains uppercase letter"
                : "❌ Must include uppercase letter"}
            </div>
            <div>
              {/[a-z]/.test(newPassword)
                ? "✅ Contains lowercase letter"
                : "❌ Must include lowercase letter"}
            </div>
            <div>
              {/\d/.test(newPassword)
                ? "✅ Contains a number"
                : "❌ Must include a number"}
            </div>
            <div>
              {/[\W_]/.test(newPassword)
                ? "✅ Contains special character"
                : "❌ Must include special character"}
            </div>
          </div>

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-sm bg-white/60 placeholder-gray-400"
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-sm bg-white/60 placeholder-gray-400"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-md hover:opacity-90 transition"
          >
            Change Password
          </button>
        </form>

        {message && (
          <div className="mt-2 text-center text-sm font-medium text-gray-700 ">
            {message}
          </div>
        )}

        <button
          onClick={handleBack}
          className="mt-6 w-full py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition shadow-sm"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default ChangePassword;
