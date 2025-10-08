import { Link } from 'react-router-dom';
import { forwardRef, useState } from 'react';
import DefaultPoster from './DefaultPoster';

const MovieCard = forwardRef(({ movie }, ref) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const handleImageError = () => {
        setImageError(true);
        setImageLoaded(true);
    };

    return (
        <Link 
            to={`/movie/${movie.imdbID}`} 
            className="block group card-hover focus:outline-none focus:ring-2 focus:ring-primary-400/50 h-full"
            ref={ref}
        >
            <article className="relative glass-dark rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col">
                {/* Gradient Border Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-transparent to-accent-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                
                <div className="relative aspect-[2/3] overflow-hidden rounded-t-2xl flex-shrink-0">
                    {movie.Poster === 'N/A' || imageError ? (
                        <DefaultPoster 
                            size="md" 
                            className="transition-all duration-500 group-hover:scale-110 relative" 
                        />
                    ) : (
                        <>
                            {!imageLoaded && (
                                <div className="absolute inset-0 shimmer bg-gray-800 flex items-center justify-center">
                                    <div className="text-gray-400 text-3xl">🎬</div>
                                </div>
                            )}
                            <img
                                src={movie.Poster}
                                alt={`${movie.Title} poster`}
                                className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
                                    imageLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                                loading="lazy"
                            />
                        </>
                    )}
                    
                    {/* Overlay Effects */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Floating Type Badge */}
                    {movie.Type && (
                        <div className="absolute top-4 right-4 px-3 py-1 glass text-xs font-semibold text-white rounded-full capitalize transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            {movie.Type}
                        </div>
                    )}

                    {/* Play Icon on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
                            <div className="text-white text-2xl ml-1">▶</div>
                        </div>
                    </div>
                </div>

                {/* Fixed height content area to ensure consistent card sizes */}
                <div className="p-6 relative h-28 flex flex-col justify-between">
                    {/* Title with fixed height container */}
                    <div className="h-12 flex items-start overflow-hidden">
                        <h3 className="font-bold text-white line-clamp-2 group-hover:gradient-text transition-all duration-300 leading-tight text-sm w-full">
                            {movie.Title}
                        </h3>
                    </div>
                    
                    {/* Bottom section with consistent positioning */}
                    <div className="flex items-center justify-between mt-auto">
                        <p className="text-gray-400 font-medium text-sm">{movie.Year}</p>
                        <div className="flex items-center gap-1 text-yellow-400 text-xs">
                            <span>⭐</span>
                            <span className="font-semibold">IMDb</span>
                        </div>
                    </div>
                    
                    {/* Animated Bottom Border */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-accent-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </div>
            </article>
        </Link>
    );
});

MovieCard.displayName = 'MovieCard';

export default MovieCard;