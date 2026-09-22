import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowRight, ShieldAlert } from 'lucide-react';
import { calculateProjectHealthScore } from '../../utils/healthScore';

const AttentionProjectsWidget = () => {
    const navigate = useNavigate();
    const { groups } = useSelector(state => state.projects);
    const filters = useSelector(state => state.dashboardFilter);

    const allProjects = groups.flatMap(g => g.projects);

    // Filter by global dashboard filter if any
    const filteredProjects = allProjects.filter(p => {
        if (filters.area && p.area !== filters.area) return false;
        if (filters.analyst && p.responsible !== filters.analyst) return false;
        if (filters.phase && p.phase !== filters.phase) return false;
        return true;
    });

    // Evaluate health score for each project
    const projectsWithHealth = filteredProjects.map(p => ({
        project: p,
        health: calculateProjectHealthScore(p)
    })).filter(item => item.health.status === 'red' || item.health.status === 'yellow');

    // Sort by severity (red first, then yellow)
    projectsWithHealth.sort((a, b) => {
        if (a.health.status === 'red' && b.health.status !== 'red') return -1;
        if (a.health.status !== 'red' && b.health.status === 'red') return 1;
        return 0;
    });

    return (
        <div className="bg-white dark:bg-zinc-950 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber-100 dark:bg-amber-950/50 text-amber-600 rounded-xl">
                        <AlertTriangle size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">Projetos em Atenção</h3>
                        <p className="text-xs text-zinc-500">Projetos com alertas de prazo, custo ou riscos críticos</p>
                    </div>
                </div>
                <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-bold rounded-lg text-xs">
                    {projectsWithHealth.length} Requerem Apoio
                </span>
            </div>

            <div className="space-y-3 max-h-[350px] overflow-y-auto no-scrollbar">
                {projectsWithHealth.length === 0 ? (
                    <div className="p-8 text-center text-xs text-zinc-400 italic">
                        ✅ Todos os projetos filtrados estão com Health Score verde (Saudáveis).
                    </div>
                ) : (
                    projectsWithHealth.map(({ project, health }) => (
                        <div
                            key={project.id}
                            onClick={() => navigate(`/projects/${project.id}`)}
                            className="p-3.5 bg-zinc-50 dark:bg-zinc-900/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl transition cursor-pointer flex items-center justify-between gap-3 group"
                        >
                            <div className="space-y-1 flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className={`w-2.5 h-2.5 rounded-full ${health.status === 'red' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
                                    <h4 className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-blue-600 transition-colors">
                                        {project.title}
                                    </h4>
                                </div>
                                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 line-clamp-1">
                                    Motivo: <strong className={health.status === 'red' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}>{health.reason}</strong>
                                </p>
                            </div>

                            <div className="flex items-center gap-2 whitespace-nowrap">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black border ${health.badgeClass}`}>
                                    {health.label}
                                </span>
                                <ArrowRight size={14} className="text-zinc-400 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AttentionProjectsWidget;
