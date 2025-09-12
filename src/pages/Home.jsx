import React, { useEffect, useState, useContext } from "react";
import tmdb from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import FilterBar from "../components/FilterBar";
import BookingModal from "../components/BookingModal";
import TrailerModal from "../components/TrailerModal";
import { ThemeContext } from "../context/ThemeContext"; // ✅ Import Theme Context

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    genre: "",
    rating: "",
    language: "",
  });
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(500);
  const [search, setSearch] = useState("");
  const [detailMovie, setDetailMovie] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerMovie, setTrailerMovie] = useState(null);

  const { theme, toggleTheme } = useContext(ThemeContext); // ✅ Theme hook

  const fetchMovies = async (page) => {
    const response = await tmdb.get(`/movie/now_playing?page=${page}`);
    setMovies(response.data.results);
    setTotalPages(response.data.total_pages);
  };

  const fetchAllMovies = async () => {
    const allMovies = [];
    for (let page = 1; page <= totalPages; page++) {
      const response = await tmdb.get(`/movie/now_playing?page=${page}`);
      allMovies.push(...response.data.results);
    }
    const uniqueMovies = Array.from(
      new Map(allMovies.map((movie) => [movie.id, movie])).values()
    );
    return uniqueMovies;
  };

  useEffect(() => {
    fetchMovies(currentPage);
    tmdb.get("/genre/movie/list").then((res) => setGenres(res.data.genres));
  }, [currentPage]);

  const filtered = search
    ? movies.filter((m) =>
        m.title.toLowerCase().includes(search.toLowerCase())
      )
    : movies.filter(
        (m) =>
          (!filters.genre || m.genre_ids.includes(Number(filters.genre))) &&
          (!filters.rating || m.vote_average >= Number(filters.rating)) &&
          (!filters.language || m.original_language === filters.language)
      );

  useEffect(() => {
    if (search) {
      fetchAllMovies().then((allMovies) => setMovies(allMovies));
    } else {
      fetchMovies(currentPage);
    }
  }, [search, currentPage]);

  const fetchMovieDetails = async (movieId) => {
    const movieResponse = await tmdb.get(`/movie/${movieId}`);
    const creditsResponse = await tmdb.get(`/movie/${movieId}/credits`);
    const director = creditsResponse.data.crew.find(
      (member) => member.job === "Director"
    );
    const cast = creditsResponse.data.cast.slice(0, 5);
    setDetailMovie({
      ...movieResponse.data,
      director,
      cast,
    });
    setDetailOpen(true);
  };

  return (
    <div className="min-h-screen p-4 transition-colors duration-300">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <FilterBar filters={filters} setFilters={setFilters} genres={genres} />
        <div className="flex gap-3 items-center">
          <input
            type="text"
            placeholder="Search movies by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 px-4 py-2 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-400 
                       bg-gray-100 dark:bg-gray-800 dark:border-gray-600 
                       text-black dark:text-white"
          />
          {/* ✅ Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white transition"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </div>

      {/* Movie List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onImageClick={() => fetchMovieDetails(movie.id)}
            onBook={(m) => {
              setSelectedMovie(m);
              setModalOpen(true);
            }}
            onPlayTrailer={(m) => {
              setTrailerMovie(m);
              setTrailerOpen(true);
            }}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modals */}
      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        movie={selectedMovie || {}}
        onBook={() => setModalOpen(false)}
      />
      <TrailerModal
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        movie={trailerMovie}
      />

      {/* Movie Details Popup */}
      {detailOpen && detailMovie && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={() => setDetailOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 dark:text-white p-8 rounded-2xl shadow-2xl w-96 relative transition-colors duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDetailOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-xl font-bold"
            >
              &times;
            </button>
            <img
              src={`https://image.tmdb.org/t/p/w500${detailMovie.poster_path}`}
              alt={detailMovie.title}
              className="rounded shadow-lg w-full h-64 object-cover mb-4"
            />
            <h2 className="text-2xl font-bold mb-2">{detailMovie.title}</h2>
            <p className="text-lg mb-4">
              Rating: {detailMovie.vote_average}/10
            </p>
            <h3 className="text-xl font-semibold mb-2">Director</h3>
            {detailMovie.director && (
              <div className="flex items-center mb-4">
                <img
                  src={`https://image.tmdb.org/t/p/w500${detailMovie.director.profile_path}`}
                  alt={detailMovie.director.name}
                  className="w-12 h-12 rounded-full mr-4"
                />
                <span>{detailMovie.director.name}</span>
              </div>
            )}
            <h3 className="text-xl font-semibold mb-2">Cast</h3>
            <div className="grid grid-cols-2 gap-4">
              {detailMovie.cast.map((member) => (
                <div key={member.id} className="flex items-center">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${member.profile_path}`}
                    alt={member.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <span>{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
