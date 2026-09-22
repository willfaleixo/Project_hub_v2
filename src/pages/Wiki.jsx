import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  BookOpen, 
  ExternalLink, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  Users, 
  FileText, 
  Search, 
  HelpCircle,
  Layers,
  ChevronRight,
  Plus,
  Trash2,
  FileDown,
  Link as LinkIcon,
  Eye
} from 'lucide-react';
import { deleteWikiArticle } from '../features/wikiSlice';
import AddWikiContentModal from '../components/wiki/AddWikiContentModal';
import InlinePdfViewerModal from '../components/wiki/InlinePdfViewerModal';

const Wiki = () => {
  const dispatch = useDispatch();
  const { sections: wikiSections } = useSelector(state => state.wiki);
  const { translations: t } = useSelector(state => state.language);
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPdfArticle, setSelectedPdfArticle] = useState(null);

  const links = [
    { title: 'Genesys Cloud Portal', category: 'Ferramentas', url: 'https://login.mypurecloud.com', icon: '📞' },
    { title: 'Genesys AppFoundry', category: 'Ferramentas', url: 'https://appfoundry.genesys.com', icon: '🧩' },
    { title: 'NX Suite Workspace', category: 'Ferramentas', url: 'https://nxsuite.company.com', icon: '🚀' },
    { title: 'Jira Software & PMO', category: 'Gestão', url: 'https://jira.company.com', icon: '📋' },
    { title: 'Confluence Knowledge Base', category: 'Gestão', url: 'https://confluence.company.com', icon: '📚' }
  ];

  const filteredSections = wikiSections.filter(s => {
    const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || (s.content && s.content.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleDelete = (id) => {
    dispatch(deleteWikiArticle(id));
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 text-xs font-bold mb-3 border border-blue-400/30">
            <BookOpen size={14} /> Base de Conhecimento Oficial
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{t.wikiTitle}</h1>
          <p className="text-xs sm:text-sm text-blue-100/80 mt-1">{t.wikiSubtitle}</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="relative z-10 flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-blue-500/25 transition transform hover:scale-105"
        >
          <Plus size={16} />
          <span>+ Novo Artigo / Conteúdo</span>
        </button>
      </div>

      {/* Quick Access Links Bar */}
      <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm space-y-2">
        <h3 className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">{t.importantLinks}</h3>
        <div className="flex flex-wrap gap-2">
          {links.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-200 rounded-lg text-xs font-semibold transition border border-gray-200 dark:border-zinc-700"
            >
              <span>{link.icon}</span>
              <span>{link.title}</span>
              <ExternalLink size={12} className="text-gray-400" />
            </a>
          ))}
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar na Wiki..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-xl text-xs dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: 'Todos' },
            { id: 'guias', label: 'Guias de Implantação' },
            { id: 'metodologias', label: 'Metodologias' },
            { id: 'processos', label: 'Processos & SI' },
            { id: 'financeiro', label: 'Capex / Opex' },
            { id: 'equipe', label: 'Pessoas & Áreas' },
            { id: 'ferramentas', label: 'Ferramentas' },
            { id: 'outros', label: 'Outros' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-zinc-900 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-800 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Wiki Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSections.length === 0 ? (
          <div className="col-span-2 p-12 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 text-center text-gray-400 text-xs">
            Nenhum artigo ou conteúdo encontrado para esta pesquisa.
          </div>
        ) : (
          filteredSections.map((section) => (
            <div
              key={section.id}
              className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span>{section.title}</span>
                  </h3>
                  {section.isCustom && (
                    <button
                      onClick={() => handleDelete(section.id)}
                      className="text-gray-400 hover:text-red-500 p-1 transition"
                      title="Excluir Artigo"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {section.content && (
                  <div className="text-xs text-gray-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line font-normal">
                    {section.content}
                  </div>
                )}
              </div>

              {/* Action Buttons for URLs / PDFs */}
              {section.url && (
                <div className="pt-3 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400">
                    {section.author ? `Por: ${section.author}` : 'Documento Oficial'}
                  </span>
                  {section.type === 'pdf' ? (
                    <button
                      type="button"
                      onClick={() => setSelectedPdfArticle(section)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition shadow-sm"
                    >
                      <Eye size={14} /> Preview PDF
                    </button>
                  ) : (
                    <a
                      href={section.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold rounded-lg text-xs transition border border-blue-200 dark:border-blue-800 shadow-sm"
                    >
                      <ExternalLink size={14} /> Acessar Link
                    </a>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Content Modal */}
      <AddWikiContentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* Inline PDF Viewer Modal */}
      <InlinePdfViewerModal
        isOpen={!!selectedPdfArticle}
        onClose={() => setSelectedPdfArticle(null)}
        article={selectedPdfArticle}
      />

    </div>
  );
};

export default Wiki;
