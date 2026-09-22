import React from 'react';
import { useSelector } from 'react-redux';
import { UserCheck } from 'lucide-react';

const AnalystOverview = () => {
  const { groups } = useSelector(state => state.projects);
  const { translations: t } = useSelector(state => state.language);

  const allProjects = groups.flatMap(g => g.projects);

  const analystMap = {};
  allProjects.forEach(p => {
    const resp = p.responsible || 'Sem Atribuição';
    if (!analystMap[resp]) {
      analystMap[resp] = { name: resp, total: 0, completed: 0, capex: 0 };
    }
    analystMap[resp].total += 1;
    if (p.status === 'Concluído' || p.progress >= 90) analystMap[resp].completed += 1;
    analystMap[resp].capex += p.capex || 0;
  });

  const analysts = Object.values(analystMap);

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <UserCheck size={18} className="text-blue-500" />
          {t.analystOverview}
        </h3>
        <span className="text-xs text-gray-400">{analysts.length} Gerentes de Projeto</span>
      </div>

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {analysts.map((a, idx) => (
          <div key={idx} className="p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="size-7 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center text-[11px]">
                {a.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white">{a.name}</h4>
                <span className="text-[10px] text-gray-500">{a.total} Projeto(s) Sob Gestão</span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-bold text-gray-900 dark:text-white">R$ {(a.capex / 1000).toFixed(0)}k</span>
              <div className="text-[10px] text-emerald-600 font-semibold">{a.completed} Concluído(s)</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalystOverview;
