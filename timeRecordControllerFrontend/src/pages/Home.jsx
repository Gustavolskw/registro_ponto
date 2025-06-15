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

export default function FuncionarioRegistroPonto() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [registros, setRegistros] = useState([
        { id: 1, tipo: 'entrada', horario: '08:00', localizacao: 'Escola - Portaria Principal' },
        { id: 2, tipo: 'saida_almoco', horario: '12:00', localizacao: 'Escola - Portaria Principal' },
        { id: 3, tipo: 'volta_almoco', horario: '13:00', localizacao: 'Escola - Portaria Principal' }
    ]);

    // Dados simulados do funcionário
    const funcionario = {
        nome: 'Maria Silva',
        matricula: 'FUNC202406003',
        cargo: 'Professora de Matemática',
        foto: null // Simulação sem foto
    };

    // Atualizar horário a cada segundo
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Determinar próxima ação baseada nos registros
    const determinarProximaAcao = () => {
        const hoje = registros.filter(r => {
            // Filtrar apenas registros de hoje (simulação)
            return true;
        });

        if (hoje.length === 0) return { tipo: 'entrada', label: 'Registrar Entrada', icon: LogIn, color: 'green' };

        const ultimoRegistro = hoje[hoje.length - 1];

        switch (ultimoRegistro.tipo) {
            case 'entrada':
                return { tipo: 'saida_almoco', label: 'Saída para Almoço', icon: Coffee, color: 'orange' };
            case 'saida_almoco':
                return { tipo: 'volta_almoco', label: 'Volta do Almoço', icon: Coffee, color: 'blue' };
            case 'volta_almoco':
                return { tipo: 'saida', label: 'Registrar Saída', icon: LogOut, color: 'red' };
            case 'saida':
                return { tipo: 'entrada_extra', label: 'Entrada Extra', icon: LogIn, color: 'purple' };
            default:
                return { tipo: 'entrada', label: 'Registrar Entrada', icon: LogIn, color: 'green' };
        }
    };

    const proximaAcao = determinarProximaAcao();

    // Calcular horas trabalhadas no dia
    const calcularHorasTrabalhadas = () => {
        let totalMinutos = 0;
        let ultimaEntrada = null;

        registros.forEach(registro => {
            const [hora, minuto] = registro.horario.split(':').map(Number);
            const minutosDoDia = hora * 60 + minuto;

            if (registro.tipo === 'entrada' || registro.tipo === 'volta_almoco' || registro.tipo === 'entrada_extra') {
                ultimaEntrada = minutosDoDia;
            } else if (registro.tipo === 'saida_almoco' || registro.tipo === 'saida') {
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

    const registrarPonto = async () => {
        setIsLoading(true);

        // Simulação de obtenção de localização
        setTimeout(async () => {
            const novoRegistro = {
                id: registros.length + 1,
                tipo: proximaAcao.tipo,
                horario: currentTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
                localizacao: 'Escola - Portaria Principal' // Simulação
            };

            setRegistros(prev => [...prev, novoRegistro]);
            setIsLoading(false);

            // Feedback visual
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAAAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAcBSJ+0fPTgjMGHm7A7+CVSA0PVqzn77BdGAk+ltryxnkpBSl+zPDgkToIGGS57eGWT');
            audio.play().catch(e => console.log('Audio não suportado'));
        }, 1500);
    };

    const getStatusColor = (tipo) => {
        switch (tipo) {
            case 'entrada':
            case 'entrada_extra':
                return 'text-green-600 bg-green-50';
            case 'saida':
                return 'text-red-600 bg-red-50';
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
            default: return tipo;
        }
    };

    const getIcon = (tipo) => {
        switch (tipo) {
            case 'entrada':
            case 'entrada_extra':
                return <LogIn className="w-4 h-4" />;
            case 'saida':
                return <LogOut className="w-4 h-4" />;
            case 'saida_almoco':
            case 'volta_almoco':
                return <Coffee className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Header com informações do funcionário */}
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
                        <div className="text-right">
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
                        </div>
                    </div>
                </div>

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
                                    {registros.length > 0 && registros[registros.length - 1].tipo.includes('entrada')
                                        ? 'Trabalhando'
                                        : 'Fora do expediente'
                                    }
                                </p>
                            </div>
                            {registros.length > 0 && registros[registros.length - 1].tipo.includes('entrada')
                                ? <CheckCircle className="w-8 h-8 text-green-600" />
                                : <Home className="w-8 h-8 text-gray-600" />
                            }
                        </div>
                    </div>
                </div>

                {/* Botão principal de registro */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">Registro de Ponto</h2>

                        <div className="flex flex-col items-center space-y-4">
                            <div className={`w-32 h-32 rounded-full flex items-center justify-center bg-${proximaAcao.color}-100 border-4 border-${proximaAcao.color}-200`}>
                                <proximaAcao.icon className={`w-12 h-12 text-${proximaAcao.color}-600`} />
                            </div>

                            <button
                                onClick={registrarPonto}
                                disabled={isLoading}
                                className={`bg-${proximaAcao.color}-600 hover:bg-${proximaAcao.color}-700 disabled:bg-${proximaAcao.color}-400 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-200 flex items-center space-x-3`}
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
                            <MapPin className="w-4 h-4" />
                            <span>Localização será detectada automaticamente</span>
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
                                                {registro.localizacao}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-gray-800">
                                            {registro.horario}
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
                                <li>• Mantenha sua localização ativada para registros precisos</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}