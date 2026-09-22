import React from 'react';
import { X, FileText, Download, ExternalLink } from 'lucide-react';

const InlinePdfViewerModal = ({ isOpen, onClose, article }) => {
  if (!isOpen || !article) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl w-full max-w-4xl h-[85vh] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 bg-gray-50 dark:bg-zinc-800/80 border-b border-gray-200 dark:border-zinc-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-blue-500" />
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-md">{article.title}</h3>
              <p className="text-[10px] text-gray-500">{article.author ? `Publicado por ${article.author}` : 'Documento PDF Oficial'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={article.url}
              download
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 shadow-sm"
            >
              <Download size={14} /> Download PDF
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PDF Viewer Frame */}
        <div className="flex-1 bg-gray-100 dark:bg-zinc-950 p-2">
          {article.url ? (
            <iframe
              src={article.url}
              title={article.title}
              className="w-full h-full rounded-xl border border-gray-300 dark:border-zinc-800"
            />
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-gray-400">
              Visualização indisponível para este arquivo.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default InlinePdfViewerModal;
