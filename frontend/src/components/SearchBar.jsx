import { useState, useEffect, useMemo } from 'react';
import { debounce } from '../services/debounce';

export default function SearchBar({
    onSearch,
    placeholder = 'Search movies...',
    initialValue = ''
}) {
    const [query, setQuery] = useState(initialValue);

    const debouncedSearch = useMemo(
        () => debounce((searchTerm) => onSearch(searchTerm), 400),
        [onSearch]
    );

    useEffect(() => {
        setQuery(initialValue);
    }, [initialValue]);

    useEffect(() => {
        debouncedSearch(query);
    }, [query, debouncedSearch]);

    const handleInputChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full flex items-center gap-3">
            <div className="flex-1 relative">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className="w-full px-4 py-2 bg-gray-800 text-white placeholder-gray-400 rounded-lg border border-gray-600 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
                    aria-label="Search movies"
                />
                {query && (
                    <button
                        type="button"
                        onClick={() => setQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        aria-label="Clear search"
                    >
                        ✕
                    </button>
                )}
            </div>
            <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-gray-900 hidden sm:block"
            >
                Search
            </button>
        </form>
    );
}