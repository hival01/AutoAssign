import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ChangePassword from "./pages/ChangePasswordPage";
import AddStudent from './pages/AddStudentPage';
import AddFaculty from './pages/AddFacultyPage';
import GenerateQuestions from './pages/GenerateQuestionsPage';
import CreateAssignment from "./pages/CreateAssignmentPage";
import AssignAssignment from "./pages/AssignAssignmentPage"
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/StudentDashboard" element={<StudentDashboard />} />
          <Route path="/FacultyDashboard" element={<FacultyDashboard />} />
          <Route path="/AdminDashboard" element={<AdminDashboard />} />
          <Route path="/ChangePassword" element={<ChangePassword />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/add-faculty" element={<AddFaculty />} />
          <Route path="/gen-questions" element={<GenerateQuestions />} />
          <Route path="/CreateAssignment" element={<CreateAssignment />} />
          <Route path="/AssignAssignment" element={<AssignAssignment />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;

