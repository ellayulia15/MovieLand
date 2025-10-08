import { useState, useEffect, useRef, useCallback } from 'react';
import { searchMovies } from '../services/api';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';

export default function Home() {
    const [query, setQuery] = useState('avengers');
    const [type, setType] = useState('');
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const observerRef = useRef();

    useEffect(() => {
        setMovies([]);
        setPage(1);
        setHasMore(true);
    }, [query, type]);

    const loadMovies = useCallback(async () => {
        if (!query.trim()) {
            setMovies([]);
            setHasMore(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await searchMovies(query.trim(), page, type);

            if (response.Response === 'True') {
                const newMovies = response.Search || [];
                setMovies(prevMovies =>
                    page === 1 ? newMovies : [...prevMovies, ...newMovies]
                );

                const totalResults = parseInt(response.totalResults, 10);
                setHasMore(page * 10 < totalResults);
            } else {
                if (page === 1) {
                    setMovies([]);
                }
                setHasMore(false);
                setError(response.Error || 'No movies found for your search');
            }
        } catch (error) {
            setError('Unable to load movies. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    }, [query, page, type]);

    useEffect(() => {
        loadMovies();
    }, [loadMovies]);

    // Infinite scroll implementation
    const lastMovieElementRef = useCallback(node => {
        if (loading) return;

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                setPage(prevPage => prevPage + 1);
            }
        }, {
            threshold: 0.1
        });

        if (node) {
            observerRef.current.observe(node);
        }
    }, [loading, hasMore]);

    return (
        <div className="min-h-screen text-white relative overflow-hidden">
            {/* Hero Background with Floating Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-full blur-xl animate-float"></div>
                <div className="absolute top-1/4 right-10 w-24 h-24 bg-gradient-to-r from-purple-500/30 to-primary-500/30 rounded-full blur-lg animate-pulse-slow"></div>
                <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-accent-500/15 to-purple-500/15 rounded-full blur-2xl animate-float"></div>
            </div>

            <div className="relative z-10">
                {/* Hero Section */}
                <section className="min-h-[60vh] flex items-center justify-center px-4 py-12">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="font-display text-6xl md:text-8xl font-bold gradient-text mb-6 animate-pulse-slow">
                            MovieLand
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light leading-relaxed">
                            Discover, explore, and immerse yourself in the world of 
                            <span className="text-primary-400 font-semibold"> extraordinary cinema</span>
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 mb-12">
                            <div className="glass px-6 py-3 rounded-full">
                                <span className="text-primary-400 font-semibold">🎬 10,000+ Movies</span>
                            </div>
                            <div className="glass px-6 py-3 rounded-full">
                                <span className="text-accent-400 font-semibold">⭐ HD Quality</span>
                            </div>
                            <div className="glass px-6 py-3 rounded-full">
                                <span className="text-purple-400 font-semibold">🔥 Latest Releases</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Search Section */}
                <section className="container mx-auto px-4 py-8">
                    <div className="max-w-3xl mx-auto mb-12">
                        <div className="glass-dark rounded-2xl p-8 shadow-2xl">
                            <h2 className="text-2xl font-bold text-center mb-6 gradient-text">
                                Find Your Perfect Movie
                            </h2>
                            <div className="space-y-4">
                                <SearchBar
                                    onSearch={setQuery}
                                    initialValue={query}
                                    placeholder="Search movies, series, episodes..."
                                />
                                <div className="flex justify-center">
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="glass px-6 py-3 text-white border border-white/20 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/50 transition-all min-w-48"
                                        aria-label="Filter by content type"
                                    >
                                        <option value="" className="bg-gray-800">All Types</option>
                                        <option value="movie" className="bg-gray-800">Movies</option>
                                        <option value="series" className="bg-gray-800">TV Series</option>
                                        <option value="episode" className="bg-gray-800">Episodes</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <main>
                        {error && (
                            <div className="text-center py-12">
                                <div className="glass-dark rounded-2xl p-12 max-w-md mx-auto">
                                    <div className="text-6xl mb-4">🎭</div>
                                    <h3 className="text-2xl font-bold text-primary-400 mb-2">Oops! Something went wrong</h3>
                                    <p className="text-gray-400">{error}</p>
                                </div>
                            </div>
                        )}

                        {!error && (
                            <>
                                <div className="movie-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8 auto-rows-fr">
                                    {movies.map((movie, index) => (
                                        <MovieCard
                                            key={movie.imdbID}
                                            movie={movie}
                                            ref={index === movies.length - 1 ? lastMovieElementRef : null}
                                        />
                                    ))}
                                </div>

                                {loading && (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="glass-dark rounded-2xl px-8 py-6 flex items-center gap-4">
                                            <Loader />
                                            <span className="text-primary-400 font-medium">Loading more movies...</span>
                                        </div>
                                    </div>
                                )}

                                {!loading && !error && movies.length === 0 && (
                                    <div className="text-center py-12">
                                        <div className="glass-dark rounded-2xl p-12 max-w-md mx-auto">
                                            <div className="text-6xl mb-4">🔍</div>
                                            <h3 className="text-2xl font-bold text-primary-400 mb-2">No Movies Found</h3>
                                            <p className="text-gray-400">Try adjusting your search or filter</p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </section>
            </div>
        </div>
    );
}