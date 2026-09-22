import React, { useState } from 'react';
import { GitPullRequest, FileUp, Mail, CheckCircle2, XCircle, Clock, Download, Search, Check, ShieldAlert, ArrowRight, UserCheck } from 'lucide-react';

export const ChangeMatrix = ({ project }) => {
  const changeLogs = project.changeMatrix || [];
  const [filterQuery, setFilterQuery] = useState('');
  const [fieldFilter, setFieldFilter] = useState('ALL');

  const filteredLogs = changeLogs.filter(log => {
    const matchesQuery = (log.description || '').toLowerCase().includes(filterQuery.toLowerCase()) ||
                         (log.author || log.user || '').toLowerCase().includes(filterQuery.toLowerCase()) ||
                         (log.field || '').toLowerCase().includes(filterQuery.toLowerCase());
    const matchesField = fieldFilter === 'ALL' || log.field === fieldFilter;
    return matchesQuery && matchesField;
  });

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) return;

    const headers = ['Data/Hora', 'Campo', 'Descricao', 'Usuario', 'Valor_Anterior', 'Valor_Novo'];
    const rows = filteredLogs.map(l => [
      `"${l.date || l.timestamp || ''}"`,
      `"${l.field || ''}"`,
      `"${l.description || ''}"`,
      `"${l.author || l.user || ''}"`,
      `"${(l.oldValue || '').toString().replace(/"/g, '""')}"`,
      `"${(l.newValue || '').toString().replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `auditoria_${project.title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderVisualDiff = (oldVal = '', newVal = '') => {
    if (!oldVal && !newVal) return null;
    
    return (
      <div className="p-2.5 bg-gray-50 dark:bg-zinc-800/80 rounded-xl text-[11px] grid grid-cols-1 md:grid-cols-2 gap-2 border border-gray-100 dark:border-zinc-700/50">
        <div className="bg-red-50/60 dark:bg-red-950/30 p-2 rounded-lg border border-red-200/60 dark:border-red-900/40">
          <span className="text-[10px] font-bold uppercase text-red-600 dark:text-red-400 block mb-0.5">De (Anterior):</span>
          <span className="text-red-800 dark:text-red-300 font-mono line-through leading-relaxed whitespace-pre-wrap">
            {oldVal || '(Vazio)'}
          </span>
        </div>
        <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-200/60 dark:border-emerald-900/40">
          <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block mb-0.5">Para (Novo Modificado):</span>
          <span className="text-emerald-900 dark:text-emerald-200 font-semibold font-mono leading-relaxed whitespace-pre-wrap">
            {newVal || '(Removido)'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <GitPullRequest size={18} className="text-indigo-500" />
            Matriz de Alterações & Audit Log com Diff Visual
          </h3>
          <p className="text-xs text-gray-500">
            Registro imutável de todas as modificações realizadas com destaque visual de antes vs. depois
          </p>
        </div>
        
        <button
          onClick={handleExportCSV}
          disabled={filteredLogs.length === 0}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition"
        >
          <Download size={14} /> Exportar Log em CSV
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
        <div className="relative flex-1 w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Filtrar por campo, usuário ou alteração..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-xs dark:text-white"
          />
        </div>

        <select
          value={fieldFilter}
          onChange={(e) => setFieldFilter(e.target.value)}
          className="px-3 py-1.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg text-xs font-semibold dark:text-white"
        >
          <option value="ALL">Todos os Campos</option>
          <option value="Fase">Fase</option>
          <option value="Matriz de Riscos">Matriz de Riscos</option>
          <option value="Tarefas">Tarefas</option>
          <option value="Pontos Abertos">Pontos Abertos</option>
          <option value="Overview">Visão Geral</option>
        </select>
      </div>

      {/* Logs List */}
      <div className="divide-y divide-gray-100 dark:divide-zinc-800 text-xs max-h-96 overflow-y-auto pr-1">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">
            Nenhuma alteração encontrada para este filtro.
          </div>
        ) : (
          filteredLogs.map((log, idx) => (
            <div key={log.id || idx} className="py-3.5 space-y-2 hover:bg-gray-50/50 dark:hover:bg-zinc-800/20 px-2 rounded-lg transition">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 text-[10px] font-extrabold uppercase">
                    {log.field || 'Alteração'}
                  </span>
                  <span>{log.description || `Edição em ${log.field}`}</span>
                </span>
                <span className="text-[11px] font-mono text-gray-400 whitespace-nowrap">
                  {log.date || log.timestamp || 'Horário recente'}
                </span>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-gray-600 dark:text-zinc-400">
                <span>
                  Usuário Responsável: <strong className="text-gray-900 dark:text-white">{log.author || log.user || 'Sistema'}</strong>
                </span>
              </div>

              {(log.oldValue !== undefined || log.newValue !== undefined) && renderVisualDiff(log.oldValue, log.newValue)}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const FileUploader = ({ project }) => {
  const files = project.files || [];
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileUp size={18} className="text-blue-500" />
          Uploads & Arquivos Importantes
        </h3>
        <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-bold">+ Upload Arquivo</button>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-zinc-800 text-xs">
        {files.length === 0 ? (
          <div className="p-4 text-center text-gray-400">Nenhum arquivo anexado ainda.</div>
        ) : (
          files.map(f => (
            <div key={f.id} className="py-2 flex items-center justify-between">
              <span className="font-semibold text-gray-800 dark:text-zinc-200">{f.name}</span>
              <span className="text-[10px] text-gray-400">{f.size} | {f.date}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const EmailLog = ({ project }) => {
  const emails = project.emailLogs || [];
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-3">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <Mail size={18} className="text-emerald-500" />
        Gerenciamento & Histórico de Emails Disparados
      </h3>
      <div className="divide-y divide-gray-100 dark:divide-zinc-800 text-xs">
        {emails.length === 0 ? (
          <div className="p-4 text-center text-gray-400">Nenhum e-mail de notificação registrado.</div>
        ) : (
          emails.map(e => (
            <div key={e.id} className="py-2.5 space-y-1">
              <div className="flex items-center justify-between font-bold text-gray-900 dark:text-white">
                <span>{e.subject}</span>
                <span className="text-[10px] text-gray-400 font-normal">{e.date}</span>
              </div>
              <p className="text-gray-500 text-[11px]">Para: {e.to}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const ApprovalWorkflow = ({ project }) => {
  const isHighBudget = (project.investmentAmount || 0) > 100000;

  const approvalSteps = [
    {
      level: 'L1',
      role: 'Analista PMO',
      name: 'Claudia / Daniela',
      status: 'Aprovado',
      date: project.startDate || '10/09/2026',
      slaDays: 'SLA: 24h (Concluído em 4h)'
    },
    {
      level: 'L2',
      role: 'Gerente da Área',
      name: project.responsible || 'Bruno',
      status: project.status === 'Aprovado' ? 'Aprovado' : 'Aguardando',
      date: project.status === 'Aprovado' ? '12/09/2026' : 'Pendente',
      slaDays: 'SLA: 48h (Restam 12h)'
    },
    {
      level: 'L3',
      role: 'Diretoria Executiva',
      name: 'Comitê Capex (Pedro / Alex)',
      status: project.status === 'Aprovado' ? 'Aprovado' : (isHighBudget ? 'Aguardando' : 'Isento (Abaixo de R$100k)'),
      date: project.status === 'Aprovado' ? '14/09/2026' : '-',
      slaDays: isHighBudget ? 'SLA: 72h' : 'Isento'
    }
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock size={18} className="text-amber-500" />
            Fluxo de Aprovação em Múltiplos Níveis (Governança PMO)
          </h3>
          <p className="text-xs text-gray-500">
            Esteira de alçadas de aprovação com tracking de SLA por nível
          </p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          project.status === 'Aprovado' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
        }`}>
          {project.status}
        </span>
      </div>

      {/* Stepper Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        {approvalSteps.map((step, idx) => {
          const isDone = step.status === 'Aprovado';
          const isPending = step.status === 'Aguardando';

          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border transition space-y-2 ${
                isDone
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800'
                  : isPending
                  ? 'bg-amber-50/50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800'
                  : 'bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-gray-900 text-white dark:bg-white dark:text-zinc-900">
                  {step.level} — {step.role}
                </span>
                {isDone ? (
                  <CheckCircle2 size={16} className="text-emerald-500" />
                ) : (
                  <Clock size={16} className="text-amber-500" />
                )}
              </div>

              <div className="font-bold text-gray-900 dark:text-white text-sm">{step.name}</div>

              <div className="flex items-center justify-between text-[11px]">
                <span className="text-gray-500">Status:</span>
                <span className={`font-bold ${isDone ? 'text-emerald-600' : 'text-amber-600'}`}>{step.status}</span>
              </div>

              <div className="text-[10px] text-gray-400 font-mono pt-1 border-t border-gray-200/50 dark:border-zinc-700/50">
                {step.slaDays}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
