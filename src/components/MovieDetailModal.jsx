import React, { useEffect, useState } from 'react';
import tmdb from '../api/tmdb';

const MovieDetailModal = ({ open, onClose, movie, genres = [] }) => {
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);

  useEffect(() => {
    if (open && movie?.id) {
      tmdb.get(`/movie/${movie.id}`).then(res => setDetails(res.data));
      tmdb.get(`/movie/${movie.id}/credits`).then(res => setCredits(res.data));
    }
  }, [open, movie]);

  if (!open || !movie) return null;

  const director = credits?.crew?.find(c => c.job === 'Director');
  const cast = credits?.cast?.slice(0, 5) || [];

  const genreNames = genres.length && movie.genre_ids
    ? genres.filter(g => movie.genre_ids.includes(g.id)).map(g => g.name).join(', ')
    : '';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 overflow-y-auto"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-0 relative animate-fadeIn flex flex-col items-center">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="rounded-t-2xl mx-auto mt-4 mb-2 w-auto h-80 object-contain bg-gray-100"
          style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)' }}
        />
        {genreNames && (
          <p className="text-xs font-bold text-gray-800 mb-2 text-center">{genreNames}</p>
        )}
        {details?.vote_average && (
          <div className="flex items-center justify-center gap-1 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.176 0l-3.38 2.454c-.784.57-1.838-.196-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
            <span className="font-semibold text-sm text-gray-700">{details.vote_average.toFixed(1)} / 10</span>
          </div>
        )}
        <div className="w-full p-6 flex flex-col items-center">
          <h2 className="text-3xl font-bold mb-3 text-center">{movie.title}</h2>
          <p className="text-gray-600 mb-4 text-center">{details?.overview || 'No story justification available.'}</p>
          <div className="mb-2 w-full text-center">
            <span className="font-semibold">Director:</span> {director ? director.name : 'Unknown'}
          </div>
          <div className="mb-2 w-full text-center">
            <span className="font-semibold">Cast:</span>
            {cast.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                {cast.map(c => (
                  <div key={c.cast_id || c.credit_id} className="flex flex-col items-center w-20">
                    <img
                      src={c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : 'https://via.placeholder.com/80x120?text=No+Image'}
                      alt={c.name}
                      className="w-16 h-20 object-cover rounded-lg shadow mb-1 bg-gray-200"
                    />
                    <span className="text-xs text-gray-700 font-medium text-center truncate w-full">{c.name}</span>
                  </div>
                ))}
              </div>
            ) : ' Unknown'}
          </div>
          <div className="text-sm text-gray-500 mt-2 w-full text-center">Release: {movie.release_date}</div>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95);} to { opacity: 1; transform: scale(1);} }
        .animate-fadeIn { animation: fadeIn 0.3s ease; }
      `}</style>
    </div>
  );
};

export default MovieDetailModal;
