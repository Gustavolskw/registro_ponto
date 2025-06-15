import {useEffect, useState} from 'react';
import { Calendar, FileText, Download, Eye, ArrowLeft, AlertCircle, Loader2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";

export default function RelatorioGeral() {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [pdfData, setPdfData] = useState(null);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [showPdfViewer, setShowPdfViewer] = useState(false);


    // Estados para controle do PDF
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);

    useEffect(() => {
        if(!localStorage.getItem('token')) {
            navigate('/login');
            return;
        }
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        if(decoded.role !== 1){
            navigate('/home');
        }
    }, []);

    // Função para gerar relatório
    const gerarRelatorio = async () => {
        if (!selectedDate) {
            setError('Por favor, selecione uma data');
            return;
        }

        setIsLoading(true);
        setError('');
        setPdfData(null);
        setPdfUrl(null);
        setShowPdfViewer(false);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/home");
                throw new Error('Token não encontrado');
            }
            console.log(selectedDate)
            // Formatar data para o formato da API (YYYY-MM-DD)
            const response = await fetch(`http://localhost:8080/appointment/general-report?date=${selectedDate}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });


            if (!response.ok) {
                const data = await response.json();
                console.log(data);
                if(data.statusCode === 403) {
                    handleTokenExpiration();
                }
                if(data.statusCode === 401){
                    navigate("/home")
                }
                if(data.error.type === "JWT_TOKEN_NOT_FOUND_EXCEPTION"){
                    handleTokenExpiration();
                }
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            // Verificar se a resposta é um PDF
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/pdf')) {
                throw new Error('Resposta não é um PDF válido');
            }

            // Converter resposta para blob
            const blob = await response.blob();
            setPdfData(blob);

            // Criar URL para visualização
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
            setShowPdfViewer(true);
            setPageNumber(1);
            setScale(1.0);

        } catch (error) {
            console.error('Erro ao gerar relatório:', error);
            setError(error.message || 'Erro ao gerar relatório');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTokenExpiration = () => {
        navigate("/login");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    }

    // Função para download do PDF
    const downloadPdf = () => {
        if (!pdfData) return;

        const url = URL.createObjectURL(pdfData);
        const link = document.createElement('a');
        link.href = url;
        link.download = `relatorio-geral-${selectedDate}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Função para fechar o visualizador
    const fecharVisualizador = () => {
        setShowPdfViewer(false);
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
            setPdfUrl(null);
        }
        setPdfData(null);
        setNumPages(null);
        setPageNumber(1);
        setScale(1.0);
    };

    // Funções de controle do PDF
    const proximaPagina = () => {
        setPageNumber(prev => Math.min(prev + 1, numPages || 1));
    };

    const paginaAnterior = () => {
        setPageNumber(prev => Math.max(prev - 1, 1));
    };

    const aumentarZoom = () => {
        setScale(prev => Math.min(prev + 0.2, 3.0));
    };

    const diminuirZoom = () => {
        setScale(prev => Math.max(prev - 0.2, 0.5));
    };

    // Obter data atual no formato YYYY-MM-DD
    const getDataAtual = () => {
        return new Date().toISOString().split('T')[0];
    };

    // Obter data máxima (hoje)
    const getDataMaxima = () => {
        return getDataAtual();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-7xl mx-auto">

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
                                <FileText className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                Relatório Geral
                            </h1>
                            <p className="text-gray-600">
                                Gere e visualize relatórios de ponto por data
                            </p>
                        </div>

                        <div className="w-20"></div> {/* Spacer */}
                    </div>
                </div>

                {!showPdfViewer ? (
                    /* Formulário de Seleção */
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">

                        {/* Mensagem de erro */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center">
                                <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
                                <p className="text-red-800 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="space-y-6">
                            {/* Campo de Data */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Selecionar Data *
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        max={getDataMaxima()}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Selecione o dia para gerar o relatório
                                </p>
                            </div>

                            {/* Botão Gerar Relatório */}
                            <button
                                onClick={gerarRelatorio}
                                disabled={!selectedDate || isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Gerando Relatório...
                                    </div>
                                ) : (
                                    <>
                                        <Eye className="w-5 h-5 mr-2" />
                                        Gerar e Visualizar Relatório
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Informações */}
                        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-start">
                                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                                <div>
                                    <h4 className="font-medium text-blue-800 text-sm mb-1">Sobre o Relatório</h4>
                                    <ul className="text-xs text-blue-700 space-y-1">
                                        <li>• Contém todos os registros de ponto do dia selecionado</li>
                                        <li>• Inclui informações de funcionários e horários</li>
                                        <li>• Pode ser visualizado na tela ou baixado em PDF</li>
                                        <li>• Dados são atualizados em tempo real</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Visualizador de PDF */
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ width: '60vw' }}>

                        {/* Barra de Controles do PDF */}
                        <div className="bg-gray-50 border-b border-gray-200 p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={fecharVisualizador}
                                        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                                    >
                                        <ArrowLeft className="w-5 h-5 mr-2" />
                                        Voltar
                                    </button>

                                    <div className="text-sm text-gray-600">
                                        Relatório de {new Date(selectedDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    {/* Controles de Zoom */}
                                    <button
                                        onClick={diminuirZoom}
                                        className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        title="Diminuir Zoom"
                                    >
                                        <ZoomOut className="w-4 h-4 text-gray-600" />
                                    </button>

                                    <span className="text-sm text-gray-600 min-w-12 text-center">
                                        {Math.round(scale * 100)}%
                                    </span>

                                    <button
                                        onClick={aumentarZoom}
                                        className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                        title="Aumentar Zoom"
                                    >
                                        <ZoomIn className="w-4 h-4 text-gray-600" />
                                    </button>

                                    {/* Controles de Página */}
                                    {numPages && numPages > 1 && (
                                        <>
                                            <div className="w-px h-6 bg-gray-300 mx-2"></div>

                                            <button
                                                onClick={paginaAnterior}
                                                disabled={pageNumber <= 1}
                                                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                title="Página Anterior"
                                            >
                                                <ChevronLeft className="w-4 h-4 text-gray-600" />
                                            </button>

                                            <span className="text-sm text-gray-600 min-w-16 text-center">
                                                {pageNumber} / {numPages}
                                            </span>

                                            <button
                                                onClick={proximaPagina}
                                                disabled={pageNumber >= numPages}
                                                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                title="Próxima Página"
                                            >
                                                <ChevronRight className="w-4 h-4 text-gray-600" />
                                            </button>
                                        </>
                                    )}

                                    {/* Botão Download */}
                                    <div className="w-px h-6 bg-gray-300 mx-2"></div>

                                    <button
                                        onClick={downloadPdf}
                                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Área de Visualização do PDF - 80% da altura da tela */}
                        <div className="p-6 bg-gray-100" style={{ height: '80vh' }}>
                            <div className="flex items-center justify-center h-full">
                                {pdfUrl ? (
                                    /* Iframe para visualizar PDF - Fallback se react-pdf não estiver disponível */
                                    <div className="w-full h-full flex flex-col">
                                        <iframe
                                            src={`${pdfUrl}#zoom=${Math.round(scale * 100)}&page=${pageNumber}`}
                                            className="w-full flex-1 border border-gray-300 rounded-lg shadow-lg min-h-0"
                                            title="Visualizador de PDF"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center text-gray-500">
                                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p>Carregando PDF...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}