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
            <div className="relative w-full max-w-md mx-auto h-96 rounded-2xl shadow-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <DefaultPoster size="lg" className="rounded-2xl" />
            </div>
        );
    }

    return (
        <img 
            src={movie.Poster} 
            alt={`${movie.Title} poster`}
            className="relative w-full max-w-md mx-auto rounded-2xl shadow-2xl transition-transform duration-300 group-hover:scale-105"
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
                <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-full blur-2xl animate-float"></div>
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-gradient-to-r from-purple-500/10 to-primary-500/10 rounded-full blur-3xl animate-pulse-slow"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                <button 
                    onClick={handleGoBack}
                    className="mb-8 glass-dark px-6 py-3 text-white rounded-xl hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-400/50 flex items-center gap-2 font-medium"
                >
                    ← <span>Back to Movies</span>
                </button>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            {movie.Poster === 'N/A' ? (
                                <div className="relative w-full max-w-md mx-auto h-96 rounded-2xl shadow-2xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
                                    <DefaultPoster size="lg" className="rounded-2xl" />
                                </div>
                            ) : (
                                <MoviePosterImage movie={movie} />
                            )}
                        </div>
                    </div>
                    
                    <div className="lg:col-span-2 space-y-8">
                        <header className="glass-dark rounded-2xl p-8">
                            <h1 className="font-display text-5xl md:text-6xl font-bold gradient-text mb-4 leading-tight">
                                {movie.Title}
                            </h1>
                            <div className="flex flex-wrap gap-3 mb-6">
                                {movie.Year && movie.Year !== 'N/A' && (
                                    <span className="glass px-4 py-2 rounded-full text-sm font-medium text-primary-400">{movie.Year}</span>
                                )}
                                {movie.Runtime && movie.Runtime !== 'N/A' && (
                                    <span className="glass px-4 py-2 rounded-full text-sm font-medium text-accent-400">{movie.Runtime}</span>
                                )}
                                {movie.Rated && movie.Rated !== 'N/A' && (
                                    <span className="glass px-4 py-2 rounded-full text-sm font-medium text-purple-400">{movie.Rated}</span>
                                )}
                            </div>
                            {movie.Genre && movie.Genre !== 'N/A' && (
                                <p className="text-xl text-gray-300 font-medium">{movie.Genre}</p>
                            )}
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