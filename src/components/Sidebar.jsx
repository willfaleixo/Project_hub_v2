import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  LayoutDashboard, 
  FolderKanban, 
  GitMerge, 
  CheckSquare, 
  BookOpen, 
  X,
  Users,
  Sparkles
} from 'lucide-react';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen, onOpenWizard }) => {
  const { translations: t } = useSelector(state => state.language);
  const { user } = useSelector(state => state.auth);
  const { items: newsItems } = useSelector(state => state.news || { items: [] });

  const isManagerOrAdmin = user?.role === 'ADMIN' || user?.role === 'GESTOR';
  const unreadNewsCount = (newsItems || []).filter(n => !n.readBy || !n.readBy.includes(user?.id)).length;

  const menuItems = [
    { path: '/', label: t.dashboard, icon: LayoutDashboard },
    { path: '/projects', label: t.projects, icon: FolderKanban },
    { path: '/expanded-view', label: t.expandedView, icon: GitMerge },
    { path: '/approvals', label: t.approvals, icon: CheckSquare },
    { path: '/wiki', label: t.wiki, icon: BookOpen },
    { path: '/news', label: 'Novidades & Updates', icon: Sparkles, badge: unreadNewsCount },
    ...(isManagerOrAdmin ? [{ path: '/users', label: t.users || 'Usuários', icon: Users }] : []),
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 sm:hidden backdrop-blur-sm"
        />
      )}

      <aside
        className={`fixed sm:static top-0 left-0 h-full w-64 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex flex-col z-40 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Hub de Projetos Logo" className="w-8 h-8 rounded-xl object-cover shadow-sm" />
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-base leading-tight">
                {t.appTitle}
              </h1>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold tracking-wide uppercase">
                Enterprise Hub
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="sm:hidden p-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <div className="px-3 py-1 text-[10px] font-bold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
            Navegação Principal
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-700 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800/60 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer / Quick Action */}
        <div className="p-4 border-t border-gray-200 dark:border-zinc-800">
          <button
            onClick={onOpenWizard}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
          >
            <span>+ {t.newProject}</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
