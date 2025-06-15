import { useState, useEffect } from 'react';
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleGoToLogin = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setIsAnimating(false);
            navigate('/login');
        }, 1000);
    };

    const handleGoToHome = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setIsAnimating(false);
            navigate('/home');
        }, 1000);
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

                {/* Mensagem de Erro */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Ops! Página Não Encontrada
                    </h2>
                    <p className="text-gray-600 text-lg mb-2">
                        A página que você está procurando não existe ou foi movida.
                    </p>
                    <p className="text-gray-500">
                        Não se preocupe, vamos te ajudar a voltar ao caminho certo!
                    </p>
                </div>

                {/* Floating Elements */}
                <div className="relative mb-8">
                    <div className="absolute -top-4 -left-4 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
                    <div className="absolute -top-2 -right-6 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <div className="absolute -bottom-3 left-8 w-4 h-4 bg-indigo-400 rounded-full animate-bounce"></div>
                </div>

                {/* Botões de Ação */}
                <div className="space-y-4">
                    {!isLoggedIn && (
                        <button
                            onClick={handleGoToLogin}
                            disabled={isAnimating}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center group"
                        >
                            {isAnimating ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Redirecionando...
                                </div>
                            ) : (
                                <>
                                    <Home className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                                    Ir para o Login
                                </>
                            )}
                        </button>
                    )}

                    {isLoggedIn && (
                        <button
                            onClick={handleGoToHome}
                            disabled={isAnimating}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-blue-400 disabled:to-indigo-400 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center group"
                        >
                            {isAnimating ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Redirecionando...
                                </div>
                            ) : (
                                <>
                                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                                    Voltar para Home
                                </>
                            )}

                        </button>
                    )}
                </div>

                {/* Ajuda Adicional */}
                <div className="mt-8 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center justify-center">
                        <Search className="w-4 h-4 mr-2" />
                        Precisa de Ajuda?
                    </h3>
                    <p className="text-xs text-gray-600">
                        Se você acredita que isso é um erro, entre em contato com o administrador do sistema ou tente atualizar a página.
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