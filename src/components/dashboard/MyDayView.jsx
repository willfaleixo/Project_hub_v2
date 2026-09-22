import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Sun, CheckSquare, Clock, AlertTriangle, AlertCircle, ExternalLink, ShieldAlert, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toggleTaskCompleted } from '../../features/projectSlice';
import { parseSafeDate } from '../../utils/dateUtils';
import { isBefore, isToday, addDays, isWithinInterval, startOfDay } from 'date-fns';

const MyDayView = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { groups = [] } = useSelector(state => state.projects);
  const { user } = useSelector(state => state.auth);

  if (!isOpen) return null;

  const currentUserName = user?.name || 'Alex Low';
  const projects = (groups || []).flatMap(g => g.projects || []);

  // Aggregate all tasks across all active projects assigned to or matching user
  const allUserTasks = [];
  const allUserOpenPoints = [];

  projects.forEach(p => {
    (p.tasks || []).forEach(t => {
      // Check if task assignee matches or contains current user
      const isAssigned = (t.assignee || '').toLowerCase().includes(currentUserName.toLowerCase()) ||
                         (p.responsible || '').toLowerCase().includes(currentUserName.toLowerCase());
      if (isAssigned) {
        allUserTasks.push({ ...t, projectTitle: p.title, projectId: p.id });
      }
    });

    (p.openPoints || []).forEach(op => {
      const isAssigned = (op.responsible || '').toLowerCase().includes(currentUserName.toLowerCase()) ||
                         (p.responsible || '').toLowerCase().includes(currentUserName.toLowerCase());
      if (isAssigned) {
        allUserOpenPoints.push({ ...op, projectTitle: p.title, projectId: p.id });
      }
    });
  });

  const today = startOfDay(new Date());

  const safeIsBefore = (dateStr) => {
    try {
      const d = parseSafeDate(dateStr);
      return isBefore(startOfDay(d), today);
    } catch {
      return false;
    }
  };

  const safeIsToday = (dateStr) => {
    try {
      const d = parseSafeDate(dateStr);
      return isToday(d);
    } catch {
      return false;
    }
  };

  const safeIsUpcoming = (dateStr) => {
    try {
      const d = parseSafeDate(dateStr);
      return isWithinInterval(d, { start: addDays(today, 1), end: addDays(today, 7) });
    } catch {
      return false;
    }
  };

  const overdueTasks = allUserTasks.filter(t => !t.completed && t.dueDate && safeIsBefore(t.dueDate));
  const todayTasks = allUserTasks.filter(t => !t.completed && t.dueDate && safeIsToday(t.dueDate));
  const upcomingTasks = allUserTasks.filter(t => !t.completed && t.dueDate && safeIsUpcoming(t.dueDate));
  const completedTasks = allUserTasks.filter(t => t.completed);

  const handleToggle = (projectId, taskId) => {
    dispatch(toggleTaskCompleted({ projectId, taskId }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 w-full max-w-3xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-xs animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl border border-amber-500/20">
              <Sun size={24} className="animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 dark:text-white">Meu Dia — Painel do Analista</h2>
              <p className="text-xs text-gray-500">Visão consolidada de to-dos, pendências e entregas prioritárias de {currentUserName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 font-bold rounded-xl transition"
          >
            Fechar
          </button>
        </div>

        {/* Counter Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl">
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase">Atrasadas ({overdueTasks.length})</span>
            <div className="text-xl font-black text-rose-700 dark:text-rose-300 mt-0.5">{overdueTasks.length}</div>
          </div>
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-2xl">
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">Para Hoje ({todayTasks.length})</span>
            <div className="text-xl font-black text-amber-700 dark:text-amber-300 mt-0.5">{todayTasks.length}</div>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase">Próximos 7 Dias ({upcomingTasks.length})</span>
            <div className="text-xl font-black text-blue-700 dark:text-blue-300 mt-0.5">{upcomingTasks.length}</div>
          </div>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Concluídas ({completedTasks.length})</span>
            <div className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-0.5">{completedTasks.length}</div>
          </div>
        </div>

        {/* Overdue Tasks Section */}
        {overdueTasks.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle size={15} /> Tarefas Atrasadas / Críticas
            </h3>
            <div className="space-y-2">
              {overdueTasks.map(t => (
                <div key={t.id} className="p-3 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => handleToggle(t.projectId, t.id)}
                      className="p-1 rounded bg-white dark:bg-zinc-800 border border-rose-300 text-rose-600 hover:scale-110 transition"
                    >
                      <Check size={14} />
                    </button>
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 dark:text-white truncate">{t.title}</h4>
                      <p className="text-[10px] text-gray-500 dark:text-zinc-400 font-semibold">{t.projectTitle} • Vencimento: <span className="text-rose-600 font-bold">{t.dueDate}</span></p>
                    </div>
                  </div>
                  <Link
                    to={`/project/${t.projectId}`}
                    onClick={onClose}
                    className="p-1.5 bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 rounded-xl transition font-bold text-[10px] flex items-center gap-1"
                  >
                    Ver Projeto <ExternalLink size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Today Tasks Section */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={15} className="text-amber-500" /> Tarefas para Hoje & Próximas
          </h3>
          <div className="space-y-2">
            {[...todayTasks, ...upcomingTasks].length === 0 ? (
              <div className="p-4 text-center text-gray-400 bg-gray-50 dark:bg-zinc-800/40 rounded-2xl">
                Você não possui tarefas com vencimento para hoje ou próximos dias. 🎉
              </div>
            ) : (
              [...todayTasks, ...upcomingTasks].map(t => (
                <div key={t.id} className="p-3 bg-gray-50 dark:bg-zinc-800/60 border border-gray-200 dark:border-zinc-700/60 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <button
                      onClick={() => handleToggle(t.projectId, t.id)}
                      className="p-1 rounded bg-white dark:bg-zinc-800 border border-gray-300 text-gray-400 hover:text-emerald-500 transition"
                    >
                      <Check size={14} />
                    </button>
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 dark:text-white truncate">{t.title}</h4>
                      <p className="text-[10px] text-gray-500 dark:text-zinc-400 font-semibold">{t.projectTitle} • Vence em: <span className="text-blue-600 font-bold">{t.dueDate}</span></p>
                    </div>
                  </div>
                  <Link
                    to={`/project/${t.projectId}`}
                    onClick={onClose}
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-zinc-200 rounded-xl transition font-bold text-[10px] flex items-center gap-1"
                  >
                    Ver Projeto <ExternalLink size={12} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Assigned Open Points */}
        {allUserOpenPoints.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
            <h3 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle size={15} /> Pontos Abertos sob sua Responsabilidade ({allUserOpenPoints.length})
            </h3>
            <div className="space-y-2">
              {allUserOpenPoints.map(op => (
                <div key={op.id} className="p-3 bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-2xl flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white truncate">{op.description || op.title}</h4>
                    <p className="text-[10px] text-gray-500 font-semibold">{op.projectTitle} • Responsável: {op.responsible}</p>
                  </div>
                  <Link
                    to={`/project/${op.projectId}`}
                    onClick={onClose}
                    className="px-2.5 py-1 bg-amber-500 text-white rounded-xl transition font-bold text-[10px] flex items-center gap-1"
                  >
                    Resolver <ExternalLink size={12} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyDayView;
