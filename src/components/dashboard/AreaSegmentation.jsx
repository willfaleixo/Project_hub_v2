import React from 'react';
import { useSelector } from 'react-redux';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const AreaSegmentation = () => {
  const { groups } = useSelector(state => state.projects);
  const { translations: t } = useSelector(state => state.language);
  const filters = useSelector(state => state.dashboardFilter);

  const allProjects = groups.flatMap(g => g.projects);

  const filteredProjects = allProjects.filter(p => {
    if (filters.area && p.area !== filters.area) return false;
    if (filters.analyst && p.responsible !== filters.analyst) return false;
    if (filters.phase && p.phase !== filters.phase) return false;
    return true;
  });

  const areaFinancials = {};
  filteredProjects.forEach(p => {
    const area = p.area || 'Outros';
    if (!areaFinancials[area]) {
      areaFinancials[area] = { count: 0, planned: 0, realized: 0 };
    }
    areaFinancials[area].count += 1;
    // Planned budget = capex + opex
    const plannedBudget = (p.capex || 0) + (p.opex || 0);
    // Realized investment / gains
    const realizedBudget = p.plannedCapex ? (p.plannedCapex + p.plannedOpex) : (plannedBudget * 0.95);
    areaFinancials[area].planned += plannedBudget;
    areaFinancials[area].realized += (p.realizedGain || plannedBudget);
  });

  const data = Object.keys(areaFinancials).map(area => {
    const item = areaFinancials[area];
    const diff = item.planned > 0 ? ((item.realized - item.planned) / item.planned) * 100 : 0;
    return {
      name: area,
      Projetos: item.count,
      Orçado: Math.round(item.planned / 1000),
      Realizado: Math.round(item.realized / 1000),
      diffPercent: Math.round(diff)
    };
  });

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <DollarSign size={18} className="text-blue-500" />
            {t.areaSegmentation || 'Orçado vs Realizado por Área'}
          </h3>
          <p className="text-xs text-zinc-500">Comparativo financeiro de investimentos e retornos por departamento</p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} unit="k" />
            <Tooltip
              formatter={(value, name) => [`R$ ${value}k`, name]}
              contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
            <Bar dataKey="Orçado" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Realizado" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Variation Badges per Area */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        {data.map(item => (
          <div key={item.name} className="p-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl text-xs flex items-center justify-between">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300 truncate max-w-[80px]">{item.name}</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-0.5 ${
              item.diffPercent >= 0 ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
            }`}>
              {item.diffPercent >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {item.diffPercent >= 0 ? `+${item.diffPercent}%` : `${item.diffPercent}%`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AreaSegmentation;
