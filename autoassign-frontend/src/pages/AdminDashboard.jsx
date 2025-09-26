import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserPlus, GraduationCap, LogOut } from "lucide-react"; // icons

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3007/api/logout");
      navigate("/");
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response ? error.response.data.error : error.message
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center py-12 px-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-10">
        Admin Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {/* Add Student Card */}
        <Link
          to="/add-student"
          className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-indigo-500"
        >
          <UserPlus className="w-10 h-10 text-indigo-500 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Add New Student
          </h3>
          <p className="text-gray-500 text-sm">
            Register and manage student profiles.
          </p>
        </Link>

        {/* Add Faculty Card */}
        <Link
          to="/add-faculty"
          className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-green-500"
        >
          <GraduationCap className="w-10 h-10 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Add New Faculty
          </h3>
          <p className="text-gray-500 text-sm">
            Onboard faculty members to the platform.
          </p>
        </Link>

        {/* Logout Card */}
        <button
          onClick={handleLogout}
          className="group relative bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-red-500 text-left"
        >
          <LogOut className="w-10 h-10 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Logout</h3>
          <p className="text-gray-500 text-sm">
            Securely end your current session.
          </p>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
