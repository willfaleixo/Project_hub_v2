import { useEffect, useState } from "react";
import { GitCommit, MessageSquare, Clock, Bug, Zap, Square, X, ExternalLink, User, Calendar, Tag, Info } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const typeIcons = {
    BUG: { icon: Bug, color: "text-red-500 dark:text-red-400" },
    FEATURE: { icon: Zap, color: "text-blue-500 dark:text-blue-400" },
    TASK: { icon: Square, color: "text-green-500 dark:text-green-400" },
    IMPROVEMENT: { icon: MessageSquare, color: "text-amber-500 dark:text-amber-400" },
    OTHER: { icon: GitCommit, color: "text-purple-500 dark:text-purple-400" },
};

const statusColors = {
    TODO: "bg-zinc-200 text-zinc-800 dark:bg-zinc-600 dark:text-zinc-200",
    IN_PROGRESS: "bg-amber-200 text-amber-800 dark:bg-amber-500 dark:text-amber-900",
    DONE: "bg-emerald-200 text-emerald-800 dark:bg-emerald-500 dark:text-emerald-900",
};

const statusLabels = {
    TODO: "A Fazer",
    IN_PROGRESS: "Em Andamento",
    DONE: "Concluído",
};

const typeLabels = {
    BUG: "Bug",
    FEATURE: "Funcionalidade",
    TASK: "Tarefa",
    IMPROVEMENT: "Melhoria",
    OTHER: "Outro",
};

const parseSafeDate = (dateVal) => {
    if (!dateVal) return new Date();
    if (dateVal instanceof Date && !isNaN(dateVal.getTime())) return dateVal;
    
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) return d;
    
    if (typeof dateVal === 'string') {
        const parts = dateVal.trim().split(' ');
        const dateParts = parts[0].split('/');
        if (dateParts.length === 3) {
            const day = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10) - 1;
            const year = parseInt(dateParts[2], 10);
            let hours = 0, minutes = 0;
            if (parts[1]) {
                const timeParts = parts[1].split(':');
                hours = parseInt(timeParts[0], 10) || 0;
                minutes = parseInt(timeParts[1], 10) || 0;
            }
            const parsed = new Date(year, month, day, hours, minutes);
            if (!isNaN(parsed.getTime())) return parsed;
        }
    }
    return new Date();
};

const formatDateSafe = (dateVal, formatStr = "dd/MM/yyyy 'às' HH:mm") => {
    try {
        const d = parseSafeDate(dateVal);
        return format(d, formatStr, { locale: ptBR });
    } catch (e) {
        return String(dateVal || "");
    }
};

const RecentActivity = () => {
    const navigate = useNavigate();
    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);
    const { currentWorkspace } = useSelector((state) => state.workspace);
    const { groups } = useSelector((state) => state.projects);

    const getActivitiesFromWorkspaceAndProjects = () => {
        const list = [];

        // 1. Gather tasks from current workspace
        if (currentWorkspace?.projects) {
            currentWorkspace.projects.forEach((proj) => {
                if (proj.tasks) {
                    proj.tasks.forEach((task) => {
                        list.push({
                            id: `task_${task.id}`,
                            taskId: task.id,
                            projectId: task.projectId || proj.id,
                            projectName: proj.name || proj.title || "Projeto",
                            title: task.title,
                            type: task.type || "TASK",
                            status: task.status || "TODO",
                            priority: task.priority || "MEDIUM",
                            assignee: task.assignee || { name: task.responsible || "Analista" },
                            date: task.updatedAt || task.due_date || new Date(),
                            description: task.description || `Tarefa "${task.title}" atualizada pelo responsável.`,
                            category: "tarefa"
                        });
                    });
                }
            });
        }

        // 2. Gather change logs from Redux projects slice
        if (groups) {
            groups.flatMap(g => g.projects).forEach((proj) => {
                if (proj.changeMatrix) {
                    proj.changeMatrix.forEach((log) => {
                        list.push({
                            id: `log_${log.id}`,
                            projectId: proj.id,
                            projectName: proj.title || proj.name || "Projeto",
                            title: `${log.field || 'Alteração'}: ${log.description || 'Modificação cadastrada'}`,
                            type: "OTHER",
                            status: "DONE",
                            priority: "MEDIUM",
                            assignee: { name: log.author || log.user || "Sistema" },
                            date: log.date || new Date(),
                            description: log.description || `Modificação realizada no campo ${log.field}. De: "${log.oldValue || '-'}" para: "${log.newValue || '-'}"`,
                            oldValue: log.oldValue,
                            newValue: log.newValue,
                            field: log.field,
                            category: "historico"
                        });
                    });
                }
            });
        }

        // Sort by date descending safely
        list.sort((a, b) => parseSafeDate(b.date) - parseSafeDate(a.date));
        setActivities(list);
    };

    useEffect(() => {
        getActivitiesFromWorkspaceAndProjects();
    }, [currentWorkspace, groups]);

    return (
        <div className="bg-white dark:bg-zinc-950 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-lg transition-all overflow-hidden">
            <div className="border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">Atividades Recentes</h2>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">Clique em qualquer item para ver o detalhamento completo</p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                    {activities.length} Interativas
                </span>
            </div>

            <div className="p-0">
                {activities.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-zinc-200 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                            <Clock className="w-8 h-8 text-zinc-600 dark:text-zinc-500" />
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400">Nenhuma atividade recente</p>
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-200 dark:divide-zinc-800 max-h-[500px] overflow-y-auto no-scrollbar">
                        {activities.map((act) => {
                            const TypeIcon = typeIcons[act.type]?.icon || Square;
                            const iconColor = typeIcons[act.type]?.color || "text-gray-500 dark:text-gray-400";

                            return (
                                <div
                                    key={act.id}
                                    onClick={() => setSelectedActivity(act)}
                                    className="p-5 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors cursor-pointer group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="p-2.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl group-hover:scale-105 transition-transform">
                                            <TypeIcon className={`w-4 h-4 ${iconColor}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-1.5">
                                                <div>
                                                    <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                                                        {act.projectName}
                                                    </span>
                                                    <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-blue-600 transition-colors">
                                                        {act.title}
                                                    </h4>
                                                </div>
                                                <span className={`ml-2 px-2 py-0.5 rounded text-[11px] font-bold ${statusColors[act.status] || "bg-zinc-300 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"}`}>
                                                    {statusLabels[act.status] || act.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                                                <span>{typeLabels[act.type] || act.type}</span>
                                                {act.assignee && (
                                                    <div className="flex items-center gap-1">
                                                        <div className="w-4 h-4 bg-zinc-300 dark:bg-zinc-700 rounded-full flex items-center justify-center text-[10px] font-bold text-zinc-800 dark:text-zinc-200">
                                                            {act.assignee.name ? act.assignee.name[0].toUpperCase() : "U"}
                                                        </div>
                                                        <span className="truncate max-w-[100px]">{act.assignee.name}</span>
                                                    </div>
                                                )}
                                                <span className="ml-auto font-mono text-[11px]">
                                                    {formatDateSafe(act.date)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Interactive Activity Detail Modal */}
            {selectedActivity && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
                        <button
                            onClick={() => setSelectedActivity(null)}
                            className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-white rounded-lg transition"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 dark:bg-blue-950/50 text-blue-600 rounded-xl">
                                <Info size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                                    Detalhamento da Atividade
                                </h3>
                                <p className="text-xs text-zinc-500">Histórico de ações e alterações registradas</p>
                            </div>
                        </div>

                        <div className="space-y-3 border-y border-zinc-100 dark:border-zinc-800 py-4 text-xs">
                            <div>
                                <span className="text-zinc-400 uppercase font-bold text-[10px] block mb-0.5">Título / Ação</span>
                                <p className="text-sm font-bold text-zinc-800 dark:text-zinc-100">{selectedActivity.title}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <span className="text-zinc-400 uppercase font-bold text-[10px] block mb-0.5 flex items-center gap-1">
                                        <Tag size={12} /> Projeto Relacionado
                                    </span>
                                    <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedActivity.projectName}</span>
                                </div>
                                <div>
                                    <span className="text-zinc-400 uppercase font-bold text-[10px] block mb-0.5 flex items-center gap-1">
                                        <User size={12} /> Responsável
                                    </span>
                                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">{selectedActivity.assignee?.name || "Sistema"}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <span className="text-zinc-400 uppercase font-bold text-[10px] block mb-0.5 flex items-center gap-1">
                                        <Calendar size={12} /> Horário Registrado
                                    </span>
                                    <span className="font-mono text-zinc-700 dark:text-zinc-300">
                                        {formatDateSafe(selectedActivity.date)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-zinc-400 uppercase font-bold text-[10px] block mb-0.5">Status & Categoria</span>
                                    <span className={`px-2 py-0.5 rounded font-bold ${statusColors[selectedActivity.status] || "bg-zinc-200 text-zinc-800"}`}>
                                        {statusLabels[selectedActivity.status] || selectedActivity.status}
                                    </span>
                                </div>
                            </div>

                            {selectedActivity.oldValue !== undefined && selectedActivity.newValue !== undefined && (
                                <div className="p-3 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl space-y-1.5 border border-zinc-200 dark:border-zinc-700/50">
                                    <span className="font-bold text-zinc-800 dark:text-zinc-200 text-[11px] block">Detalhamento dos Valores Alterados:</span>
                                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                                        <div>
                                            <span className="text-red-500 font-bold block text-[10px]">DE (ANTERIOR):</span>
                                            <span className="font-mono text-zinc-600 dark:text-zinc-400">{selectedActivity.oldValue || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-emerald-500 font-bold block text-[10px]">PARA (NOVO):</span>
                                            <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">{selectedActivity.newValue || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <span className="text-zinc-400 uppercase font-bold text-[10px] block mb-0.5">Descrição do Registro</span>
                                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                    {selectedActivity.description}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                onClick={() => setSelectedActivity(null)}
                                className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
                            >
                                Fechar
                            </button>
                            <button
                                onClick={() => {
                                    const projId = selectedActivity.projectId;
                                    setSelectedActivity(null);
                                    if (selectedActivity.taskId) {
                                        navigate(`/projects/${projId}?tab=tasks`);
                                    } else {
                                        navigate(`/projects/${projId}?tab=history`);
                                    }
                                }}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                            >
                                <span>Acessar no Projeto</span>
                                <ExternalLink size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecentActivity;
