import React from 'react';
import { useSelector } from 'react-redux';
import { Printer, X, ShieldAlert, FileText, CheckCircle2, Clock, User, AlertTriangle, Layers } from 'lucide-react';

const BBPExportModal = ({ isOpen, onClose, project }) => {
  const { translations: t } = useSelector(state => state.language);

  if (!isOpen || !project) return null;

  const handlePrint = () => {
    window.print();
  };

  const tasks = project.tasks || [];
  const openPoints = project.openPoints || [];
  const risks = project.risks || [];
  const changeMatrix = project.changeMatrix || [];
  const raci = project.raci || [];
  
  // Filter escalated items
  const escalatedTasks = tasks.filter(t => t.isEscalated);
  const escalatedOpenPoints = openPoints.filter(op => op.isEscalated);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static print:inset-auto">
      {/* Container */}
      <div className="bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 rounded-2xl w-full max-w-5xl shadow-2xl border border-gray-200 dark:border-zinc-800 my-8 overflow-hidden print:shadow-none print:border-none print:max-w-none print:w-full print:my-0 print:rounded-none">
        
        {/* Modal Action Bar (Hidden on Print) */}
        <div className="px-6 py-4 bg-gray-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="text-blue-400" size={20} />
            <h3 className="text-base font-bold">Business Blueprint (BBP) - Exportação PDF</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-md transition"
            >
              <Printer size={16} />
              Imprimir / Salvar em PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
              title="Fechar"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 md:p-12 space-y-8 bg-white dark:bg-zinc-950 print:p-6 print:text-black print:bg-white text-xs">
          
          {/* Executive Header */}
          <div className="border-b-2 border-blue-900 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <img src="/logo.png" alt="Logo" className="w-5 h-5 rounded object-cover inline-block" />
                <span className="bg-blue-900 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded tracking-wider">
                  ENTERPRISE HUB
                </span>
                <span className="text-gray-400 text-xs font-semibold">| Portal Corporativo de Gestão de Projetos</span>
              </div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white print:text-black tracking-tight">
                {project.title}
              </h1>
              <p className="text-xs text-gray-500 dark:text-zinc-400 print:text-gray-700 mt-1">
                Código: <strong className="text-gray-900 dark:text-white print:text-black">{project.code || 'PRJ-' + project.id}</strong> | Categoria: {project.category || 'Geral'}
              </p>
            </div>
            <div className="text-right flex flex-col items-end">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
                {project.status}
              </span>
              <span className="text-[11px] text-gray-500 dark:text-zinc-400 mt-1">
                Emitido em: {new Date().toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          {/* Key Indicators Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 print:bg-gray-50 print:border-gray-300">
            <div>
              <span className="block text-[10px] font-bold uppercase text-gray-400 dark:text-zinc-500">Gestor do Projeto</span>
              <span className="font-bold text-gray-900 dark:text-white print:text-black">{project.manager || 'Não atribuído'}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase text-gray-400 dark:text-zinc-500">Analista Responsável</span>
              <span className="font-bold text-gray-900 dark:text-white print:text-black">{project.responsible || 'Não atribuído'}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase text-gray-400 dark:text-zinc-500">Prazo Estimado</span>
              <span className="font-bold text-gray-900 dark:text-white print:text-black">{project.deadline || 'Não informado'}</span>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase text-gray-400 dark:text-zinc-500">Orçamento / Custo</span>
              <span className="font-bold text-gray-900 dark:text-white print:text-black">{project.budget ? `R$ ${Number(project.budget).toLocaleString('pt-BR')}` : 'N/A'}</span>
            </div>
          </div>

          {/* Section 1: Overview & Charter */}
          <div className="space-y-3">
            <h2 className="text-sm font-black text-blue-900 dark:text-blue-400 uppercase tracking-wider border-b border-gray-200 dark:border-zinc-800 pb-1 flex items-center gap-2">
              <FileText size={16} /> 1. Termo de Abertura & Escopo do Projeto (Charter)
            </h2>
            <div className="p-4 bg-gray-50 dark:bg-zinc-900/50 rounded-xl border border-gray-100 dark:border-zinc-800 space-y-2 print:bg-white print:border-gray-300">
              <p className="text-xs leading-relaxed text-gray-700 dark:text-zinc-300 print:text-black">
                {project.description || 'Nenhuma descrição sumária registrada para este projeto.'}
              </p>
              {project.objectives && (
                <div className="pt-2">
                  <h4 className="font-bold text-gray-900 dark:text-white print:text-black mb-1">Objetivos Estratégicos:</h4>
                  <p className="text-xs text-gray-600 dark:text-zinc-400 print:text-gray-800">{project.objectives}</p>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Escalations & Critical Blockers */}
          <div className="space-y-3 print:break-inside-avoid">
            <h2 className="text-sm font-black text-rose-700 dark:text-rose-400 uppercase tracking-wider border-b border-gray-200 dark:border-zinc-800 pb-1 flex items-center gap-2">
              <ShieldAlert size={16} /> 2. Ocorrências & Escalações Críticas aos Gestores (BOs)
            </h2>
            {escalatedTasks.length === 0 && escalatedOpenPoints.length === 0 ? (
              <p className="text-gray-500 italic p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-zinc-800">
                Nenhum BO ou pendência foi escalado ao gestor até o momento.
              </p>
            ) : (
              <div className="space-y-2">
                {[...escalatedTasks, ...escalatedOpenPoints].map((item, idx) => (
                  <div key={idx} className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-lg print:bg-rose-50 print:border-rose-300">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-rose-900 dark:text-rose-200 print:text-rose-950 text-xs flex items-center gap-1.5">
                        <AlertTriangle size={14} className="text-rose-600" />
                        {item.title}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-200 text-rose-900 dark:bg-rose-900 dark:text-rose-100 uppercase">
                        {item.escalationSeverity || 'Alta Severidade'}
                      </span>
                    </div>
                    {item.escalationDetails && (
                      <p className="text-xs text-rose-800 dark:text-rose-300 print:text-rose-950 mt-1">
                        <strong>Motivo do Impasse:</strong> {item.escalationDetails}
                      </p>
                    )}
                    <div className="text-[10px] text-rose-600 dark:text-rose-400 print:text-rose-900 mt-1 flex items-center gap-3">
                      <span>Responsável: {item.assignee || item.owner || 'Não definido'}</span>
                      {item.escalatedAt && <span>Data de Escalação: {new Date(item.escalatedAt).toLocaleDateString('pt-BR')}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: RACI Matrix */}
          {raci && raci.length > 0 && (
            <div className="space-y-3 print:break-inside-avoid">
              <h2 className="text-sm font-black text-blue-900 dark:text-blue-400 uppercase tracking-wider border-b border-gray-200 dark:border-zinc-800 pb-1 flex items-center gap-2">
                <User size={16} /> 3. Matriz de Responsabilidades (RACI)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 dark:border-zinc-800 text-left text-xs">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 print:bg-gray-200 print:text-black">
                      <th className="p-2 border border-gray-200 dark:border-zinc-800">Entrega / Atividade</th>
                      <th className="p-2 border border-gray-200 dark:border-zinc-800">Responsible (Executor)</th>
                      <th className="p-2 border border-gray-200 dark:border-zinc-800">Accountable (Aprovador)</th>
                      <th className="p-2 border border-gray-200 dark:border-zinc-800">Consulted (Consultado)</th>
                      <th className="p-2 border border-gray-200 dark:border-zinc-800">Informed (Informado)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {raci.map((row, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-zinc-900/40">
                        <td className="p-2 border border-gray-200 dark:border-zinc-800 font-semibold">{row.task}</td>
                        <td className="p-2 border border-gray-200 dark:border-zinc-800">{row.responsible}</td>
                        <td className="p-2 border border-gray-200 dark:border-zinc-800">{row.accountable}</td>
                        <td className="p-2 border border-gray-200 dark:border-zinc-800">{row.consulted}</td>
                        <td className="p-2 border border-gray-200 dark:border-zinc-800">{row.informed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 4: Risk Matrix */}
          {risks && risks.length > 0 && (
            <div className="space-y-3 print:break-inside-avoid">
              <h2 className="text-sm font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider border-b border-gray-200 dark:border-zinc-800 pb-1 flex items-center gap-2">
                <AlertTriangle size={16} /> 4. Gestão de Riscos & Mitigações
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 dark:border-zinc-800 text-left text-xs">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 print:bg-gray-200 print:text-black">
                      <th className="p-2 border border-gray-200 dark:border-zinc-800">Descrição do Risco</th>
                      <th className="p-2 border border-gray-200 dark:border-zinc-800">Impacto</th>
                      <th className="p-2 border border-gray-200 dark:border-zinc-800">Probabilidade</th>
                      <th className="p-2 border border-gray-200 dark:border-zinc-800">Plano de Mitigação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {risks.map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-zinc-900/40">
                        <td className="p-2 border border-gray-200 dark:border-zinc-800 font-semibold">{r.title || r.description}</td>
                        <td className="p-2 border border-gray-200 dark:border-zinc-800">{r.impact || 'Médio'}</td>
                        <td className="p-2 border border-gray-200 dark:border-zinc-800">{r.probability || 'Média'}</td>
                        <td className="p-2 border border-gray-200 dark:border-zinc-800">{r.mitigation || 'Acompanhamento semanal'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 5: Change Matrix & Audit Trail */}
          <div className="space-y-3 print:break-inside-avoid">
            <h2 className="text-sm font-black text-blue-900 dark:text-blue-400 uppercase tracking-wider border-b border-gray-200 dark:border-zinc-800 pb-1 flex items-center gap-2">
              <Clock size={16} /> 5. Histórico de Modificações & Auditoria (Change Matrix)
            </h2>
            {changeMatrix.length === 0 ? (
              <p className="text-gray-500 italic p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-100 dark:border-zinc-800">
                Nenhum registro histórico armazenado.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-200 dark:border-zinc-800 text-left text-xs">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 print:bg-gray-200 print:text-black">
                      <th className="p-2 border border-gray-200 dark:border-zinc-800">Data / Hora</th>
                      <th className="p-2 border border-gray-200 dark:border-zinc-800">Tipo de Modificação</th>
                      <th className="p-2 border border-gray-200 dark:border-zinc-800">Descrição / Detalhes</th>
                      <th className="p-2 border border-gray-200 dark:border-zinc-800">Usuário Responsável</th>
                    </tr>
                  </thead>
                  <tbody>
                    {changeMatrix.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-zinc-900/40">
                        <td className="p-2 border border-gray-200 dark:border-zinc-800 font-mono text-[11px] whitespace-nowrap">
                          {item.date || item.timestamp || 'Recente'}
                        </td>
                        <td className="p-2 border border-gray-200 dark:border-zinc-800 font-bold uppercase text-[10px] text-blue-800 dark:text-blue-300 print:text-black">
                          {item.type || 'Alteração'}
                        </td>
                        <td className="p-2 border border-gray-200 dark:border-zinc-800">
                          {item.description || item.action}
                        </td>
                        <td className="p-2 border border-gray-200 dark:border-zinc-800 whitespace-nowrap">
                          {item.author || item.user || 'Sistema'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Executive Footer */}
          <div className="border-t-2 border-gray-200 dark:border-zinc-800 pt-6 mt-8 flex justify-between items-center text-[10px] text-gray-400 dark:text-zinc-500 print:text-gray-600">
            <span>ENTERPRISE HUB &copy; {new Date().getFullYear()} — Relatório Confidencial de Gestão de Projetos</span>
            <span>Documento Gerado Automatizado via Portal BBP</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default BBPExportModal;
