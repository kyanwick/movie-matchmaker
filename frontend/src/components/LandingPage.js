import React from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="text-center p-8 bg-white bg-opacity-10 rounded-lg shadow-lg max-w-md mx-auto">
                <h1 className="text-4xl font-bold text-white mb-4">Welcome to Movie Recommender</h1>
                <p className="text-lg text-gray-200 mb-8">
                    Get personalized movie recommendations based on your preferences.
                </p>
                <div className="space-x-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition"
                    >
                        Login
                    </button>
                    <button
                        onClick={() => navigate('/register')}
                        className="px-6 py-2 bg-purple-700 text-white rounded-md hover:bg-purple-800 transition"
                    >
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
