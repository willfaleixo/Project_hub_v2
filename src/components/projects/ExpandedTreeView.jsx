import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  MinusSquare, 
  PlusSquare, 
  MessageSquare, 
  FileText, 
  Printer, 
  Download, 
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FolderKanban,
  RotateCcw,
  Filter
} from 'lucide-react';
import { selectProject } from '../../features/projectSlice';

const ExpandedTreeView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { groups } = useSelector(state => state.projects);
  const { translations: t } = useSelector(state => state.language);

  // Filters state
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('all');
  const [selectedAnalystFilter, setSelectedAnalystFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  // Expanded state for groups
  const [collapsedGroups, setCollapsedGroups] = useState({});

  // Extract unique options for filter dropdowns
  const allProjects = groups.flatMap(g => g.projects || []);
  const projectOptions = Array.from(new Set(allProjects.map(p => p.title).filter(Boolean)));
  
  // Extract all individual analyst names (handling comma-separated lists like "Claudia, Bruno")
  const analystOptions = Array.from(new Set(
    allProjects.flatMap(p => p.responsible ? p.responsible.split(',').map(s => s.trim()) : []).filter(Boolean)
  ));
  
  const statusOptions = Array.from(new Set(allProjects.map(p => p.status).filter(Boolean)));

  const isFiltered = selectedProjectFilter !== 'all' || selectedAnalystFilter !== 'all' || selectedStatusFilter !== 'all';

  const resetFilters = () => {
    setSelectedProjectFilter('all');
    setSelectedAnalystFilter('all');
    setSelectedStatusFilter('all');
  };

  const toggleGroup = (groupId) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Proposto':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">Proposto</span>;
      case 'Em andamento':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Em andamento</span>;
      case 'Pendente':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">Pendente</span>;
      case 'Pendente Cliente':
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">Pendente Cliente</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-300">{status}</span>;
    }
  };

  const renderDeadlineIcon = (alert) => {
    if (alert === 'green') return <span className="inline-block size-3.5 rounded-full bg-emerald-500 shadow-sm" title="No prazo" />;
    if (alert === 'yellow') return <span className="inline-flex items-center justify-center p-0.5 bg-amber-500 text-white rounded text-[10px]" title="Alerta de Prazo"><AlertTriangle size={12} /></span>;
    return <span className="inline-block size-3.5 rounded-sm bg-red-500 shadow-sm" title="Atrasado" />;
  };

  const renderEffortIcon = (alert) => {
    if (alert === 'green') return <span className="inline-block size-3.5 rounded-full bg-emerald-500 shadow-sm" />;
    if (alert === 'yellow') return <span className="inline-flex items-center justify-center p-0.5 bg-amber-500 text-white rounded text-[10px]"><AlertTriangle size={12} /></span>;
    return <span className="inline-block size-3.5 rounded-sm bg-red-500 shadow-sm" />;
  };

  const handleRowClick = (projId) => {
    dispatch(selectProject(projId));
    navigate(`/projects/${projId}`);
  };

  // Calculate total matching projects across all groups
  const totalMatchingProjects = groups.reduce((acc, g) => {
    const matching = (g.projects || []).filter(p => {
      const matchP = selectedProjectFilter === 'all' || p.title === selectedProjectFilter;
      const matchA = selectedAnalystFilter === 'all' || (p.responsible && p.responsible.toLowerCase().includes(selectedAnalystFilter.toLowerCase()));
      const matchS = selectedStatusFilter === 'all' || p.status === selectedStatusFilter;
      return matchP && matchA && matchS;
    });
    return acc + matching.length;
  }, 0);

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
      
      {/* Table Header Controls & Interactive Filters */}
      <div className="px-4 py-3 bg-gray-50/80 dark:bg-zinc-800/50 border-b border-gray-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        
        {/* Active Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Project Filter */}
          <div className="relative">
            <select
              value={selectedProjectFilter}
              onChange={(e) => setSelectedProjectFilter(e.target.value)}
              className="pl-3 pr-8 py-1.5 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-xs font-semibold text-gray-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm cursor-pointer"
            >
              <option value="all">📂 Todos os Projetos</option>
              {projectOptions.map((p, i) => (
                <option key={i} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Analyst / Responsible Filter */}
          <div className="relative">
            <select
              value={selectedAnalystFilter}
              onChange={(e) => setSelectedAnalystFilter(e.target.value)}
              className="pl-3 pr-8 py-1.5 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-xs font-semibold text-gray-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm cursor-pointer"
            >
              <option value="all">👤 Todos os Responsáveis</option>
              {analystOptions.map((a, i) => (
                <option key={i} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="pl-3 pr-8 py-1.5 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-xs font-semibold text-gray-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm cursor-pointer"
            >
              <option value="all">📋 Todas as Situações</option>
              {statusOptions.map((s, i) => (
                <option key={i} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Reset Filters Button */}
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm"
            >
              <RotateCcw size={13} />
              Limpar Filtros
            </button>
          )}
        </div>

        {/* Export & Print Controls */}
        <div className="flex items-center gap-1.5">
          <button 
            title={t.export} 
            onClick={() => window.print()}
            className="p-1.5 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-600 dark:text-zinc-300 hover:bg-gray-50 shadow-sm"
          >
            <FileText size={16} />
          </button>
          <button 
            title={t.print} 
            onClick={() => window.print()}
            className="p-1.5 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-gray-600 dark:text-zinc-300 hover:bg-gray-50 shadow-sm"
          >
            <Printer size={16} />
          </button>
        </div>
      </div>

      {/* Tree Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-gray-100/70 dark:bg-zinc-800/80 border-b border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300 font-bold uppercase text-[11px] tracking-wider">
              <th className="py-2.5 px-3 w-10 text-center">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="py-2.5 px-4">Título</th>
              <th className="py-2.5 px-4 w-36">{t.status}</th>
              <th className="py-2.5 px-4 w-32">{t.responsible}</th>
              <th className="py-2.5 px-3 w-20 text-center">{t.dueDate}</th>
              <th className="py-2.5 px-4 w-44">{t.completion}</th>
              <th className="py-2.5 px-3 w-20 text-center">{t.effort}</th>
              <th className="py-2.5 px-4 w-28 text-center">{t.estimatedEnd}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
            {totalMatchingProjects === 0 && isFiltered ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-xs text-gray-400">
                  <p className="font-semibold text-gray-600 dark:text-zinc-300 mb-2">Nenhum projeto encontrado para os filtros selecionados.</p>
                  <button
                    onClick={resetFilters}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                  >
                    Restaurar Filtros
                  </button>
                </td>
              </tr>
            ) : (
              groups.map((group) => {
                const isCollapsed = collapsedGroups[group.id];
                const groupProjects = group.projects || [];
                
                // Filter projects in this group
                const filteredProjects = groupProjects.filter(p => {
                  const matchP = selectedProjectFilter === 'all' || p.title === selectedProjectFilter;
                  const matchA = selectedAnalystFilter === 'all' || (p.responsible && p.responsible.toLowerCase().includes(selectedAnalystFilter.toLowerCase()));
                  const matchS = selectedStatusFilter === 'all' || p.status === selectedStatusFilter;
                  return matchP && matchA && matchS;
                });

                // Hide group if no project matches current filters
                if (filteredProjects.length === 0 && isFiltered) {
                  return null;
                }

                // Average progress of filtered projects in group
                const groupAvgProgress = filteredProjects.length > 0 
                  ? filteredProjects.reduce((acc, curr) => acc + (curr.progress || 0), 0) / filteredProjects.length 
                  : group.progress;

                return (
                  <React.Fragment key={group.id}>
                    {/* Group Header Row (Blue Highlight matching screenshot) */}
                    <tr className="bg-sky-200/70 dark:bg-sky-950/40 font-semibold text-gray-900 dark:text-white border-y border-sky-300 dark:border-sky-800">
                      <td className="py-2 px-3 text-center">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="py-2 px-4 flex items-center gap-2">
                        <button 
                          onClick={() => toggleGroup(group.id)} 
                          className="text-blue-700 dark:text-blue-300 hover:scale-110 transition"
                        >
                          {isCollapsed ? <PlusSquare size={16} /> : <MinusSquare size={16} />}
                        </button>
                        <span className="font-bold text-sm text-blue-900 dark:text-blue-200">{group.title}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                          {filteredProjects.length} {filteredProjects.length === 1 ? 'projeto' : 'projetos'}
                        </span>
                      </td>
                      <td className="py-2 px-4" />
                      <td className="py-2 px-4" />
                      <td className="py-2 px-3 text-center">
                        {renderDeadlineIcon(group.deadlineAlert)}
                      </td>
                      <td className="py-2 px-4 font-bold text-blue-900 dark:text-blue-300 text-xs">
                        {groupAvgProgress.toFixed(2)}%
                      </td>
                      <td className="py-2 px-3 text-center">
                        {renderEffortIcon(group.effortAlert)}
                      </td>
                      <td className="py-2 px-4" />
                    </tr>

                    {/* Group Children Rows */}
                    {!isCollapsed && filteredProjects.map((proj) => (
                      <tr 
                        key={proj.id}
                        onClick={() => handleRowClick(proj.id)}
                        className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition cursor-pointer group"
                      >
                        {/* Checkbox & Comments */}
                        <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            <input type="checkbox" className="rounded border-gray-300" />
                            <div className="relative text-gray-400 group-hover:text-blue-500 transition">
                              <MessageSquare size={14} />
                              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-bold size-3 rounded-full flex items-center justify-center">
                                {proj.openPoints ? proj.openPoints.length : 1}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Title Indented */}
                        <td className="py-2.5 px-4 pl-10 font-medium text-gray-800 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                          {proj.title}
                        </td>

                        {/* Status */}
                        <td className="py-2.5 px-4">
                          {getStatusBadge(proj.status)}
                        </td>

                        {/* Responsible */}
                        <td className="py-2.5 px-4 text-gray-700 dark:text-zinc-300 font-medium">
                          {proj.responsible}
                        </td>

                        {/* Deadline Alert Icon */}
                        <td className="py-2.5 px-3 text-center">
                          {renderDeadlineIcon(proj.deadlineAlert)}
                        </td>

                        {/* Completion Progress Bar */}
                        <td className="py-2.5 px-4">
                          <div className="w-full bg-gray-200 dark:bg-zinc-800 rounded-full h-4 relative overflow-hidden border border-gray-300/40 dark:border-zinc-700">
                            <div 
                              className={`h-full transition-all duration-500 ${
                                proj.progress >= 80 ? 'bg-emerald-500' : proj.progress >= 40 ? 'bg-amber-500' : 'bg-orange-400'
                              }`}
                              style={{ width: `${Math.max(proj.progress, 5)}%` }}
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-800 dark:text-zinc-200 drop-shadow-sm">
                              {proj.progress.toFixed(2)}%
                            </span>
                          </div>
                        </td>

                        {/* Effort Indicator */}
                        <td className="py-2.5 px-3 text-center">
                          {renderEffortIcon(proj.effortAlert)}
                        </td>

                        {/* Estimated End Date */}
                        <td className="py-2.5 px-4 text-center font-medium text-gray-600 dark:text-zinc-400">
                          {proj.estimatedEnd}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpandedTreeView;
