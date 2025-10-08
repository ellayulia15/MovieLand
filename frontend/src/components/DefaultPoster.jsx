export default function DefaultPoster({ size = 'md', className = '' }) {
    const sizeClasses = {
        sm: 'text-4xl',
        md: 'text-6xl', 
        lg: 'text-8xl'
    };

    const textSizes = {
        sm: { main: 'text-sm', sub: 'text-xs' },
        md: { main: 'text-lg', sub: 'text-sm' },
        lg: { main: 'text-2xl', sub: 'text-lg' }
    };

    return (
        <div className={`w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center text-gray-400 relative ${className}`}>
            {/* Movie icon */}
            <div className={`${sizeClasses[size]} mb-4 opacity-60 transform transition-transform duration-300 group-hover:scale-110`}>
                🎬
            </div>
            
            {/* Text */}
            <div className={`${textSizes[size].main} font-bold text-center px-4 opacity-80`}>
                No Poster
            </div>
            <div className={`${textSizes[size].sub} text-center px-4 opacity-60 mt-2`}>
                Available
            </div>
            
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                backgroundSize: '20px 20px'
            }}></div>
        </div>
    );
}