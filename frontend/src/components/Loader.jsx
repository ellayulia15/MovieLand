export default function Loader({ size = 'md', variant = 'spinner' }) {
    const sizeClasses = {
        sm: 'h-6 w-6',
        md: 'h-10 w-10',
        lg: 'h-16 w-16'
    };

    if (variant === 'dots') {
        return (
            <div className="flex items-center justify-center space-x-1" role="status" aria-label="Loading">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-accent-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
        );
    }

    if (variant === 'pulse') {
        return (
            <div className="flex items-center justify-center" role="status" aria-label="Loading">
                <div className={`${sizeClasses[size]} bg-gradient-to-r from-primary-500 to-accent-500 rounded-full animate-pulse`}></div>
            </div>
        );
    }

    // Default spinner with modern gradient
    return (
        <div className="flex items-center justify-center" role="status" aria-label="Loading">
            <div className="relative">
                <div className={`${sizeClasses[size]} rounded-full border-4 border-gray-600/30`}></div>
                <div className={`absolute top-0 left-0 ${sizeClasses[size]} rounded-full border-4 border-transparent border-t-primary-500 border-r-accent-500 animate-spin`}></div>
                <div className={`absolute top-1 left-1 ${size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-6 w-6' : 'h-12 w-12'} rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 animate-pulse`}></div>
            </div>
        </div>
    );
}