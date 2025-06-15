import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Eye, EyeOff, Lock, User, CheckCircle, AlertCircle, ArrowRight, KeyRound } from 'lucide-react';

export default function CadastroSenhaFuncionario() {

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/home');
        }
    }, []);

    const [formData, setFormData] = useState({
        matricula: '',
        senha: '',
        confirmarSenha: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Validações de senha
    const [passwordValidation, setPasswordValidation] = useState({
        minLength: false,
        hasNumber: false,
        hasLetter: false,
        hasSpecial: false
    });

    // Função para validar senha em tempo real
    const validatePassword = (password) => {
        const validation = {
            minLength: password.length >= 8,
            hasNumber: /\d/.test(password),
            hasLetter: /[a-zA-Z]/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };
        setPasswordValidation(validation);
        return Object.values(validation).every(v => v);
    };
    // Cadastrar nova senha
    const cadastrarSenha = async (dados) => {
        try {
            const response = await fetch('http://localhost:8080/user', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            const data = await response.json();
            if (!response.ok) {
                const errorData = await response.json();
                console.log(errorData);
                throw new Error(errorData.message || 'Erro ao cadastrar senha');
            }
            setToken(data.data.jwtToken);
            setUser(data.data.user);

            return await data;
        } catch (error) {
            throw new Error(error.message || 'Erro ao cadastrar senha');
        }
    };
    const setToken = (token) => {
        localStorage.setItem('token', token);

    }
    const setUser = (user) => {
        localStorage.setItem('user', JSON.stringify(user));
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validar senha em tempo real
        if (name === 'senha') {
            validatePassword(value);
        }

        // Limpar erros quando usuario digita
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Validações frontend
            if (!formData.matricula.trim()) {
                throw new Error('Matrícula é obrigatória');
            }

            if (!formData.senha) {
                throw new Error('Senha é obrigatória');
            }

            if (!validatePassword(formData.senha)) {
                throw new Error('Senha não atende aos critérios de segurança');
            }

            if (formData.senha !== formData.confirmarSenha) {
                throw new Error('Senhas não conferem');
            }

            // Cadastrar senha
            await cadastrarSenha({
                matricula: formData.matricula,
                password: formData.senha
            });

            setSuccess(true);

          navigate('/home');

        } catch (error) {
            console.error('Erro no cadastro:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Verificar se formulário é válido
    const isFormValid = formData.matricula.trim() &&
        formData.senha &&
        formData.confirmarSenha &&
        Object.values(passwordValidation).every(v => v) &&
        formData.senha === formData.confirmarSenha;

    // Tela de sucesso
    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Senha Cadastrada com Sucesso!
                        </h2>

                        <p className="text-gray-600 mb-6">
                            Sua senha foi cadastrada com sucesso. Você será redirecionado para a página de login.
                        </p>

                        <div className="flex items-center justify-center space-x-2 text-blue-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-sm">Redirecionando...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <KeyRound className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Cadastrar Senha
                    </h1>
                    <p className="text-gray-600">
                        Defina sua senha para acessar o sistema
                    </p>
                </div>

                {/* Formulário */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">

                    {/* Mensagem de erro */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                            <p className="text-red-800 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="space-y-6">

                        {/* Campo Matrícula */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Matrícula do Funcionário
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="matricula"
                                    value={formData.matricula}
                                    onChange={handleInputChange}
                                    placeholder="Digite sua matrícula"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Matrícula fornecida pelo administrador
                            </p>
                        </div>

                        {/* Campo Senha */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nova Senha
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="senha"
                                    value={formData.senha}
                                    onChange={handleInputChange}
                                    placeholder="Digite sua senha"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Validação de senha em tempo real */}
                        {formData.senha && (
                            <div className="bg-gray-50 rounded-xl p-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Critérios de Senha:</h4>
                                <div className="space-y-2">
                                    <div className={`flex items-center text-xs ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                                        <CheckCircle className={`w-4 h-4 mr-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-400'}`} />
                                        Mínimo 8 caracteres
                                    </div>
                                    <div className={`flex items-center text-xs ${passwordValidation.hasLetter ? 'text-green-600' : 'text-gray-500'}`}>
                                        <CheckCircle className={`w-4 h-4 mr-2 ${passwordValidation.hasLetter ? 'text-green-600' : 'text-gray-400'}`} />
                                        Pelo menos uma letra
                                    </div>
                                    <div className={`flex items-center text-xs ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                                        <CheckCircle className={`w-4 h-4 mr-2 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-400'}`} />
                                        Pelo menos um número
                                    </div>
                                    <div className={`flex items-center text-xs ${passwordValidation.hasSpecial ? 'text-green-600' : 'text-gray-500'}`}>
                                        <CheckCircle className={`w-4 h-4 mr-2 ${passwordValidation.hasSpecial ? 'text-green-600' : 'text-gray-400'}`} />
                                        Pelo menos um caractere especial
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Campo Confirmar Senha */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Confirmar Senha
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmarSenha"
                                    value={formData.confirmarSenha}
                                    onChange={handleInputChange}
                                    placeholder="Confirme sua senha"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {formData.confirmarSenha && formData.senha !== formData.confirmarSenha && (
                                <p className="text-xs text-red-600 mt-1">As senhas não conferem</p>
                            )}
                            {formData.confirmarSenha && formData.senha === formData.confirmarSenha && formData.senha && (
                                <p className="text-xs text-green-600 mt-1">Senhas conferem ✓</p>
                            )}
                        </div>

                        {/* Botão Submit */}
                        <button
                            onClick={handleSubmit}
                            disabled={!isFormValid || isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                    Cadastrando senha...
                                </div>
                            ) : (
                                <>
                                    <span>Cadastrar Senha</span>
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </>
                            )}
                        </button>
                    </div>

                    {/* Link para voltar ao login */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            Já possui senha cadastrada?{' '}
                            <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                                Fazer Login
                            </a>
                        </p>
                    </div>
                </div>

                {/* Informações de segurança */}
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <h4 className="font-medium text-amber-800 text-sm mb-1">Informações de Segurança</h4>
                            <ul className="text-xs text-amber-700 space-y-1">
                                <li>• Use uma senha única e segura</li>
                                <li>• Não compartilhe sua senha com ninguém</li>
                                <li>• Mantenha sua matrícula em segurança</li>
                                <li>• Em caso de problemas, contate o administrador</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}