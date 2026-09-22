import React, { useState } from 'react';
import { SearchIcon, PanelLeft, MoonIcon, SunIcon, Bell, Globe, Check, Plus, User, ShieldCheck, FolderKanban, CheckSquare, Sparkles, Camera, LogOut, UserCheck, Sun, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../features/themeSlice';
import { setLanguage } from '../features/languageSlice';
import { markAsRead, markAllAsRead, removeNotification } from '../features/notificationSlice';
import { switchRoleUser, logout } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import MyDayView from './dashboard/MyDayView';

const Navbar = ({ setIsSidebarOpen, onOpenWizard }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useSelector(state => state.theme);
  const { currentLanguage, translations: t } = useSelector(state => state.language);
  const { items: notifications } = useSelector(state => state.notifications);
  const { groups } = useSelector(state => state.projects);
  const { user, availableUsers } = useSelector(state => state.auth);

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMyDayOpen, setIsMyDayOpen] = useState(false);

  const allProjects = groups.flatMap(g => g.projects);
  const userProjectsCount = allProjects.length;
  const userPendingTasksCount = allProjects.reduce((acc, p) => acc + (p.tasks ? p.tasks.filter(tk => !tk.completed).length : 0), 0);
  const unreadCount = notifications.filter(n => !n.read).length;

  const languages = [
    { code: 'pt', label: 'Português (BR)', flag: '🇧🇷' },
    { code: 'en', label: 'English (US)', flag: '🇺🇸' },
    { code: 'es', label: 'Español (ES)', flag: '🇪🇸' }
  ];

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300">ADMIN</span>;
      case 'GESTOR':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">GESTOR</span>;
      case 'ANALISTA':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300">ANALISTA</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300">VIEWER</span>;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-4 sm:px-6 xl:px-12 py-3 flex-shrink-0 z-20 sticky top-0 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto gap-4">
        
        {/* Left Section */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button 
            onClick={() => setIsSidebarOpen((prev) => !prev)} 
            className="sm:hidden p-2 rounded-lg text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <PanelLeft size={20} />
          </button>

          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-400 size-4" />
            <input
              type="text"
              placeholder={t.search}
              className="pl-9 pr-4 py-1.5 w-full bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Meu Dia Quick View Button */}
          <button
            onClick={() => setIsMyDayOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-lg text-xs font-extrabold transition shadow-sm"
            title="Meu Dia (Tarefas e Pendências Agregadas)"
          >
            <Sun size={15} />
            <span className="hidden md:inline">Meu Dia</span>
          </button>

          {/* New Project Button (Disabled for VIEWER) */}
          {onOpenWizard && (
            <button
              onClick={user?.role === 'VIEWER' ? null : onOpenWizard}
              disabled={user?.role === 'VIEWER'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition shadow-sm ${
                user?.role === 'VIEWER' 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-600' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Plus size={16} />
              <span className="hidden sm:inline">{t.newProject}</span>
            </button>
          )}

          {/* Language Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setIsLangOpen(!isLangOpen); setIsNotifOpen(false); setIsUserMenuOpen(false); }}
              className="flex items-center gap-1.5 p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 hover:bg-gray-200 dark:hover:bg-zinc-700 text-xs font-semibold transition"
              title={t.language}
            >
              <Globe size={16} className="text-blue-500" />
              <span className="uppercase font-bold">{currentLanguage}</span>
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  {t.language}
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      dispatch(setLanguage(lang.code));
                      setIsLangOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition hover:bg-gray-100 dark:hover:bg-zinc-800 ${
                      currentLanguage === lang.code ? 'font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20' : 'text-gray-700 dark:text-zinc-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{lang.flag}</span>
                      {lang.label}
                    </span>
                    {currentLanguage === lang.code && <Check size={14} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Center Popover */}
          <div className="relative">
            <button
              onClick={() => { setIsNotifOpen(!isNotifOpen); setIsLangOpen(false); setIsUserMenuOpen(false); }}
              className="relative p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
              title={t.notifications}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold size-4 rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-blue-500" />
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t.notifications}</h4>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={() => dispatch(markAllAsRead())}
                      className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      Marcar todas lidas
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-zinc-800">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-gray-400">Nenhuma notificação recebida.</div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => dispatch(markAsRead(notif.id))}
                        className={`p-3 text-xs flex items-start justify-between gap-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition cursor-pointer ${
                          !notif.read ? 'bg-blue-50/40 dark:bg-blue-950/20 font-semibold' : 'opacity-75'
                        }`}
                      >
                        <div className="flex-1 space-y-0.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-900 dark:text-white">{notif.title}</span>
                            <span className="text-[10px] text-gray-400">{notif.timestamp || 'Agora'}</span>
                          </div>
                          <p className="text-gray-500 dark:text-zinc-400 text-[11px] leading-relaxed">{notif.message}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(removeNotification(notif.id));
                          }}
                          className="text-gray-400 hover:text-red-500 p-1"
                          title="Excluir notificação"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
          >
            {theme === 'light' ? <MoonIcon size={18} /> : <SunIcon size={18} className="text-yellow-400" />}
          </button>

          {/* User Profile Tooltip & Popover */}
          <div className="relative pl-2 border-l border-gray-200 dark:border-zinc-800">
            <button
              onClick={() => { setIsUserMenuOpen(!isUserMenuOpen); setIsLangOpen(false); setIsNotifOpen(false); }}
              className={`size-8 rounded-full bg-gradient-to-tr ${user?.avatarGradient || 'from-blue-600 to-indigo-600'} text-white text-xs font-bold flex items-center justify-center shadow-md hover:scale-105 transition cursor-pointer ring-2 ring-blue-500/30`}
              title="Perfil & Alternar Função"
            >
              {user?.initials || 'AL'}
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-4">
                
                {/* User Info Header */}
                <div className="flex items-center gap-3 border-b border-gray-100 dark:border-zinc-800 pb-3">
                  <div className={`size-11 rounded-full bg-gradient-to-tr ${user?.avatarGradient || 'from-blue-600 to-indigo-600'} text-white font-bold flex items-center justify-center text-sm shadow-md`}>
                    {user?.initials || 'AL'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">{user?.name}</h4>
                      {getRoleBadge(user?.role)}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-zinc-400">{user?.area}</p>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">{user?.email}</span>
                  </div>
                </div>

                {/* Quick Info Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-100 dark:border-zinc-800">
                    <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold mb-0.5">
                      <FolderKanban size={14} />
                      <span>{userProjectsCount} Projetos</span>
                    </div>
                    <span className="text-[10px] text-gray-500">Sob sua gestão ativa</span>
                  </div>

                  <div className="p-2.5 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-100 dark:border-zinc-800">
                    <div className="flex items-center gap-1.5 text-amber-500 font-bold mb-0.5">
                      <CheckSquare size={14} />
                      <span>{userPendingTasksCount} Pendências</span>
                    </div>
                    <span className="text-[10px] text-gray-500">Tarefas no radar</span>
                  </div>
                </div>

                {/* Switch Account / Role Quick Selector */}
                <div className="space-y-2 border-t border-gray-100 dark:border-zinc-800 pt-3">
                  <span className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                    <UserCheck size={12} /> Alternar Conta / Perfil
                  </span>
                  <div className="space-y-1">
                    {availableUsers.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => {
                          dispatch(switchRoleUser(u.id));
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-xs text-left transition ${
                          user?.id === u.id ? 'bg-blue-50 dark:bg-blue-900/30 font-bold text-blue-600 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-300'
                        }`}
                      >
                        <span className="truncate">{u.name}</span>
                        {getRoleBadge(u.role)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Logout Button */}
                <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                  <button
                    onClick={handleLogout}
                    className="w-full py-1.5 px-3 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <LogOut size={14} /> Encerrar Sessão
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>

      <MyDayView isOpen={isMyDayOpen} onClose={() => setIsMyDayOpen(false)} />
    </div>
  );
};

export default Navbar;
