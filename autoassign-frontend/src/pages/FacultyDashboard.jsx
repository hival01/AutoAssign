import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from 'react-router-dom';

const FacultyDashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = location.state || {};
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [students, setStudents] = useState([]);

    // Fetch subjects taught by the faculty
    useEffect(() => {
        if (!user?.id) return;

        axios.get(`http://localhost:3007/api/faculty/subjects/${user.id}`)
            .then((res) => setSubjects(res.data))
            .catch((err) => console.error("Error fetching subjects:", err));
    }, [user?.id]);

    // Fetch assignments when a subject is selected
    useEffect(() => {
        if (!selectedSubject) return;

        axios.get(`http://localhost:3007/api/assignments/${selectedSubject}`)
            .then((res) => setAssignments(res.data))
            .catch((err) => console.error("Error fetching assignments:", err));

        setStudents([]); // reset students on subject change
        setSelectedAssignment(null);
    }, [selectedSubject]);

    // Fetch students when an assignment is selected
    useEffect(() => {
        if (!selectedAssignment) return;

        axios.get(`http://localhost:3007/api/faculty/students/${user.id}/${selectedSubject}/${selectedAssignment}`)
            .then((res) => setStudents(res.data))
            .catch((err) => console.error("Error fetching students:", err));
    }, [selectedAssignment, selectedSubject, user?.id]);

    const handleSubjectChange = (e) => {
        setSelectedSubject(e.target.value);
    };

    const handleAssignmentChange = (e) => {
        setSelectedAssignment(e.target.value);
    };

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3007/api/logout');
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error.response ? error.response.data.error : error.message);
        }
    };

    const handleChangePassword = () => {
        navigate('/ChangePassword', { state: { userId: user.id, role: 'faculty' } });
    };

    // return (
    //     <div className="p-4">
    //         <h1 className="text-2xl font-bold mb-6">Faculty Dashboard</h1>

    //         {/* Navigation Buttons */}
    //         <div className="flex gap-4 mb-8">
    //             <div className="navbar">
    //                 <ul>
    //                     <li><button onClick={() => { }}>View Assignment</button></li>
    //                     <li><button onClick={handleChangePassword}>Change Password</button></li>
    //                     <li><button onClick={handleLogout}>Logout</button></li>
    //                 </ul>
    //             </div>
    //             <button
    //                 onClick={() => navigate("/gen-questions", { state: { user } })}
    //                 className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
    //             >
    //                 Generate Questions
    //             </button>
    //             <button
    //                 onClick={() => navigate("/CreateAssignment", { state: { user } })}
    //                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    //             >
    //                 Create Assignment
    //             </button>
    //             <button
    //                 onClick={() => navigate("/AssignAssignment", { state: { user } })}
    //                 className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
    //             >
    //                 Assign Assignment
    //             </button>
    //         </div>

    //         {/* Subject selection */}
    //         <div className="mb-4">
    //             <label className="mr-2">Select Subject:</label>
    //             <select value={selectedSubject || ""} onChange={handleSubjectChange}>
    //                 <option value="">--Select--</option>
    //                 {subjects.map((sub) => (
    //                     <option key={sub.subject_code} value={sub.subject_code}>
    //                         {sub.title} ({sub.subject_code})
    //                     </option>
    //                 ))}
    //             </select>
    //         </div>

    //         {/* Assignment selection */}
    //         {selectedSubject && assignments.length > 0 && (
    //             <div className="mb-4">
    //                 <label className="mr-2">Select Assignment:</label>
    //                 <select value={selectedAssignment || ""} onChange={handleAssignmentChange}>
    //                     <option value="">--Select--</option>
    //                     {assignments.map((a) => (
    //                         <option key={a.assignment_id} value={a.assignment_id}>
    //                             {a.title}
    //                         </option>
    //                     ))}
    //                 </select>
    //             </div>
    //         )}

    //         {/* Students table */}
    //         {students.length > 0 && (
    //             <div className="mb-6">
    //                 <h2 className="text-xl font-semibold mb-2">Students</h2>
    //                 <table className="border-collapse border w-full">
    //                     <thead>
    //                         <tr>
    //                             <th className="border p-2">Student ID</th>
    //                             <th className="border p-2">Name</th>
    //                             <th className="border p-2">Assignment Status</th>
    //                         </tr>
    //                     </thead>
    //                     <tbody>
    //                         {students.map((stu) => (
    //                             <tr key={stu.student_id}>
    //                                 <td className="border p-2">{stu.student_id}</td>
    //                                 <td className="border p-2">{stu.name}</td>
    //                                 <td className="border p-2">
    //                                     {stu.status === "submitted" ? (
    //                                         <>
    //                                             Submitted{" "}
    //                                             {stu.filePath && (
    //                                                 <a href={`http://localhost:3007/${stu.filePath}`} download>
    //                                                     (Download)
    //                                                 </a>
    //                                             )}
    //                                         </>
    //                                     ) : (
    //                                         "Pending"
    //                                     )}
    //                                 </td>
    //                             </tr>
    //                         ))}
    //                     </tbody>
    //                 </table>
    //             </div>
    //         )}
    //     </div>
    // );
    return (
  <div className="p-6 max-w-6xl mx-auto">
    <h1 className="text-3xl font-bold mb-8 text-center">Faculty Dashboard</h1>

    {/* Navigation Buttons */}
    <div className="flex flex-wrap justify-center gap-4 mb-10">
      {/* <button
        onClick={() => { }}
        className="px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600"
      >
        View Assignment
      </button> */}
      <button
        onClick={handleChangePassword}
        className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600"
      >
        Change Password
      </button>
      
      <button
        onClick={() => navigate("/gen-questions", { state: { user } })}
        className="px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600"
      >
        Generate Questions
      </button>
      <button
        onClick={() => navigate("/CreateAssignment", { state: { user } })}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600"
      >
        Create Assignment
      </button>
      <button
        onClick={() => navigate("/AssignAssignment", { state: { user } })}
        className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600"
      >
        Assign Assignment
      </button>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
      >
        Logout
      </button>
    </div>

    {/* Subject selection */}
    <div className="mb-6">
      <label className="block mb-2 font-medium">Select Subject:</label>
      <select
        value={selectedSubject || ""}
        onChange={handleSubjectChange}
        className="w-full border rounded-lg p-2"
      >
        <option value="">-- Select Subject --</option>
        {subjects.map((sub) => (
          <option key={sub.subject_code} value={sub.subject_code}>
            {sub.title} ({sub.subject_code})
          </option>
        ))}
      </select>
    </div>

    {/* Assignment selection */}
    {selectedSubject && assignments.length > 0 && (
      <div className="mb-6">
        <label className="block mb-2 font-medium">Select Assignment:</label>
        <select
          value={selectedAssignment || ""}
          onChange={handleAssignmentChange}
          className="w-full border rounded-lg p-2"
        >
          <option value="">-- Select Assignment --</option>
          {assignments.map((a) => (
            <option key={a.assignment_id} value={a.assignment_id}>
              {a.title}
            </option>
          ))}
        </select>
      </div>
    )}

    {/* Students table */}
    {students.length > 0 && (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Students</h2>
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Student ID</th>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Assignment Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((stu, idx) => (
                <tr key={stu.student_id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="border px-4 py-2">{stu.student_id}</td>
                  <td className="border px-4 py-2">{stu.name}</td>
                  <td className="border px-4 py-2">
                    {stu.status === "submitted" ? (
                      <>
                        <span className="text-green-600 font-medium">Submitted</span>{" "}
                        {stu.filePath && (
                          <a
                            href={`http://localhost:3007/${stu.filePath}`}
                            download
                            className="text-blue-600 underline ml-2"
                          >
                            Download
                          </a>
                        )}
                      </>
                    ) : (
                      <span className="text-red-500 font-medium">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>
);

  };

export default FacultyDashboard;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useLocation, useNavigate } from "react-router-dom";

// const FacultyDashboard = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { user } = location.state || {};
//   const [subjects, setSubjects] = useState([]);
//   const [selectedSubject, setSelectedSubject] = useState(null);
//   const [students, setStudents] = useState([]);

//   // Fetch subjects taught by the faculty
//   useEffect(() => {
//     if (!user?.id) return;
//     axios
//       .get(`http://localhost:3007/api/faculty/subjects/${user.id}`)
//       .then((res) => setSubjects(res.data))
//       .catch((err) => console.error("Error fetching subjects:", err));
//   }, [user?.id]);

//   // Fetch students when a subject is selected
//   useEffect(() => {
//     if (!selectedSubject) return;
//     axios
//       .get(`http://localhost:3007/api/faculty/students/${user.id}/${selectedSubject}`)
//       .then((res) => setStudents(res.data))
//       .catch((err) => console.error("Error fetching students:", err));
//   }, [selectedSubject, user?.id]);

//   const handleSubjectChange = (e) => {
//     setSelectedSubject(e.target.value);
//     setStudents([]);
//   };

//   const handleLogout = async () => {
//     try {
//       await axios.post("http://localhost:3007/api/logout");
//       navigate("/");
//     } catch (error) {
//       console.error("Logout failed:", error.response ? error.response.data.error : error.message);
//     }
//   };

//   const handleChangePassword = () => {
//     navigate("/ChangePassword", { state: { userId: user.id, role: "faculty" } });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex flex-col items-center py-12 px-6">
//       {/* Header */}
//       <h1 className="text-4xl font-extrabold text-gray-800 mb-10 tracking-tight">
//         Faculty Dashboard
//       </h1>

//       {/* Navigation Buttons */}
//       <div className="flex flex-wrap gap-4 mb-10">
//         <button
//           onClick={() => {}}
//           className="px-5 py-2 rounded-2xl shadow-md bg-white/70 backdrop-blur-md text-gray-700 hover:bg-white/90 transition"
//         >
//           View Assignment
//         </button>
//         <button
//           onClick={handleChangePassword}
//           className="px-5 py-2 rounded-2xl shadow-md bg-white/70 backdrop-blur-md text-gray-700 hover:bg-white/90 transition"
//         >
//           Change Password
//         </button>
//         <button
//           onClick={handleLogout}
//           className="px-5 py-2 rounded-2xl shadow-md bg-red-500 text-white hover:bg-red-600 transition"
//         >
//           Logout
//         </button>
//         <button
//           onClick={() => navigate("/gen-questions", { state: { user } })}
//           className="px-5 py-2 rounded-2xl shadow-md bg-gradient-to-r from-green-400 to-green-500 text-white hover:from-green-500 hover:to-green-600 transition"
//         >
//           Generate Questions
//         </button>
//         <button
//           onClick={() => navigate("/CreateAssignment", { state: { user } })}
//           className="px-5 py-2 rounded-2xl shadow-md bg-gradient-to-r from-blue-400 to-blue-500 text-white hover:from-blue-500 hover:to-blue-600 transition"
//         >
//           Create Assignment
//         </button>
//         <button
//           onClick={() => navigate("/AssignAssignment", { state: { user } })}
//           className="px-5 py-2 rounded-2xl shadow-md bg-gradient-to-r from-purple-400 to-purple-500 text-white hover:from-purple-500 hover:to-purple-600 transition"
//         >
//           Assign Assignment
//         </button>
//       </div>

//       {/* Subject Selection */}
//       <div className="w-full max-w-lg bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6 mb-10">
//         <label className="block text-gray-700 font-medium mb-2">Select Subject:</label>
//         <select
//           value={selectedSubject || ""}
//           onChange={handleSubjectChange}
//           className="w-full p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
//         >
//           <option value="">--Select--</option>
//           {subjects.map((sub) => (
//             <option key={sub.subject_code} value={sub.subject_code}>
//               {sub.title} ({sub.subject_code})
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Students Table */}
//       {students.length > 0 && (
//         <div className="w-full max-w-4xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Students</h2>
//           <table className="w-full border-collapse rounded-xl overflow-hidden">
//             <thead className="bg-gradient-to-r from-purple-200 to-blue-200">
//               <tr>
//                 <th className="p-3 text-left text-gray-700">Student ID</th>
//                 <th className="p-3 text-left text-gray-700">Name</th>
//                 <th className="p-3 text-left text-gray-700">Assignment Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {students.map((stu, idx) => (
//                 <tr
//                   key={stu.student_id}
//                   className={`${idx % 2 === 0 ? "bg-white/50" : "bg-gray-50/50"} hover:bg-purple-50 transition`}
//                 >
//                   <td className="p-3 text-gray-800">{stu.student_id}</td>
//                   <td className="p-3 text-gray-800">{stu.name}</td>
//                   <td className="p-3 text-gray-700">
//                     {stu.status === "submitted" ? (
//                       <>
//                         <span className="text-green-600 font-medium">Submitted</span>
//                         {stu.filePath && (
//                           <a
//                             href={`http://localhost:3007/${stu.filePath}`}
//                             download
//                             className="ml-2 text-blue-500 underline hover:text-blue-700"
//                           >
//                             (Download)
//                           </a>
//                         )}
//                       </>
//                     ) : (
//                       <span className="text-red-500 font-medium">Pending</span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FacultyDashboard;


