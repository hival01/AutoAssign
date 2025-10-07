import React from "react";
import { useNavigate } from "react-router-dom";
import NotfoundImage from "../assets/404_image.png";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-gray-100 to-blue-100 text-center p-6">
      <div className="max-w-lg w-full ">
        <img
          src={NotfoundImage}
          alt="404 Not Found"
          className="w-full max-w-xs mx-auto mb-5 drop-shadow-md"
        />
        
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-transform hover:scale-105"
        >
          ⬅️ Go Home
        </button>
      </div>
    </div>
  );
}
