import React from 'react';
import { Calendar, CheckCircle2, Link2, CheckSquare } from 'lucide-react';

const ProjectGantt = ({ project }) => {
  const phases = [
    { name: '1. Iniciação & Charter', start: 'Mês 1', duration: '20%', status: 'Completed', color: 'bg-emerald-500' },
    { name: '2. Requisitos & Arquitetura SI', start: 'Mês 2', duration: '35%', status: 'In Progress', color: 'bg-blue-500' },
    { name: '3. Desenvolvimento & Integração', start: 'Mês 3', duration: '50%', status: 'Planned', color: 'bg-purple-500' },
    { name: '4. Homologação & QA', start: 'Mês 4', duration: '30%', status: 'Planned', color: 'bg-amber-500' },
    { name: '5. Go-Live & Transição', start: 'Mês 5', duration: '15%', status: 'Planned', color: 'bg-indigo-500' },
  ];

  const tasks = project.tasks || [];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar size={18} className="text-purple-500" />
            Cronograma Gantt do Projeto
          </h3>
          <p className="text-xs text-gray-500">Marcos, fases estratégicas e dependências de entregáveis</p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-full">
          Fase Atual: {project.phase || 'Planejamento'}
        </span>
      </div>

      {/* Strategic Macro Phases */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fases Estratégicas</h4>
        {phases.map((phase, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-800 dark:text-zinc-200">
              <span>{phase.name}</span>
              <span className="text-[11px] text-gray-400">{phase.start}</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-zinc-800 rounded-full h-3 overflow-hidden">
              <div
                className={`h-full ${phase.color} rounded-full transition-all duration-500`}
                style={{ width: phase.duration }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Task Dependencies Section */}
      {tasks.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
            <span>Rede de Dependências de Tarefas ({tasks.length})</span>
          </h4>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {tasks.map((task) => {
              const depTasks = (task.dependsOn || []).map(id => tasks.find(t => t.id === id)).filter(Boolean);
              
              return (
                <div key={task.id} className="p-2.5 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-200/60 dark:border-zinc-700/60 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckSquare size={14} className={task.completed ? "text-emerald-500" : "text-gray-400"} />
                    <span className={`font-bold ${task.completed ? "line-through text-gray-400" : "text-gray-900 dark:text-white"}`}>
                      {task.title}
                    </span>
                  </div>

                  {depTasks.length > 0 ? (
                    <div className="flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-lg border border-blue-200/60 dark:border-blue-800">
                      <Link2 size={12} />
                      <span>Depende de: {depTasks.map(d => d.title).join(', ')}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-400 italic">Sem dependência</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectGantt;
