import { useState, useEffect, useMemo } from 'react';
import { debounce } from '../services/debounce';

export default function SearchBar({ onSearch, placeholder = 'Search movies...' }) {
    const [q, setQ] = useState('');

    const debounced = useMemo(() => debounce((val) => onSearch(val), 400), [onSearch]);

    useEffect(() => {
        debounced(q);
    }, [q, debounced]);

    return (
        <div className="w-full flex items-center gap-2">
            <input
                className="w-full px-4 py-2 rounded-md shadow-sm border focus:outline-none"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={placeholder}
            />
            <button
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hidden sm:block"
                onClick={() => onSearch(q)}
            >
                Search
            </button>
        </div>
    );
}