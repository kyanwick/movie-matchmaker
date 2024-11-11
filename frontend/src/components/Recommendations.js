import React, { useEffect, useState } from 'react';
import { getTMDBRecommendations } from '../api';
import { Star, Clock, Calendar } from 'lucide-react';

const MovieRecommendations = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards] = useState({});

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const storedPreferences = sessionStorage.getItem('preferences');
        const preferences = storedPreferences ? JSON.parse(storedPreferences) : null;
        
        if (preferences) {
          const recommendations = await getTMDBRecommendations(preferences);
          setMovies(recommendations);
        }
      } catch (error) {
        console.error('Error fetching movie recommendations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const showcaseMovies = movies.slice(0, 3);
  const remainingMovies = movies.slice(3);

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
      <h2 className="text-2xl font-bold text-white mb-6">I Recommend...</h2>
        {/* Showcase Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {showcaseMovies.map(movie => (
            <div 
              key={movie.id}
              className={`bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-500 ease-in-out
                ${expandedCards[movie.id] ? 'lg:col-span-3 transform scale-102' : ''}`}
            >
              <div className="relative group">
                <div className="aspect-[2/3] overflow-hidden">
                  <img
                    src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
                    alt={movie.title}
                    className={`w-full h-full object-cover transition-transform duration-500
                      ${expandedCards[movie.id] ? 'scale-105' : 'group-hover:scale-105'}`}
                  />
                </div>
                
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                
                <div className="absolute top-4 right-4 bg-gray-900 bg-opacity-75 text-white px-3 py-1 rounded-lg flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="text-lg">{movie.vote_average.toFixed(1)}</span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white">{movie.title}</h3>
                </div>

                <div className="flex items-center gap-4 text-gray-300 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-1" />
                    <span>{movie.release_date?.split('-')[0]}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-1" />
                    <span>{movie.runtime || '120'} min</span>
                  </div>
                </div>

                <div className={`transition-all duration-500 overflow-hidden
                  ${expandedCards[movie.id] ? 'max-h-[1000px] opacity-100' : 'max-h-20 opacity-80'}`}>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {movie.overview}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Remaining Movies Grid */}
        {remainingMovies.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">More Recommendations</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {remainingMovies.map(movie => (
                <div 
                  key={movie.id}
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transform hover:scale-102 transition-all duration-300"
                >
                  <div className="relative">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-gray-900 bg-opacity-75 text-white px-2 py-1 rounded-lg flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span>{movie.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                      {movie.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {movie.overview}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">
                        {movie.release_date?.split('-')[0]}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieRecommendations;