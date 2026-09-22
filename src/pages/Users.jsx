import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Users as UsersIcon, 
  UserPlus, 
  Trash2, 
  ShieldCheck, 
  UserCheck, 
  Search, 
  Circle, 
  Activity, 
  X, 
  Check, 
  AlertTriangle,
  Building2,
  Mail,
  User,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Pencil,
  Lock,
  Eye,
  EyeOff,
  Key
} from 'lucide-react';
import { addUser, updateUser, deleteUser, toggleUserOnlineStatus, switchRoleUser } from '../features/authSlice';
import toast from 'react-hot-toast';

const Users = () => {
  const dispatch = useDispatch();
  const { user: currentUser, availableUsers } = useSelector(state => state.auth);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, ONLINE, OFFLINE, ADMIN, GESTOR, ANALISTA, VIEWER
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: '',
    name: '',
    email: '',
    role: 'ANALISTA',
    area: 'Operações Luxottica',
    password: '',
    avatarGradient: 'from-emerald-600 to-teal-600',
    initials: '',
    isOnline: true
  });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'ANALISTA',
    area: 'Operações Luxottica',
    isOnline: true
  });

  const isManagerOrAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'GESTOR';

  // Metrics Calculation
  const totalUsers = availableUsers.length;
  const onlineCount = availableUsers.filter(u => u.isOnline).length;
  const offlineCount = totalUsers - onlineCount;
  const adminsGestoresCount = availableUsers.filter(u => u.role === 'ADMIN' || u.role === 'GESTOR').length;
  const analistasViewersCount = availableUsers.filter(u => u.role === 'ANALISTA' || u.role === 'VIEWER').length;

  // Filtering
  const filteredUsers = availableUsers.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.area && u.area.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === 'ONLINE') return u.isOnline;
    if (activeTab === 'OFFLINE') return !u.isOnline;
    if (['ADMIN', 'GESTOR', 'ANALISTA', 'VIEWER'].includes(activeTab)) return u.role === activeTab;

    return true;
  });

  // Helpers
  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border border-purple-300 dark:border-purple-700/50">ADMIN</span>;
      case 'GESTOR':
        return <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-300 dark:border-blue-700/50">GESTOR</span>;
      case 'ANALISTA':
        return <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50">ANALISTA</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50">VIEWER</span>;
    }
  };

  const getGradientForRole = (role) => {
    switch (role) {
      case 'ADMIN': return 'from-purple-600 to-indigo-700';
      case 'GESTOR': return 'from-blue-600 to-indigo-600';
      case 'ANALISTA': return 'from-emerald-600 to-teal-600';
      default: return 'from-amber-500 to-orange-600';
    }
  };

  const getInitials = (name) => {
    if (!name) return 'US';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Handlers
  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Preencha o nome e o e-mail do usuário.');
      return;
    }

    const newUser = {
      id: 'u_' + Date.now(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role,
      area: formData.area.trim() || 'Geral',
      avatarGradient: getGradientForRole(formData.role),
      initials: getInitials(formData.name),
      isOnline: formData.isOnline,
      lastActive: formData.isOnline ? 'Online agora' : 'Registrado recentemente'
    };

    dispatch(addUser(newUser));
    toast.success(`Usuário ${newUser.name} cadastrado com sucesso!`);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      email: '',
      role: 'ANALISTA',
      area: 'Operações Luxottica',
      isOnline: true
    });
  };

  const handleOpenEditModal = (u) => {
    setEditFormData({
      id: u.id,
      name: u.name || '',
      email: u.email || '',
      role: u.role || 'ANALISTA',
      area: u.area || 'Operações Luxottica',
      password: u.password || 'Essilorlux@2026',
      avatarGradient: u.avatarGradient || getGradientForRole(u.role),
      initials: u.initials || getInitials(u.name),
      isOnline: u.isOnline ?? true
    });
    setShowEditPassword(false);
    setIsEditModalOpen(true);
  };

  const handleUpdateUserSubmit = (e) => {
    e.preventDefault();
    if (!editFormData.name.trim() || !editFormData.email.trim()) {
      toast.error('Preencha o nome e o e-mail do usuário.');
      return;
    }

    const updatedUser = {
      ...editFormData,
      name: editFormData.name.trim(),
      email: editFormData.email.trim(),
      area: editFormData.area.trim() || 'Geral',
      initials: editFormData.initials.trim() || getInitials(editFormData.name)
    };

    dispatch(updateUser(updatedUser));
    toast.success(`Dados de ${updatedUser.name} atualizados com sucesso!`);
    setIsEditModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!userToDelete) return;

    if (userToDelete.id === currentUser?.id) {
      toast.error('Você não pode excluir a sua própria conta logada atualmente.');
      setUserToDelete(null);
      return;
    }

    dispatch(deleteUser(userToDelete.id));
    toast.success(`Usuário ${userToDelete.name} excluído com sucesso.`);
    setUserToDelete(null);
  };

  const handleToggleStatus = (u) => {
    dispatch(toggleUserOnlineStatus(u.id));
    toast.success(`Status de ${u.name} alterado para ${!u.isOnline ? 'Online' : 'Offline'}.`);
  };

  const handleSimulateLogin = (u) => {
    dispatch(switchRoleUser(u.id));
    toast.success(`Sessão alterada! Agora você está operando como ${u.name} (${u.role}).`);
  };

  // If user is not manager/admin, show access denied screen
  if (!isManagerOrAdmin) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center space-y-6">
        <div className="size-20 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
          <AlertTriangle size={40} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Acesso Restrito</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-2 max-w-md mx-auto">
            O menu de Gestão de Usuários está disponível exclusivamente para contas com perfil de <strong>Gestor</strong> ou <strong>Administrador</strong>.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-2xl">
              <UsersIcon size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                  Gestão & Presença de Usuários
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                  Painel Executivo
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                Monitore membros online em tempo real, cadastre novos colaboradores e gerencie permissões.
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <UserPlus size={16} />
          <span>Cadastrar Novo Usuário</span>
        </button>
      </div>

      {/* Metrics Bar (Online Hub Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Users */}
        <div className="p-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Total Cadastrado</span>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{totalUsers}</p>
            <span className="text-[11px] text-gray-400">Usuários no sistema</span>
          </div>
          <div className="p-3 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 rounded-xl">
            <UsersIcon size={22} />
          </div>
        </div>

        {/* Online Now */}
        <div className="p-5 bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/30 rounded-2xl shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="space-y-1 z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Online Agora</span>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{onlineCount}</p>
            <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">Conectados em tempo real</span>
          </div>
          <div className="p-3 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-xl z-10">
            <Activity size={22} className="animate-pulse" />
          </div>
        </div>

        {/* Admins & Gestores */}
        <div className="p-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Liderança / Gestão</span>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{adminsGestoresCount}</p>
            <span className="text-[11px] text-gray-400">Admins e Gestores</span>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <ShieldCheck size={22} />
          </div>
        </div>

        {/* Analistas & Viewers */}
        <div className="p-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Operacional & Consultoria</span>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400">{analistasViewersCount}</p>
            <span className="text-[11px] text-gray-400">Analistas e Viewers</span>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
            <UserCheck size={22} />
          </div>
        </div>

      </div>

      {/* Search & Tabs Filtering */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou área..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: `Todos (${totalUsers})` },
            { id: 'ONLINE', label: `🟢 Online (${onlineCount})` },
            { id: 'OFFLINE', label: `⚪ Offline (${offlineCount})` },
            { id: 'ADMIN', label: 'Admin' },
            { id: 'GESTOR', label: 'Gestor' },
            { id: 'ANALISTA', label: 'Analista' },
            { id: 'VIEWER', label: 'Viewer' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-200 dark:hover:bg-zinc-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Users Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredUsers.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl space-y-3">
            <UsersIcon size={40} className="mx-auto text-gray-300 dark:text-zinc-700" />
            <h3 className="text-sm font-bold text-gray-700 dark:text-zinc-300">Nenhum usuário encontrado</h3>
            <p className="text-xs text-gray-400">Tente ajustar a sua busca ou os filtros aplicados acima.</p>
          </div>
        ) : (
          filteredUsers.map((u) => {
            const isSelf = u.id === currentUser?.id;
            return (
              <div
                key={u.id}
                className={`bg-white dark:bg-zinc-900 border rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4 relative ${
                  isSelf 
                    ? 'border-blue-500 ring-2 ring-blue-500/20 dark:border-blue-500' 
                    : u.isOnline 
                      ? 'border-emerald-500/40 dark:border-emerald-500/30' 
                      : 'border-gray-200 dark:border-zinc-800'
                }`}
              >
                {/* Header User Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    
                    {/* Avatar with Status Dot */}
                    <div className="relative">
                      <div className={`size-12 rounded-2xl bg-gradient-to-tr ${u.avatarGradient || 'from-blue-600 to-indigo-600'} text-white font-black text-sm flex items-center justify-center shadow-md`}>
                        {u.initials || getInitials(u.name)}
                      </div>
                      
                      {/* Status indicator dot */}
                      {u.isOnline ? (
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-zinc-900"></span>
                        </span>
                      ) : (
                        <span className="absolute -bottom-1 -right-1 inline-flex rounded-full h-4 w-4 bg-gray-400 dark:bg-zinc-600 border-2 border-white dark:border-zinc-900"></span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate" title={u.name}>
                          {u.name}
                        </h3>
                        {isSelf && (
                          <span className="px-1.5 py-0.5 text-[9px] font-black bg-blue-500 text-white rounded uppercase">Você</span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-zinc-400 truncate" title={u.email}>{u.email}</p>
                    </div>

                  </div>

                  {getRoleBadge(u.role)}
                </div>

                {/* Details & Area */}
                <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-zinc-800/80 text-xs">
                  
                  <div className="flex items-center justify-between text-gray-600 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Building2 size={14} className="text-gray-400" />
                      <span>{u.area || 'Área Geral'}</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-[11px]">Presença:</span>
                    {u.isOnline ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online agora
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400">
                        <span className="size-1.5 rounded-full bg-gray-400" />
                        {u.lastActive || 'Offline'}
                      </span>
                    )}
                  </div>

                </div>

                {/* Quick Actions Bar */}
                <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                  
                  {/* Simulate Login */}
                  <button
                    onClick={() => handleSimulateLogin(u)}
                    disabled={isSelf}
                    className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                      isSelf 
                        ? 'bg-gray-100 dark:bg-zinc-800 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                    }`}
                    title={isSelf ? 'Sessão ativa' : 'Simular login como este usuário'}
                  >
                    <UserCheck size={13} />
                    <span>{isSelf ? 'Sessão Ativa' : 'Simular Login'}</span>
                  </button>

                  {/* Edit User Details */}
                  <button
                    onClick={() => handleOpenEditModal(u)}
                    className="p-1.5 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition"
                    title="Editar qualquer informação do card"
                  >
                    <Pencil size={15} />
                  </button>

                  {/* Toggle Online Status */}
                  <button
                    onClick={() => handleToggleStatus(u)}
                    className="p-1.5 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 transition"
                    title={u.isOnline ? 'Marcar como Offline' : 'Marcar como Online'}
                  >
                    {u.isOnline ? <ToggleRight size={18} className="text-emerald-500" /> : <ToggleLeft size={18} className="text-gray-400" />}
                  </button>

                  {/* Delete User */}
                  <button
                    onClick={() => setUserToDelete(u)}
                    disabled={isSelf}
                    className={`p-1.5 rounded-lg transition ${
                      isSelf 
                        ? 'text-gray-300 dark:text-zinc-700 cursor-not-allowed' 
                        : 'text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40'
                    }`}
                    title={isSelf ? 'Não é possível excluir você mesmo' : 'Excluir usuário'}
                  >
                    <Trash2 size={15} />
                  </button>

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Modal: Cadastrar Novo Usuário */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
                  <UserPlus size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">Cadastrar Novo Usuário</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Adicione colaboradores e defina suas permissões no sistema.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              
              {/* Nome Completo */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700 dark:text-zinc-300">Nome Completo *</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Mariana Silva"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700 dark:text-zinc-300">E-mail Corporativo *</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    placeholder="Ex: mariana@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Role & Area */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-zinc-300">Perfil / Função *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="GESTOR">GESTOR</option>
                    <option value="ANALISTA">ANALISTA</option>
                    <option value="VIEWER">VIEWER</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-zinc-300">Área / Depto</label>
                  <input
                    type="text"
                    placeholder="Ex: CTI & PMO"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="w-full p-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Status Online Checkbox */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-200 dark:border-zinc-700/80">
                <div>
                  <span className="font-bold text-gray-800 dark:text-zinc-200">Status Inicial</span>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400">Marcar usuário como online imediatamente após o cadastro</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isOnline}
                  onChange={(e) => setFormData({ ...formData, isOnline: e.target.checked })}
                  className="size-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-semibold hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-md shadow-blue-500/20"
                >
                  Cadastrar Usuário
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Informações do Usuário */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <Pencil size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">Editar Informações do Usuário</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Atualize nome, e-mail, perfil, senha e personalização do card.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateUserSubmit} className="space-y-4 text-xs">
              
              {/* Preview Avatar Header */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-2xl border border-gray-200 dark:border-zinc-700/80">
                <div className={`size-12 rounded-2xl bg-gradient-to-tr ${editFormData.avatarGradient} text-white font-black text-sm flex items-center justify-center shadow-md`}>
                  {editFormData.initials || 'US'}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm">{editFormData.name || 'Sem nome'}</h4>
                  <span className="text-[11px] text-gray-500 dark:text-zinc-400">{editFormData.email || 'sem-email'}</span>
                </div>
              </div>

              {/* Nome Completo */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700 dark:text-zinc-300">Nome Completo *</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700 dark:text-zinc-300">E-mail Corporativo *</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Perfil & Área */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-zinc-300">Perfil / Função *</label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                    className="w-full p-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="GESTOR">GESTOR</option>
                    <option value="ANALISTA">ANALISTA</option>
                    <option value="VIEWER">VIEWER</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-zinc-300">Área / Depto</label>
                  <input
                    type="text"
                    value={editFormData.area}
                    onChange={(e) => setEditFormData({ ...editFormData, area: e.target.value })}
                    className="w-full p-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700 dark:text-zinc-300">Senha de Acesso</label>
                <div className="relative">
                  <Key size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showEditPassword ? "text" : "password"}
                    value={editFormData.password}
                    onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                    className="w-full pl-9 pr-10 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
                  >
                    {showEditPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Iniciais e Gradiente do Avatar */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-zinc-300">Iniciais no Avatar</label>
                  <input
                    type="text"
                    maxLength={3}
                    value={editFormData.initials}
                    onChange={(e) => setEditFormData({ ...editFormData, initials: e.target.value.toUpperCase() })}
                    className="w-full p-2 uppercase bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-zinc-300">Cor do Avatar</label>
                  <select
                    value={editFormData.avatarGradient}
                    onChange={(e) => setEditFormData({ ...editFormData, avatarGradient: e.target.value })}
                    className="w-full p-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium text-xs"
                  >
                    <option value="from-emerald-600 to-teal-600">Verde (Analista)</option>
                    <option value="from-blue-600 to-indigo-600">Azul (Gestor)</option>
                    <option value="from-purple-600 to-indigo-700">Roxo (Admin)</option>
                    <option value="from-cyan-600 to-teal-600">Ciano</option>
                    <option value="from-amber-500 to-orange-600">Laranja (Viewer)</option>
                    <option value="from-rose-600 to-pink-600">Rosa / Magenta</option>
                  </select>
                </div>
              </div>

              {/* Status Online Checkbox */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-200 dark:border-zinc-700/80">
                <div>
                  <span className="font-bold text-gray-800 dark:text-zinc-200">Presença Conectada (Online)</span>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400">Definir se o usuário é exibido como conectado em tempo real</p>
                </div>
                <input
                  type="checkbox"
                  checked={editFormData.isOnline}
                  onChange={(e) => setEditFormData({ ...editFormData, isOnline: e.target.checked })}
                  className="size-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              {/* Modal Buttons */}
              <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-semibold hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold transition shadow-md shadow-blue-500/20"
                >
                  Salvar Alterações
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal Confirm Delete */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            
            <div className="size-14 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Trash2 size={26} />
            </div>

            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Excluir Usuário?</h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                Tem certeza que deseja remover <strong>{userToDelete.name}</strong> ({userToDelete.email})? Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="w-full py-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 rounded-xl text-xs font-bold hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-red-500/20"
              >
                Sim, Excluir
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default Users;
