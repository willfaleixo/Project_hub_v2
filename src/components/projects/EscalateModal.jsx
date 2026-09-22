import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertOctagon, X, Send, Mail, CheckCircle2 } from 'lucide-react';
import { escalateProjectItem } from '../../features/projectSlice';
import { addNotification } from '../../features/notificationSlice';

const EscalateModal = ({ isOpen, onClose, projectId, item, itemType }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { translations: t } = useSelector(state => state.language);

  const [severity, setSeverity] = useState('Alta');
  const [situation, setSituation] = useState('Impasse de aprovação / bloqueio');
  const [details, setDetails] = useState('');
  const [emailSubject, setEmailSubject] = useState(
    item ? `[ESCALAÇÃO BO] ${item.title || item.text || 'Impasse crítico'}` : '[ESCALAÇÃO BO] Solicitação de Apoio do Gestor'
  );

  if (!isOpen || !item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!details || !emailSubject) return;

    const escalationData = {
      severity,
      situation,
      details,
      emailSubject,
      escalatedAt: new Date().toISOString(),
      itemTitle: item.title || item.text || item.description || 'Item sem título'
    };

    dispatch(escalateProjectItem({
      projectId,
      itemId: item.id,
      itemType,
      escalationData,
      author: user?.name || 'Analista'
    }));

    dispatch(addNotification({
      title: '🚨 NOVO BO ESCALADO',
      message: `O item "${item.title || item.text || 'BO'}" foi escalado por ${user?.name || 'Analista'} para o Gestor. Assunto: ${emailSubject}`,
      type: 'approval'
    }));

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400">
              <AlertOctagon size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                {t.escalateBOTitle || 'Solicitar Escalação ao Gestor'}
              </h3>
              <p className="text-xs text-gray-500 dark:text-zinc-400">
                {t.escalateBOSubtitle || 'Descreva a situação e o motivo da solicitação de apoio executivo'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Target Item Reference Card */}
        <div className="p-3 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 rounded-xl text-xs space-y-1">
          <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider block">
            Item a ser escalado ({itemType})
          </span>
          <p className="font-bold text-gray-900 dark:text-white">
            {item.title || item.text || item.description}
          </p>
        </div>

        {/* Escalation Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-gray-700 dark:text-zinc-300 mb-1">
                Gravidade do Bloqueio *
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none font-medium"
              >
                <option value="Crítica">🚨 Crítica (Impacta Go Live)</option>
                <option value="Alta">⚠️ Alta (Risco de atraso)</option>
                <option value="Média">🟡 Média (Acompanhamento)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 dark:text-zinc-300 mb-1">
                Motivo da Escalação
              </label>
              <select
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none font-medium"
              >
                <option value="Impasse de aprovação / bloqueio">Impasse de aprovação / bloqueio</option>
                <option value="Atraso crítico de fornecedor">Atraso crítico de fornecedor</option>
                <option value="Conflito de recursos / agenda">Conflito de recursos / agenda</option>
                <option value="Aumento não previsto de custos">Aumento não previsto de custos</option>
                <option value="Outro motivo relevante">Outro motivo relevante</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-zinc-300 mb-1">
              {t.emailSubject || 'Título / Assunto do E-mail'} *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none font-medium"
                placeholder="Ex: [ESCALAÇÃO BO] Impasse em homologação CTI"
              />
              <Mail size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 dark:text-zinc-300 mb-1">
              {t.whatHappened || 'O que houve / Detalhamento do Bloqueio'} *
            </label>
            <textarea
              required
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Descreva o que aconteceu, tentativas de resolução e qual decisão/intervenção é necessária do Gestor..."
              className="w-full px-3.5 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none font-medium resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex justify-end gap-3 border-t border-gray-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 text-xs font-bold rounded-xl transition"
            >
              {t.cancel || 'Cancelar'}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-500/20 transition flex items-center gap-1.5"
            >
              <Send size={14} /> {t.submitEscalation || 'Solicitar Escalação'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EscalateModal;
