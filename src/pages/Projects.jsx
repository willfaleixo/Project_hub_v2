import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, FolderKanban, Calendar, User, ArrowRight, AlertTriangle } from 'lucide-react';
import { selectProject } from '../features/projectSlice';

const Projects = ({ onOpenWizard }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { groups } = useSelector(state => state.projects);
  const { translations: t } = useSelector(state => state.language);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');

  const allProjects = groups.flatMap(g => g.projects);

  const filteredProjects = allProjects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.responsible.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.groupName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesArea = selectedArea === 'all' || p.area === selectedArea;
    return matchesSearch && matchesArea;
  });

  const handleOpenProject = (id) => {
    dispatch(selectProject(id));
    navigate(`/projects/${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <FolderKanban size={24} className="text-blue-600" />
            {t.projects}
          </h1>
          <p className="text-xs text-gray-500">Gerenciamento de portfólio de projetos por cards e filtros</p>
        </div>

        <button
          onClick={onOpenWizard}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md"
        >
          <Plus size={16} />
          {t.newProject}
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar projetos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-xs dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="px-3 py-1.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-xs dark:text-white font-medium"
          >
            <option value="all">Todas as Áreas</option>
            <option value="Corporate">Corporate</option>
            <option value="Ecomm">Ecomm</option>
            <option value="Lentes">Lentes</option>
            <option value="Frames">Frames</option>
            <option value="LatAm">LatAm</option>
            <option value="Lab">Lab</option>
            <option value="CTI">CTI</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            onClick={() => handleOpenProject(p.id)}
            className="p-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                  {p.groupName}
                </span>
                <span className="text-[11px] font-semibold text-gray-500">{p.area}</span>
              </div>

              <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                {p.title}
              </h3>

              <p className="text-xs text-gray-500 line-clamp-2">{p.summary}</p>
            </div>

            <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-zinc-800/80">
              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-zinc-400">
                <div className="flex items-center gap-1">
                  <User size={14} className="text-gray-400" />
                  <span className="font-semibold">{p.responsible}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar size={14} className="text-gray-400" />
                  <span>{p.estimatedEnd}</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-700 dark:text-zinc-300 mb-1">
                  <span>Progresso</span>
                  <span>{p.progress?.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.max(p.progress, 5)}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                <span>Ver Detalhes do Projeto</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
