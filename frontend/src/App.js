import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from './api';
import PreferencesForm from './components/PreferencesForm';
import Recommendations from './components/Recommendations';
import { AlertCircle } from 'lucide-react';

function App() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [setUserId] = useState(sessionStorage.getItem('userId') || '');
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Email validation (only for registration)
    if (!isLoginView) {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const response = await registerUser(formData);
      setUserId(response.data.userId);
      sessionStorage.setItem('userId', response.data.userId);
      setIsLoginView(true);
      setFormData(prev => ({
        ...prev,
        email: '' // Clear email when switching to login
      }));
      // Success message
      alert("Account created successfully! Please login.");
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      setErrors(prev => ({
        ...prev,
        submit: error.response?.data?.message || "Registration failed. Please try again."
      }));
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

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
      setErrors(prev => ({
        ...prev,
        submit: "Invalid username or password."
      }));
    }
  };

  const handleViewSwitch = (isLogin) => {
    setIsLoginView(isLogin);
    setErrors({}); // Clear errors when switching views
    setFormData({
      username: '',
      email: '',
      password: ''
    });
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
              onClick={() => handleViewSwitch(true)}
              className={`flex-1 py-2 rounded-md transition-all duration-200 ${
                isLoginView 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => handleViewSwitch(false)}
              className={`flex-1 py-2 rounded-md transition-all duration-200 ${
                !isLoginView 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              <span>{errors.submit}</span>
            </div>
          )}

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
                className={`w-full px-4 py-3 rounded-lg bg-gray-700 border text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors ${
                  errors.username ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Enter your username"
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username}</p>
              )}
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
                  className={`w-full px-4 py-3 rounded-lg bg-gray-700 border text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
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
                className={`w-full px-4 py-3 rounded-lg bg-gray-700 border text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors ${
                  errors.password ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password}</p>
              )}
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
                  onClick={() => handleViewSwitch(false)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => handleViewSwitch(true)}
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

export default function MainApp() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/preferences" element={<PreferencesForm />} />
        <Route path="/recommendations" element={<Recommendations />} />
      </Routes>
    </Router>
  );
}