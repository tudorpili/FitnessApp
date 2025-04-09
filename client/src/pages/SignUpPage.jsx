import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      navigate('/login');
    } else {
      console.log("Signup failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-700 via-purple-700 to-pink-600 flex justify-center items-center">
      <div
        className={`backdrop-blur-md bg-white/30 p-8 rounded-2xl shadow-lg w-full max-w-md transform transition-all duration-700 ${
          fadeIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6 drop-shadow-lg">Create Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white text-sm font-semibold">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full mt-1 p-3 rounded-lg bg-white/70 border border-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Your username"
            />
          </div>
          <div>
            <label className="text-white text-sm font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 p-3 rounded-lg bg-white/70 border border-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Your email"
            />
          </div>
          <div>
            <label className="text-white text-sm font-semibold">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 p-3 rounded-lg bg-white/70 border border-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
              placeholder="Your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-purple-700 font-semibold py-2 rounded-lg hover:bg-gray-100 transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-center text-white text-sm">
          Already have an account?{' '}
          <a href="/login" className="underline hover:text-yellow-200">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
