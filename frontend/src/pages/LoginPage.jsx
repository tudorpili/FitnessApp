// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { loginUser } from '../services/api.js'; // <-- Import API function
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn, FiUserCheck, FiAlertCircle } from 'react-icons/fi'; // Added FiAlertCircle
import { FaGoogle, FaGithub } from 'react-icons/fa';

// Input Components
const InputWithIcon = ({ icon, type = 'text', ...props }) => (/* ... */ <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icon}</span><input type={type} {...props} className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ${props.className}`} /></div> );
const PasswordInput = ({ icon, value, onChange, id = 'password', ...props }) => { const [showPassword, setShowPassword] = useState(false); return ( <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icon}</span><input type={showPassword ? 'text' : 'password'} id={id} value={value} onChange={onChange} {...props} className={`w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ${props.className}`} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-indigo-600" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <FiEyeOff /> : <FiEye />}</button></div> ); };


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, user } = useAuth();

  // Autofocus effect
  useEffect(() => { if (!isAuthenticated) { const firstInput = document.getElementById('email'); if (firstInput) { firstInput.focus(); } } }, [isAuthenticated]);

  // Redirect effect
  useEffect(() => { if (isAuthenticated && user) { const destination = location.state?.from?.pathname || (user.role === 'Admin' ? '/admin' : '/dashboard'); console.log(`[LoginPage] useEffect: Auth=true, User Role='${user.role}'. Navigating to: ${destination}`); requestAnimationFrame(() => { navigate(destination, { replace: true }); }); } }, [isAuthenticated, user, navigate, location.state]);

  // --- MODIFIED: handleSubmit to use API ---
  const handleSubmit = async (event) => { // Make async
    event.preventDefault();
    setError('');
    setIsLoading(true);
    console.log('[LoginPage] handleSubmit triggered.');

    try {
        // Call the API service function
        const responseData = await loginUser(email, password);

        // API call was successful (status 2xx)
        console.log('[LoginPage] API Login successful:', responseData);

        if (responseData.token && responseData.user) {
            // Store the token (e.g., in localStorage)
            localStorage.setItem('authToken', responseData.token);
            console.log('[LoginPage] Token stored in localStorage.');

            // Update the AuthContext state with user data
            login(responseData.user);
            console.log('[LoginPage] AuthContext state update dispatched.');
            // Navigation is handled by the useEffect hook now
        } else {
            // Handle unexpected successful response format
            console.error('[LoginPage] Login response missing token or user data.');
            setError('Login failed due to unexpected server response.');
        }

    } catch (err) {
        // Handle errors thrown by apiRequest (non-2xx status or network errors)
        console.error('[LoginPage] API Login failed:', err);
        // Use the error message from the API response if available
        setError(err.message || 'Login failed. Please check credentials or try again.');
    } finally {
        // Stop loading indicator regardless of success or failure
        setIsLoading(false);
    }
  };
  // --- END MODIFICATION ---

  const formClasses = `bg-white p-8 sm:p-10 rounded-xl shadow-xl w-full max-w-md transition-transform duration-300 ${ error ? 'animate-shake' : '' }`;

  if (isAuthenticated) { return <div className="min-h-screen flex items-center justify-center">Loading...</div>; }

  return (
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4 py-8">
      <div className={formClasses}>
         <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Welcome Back!</h2>
         <p className="text-center text-gray-600 mb-8">Login or continue as guest.</p>
         {/* Display API errors */}
         {error && ( <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 text-sm flex items-center" role="alert"><FiAlertCircle className="mr-2 h-4 w-4"/> <span className="block sm:inline">{error}</span></div> )}
         <form onSubmit={handleSubmit} noValidate>
            {/* Form inputs remain the same */}
            <div className="mb-5"><label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label><InputWithIcon icon={<FiMail />} type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="user@app.com / admin@app.com" autoComplete="email"/></div>
            <div className="mb-4"><label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label><PasswordInput icon={<FiLock />} id="login-password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="password" autoComplete="current-password"/></div>
            <div className="flex items-center justify-between mb-6 text-sm"><div className="flex items-center"><input id="remember-me" name="remember-me" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/><label htmlFor="remember-me" className="ml-2 block text-gray-900">Remember me</label></div><a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">Forgot password?</a></div>
            <button type="submit" disabled={isLoading} className={`w-full flex justify-center items-center bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}>{isLoading ? ( <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Logging in...</> ) : ( <><FiLogIn className="mr-2" /> Login</> )}</button>
         </form>
         {/* Guest button remains */}
         <div className="my-4 flex items-center"><div className="flex-grow border-t border-gray-300"></div><span className="flex-shrink mx-4 text-gray-500 text-xs font-semibold">OR</span><div className="flex-grow border-t border-gray-300"></div></div>
         <button type="button" onClick={() => navigate('/exercises')} className="w-full flex justify-center items-center bg-white text-gray-700 py-2.5 px-4 rounded-lg font-semibold border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out shadow-sm"><FiUserCheck className="mr-2" /> Continue as Guest</button>
         <p className="mt-6 text-center text-sm text-gray-600">Don't have an account yet?{' '}<Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">Register here</Link></p>
         <div className="my-6 flex items-center"><div className="flex-grow border-t border-gray-300"></div><span className="flex-shrink mx-4 text-gray-500 text-sm">Or login with</span><div className="flex-grow border-t border-gray-300"></div></div>
         <div className="flex justify-center space-x-4"><button aria-label="Login with Google" className="p-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition duration-150"><FaGoogle size={20} /></button><button aria-label="Login with Github" className="p-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition duration-150"><FaGithub size={20} /></button></div>
      </div>
    </div>
  );
}

export default LoginPage;
