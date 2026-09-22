import React, { useState } from 'react';
import { HelpCircle, Plus, CheckCircle2, AlertOctagon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addOpenPoint } from '../../features/projectSlice';
import EscalateModal from './EscalateModal';

const OpenPoints = ({ project }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const isEditable = user?.role !== 'VIEWER';

  const [title, setTitle] = useState('');
  const [owner, setOwner] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [escalatingItem, setEscalatingItem] = useState(null);

  const openPoints = project.openPoints || [];

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title || !isEditable) return;
    dispatch(addOpenPoint({
      projectId: project.id,
      openPoint: { title, owner: owner || 'Analista', dueDate: dueDate || 'TBD' }
    }));
    setTitle('');
    setIsAdding(false);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <HelpCircle size={18} className="text-amber-500" />
            Open Points & Pendências
          </h3>
          <p className="text-xs text-gray-500">Questões técnicas ou operacionais pendentes de definição</p>
        </div>
        {isEditable && (
          <button onClick={() => setIsAdding(!isAdding)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition">
            + Novo Open Point
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg space-y-2 text-xs">
          <input type="text" placeholder="Título da pendência" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-white" />
          <div className="grid grid-cols-2 gap-2">
            <input type="text" placeholder="Responsável" value={owner} onChange={(e) => setOwner(e.target.value)} className="p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-white" />
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="p-2 border rounded dark:bg-zinc-900 dark:border-zinc-700 dark:text-white" />
          </div>
          <button type="submit" className="px-3 py-1 bg-green-600 text-white font-bold rounded">Salvar</button>
        </form>
      )}

      <div className="divide-y divide-gray-100 dark:divide-zinc-800 text-xs">
        {openPoints.length === 0 ? (
          <div className="p-4 text-center text-gray-400">Nenhum open point em aberto no momento.</div>
        ) : (
          openPoints.map(op => (
            <div key={op.id} className="py-2.5 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white truncate">{op.title}</h4>
                  {(() => {
                    if (!op.dueDate || op.dueDate === 'TBD') return null;
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const due = new Date(op.dueDate);
                    if (isNaN(due.getTime())) return null;
                    due.setHours(0, 0, 0, 0);
                    const diffDays = Math.ceil((today - due) / (1000 * 60 * 60 * 24));

                    if (diffDays > 0) {
                      return (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-300 dark:border-red-800 font-bold">
                          Vencido há {diffDays}d
                        </span>
                      );
                    } else if (diffDays >= -2 && diffDays <= 0) {
                      return (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold">
                          Vence em breve
                        </span>
                      );
                    }
                    return null;
                  })()}
                </div>
                <span className="text-[10px] text-gray-400">Resp: {op.owner} | Prazo: {op.dueDate}</span>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                {op.isEscalated ? (
                  <span className="px-2 py-0.5 rounded text-[10px] bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 font-extrabold border border-rose-300 dark:border-rose-800 flex items-center gap-1 shadow-sm">
                    <AlertOctagon size={11} className="text-rose-600 dark:text-rose-400" />
                    ESCALADO AO GESTOR
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEscalatingItem(op)}
                    className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/50 text-rose-700 dark:text-rose-300 font-bold rounded-lg text-[10px] border border-rose-200 dark:border-rose-800 transition flex items-center gap-1 shadow-sm"
                  >
                    <AlertOctagon size={12} />
                    Escalar BO
                  </button>
                )}
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 font-bold">{op.status}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Escalate Modal */}
      {escalatingItem && (
        <EscalateModal
          isOpen={!!escalatingItem}
          onClose={() => setEscalatingItem(null)}
          projectId={project.id}
          item={escalatingItem}
          itemType="openPoint"
        />
      )}
    </div>
  );
};

export default OpenPoints;
