import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { getMovieById } from '../services/api';
import Loader from '../components/Loader';
import DefaultPoster from '../components/DefaultPoster';

// Movie Poster Image Component with error handling
function MoviePosterImage({ movie }) {
    const [imageError, setImageError] = useState(false);

    if (imageError) {
        return (
            <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-2xl shadow-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <DefaultPoster size="lg" className="rounded-2xl w-full h-full object-cover" />
            </div>
        );
    }

    return (
        <img
            src={movie.Poster}
            alt={`${movie.Title} poster`}
            className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-105 object-cover"
            onError={() => setImageError(true)}
        />
    );
}

export default function MovieDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadMovieDetails = useCallback(async () => {
        if (!id) {
            setError('Invalid movie ID');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await getMovieById(id);

            if (response.Response === 'True') {
                setMovie(response);
            } else {
                setError(response.Error || 'Movie not found');
                setMovie(null);
            }
        } catch (err) {
            setError('Failed to load movie details. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadMovieDetails();
    }, [loadMovieDetails]);

    const handleGoBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader size="lg" />
                    <p className="text-white mt-4">Loading movie details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 text-white">
                <div className="container mx-auto px-4 py-8">
                    <button
                        onClick={handleGoBack}
                        className="mb-6 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        ← Back
                    </button>
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎬</div>
                        <h1 className="text-2xl text-primary-400 mb-2">Movie Not Found</h1>
                        <p className="text-gray-400">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white relative overflow-hidden">
            {/* Hero Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Dynamic background gradients */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-900/30 via-gray-900 to-gray-900"></div>
                <div className="absolute top-20 right-10 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-10 left-10 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
                {/* Cinematic overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(0,0,0,0.4)_0%,_transparent_50%,_rgba(0,0,0,0.4)_100%)]"></div>
            </div>

            {/* Fixed Back Button */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-gray-900 via-gray-900/95 to-transparent py-4 backdrop-blur-md">
                <div className="container mx-auto px-4">
                    <button
                        onClick={handleGoBack}
                        className="group px-6 py-3 text-white/90 hover:text-white flex items-center gap-3 font-medium transition-all duration-300"
                    >
                        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 group-hover:bg-primary-500/20 group-hover:scale-110 transition-all duration-300">←</span>
                        <span className="text-sm uppercase tracking-wider">Back to Movies</span>
                    </button>
                </div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8 mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1">
                        <div className="relative group perspective-1000">
                            {/* Poster Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-accent-500 to-purple-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 animate-tilt transition-opacity duration-500"></div>
                            {/* Glass Background */}
                            <div className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm rounded-2xl transform group-hover:scale-105 transition-transform duration-500"></div>

                            <div className="relative transform group-hover:rotate-y-12 transition-transform duration-700">
                                {movie.Poster === 'N/A' ? (
                                    <div className="relative w-full max-w-md mx-auto h-[600px] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] overflow-hidden">
                                        <DefaultPoster size="lg" className="rounded-2xl" />
                                    </div>
                                ) : (
                                    <MoviePosterImage movie={movie} />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 space-y-8">
                        <header className="relative overflow-hidden rounded-3xl">
                            {/* Cinematic Header Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/95 via-gray-800/98 to-gray-900 backdrop-blur-xl"></div>

                            {/* Header Content */}
                            <div className="relative p-10">
                                <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/80">
                                        {movie.Title}
                                    </span>
                                </h1>

                                <div className="flex flex-wrap gap-4 mb-8">
                                    {movie.Year && movie.Year !== 'N/A' && (
                                        <span className="px-6 py-2.5 rounded-lg bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium tracking-wider hover:scale-105 transition-transform duration-300">{movie.Year}</span>
                                    )}
                                    {movie.Runtime && movie.Runtime !== 'N/A' && (
                                        <span className="px-6 py-2.5 rounded-lg bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm font-medium tracking-wider hover:scale-105 transition-transform duration-300">{movie.Runtime}</span>
                                    )}
                                    {movie.Rated && movie.Rated !== 'N/A' && (
                                        <span className="px-6 py-2.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium tracking-wider hover:scale-105 transition-transform duration-300">{movie.Rated}</span>
                                    )}
                                </div>

                                {movie.Genre && movie.Genre !== 'N/A' && (
                                    <div className="flex flex-wrap gap-3">
                                        {movie.Genre.split(', ').map((genre, index) => (
                                            <span key={index} className="text-sm text-gray-400 px-4 py-2 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">{genre}</span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </header>

                        {movie.Plot && movie.Plot !== 'N/A' && (
                            <section className="glass-dark rounded-2xl p-8">
                                <h2 className="text-2xl font-bold gradient-text mb-4 flex items-center gap-2">
                                    📖 <span>Story</span>
                                </h2>
                                <p className="text-gray-300 leading-relaxed text-lg">{movie.Plot}</p>
                            </section>
                        )}

                        {(movie.Director && movie.Director !== 'N/A') ||
                            (movie.Writer && movie.Writer !== 'N/A') ||
                            (movie.Actors && movie.Actors !== 'N/A') ||
                            (movie.Language && movie.Language !== 'N/A') ? (
                            <section className="glass-dark rounded-2xl p-8">
                                <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center gap-2">
                                    👥 <span>Cast & Crew</span>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {movie.Director && movie.Director !== 'N/A' && (
                                        <div className="glass rounded-xl p-4">
                                            <h3 className="font-bold text-primary-400 mb-2 flex items-center gap-2">
                                                🎬 Director
                                            </h3>
                                            <p className="text-gray-300">{movie.Director}</p>
                                        </div>
                                    )}

                                    {movie.Writer && movie.Writer !== 'N/A' && (
                                        <div className="glass rounded-xl p-4">
                                            <h3 className="font-bold text-accent-400 mb-2 flex items-center gap-2">
                                                ✍️ Writer
                                            </h3>
                                            <p className="text-gray-300">{movie.Writer}</p>
                                        </div>
                                    )}

                                    {movie.Actors && movie.Actors !== 'N/A' && (
                                        <div className="glass rounded-xl p-4 md:col-span-2">
                                            <h3 className="font-bold text-purple-400 mb-2 flex items-center gap-2">
                                                🎭 Cast
                                            </h3>
                                            <p className="text-gray-300">{movie.Actors}</p>
                                        </div>
                                    )}

                                    {movie.Language && movie.Language !== 'N/A' && (
                                        <div className="glass rounded-xl p-4">
                                            <h3 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
                                                🌍 Language
                                            </h3>
                                            <p className="text-gray-300">{movie.Language}</p>
                                        </div>
                                    )}
                                </div>
                            </section>
                        ) : null}

                        {((movie.imdbRating && movie.imdbRating !== 'N/A') ||
                            (movie.Metascore && movie.Metascore !== 'N/A')) && (
                                <section className="glass-dark rounded-2xl p-8">
                                    <h2 className="text-2xl font-bold gradient-text mb-6 flex items-center gap-2">
                                        ⭐ <span>Ratings</span>
                                    </h2>
                                    <div className="flex flex-wrap gap-4">
                                        {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                                            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-xl font-bold text-lg shadow-lg flex items-center gap-2">
                                                <span>🎬</span>
                                                <span>IMDb: {movie.imdbRating}/10</span>
                                            </div>
                                        )}
                                        {movie.Metascore && movie.Metascore !== 'N/A' && (
                                            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg flex items-center gap-2">
                                                <span>📊</span>
                                                <span>Metacritic: {movie.Metascore}/100</span>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}