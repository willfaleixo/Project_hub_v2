import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  CheckSquare, 
  ShieldAlert, 
  HelpCircle, 
  Users, 
  GitPullRequest, 
  FolderDown, 
  Clock,
  AlertTriangle,
  Flame,
  Star,
  Printer,
  Edit3,
  History,
  BookOpen
} from 'lucide-react';
import ProjectGantt from '../components/projects/ProjectGantt';
import ProjectTaskManager from '../components/projects/ProjectTaskManager';
import RaciMatrix from '../components/projects/RaciMatrix';
import RiskAnalysis from '../components/projects/RiskAnalysis';
import OpenPoints from '../components/projects/OpenPoints';
import { ChangeMatrix, FileUploader, EmailLog, ApprovalWorkflow } from '../components/projects/ChangeMatrixComponents';
import BBPExportModal from '../components/projects/BBPExportModal';
import EditProjectModal from '../components/projects/EditProjectModal';
import { calculateProjectHealthScore } from '../utils/healthScore';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { groups, selectedProjectId } = useSelector(state => state.projects);
  const { user } = useSelector(state => state.auth);
  const { translations: t } = useSelector(state => state.language);
  const { sections: wikiSections } = useSelector(state => state.wiki);

  const isEditable = user?.role !== 'VIEWER';
  const [activeModalType, setActiveModalType] = useState(null);
  const [isBBPModalOpen, setIsBBPModalOpen] = useState(false);

  const targetId = id || searchParams.get('id') || selectedProjectId || 'p_1';
  const allProjects = groups.flatMap(g => g.projects);
  const project = allProjects.find(p => p.id === targetId) || allProjects[0];

  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam || 'overview');

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  if (!project) {
    return (
      <div className="p-8 text-center text-gray-500">
        <h2>Projeto não encontrado</h2>
        <button onClick={() => navigate('/projects')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Voltar para Projetos
        </button>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: t.overviewTab, icon: FileText },
    { key: 'gantt', label: t.ganttTab, icon: Calendar },
    { key: 'tasks', label: t.tasksTab, icon: CheckSquare },
    { key: 'risks', label: t.risksTab, icon: ShieldAlert },
    { key: 'openPoints', label: t.openPointsTab, icon: HelpCircle },
    { key: 'raci', label: t.raciTab, icon: Users },
    { key: 'changes', label: t.changeMatrixTab, icon: GitPullRequest },
    { key: 'files', label: t.filesTab, icon: FolderDown },
    { key: 'approvals', label: t.approvalTab, icon: Clock },
    { key: 'history', label: t.historyTab || 'Histórico de Modificações', icon: History }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:bg-gray-50 transition shadow-sm"
        >
          <ArrowLeft size={16} /> Voltar para Projetos
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBBPModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white font-bold rounded-lg text-xs transition shadow-sm"
            title="Gerar e Exportar Business Blueprint do Projeto em PDF"
          >
            <Printer size={14} />
            <span>📄 Exportar BBP em PDF</span>
          </button>

          {(() => {
            const health = calculateProjectHealthScore(project);
            if (health.status === 'red' || health.status === 'yellow') {
              return (
                <span className={`px-3 py-1 rounded-full text-xs uppercase font-black border ${health.badgeClass}`} title={health.reason}>
                  SAÚDE: {health.label} ({health.reason})
                </span>
              );
            }
            return null;
          })()}

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
            {project.status}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300">
            {project.area}
          </span>
        </div>
      </div>

      {/* Project Master Header Banner */}
      <div className="p-6 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-sm space-y-4 relative group">
        {isEditable && (
          <button
            onClick={() => setActiveModalType('header')}
            className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-600 dark:text-zinc-300 hover:text-blue-600 rounded-xl transition shadow-sm flex items-center gap-1 text-xs font-bold"
            title="Editar Informações Mestre do Projeto"
          >
            <Edit3 size={14} /> Editar Mestre
          </button>
        )}

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pr-24 md:pr-32">
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">
              <span>{project.groupName}</span>
              <span>•</span>
              <span>{project.implementationType}</span>
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{project.title}</h1>
            <p className="text-xs text-gray-500 mt-1">
              Responsável: <span className="font-semibold text-gray-800 dark:text-zinc-200">{project.responsible}</span> | Data de Início: <span className="font-semibold">{project.startDate}</span> | Go Live Esperado: <span className="font-semibold text-emerald-600">{project.goLiveDate || project.estimatedEnd}</span>
            </p>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div>
              <div className="text-[10px] text-gray-400 uppercase font-bold">Progresso Geral</div>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400">{project.progress?.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        {/* Highlights & Red Flags Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-xl text-xs space-y-1 relative">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <Star size={14} /> Highlights Recentes
              </span>
              {isEditable && (
                <button
                  onClick={() => setActiveModalType('highlights')}
                  className="p-1 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded transition"
                  title="Gerenciar Highlights"
                >
                  <Edit3 size={13} />
                </button>
              )}
            </div>
            {project.highlights && project.highlights.length > 0 ? (
              project.highlights.map(h => <p key={h.id} className="text-emerald-900 dark:text-emerald-200">• {h.text}</p>)
            ) : (
              <p className="text-gray-400 italic">Nenhum destaque cadastrado recente.</p>
            )}
          </div>

          <div className="p-3 bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl text-xs space-y-1 relative">
            <div className="flex items-center justify-between">
              <span className="font-bold text-red-700 dark:text-red-400 flex items-center gap-1">
                <Flame size={14} /> Red Flags & Alertas Críticos
              </span>
              {isEditable && (
                <button
                  onClick={() => setActiveModalType('redFlags')}
                  className="p-1 text-red-700 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/50 rounded transition"
                  title="Gerenciar Red Flags"
                >
                  <Edit3 size={13} />
                </button>
              )}
            </div>
            {project.redFlags && project.redFlags.length > 0 ? (
              project.redFlags.map(rf => <p key={rf.id} className="text-red-900 dark:text-red-200">• {rf.description}</p>)
            ) : (
              <p className="text-gray-400 italic">Sem red flags registradas no momento.</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-1 overflow-x-auto p-1 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-700 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Rendering */}
      <div className="pt-2">
        {activeTab === 'overview' && (
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6 relative">
            {isEditable && (
              <button
                onClick={() => setActiveModalType('overview')}
                className="absolute top-5 right-5 px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-700 dark:text-zinc-300 hover:text-blue-600 rounded-xl transition text-xs font-bold flex items-center gap-1"
                title="Editar Visão Geral & Termo"
              >
                <Edit3 size={14} /> Editar Termo
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{t.summary}</h4>
                  <p className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed">{project.summary || 'Sem resumo cadastrado.'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{t.expectedGains}</h4>
                  <p className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed">{project.expectedGains || 'Não informado.'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{t.metrics}</h4>
                  <p className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed">{project.metrics || 'Não informado.'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{t.drivers}</h4>
                  <p className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed">{project.drivers || 'Não informado.'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{t.outOfScope}</h4>
                  <p className="text-xs text-gray-700 dark:text-zinc-300 leading-relaxed">{project.outOfScope || 'Não informado.'}</p>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider">{t.requirements}</h4>
                    {isEditable && (
                      <button
                        onClick={() => setActiveModalType('requirements')}
                        className="text-[11px] text-blue-600 hover:underline font-bold flex items-center gap-0.5"
                      >
                        <Edit3 size={12} /> Gerenciar
                      </button>
                    )}
                  </div>
                  <div className="space-y-1">
                    {project.requirements && project.requirements.map(r => (
                      <div key={r.id} className="text-xs flex items-center gap-2">
                        {r.isRedLine ? (
                          <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded">RED LINE</span>
                        ) : (
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-bold rounded">PADRÃO</span>
                        )}
                        <span className="text-gray-800 dark:text-zinc-200">{r.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended Wiki Articles for Current Phase */}
            <div className="pt-4 border-t border-gray-100 dark:border-zinc-800 space-y-3">
              <h4 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <BookOpen size={16} className="text-blue-500" />
                Artigos & Guias da Wiki para a Fase: <span className="text-blue-600 dark:text-blue-400 font-extrabold">{project.phase || 'Geral'}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {wikiSections.slice(0, 2).map((art) => (
                  <div key={art.id} className="p-3 bg-blue-50/40 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/60 space-y-1 text-xs">
                    <h5 className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                      <span>{art.title}</span>
                    </h5>
                    <p className="text-[11px] text-gray-600 dark:text-zinc-300 line-clamp-2 font-normal">
                      {art.content}
                    </p>
                    <button
                      onClick={() => navigate('/wiki')}
                      className="text-[10px] text-blue-600 dark:text-blue-400 font-bold hover:underline pt-1 inline-block"
                    >
                      Ler artigo completo na Wiki →
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {activeTab === 'gantt' && <ProjectGantt project={project} />}
        {activeTab === 'tasks' && <ProjectTaskManager project={project} />}
        {activeTab === 'risks' && <RiskAnalysis project={project} />}
        {activeTab === 'openPoints' && <OpenPoints project={project} />}
        {activeTab === 'raci' && <RaciMatrix project={project} />}
        {activeTab === 'changes' && <ChangeMatrix project={project} />}
        {activeTab === 'files' && (
          <div className="space-y-4">
            <FileUploader project={project} />
            <EmailLog project={project} />
          </div>
        )}
        {activeTab === 'approvals' && <ApprovalWorkflow project={project} />}
        {activeTab === 'history' && <ChangeMatrix project={project} />}
      </div>

      {/* BBP Export Modal */}
      <BBPExportModal
        isOpen={isBBPModalOpen}
        onClose={() => setIsBBPModalOpen(false)}
        project={project}
      />

      {/* Edit Project Section Modal */}
      <EditProjectModal
        isOpen={!!activeModalType}
        onClose={() => setActiveModalType(null)}
        project={project}
        modalType={activeModalType}
      />

    </div>
  );
};

export default ProjectDetails;
