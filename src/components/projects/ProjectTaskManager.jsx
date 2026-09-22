import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, CheckSquare, Square, AlertCircle, Clock, Calendar, User, Bell, AlertOctagon, Link2 } from 'lucide-react';
import { addTaskToProject, toggleTaskCompleted } from '../../features/projectSlice';
import { addNotification } from '../../features/notificationSlice';
import { hasCircularDependency, getDependencyStatus } from '../../utils/taskDependencies';
import EscalateModal from './EscalateModal';

const ProjectTaskManager = ({ project }) => {
  const dispatch = useDispatch();
  const { translations: t } = useSelector(state => state.language);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [assignee, setAssignee] = useState(project.responsible || '');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [selectedDependencies, setSelectedDependencies] = useState([]);
  const [dependencyError, setDependencyError] = useState('');
  const [isAddingCustomAssignee, setIsAddingCustomAssignee] = useState(false);
  const [customAssigneeInput, setCustomAssigneeInput] = useState('');
  const [escalatingTask, setEscalatingTask] = useState(null);

  const systemAnalysts = ['Claudia', 'Bruno', 'Pedro', 'Daniela', 'Julia', 'Alex Low', 'Visitante'];

  const currentAssignees = assignee
    ? assignee.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const handleAddAssignee = (nameToAdd) => {
    if (!nameToAdd || currentAssignees.includes(nameToAdd)) return;
    const updated = [...currentAssignees, nameToAdd];
    setAssignee(updated.join(', '));
  };

  const handleRemoveAssignee = (nameToRemove) => {
    const updated = currentAssignees.filter(a => a !== nameToRemove);
    setAssignee(updated.join(', '));
  };

  const handleConfirmCustomAssignee = () => {
    if (customAssigneeInput.trim()) {
      handleAddAssignee(customAssigneeInput.trim());
      setCustomAssigneeInput('');
      setIsAddingCustomAssignee(false);
    }
  };

  const tasks = project.tasks || [];

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskTitle) return;

    const newTask = {
      id: 'task_' + Date.now(),
      title: taskTitle,
      assignee: assignee || 'Analista',
      priority,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      dependsOn: selectedDependencies
    };

    dispatch(addTaskToProject({
      projectId: project.id,
      task: newTask
    }));

    dispatch(addNotification({
      title: 'Nova Tarefa Criada',
      message: `Tarefa "${taskTitle}" atribuída a ${assignee} no projeto ${project.title}.`,
      type: 'task'
    }));

    setTaskTitle('');
    setSelectedDependencies([]);
    setDependencyError('');
    setIsModalOpen(false);
  };

  const handleToggle = (taskId, title) => {
    dispatch(toggleTaskCompleted({
      projectId: project.id,
      taskId
    }));
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'Urgent':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 uppercase">Urgente</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 uppercase">Alta</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 uppercase">Média</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-gray-300 uppercase">Baixa</span>;
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Header & Add Action */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <CheckSquare size={18} className="text-blue-500" />
            {t.tasksTab}
          </h3>
          <p className="text-xs text-gray-500">Cadastre e acompanhe entregas, responsáveis e prazos</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
        >
          <Plus size={14} />
          {t.addTask}
        </button>
      </div>

      {/* Task List */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        {tasks.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">
            Nenhuma tarefa cadastrada para este projeto. Clique em "+ Nova Tarefa" para adicionar.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-zinc-800">
            {tasks.map((task) => {
              const depStatus = getDependencyStatus(task, tasks);
              const isBlocked = !depStatus.canStart;

              return (
                <div
                  key={task.id}
                  className={`p-3.5 flex items-center justify-between gap-3 text-xs transition ${
                    task.completed ? 'bg-gray-50/50 dark:bg-zinc-800/20 opacity-75' : 'hover:bg-gray-50 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => handleToggle(task.id, task.title)}
                      className="text-blue-600 dark:text-blue-400 hover:scale-110 transition"
                    >
                      {task.completed ? <CheckSquare size={18} className="text-emerald-500" /> : <Square size={18} className="text-gray-400" />}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold text-gray-900 dark:text-white truncate ${task.completed ? 'line-through text-gray-400' : ''}`}>
                          {task.title}
                        </span>
                        {isBlocked && !task.completed && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                            <Link2 size={11} className="text-amber-600 dark:text-amber-400" />
                            Bloqueado por {depStatus.pendingDependencies.length} antecessora(s)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {task.isEscalated ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 font-extrabold border border-rose-300 dark:border-rose-800 flex items-center gap-1 shadow-sm">
                        <AlertOctagon size={11} className="text-rose-600 dark:text-rose-400" />
                        ESCALADO AO GESTOR
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEscalatingTask(task)}
                        className="px-2 py-0.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-bold rounded text-[10px] border border-rose-200 dark:border-rose-800 transition flex items-center gap-1 shadow-sm"
                      >
                        <AlertOctagon size={11} />
                        Escalar BO
                      </button>
                    )}
                    {getPriorityBadge(task.priority)}
                    <div className="flex items-center gap-1 text-gray-500 text-[11px]">
                      <User size={12} />
                      <span>{task.assignee}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 text-[11px]">
                      <Calendar size={12} />
                      <span>{task.dueDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 w-full max-w-md shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Plus size={16} className="text-blue-600" />
              {t.addTask || 'Nova Tarefa'}
            </h4>
            <form onSubmit={handleCreateTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                  {t.activityName || 'Título da Atividade'} *
                </label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  placeholder="Ex: Homologar API com SI"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                  {t.assignee || 'Responsável / Analista'} *
                </label>
                
                {/* Selected Assignee Badges / Chips */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2 p-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl min-h-[38px]">
                  {currentAssignees.map((name, index) => (
                    <span key={index} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border border-blue-200 dark:border-blue-700 shadow-sm animate-in fade-in duration-100">
                      <User size={12} />
                      {name}
                      <button
                        type="button"
                        onClick={() => handleRemoveAssignee(name)}
                        className="hover:text-red-500 font-bold ml-1 text-sm leading-none transition"
                        title="Remover responsável"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {currentAssignees.length === 0 && (
                    <span className="text-gray-400 text-xs italic px-1">{t.noAssigneeSelected || 'Nenhum responsável selecionado'}</span>
                  )}
                </div>

                {/* Multi-Select Dropdown & Custom Free Text Input */}
                <div className="flex items-center gap-2">
                  {!isAddingCustomAssignee ? (
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value === 'OTHER_CUSTOM') {
                          setIsAddingCustomAssignee(true);
                        } else if (e.target.value) {
                          handleAddAssignee(e.target.value);
                        }
                      }}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition cursor-pointer"
                    >
                      <option value="">{t.selectAnalyst || '+ Selecionar Analista do Sistema...'}</option>
                      {systemAnalysts.filter(a => !currentAssignees.includes(a)).map((analyst, i) => (
                        <option key={i} value={analyst}>{analyst}</option>
                      ))}
                      <option value="OTHER_CUSTOM">{t.otherFreeText || '✏️ Outro (digitação livre)...'}</option>
                    </select>
                  ) : (
                    <div className="w-full flex items-center gap-1.5 animate-in fade-in duration-150">
                      <input
                        type="text"
                        value={customAssigneeInput}
                        onChange={(e) => setCustomAssigneeInput(e.target.value)}
                        placeholder={t.addOtherPlaceholder || 'Digite o nome do outro responsável...'}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleConfirmCustomAssignee();
                          }
                        }}
                        className="flex-1 px-3 py-1.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={handleConfirmCustomAssignee}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
                      >
                        {t.add || 'Adicionar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setIsAddingCustomAssignee(false); setCustomAssigneeInput(''); }}
                        className="px-2 py-1.5 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-200 font-bold text-xs rounded-xl hover:bg-gray-300 transition"
                      >
                        {t.cancel || 'Cancelar'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                    {t.priority || 'Prioridade'}
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  >
                    <option value="Low">{t.priorityLow || 'Baixa'}</option>
                    <option value="Medium">{t.priorityMedium || 'Média'}</option>
                    <option value="High">{t.priorityHigh || 'Alta'}</option>
                    <option value="Urgent">{t.priorityUrgent || 'Urgente'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                    {t.dueDate || 'Data de Vencimento'}
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1 flex items-center gap-1.5">
                  <Link2 size={13} className="text-blue-500" />
                  Depende de Tarefa Antecessora (Opcional)
                </label>
                <select
                  value={selectedDependencies[0] || ''}
                  onChange={(e) => {
                    const depId = e.target.value;
                    if (!depId) {
                      setSelectedDependencies([]);
                      setDependencyError('');
                      return;
                    }

                    // Anti-circular check
                    if (hasCircularDependency(tasks, null, depId)) {
                      setDependencyError('⚠️ Esta dependência cria um ciclo inválido de tarefas!');
                    } else {
                      setDependencyError('');
                      setSelectedDependencies([depId]);
                    }
                  }}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">-- Nenhuma dependência (Livre) --</option>
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.completed ? 'Concluída' : 'Pendente'})
                    </option>
                  ))}
                </select>

                {dependencyError && (
                  <p className="text-[11px] font-bold text-rose-500 mt-1">{dependencyError}</p>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-gray-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 text-xs font-bold rounded-xl hover:bg-gray-200 transition"
                >
                  {t.cancel || 'Cancelar'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition"
                >
                  {t.save || 'Salvar Tarefa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Escalate Modal */}
      {escalatingTask && (
        <EscalateModal
          isOpen={!!escalatingTask}
          onClose={() => setEscalatingTask(null)}
          projectId={project.id}
          item={escalatingTask}
          itemType="task"
        />
      )}

    </div>
  );
};

export default ProjectTaskManager;
