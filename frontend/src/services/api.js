import axios from 'axios';

const API_KEY = import.meta.env.VITE_OMDB_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    params: {
        apikey: API_KEY
    }
});

/**
 * Search for movies by query
 * @param {string} query - Search term
 * @param {number} page - Page number (default: 1)
 * @param {string} type - Content type filter (movie, series, episode)
 * @returns {Promise<Object>} API response
 */
export async function searchMovies(query, page = 1, type = '') {
    if (!query.trim()) {
        throw new Error('Search query is required');
    }

    const params = {
        s: query.trim(),
        page: Math.max(1, page),
    };

    if (type) {
        params.type = type;
    }

    const { data } = await apiClient.get('', { params });
    return data;
}

/**
 * Get detailed information about a specific movie
 * @param {string} id - IMDb ID
 * @returns {Promise<Object>} Movie details
 */
export async function getMovieById(id) {
    if (!id) {
        throw new Error('Movie ID is required');
    }

    const { data } = await apiClient.get('', {
        params: {
            i: id,
            plot: 'full'
        }
    });

    return data;
}