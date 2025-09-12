import React, { useEffect, useState } from 'react';
import tmdb from '../api/tmdb';

const TrailerModal = ({ open, onClose, movie }) => {
  const [trailer, setTrailer] = useState(null);

  useEffect(() => {
    if (open && movie?.id) {
      tmdb.get(`/movie/${movie.id}/videos`).then(res => {
        const yt = res.data.results.find(v => v.site === 'YouTube' && v.type === 'Trailer');
        setTrailer(yt ? yt.key : null);
      });
    }
  }, [open, movie]);

  if (!open || !movie) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 overflow-y-auto"
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-1/2 h-1/2 relative animate-fadeIn flex flex-col items-center justify-center">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>
        {trailer ? (
          <div className="w-full h-full flex justify-center items-center">
            <iframe
              width="100%"
              height="100%"
              style={{ aspectRatio: '16/9', borderRadius: '0.75rem', boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}
              src={`https://www.youtube.com/embed/${trailer}?autoplay=1&rel=0`}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow w-full h-full"
            ></iframe>
          </div>
        ) : (
          <div className="p-8 text-gray-600">No trailer available.</div>
        )}
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95);} to { opacity: 1; transform: scale(1);} }
        .animate-fadeIn { animation: fadeIn 0.3s ease; }
      `}</style>
    </div>
  );
};

export default TrailerModal;
