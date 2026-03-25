export default function LoadingSpinner() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent" />
        </div>
    );
}