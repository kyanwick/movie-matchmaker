import axios from 'axios';

const API_URL = "/api"; // Replace with deployed URL when deployed
// https://movie-recommender-app.azurewebsites.net/api

const TMDB_API_KEY = "8f3598bc72027d07fc2e2a283b146997"; // Replace with your TMDb API key
const TMDB_BASE_URL = 'https://api.themoviedb.org/3/discover/movie';


// Register user
export const registerUser = async (userData) => {
    return await axios.post(`${API_URL}/auth/register`, userData);
};

// Login user
export const loginUser = async (userData) => {
    return await axios.post(`${API_URL}/auth/login`, userData);
};

// Save user preferences
export const savePreferences = async (userId, preferences) => {
    const token = sessionStorage.getItem('token'); // Retrieve token from sessionStorage

    if (!token) {
        console.error('No token found');
        return;
    }

    try {
      const response = await axios.post(`${API_URL}/preferences`, {
        preferences,   // Only send preferences, no need for userId here as it is inferred from the token
      }, {
        headers: {
            'Authorization': `Bearer ${token}` // Include token
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
};


// Get user preferences
export const getUserPreferences = async () => {
    const token = sessionStorage.getItem('token');

    if (!token) {
        console.error('No token found');
        return;
    }

    try {
      const response = await axios.get(`${API_URL}/preferences`, {   // Change to /preferences (not /preferences/:userId)
        headers: {
            'Authorization': `Bearer ${token}` // Include token
        }
      });
      return response.data.preferences;
    } catch (error) {
      console.error('Error fetching preferences:', error);
      throw error;
    }
};

// Helper function to map preferences to TMDB parameters
const mapPreferencesToTMDBParams = (preferences) => {
    const params = {
        api_key: TMDB_API_KEY,
        language: preferences.language !== 'no-preference' ? preferences.language : 'en',  // Default to English if no preference
        sort_by: 'popularity.desc',  // Sorting by popularity (most popular movies)
        page: 1,  // Start with page 1 (pagination can be added later if needed)
    };

    // Genre filter (convert array of genres to comma-separated string)
    if (preferences.genres && preferences.genres.length > 0) {
        params.with_genres = preferences.genres.join(',');
    }

    // Decade filter (convert to year range)
    if (preferences.decade && preferences.decade !== 'no-preference') {
        const startYear = parseInt(preferences.decade.split('s')[0]);
        params.primary_release_date_gte = `${startYear}-01-01`;
        params.primary_release_date_lte = `${startYear + 9}-12-31`;
    }

            // Movie length filter (runtime in minutes)
        if (preferences.length && preferences.length !== 'no-preference') {
            if (preferences.length === 'short') {
                params['with_runtime.lte'] = 90;
            }
            if (preferences.length === 'medium') {
                params['with_runtime.gte'] = 90;
                params['with_runtime.lte'] = 120;
            }
            if (preferences.length === 'long') {
                params['with_runtime.gte'] = 120;
            }
        }

    // Fallback to popular genres if no preferences set
    if (Object.keys(params).length === 3) {  // If no filters were applied, return variety
        params.with_genres = '28,35,18';  // Default to Action, Comedy, Drama genres
        params.primary_release_date_gte = '2000-01-01';  // Movies from the year 2000 onwards
    }

    return params;
};

export const getTMDBRecommendations = async (preferences, maxPages = 5) => {
    try {
        // Convert preferences into TMDb API query parameters
        const params = mapPreferencesToTMDBParams(preferences);
        console.log('Preferences:', preferences); // Log to debug parameters

        const allResults = []; // To store all results

        // Loop through pages and fetch results
        for (let page = 1; page <= maxPages; page++) {
            // Update the page number in the params
            params.page = page;

            // Make the API call to TMDb for the current page
            const response = await axios.get(TMDB_BASE_URL, { params });

            // If no results are returned for the current page, break out of the loop
            if (response.data.results.length === 0) {
                break;
            }

            // Append the results from the current page to the allResults array
            allResults.push(...response.data.results);
        }

        // If no results were found in any of the pages, fallback to a random movie
        if (allResults.length === 0) {
            console.log("No recommendations found, fetching a random movie...");
            const fallbackResponse = await axios.get(TMDB_BASE_URL, {
                params: {
                    api_key: TMDB_API_KEY,
                    language: 'en',
                    sort_by: 'popularity.desc', // Sort by popularity
                    page: 1,  // Fetch from the first page
                }
            });
            // Return a single random movie
            const randomMovie = fallbackResponse.data.results[Math.floor(Math.random() * fallbackResponse.data.results.length)];
            return [randomMovie];  // Return a single random movie
        }

        // Return the list of all found recommendations
        return allResults;

    } catch (error) {
        console.error('Error fetching movie recommendations from TMDb:', error);
        throw error;
    }
};




// Fetch movie recommendations based on preferences
export const getRecommendations = async (preferences) => {
    try {
        // Convert preferences into TMDb API query parameters
        const params = mapPreferencesToTMDBParams(preferences);
        console.log('Preferences:', preferences); // Log to debug parameters

        // Make the API call to TMDb
        const response = await axios.get(TMDB_BASE_URL, { params });

        // If no recommendations are found, fallback to a random movie
        if (response.data.results.length === 0) {
            console.log("No recommendations found, fetching a random movie...");
            const fallbackResponse = await axios.get(TMDB_BASE_URL, {
                params: {
                    api_key: TMDB_API_KEY,
                    language: 'en',
                    sort_by: 'popularity.desc', // Sort by popularity
                    page: 1,  // Fetch from the first page
                }
            });
            return fallbackResponse.data.results; // Return random movies
        }

        // Return the list of recommendations
        return response.data.results;
    } catch (error) {
        console.error('Error fetching movie recommendations from TMDb:', error);
        throw error;
    }
};


