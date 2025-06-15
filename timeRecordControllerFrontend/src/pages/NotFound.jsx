import { useState } from 'react';
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react';

export default function NotFoundPage() {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleGoToLogin = () => {
        setIsAnimating(true);
        // Simulate navigation delay
        setTimeout(() => {
            console.log('Redirecting to login page...');
            alert('Redirecting to login page...');
            setIsAnimating(false);
        }, 1000);
    };

    const handleGoBack = () => {
        console.log('Going back...');
        window.history.back();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">

                {/* Animated 404 */}
                <div className="mb-8">
                    <div className="relative">
                        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
                            404
                        </h1>
                        <div className="absolute inset-0 text-9xl font-black text-blue-200 -z-10 transform translate-x-2 translate-y-2">
                            404
                        </div>
                    </div>
                </div>

                {/* Error Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center animate-bounce">
                        <AlertTriangle className="w-10 h-10 text-orange-500" />
                    </div>
                </div>

                {/* Error Message */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-gray-600 text-lg mb-2">
                        The page you're looking for doesn't exist or has been moved.
                    </p>
                    <p className="text-gray-500">
                        Don't worry, let's get you back on track!
                    </p>
                </div>

                {/* Floating Elements */}
                <div className="relative mb-8">
                    <div className="absolute -top-4 -left-4 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
                    <div className="absolute -top-2 -right-6 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <div className="absolute -bottom-3 left-8 w-4 h-4 bg-indigo-400 rounded-full animate-bounce"></div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <button
                        onClick={handleGoToLogin}
                        disabled={isAnimating}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center group"
                    >
                        {isAnimating ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Redirecting...
                            </div>
                        ) : (
                            <>
                                <Home className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                                Go to Login Page
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleGoBack}
                        className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 flex items-center justify-center group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Go Back
                    </button>
                </div>

                {/* Additional Help */}
                <div className="mt-8 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center justify-center">
                        <Search className="w-4 h-4 mr-2" />
                        Need Help?
                    </h3>
                    <p className="text-xs text-gray-600">
                        If you believe this is an error, please contact the system administrator or try refreshing the page.
                    </p>
                </div>

                {/* Decorative Elements */}
                <div className="fixed top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl -z-10"></div>
                <div className="fixed bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-indigo-400/20 to-pink-400/20 rounded-full blur-xl -z-10"></div>
                <div className="fixed top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-xl -z-10"></div>
            </div>
        </div>
    );
}