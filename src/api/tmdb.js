// Axios instance for TMDb API
import axios from 'axios';

const API_KEY = '4caed65a7accd72ed32bdc3b7916acf0'; // Replace with your TMDb API key
const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: {
    api_key: API_KEY,
  },
});

export default tmdb;
