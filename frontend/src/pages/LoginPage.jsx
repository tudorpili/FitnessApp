import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Import icons
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn, FiUserCheck } from 'react-icons/fi';
import { FaGoogle, FaGithub } from 'react-icons/fa'; // Example social icons

// Simple reusable Input component with icon support
const InputWithIcon = ({ icon, type = 'text', ...props }) => (
  <div className="relative">
    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
      {icon}
    </span>
    <input
      type={type}
      {...props}
      className={`w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ${props.className}`}
    />
  </div>
);

// Password input with visibility toggle
const PasswordInput = ({ icon, value, onChange, id = 'password', ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
        {icon}
      </span>
      <input
        type={showPassword ? 'text' : 'password'}
        id={id}
        value={value}
        onChange={onChange}
        {...props}
        className={`w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-150 ${props.className}`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-indigo-600"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
};


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // For redirect after mock login

  // Add autofocus to the first input field
  useEffect(() => {
    const firstInput = document.getElementById('email');
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(''); // Reset error
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      // --- MOCK LOGIN LOGIC ---
      if (email === 'user@app.com' && password === 'password') {
        console.log('Login successful for user');
        // In Day 2, we'll update AuthContext here
        navigate('/dashboard'); // Redirect on success
      } else if (email === 'admin@app.com' && password === 'password') {
         console.log('Login successful for admin');
         // In Day 2, we'll update AuthContext here
         navigate('/admin'); // Redirect admin
      } else {
        console.error('Login failed');
        setError('Invalid email or password.'); // Set error message
        // Trigger shake animation by adding/removing a class or state change
      }
      // --- END MOCK LOGIC ---
      setIsLoading(false);
    }, 1500); // Simulate 1.5 seconds delay
  };

  // Conditional classes for shake animation
  const formClasses = `bg-white p-8 sm:p-10 rounded-xl shadow-xl w-full max-w-md transition-transform duration-300 ${
    error ? 'animate-shake' : '' // Add shake class if error exists
  }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 px-4 py-8">
      {/* We can add a split layout here if desired, e.g., using Grid */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"> */}
      {/* Left side (Image/Quote - Placeholder) */}
      {/* <div className="hidden md:flex items-center justify-center"> Motivational content </div> */}

      {/* Right Side (Form) - currently centered */}
      <div className={formClasses}>
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-600 mb-8">Login to continue your fitness journey.</p>

        {/* Display Error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate> {/* Disable default browser validation bubbles */}
          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <InputWithIcon
              icon={<FiMail />}
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              autoComplete="email"
              // Use :invalid pseudo-class for styling if needed
              // className="invalid:border-red-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <PasswordInput
              icon={<FiLock />}
              id="login-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              autoComplete="current-password"
              // className="invalid:border-red-500"
            />
          </div>

          {/* Remember Me & Forgot Password Row */}
          <div className="flex items-center justify-between mb-6 text-sm">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-gray-900">
                Remember me
              </label>
            </div>
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading} // Disable button while loading
            className={`w-full flex justify-center items-center bg-indigo-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </>
            ) : (
              <>
                <FiLogIn className="mr-2" /> Login
              </>
            )}
          </button>
        </form>

        {/* OR Separator */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-sm">Or continue with</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Continue as Guest Button */}
        <button
          type="button" // Crucial: Not type="submit"
          onClick={() => navigate('/exercises')} // Navigate to a public guest page (e.g., exercises)
          className="w-full flex justify-center items-center bg-white text-gray-700 py-2.5 px-4 rounded-lg font-semibold border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 ease-in-out shadow-sm"
        >
          <FiUserCheck className="mr-2" /> {/* Icon for Guest */}
          Continue as Guest
        </button>

        {/* Social Login Buttons (Placeholders) */}
        <div className="flex justify-center space-x-4">
          <button aria-label="Login with Google" className="p-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition duration-150">
            <FaGoogle size={20} />
          </button>
          <button aria-label="Login with Github" className="p-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition duration-150">
            <FaGithub size={20} />
          </button>
          {/* Add more social logins if needed */}
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
      {/* </div> End of Grid for Split Layout */}
    </div>
  );
}

export default LoginPage;

