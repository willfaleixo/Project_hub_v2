import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ShieldAlert, AlertTriangle, ShieldCheck, DollarSign, Filter, Flame, Plus, X, Trash2 } from 'lucide-react';
import { updateProjectFieldWithAudit } from '../../features/projectSlice';

const RiskAnalysis = ({ project }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const isEditable = user?.role !== 'VIEWER';

  const [selectedCell, setSelectedCell] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Escopo');
  const [prob, setProb] = useState(3);
  const [impact, setImpact] = useState(3);
  const [valAtRisk, setValAtRisk] = useState(25000);
  const [mitigation, setMitigation] = useState('');

  const initialRisks = [
    { id: 'rk1', category: 'Recursos', description: 'Conflito de agenda de consultores seniores', prob: 3, impact: 4, valAtRisk: 45000, mitigation: 'Alocação dedicada por contrato com cláusula de prioridade.' },
    { id: 'rk2', category: 'Segurança', description: 'Demora na homologação de fornecedor com SI', prob: 4, impact: 5, valAtRisk: 120000, mitigation: 'Abertura antecipada de VSAQ e alinhamento com comitê CISO.' },
    { id: 'rk3', category: 'Escopo', description: 'Mudança inesperada de requisitos na API de checkout', prob: 2, impact: 3, valAtRisk: 25000, mitigation: 'Congelamento de escopo (Baseline) pós-Fase 2.' },
    { id: 'rk4', category: 'Infraestrutura', description: 'Latência na comunicação com a API Genesys CTI', prob: 2, impact: 4, valAtRisk: 60000, mitigation: 'Testes de carga de estresse com massa de chamadas simultâneas.' }
  ];

  const risks = project.risks && project.risks.length > 0 ? project.risks : initialRisks;
  const redFlags = project.redFlags || [];

  // Matrix 5x5 generation (Prob 5 to 1 down, Impact 1 to 5 right)
  const probabilities = [5, 4, 3, 2, 1];
  const impacts = [1, 2, 3, 4, 5];

  const getCellColor = (prob, impact) => {
    const score = prob * impact;
    if (score >= 15) return 'bg-rose-600 text-white glow-crimson font-black';
    if (score >= 10) return 'bg-amber-500 text-white font-bold';
    if (score >= 5) return 'bg-yellow-400 text-gray-900 font-bold';
    return 'bg-emerald-500 text-white font-semibold';
  };

  const getRiskScoreCategory = (score) => {
    if (score >= 15) return { label: 'CRÍTICO', color: 'bg-rose-600 text-white' };
    if (score >= 10) return { label: 'ALTO', color: 'bg-amber-500 text-white' };
    if (score >= 5) return { label: 'MÉDIO', color: 'bg-yellow-400 text-gray-900' };
    return { label: 'BAIXO', color: 'bg-emerald-500 text-white' };
  };

  const filteredRisks = selectedCell
    ? risks.filter(r => (r.prob || 3) === selectedCell.prob && (r.impact || 3) === selectedCell.impact)
    : risks;

  const totalExposure = risks.reduce((acc, r) => acc + (r.valAtRisk || 30000), 0);

  const handleAddRisk = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newRisk = {
      id: 'rk_' + Date.now(),
      category,
      description: description.trim(),
      prob: Number(prob),
      impact: Number(impact),
      valAtRisk: Number(valAtRisk),
      mitigation: mitigation.trim() || 'Acompanhamento periódico'
    };

    const updated = [...risks, newRisk];

    dispatch(updateProjectFieldWithAudit({
      projectId: project.id,
      updates: { risks: updated },
      fieldLabel: 'Matriz de Riscos',
      oldValue: `Total de riscos: ${risks.length}`,
      newValue: `Novo Risco: "${description.trim()}" (P:${prob} x I:${impact})`,
      user
    }));

    setDescription('');
    setMitigation('');
    setIsAddModalOpen(false);
  };

  const handleDeleteRisk = (riskId, riskDesc) => {
    const updated = risks.filter(r => r.id !== riskId);
    dispatch(updateProjectFieldWithAudit({
      projectId: project.id,
      updates: { risks: updated },
      fieldLabel: 'Matriz de Riscos',
      oldValue: `Removido risco: "${riskDesc}"`,
      newValue: `Total de riscos: ${updated.length}`,
      user
    }));
  };

  const commonTemplates = [
    { category: 'Fornecedor', description: 'Atraso de entrega do fornecedor sem SLA definido', prob: 4, impact: 4, valAtRisk: 50000, mitigation: 'Inclusão de cláusula penal e cadastro de fornecedor secundário.' },
    { category: 'Segurança', description: 'Dependência de validação e homologação com Segurança da Informação (SI)', prob: 4, impact: 5, valAtRisk: 120000, mitigation: 'Abertura antecipada de formulário VSAQ e alinhamento com CISO.' },
    { category: 'Escopo', description: 'Estouro de orçamento por indefinição de escopo funcional', prob: 3, impact: 4, valAtRisk: 40000, mitigation: 'Baseline de escopo rígido e aprovação formal pelo Sponsor.' },
    { category: 'Recursos', description: 'Conflito de agenda de consultores seniores na fase crítica', prob: 3, impact: 3, valAtRisk: 30000, mitigation: 'Reserva prévia de capacidade e dedicacão contratual.' },
    { category: 'Infraestrutura', description: 'Latência ou indisponibilidade na integração de API de terceiros', prob: 2, impact: 4, valAtRisk: 35000, mitigation: 'Testes de estresse e mecanismos de retry automático.' }
  ];

  const handleApplyTemplate = (tmpl) => {
    setCategory(tmpl.category);
    setDescription(tmpl.description);
    setProb(tmpl.prob);
    setImpact(tmpl.impact);
    setValAtRisk(tmpl.valAtRisk);
    setMitigation(tmpl.mitigation);
  };

  return (
    <div className="space-y-6">
      
      {/* Red Flags Banner */}
      {redFlags.length > 0 && (
        <div className="p-4 bg-rose-950/40 border border-rose-800/80 rounded-2xl shadow-lg space-y-2">
          <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
            <Flame className="animate-bounce text-rose-500" size={16} /> Red Flags Críticos ({redFlags.length})
          </h4>
          <div className="space-y-1">
            {redFlags.map((rf) => (
              <div key={rf.id} className="text-xs text-rose-200 font-semibold flex items-center justify-between">
                <span>• {rf.description}</span>
                <span className="text-[10px] text-rose-400 font-normal">{rf.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total de Riscos Mapeados</span>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{risks.length}</h3>
          </div>
          {isEditable && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm transition"
              >
                <Plus size={14} /> Novo Risco
              </button>
            </div>
          )}
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Exposição Financeira (R$)</span>
          <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">R$ {(totalExposure / 1000).toFixed(0)}k</h3>
        </div>

        <div className="p-4 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nível Máximo de Risco</span>
          <h3 className="text-2xl font-black text-amber-500 mt-1">16 (Crítico)</h3>
        </div>
      </div>

      {/* Risk Heat Map 5x5 (Probability x Impact - RiskPulse Inspired) */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="text-rose-500" size={20} />
              Risk Heat Map (P × I) — Matriz de Probabilidade vs. Impacto
            </h3>
            <p className="text-xs text-gray-500">Inspirado no padrão RiskPulse / PMP para análise quantitativa de riscos</p>
          </div>

          {selectedCell && (
            <button
              onClick={() => setSelectedCell(null)}
              className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              <Filter size={12} /> Limpar Filtro ({selectedCell.prob}×{selectedCell.impact})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          
          {/* 5x5 Matrix Visual */}
          <div className="lg:col-span-7 space-y-2">
            <div className="text-xs font-bold text-gray-500 uppercase text-center mb-1">
              Probabilidade (Vertical) vs. Impacto (Horizontal)
            </div>

            <div className="grid grid-cols-6 gap-1.5 text-center text-xs">
              {/* Top Left Label Corner */}
              <div className="p-2 text-[10px] font-bold text-gray-400 flex items-center justify-center">P \ I</div>
              {impacts.map(imp => (
                <div key={imp} className="p-1.5 font-bold text-gray-600 dark:text-zinc-400 text-[11px]">
                  I-{imp}
                </div>
              ))}

              {probabilities.map(prob => (
                <React.Fragment key={prob}>
                  <div className="p-2 font-bold text-gray-600 dark:text-zinc-400 text-[11px] flex items-center justify-center">
                    P-{prob}
                  </div>
                  {impacts.map(impact => {
                    const count = risks.filter(r => (r.prob || 3) === prob && (r.impact || 3) === impact).length;
                    const isSelected = selectedCell && selectedCell.prob === prob && selectedCell.impact === impact;

                    return (
                      <div
                        key={`${prob}-${impact}`}
                        onClick={() => setSelectedCell(isSelected ? null : { prob, impact })}
                        className={`h-11 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-sm text-xs ${getCellColor(prob, impact)} ${
                          isSelected ? 'ring-4 ring-blue-500 scale-105 z-10' : ''
                        }`}
                      >
                        {count > 0 ? (
                          <span className="size-6 rounded-full bg-black/30 flex items-center justify-center font-black">
                            {count}
                          </span>
                        ) : (
                          <span className="opacity-40 text-[10px]">{prob * impact}</span>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 px-1 font-semibold">
              <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-emerald-500 inline-block" /> 1-4 (Baixo)</span>
              <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-yellow-400 inline-block" /> 5-9 (Médio)</span>
              <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-amber-500 inline-block" /> 10-14 (Alto)</span>
              <span className="flex items-center gap-1.5"><span className="size-3 rounded bg-rose-600 inline-block" /> 15-25 (Crítico)</span>
            </div>
          </div>

          {/* Risk Details List */}
          <div className="lg:col-span-5 space-y-3 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-zinc-800 lg:pl-6 pt-4 lg:pt-0">
            <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
              <span>Riscos Filtrados ({filteredRisks.length})</span>
            </h4>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {filteredRisks.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400">Nenhum risco nesta categoria da matriz.</div>
              ) : (
                filteredRisks.map((r) => {
                  const prob = r.prob || 3;
                  const impact = r.impact || 3;
                  const score = prob * impact;
                  const cat = getRiskScoreCategory(score);

                  return (
                    <div key={r.id} className="p-3.5 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-200/60 dark:border-zinc-700/60 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${cat.color}`}>
                          Score {score} — {cat.label}
                        </span>
                        <span className="text-gray-400 text-[10px] font-semibold">{r.category}</span>
                      </div>
                      <h5 className="font-bold text-gray-900 dark:text-white leading-tight">{r.description}</h5>
                      <p className="text-gray-500 dark:text-zinc-400 text-[11px] leading-relaxed">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">Mitigação:</span> {r.mitigation}
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        {r.valAtRisk && (
                          <div className="text-[10px] font-bold text-rose-500">
                            Valor em Risco: R$ {r.valAtRisk.toLocaleString()}
                          </div>
                        )}
                        {isEditable && (
                          <button
                            type="button"
                            onClick={() => handleDeleteRisk(r.id, r.description)}
                            className="text-gray-400 hover:text-red-500 ml-auto p-1 transition"
                            title="Remover Risco"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Add Risk Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 w-full max-w-md shadow-2xl space-y-4 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldAlert size={16} className="text-rose-500" /> Cadastrar Novo Risco
              </h4>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddRisk} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Preencher via Template Rápido</label>
                <select
                  onChange={(e) => {
                    const idx = e.target.value;
                    if (idx !== '') {
                      handleApplyTemplate(commonTemplates[Number(idx)]);
                    }
                  }}
                  defaultValue=""
                  className="w-full px-3 py-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 rounded-xl text-blue-900 dark:text-blue-200 text-xs font-semibold focus:outline-none mb-2"
                >
                  <option value="">-- Selecione um Template de Risco Comum --</option>
                  {commonTemplates.map((tmpl, idx) => (
                    <option key={idx} value={idx}>
                      [{tmpl.category}] {tmpl.description.substring(0, 45)}...
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Descrição do Risco *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Atraso na entrega dos servidores pela SI"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
                  >
                    <option value="Escopo">Escopo</option>
                    <option value="Recursos">Recursos</option>
                    <option value="Segurança">Segurança</option>
                    <option value="Infraestrutura">Infraestrutura</option>
                    <option value="Fornecedor">Fornecedor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Valor em Risco (R$)</label>
                  <input
                    type="number"
                    value={valAtRisk}
                    onChange={(e) => setValAtRisk(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Probabilidade (1 a 5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={prob}
                    onChange={(e) => setProb(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Impacto (1 a 5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={impact}
                    onChange={(e) => setImpact(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Plano de Mitigação</label>
                <textarea
                  rows="2"
                  placeholder="Ex: Alocar consultor reserva e definir SLA de resposta"
                  value={mitigation}
                  onChange={(e) => setMitigation(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-gray-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-bold rounded-xl hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  Salvar Risco
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default RiskAnalysis;
