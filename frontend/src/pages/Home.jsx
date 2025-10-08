import { useState, useEffect, useRef, useCallback } from 'react';
import { searchMovies } from '../services/api';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';

export default function Home() {
    const [query, setQuery] = useState('');
    const [type, setType] = useState('');
    const [year, setYear] = useState('');
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalResults, setTotalResults] = useState(0);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const observerRef = useRef();
    const loadingRef = useRef(false);

    // Generate recent year options (current year back to 2000)
    const generateYearOptions = useCallback(() => {
        const currentYear = new Date().getFullYear();
        // Only show years from 2000 to current year
        return Array.from(
            { length: currentYear - 1999 },
            (_, i) => currentYear - i
        );
    }, []);

    // Function to get results display text
    const getResultsText = () => {
        if (error || movies.length === 0) return '';

        const currentQuery = query.trim();
        const typeText = type ? (type === 'movie' ? 'Movies' : 'TV Series') : 'Results';
        const yearText = year ? ` from ${year}` : '';

        if (currentQuery) {
            if (type) {
                return `Found ${totalResults.toLocaleString()} ${typeText.toLowerCase()} for "${currentQuery}"${yearText}`;
            } else {
                return `Found ${totalResults.toLocaleString()} results for "${currentQuery}"${yearText}`;
            }
        } else {
            if (type || year) {
                const filterDesc = [
                    type ? typeText.toLowerCase() : 'movies',
                    year ? `from ${year}` : ''
                ].filter(Boolean).join(' ');
                return `Showing ${filterDesc} (${totalResults.toLocaleString()} available)`;
            } else {
                return `Showing popular movies (${totalResults.toLocaleString()} available)`;
            }
        }
    };

    useEffect(() => {
        // Reset all state when search parameters change
        setMovies([]);
        setPage(1);
        setHasMore(true);
        setTotalResults(0);
        setLoading(false);
        setError(null);
        loadingRef.current = false;
    }, [query, type, year]);

    const loadMovies = useCallback(async () => {
        if (loading || loadingRef.current) return;

        loadingRef.current = true;
        setLoading(true);
        setError(null);

        try {
            const response = await searchMovies(query.trim() || 'movie', page, type, year);

            if (response.Response === 'True') {
                const newMovies = response.Search || [];
                const total = parseInt(response.totalResults, 10);

                setTotalResults(total);
                setMovies(prevMovies => {
                    if (page === 1) return newMovies;

                    // Avoid duplicates when adding new movies
                    const existingIds = new Set(prevMovies.map(m => m.imdbID));
                    const uniqueNewMovies = newMovies.filter(m => !existingIds.has(m.imdbID));
                    return [...prevMovies, ...uniqueNewMovies];
                });

                // Check if we have more movies to load
                const currentTotal = page === 1 ? newMovies.length : movies.length + newMovies.length;
                setHasMore(currentTotal < total);
            } else {
                if (page === 1) {
                    setMovies([]);
                    setTotalResults(0);
                }
                setHasMore(false);
                const errorMsg = query.trim()
                    ? (response.Error || 'No movies found')
                    : 'Please try searching for something specific';
                setError(errorMsg);
            }
        } catch (error) {
            console.error('Error loading movies:', error);
            setError('Unable to load movies. Please check your connection.');
            setHasMore(false);
        } finally {
            setLoading(false);
            loadingRef.current = false;
        }
    }, [query, page, type, year, movies.length]);

    // Load movies when page, query, type, or year changes
    useEffect(() => {
        loadMovies();
    }, [page, query, type, year, loadMovies]);

    // Cleanup on unmount
    // Handle scroll to top visibility
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.pageYOffset > 500);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Infinite scroll implementation
    const lastMovieElementRef = useCallback(node => {
        if (loading || !hasMore || loadingRef.current) return;

        if (observerRef.current) {
            observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading && !loadingRef.current) {
                setPage(prev => prev + 1);
            }
        }, {
            threshold: 0.1,
            rootMargin: '150px'
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
                {/* Scroll to Top Button */}
                {showScrollTop && (
                    <button
                        onClick={scrollToTop}
                        className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-primary-500/90 hover:bg-primary-500 text-white shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 group"
                        aria-label="Scroll to top"
                    >
                        <div className="absolute -top-10 right-0 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                            Back to top
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    </button>
                )}

                {/* Hero Section */}
                <section className="min-h-[45vh] flex items-center justify-center px-4 py-6">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="font-display text-5xl md:text-7xl font-bold gradient-text mb-4 animate-pulse-slow">
                            MovieLand
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-6 font-light leading-relaxed">
                            Discover, explore, and immerse yourself in the world of
                            <span className="text-primary-400 font-semibold"> extraordinary cinema</span>
                        </p>
                        <div className="flex flex-wrap justify-center gap-3 mb-6">
                            <div className="glass px-4 py-2 rounded-full">
                                <span className="text-primary-400 font-semibold text-sm">🎬 5,000+ Movies</span>
                            </div>
                            <div className="glass px-4 py-2 rounded-full">
                                <span className="text-accent-400 font-semibold text-sm">⭐ HD Quality</span>
                            </div>
                            <div className="glass px-4 py-2 rounded-full">
                                <span className="text-purple-400 font-semibold text-sm">🔥 Latest Releases</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Search Section */}
                <section className="container mx-auto px-4 py-2">
                    <div className="max-w-3xl mx-auto mb-8">
                        <div className="glass-dark rounded-2xl p-6 shadow-2xl">
                            <h2 className="text-xl font-bold text-center mb-4 gradient-text">
                                Find Your Perfect Movie
                            </h2>
                            <div className="space-y-4">
                                <SearchBar
                                    onSearch={setQuery}
                                    initialValue={query}
                                    placeholder="Search movies by TITLE... (Type 3+ words)"
                                />
                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                    {/* Content Type Filter */}
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value)}
                                        className="glass px-4 py-3 text-white border border-white/20 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/50 transition-all min-w-48"
                                        aria-label="Filter by content type"
                                    >
                                        <option value="" className="bg-gray-800">All Categories</option>
                                        <option value="movie" className="bg-gray-800">🎬 Movies</option>
                                        <option value="series" className="bg-gray-800">📺 TV Series</option>
                                    </select>

                                    {/* Year Filter */}
                                    <select
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="glass px-4 py-3 text-white border border-white/20 rounded-xl focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400/50 transition-all min-w-48"
                                        aria-label="Filter by year"
                                    >
                                        <option value="" className="bg-gray-800">📅 All Years</option>
                                        {generateYearOptions().map(yearOption => (
                                            <option key={yearOption} value={yearOption} className="bg-gray-800">
                                                {yearOption} {yearOption === new Date().getFullYear() ? '(Current)' : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Clear Filters Button */}
                                {(type || year) && (
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => {
                                                setType('');
                                                setYear('');
                                            }}
                                            className="glass px-4 py-2 text-sm text-white/80 hover:text-white border border-white/20 rounded-lg hover:bg-white/10 transition-all duration-200 flex items-center gap-2"
                                        >
                                            <span>✕</span>
                                            Clear Filters
                                        </button>
                                    </div>
                                )}
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
                                {/* Results Counter */}
                                {(movies.length > 0 || (loading && page === 1)) && (
                                    <div className="mb-6">
                                        <div className="glass px-6 py-3 rounded-full inline-flex items-center gap-2 bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-400/20">
                                            {loading && page === 1 ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
                                                    <span className="text-white/90 font-medium">
                                                        Searching{query.trim() ? ` for "${query.trim()}"` : ' popular movies'}...
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="text-2xl">🎯</span>
                                                    <span className="text-white/90 font-medium">
                                                        {getResultsText()}
                                                    </span>
                                                    <div className="w-2 h-2 rounded-full bg-primary-400 animate-pulse"></div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="movie-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 mb-8 auto-rows-fr">
                                    {movies.map((movie, index) => (
                                        <MovieCard
                                            key={movie.imdbID}
                                            movie={movie}
                                            ref={index === movies.length - 1 ? lastMovieElementRef : null}
                                        />
                                    ))}
                                </div>

                                {loading && page > 1 && (
                                    <div className="flex justify-center items-center py-12">
                                        <div className="glass-dark rounded-2xl px-8 py-6 flex items-center gap-4">
                                            <Loader />
                                            <span className="text-primary-400 font-medium">
                                                Loading more... ({movies.length} of {totalResults.toLocaleString()} loaded)
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {!loading && !hasMore && movies.length > 0 && totalResults > 10 && (
                                    <div className="flex justify-center items-center py-8">
                                        <div className="glass px-6 py-3 rounded-full flex items-center gap-2 bg-gradient-to-r from-accent-500/10 to-primary-500/10 border border-accent-400/20">
                                            <span className="text-xl">✅</span>
                                            <span className="text-white/80 text-sm font-medium">
                                                All {totalResults.toLocaleString()} results loaded
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {!loading && !error && movies.length === 0 && (
                                    <div className="text-center py-12">
                                        <div className="glass-dark rounded-2xl p-12 max-w-md mx-auto">
                                            <div className="text-6xl mb-4">🔍</div>
                                            <h3 className="text-2xl font-bold text-primary-400 mb-2">
                                                {query.trim() ? 'No Movies Found' : 'Ready to Search'}
                                            </h3>
                                            <p className="text-gray-400">
                                                {query.trim()
                                                    ? 'Try adjusting your search or filter'
                                                    : 'Start typing to search for movies, or we\'ll show popular results!'
                                                }
                                            </p>
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