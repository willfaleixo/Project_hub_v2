import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Filter, RotateCcw } from 'lucide-react';
import { setDashboardFilter, resetDashboardFilters } from '../../features/dashboardFilterSlice';

const GlobalDashboardFilter = () => {
    const dispatch = useDispatch();
    const filters = useSelector(state => state.dashboardFilter);
    const { groups } = useSelector(state => state.projects);

    const allProjects = groups.flatMap(g => g.projects);

    const areaList = Array.from(new Set(allProjects.map(p => p.area).filter(Boolean)));
    const analystList = Array.from(new Set(allProjects.map(p => p.responsible).filter(Boolean)));
    const phaseList = Array.from(new Set(allProjects.map(p => p.phase).filter(Boolean)));

    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch(setDashboardFilter({ name, value }));
    };

    const hasActiveFilter = filters.area || filters.analyst || filters.phase || filters.period;

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold text-sm whitespace-nowrap">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/60 text-blue-600 rounded-xl">
                    <Filter size={18} />
                </div>
                <span>Filtro Global do Portfólio:</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                {/* Area Filter */}
                <select
                    name="area"
                    value={filters.area}
                    onChange={handleChange}
                    className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                    <option value="">Todas as Áreas</option>
                    {areaList.map(a => <option key={a} value={a}>{a}</option>)}
                </select>

                {/* Analyst Filter */}
                <select
                    name="analyst"
                    value={filters.analyst}
                    onChange={handleChange}
                    className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                    <option value="">Todos os Responsáveis</option>
                    {analystList.map(a => <option key={a} value={a}>{a}</option>)}
                </select>

                {/* Phase Filter */}
                <select
                    name="phase"
                    value={filters.phase}
                    onChange={handleChange}
                    className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                    <option value="">Todas as Fases</option>
                    {phaseList.map(p => <option key={p} value={p}>{p}</option>)}
                </select>

                {/* Reset Filters */}
                {hasActiveFilter && (
                    <button
                        onClick={() => dispatch(resetDashboardFilters())}
                        className="flex items-center gap-1.5 px-3 py-2 bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 rounded-xl text-xs font-bold hover:bg-purple-200 transition"
                        title="Limpar todos os filtros selecionados"
                    >
                        <RotateCcw size={14} /> Redefinir
                    </button>
                )}
            </div>
        </div>
    );
};

export default GlobalDashboardFilter;
