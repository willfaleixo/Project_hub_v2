import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CheckCircle2, XCircle, Clock, AlertTriangle, MessageSquare } from 'lucide-react';
import { updateApprovalStatus } from '../features/approvalSlice';
import { updateProject } from '../features/projectSlice';
import { addNotification } from '../features/notificationSlice';

const Approvals = () => {
  const dispatch = useDispatch();
  const { items: approvals } = useSelector(state => state.approvals);
  const { translations: t } = useSelector(state => state.language);

  const handleApprove = (app) => {
    dispatch(updateApprovalStatus({
      id: app.id,
      status: 'Aprovado',
      approverNotes: 'Aprovado pelo comitê de governança.'
    }));

    dispatch(updateProject({
      id: app.projectId,
      status: 'Proposto',
      phase: 'Planejamento / Execução'
    }));

    dispatch(addNotification({
      title: 'Projeto Aprovado!',
      message: `O projeto "${app.projectName}" foi aprovado com sucesso.`,
      type: 'info'
    }));
  };

  const handleDeny = (app) => {
    dispatch(updateApprovalStatus({
      id: app.id,
      status: 'Reprovado',
      approverNotes: 'Solicitação reprovada. Revisar escopo e custos.'
    }));

    dispatch(updateProject({
      id: app.projectId,
      status: 'Reprovado'
    }));

    dispatch(addNotification({
      title: 'Projeto Reprovado',
      message: `O projeto "${app.projectName}" teve sua solicitação reprovada.`,
      type: 'approval'
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 size={24} className="text-blue-600" />
            {t.approvals}
          </h1>
          <p className="text-xs text-gray-500">Solicitações de abertura de projetos e alterações de escopo pendentes de validação</p>
        </div>
      </div>

      <div className="space-y-4">
        {approvals.map((app) => (
          <div
            key={app.id}
            className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                  {app.type}
                </span>
                <span className="text-xs font-bold text-gray-400">• {app.groupName}</span>
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">{app.projectName}</h3>
              <p className="text-xs text-gray-600 dark:text-zinc-400">Solicitante: <span className="font-semibold">{app.requester}</span> em {app.requestedDate}</p>
              <p className="text-xs text-gray-500 italic mt-1">{app.comments}</p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              {app.status === 'Pendente' ? (
                <>
                  <button
                    onClick={() => handleDeny(app)}
                    className="flex items-center gap-1 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/40 dark:hover:bg-red-900/50 rounded-xl text-xs font-bold transition"
                  >
                    <XCircle size={16} /> Reprovar
                  </button>
                  <button
                    onClick={() => handleApprove(app)}
                    className="flex items-center gap-1 px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition shadow-md"
                  >
                    <CheckCircle2 size={16} /> Aprovar Projeto
                  </button>
                </>
              ) : (
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  app.status === 'Aprovado' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-100 text-red-800'
                }`}>
                  Status: {app.status}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Approvals;
