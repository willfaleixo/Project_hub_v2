import React from 'react';
import { useSelector } from 'react-redux';
import { Calendar, Flag } from 'lucide-react';

const AnnualRoadmap = () => {
  const { groups } = useSelector(state => state.projects);
  const { translations: t } = useSelector(state => state.language);

  const allProjects = groups.flatMap(g => g.projects);
  const quarters = ['Q1 (Jan-Mar)', 'Q2 (Abr-Jun)', 'Q3 (Jul-Set)', 'Q4 (Out-Dez)'];

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm col-span-1 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Calendar size={18} className="text-purple-500" />
          {t.annualRoadmap}
        </h3>
        <span className="text-xs text-gray-400">Visão Estratégica 2026</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {quarters.map((q, idx) => (
          <div key={idx} className="p-3 bg-gray-50 dark:bg-zinc-800/40 rounded-xl border border-gray-100 dark:border-zinc-800">
            <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>{q}</span>
              <Flag size={12} />
            </div>
            <div className="space-y-2">
              {allProjects.slice(idx * 2, idx * 2 + 2).map(p => (
                <div key={p.id} className="p-2 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-gray-200/60 dark:border-zinc-700/60 text-xs">
                  <div className="font-bold text-gray-800 dark:text-zinc-200 truncate">{p.title}</div>
                  <div className="flex items-center justify-between text-[10px] text-gray-500 mt-1">
                    <span>{p.responsible}</span>
                    <span className="font-semibold text-emerald-600">{p.estimatedEnd}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnualRoadmap;
