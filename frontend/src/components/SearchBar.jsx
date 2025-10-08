import { useState, useEffect, useMemo } from 'react';
import { debounce } from '../services/debounce';

export default function SearchBar({
    onSearch,
    placeholder = 'Search movies...',
    initialValue = ''
}) {
    const [query, setQuery] = useState(initialValue);
    const [isFocused, setIsFocused] = useState(false);

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
        <form onSubmit={handleSubmit} className="w-full">
            <div className={`relative transition-all duration-300 ${
                isFocused ? 'scale-105' : 'scale-100'
            }`}>
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-xl blur opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                        🔍
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        className="relative w-full pl-12 pr-12 py-4 glass text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 transition-all duration-300 text-lg"
                        aria-label="Search movies"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery('')}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
                            aria-label="Clear search"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>

        </form>
    );
}