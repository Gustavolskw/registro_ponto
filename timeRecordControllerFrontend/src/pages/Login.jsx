import { useState } from 'react';
import { User, Lock, School, Eye, EyeOff } from 'lucide-react';

export default function Login() {
    const [userType, setUserType] = useState('professor');
    const [matricula, setMatricula] = useState('');
    const [senha, setSenha] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!matricula || !senha) {
            alert('Por favor, preencha todos os campos');
            return;
        }

        setIsLoading(true);

        // Simulação de login
        setTimeout(() => {
            console.log('Login:', { userType, matricula, senha });
            alert(`Login realizado com sucesso como ${userType === 'admin' ? 'Administrador' : 'Professor'}!`);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <School className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Sistema de Ponto
                    </h1>
                    <p className="text-gray-600">
                        Controle de frequência escolar
                    </p>
                </div>

                {/* Seletor de tipo de usuário */}
                <div className="mb-6">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => setUserType('professor')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                                userType === 'professor'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Professor
                        </button>
                        <button
                            type="button"
                            onClick={() => setUserType('admin')}
                            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                                userType === 'admin'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                            }`}
                        >
                            Administrador
                        </button>
                    </div>
                </div>

                {/* Formulário */}
                <div className="space-y-6">
                    {/* Campo Matrícula */}
                    <div>
                        <label htmlFor="matricula" className="block text-sm font-medium text-gray-700 mb-2">
                            Matrícula
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="matricula"
                                type="text"
                                value={matricula}
                                onChange={(e) => setMatricula(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder={userType === 'admin' ? 'Digite sua matrícula' : 'Digite sua matrícula'}
                                required
                            />
                        </div>
                    </div>

                    {/* Campo Senha */}
                    <div>
                        <label htmlFor="senha" className="block text-sm font-medium text-gray-700 mb-2">
                            Senha
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="senha"
                                type={showPassword ? 'text' : 'password'}
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                placeholder="Digite sua senha"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Botão de Login */}
                    <button
                        type="button"
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Entrando...
                            </div>
                        ) : (
                            'Entrar'
                        )}
                    </button>
                </div>

                {/* Link de ajuda */}
                <div className="mt-6 text-center">
                    <a
                        href="#"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                        Esqueceu sua senha?
                    </a>
                </div>

                {/* Informações adicionais */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-800 mb-2">
                        {userType === 'admin' ? 'Acesso Administrativo' : 'Acesso do Professor'}
                    </h3>
                    <p className="text-xs text-gray-600">
                        {userType === 'admin'
                            ? 'Como administrador, você terá acesso completo ao sistema para gerenciar professores e relatórios.'
                            : 'Como professor, você poderá registrar sua entrada e saída durante o expediente.'
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}