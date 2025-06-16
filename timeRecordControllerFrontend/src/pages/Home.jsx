import { useState, useEffect } from 'react';
import {
    Clock,
    LogIn,
    LogOut,
    Calendar,
    User,
    MapPin,
    CheckCircle,
    AlertCircle,
    Coffee,
    Home,
    Timer
} from 'lucide-react';

import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';


export default function FuncionarioRegistroPonto() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [funcionario, setFuncionario] = useState(null);

    const [registros, setRegistros] = useState([]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    }

    const buscarDadosFuncionario = () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            const decoded = jwtDecode(token);

            const funcionarioDecoded = {
                id: decoded.sub,
                nome: decoded.name,
                matricula: decoded.matricula,
                cargo: decoded.roleDescription,
                foto: null
            };

            setFuncionario(funcionarioDecoded);
        } catch (error) {
            console.error('Erro ao decodificar token:', error);
            setError('Erro ao carregar dados do funcionário');
            // fallback para mock
            handleLogout();
        }
    };

    const buscarRegistrosDia = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token não encontrado');
            }

            // const hoje = new Date().toISOString().split('T')[0];
            const response = await fetch(`http://localhost:8080/appointment`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            const registrosAdaptados = data.data.map((registro) => {
                return {
                    id: registro.id,
                    funcionarioId: registro.user.id,
                    tipo: mapearTipo(registro.appointmentType.ordem),
                    dataHora: `${registro.date}T${registro.time}`,
                    localizacao: {
                        latitude: null,
                        longitude: null,
                        endereco: 'Localização não disponível'
                    },
                    observacoes: null
                };
            });

            setRegistros(registrosAdaptados);

            // Em desenvolvimento, usar mock
            // setRegistros(mockRegistros);
        } catch (error) {
            console.error('Erro ao buscar registros:', error);
            setError('Erro ao carregar registros do dia');
            // Em desenvolvimento, usar mock
            handleLogout();
        }
    };

    const mapearTipo = (ordem) => {
        switch (ordem) {
            case 1: return 'entrada';
            case 2: return 'saida_almoco';
            case 3: return 'volta_almoco';
            case 4: return 'saida';
            case 5: return 'entrada_extra';
            case 6: return 'saida_extra';
            default: return 'entrada';
        }
    };

    const determinarProximaAcao = () => {
        const agora = new Date();
        const horaAtual = agora.getHours();
        const minutosAtuais = agora.getMinutes();
        const horarioAtual = `${horaAtual.toString().padStart(2, '0')}:${minutosAtuais.toString().padStart(2, '0')}`;

        const temRegistro = (tipo) => registros.some(r => r.tipo === tipo);
        const jornadaCompleta = () => registros.some(r => r.tipo === 'saida_extra');

        if (jornadaCompleta()) {
            return {
                tipo: 'jornada_finalizada',
                label: 'Jornada Finalizada',
                icon: Clock,
                color: 'gray'
            };
        }

        const sequencia = [
            { tipo: 'entrada', label: 'Registrar Entrada', icon: LogIn, color: 'green', janela: ['07:45', '08:15'] },
            { tipo: 'saida_almoco', label: 'Saída para Almoço', icon: Coffee, color: 'orange', janela: ['11:45', '12:15'] },
            { tipo: 'volta_almoco', label: 'Volta do Almoço', icon: Coffee, color: 'blue', janela: ['13:45', '14:15'] },
            { tipo: 'saida', label: 'Registrar Saída', icon: LogOut, color: 'red', janela: ['17:45', '18:15'] }
        ];

        for (const etapa of sequencia) {
            if (!temRegistro(etapa.tipo)) {
                const [inicio, fim] = etapa.janela;
                if (horarioAtual <= fim) {
                    return etapa;
                }
            }
        }

        // A partir daqui: após 18:15
        if (horarioAtual > '18:15') {
            if (!temRegistro('entrada_extra')) {
                return { tipo: 'entrada_extra', label: 'Entrada Extra', icon: LogIn, color: 'purple' };
            } else if (!temRegistro('saida_extra')) {
                return { tipo: 'saida_extra', label: 'Saída da Hora Extra', icon: LogOut, color: 'indigo' };
            }
        }

        // Jornada acabou antes das 18:15 mas não inseriu horas extras ainda
        return {
            tipo: 'aguardando',
            label: 'Aguardando horário válido...',
            icon: Clock,
            color: 'gray'
        };
    };



    const calcularHorasTrabalhadas = () => {
        let totalMinutos = 0;
        let ultimaEntrada = null;

        registros.forEach(registro => {
            const dataHora = new Date(registro.dataHora);
            const minutosDoDia = dataHora.getHours() * 60 + dataHora.getMinutes();

            if (['entrada', 'volta_almoco', 'entrada_extra'].includes(registro.tipo)) {
                ultimaEntrada = minutosDoDia;
            } else if (['saida_almoco', 'saida', 'saida_extra'].includes(registro.tipo)) {
                if (ultimaEntrada !== null) {
                    totalMinutos += minutosDoDia - ultimaEntrada;
                    ultimaEntrada = null;
                }
            }
        });

        // Se ainda está trabalhando (última entrada sem saída)
        if (ultimaEntrada !== null) {
            const agora = currentTime.getHours() * 60 + currentTime.getMinutes();
            totalMinutos += agora - ultimaEntrada;
        }

        const horas = Math.floor(totalMinutos / 60);
        const minutos = totalMinutos % 60;
        return `${horas}h${minutos.toString().padStart(2, '0')}m`;
    };

    const getStatusColor = (tipo) => {
        switch (tipo) {
            case 'entrada':
            case 'entrada_extra':
                return 'text-green-600 bg-green-50';
            case 'saida':
                return 'text-red-600 bg-red-50';
            case 'saida_extra':
                return 'text-indigo-600 bg-indigo-50';
            case 'saida_almoco':
                return 'text-orange-600 bg-orange-50';
            case 'volta_almoco':
                return 'text-blue-600 bg-blue-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    const getTipoLabel = (tipo) => {
        switch (tipo) {
            case 'entrada': return 'Entrada';
            case 'saida': return 'Saída';
            case 'saida_almoco': return 'Saída Almoço';
            case 'volta_almoco': return 'Volta Almoço';
            case 'entrada_extra': return 'Entrada Extra';
            case 'saida_extra': return 'Saída Hora Extra';
            default: return tipo;
        }
    };

    const getIcon = (tipo) => {
        switch (tipo) {
            case 'entrada':
            case 'entrada_extra':
                return <LogIn className="w-4 h-4" />;
            case 'saida':
            case 'saida_extra':
                return <LogOut className="w-4 h-4" />;
            case 'saida_almoco':
            case 'volta_almoco':
                return <Coffee className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const proximaAcao = determinarProximaAcao();

    const registrarPonto = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token não encontrado');
            }
            const response = await fetch('http://localhost:8080/appointment/mark', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(`Erro ${responseData.statusCode}: ${responseData.error.description}`);
            }
            // Registro bem-sucedido, atualiza registros do dia
            await buscarRegistrosDia();


        } catch (error) {
            console.error('Erro ao registrar ponto:', error);
            setError(`Erro ao registrar ponto: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        if(!localStorage.getItem('token')) {
            navigate('/login');
            return;
        }
        const carregarDados = async () => {
            setIsLoadingData(true);
            await Promise.all([
                buscarDadosFuncionario(),
                buscarRegistrosDia()
            ]);
            setIsLoadingData(false);
        };

        carregarDados();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);





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

    if (!funcionario) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Erro ao carregar dados</h2>
                    <p className="text-gray-600 mb-4">{error || 'Não foi possível carregar os dados do funcionário'}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    const adminValidation = () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return false;

            const decoded = jwtDecode(token);
            return decoded.role === 1;
        } catch (error) {
            console.error('Erro ao validar admin:', error);
            return false;
        }
    };
    const jornadaCompleta = () => {
        return registros.some(reg => reg.tipo === 'saida_extra');
    };


    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Mensagem de erro */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                            <p className="text-red-800">{error}</p>
                            <button
                                onClick={() => setError(null)}
                                className="ml-auto text-red-600 hover:text-red-800"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                                {funcionario.foto ? (
                                    <img src={funcionario.foto} alt="Foto" className="w-16 h-16 rounded-full object-cover" />
                                ) : (
                                    <User className="w-8 h-8 text-white" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">{funcionario.nome}</h1>
                                <p className="text-gray-600">{funcionario.cargo}</p>
                                <p className="text-sm text-gray-500">Matrícula: {funcionario.matricula}</p>
                            </div>
                        </div>

                        <div className="text-right space-y-1">
                            <div className="text-3xl font-bold text-blue-600">
                                {currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="text-sm text-gray-600">
                                {currentTime.toLocaleDateString('pt-BR', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </div>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('user');
                                  navigate('/login');
                                }}
                                title="Sair"
                                className="mt-3 inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-xl transition-colors"
                            >
                                <LogOut className="w-5 h-5 mr-2" />
                                Sair
                            </button>

                        </div>
                    </div>
                </div>

                {adminValidation() && (
                    <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
                        <button
                            onClick={() => navigate('/relatorios/geral')}
                            className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors"
                        >
                            <Calendar className="w-5 h-5 mr-2" />
                            Emitir Relatório Geral
                        </button>

                        <button
                            onClick={() => navigate('/cadastro/funcionario')}
                            className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors"
                        >
                            <User className="w-5 h-5 mr-2" />
                            Cadastrar Novo Usuário
                        </button>
                    </div>
                )}


                {/* Cards de resumo do dia */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Horas Trabalhadas</p>
                                <p className="text-2xl font-bold text-blue-600">{calcularHorasTrabalhadas()}</p>
                            </div>
                            <Timer className="w-8 h-8 text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Registros Hoje</p>
                                <p className="text-2xl font-bold text-green-600">{registros.length}</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Status Atual</p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {registros.length > 0 &&
                                    (['entrada', 'volta_almoco', 'entrada_extra'].includes(registros[registros.length - 1].tipo))
                                        ? 'Trabalhando'
                                        : 'Fora do expediente'
                                    }
                                </p>
                            </div>
                            {registros.length > 0 &&
                            (['entrada', 'volta_almoco', 'entrada_extra'].includes(registros[registros.length - 1].tipo))
                                ? <CheckCircle className="w-8 h-8 text-green-600" />
                                : <Home className="w-8 h-8 text-gray-600" />
                            }
                        </div>
                    </div>
                </div>

                {/* Botão principal de registro - CORRIGIDO */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">Registro de Ponto</h2>

                        <div className="flex flex-col items-center space-y-4">
                            {/* Ícone circular - CLASSES FIXAS */}
                            <div className={`w-32 h-32 rounded-full flex items-center justify-center border-4 ${
                                proximaAcao.color === 'green' ? 'bg-green-100 border-green-200' :
                                    proximaAcao.color === 'orange' ? 'bg-orange-100 border-orange-200' :
                                        proximaAcao.color === 'blue' ? 'bg-blue-100 border-blue-200' :
                                            proximaAcao.color === 'red' ? 'bg-red-100 border-red-200' :
                                                proximaAcao.color === 'purple' ? 'bg-purple-100 border-purple-200' :
                                                    proximaAcao.color === 'indigo' ? 'bg-indigo-100 border-indigo-200' :
                                                        'bg-gray-100 border-gray-200'
                            }`}>
                                <proximaAcao.icon className={`w-12 h-12 ${
                                    proximaAcao.color === 'green' ? 'text-green-600' :
                                        proximaAcao.color === 'orange' ? 'text-orange-600' :
                                            proximaAcao.color === 'blue' ? 'text-blue-600' :
                                                proximaAcao.color === 'red' ? 'text-red-600' :
                                                    proximaAcao.color === 'purple' ? 'text-purple-600' :
                                                        proximaAcao.color === 'indigo' ? 'text-indigo-600' :
                                                            'text-gray-600'
                                }`} />
                            </div>

                            {/* Botão de ação - CLASSES FIXAS */}
                            <button
                                onClick={registrarPonto}
                                disabled={isLoading || proximaAcao.tipo === 'jornada_finalizada'}
                                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200 flex items-center space-x-3 text-white ${
                                    proximaAcao.color === 'green' ? 'bg-green-600 hover:bg-green-700 disabled:bg-green-400' :
                                        proximaAcao.color === 'orange' ? 'bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400' :
                                            proximaAcao.color === 'blue' ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400' :
                                                proximaAcao.color === 'red' ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-400' :
                                                    proximaAcao.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400' :
                                                        proximaAcao.color === 'indigo' ? 'bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400' :
                                                            'bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400'
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                        <span>Registrando...</span>
                                    </>
                                ) : (
                                    <>
                                        <proximaAcao.icon className="w-6 h-6" />
                                        <span>{proximaAcao.label}</span>
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                            {proximaAcao.tipo === 'jornada_finalizada' && (
                                <p className="text-sm text-gray-500 mt-2 flex items-center">
                                    <Clock className="w-4 h-4 mr-1" /> Jornada encerrada. Aguardando novo dia útil.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Registros do dia */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                            <Calendar className="w-6 h-6 mr-2 text-blue-600" />
                            Registros de Hoje
                        </h3>
                        <span className="text-sm text-gray-500">
                            {currentTime.toLocaleDateString('pt-BR')}
                        </span>
                    </div>

                    {registros.length > 0 ? (
                        <div className="space-y-3">
                            {registros.map((registro) => (
                                <div key={registro.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-2 rounded-lg ${getStatusColor(registro.tipo)}`}>
                                            {getIcon(registro.tipo)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-800">
                                                {getTipoLabel(registro.tipo)}
                                            </div>
                                            <div className="text-sm text-gray-600 flex items-center">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                {registro.localizacao?.endereco || 'Localização não disponível'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-gray-800">
                                            {new Date(registro.dataHora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Registrado
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">Nenhum registro hoje</p>
                            <p className="text-gray-400 text-sm">Registre sua entrada para começar</p>
                        </div>
                    )}
                </div>

                {/* Informações importantes */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-amber-800 mb-1">Informações Importantes</h4>
                            <ul className="text-sm text-amber-700 space-y-1">
                                <li>• Registre todos os horários de entrada e saída</li>
                                <li>• Não esqueça de registrar saída e volta do almoço</li>
                                <li>• Em caso de problemas, contate a administração</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}