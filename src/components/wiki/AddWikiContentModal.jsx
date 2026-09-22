import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Plus, BookOpen, Link as LinkIcon, FileText, FileDown, CheckCircle2 } from 'lucide-react';
import { addWikiArticle } from '../../features/wikiSlice';
import { addNotification } from '../../features/notificationSlice';

const AddWikiContentModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState('article'); // 'article', 'link', 'pdf'
  const [category, setCategory] = useState('guias');
  const [linkedPhase, setLinkedPhase] = useState('all');
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    let emojiPrefix = '📝 ';
    if (contentType === 'link') emojiPrefix = '🔗 ';
    if (contentType === 'pdf') emojiPrefix = '📄 ';

    const newArticlePayload = {
      title: emojiPrefix + title.trim(),
      type: contentType,
      category,
      linkedPhase,
      url: url.trim(),
      content: content.trim(),
      author: user?.name || 'Analista PMO'
    };

    dispatch(addWikiArticle(newArticlePayload));

    dispatch(addNotification({
      title: 'Novo Conteúdo Adicionado',
      message: `O artigo "${title.trim()}" foi inserido com sucesso na Base de Conhecimento Wiki.`,
      type: 'info'
    }));

    setTitle('');
    setUrl('');
    setContent('');
    setContentType('article');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-xs space-y-4 p-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="text-blue-600 dark:text-blue-400" size={18} />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Inserir Novo Conteúdo / Artigo na Wiki
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3">
          
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
              Título do Conteúdo / Artigo *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Guia de Homologação de APIs CTI"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                Tipo de Conteúdo
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
              >
                <option value="article">📝 Artigo / Guia em Texto</option>
                <option value="link">🔗 Link Externo / Portal</option>
                <option value="pdf">📄 Documento / Anexo PDF</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
              >
                <option value="guias">Guias de Implantação</option>
                <option value="metodologias">Metodologias</option>
                <option value="processos">Processos & SI</option>
                <option value="financeiro">Capex / Opex</option>
                <option value="equipe">Pessoas & Áreas</option>
                <option value="ferramentas">Ferramentas</option>
                <option value="outros">Outros</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                Fase Vinculada (Opcional)
              </label>
              <select
                value={linkedPhase}
                onChange={(e) => setLinkedPhase(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
              >
                <option value="all">Todas as Fases</option>
                <option value="Iniciação">Iniciação & Charter</option>
                <option value="Planejamento">Planejamento & Requisitos</option>
                <option value="Execução">Execução & Integração</option>
                <option value="Homologação">Homologação & QA</option>
                <option value="Go-Live">Go-Live & Transição</option>
              </select>
            </div>
          </div>

          {(contentType === 'link' || contentType === 'pdf') && (
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
                {contentType === 'link' ? 'URL do Link Externo *' : 'Link ou Nome do Arquivo PDF *'}
              </label>
              <input
                type="text"
                required
                placeholder={contentType === 'link' ? 'https://exemplo.com/documento' : 'https://empresa.com/manuais/documento.pdf'}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">
              Resumo / Conteúdo Explicativo
            </label>
            <textarea
              rows="4"
              placeholder="Descreva o conteúdo do artigo, diretrizes ou orientações principais..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white font-medium"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-gray-100 dark:border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 font-bold rounded-xl hover:bg-gray-200 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Plus size={14} /> Salvar Conteúdo
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default AddWikiContentModal;
