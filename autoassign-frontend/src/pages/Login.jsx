// import { useState } from 'react';
// import { useNavigate } from "react-router-dom";
// import axios from 'axios';

// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         try {
//             if (email === 'darshitarpatel.admin@charusat.ac.in' && password === 'abcd') {
//                 navigate("/AdminDashboard");
//             } else {
//                 const response = await axios.post('http://localhost:3007/api/login', { email, password });
//                 const { role, user } = response.data;
//                 if (role === 'student') {
//                     navigate("/StudentDashboard", { state: { user } });
//                 } else if (role === 'faculty') {
//                     navigate("/FacultyDashboard", { state: { user } });
//                 }
//             }
//         } catch (error) {
//             if (error.response && error.response.data) {
//                 setError(error.response.data.error);
//             } else {
//                 setError('An error occurred. Please try again.');
//             }
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 px-4">
//             <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl p-8">
//                 <h2 className="text-3xl font-bold text-center text-white mb-6 tracking-wide">
//                     🚀 AutoAssign Login
//                 </h2>

//                 <form onSubmit={handleLogin} className="space-y-5">
//                     <div>
//                         <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
//                         <input
//                             type="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                             className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                             placeholder="Enter your email"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-gray-300 text-sm font-medium mb-2">Password</label>
//                         <input
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                             className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
//                             placeholder="Enter your password"
//                         />
//                     </div>

//                     {error && (
//                         <div className="text-red-500 text-sm text-center font-medium">
//                             {error}
//                         </div>
//                     )}

//                     <button
//                         type="submit"
//                         className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold tracking-wide hover:from-blue-600 hover:to-indigo-700 shadow-lg transform hover:scale-[1.02] transition"
//                     >
//                         Login
//                     </button>
//                 </form>

//                 <p className="text-center text-gray-400 text-sm mt-6">
//                     Made with ❤️ for CHARUSAT
//                 </p>
//             </div>
//         </div>
//     );
// };

// export default Login;


//new lighter theme
// /*
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            if (email === 'darshitarpatel.admin@charusat.ac.in' && password === 'abcd') {
                navigate("/AdminDashboard");
            } else {
                const response = await axios.post('http://localhost:3007/api/login', { email, password });
                const { role, user } = response.data;
                if (role === 'student') {
                    navigate("/StudentDashboard", { state: { user } });
                } else if (role === 'faculty') {
                    navigate("/FacultyDashboard", { state: { user } });
                }
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.error);
            } else {
                setError('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-slate-50 to-gray-100">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-10 space-y-6">
                <h2 className="text-3xl font-semibold text-center text-gray-800">Welcome Back</h2>
                <p className="text-center text-gray-500 text-sm">Sign in to continue to AutoAssign</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-2 block w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-2 block w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="Enter your password"
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-600 focus:ring-4 focus:ring-indigo-200 transition shadow-sm"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center text-gray-700 text-sm mt-6">
                     Made with ❤️ for CHARUSAT
                 </p>
                <p className="text-center text-gray-400 text-xs">
                    © 2025 AutoAssign. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default Login;
// */