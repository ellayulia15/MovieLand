export default function Loader({ size = 'md' }) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    return (
        <div 
            className="inline-flex justify-center items-center" 
            role="status" 
            aria-label="Loading"
        >
            <div 
                className={`animate-spin rounded-full border-t-2 border-b-2 border-primary-500 ${sizeClasses[size]}`}
            />
        </div>
    );
}