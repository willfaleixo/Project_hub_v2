import React from 'react';
import { useSelector } from 'react-redux';
import { FolderKanban, DollarSign, TrendingUp, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const MetricCards = () => {
  const { groups } = useSelector(state => state.projects);
  const { translations: t } = useSelector(state => state.language);

  const allProjects = groups.flatMap(g => g.projects);
  const totalCount = allProjects.length;

  const totalCapex = allProjects.reduce((acc, p) => acc + (p.capex || 0), 0);
  const totalOpex = allProjects.reduce((acc, p) => acc + (p.opex || 0), 0);
  const totalGains = allProjects.reduce((acc, p) => acc + (p.realizedGain || 0), 0);

  const inProgress = allProjects.filter(p => p.status === 'Em andamento').length;
  const pending = allProjects.filter(p => p.status === 'Pendente' || p.status === 'Pendente Cliente').length;
  const completed = allProjects.filter(p => p.status === 'Concluído').length;

  const cards = [
    {
      title: t.totalProjects,
      value: totalCount,
      subText: `${inProgress} em andamento, ${pending} pendentes`,
      icon: FolderKanban,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      title: t.annualCapex,
      value: `R$ ${(totalCapex / 1000).toFixed(0)}k`,
      subText: `Opex: R$ ${(totalOpex / 1000).toFixed(0)}k/ano`,
      icon: DollarSign,
      color: 'from-purple-600 to-pink-600'
    },
    {
      title: t.realizedGains,
      value: `R$ ${(totalGains / 1000).toFixed(0)}k`,
      subText: `ROI Estimado: +${((totalGains / (totalCapex || 1)) * 100).toFixed(0)}%`,
      icon: TrendingUp,
      color: 'from-emerald-600 to-teal-600'
    },
    {
      title: 'Desempenho Geral',
      value: `${completed} / ${totalCount}`,
      subText: `Taxa de Sucesso: ${((completed / (totalCount || 1)) * 100).toFixed(0)}%`,
      icon: CheckCircle,
      color: 'from-amber-500 to-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm flex items-center justify-between group hover:shadow-md transition duration-200"
          >
            <div>
              <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
                {card.title}
              </span>
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">
                {card.value}
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 font-medium">
                {card.subText}
              </p>
            </div>
            <div className={`p-3.5 rounded-xl bg-gradient-to-tr ${card.color} text-white shadow-lg shadow-blue-500/10 group-hover:scale-110 transition duration-200`}>
              <Icon size={22} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MetricCards;
