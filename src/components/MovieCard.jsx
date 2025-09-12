import React from 'react';
import StarIcon from '@mui/icons-material/Star';

const LANGUAGE_MAP = {
  en: 'English',
  hi: 'Hindi',
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  ja: 'Japanese',
  ko: 'Korean',
  zh: 'Chinese',
  it: 'Italian',
  ru: 'Russian',
  pt: 'Portuguese',
  te: 'Telugu',
  ta: 'Tamil',
  ml: 'Malayalam',
  // Add more as needed
};

const MovieCard = ({ movie, genres = [], onBook, onImageClick, onPlayTrailer }) => {
  const genreNames = genres.length && movie.genre_ids
    ? genres.filter(g => movie.genre_ids.includes(g.id)).map(g => g.name).join(', ')
    : '';
  const languageName = LANGUAGE_MAP[movie.original_language] || movie.original_language;

  return (
    <div className="bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow p-4 flex flex-col group relative transition-colors duration-300">
      <div className="relative">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="rounded mb-2 cursor-pointer hover:opacity-80 transition"
          onClick={() => onImageClick && onImageClick(movie)}
        />
        <button
          className="absolute left-1/2 -translate-x-1/2 bottom-2 bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center"
          style={{ zIndex: 2 }}
          onClick={e => { e.stopPropagation(); onPlayTrailer && onPlayTrailer(movie); }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.5 5.5v9l8-4.5-8-4.5z" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-1 mb-1">
        <StarIcon fontSize="small" className="text-yellow-500" />
        <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">
          {movie.vote_average?.toFixed(1)} / 10
        </span>
      </div>

      <h3 className="font-bold text-lg mb-1">{movie.title}</h3>
      <p className="text-sm mb-2 text-gray-600 dark:text-gray-400">{movie.release_date}</p>

      {genreNames && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{genreNames}</p>
      )}

      {movie.original_language && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          Language: <span className="font-semibold">{languageName}</span>
        </p>
      )}

      <button
        onClick={() => onBook(movie)}
        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded mt-auto transition-colors duration-200"
      >
        Book
      </button>
    </div>
  );
};

export default MovieCard;
