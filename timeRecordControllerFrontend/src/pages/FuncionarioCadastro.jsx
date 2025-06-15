import { useState, useEffect } from 'react';
import { User, Lock, Eye, EyeOff, Save, ArrowLeft, UserPlus, Clock, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CadastroFuncionarioAdmin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nomeCompleto: '',
        email: '',
        matricula: '',
        perfilId: '',
        jornadaTrabalhoId: '',
        senha: '',
        confirmarSenha: ''
    });

    const [perfis, setPerfis] = useState([]);
    const [jornadasTrabalho, setJornadasTrabalho] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [matriculaData, setMatriculaData] = useState([]);


    // Buscar perfis da API
    const buscarPerfis = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/home');
                throw new Error('Token não encontrado');

            }

            const response = await fetch('http://localhost:8080/profiles', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar perfis');
            }

            const data = await response.json();
            setPerfis(data.data);
            // Em desenvolvimento, usar mock
            // setPerfis(mockPerfis);
        } catch (error) {
            console.error('Erro ao buscar perfis:', error);
            // Em desenvolvimento, usar mock
        }
    };

    // Buscar jornadas de trabalho da API
    const buscarJornadasTrabalho = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/home');
                throw new Error('Token não encontrado');
            }

            const response = await fetch('http://localhost:8080/workJourney', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erro ao buscar jornadas');
            }

            const data = await response.json();
            setJornadasTrabalho(data.data);

            // Em desenvolvimento, usar mock
            // setJornadasTrabalho(mockJornadas);
        } catch (error) {
            console.error('Erro ao buscar jornadas:', error);
            // Em desenvolvimento, usar mock
        }
    };

    // Gerar matrícula automática
    const gerarMatricula = (matricula) => {
        setMatriculaData(matricula)
    };

    // Carregar dados iniciais
    useEffect(() => {
        if(!localStorage.getItem('token')) {
            navigate('/home');
            return;
        }
        const carregarDados = async () => {
            setIsLoadingData(true);
            await Promise.all([
                buscarPerfis(),
                buscarJornadasTrabalho()
            ]);

            // Gerar matrícula automática
            setFormData(prev => ({
                ...prev,
                matricula: gerarMatricula()
            }));

            setIsLoadingData(false);
        };

        carregarDados();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpar erros quando usuario digita
        if (error) setError('');

    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setError('');

        try {
            // Validações frontend
            if (!formData.nomeCompleto.trim()) {
                throw new Error('Nome completo é obrigatório');
            }

            if (!formData.perfilId) {
                throw new Error('Perfil é obrigatório');
            }

            if (!formData.jornadaTrabalhoId) {
                throw new Error('Jornada de trabalho é obrigatória');
            }

            // Se perfil não for "Funcionário" (ID 2), validar campos de senha
            if (formData.perfilId === '1') {
                if (!formData.senha) {
                    throw new Error('Senha é obrigatória');
                }

                if (formData.senha !== formData.confirmarSenha) {
                    throw new Error('Senhas não conferem');
                }

                if (formData.senha.length < 8) {
                    throw new Error('Senha deve ter pelo menos 8 caracteres');
                }
            }

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            // Preparar dados para envio
            const dadosFuncionario = {
                name: formData.nomeCompleto.trim(),
                password: formData.senha,
                profileId: parseInt(formData.perfilId),
                workJourneyId: parseInt(formData.jornadaTrabalhoId),
            };


            const response = await fetch('http://localhost:8080/user', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosFuncionario)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao cadastrar funcionário');
            }
            const data = await response.json();
            setSuccess(true);

            // Resetar formulário após 3 segundos
            gerarMatricula(data.data.matricula);

        } catch (error) {
            console.error('Erro no cadastro:', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Verificar se deve mostrar campos de senha
    const mostrarCamposSenha = formData.perfilId && formData.perfilId !== '2';

    // Verificar se formulário é válido
    const isFormValid = formData.nomeCompleto.trim() &&
        formData.perfilId &&
        formData.jornadaTrabalhoId &&
        (
            formData.perfilId === '2' || // Se for funcionário, não precisa de senha
            (
                formData.senha &&
                formData.confirmarSenha &&
                formData.senha.length >= 8 &&
                formData.senha === formData.confirmarSenha
            )
        );


    // Loading inicial
    if (isLoadingData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando dados...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => navigate('/home')}
                            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Voltar
                        </button>

                        <div className="text-center flex-1">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <UserPlus className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                Cadastrar Funcionário
                            </h1>
                            <p className="text-gray-600">
                                Adicione um novo funcionário ao sistema
                            </p>
                        </div>

                        <div className="w-20"></div> {/* Spacer para centralizar */}
                    </div>
                </div>

                {/* Mensagem de sucesso */}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                        <div>
                            <p className="text-green-800 font-medium">Funcionário cadastrado com sucesso!</p>
                            {formData.perfilId === '2' && (
                                <p className="text-green-700 text-sm mt-1">
                                    Matrícula: <strong>{formData.matricula}</strong> - O funcionário deve usar esta matrícula para cadastrar sua senha.
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Mensagem de erro */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                        <p className="text-red-800">{error}</p>
                    </div>
                )}

                {/* Formulário */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="space-y-6">

                        {/* Nome Completo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nome Completo *
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="nomeCompleto"
                                    value={formData.nomeCompleto}
                                    onChange={handleInputChange}
                                    placeholder="Digite o nome completo"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    required
                                />
                            </div>
                        </div>

                        {/* Tipo de Perfil */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de Perfil *
                            </label>
                            <div className="relative">
                                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    name="perfilId"
                                    value={formData.perfilId}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                                    required
                                >
                                    <option value="">Selecione o perfil</option>
                                    {perfis.map(perfil => (
                                        <option key={perfil.id} value={perfil.id}>
                                        {perfil.description}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {formData.perfilId === '2' && (
                                <p className="text-xs text-amber-600 mt-1 flex items-center">
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Este funcionário deve cadastrar sua própria senha usando a matrícula
                                </p>
                            )}
                        </div>

                        {/* Jornada de Trabalho */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Jornada de Trabalho *
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    name="jornadaTrabalhoId"
                                    value={formData.jornadaTrabalhoId}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                                    required
                                >
                                    <option value="">Selecione a jornada</option>
                                    {jornadasTrabalho.map(jornada => (
                                        <option key={jornada.id} value={jornada.id}>
                                           {jornada.entradaManha} - {jornada.saidaManha} / {jornada.entradaTarde} - {jornada.saidaTarde}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Campos de Senha - Condicionais */}
                        {mostrarCamposSenha && (
                            <>
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-medium text-gray-800 mb-4">Definir Senha de Acesso</h3>

                                    {/* Senha */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Senha *
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="senha"
                                                value={formData.senha}
                                                onChange={handleInputChange}
                                                placeholder="Digite a senha"
                                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                required={mostrarCamposSenha}
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

                                    {/* Confirmar Senha */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Confirmar Senha *
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmarSenha"
                                                value={formData.confirmarSenha}
                                                onChange={handleInputChange}
                                                placeholder="Confirme a senha"
                                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                required={mostrarCamposSenha}
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
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Botão Submit */}
                        <div className="pt-6">
                            <button
                                onClick={handleSubmit}
                                disabled={!isFormValid || isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Cadastrando...
                                    </div>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5 mr-2" />
                                        Cadastrar Funcionário
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Matricula de Novo Funcionario */}
                        <div className="pt-6">
                            {matriculaData && (
                                <div className="mt-8">
                                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
                                        <h3 className="text-lg font-semibold text-blue-800 mb-2 flex items-center">
                                            <User className="w-5 h-5 mr-2 text-blue-600" />
                                            Matrícula do Novo Usuário
                                        </h3>
                                        <p className="text-blue-700 text-2xl font-bold tracking-wide">
                                            {matriculaData}
                                        </p>
                                        <p className="text-sm text-blue-600 mt-1">
                                            Informe esta matrícula ao funcionário para que ele possa acessar o sistema.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Informações importantes */}
                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start">
                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                            <h4 className="font-medium text-amber-800 text-sm mb-1">Informações Importantes</h4>
                            <ul className="text-xs text-amber-700 space-y-1">
                                <li>• <strong>Perfil Funcionário:</strong> O usuário deve cadastrar sua própria senha usando a matrícula</li>
                                <li>• <strong>Outros perfis:</strong> A senha é definida no cadastro pelo administrador</li>
                                <li>• A matrícula é gerada automaticamente e usada para login</li>
                                <li>• Certifique-se de informar a matrícula ao funcionário</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}