import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar, Filter, User, Edit3, X, Check, AlertCircle, Clock, Plus } from 'lucide-react';

const InteractiveGanttTimeline = () => {
  const { groups } = useSelector(state => state.projects);
  const { translations: t } = useSelector(state => state.language);

  // Filters state
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('all');
  const [selectedAnalystFilter, setSelectedAnalystFilter] = useState('all');

  // Edit Modal state
  const [editingTask, setEditingTask] = useState(null);
  const [isAddingCustomAssignee, setIsAddingCustomAssignee] = useState(false);
  const [customAssigneeInput, setCustomAssigneeInput] = useState('');

  const systemAnalysts = ['Claudia', 'Bruno', 'Pedro', 'Daniela', 'Julia', 'Alex Low', 'Visitante'];

  const currentAssignees = editingTask?.assignee
    ? editingTask.assignee.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  const handleAddAssignee = (nameToAdd) => {
    if (!nameToAdd || currentAssignees.includes(nameToAdd)) return;
    const updated = [...currentAssignees, nameToAdd];
    setEditingTask(prev => ({ ...prev, assignee: updated.join(', ') }));
  };

  const handleRemoveAssignee = (nameToRemove) => {
    const updated = currentAssignees.filter(a => a !== nameToRemove);
    setEditingTask(prev => ({ ...prev, assignee: updated.join(', ') }));
  };

  const handleConfirmCustomAssignee = () => {
    if (customAssigneeInput.trim()) {
      handleAddAssignee(customAssigneeInput.trim());
      setCustomAssigneeInput('');
      setIsAddingCustomAssignee(false);
    }
  };

  const datesPT = [
    '11 Jan', '18 Jan', '25 Jan', '01 Fev', '08 Fev', '15 Fev', '22 Fev',
    '01 Mar', '08 Mar', '15 Mar', '22 Mar', '29 Mar', '05 Abr', '12 Abr',
    '19 Abr', '26 Abr', '03 Mai', '10 Mai', '17 Mai'
  ];

  // Initial Tasks Data
  const [tasks, setTasks] = useState([
    {
      id: 'T-001',
      projectName: 'Consultoria em Gestão de Projetos',
      title: 'Levantamento de Requisitos',
      assignee: 'Claudia',
      startDate: '2026-01-15',
      endDate: '2026-02-15',
      estimatedHours: 240,
      actualHours: 280,
      startIdx: 1,
      span: 4,
      progress: 100,
      priority: 'High',
      status: 'Concluído',
      pmpCategory: 'Iniciação',
      dependencies: '',
      isCritical: false
    },
    {
      id: 'T-002',
      projectName: 'Web Site',
      title: 'Configuração de Infraestrutura VPC & Subnet',
      assignee: 'Pedro',
      startDate: '2026-02-15',
      endDate: '2026-03-08',
      estimatedHours: 160,
      actualHours: 150,
      startIdx: 5,
      span: 3,
      progress: 100,
      priority: 'Medium',
      status: 'Concluído',
      pmpCategory: 'Planejamento',
      dependencies: 'T-001',
      isCritical: false
    },
    {
      id: 'T-003',
      projectName: 'Projeto Implantação',
      title: 'Migração de Banco de Dados CTI',
      assignee: 'Bruno',
      startDate: '2026-03-08',
      endDate: '2026-04-12',
      estimatedHours: 320,
      actualHours: 380,
      startIdx: 8,
      span: 5,
      progress: 65,
      priority: 'High',
      status: 'Atrasado',
      pmpCategory: 'Execução',
      dependencies: 'T-002',
      isCritical: true // CAMINHO CRÍTICO CARMESIM
    },
    {
      id: 'T-004',
      projectName: 'Web Site',
      title: 'Configuração do Gateway de APIs',
      assignee: 'Daniela',
      startDate: '2026-03-15',
      endDate: '2026-04-05',
      estimatedHours: 120,
      actualHours: 90,
      startIdx: 9,
      span: 3,
      progress: 45,
      priority: 'Medium',
      status: 'Em andamento',
      pmpCategory: 'Execução',
      dependencies: 'T-002',
      isCritical: false
    },
    {
      id: 'T-005',
      projectName: 'Implementação de Software',
      title: 'Integração de Autenticação OAuth2 / Single Sign-On',
      assignee: 'Julia',
      startDate: '2026-03-22',
      endDate: '2026-04-19',
      estimatedHours: 180,
      actualHours: 120,
      startIdx: 10,
      span: 4,
      progress: 50,
      priority: 'High',
      status: 'Em andamento',
      pmpCategory: 'Execução',
      dependencies: 'T-004',
      isCritical: false
    },
    {
      id: 'T-006',
      projectName: 'Projeto Implantação',
      title: 'Testes de Homologação UAT pelo Cliente',
      assignee: 'Claudia',
      startDate: '2026-04-12',
      endDate: '2026-05-10',
      estimatedHours: 200,
      actualHours: 0,
      startIdx: 14,
      span: 4,
      progress: 0,
      priority: 'High',
      status: 'Planejamento',
      pmpCategory: 'Monitoramento',
      dependencies: 'T-003, T-005',
      isCritical: true // CAMINHO CRÍTICO CARMESIM
    }
  ]);

  // Extract unique projects and analysts for dropdowns
  const allProjects = groups.flatMap(g => g.projects);
  const projectOptions = Array.from(new Set(allProjects.map(p => p.title)));
  const analystOptions = Array.from(new Set(allProjects.map(p => p.responsible)));

  // Filter tasks based on selections
  const filteredTasks = tasks.filter(t => {
    const matchesProject = selectedProjectFilter === 'all' || t.projectName === selectedProjectFilter;
    const matchesAnalyst = selectedAnalystFilter === 'all' || t.assignee === selectedAnalystFilter;
    return matchesProject && matchesAnalyst;
  });

  const handleOpenEdit = (task) => {
    setEditingTask({ ...task });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingTask) return;

    setTasks(prev => prev.map(t => t.id === editingTask.id ? editingTask : t));
    setEditingTask(null);
  };

  const getTaskColorClass = (task) => {
    if (task.isCritical) return 'bg-rose-500 text-white shadow-md shadow-rose-500/20 border border-rose-600 ring-2 ring-rose-400/50';
    if (task.status === 'Concluído' || task.progress === 100) return 'bg-emerald-500 text-white shadow-sm border border-emerald-600';
    if (task.status === 'Atrasado') return 'bg-rose-500 text-white shadow-sm border border-rose-600';
    return 'bg-amber-500 text-white shadow-sm border border-amber-600';
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm space-y-5">
      
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
              Cronograma Gantt Interativo do Time
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
              Caminho Crítico em Carmesim
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
            Clique em qualquer barra para editar detalhes da atividade. Filtre por projeto ou responsável.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Project Filter */}
          <div className="relative">
            <select
              value={selectedProjectFilter}
              onChange={(e) => setSelectedProjectFilter(e.target.value)}
              className="pl-3 pr-8 py-1.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">📂 Todos os Projetos</option>
              {projectOptions.map((p, i) => (
                <option key={i} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Analyst Filter */}
          <div className="relative">
            <select
              value={selectedAnalystFilter}
              onChange={(e) => setSelectedAnalystFilter(e.target.value)}
              className="pl-3 pr-8 py-1.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-xs font-semibold text-gray-800 dark:text-zinc-200 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">👤 Todos os Responsáveis</option>
              {analystOptions.map((a, i) => (
                <option key={i} value={a}>{a}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Gantt Timeline Container */}
      <div className="overflow-x-auto pt-2 pb-3 no-scrollbar">
        <div className="min-w-[950px]">
          
          {/* Top Date Header (PT-BR) */}
          <div className="grid grid-cols-24 gap-0 mb-3 border-b border-gray-200 dark:border-zinc-800 pb-2 text-[11px] font-bold text-gray-500 dark:text-zinc-400 tracking-wider">
            <div className="col-span-6 text-gray-700 dark:text-zinc-300 font-extrabold uppercase">Atividade / Projeto</div>
            <div className="col-span-18 grid grid-cols-19 text-center">
              {datesPT.map((d, i) => (
                <div key={i} className="text-gray-600 dark:text-zinc-400 font-semibold">{d}</div>
              ))}
            </div>
          </div>

          {/* Timeline Grid Rows */}
          <div className="space-y-3 relative">
            
            {/* Background vertical grid lines */}
            <div className="absolute inset-0 grid grid-cols-24 pointer-events-none opacity-20">
              <div className="col-span-6 border-r border-gray-300 dark:border-zinc-700" />
              <div className="col-span-18 grid grid-cols-19 divide-x divide-gray-300 dark:divide-zinc-700">
                {datesPT.map((_, i) => <div key={i} className="h-full" />)}
              </div>
            </div>

            {/* Task Rows */}
            {filteredTasks.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400">Nenhuma atividade encontrada com os filtros selecionados.</div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleOpenEdit(task)}
                  className="grid grid-cols-24 items-center gap-0 group relative py-1 cursor-pointer hover:bg-gray-50/80 dark:hover:bg-zinc-800/40 rounded-xl transition"
                >
                  {/* Task Info Column */}
                  <div className="col-span-6 pr-4 flex items-center justify-between">
                    <div className="truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 rounded">
                          {task.id}
                        </span>
                        <span className="text-xs font-bold text-gray-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {task.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 dark:text-zinc-400 mt-0.5">
                        <span className="font-semibold text-gray-700 dark:text-zinc-300">{task.assignee}</span>
                        <span>•</span>
                        <span className="truncate">{task.projectName}</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Track Column */}
                  <div className="col-span-18 grid grid-cols-19 items-center h-8 relative">
                    <div
                      className={`h-7 rounded-lg flex items-center justify-between px-3 text-[10px] font-bold transition-all duration-300 transform group-hover:scale-[1.02] shadow-sm relative ${getTaskColorClass(task)}`}
                      style={{
                        gridColumnStart: task.startIdx + 1,
                        gridColumnEnd: `span ${task.span}`
                      }}
                    >
                      <span className="truncate font-bold drop-shadow-sm">
                        {task.progress}% — {task.status}
                      </span>
                      <Edit3 size={12} className="opacity-0 group-hover:opacity-100 transition" />
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Curved SVG Dependency Arrows */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-60">
              <path d="M 280 24 C 295 24, 290 60, 305 60" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="3 3" />
              <path d="M 420 60 C 435 60, 430 96, 445 96" fill="none" stroke="#f43f5e" strokeWidth="2.5" />
              <path d="M 520 96 C 535 96, 530 132, 545 132" fill="none" stroke="#f59e0b" strokeWidth="2" />
            </svg>

          </div>

        </div>
      </div>

      {/* Edit Task Details Modal (Clean Theme System & Fully Localized i18n) */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-xl shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Edit3 size={18} className="text-blue-600 dark:text-blue-400" />
                  {t.editTaskDetails || 'Editar Detalhes da Atividade'} ({editingTask.id})
                </h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400">
                  {t.editTaskSubtitle || 'Atualize informações do cronograma e métricas de esforço condizentes com o sistema'}
                </p>
              </div>
              <button 
                onClick={() => setEditingTask(null)} 
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form Fields Aligned with System Theme & i18n */}
            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-zinc-300 font-bold mb-1">
                    {t.activityName || 'Nome da Atividade'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-zinc-300 font-bold mb-1">
                    {t.assignee || 'Responsável / Analista'} *
                  </label>
                  
                  {/* Selected Assignee Badges / Chips */}
                  <div className="flex flex-wrap items-center gap-1.5 mb-2 p-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl min-h-[42px]">
                    {currentAssignees.map((name, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 border border-blue-200 dark:border-blue-700 shadow-sm animate-in fade-in duration-100">
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
                          className="flex-1 px-3.5 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={handleConfirmCustomAssignee}
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition shadow-sm"
                        >
                          {t.add || 'Adicionar'}
                        </button>
                        <button
                          type="button"
                          onClick={() => { setIsAddingCustomAssignee(false); setCustomAssigneeInput(''); }}
                          className="px-2.5 py-2 bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-200 font-bold text-xs rounded-xl hover:bg-gray-300 transition"
                        >
                          {t.cancel || 'Cancelar'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-zinc-300 font-bold mb-1">
                    {t.plannedStartDate || 'Data de Início Planejada'}
                  </label>
                  <input
                    type="date"
                    value={editingTask.startDate}
                    onChange={(e) => setEditingTask({ ...editingTask, startDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-zinc-300 font-bold mb-1">
                    {t.plannedEndDate || 'Data de Término Planejada'}
                  </label>
                  <input
                    type="date"
                    value={editingTask.endDate}
                    onChange={(e) => setEditingTask({ ...editingTask, endDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 dark:text-zinc-300 font-bold mb-1">
                    {t.estimatedEffortHours || 'Esforço Estimado (Horas)'}
                  </label>
                  <input
                    type="number"
                    value={editingTask.estimatedHours}
                    onChange={(e) => setEditingTask({ ...editingTask, estimatedHours: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-zinc-300 font-bold mb-1">
                    {t.actualEffortHours || 'Esforço Realizado (Horas)'}
                  </label>
                  <input
                    type="number"
                    value={editingTask.actualHours}
                    onChange={(e) => setEditingTask({ ...editingTask, actualHours: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-zinc-300 font-bold mb-1">
                    {t.progressPercent || 'Progresso (%)'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingTask.progress}
                    onChange={(e) => setEditingTask({ ...editingTask, progress: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-gray-700 dark:text-zinc-300 font-bold mb-1">
                    {t.priority || 'Prioridade'}
                  </label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition font-medium"
                  >
                    <option value="Low">{t.priorityLow || 'Baixa'}</option>
                    <option value="Medium">{t.priorityMedium || 'Média'}</option>
                    <option value="High">{t.priorityHigh || 'Alta'}</option>
                    <option value="Urgent">{t.priorityUrgent || 'Urgente'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-zinc-300 font-bold mb-1">
                    {t.status || 'Situação'}
                  </label>
                  <select
                    value={editingTask.status}
                    onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition font-medium"
                  >
                    <option value="Planejamento">{t.statusPlanning || 'Planejamento'}</option>
                    <option value="Em andamento">{t.statusInProgress || 'Em andamento'}</option>
                    <option value="Atrasado">{t.statusDelayed || 'Atrasado'}</option>
                    <option value="Concluído">{t.statusCompleted || 'Concluído'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-zinc-300 font-bold mb-1">
                    {t.pmpCategory || 'Fase PMP'}
                  </label>
                  <select
                    value={editingTask.pmpCategory}
                    onChange={(e) => setEditingTask({ ...editingTask, pmpCategory: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition font-medium"
                  >
                    <option value="Iniciação">{t.pmpInitiation || 'Iniciação'}</option>
                    <option value="Planejamento">{t.pmpPlanning || 'Planejamento'}</option>
                    <option value="Execução">{t.pmpExecution || 'Execução'}</option>
                    <option value="Monitoramento">{t.pmpMonitoring || 'Monitoramento'}</option>
                    <option value="Encerramento">{t.pmpClosing || 'Encerramento'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-zinc-300 font-bold mb-1">
                  {t.dependencies || 'Dependências (IDs separadas por vírgula)'}
                </label>
                <input
                  type="text"
                  value={editingTask.dependencies}
                  onChange={(e) => setEditingTask({ ...editingTask, dependencies: e.target.value })}
                  placeholder="T-001, T-002"
                  className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition font-medium"
                />
              </div>

              {/* Action Buttons Aligned with Clean System Theme */}
              <div className="pt-3 flex justify-end gap-3 border-t border-gray-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 text-xs font-bold rounded-xl transition"
                >
                  {t.cancel || 'Cancelar'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition flex items-center gap-1.5"
                >
                  <Check size={14} /> {t.saveChanges || 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default InteractiveGanttTimeline;
