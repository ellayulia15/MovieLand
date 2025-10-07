import axios from 'axios';

const API_KEY = import.meta.env.VITE_OMDB_KEY;
const BASE = 'https://www.omdbapi.com/';

export async function searchMovies(query, page = 1, type = '') {
    const params = {
        apikey: API_KEY,
        s: query,
        page,
    };
    if (type) params.type = type;
    const { data } = await axios.get(BASE, { params });
    return data;
}

export async function getMovieById(id) {
    const { data } = await axios.get(BASE, {
        params: { apikey: API_KEY, i: id, plot: 'full' },
    });
    return data;
}