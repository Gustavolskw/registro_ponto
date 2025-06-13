import React, { useState } from 'react';
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  MapPin,
  Clock,
  Save,
  Star,
  Home,
  Car,
  Users,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageCircle
} from 'lucide-react';

const TorcidaSolidariaAdminGames = () => {
  const [currentScreen, setCurrentScreen] = useState('admin-games');
  const [selectedFilter, setSelectedFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  // Mock data
  const user = {
    name: 'João Silva',
    photo: '/api/placeholder/50/50',
    rating: 4.8,
    totalRides: 23,
    role: 'admin'
  };

  const games = [
    {
      id: 1,
      name: 'JEC x Chapecoense',
      type: 'JEC',
      date: '2025-06-01',
      time: '16:00',
      location: 'Arena Joinville',
      address: 'Rua Albano Schmidt, 3333 - Joinville/SC',
      status: 'ativo',
      createdAt: '2025-05-20',
      ridesCount: 12,
      passengersCount: 35
    },
    {
      id: 2,
      name: 'Krona x ACBF',
      type: 'Krona',
      date: '2025-06-03',
      time: '20:00',
      location: 'Centreventos',
      address: 'Rua XV de Novembro, 777 - Joinville/SC',
      status: 'ativo',
      createdAt: '2025-05-18',
      ridesCount: 8,
      passengersCount: 24
    },
    {
      id: 3,
      name: 'JEC x Avaí',
      type: 'JEC',
      date: '2025-06-08',
      time: '19:30',
      location: 'Ressacada',
      address: 'Florianópolis - SC',
      status: 'inativo',
      createdAt: '2025-05-15',
      ridesCount: 0,
      passengersCount: 0
    },
    {
      id: 4,
      name: 'Krona x Carlos Barbosa',
      type: 'Krona',
      date: '2025-06-12',
      time: '21:00',
      location: 'Centreventos',
      address: 'Rua XV de Novembro, 777 - Joinville/SC',
      status: 'ativo',
      createdAt: '2025-05-22',
      ridesCount: 5,
      passengersCount: 18
    },
    {
      id: 5,
      name: 'JEC x Figueirense',
      type: 'JEC',
      date: '2025-06-15',
      time: '15:30',
      location: 'Arena Joinville',
      address: 'Rua Albano Schmidt, 3333 - Joinville/SC',
      status: 'ativo',
      createdAt: '2025-05-25',
      ridesCount: 15,
      passengersCount: 42
    }
  ];

  const stats = {
    totalGames: games.length,
    activeGames: games.filter(g => g.status === 'ativo').length,
    inactiveGames: games.filter(g => g.status === 'inativo').length,
    totalRides: games.reduce((sum, g) => sum + g.ridesCount, 0),
    totalPassengers: games.reduce((sum, g) => sum + g.passengersCount, 0)
  };

  const filteredGames = games.filter(game => {
    const matchesFilter = selectedFilter === 'todos' || 
                         (selectedFilter === 'jec' && game.type === 'JEC') ||
                         (selectedFilter === 'krona' && game.type === 'Krona') ||
                         (selectedFilter === 'ativo' && game.status === 'ativo') ||
                         (selectedFilter === 'inativo' && game.status === 'inativo');
    
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Navigation Component
  const Navigation = () => (
    <nav className="bg-red-600 text-white p-4 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-white text-red-600 p-2 rounded-full">
            <Car className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold">Torcida Solidária</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => setCurrentScreen('dashboard')}
            className={`flex items-center space-x-2 px-3 py-2 rounded transition-colors ${
              currentScreen === 'dashboard' ? 'bg-red-700' : 'hover:bg-red-700'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          
          <button 
            onClick={() => setCurrentScreen('chat')}
            className={`flex items-center space-x-2 px-3 py-2 rounded transition-colors ${
              currentScreen === 'chat' ? 'bg-red-700' : 'hover:bg-red-700'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat</span>
          </button>
          
          <button 
            onClick={() => setCurrentScreen('admin-games')}
            className={`flex items-center space-x-2 px-3 py-2 rounded transition-colors ${
              currentScreen === 'admin-games' ? 'bg-red-700' : 'hover:bg-red-700'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Administração</span>
          </button>
          
          <div className="flex items-center space-x-2 ml-6">
            <img 
              src={user.photo} 
              alt={user.name}
              className="w-8 h-8 rounded-full border-2 border-white"
            />
            <div className="text-sm">
              <div>{user.name}</div>
              <div className="text-red-100 text-xs">Administrador</div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  // Delete Modal
  const DeleteModal = ({ game, onClose, onConfirm }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
          <h3 className="text-lg font-bold text-gray-800">Confirmar Exclusão</h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          Tem certeza que deseja excluir o jogo <strong>"{game.name}"</strong>? 
          Esta ação não pode ser desfeita e todas as caronas associadas serão perdidas.
        </p>
        
        <div className="flex space-x-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={() => onConfirm(game.id)}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );

  // Admin Games Screen
  const AdminGamesScreen = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-500 to-black text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Shield className="w-12 h-12" />
            <div>
              <h2 className="text-2xl font-bold">Área Administrativa</h2>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{stats.totalGames} jogos cadastrados</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Car className="w-4 h-4" />
                  <span>{stats.totalRides} caronas criadas</span>
                </div>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => setCurrentScreen('add-game')}
            className="bg-white text-red-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors flex items-center font-medium shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Novo Jogo
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-black text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Total de Jogos</p>
              <p className="text-2xl font-bold">{stats.totalGames}</p>
            </div>
            <Calendar className="w-8 h-8 text-red-400" />
          </div>
        </div>
        
        <div className="bg-black text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Jogos Ativos</p>
              <p className="text-2xl font-bold">{stats.activeGames}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>
        
        <div className="bg-black text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Jogos Inativos</p>
              <p className="text-2xl font-bold">{stats.inactiveGames}</p>
            </div>
            <XCircle className="w-8 h-8 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-black text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Total Caronas</p>
              <p className="text-2xl font-bold">{stats.totalRides}</p>
            </div>
            <Car className="w-8 h-8 text-red-400" />
          </div>
        </div>
        
        <div className="bg-black text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm">Passageiros</p>
              <p className="text-2xl font-bold">{stats.totalPassengers}</p>
            </div>
            <Users className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      {/* Games Management */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-red-600" />
            Gerenciar Jogos
          </h3>
          
          <div className="text-sm text-gray-600">
            API: GET /admin/games • PATCH /admin/games/{"{id}"} • DELETE /admin/games/{"{id}"}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <select 
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="todos">Todos os jogos</option>
              <option value="jec">JEC Futebol</option>
              <option value="krona">Krona Futsal</option>
              <option value="ativo">Apenas Ativos</option>
              <option value="inativo">Apenas Inativos</option>
            </select>
          </div>
          
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar por nome do jogo ou local..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="text-sm text-gray-600 flex items-center">
            Mostrando {filteredGames.length} de {games.length} jogos
          </div>
        </div>

        {/* Games Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-black text-white">
                <th className="border border-gray-300 px-4 py-4 text-left font-semibold">Nome do Evento</th>
                <th className="border border-gray-300 px-4 py-4 text-left font-semibold">Tipo</th>
                <th className="border border-gray-300 px-4 py-4 text-left font-semibold">Data e Hora</th>
                <th className="border border-gray-300 px-4 py-4 text-left font-semibold">Local</th>
                <th className="border border-gray-300 px-4 py-4 text-left font-semibold">Status</th>
                <th className="border border-gray-300 px-4 py-4 text-left font-semibold">Caronas</th>
                <th className="border border-gray-300 px-4 py-4 text-center font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredGames.map((game, index) => (
                <tr key={game.id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                  <td className="border border-gray-300 px-4 py-4">
                    <div className="font-medium text-gray-900">{game.name}</div>
                    <div className="text-xs text-gray-500">
                      Criado em {new Date(game.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  
                  <td className="border border-gray-300 px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      game.type === 'JEC' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {game.type === 'JEC' ? '⚽ JEC Futebol' : '🏃 Krona Futsal'}
                    </span>
                  </td>
                  
                  <td className="border border-gray-300 px-4 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(game.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-gray-600 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {game.time}
                      </div>
                    </div>
                  </td>
                  
                  <td className="border border-gray-300 px-4 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{game.location}</div>
                      <div className="text-gray-600 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="truncate max-w-xs">{game.address}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="border border-gray-300 px-4 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      game.status === 'ativo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {game.status === 'ativo' ? '🟢 Ativo' : '🔴 Inativo'}
                    </span>
                  </td>
                  
                  <td className="border border-gray-300 px-4 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{game.ridesCount} caronas</div>
                      <div className="text-gray-600">{game.passengersCount} passageiros</div>
                    </div>
                  </td>
                  
                  <td className="border border-gray-300 px-4 py-4">
                    <div className="flex space-x-2 justify-center">
                      <button 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Editar jogo"
                        onClick={() => {
                          // API: PATCH /admin/games/{game.id}
                          console.log('Editando jogo:', game.id);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button 
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        title={game.status === 'ativo' ? 'Desativar jogo' : 'Ativar jogo'}
                        onClick={() => {
                          // API: PATCH /admin/games/{game.id} - toggle status
                          console.log('Alternando status do jogo:', game.id);
                        }}
                      >
                        {game.status === 'ativo' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      
                      <button 
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir jogo"
                        onClick={() => setShowDeleteModal(game)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredGames.length}</span> de{' '}
            <span className="font-medium">{games.length}</span> jogos
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="px-3 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-md">
              1
            </button>
            <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteModal
          game={showDeleteModal}
          onClose={() => setShowDeleteModal(null)}
          onConfirm={(gameId) => {
            // API: DELETE /admin/games/{gameId}
            console.log('Excluindo jogo:', gameId);
            setShowDeleteModal(null);
          }}
        />
      )}
    </div>
  );

  // Main render
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <AdminGamesScreen />
    </div>
  );
};

export default TorcidaSolidariaAdminGames;