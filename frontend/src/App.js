import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from './api';
import PreferencesForm from './components/PreferencesForm';
import Recommendations from './components/Recommendations';

// Separate the login/register component
function AuthComponent() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [userId, setUserId] = useState(sessionStorage.getItem('userId') || '');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    if (!e || !e.target) {
      console.error('Event object is undefined');
      return;
    }
    
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async () => {
    try {
      const response = await registerUser(formData);
      setUserId(response.data.userId);
      sessionStorage.setItem('userId', response.data.userId);
      setIsLoginView(true); // Switch to login view after successful registration
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      alert("Registration failed.");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await loginUser({
        username: formData.username,
        password: formData.password
      });
      if (response.data.token) {
        sessionStorage.setItem('token', response.data.token);
        sessionStorage.setItem('userId', response.data.userId);
        setUserId(response.data.userId);
        navigate("/preferences");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8 md:py-16 max-w-md">
        {/* Logo/Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Movie Matchmaker
          </h1>
          <p className="text-gray-400 text-lg">
            Discover your next favorite film
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          {/* Toggle Buttons */}
          <div className="flex mb-8 bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setIsLoginView(true)}
              className={`flex-1 py-2 rounded-md transition-all duration-200 ${
                isLoginView 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLoginView(false)}
              className={`flex-1 py-2 rounded-md transition-all duration-200 ${
                !isLoginView 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 mb-1 text-sm">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter your username"
              />
            </div>

            {!isLoginView && (
              <div>
                <label className="block text-gray-400 mb-1 text-sm">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-400 mb-1 text-sm">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="Enter your password"
              />
            </div>

            <button
              onClick={isLoginView ? handleLogin : handleRegister}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors duration-200 mt-6"
            >
              {isLoginView ? 'Login' : 'Create Account'}
            </button>
          </div>

          {/* Helper Text */}
          <p className="text-center text-gray-400 mt-6">
            {isLoginView ? (
              <>
                New to Movie Matchmaker?{' '}
                <button
                  onClick={() => setIsLoginView(false)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setIsLoginView(true)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Login here
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

// Main App component with Router
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthComponent />} />
        <Route path="/preferences" element={<PreferencesForm />} />
        <Route path="/recommendations" element={<Recommendations />} />
      </Routes>
    </Router>
  );
}