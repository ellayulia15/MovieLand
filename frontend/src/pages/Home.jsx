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
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-8">
                <header className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-primary-500 mb-2">🎬 MovieLand</h1>
                    <p className="text-gray-400 text-lg">Discover your next favorite movie</p>
                </header>

                <section className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1">
                            <SearchBar
                                onSearch={setQuery}
                                initialValue={query}
                                placeholder="Search movies, series, episodes..."
                            />
                        </div>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                            aria-label="Filter by content type"
                        >
                            <option value="">All Types</option>
                            <option value="movie">Movies</option>
                            <option value="series">TV Series</option>
                            <option value="episode">Episodes</option>
                        </select>
                    </div>
                </section>

                <main>
                    {error && (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🎭</div>
                            <p className="text-primary-400 text-lg mb-2">Oops! Something went wrong</p>
                            <p className="text-gray-400">{error}</p>
                        </div>
                    )}

                    {!error && (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
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
                                    <Loader />
                                    <span className="ml-3 text-primary-400 font-medium">Loading more movies...</span>
                                </div>
                            )}

                            {!loading && !error && movies.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <p className="text-gray-400 text-lg">No movies found</p>
                                    <p className="text-gray-500">Try adjusting your search or filter</p>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
}