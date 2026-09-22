import React from 'react';
import { useSelector } from 'react-redux';
import { X, Printer, Download, CheckCircle, ShieldAlert } from 'lucide-react';
import { calculateProjectHealthScore } from '../../utils/healthScore';

const PortfolioExportModal = ({ isOpen, onClose }) => {
    const { groups } = useSelector(state => state.projects);
    const filters = useSelector(state => state.dashboardFilter);

    if (!isOpen) return null;

    const allProjects = groups.flatMap(g => g.projects);

    const filteredProjects = allProjects.filter(p => {
        if (filters.area && p.area !== filters.area) return false;
        if (filters.analyst && p.responsible !== filters.analyst) return false;
        if (filters.phase && p.phase !== filters.phase) return false;
        return true;
    });

    const totalCapex = filteredProjects.reduce((acc, p) => acc + (p.capex || 0), 0);
    const totalOpex = filteredProjects.reduce((acc, p) => acc + (p.opex || 0), 0);
    const totalGains = filteredProjects.reduce((acc, p) => acc + (p.realizedGain || 0), 0);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-6 relative no-scrollbar">
                
                {/* Header Actions */}
                <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 print:hidden">
                    <div className="flex items-center gap-2">
                        <div className="p-2.5 bg-blue-100 dark:bg-blue-950/60 text-blue-600 rounded-xl">
                            <Printer size={22} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Exportação Executiva do Portfólio (PDF)</h2>
                            <p className="text-xs text-zinc-500">Relatório consolidado para Reunião de Comitê de Portfólio</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                        >
                            <Download size={14} /> Imprimir / Salvar PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-white rounded-xl transition"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Print Content Area */}
                <div id="portfolio-pdf-content" className="space-y-6 text-zinc-900 dark:text-zinc-100 p-2 print:p-0">
                    
                    {/* Cover Banner */}
                    <div className="p-6 bg-gradient-to-br from-zinc-900 to-blue-950 text-white rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-400">HUB DE PROJETOS V2 • RELATÓRIO DE PORTFÓLIO</span>
                            <span className="text-xs text-zinc-400 font-mono">{new Date().toLocaleDateString('pt-BR')}</span>
                        </div>
                        <h1 className="text-2xl font-black">Consolidado Executivo de Portfólio</h1>
                        <p className="text-xs text-zinc-300 max-w-2xl leading-relaxed">
                            Resumo de status operacional, indicadores financeiros orçados vs. realizados e matriz de Health Score dos projetos ativos da organização.
                        </p>
                    </div>

                    {/* High Level Metrics */}
                    <div className="grid grid-cols-4 gap-4">
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 rounded-xl text-center">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">Total de Projetos</span>
                            <p className="text-xl font-black text-blue-600">{filteredProjects.length}</p>
                        </div>
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 rounded-xl text-center">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">Capex Total</span>
                            <p className="text-xl font-black text-zinc-800 dark:text-zinc-100">R$ {(totalCapex / 1000).toFixed(0)}k</p>
                        </div>
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 rounded-xl text-center">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">Opex Total</span>
                            <p className="text-xl font-black text-zinc-800 dark:text-zinc-100">R$ {(totalOpex / 1000).toFixed(0)}k</p>
                        </div>
                        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 rounded-xl text-center">
                            <span className="text-[10px] font-bold text-zinc-400 uppercase">Ganhos Reais</span>
                            <p className="text-xl font-black text-emerald-600">R$ {(totalGains / 1000).toFixed(0)}k</p>
                        </div>
                    </div>

                    {/* Table of All Projects */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">Matriz de Projetos & Health Score</h3>
                        <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-xl">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-zinc-100 dark:bg-zinc-800/80 text-zinc-500 uppercase text-[10px] font-bold">
                                    <tr>
                                        <th className="p-3">Projeto</th>
                                        <th className="p-3">Área</th>
                                        <th className="p-3">Responsável</th>
                                        <th className="p-3">Progresso</th>
                                        <th className="p-3">Go Live</th>
                                        <th className="p-3 text-center">Health Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                    {filteredProjects.map(p => {
                                        const health = calculateProjectHealthScore(p);
                                        return (
                                            <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                                                <td className="p-3 font-bold text-zinc-900 dark:text-zinc-100">{p.title}</td>
                                                <td className="p-3 text-zinc-600 dark:text-zinc-400">{p.area}</td>
                                                <td className="p-3 text-zinc-600 dark:text-zinc-400">{p.responsible}</td>
                                                <td className="p-3 font-semibold text-blue-600">{p.progress?.toFixed(0)}%</td>
                                                <td className="p-3 text-zinc-600 dark:text-zinc-400">{p.goLiveDate || p.estimatedEnd}</td>
                                                <td className="p-3 text-center">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-black border ${health.badgeClass}`}>
                                                        {health.label}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortfolioExportModal;
