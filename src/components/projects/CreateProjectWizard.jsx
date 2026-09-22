import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Check, ChevronRight, ChevronLeft, AlertCircle, DollarSign, Calendar, Users, ShieldAlert } from 'lucide-react';
import { addProject } from '../../features/projectSlice';
import { addApprovalRequest } from '../../features/approvalSlice';
import { addNotification } from '../../features/notificationSlice';

const CreateProjectWizard = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { translations: t } = useSelector(state => state.language);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    groupName: 'AGGB',
    responsible: '',
    requester: '',
    area: 'Corporate',
    roiEstimate: '',
    implementationType: 'CTI / Telefonia',
    startDate: '',
    goLiveDate: '',
    summary: '',
    expectedGains: '',
    requirements: '',
    metrics: '',
    drivers: '',
    outOfScope: '',
    capex: '',
    opex: '',
    keyMilestones: '',
    teamResources: '',
    supportResources: '',
    processOwner: '',
    stakeholders: '',
    finalClient: '',
    risks: '',
    mustHave: '',
    shouldHave: '',
    preparedBy: ''
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const projectId = 'p_' + Date.now();
    const newProject = {
      id: projectId,
      title: formData.title || 'Novo Projeto',
      groupName: formData.groupName,
      status: 'Aguardando Aprovação',
      responsible: formData.responsible || 'Analista',
      deadlineAlert: 'green',
      progress: 0,
      effortAlert: 'green',
      estimatedEnd: formData.goLiveDate ? formData.goLiveDate.slice(5) : 'TBD',
      implementationType: formData.implementationType,
      startDate: formData.startDate || new Date().toISOString().split('T')[0],
      goLiveDate: formData.goLiveDate,
      phase: 'Em Análise de Aprovação',
      area: formData.area,
      capex: parseFloat(formData.capex) || 0,
      opex: parseFloat(formData.opex) || 0,
      realizedGain: 0,
      summary: formData.summary,
      expectedGains: formData.expectedGains,
      metrics: formData.metrics,
      drivers: formData.drivers,
      outOfScope: formData.outOfScope,
      redFlags: [],
      highlights: [],
      requirements: formData.requirements
        ? formData.requirements.split('\n').map((r, i) => ({ id: 'r_' + i, text: r, isRedLine: i === 0 }))
        : [],
      openPoints: [],
      tasks: [],
      raci: [
        { role: 'Proprietário', person: formData.processOwner || 'N/A', code: 'A' },
        { role: 'Responsável', person: formData.responsible || 'N/A', code: 'R' }
      ],
      risks: formData.risks
        ? [{ id: 'rk_1', category: 'Geral', description: formData.risks, impact: 'Médio', mitigation: 'Acompanhamento PMO' }]
        : [],
      changeMatrix: [],
      files: [],
      emailLogs: []
    };

    dispatch(addProject(newProject));

    dispatch(addApprovalRequest({
      projectId,
      projectName: newProject.title,
      groupName: newProject.groupName,
      requester: formData.requester || 'Solicitante',
      type: 'Termo de Abertura de Projeto',
      comments: `ROI Estimado: ${formData.roiEstimate || 'Não informado'}. Requerimento principal: ${formData.summary}`
    }));

    dispatch(addNotification({
      title: 'Projeto Enviado para Aprovação',
      message: `O Termo de Abertura do projeto "${newProject.title}" foi enviado com sucesso.`,
      type: 'approval'
    }));

    onClose();
    setStep(1);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/50 dark:bg-zinc-800/40">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="text-blue-600 dark:text-blue-400" size={20} />
              Termo de Abertura de Projeto (Charter)
            </h2>
            <p className="text-xs text-gray-500 dark:text-zinc-400">Preenchimento estruturado baseado na norma corporativa</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800">
            <X size={18} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-blue-50/50 dark:bg-blue-950/20 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between text-xs font-semibold">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className={`flex items-center gap-2 ${step === s ? 'text-blue-600 dark:text-blue-400 font-bold' : step > s ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
              <div className={`size-6 rounded-full flex items-center justify-center text-[11px] ${step === s ? 'bg-blue-600 text-white' : step > s ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-zinc-800 text-gray-500'}`}>
                {step > s ? <Check size={12} /> : s}
              </div>
              <span className="hidden sm:inline">
                {s === 1 && 'Geral & ROI'}
                {s === 2 && 'Visão & Escopo'}
                {s === 3 && 'Custos & Datas'}
                {s === 4 && 'RACI & Riscos'}
              </span>
            </div>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{t.step1}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Nome do Projeto *</label>
                  <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Ex: Migração Genesys CTI" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Grupo / Cliente *</label>
                  <select name="groupName" value={formData.groupName} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white">
                    <option value="AGGB">AGGB</option>
                    <option value="Be-fun">Be-fun</option>
                    <option value="Corporate">Corporate</option>
                    <option value="LatAm Operations">LatAm Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Requerente do Projeto *</label>
                  <input type="text" name="requester" required value={formData.requester} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Ex: Claudia" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Responsável pelo Projeto (PM) *</label>
                  <input type="text" name="responsible" required value={formData.responsible} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Ex: Daniela" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Área Requerente</label>
                  <select name="area" value={formData.area} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white">
                    <option value="Corporate">Corporate</option>
                    <option value="Ecomm">Ecomm Business</option>
                    <option value="Lentes">Lentes</option>
                    <option value="Frames">Frames</option>
                    <option value="LatAm">LatAm</option>
                    <option value="Lab">Lab</option>
                    <option value="CTI">CTI / Inovação</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Tipo de Implementação</label>
                  <input type="text" name="implementationType" value={formData.implementationType} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Ex: CTI, E-commerce, Nova Operação" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">ROI Estimado & Prazo de Retorno</label>
                <input type="text" name="roiEstimate" value={formData.roiEstimate} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Ex: Retorno de R$ 150.000 em 12 meses (Payback em 8 meses)" />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{t.step2}</h3>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Resumo Executivo do Projeto</label>
                <textarea name="summary" rows={2} value={formData.summary} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Visão geral dos objetivos principais..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Ganhos Esperados / Objetivos (Goals)</label>
                <textarea name="expectedGains" rows={2} value={formData.expectedGains} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Resultados diretos esperados..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Métricas & KPIs Envolvidas</label>
                  <input type="text" name="metrics" value={formData.metrics} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Ex: TMA, NPS, Conversão %" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Drivers de Negócio</label>
                  <input type="text" name="drivers" value={formData.drivers} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Ex: Eficiência Operacional, Experiência do Cliente" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Requerimentos Principais (1 por linha - o 1º será Red Line)</label>
                <textarea name="requirements" rows={2} value={formData.requirements} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Digitar requerimentos em linhas separadas..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Fora do Escopo</label>
                <input type="text" name="outOfScope" value={formData.outOfScope} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Ex: Desenvolvimento mobile nativo" />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{t.step3}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Data de Início Prevista</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Data de Go Live Esperada</label>
                  <input type="date" name="goLiveDate" value={formData.goLiveDate} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Capex Estimado (R$)</label>
                  <input type="number" name="capex" value={formData.capex} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="150000" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Opex Anual Estimado (R$)</label>
                  <input type="number" name="opex" value={formData.opex} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="25000" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Marcos-Chave do Cronograma</label>
                <textarea name="keyMilestones" rows={2} value={formData.keyMilestones} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Ex: M1 - Validação de Requisitos (30d), M2 - Homologação (60d)..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Recursos da Equipe de Projeto</label>
                  <input type="text" name="teamResources" value={formData.teamResources} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Ex: 2 Devs, 1 QA, 1 PM" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Recursos de Suporte Necessários</label>
                  <input type="text" name="supportResources" value={formData.supportResources} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Ex: Infraestrutura, SI, Jurídico" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{t.step4}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Proprietário do Processo</label>
                  <input type="text" name="processOwner" value={formData.processOwner} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Ex: Gerente de Operações" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Principais Stakeholders</label>
                  <input type="text" name="stakeholders" value={formData.stakeholders} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Ex: Diretoria, TI, Comercial" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Cliente Final</label>
                  <input type="text" name="finalClient" value={formData.finalClient} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Ex: Clientes B2B & B2C" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Principais Riscos Iniciais</label>
                <textarea name="risks" rows={2} value={formData.risks} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Descreva os riscos e mitigações propostas..." />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Restrições Must Have (Indispensáveis)</label>
                  <input type="text" name="mustHave" value={formData.mustHave} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Ex: Aprovação de SI até dia 15" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Restrições Should Have (Desejáveis)</label>
                  <input type="text" name="shouldHave" value={formData.shouldHave} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Ex: Dashboard BI em tempo real" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-zinc-300 mb-1">Preparado por (Assinatura digital do autor)</label>
                <input type="text" name="preparedBy" value={formData.preparedBy} onChange={handleChange} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white" placeholder="Seu nome completo" />
              </div>
            </div>
          )}

          {/* Modal Footer Controls */}
          <div className="pt-4 border-t border-gray-200 dark:border-zinc-800 flex items-center justify-between">
            {step > 1 ? (
              <button type="button" onClick={() => setStep(step - 1)} className="flex items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-200 rounded-lg text-xs font-semibold hover:bg-gray-200 dark:hover:bg-zinc-700 transition">
                <ChevronLeft size={16} /> Voltar
              </button>
            ) : <div />}

            {step < 4 ? (
              <button type="button" onClick={() => setStep(step + 1)} className="flex items-center gap-1 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow">
                Avançar <ChevronRight size={16} />
              </button>
            ) : (
              <button type="submit" className="flex items-center gap-1.5 px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg text-xs font-bold transition shadow-md">
                <Check size={16} /> {t.submitForApproval}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateProjectWizard;
