import React from 'react';
import { useSelector } from 'react-redux';
import { PieChart, CheckCircle2, Clock, AlertTriangle, PlayCircle, FileText, Ban } from 'lucide-react';

const ProjectStatusChart = () => {
  const { groups } = useSelector(state => state.projects);
  const allProjects = groups.flatMap(g => g.projects || []);

  // Status mapping
  const statusConfig = {
    'Em Andamento': { color: 'bg-blue-500 text-blue-500', barColor: 'bg-blue-500', icon: PlayCircle },
    'Concluído': { color: 'bg-emerald-500 text-emerald-500', barColor: 'bg-emerald-500', icon: CheckCircle2 },
    'Em Aprovação': { color: 'bg-amber-500 text-amber-500', barColor: 'bg-amber-500', icon: Clock },
    'Proposto': { color: 'bg-purple-500 text-purple-500', barColor: 'bg-purple-500', icon: FileText },
    'Em Risco': { color: 'bg-rose-600 text-rose-600', barColor: 'bg-rose-600', icon: AlertTriangle },
    'Suspenso': { color: 'bg-gray-400 text-gray-400', barColor: 'bg-gray-400', icon: Ban },
  };

  const statusCounts = {};
  Object.keys(statusConfig).forEach(st => { statusCounts[st] = 0; });

  allProjects.forEach(p => {
    const st = p.status || 'Proposto';
    if (statusCounts[st] !== undefined) {
      statusCounts[st] += 1;
    } else {
      statusCounts['Proposto'] += 1;
    }
  });

  const total = allProjects.length || 1;

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <PieChart size={18} className="text-purple-500" />
            Distribuição de Projetos por Status
          </h3>
          <p className="text-xs text-gray-500">Visão percentual e quantitativa por fase do ciclo de vida</p>
        </div>
        <span className="px-2.5 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 font-extrabold rounded-lg text-xs">
          {allProjects.length} Projetos Totais
        </span>
      </div>

      {/* Visual Multi-Segment Bar */}
      <div className="w-full bg-gray-100 dark:bg-zinc-800 h-3.5 rounded-full overflow-hidden flex shadow-inner">
        {Object.entries(statusConfig).map(([st, cfg]) => {
          const count = statusCounts[st] || 0;
          const pct = (count / total) * 100;
          if (pct === 0) return null;

          return (
            <div
              key={st}
              style={{ width: `${pct}%` }}
              className={`h-full ${cfg.barColor} transition-all duration-500 hover:brightness-110`}
              title={`${st}: ${count} (${pct.toFixed(0)}%)`}
            />
          );
        })}
      </div>

      {/* Grid of Status Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
        {Object.entries(statusConfig).map(([st, cfg]) => {
          const count = statusCounts[st] || 0;
          const pct = ((count / total) * 100).toFixed(0);
          const Icon = cfg.icon;

          return (
            <div
              key={st}
              className="p-2.5 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-100 dark:border-zinc-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2">
                <Icon size={14} className={cfg.color.split(' ')[1]} />
                <span className="font-bold text-gray-800 dark:text-zinc-200 text-[11px]">{st}</span>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-gray-900 dark:text-white">{count}</span>
                <span className="text-[10px] text-gray-400 block font-semibold">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectStatusChart;
