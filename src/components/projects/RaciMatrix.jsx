import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Plus, X, Trash2 } from 'lucide-react';
import { updateProjectFieldWithAudit } from '../../features/projectSlice';

const RaciMatrix = ({ project }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const isEditable = user?.role !== 'VIEWER';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState('');
  const [person, setPerson] = useState('');
  const [code, setCode] = useState('R');

  const raciItems = project.raci || [];

  const handleAddRaci = (e) => {
    e.preventDefault();
    if (!role.trim() || !person.trim()) return;

    const newItem = { role: role.trim(), person: person.trim(), code };
    const updated = [...raciItems, newItem];

    dispatch(updateProjectFieldWithAudit({
      projectId: project.id,
      updates: { raci: updated },
      fieldLabel: 'Matriz RACI',
      oldValue: `Total de itens: ${raciItems.length}`,
      newValue: `Novo papel RACI: ${role.trim()} -> ${person.trim()} (${code})`,
      user
    }));

    setRole('');
    setPerson('');
    setCode('R');
    setIsModalOpen(false);
  };

  const handleDeleteRaci = (indexToDelete) => {
    const deletedItem = raciItems[indexToDelete];
    const updated = raciItems.filter((_, idx) => idx !== indexToDelete);

    dispatch(updateProjectFieldWithAudit({
      projectId: project.id,
      updates: { raci: updated },
      fieldLabel: 'Matriz RACI',
      oldValue: `Removido RACI: ${deletedItem?.role}`,
      newValue: `Total de itens: ${updated.length}`,
      user
    }));
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users size={18} className="text-blue-500" />
            Matriz RACI & Partes Interessadas (Stakeholders)
          </h3>
          <p className="text-xs text-gray-500">Responsável (R), Aprovador (A), Consultado (C), Informado (I)</p>
        </div>
        {isEditable && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 shadow-sm transition"
          >
            <Plus size={14} /> Novo Papel RACI
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-gray-50 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-bold uppercase text-[10px]">
              <th className="py-2.5 px-3">Papel / Função</th>
              <th className="py-2.5 px-3">Pessoa / Área</th>
              <th className="py-2.5 px-3 text-center">Código RACI</th>
              {isEditable && <th className="py-2.5 px-3 text-right">Ações</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
            {raciItems.map((item, i) => (
              <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/30">
                <td className="py-2.5 px-3 font-semibold text-gray-900 dark:text-white">{item.role}</td>
                <td className="py-2.5 px-3 text-gray-700 dark:text-zinc-300">{item.person}</td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`inline-block size-6 rounded-full text-[11px] font-bold leading-6 text-white ${
                    item.code === 'A' ? 'bg-red-500' : item.code === 'R' ? 'bg-blue-600' : item.code === 'C' ? 'bg-amber-500' : 'bg-gray-500'
                  }`}>
                    {item.code}
                  </span>
                </td>
                {isEditable && (
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleDeleteRaci(i)}
                      className="text-gray-400 hover:text-red-500 p-1 transition"
                      title="Remover Papel RACI"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add RACI Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-5 w-full max-w-md shadow-2xl space-y-4 text-xs animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users size={16} className="text-blue-500" /> Cadastrar Novo Papel RACI
              </h4>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddRaci} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Papel / Função *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Gerente do Projeto, Sponsor, Analista SI"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Pessoa / Área Responsável *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Claudia, Bruno, Diretoria de Operações"
                  value={person}
                  onChange={(e) => setPerson(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Código RACI</label>
                <select
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
                >
                  <option value="R">R - Responsible (Executor da Atividade)</option>
                  <option value="A">A - Accountable (Aprovador / Dono)</option>
                  <option value="C">C - Consulted (Consultado)</option>
                  <option value="I">I - Informed (Informado)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-gray-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-bold rounded-xl hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition"
                >
                  Salvar Papel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RaciMatrix;
