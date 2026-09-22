import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MessageSquare, Send, X, AtSign, User } from 'lucide-react';
import { updateProjectFieldWithAudit } from '../../features/projectSlice';
import { addNotification } from '../../features/notificationSlice';

const ItemCommentsDrawer = ({ isOpen, onClose, project, item, itemType = 'item' }) => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const [commentText, setCommentText] = useState('');
  const [showMentionMenu, setShowMentionMenu] = useState(false);

  if (!isOpen || !item) return null;

  const analysts = ['Claudia', 'Bruno', 'Pedro', 'Daniela', 'Julia', 'Alex Low'];
  const comments = item.comments || [
    { id: 'c1', author: 'Claudia', text: 'Alinhado com a equipe de TI. Homologação agendada.', timestamp: '15/09 14:30' },
    { id: 'c2', author: 'Bruno', text: 'Favor verificar se há dependência com a SI.', timestamp: '15/09 16:10' }
  ];

  const handleInputChange = (e) => {
    const val = e.target.value;
    setCommentText(val);
    if (val.endsWith('@')) {
      setShowMentionMenu(true);
    } else if (!val.includes('@')) {
      setShowMentionMenu(false);
    }
  };

  const handleSelectMention = (name) => {
    setCommentText(prev => prev + name + ' ');
    setShowMentionMenu(false);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment = {
      id: 'cmt_' + Date.now(),
      author: user?.name || 'Alex Low',
      text: commentText.trim(),
      timestamp: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedComments = [...comments, newComment];

    // Find mentioned users
    analysts.forEach(name => {
      if (commentText.includes('@' + name)) {
        dispatch(addNotification({
          title: `Mencionado em comentário`,
          message: `${user?.name || 'Alguém'} mencionou você no ${itemType} "${item.title || item.description}" do projeto ${project.title}.`,
          type: 'mention'
        }));
      }
    });

    // Update item comments depending on itemType (tasks, risks, openPoints)
    let updatedField = {};
    if (itemType === 'task') {
      const updated = (project.tasks || []).map(t => t.id === item.id ? { ...t, comments: updatedComments } : t);
      updatedField = { tasks: updated };
    } else if (itemType === 'risk') {
      const updated = (project.risks || []).map(r => r.id === item.id ? { ...r, comments: updatedComments } : r);
      updatedField = { risks: updated };
    } else {
      const updated = (project.openPoints || []).map(op => op.id === item.id ? { ...op, comments: updatedComments } : op);
      updatedField = { openPoints: updated };
    }

    dispatch(updateProjectFieldWithAudit({
      projectId: project.id,
      updates: updatedField,
      fieldLabel: `Comentário em ${itemType}`,
      oldValue: `Total de comentários: ${comments.length}`,
      newValue: `Novo comentário: "${commentText.trim().substring(0, 40)}..."`,
      user
    }));

    setCommentText('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-6 animate-in slide-in-from-right duration-200 text-xs">
        
        {/* Header */}
        <div className="space-y-2 border-b border-gray-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-500" />
              Discussão & Comentários
            </h3>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-white">
              <X size={18} />
            </button>
          </div>
          <div className="p-2.5 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-200/60 dark:border-blue-800 text-blue-900 dark:text-blue-200">
            <span className="font-bold block capitalize">{itemType}: {item.title || item.description}</span>
            <span className="text-[10px] text-gray-500 dark:text-zinc-400">Projeto: {project.title}</span>
          </div>
        </div>

        {/* Comment Thread List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {comments.length === 0 ? (
            <div className="p-8 text-center text-gray-400">Sem comentários ainda. Seja o primeiro a comentar!</div>
          ) : (
            comments.map((c) => (
              <div key={c.id} className="p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-2xl border border-gray-100 dark:border-zinc-800 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-gray-900 dark:text-white">
                    <User size={12} className="text-blue-500" />
                    <span>{c.author}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{c.timestamp}</span>
                </div>
                <p className="text-gray-700 dark:text-zinc-300 leading-relaxed text-[11px]">{c.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        <div className="relative border-t border-gray-100 dark:border-zinc-800 pt-3 space-y-2">
          {showMentionMenu && (
            <div className="absolute bottom-full mb-2 left-0 w-48 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xl py-1 z-50">
              <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase">Mencionar Analista</div>
              {analysts.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => handleSelectMention(name)}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-50 dark:hover:bg-zinc-700 text-xs font-semibold text-gray-800 dark:text-zinc-200 flex items-center gap-1.5"
                >
                  <AtSign size={12} className="text-blue-500" />
                  {name}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Escreva um comentário... Use @ para mencionar"
              value={commentText}
              onChange={handleInputChange}
              className="flex-1 px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition flex items-center gap-1"
            >
              <Send size={14} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default ItemCommentsDrawer;
