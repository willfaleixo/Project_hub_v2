import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Sparkles, 
  Plus, 
  Search, 
  X, 
  Pin, 
  PinOff, 
  Pencil, 
  Trash2, 
  CheckCircle2, 
  Bell, 
  Megaphone, 
  GitCommit, 
  Tag, 
  Calendar, 
  User, 
  ShieldCheck, 
  ChevronRight, 
  ListChecks, 
  Filter, 
  AlertCircle 
} from 'lucide-react';
import { 
  addNewsItem, 
  updateNewsItem, 
  deleteNewsItem, 
  togglePinNews, 
  markNewsAsRead 
} from '../features/newsSlice';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const NewsPage = () => {
  const dispatch = useDispatch();
  const { items: newsItems } = useSelector(state => state.news);
  const { user: currentUser } = useSelector(state => state.auth);

  const [activeTab, setActiveTab] = useState('ALL'); // ALL, PINNED, COMUNICADO, RELEASE, FEATURE, MEHORIA, BUGFIX
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const isManagerOrAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'GESTOR';

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    version: 'v2.5.0',
    type: 'COMUNICADO',
    pinned: false,
    mustHaveText: '',
    content: ''
  });

  const [editFormData, setEditFormData] = useState({
    id: '',
    title: '',
    version: '',
    type: 'COMUNICADO',
    pinned: false,
    mustHaveText: '',
    content: ''
  });

  // Calculate Metrics
  const totalNews = newsItems.length;
  const pinnedNews = newsItems.filter(n => n.pinned).length;
  const releasesCount = newsItems.filter(n => n.type === 'RELEASE' || n.type === 'FEATURE').length;
  const unreadCount = newsItems.filter(n => !n.readBy || !n.readBy.includes(currentUser?.id)).length;

  // Filtered List
  const filteredItems = newsItems.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.version && item.version.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === 'PINNED') return item.pinned;
    if (activeTab !== 'ALL') return item.type === activeTab;

    return true;
  });

  // Sort: Pinned first, then by date descending
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  // Helpers
  const getTypeBadge = (type) => {
    switch (type) {
      case 'RELEASE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700/50">
            <GitCommit size={12} />
            RELEASE DE SISTEMA
          </span>
        );
      case 'FEATURE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700/50">
            <Sparkles size={12} />
            NOVA FEATURE
          </span>
        );
      case 'MEHORIA':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50">
            <CheckCircle2 size={12} />
            MELHORIA DE ESCOPO
          </span>
        );
      case 'BUGFIX':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50">
            <AlertCircle size={12} />
            CORREÇÃO / AJUSTE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700/50">
            <Megaphone size={12} />
            COMUNICADO OFICIAL
          </span>
        );
    }
  };

  const formatDateStr = (dateIso) => {
    try {
      return format(new Date(dateIso), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch {
      return 'Data recente';
    }
  };

  // Handlers
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Preencha o título e o conteúdo detalhado.');
      return;
    }

    const mustHave = formData.mustHaveText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const newItem = {
      title: formData.title.trim(),
      version: formData.version.trim() || 'v2.5.0',
      type: formData.type,
      pinned: formData.pinned,
      author: currentUser?.name || 'Administrador',
      authorRole: currentUser?.role || 'ADMIN',
      mustHave,
      content: formData.content.trim()
    };

    dispatch(addNewsItem(newItem));
    toast.success('Novidade publicada com sucesso!');
    setIsAddModalOpen(false);
    setFormData({
      title: '',
      version: 'v2.5.0',
      type: 'COMUNICADO',
      pinned: false,
      mustHaveText: '',
      content: ''
    });
  };

  const handleOpenEditModal = (item) => {
    setEditFormData({
      id: item.id,
      title: item.title,
      version: item.version || '',
      type: item.type || 'COMUNICADO',
      pinned: item.pinned || false,
      mustHaveText: Array.isArray(item.mustHave) ? item.mustHave.join('\n') : '',
      content: item.content || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editFormData.title.trim() || !editFormData.content.trim()) {
      toast.error('Preencha o título e o conteúdo detalhado.');
      return;
    }

    const mustHave = editFormData.mustHaveText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    dispatch(updateNewsItem({
      ...editFormData,
      title: editFormData.title.trim(),
      version: editFormData.version.trim(),
      mustHave,
      content: editFormData.content.trim()
    }));

    toast.success('Publicação atualizada com sucesso!');
    setIsEditModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (!itemToDelete) return;
    dispatch(deleteNewsItem(itemToDelete.id));
    toast.success('Publicação removida com sucesso.');
    setItemToDelete(null);
  };

  const handleTogglePin = (item) => {
    dispatch(togglePinNews(item.id));
    toast.success(item.pinned ? 'Publicação desfixada' : 'Publicação fixada no topo!');
  };

  const handleMarkAsRead = (item) => {
    if (currentUser?.id) {
      dispatch(markNewsAsRead({ newsId: item.id, userId: currentUser.id }));
      toast.success('Marcado como lido.');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-2xl shadow-lg shadow-blue-500/20">
            <Sparkles size={28} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">
                Novidades & Updates do Sistema
              </h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500 text-white animate-pulse">
                  {unreadCount} não {unreadCount === 1 ? 'lida' : 'lidas'}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
              Comunicados oficiais, notas de versão e histórico automático de melhorias da plataforma.
            </p>
          </div>
        </div>

        {/* Admin Create Action Button */}
        {isManagerOrAdmin && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/25 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={16} />
            <span>Publicar Nova Novidade</span>
          </button>
        )}
      </div>

      {/* Metric Cards Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Updates */}
        <div className="p-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Total de Publicações</span>
            <p className="text-2xl font-black text-gray-900 dark:text-white">{totalNews}</p>
            <span className="text-[11px] text-gray-400">Updates cadastrados</span>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <Megaphone size={22} />
          </div>
        </div>

        {/* Releases & Features */}
        <div className="p-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Releases de Sistema</span>
            <p className="text-2xl font-black text-purple-600 dark:text-purple-400">{releasesCount}</p>
            <span className="text-[11px] text-gray-400">Novos recursos lançados</span>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
            <GitCommit size={22} />
          </div>
        </div>

        {/* Destaques Fixados */}
        <div className="p-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">Destaques no Topo</span>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{pinnedNews}</p>
            <span className="text-[11px] text-gray-400">Avisos de alta prioridade</span>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
            <Pin size={22} />
          </div>
        </div>

        {/* Unread Items */}
        <div className="p-5 bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/30 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Pendentes de Leitura</span>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{unreadCount}</p>
            <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 font-medium">Novidades não lidas por você</span>
          </div>
          <div className="p-3 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <Bell size={22} className={unreadCount > 0 ? "animate-bounce" : ""} />
          </div>
        </div>

      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-zinc-900 p-4 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por título, versão, palavra-chave ou autor..."
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

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'ALL', label: `Todos os Updates (${totalNews})` },
            { id: 'PINNED', label: `📌 Destaques (${pinnedNews})` },
            { id: 'COMUNICADO', label: '📢 Comunicados' },
            { id: 'RELEASE', label: '⚡ Releases' },
            { id: 'FEATURE', label: '✨ Features' },
            { id: 'MEHORIA', label: '🛠️ Melhorias' },
            { id: 'BUGFIX', label: '🐛 Fixes' },
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

      {/* News Items Feed */}
      <div className="space-y-6">
        {sortedItems.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl space-y-3 shadow-sm">
            <Sparkles size={40} className="mx-auto text-gray-300 dark:text-zinc-700" />
            <h3 className="text-sm font-bold text-gray-700 dark:text-zinc-300">Nenhuma novidade encontrada</h3>
            <p className="text-xs text-gray-400">Tente ajustar a sua busca ou os filtros aplicados acima.</p>
          </div>
        ) : (
          sortedItems.map((item) => {
            const isRead = item.readBy && currentUser?.id && item.readBy.includes(currentUser.id);
            return (
              <div
                key={item.id}
                className={`bg-white dark:bg-zinc-900 border rounded-2xl p-6 shadow-sm hover:shadow-md transition relative flex flex-col space-y-4 ${
                  item.pinned 
                    ? 'border-amber-400/80 ring-1 ring-amber-400/30 bg-amber-500/[0.02] dark:bg-amber-500/[0.01]' 
                    : 'border-gray-200 dark:border-zinc-800'
                }`}
              >
                {/* Card Top Row: Badges, Date & Admin Actions */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    
                    {/* Pinned Badge */}
                    {item.pinned && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50">
                        <Pin size={12} className="rotate-45" />
                        DESTAQUE FIXADO
                      </span>
                    )}

                    {/* Type Badge */}
                    {getTypeBadge(item.type)}

                    {/* Version Badge */}
                    {item.version && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-300 dark:border-zinc-700">
                        <Tag size={11} />
                        {item.version}
                      </span>
                    )}

                    {/* Unread Indicator */}
                    {!isRead && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        NOVO
                      </span>
                    )}

                  </div>

                  {/* Right Side: Admin Actions & Date */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-medium hidden sm:inline flex items-center gap-1">
                      <Calendar size={13} />
                      {formatDateStr(item.date)}
                    </span>

                    {/* Admin Actions Dropdown / Buttons */}
                    {isManagerOrAdmin && (
                      <div className="flex items-center gap-1 pl-2 border-l border-gray-200 dark:border-zinc-800">
                        {/* Toggle Pin */}
                        <button
                          onClick={() => handleTogglePin(item)}
                          className={`p-1.5 rounded-lg transition ${
                            item.pinned 
                              ? 'text-amber-600 bg-amber-50 dark:bg-amber-950/40' 
                              : 'text-gray-400 hover:text-amber-600 hover:bg-gray-100 dark:hover:bg-zinc-800'
                          }`}
                          title={item.pinned ? 'Desfixar do topo' : 'Fixar no topo'}
                        >
                          {item.pinned ? <PinOff size={15} /> : <Pin size={15} />}
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition"
                          title="Editar publicação"
                        >
                          <Pencil size={15} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setItemToDelete(item)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
                          title="Excluir publicação"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
                  {item.title}
                </h2>

                {/* Must Have / Key Scope Highlights Box (Design inspirado no gestao-melhorias-cs) */}
                {Array.isArray(item.mustHave) && item.mustHave.length > 0 && (
                  <div className="p-4 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 text-xs font-extrabold uppercase tracking-wider">
                      <ListChecks size={15} />
                      <span>Escopo Mínimo Indispensável ("Must Have" & Destaques):</span>
                    </div>
                    <ul className="space-y-1.5 pl-1 text-xs text-gray-700 dark:text-zinc-300 font-medium">
                      {item.mustHave.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ChevronRight size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Content / Main Description */}
                <div className="text-xs leading-relaxed text-gray-600 dark:text-zinc-300 whitespace-pre-line bg-gray-50/60 dark:bg-zinc-800/40 p-4 rounded-xl border border-gray-100 dark:border-zinc-800 font-medium">
                  {item.content}
                </div>

                {/* Card Footer: Author & Read Button */}
                <div className="pt-3 border-t border-gray-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                  
                  {/* Author Info */}
                  <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-400">
                    <div className="size-6 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-[10px]">
                      {item.author ? item.author.slice(0, 2).toUpperCase() : 'AD'}
                    </div>
                    <span className="font-semibold text-gray-700 dark:text-zinc-300">{item.author || 'Administrador'}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-gray-500 font-bold uppercase">
                      {item.authorRole || 'ADMIN'}
                    </span>
                  </div>

                  {/* Mark as read button */}
                  {!isRead ? (
                    <button
                      onClick={() => handleMarkAsRead(item)}
                      className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800/50 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 size={13} />
                      <span>Marcar como lida</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-gray-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 size={13} className="text-emerald-500" />
                      Lido
                    </span>
                  )}

                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Modal: Publicar Nova Novidade */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Megaphone size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">Publicar Nova Novidade</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Divulgue novos recursos, comunicados ou notas de release.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              
              {/* Título */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700 dark:text-zinc-300">Título da Publicação *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Lançamento do Módulo de Aprovações Rápidas"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Versão e Tipo */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-zinc-300">Tipo de Publicação *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  >
                    <option value="COMUNICADO">📢 Comunicado Oficial</option>
                    <option value="RELEASE">⚡ Release de Sistema</option>
                    <option value="FEATURE">✨ Nova Feature</option>
                    <option value="MEHORIA">🛠️ Melhoria de Escopo</option>
                    <option value="BUGFIX">🐛 Correção / Ajuste</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-zinc-300">Versão / Tag (opcional)</label>
                  <input
                    type="text"
                    placeholder="Ex: v2.5.0"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Must Have / Destaques (Linha a linha) */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700 dark:text-zinc-300">
                  Escopo Mínimo Indispensável ("Must Have" - 1 item por linha)
                </label>
                <textarea
                  rows={3}
                  placeholder="Digitar cada destaque em uma nova linha...&#10;Ex: Novo exportador em PDF&#10;Trava de aprovação automática"
                  value={formData.mustHaveText}
                  onChange={(e) => setFormData({ ...formData, mustHaveText: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Descrição Detalhada */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700 dark:text-zinc-300">Conteúdo Detalhado *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Escreva a descrição completa do comunicado ou release..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Fixar no Topo Checkbox */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-200 dark:border-zinc-700/80">
                <div>
                  <span className="font-bold text-gray-800 dark:text-zinc-200">Fixar no Topo</span>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400">Destacar esta novidade com selo de prioridade no topo do feed</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.pinned}
                  onChange={(e) => setFormData({ ...formData, pinned: e.target.checked })}
                  className="size-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              {/* Buttons */}
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
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold transition shadow-md shadow-blue-500/20"
                >
                  Publicar Novidade
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Modal: Editar Novidade Existente */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <Pencil size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-base">Editar Publicação</h3>
                  <p className="text-xs text-gray-500 dark:text-zinc-400">Atualize título, versão, escopo e conteúdo.</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              
              {/* Título */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700 dark:text-zinc-300">Título da Publicação *</label>
                <input
                  type="text"
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Versão e Tipo */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-zinc-300">Tipo de Publicação *</label>
                  <select
                    value={editFormData.type}
                    onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  >
                    <option value="COMUNICADO">📢 Comunicado Oficial</option>
                    <option value="RELEASE">⚡ Release de Sistema</option>
                    <option value="FEATURE">✨ Nova Feature</option>
                    <option value="MEHORIA">🛠️ Melhoria de Escopo</option>
                    <option value="BUGFIX">🐛 Correção / Ajuste</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-zinc-300">Versão / Tag</label>
                  <input
                    type="text"
                    value={editFormData.version}
                    onChange={(e) => setEditFormData({ ...editFormData, version: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Must Have / Destaques */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700 dark:text-zinc-300">
                  Escopo Mínimo Indispensável ("Must Have" - 1 item por linha)
                </label>
                <textarea
                  rows={3}
                  value={editFormData.mustHaveText}
                  onChange={(e) => setEditFormData({ ...editFormData, mustHaveText: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Descrição Detalhada */}
              <div className="space-y-1">
                <label className="font-bold text-gray-700 dark:text-zinc-300">Conteúdo Detalhado *</label>
                <textarea
                  rows={4}
                  required
                  value={editFormData.content}
                  onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Fixar no Topo Checkbox */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-200 dark:border-zinc-700/80">
                <div>
                  <span className="font-bold text-gray-800 dark:text-zinc-200">Fixar no Topo</span>
                  <p className="text-[11px] text-gray-500 dark:text-zinc-400">Destacar esta novidade no topo do feed</p>
                </div>
                <input
                  type="checkbox"
                  checked={editFormData.pinned}
                  onChange={(e) => setEditFormData({ ...editFormData, pinned: e.target.checked })}
                  className="size-4 text-blue-600 rounded focus:ring-blue-500"
                />
              </div>

              {/* Buttons */}
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
      {itemToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
            <div className="size-14 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Trash2 size={26} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">Excluir Publicação?</h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                Tem certeza que deseja remover <strong>"{itemToDelete.title}"</strong>? Esta ação não poderá ser desfeita.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
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

export default NewsPage;
