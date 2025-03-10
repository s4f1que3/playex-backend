const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY || '879a60fbe7c4e5877279cae559d9cf5c';
const TMDB_API_URL = process.env.TMDB_API_URL || 'https://api.themoviedb.org/3';

const tmdbClient = axios.create({
  baseURL: TMDB_API_URL,
  params: {
    api_key: TMDB_API_KEY
  }
});

module.exports = tmdbClient;