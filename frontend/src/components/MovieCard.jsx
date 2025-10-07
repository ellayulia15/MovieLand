import { Link } from 'react-router-dom';
import { forwardRef } from 'react';

const MovieCard = forwardRef(({ movie }, ref) => {
    return (
        <Link 
            to={`/movie/${movie.imdbID}`} 
            className="block group"
            ref={ref}
        >
            <article className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-700 hover:border-primary-500">
                <div className="relative">
                    <img
                        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x400/1f2937/9ca3af?text=No+Image'}
                        alt={`${movie.Title} poster`}
                        className="w-full h-64 sm:h-72 object-cover"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-3">
                    <h3 className="font-semibold text-sm text-white group-hover:text-primary-400 transition-colors line-clamp-2">
                        {movie.Title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                        {movie.Year} • <span className="capitalize text-primary-500">{movie.Type}</span>
                    </p>
                </div>
            </article>
        </Link>
    );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;