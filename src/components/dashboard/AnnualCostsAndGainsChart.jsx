import React from 'react';
import { useSelector } from 'react-redux';
import { DollarSign, TrendingUp, Wallet, ArrowUpRight } from 'lucide-react';

const AnnualCostsAndGainsChart = () => {
  const { groups } = useSelector(state => state.projects);
  const allProjects = groups.flatMap(g => g.projects || []);

  const totalCapex = allProjects.reduce((acc, p) => acc + (p.capex || 0), 0);
  const totalOpex = allProjects.reduce((acc, p) => acc + (p.opex || 0), 0);
  const totalCosts = totalCapex + totalOpex;
  const totalGains = allProjects.reduce((acc, p) => acc + (p.realizedGain || 0), 0);

  const netBalance = totalGains - totalCosts;
  const roiPct = totalCosts > 0 ? ((netBalance / totalCosts) * 100).toFixed(0) : '0';

  // Quarterly estimates breakdown
  const quarters = [
    { name: 'Q1 (Jan-Mar)', costPct: 20, gainPct: 15 },
    { name: 'Q2 (Abr-Jun)', costPct: 35, gainPct: 30 },
    { name: 'Q3 (Jul-Set)', costPct: 25, gainPct: 35 },
    { name: 'Q4 (Out-Dez)', costPct: 20, gainPct: 20 },
  ];

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <DollarSign size={18} className="text-emerald-500" />
            Custos Totais vs. Ganhos Reais do Ano (2026)
          </h3>
          <p className="text-xs text-gray-500">Balanço financeiro consolidado (Capex/Opex) e retorno sobre investimento</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-extrabold rounded-lg text-xs flex items-center gap-1">
            <ArrowUpRight size={14} /> ROI Portfólio: +{roiPct}%
          </span>
        </div>
      </div>

      {/* Main Financial KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1">
            <Wallet size={12} /> Custos Totais do Ano
          </span>
          <div className="text-lg font-black text-rose-700 dark:text-rose-300">
            R$ {(totalCosts / 1000).toFixed(0)}k
          </div>
          <p className="text-[10px] text-gray-500">
            Capex: R$ {(totalCapex / 1000).toFixed(0)}k | Opex: R$ {(totalOpex / 1000).toFixed(0)}k
          </p>
        </div>

        <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <TrendingUp size={12} /> Ganhos Reais do Ano
          </span>
          <div className="text-lg font-black text-emerald-700 dark:text-emerald-300">
            R$ {(totalGains / 1000).toFixed(0)}k
          </div>
          <p className="text-[10px] text-gray-500">Retorno de eficiência e novas receitas</p>
        </div>

        <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-xl space-y-1">
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Resultado Líquido do Portfólio
          </span>
          <div className={`text-lg font-black ${netBalance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
            {netBalance >= 0 ? '+' : ''} R$ {(netBalance / 1000).toFixed(0)}k
          </div>
          <p className="text-[10px] text-gray-500">Superávit econômico estimado</p>
        </div>
      </div>

      {/* Quarterly Trend Bars Comparison */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Evolução Trimestral (Custos vs. Ganhos)</h4>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {quarters.map((q, idx) => {
            const qCost = (totalCosts * (q.costPct / 100)) / 1000;
            const qGain = (totalGains * (q.gainPct / 100)) / 1000;

            return (
              <div key={idx} className="p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-100 dark:border-zinc-800 space-y-2 text-xs">
                <div className="font-bold text-gray-900 dark:text-white text-[11px]">{q.name}</div>
                
                <div className="space-y-1.5">
                  <div>
                    <div className="flex justify-between text-[10px] font-semibold text-gray-500 mb-0.5">
                      <span>Custo</span>
                      <span className="text-rose-600 font-bold">R$ {qCost.toFixed(0)}k</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full" style={{ width: `${q.costPct}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-semibold text-gray-500 mb-0.5">
                      <span>Ganho Real</span>
                      <span className="text-emerald-600 font-bold">R$ {qGain.toFixed(0)}k</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${q.gainPct}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default AnnualCostsAndGainsChart;
