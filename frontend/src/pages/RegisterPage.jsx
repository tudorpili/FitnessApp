// src/pages/RegisterPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link, /*useNavigate*/ } from 'react-router-dom';
import { registerUser } from '../services/api.js'; // <-- Import API function
import { useAuth } from '../contexts/AuthContext.jsx'; // <-- Import useAuth for auto-login
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheckCircle, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

// Input/Password Components
const InputWithIcon = ({ icon, type = 'text', ...props }) => ( /* ... */ <div className="relative"> <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icon}</span> <input type={type} {...props} className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-150 ${props.className}`} /> </div> );
const PasswordInput = ({ icon, value, onChange, id = 'password', ...props }) => { const [showPassword, setShowPassword] = useState(false); return ( <div className="relative"> <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">{icon}</span> <input type={showPassword ? 'text' : 'password'} id={id} value={value} onChange={onChange} {...props} className={`w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-150 ${props.className}`} /> <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-teal-600" aria-label={showPassword ? 'Hide password' : 'Show password'}> {showPassword ? <FiEyeOff /> : <FiEye />} </button> </div> ); };
const PasswordStrengthMeter = ({ strength }) => { /* ... */ const levels = { weak: { color: 'bg-red-500', text: 'Weak' }, medium: { color: 'bg-yellow-500', text: 'Medium' }, strong: { color: 'bg-green-500', text: 'Strong' }, }; const currentLevel = levels[strength] || { color: 'bg-gray-300', text: '' }; const width = strength === 'strong' ? 'w-full' : strength === 'medium' ? 'w-2/3' : 'w-1/3'; return ( <div className="mt-1"> <div className="h-2 bg-gray-200 rounded-full overflow-hidden"> <div className={`h-full rounded-full transition-all duration-300 ${currentLevel.color} ${width}`}></div> </div> {currentLevel.text && ( <p className={`text-xs mt-1 ${ strength === 'strong' ? 'text-green-600' : strength === 'medium' ? 'text-yellow-600' : 'text-red-600' }`}>{currentLevel.text}</p> )} </div> ); };


function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('Beginner'); // Optional field, not sent to backend currently
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  //const navigate = useNavigate();
  const { login } = useAuth(); // Get login function for auto-login

  // Autofocus first input
  useEffect(() => { const firstInput = document.getElementById('username'); if (firstInput) { firstInput.focus(); } }, []);

  // Password strength calculation
  const passwordStrength = useMemo(() => { if (password.length === 0) return ''; let strength = 'weak'; if (password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)) { strength = 'strong'; } else if (password.length >= 6) { strength = 'medium'; } return strength; }, [password]);

  // --- MODIFIED: handleSubmit to use API ---
  const handleSubmit = async (event) => { // Make async
    event.preventDefault();
    setError('');

    // Basic client-side validation
    if (!username || !email || !password || !confirmPassword) { setError('Please fill in all required fields.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match!'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters long.'); return; }
    if (!agreeTerms) { setError('You must agree to the terms and conditions.'); return; }
    // --- End Validation ---

    setIsLoading(true);

    try {
        // Call the API service function
        // We don't send fitnessLevel or agreeTerms to this basic backend endpoint
        const responseData = await registerUser(username, email, password);

        console.log('[RegisterPage] API Registration successful:', responseData);

        if (responseData.token && responseData.user) {
            // Automatically log the user in after successful registration
            localStorage.setItem('authToken', responseData.token); // Store token
            login(responseData.user); // Update AuthContext state
            // Navigation will be handled by the effect in LoginPage or ProtectedRoute now
            alert('Registration successful! You are now logged in.'); // Simple feedback

        } else {
            // Handle unexpected successful response format
            console.error('[RegisterPage] Registration response missing token or user data.');
            setError('Registration successful, but failed to log in automatically.');
        }

    } catch (err) {
        // Handle errors thrown by apiRequest (e.g., 409 Conflict for duplicates)
        console.error('[RegisterPage] API Registration failed:', err);
        setError(err.message || 'Registration failed. Please try again later.');
    } finally {
        setIsLoading(false);
    }
  };
  // --- END MODIFICATION ---


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-teal-100 to-blue-100 px-4 py-8">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Your Account</h2>
        {/* Display API/Validation Error */}
        {error && ( <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4 text-sm flex items-center" role="alert"><FiAlertCircle className="mr-2 h-4 w-4"/> <span className="block sm:inline">{error}</span></div> )}
        <form onSubmit={handleSubmit} noValidate>
            {/* Form Inputs remain the same */}
            <div className="mb-4"><label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label><InputWithIcon icon={<FiUser />} type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Choose a username" autoComplete="username" className="invalid:border-red-500"/></div>
            <div className="mb-4"><label htmlFor="reg-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label><InputWithIcon icon={<FiMail />} type="email" id="reg-email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" autoComplete="email" className="invalid:border-red-500"/></div>
            <div className="mb-2"><label htmlFor="reg-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label><PasswordInput icon={<FiLock />} id="reg-password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Create a password" autoComplete="new-password" className="invalid:border-red-500"/></div>
            <PasswordStrengthMeter strength={passwordStrength} />
            <div className="mt-4 mb-4"><label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label><PasswordInput icon={<FiLock />} id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="Re-enter your password" autoComplete="new-password" className={password && confirmPassword && password !== confirmPassword ? 'border-red-500' : ''}/> {password && confirmPassword && password !== confirmPassword && ( <p className="text-xs text-red-600 mt-1">Passwords do not match.</p> )}</div>
            <div className="mb-4"><label htmlFor="fitness-level" className="block text-sm font-medium text-gray-700 mb-1">Fitness Level <span className="text-xs text-gray-500">(Optional)</span></label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><FiTrendingUp /></span><select id="fitness-level" value={fitnessLevel} onChange={(e) => setFitnessLevel(e.target.value)} className="w-full pl-10 pr-8 py-2 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition duration-150 appearance-none"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"><svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg></div></div></div>
            <div className="mb-6"><div className="flex items-center"><input id="agree-terms" name="agree-terms" type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} required className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"/><label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">I agree to the <a href="#" className="font-medium text-teal-600 hover:underline">Terms and Conditions</a></label></div></div>
            <button type="submit" disabled={isLoading} className={`w-full flex justify-center items-center bg-teal-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition duration-200 ease-in-out transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}> {isLoading ? ( <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Creating Account...</> ) : ( <><FiCheckCircle className="mr-2" /> Register</> )} </button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-600">Already have an account?{' '}<Link to="/login" className="font-medium text-teal-600 hover:text-teal-500 hover:underline">Login here</Link></p>
      </div>
    </div>
  );
}

export default RegisterPage;
