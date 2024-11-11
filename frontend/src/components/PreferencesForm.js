import React, { useState, useEffect } from 'react';
import { savePreferences, getUserPreferences } from '../api';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Loader2, Film, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PreferencesForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    genres: [],
    decade: '',
    pace: '',
    themes: [],
    director: '',
    length: '',
    language: '',
    franchise: '',
    movieType: '',
    blockbuster: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const userId = sessionStorage.getItem('userId');
  const navigate = useNavigate();

  const questions = [
    {
      id: 'genres',
      title: 'What types of movies do you enjoy?',
      subtitle: 'Select all that apply',
      type: 'multiSelect',
      options: [
        { value: '28', label: 'Action' },
        { value: '35', label: 'Comedy' },
        { value: '18', label: 'Drama' },
        { value: '53', label: 'Thriller' },
        { value: '27', label: 'Horror' },
        { value: '878', label: 'Sci-Fi' },
        { value: '10749', label: 'Romance' },
        { value: '14', label: 'Fantasy' },
        { value: '16', label: 'Animation' },
        { value: '9648', label: 'Mystery' },
        { value: '80', label: 'Crime' },
        { value: '12', label: 'Adventure' },
        { value: '99', label: 'Documentary' }
      ]
    },
    {
      id: 'decade',
      title: 'Which movie era do you prefer?',
      type: 'select',
      options: [
        { value: '2010s', label: '2010s - Present' },
        { value: '2000s', label: '2000s' },
        { value: '1990s', label: '1990s' },
        { value: '1980s', label: '1980s' },
        { value: '1970s', label: '1970s or older' }
      ]
    },
    {
      id: 'pace',
      title: 'What type of movie pace do you prefer?',
      type: 'select',
      options: [
        { value: 'Slow-Burning', label: 'Slow-Burning' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Fast-Paced', label: 'Fast-Paced' }
      ]
    },
    {
      id: 'themes',
      title: 'Which themes or moods do you enjoy in movies?',
      subtitle: 'Select all that apply',
      type: 'multiSelect',
      options: [
        { value: 'Feel-Good', label: 'Feel-Good' },
        { value: 'Thought-Provoking', label: 'Thought-Provoking' },
        { value: 'Dark', label: 'Dark' },
        { value: 'Inspirational', label: 'Inspirational' },
        { value: 'Suspenseful', label: 'Suspenseful' },
        { value: 'Romantic', label: 'Romantic' },
        { value: 'Humorous', label: 'Humorous' },
        { value: 'Family-Friendly', label: 'Family-Friendly' }
      ]
    },
    {
      id: 'director',
      title: 'Do you have any favorite directors?',
      type: 'select',
      options: [
        { value: 'Christopher Nolan', label: 'Christopher Nolan' },
        { value: 'Quentin Tarantino', label: 'Quentin Tarantino' },
        { value: 'Steven Spielberg', label: 'Steven Spielberg' },
        { value: 'Martin Scorsese', label: 'Martin Scorsese' },
        { value: 'no-preference', label: 'No Preference' }
      ]
    },
    {
      id: 'length',
      title: "What's your preferred movie length?",
      type: 'select',
      options: [
        { value: 'short', label: 'Short (Under 90 minutes)' },
        { value: 'medium', label: 'Medium (90–120 minutes)' },
        { value: 'long', label: 'Long (Over 120 minutes)' },
        { value: 'no-preference', label: 'No Preference' }
      ]
    },
    {
      id: 'language',
      title: 'Do you prefer movies in any specific language?',
      type: 'select',
      options: [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
        { value: 'fr', label: 'French' },
        { value: 'ko', label: 'Korean' },
        { value: 'ja', label: 'Japanese' },
        { value: 'it', label: 'Italian' },
        { value: 'de', label: 'German' },
        { value: 'no-preference', label: 'No Preference' }
      ]
    },
    {
      id: 'franchise',
      title: 'Do you prefer standalone movies or franchises?',
      type: 'select',
      options: [
        { value: 'true', label: 'Franchises (Star Wars, Marvel, etc.)' },
        { value: 'false', label: 'Standalone Movies' },
        { value: 'null', label: 'No Preference' }
      ]
    },
    {
      id: 'blockbuster',
      title: 'Do you prefer popular blockbusters or independent films?',
      type: 'select',
      options: [
        { value: 'true', label: 'Blockbusters' },
        { value: 'false', label: 'Independent Films' },
        { value: 'null', label: 'Both' }
      ]
    },
    {
      id: 'movieType',
      title: 'Which of these do you watch most often?',
      type: 'select',
      options: [
        { value: 'feature', label: 'Movie (Feature)' },
        { value: 'short', label: 'Short Film' },
        { value: 'documentary', label: 'Documentary' }
      ]
    }
  ];

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return;
    }

    const storedPreferences = sessionStorage.getItem('preferences');
    if (storedPreferences) {
      setPreferences(JSON.parse(storedPreferences));
    }
    
    const fetchPreferences = async () => {
      try {
        const userPreferences = await getUserPreferences(userId);
        if (userPreferences) {
          setPreferences(userPreferences);
        }
      } catch (error) {
        console.error("Error loading user preferences:", error);
      }
    };
    fetchPreferences();
  }, [userId, navigate]);

  const validateCurrentStep = () => {
    const currentQuestion = questions[currentStep];
    if (currentQuestion.type === 'multiSelect') {
      if (preferences[currentQuestion.id].length === 0) {
        setError(`Please select at least one ${currentQuestion.id} option`);
        return false;
      }
    } else {
      if (!preferences[currentQuestion.id]) {
        setError(`Please select a ${currentQuestion.id} option`);
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep() && currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setError('');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const handleSelect = (value) => {
    const question = questions[currentStep];
    if (question.type === 'multiSelect') {
      setPreferences((prev) => ({
        ...prev,
        [question.id]: prev[question.id].includes(value)
          ? prev[question.id].filter((v) => v !== value)
          : [...prev[question.id], value]
      }));
    } else {
      setPreferences((prev) => ({
        ...prev,
        [question.id]: value
      }));
    }
    setError('');
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    setIsSubmitting(true);
    try {
      await savePreferences(userId, preferences);
      sessionStorage.setItem('preferences', JSON.stringify(preferences));
      navigate('/recommendations');
    } catch (error) {
      console.error('Error saving preferences:', error);
      setError('Failed to save preferences. Please try again.');
    }
    setIsSubmitting(false);
  };

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8 max-w-lg">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-2">
            <Film className="w-8 h-8 text-blue-500 mr-2" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Your Movie Profile
            </h1>
          </div>
          <p className="text-gray-400">
            Help us understand your movie preferences
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-700 h-2 rounded-full mb-8">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-500">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Question Card */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {currentQuestion.title}
              </h2>
              {currentQuestion.subtitle && (
                <p className="text-gray-400 text-sm">
                  {currentQuestion.subtitle}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`w-full p-4 text-left rounded-lg border transition-all
                    ${currentQuestion.type === 'multiSelect'
                      ? preferences[currentQuestion.id].includes(option.value)
                        ? 'border-blue-500 bg-blue-500/20 text-white'
                        : 'border-gray-700 hover:border-gray-600 text-gray-300'
                      : preferences[currentQuestion.id] === option.value
                      ? 'border-blue-500 bg-blue-500/20 text-white'
                      : 'border-gray-700 hover:border-gray-600 text-gray-300'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors
              ${currentStep === 0
                ? 'text-gray-600 cursor-not-allowed'
                : 'text-gray-400 hover:text-white'
              }`}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Previous
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Finding Movies...
                </>
              ) : (
                'Find My Movies'
              )}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center px-4 py-2 text-gray-400 hover:text-white rounded-lg transition-colors"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreferencesForm;