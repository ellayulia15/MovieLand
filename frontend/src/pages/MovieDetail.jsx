import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { getMovieById } from '../services/api';
import Loader from '../components/Loader';

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
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <button 
                    onClick={handleGoBack}
                    className="mb-6 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    ← Back
                </button>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <img 
                            src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/400x600/1f2937/9ca3af?text=No+Image'} 
                            alt={`${movie.Title} poster`}
                            className="w-full max-w-md mx-auto rounded-lg shadow-xl"
                        />
                    </div>
                    
                    <div className="lg:col-span-2 space-y-6">
                        <header>
                            <h1 className="text-4xl font-bold text-primary-400 mb-2">
                                {movie.Title}
                            </h1>
                            <div className="flex flex-wrap gap-4 text-gray-300 mb-4">
                                <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">{movie.Year}</span>
                                <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">{movie.Runtime}</span>
                                <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">{movie.Rated}</span>
                            </div>
                            <p className="text-gray-400">{movie.Genre}</p>
                        </header>

                        {movie.Plot && movie.Plot !== 'N/A' && (
                            <section>
                                <h2 className="text-xl font-semibold text-primary-400 mb-2">Plot</h2>
                                <p className="text-gray-300 leading-relaxed">{movie.Plot}</p>
                            </section>
                        )}

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {movie.Director && movie.Director !== 'N/A' && (
                                <div>
                                    <h3 className="font-semibold text-primary-400">Director</h3>
                                    <p className="text-gray-300">{movie.Director}</p>
                                </div>
                            )}
                            
                            {movie.Writer && movie.Writer !== 'N/A' && (
                                <div>
                                    <h3 className="font-semibold text-primary-400">Writer</h3>
                                    <p className="text-gray-300">{movie.Writer}</p>
                                </div>
                            )}
                            
                            {movie.Actors && movie.Actors !== 'N/A' && (
                                <div>
                                    <h3 className="font-semibold text-primary-400">Cast</h3>
                                    <p className="text-gray-300">{movie.Actors}</p>
                                </div>
                            )}
                            
                            {movie.Language && movie.Language !== 'N/A' && (
                                <div>
                                    <h3 className="font-semibold text-primary-400">Language</h3>
                                    <p className="text-gray-300">{movie.Language}</p>
                                </div>
                            )}
                        </section>

                        {(movie.imdbRating || movie.Metascore) && (
                            <section>
                                <h2 className="text-xl font-semibold text-primary-400 mb-3">Ratings</h2>
                                <div className="flex gap-4">
                                    {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                                        <div className="bg-yellow-600 text-black px-3 py-2 rounded-lg font-semibold">
                                            IMDb: {movie.imdbRating}/10
                                        </div>
                                    )}
                                    {movie.Metascore && movie.Metascore !== 'N/A' && (
                                        <div className="bg-green-600 text-white px-3 py-2 rounded-lg font-semibold">
                                            Metacritic: {movie.Metascore}/100
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