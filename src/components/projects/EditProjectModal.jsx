import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Save, Plus, Trash2, Edit3, Star, Flame, CheckCircle2 } from 'lucide-react';
import { updateProjectFieldWithAudit } from '../../features/projectSlice';
import { addNotification } from '../../features/notificationSlice';

const EditProjectModal = ({ isOpen, onClose, project, modalType }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  // Form states initialized from project
  const [title, setTitle] = useState(project?.title || '');
  const [status, setStatus] = useState(project?.status || 'Proposto');
  const [area, setArea] = useState(project?.area || 'Corporate');
  const [responsible, setResponsible] = useState(project?.responsible || '');
  const [startDate, setStartDate] = useState(project?.startDate || '');
  const [goLiveDate, setGoLiveDate] = useState(project?.goLiveDate || project?.estimatedEnd || '');
  const [progress, setProgress] = useState(project?.progress || 0);

  const [summary, setSummary] = useState(project?.summary || '');
  const [expectedGains, setExpectedGains] = useState(project?.expectedGains || '');
  const [metrics, setMetrics] = useState(project?.metrics || '');
  const [drivers, setDrivers] = useState(project?.drivers || '');
  const [outOfScope, setOutOfScope] = useState(project?.outOfScope || '');

  // Array states
  const [highlights, setHighlights] = useState(project?.highlights || []);
  const [newHighlight, setNewHighlight] = useState('');

  const [redFlags, setRedFlags] = useState(project?.redFlags || []);
  const [newRedFlag, setNewRedFlag] = useState('');
  const [redFlagSeverity, setRedFlagSeverity] = useState('High');

  const [requirements, setRequirements] = useState(project?.requirements || []);
  const [newRequirementText, setNewRequirementText] = useState('');
  const [newRequirementIsRedLine, setNewRequirementIsRedLine] = useState(false);

  useEffect(() => {
    if (project) {
      setTitle(project.title || '');
      setStatus(project.status || 'Proposto');
      setArea(project.area || 'Corporate');
      setResponsible(project.responsible || '');
      setStartDate(project.startDate || '');
      setGoLiveDate(project.goLiveDate || project.estimatedEnd || '');
      setProgress(project.progress || 0);

      setSummary(project.summary || '');
      setExpectedGains(project.expectedGains || '');
      setMetrics(project.metrics || '');
      setDrivers(project.drivers || '');
      setOutOfScope(project.outOfScope || '');

      setHighlights(project.highlights || []);
      setRedFlags(project.redFlags || []);
      setRequirements(project.requirements || []);
    }
  }, [project, isOpen]);

  if (!isOpen || !project) return null;

  const handleSaveHeader = (e) => {
    e.preventDefault();
    const updates = {
      title,
      status,
      area,
      responsible,
      startDate,
      goLiveDate,
      estimatedEnd: goLiveDate,
      progress: Number(progress)
    };

    dispatch(updateProjectFieldWithAudit({
      projectId: project.id,
      updates,
      fieldLabel: 'Informações Mestre do Projeto (Cabeçalho)',
      oldValue: `Status: ${project.status}, Resp: ${project.responsible}, GoLive: ${project.goLiveDate || project.estimatedEnd}`,
      newValue: `Status: ${status}, Resp: ${responsible}, GoLive: ${goLiveDate}`,
      user
    }));

    dispatch(addNotification({
      title: 'Projeto Atualizado',
      message: `Informações mestre do projeto "${title}" atualizadas por ${user?.name}.`,
      type: 'info'
    }));

    onClose();
  };

  const handleSaveOverview = (e) => {
    e.preventDefault();
    const updates = {
      summary,
      expectedGains,
      metrics,
      drivers,
      outOfScope
    };

    dispatch(updateProjectFieldWithAudit({
      projectId: project.id,
      updates,
      fieldLabel: 'Termo de Abertura & Visão Geral',
      oldValue: 'Resumo / Objetivos Anteriores',
      newValue: 'Resumo & Objetivos Atualizados',
      user
    }));

    dispatch(addNotification({
      title: 'Visão Geral Atualizada',
      message: `Visão Geral & Termo de Abertura do projeto "${project.title}" alterado por ${user?.name}.`,
      type: 'info'
    }));

    onClose();
  };

  // Highlights handlers
  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return;
    const updated = [
      ...highlights,
      { id: 'h_' + Date.now(), text: newHighlight.trim(), date: new Date().toISOString().split('T')[0] }
    ];
    setHighlights(updated);
    setNewHighlight('');

    dispatch(updateProjectFieldWithAudit({
      projectId: project.id,
      updates: { highlights: updated },
      fieldLabel: 'Highlights Recentes',
      oldValue: `Total: ${highlights.length}`,
      newValue: `Adicionado: "${newHighlight.trim()}"`,
      user
    }));
  };

  const handleRemoveHighlight = (id) => {
    const updated = highlights.filter(h => h.id !== id);
    setHighlights(updated);

    dispatch(updateProjectFieldWithAudit({
      projectId: project.id,
      updates: { highlights: updated },
      fieldLabel: 'Highlights Recentes',
      oldValue: `Total: ${highlights.length}`,
      newValue: `Removido highlight. Total: ${updated.length}`,
      user
    }));
  };

  // Red Flags handlers
  const handleAddRedFlag = () => {
    if (!newRedFlag.trim()) return;
    const updated = [
      ...redFlags,
      { id: 'rf_' + Date.now(), description: newRedFlag.trim(), severity: redFlagSeverity, date: new Date().toISOString().split('T')[0] }
    ];
    setRedFlags(updated);
    setNewRedFlag('');

    dispatch(updateProjectFieldWithAudit({
      projectId: project.id,
      updates: { redFlags: updated },
      fieldLabel: 'Red Flags & Alertas Críticos',
      oldValue: `Total: ${redFlags.length}`,
      newValue: `Novo Red Flag: "${newRedFlag.trim()}"`,
      user
    }));
  };

  const handleRemoveRedFlag = (id) => {
    const updated = redFlags.filter(rf => rf.id !== id);
    setRedFlags(updated);

    dispatch(updateProjectFieldWithAudit({
      projectId: project.id,
      updates: { redFlags: updated },
      fieldLabel: 'Red Flags & Alertas Críticos',
      oldValue: `Total: ${redFlags.length}`,
      newValue: `Removido Red Flag. Total: ${updated.length}`,
      user
    }));
  };

  // Requirements handlers
  const handleAddRequirement = () => {
    if (!newRequirementText.trim()) return;
    const updated = [
      ...requirements,
      { id: 'r_' + Date.now(), text: newRequirementText.trim(), isRedLine: newRequirementIsRedLine }
    ];
    setRequirements(updated);
    setNewRequirementText('');
    setNewRequirementIsRedLine(false);

    dispatch(updateProjectFieldWithAudit({
      projectId: project.id,
      updates: { requirements: updated },
      fieldLabel: 'Requerimentos & Red Lines',
      oldValue: `Total: ${requirements.length}`,
      newValue: `Novo Requerimento: "${newRequirementText.trim()}" ${newRequirementIsRedLine ? '(RED LINE)' : ''}`,
      user
    }));
  };

  const handleRemoveRequirement = (id) => {
    const updated = requirements.filter(r => r.id !== id);
    setRequirements(updated);

    dispatch(updateProjectFieldWithAudit({
      projectId: project.id,
      updates: { requirements: updated },
      fieldLabel: 'Requerimentos & Red Lines',
      oldValue: `Total: ${requirements.length}`,
      newValue: `Removido requerimento. Total: ${updated.length}`,
      user
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-gray-50 dark:bg-zinc-800/80 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="text-blue-600 dark:text-blue-400" size={18} />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              {modalType === 'header' && 'Editar Informações Mestre do Projeto'}
              {modalType === 'overview' && 'Editar Visão Geral & Termo de Abertura'}
              {modalType === 'highlights' && 'Gerenciar Highlights Recentes'}
              {modalType === 'redFlags' && 'Gerenciar Red Flags & Alertas Críticos'}
              {modalType === 'requirements' && 'Gerenciar Requerimentos & Red Lines'}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition">
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 max-h-[75vh] overflow-y-auto text-xs space-y-4">

          {/* Type: HEADER */}
          {modalType === 'header' && (
            <form onSubmit={handleSaveHeader} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Título do Projeto *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Status do Projeto</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
                  >
                    <option value="Proposto">Proposto</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Pendente Cliente">Pendente Cliente</option>
                    <option value="Concluído">Concluído</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Área / Categoria</label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Responsável / Analista</label>
                  <input
                    type="text"
                    value={responsible}
                    onChange={(e) => setResponsible(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Progresso Geral (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={progress}
                    onChange={(e) => setProgress(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Data de Início</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Go Live Esperado</label>
                  <input
                    type="date"
                    value={goLiveDate}
                    onChange={(e) => setGoLiveDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100 dark:border-zinc-800">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-bold rounded-xl hover:bg-gray-200 transition">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5">
                  <Save size={14} /> Salvar Alterações
                </button>
              </div>
            </form>
          )}

          {/* Type: OVERVIEW */}
          {modalType === 'overview' && (
            <form onSubmit={handleSaveOverview} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Resumo do Projeto</label>
                <textarea
                  rows="3"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Ganhos Esperados / Objetivos</label>
                <textarea
                  rows="2"
                  value={expectedGains}
                  onChange={(e) => setExpectedGains(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Métricas / KPIs Envolvidas</label>
                <textarea
                  rows="2"
                  value={metrics}
                  onChange={(e) => setMetrics(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Drivers do Projeto</label>
                <input
                  type="text"
                  value={drivers}
                  onChange={(e) => setDrivers(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Fora do Escopo</label>
                <input
                  type="text"
                  value={outOfScope}
                  onChange={(e) => setOutOfScope(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-gray-100 dark:border-zinc-800">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-bold rounded-xl hover:bg-gray-200 transition">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5">
                  <Save size={14} /> Salvar Alterações
                </button>
              </div>
            </form>
          )}

          {/* Type: HIGHLIGHTS */}
          {modalType === 'highlights' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Novo destaque recente..."
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
                />
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition flex items-center gap-1"
                >
                  <Plus size={14} /> Adicionar
                </button>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                {highlights.map((h) => (
                  <div key={h.id} className="py-2 flex items-center justify-between gap-2">
                    <span className="text-emerald-900 dark:text-emerald-200 font-medium">• {h.text}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(h.id)}
                      className="text-red-500 hover:text-red-700 p-1 transition"
                      title="Remover Highlight"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Type: RED FLAGS */}
          {modalType === 'redFlags' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Descrição do Red Flag / Alerta Crítico..."
                  value={newRedFlag}
                  onChange={(e) => setNewRedFlag(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
                />
                <div className="flex justify-between items-center">
                  <select
                    value={redFlagSeverity}
                    onChange={(e) => setRedFlagSeverity(e.target.value)}
                    className="px-3 py-1.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium text-xs"
                  >
                    <option value="High">Alta Severidade</option>
                    <option value="Critical">Severidade Crítica</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddRedFlag}
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl transition flex items-center gap-1"
                  >
                    <Plus size={14} /> Adicionar Red Flag
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                {redFlags.map((rf) => (
                  <div key={rf.id} className="py-2 flex items-center justify-between gap-2">
                    <span className="text-red-900 dark:text-red-200 font-medium">• {rf.description} ({rf.severity || 'High'})</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRedFlag(rf.id)}
                      className="text-red-500 hover:text-red-700 p-1 transition"
                      title="Remover Red Flag"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Type: REQUIREMENTS */}
          {modalType === 'requirements' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Descrição do requerimento..."
                  value={newRequirementText}
                  onChange={(e) => setNewRequirementText(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
                />
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-700 dark:text-zinc-300">
                    <input
                      type="checkbox"
                      checked={newRequirementIsRedLine}
                      onChange={(e) => setNewRequirementIsRedLine(e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span>Marcar como RED LINE (Mandatório)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddRequirement}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition flex items-center gap-1"
                  >
                    <Plus size={14} /> Adicionar
                  </button>
                </div>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-zinc-800">
                {requirements.map((r) => (
                  <div key={r.id} className="py-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {r.isRedLine ? (
                        <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">RED LINE</span>
                      ) : (
                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-bold rounded">PADRÃO</span>
                      )}
                      <span className="text-gray-800 dark:text-zinc-200">{r.text}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(r.id)}
                      className="text-red-500 hover:text-red-700 p-1 transition"
                      title="Remover Requerimento"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default EditProjectModal;
