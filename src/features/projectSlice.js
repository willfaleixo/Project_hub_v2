import { createSlice } from '@reduxjs/toolkit';

const initialGroups = [
  {
    id: 'grp_1',
    title: 'AGGB',
    progress: 41.0,
    deadlineAlert: 'yellow',
    effortAlert: 'green',
    projects: [
      {
        id: 'p_1',
        title: 'Consultoria em Gestão de Projetos',
        groupName: 'AGGB',
        status: 'Proposto',
        responsible: 'Claudia',
        deadlineAlert: 'green',
        progress: 90.0,
        effortAlert: 'green',
        estimatedEnd: '17/10',
        implementationType: 'Consultoria & Processos',
        startDate: '2026-06-01',
        goLiveDate: '2026-10-17',
        phase: 'Planejamento / Aprovação',
        area: 'Corporate',
        capex: 45000,
        opex: 12000,
        realizedGain: 85000,
        summary: 'Consultoria especializada para padronizar frameworks de gestão e acelerar entregas dos projetos corporativos.',
        expectedGains: 'Aumento de 35% na previsibilidade de entregas e redução de atrasos operacionais.',
        metrics: 'Taxa de conclusão no prazo, cumprimento de marcos (SPI), satisfação dos executivos (NPS interno).',
        drivers: 'Excelência Operacional, Governança PMO, Eficiência Metodológica.',
        outOfScope: 'Treinamento presencial individual para toda a força de campo fora da matriz.',
        redFlags: [
          { id: 'rf1', severity: 'High', description: 'Atraso na validação da proposta com diretoria financeira', date: '2026-09-10' }
        ],
        highlights: [
          { id: 'h1', text: 'Concluído diagnóstico inicial da maturidade dos projetos em 90%', date: '2026-09-12' }
        ],
        requirements: [
          { id: 'r1', text: 'Aprovação formal do Termo de Abertura pelo Sponsor', isRedLine: true },
          { id: 'r2', text: 'Definição das metas de ROI e métricas de acompanhamento', isRedLine: false }
        ],
        openPoints: [
          { id: 'op1', title: 'Ajustar agenda com a diretoria para assinatura do charter', owner: 'Claudia', status: 'Em aberto', dueDate: '2026-09-20' }
        ],
        tasks: [
          { id: 't1', title: 'Elaborar minuta da Matriz RACI', assignee: 'Claudia', priority: 'High', dueDate: '2026-09-18', completed: true },
          { id: 't2', title: 'Validar formulário com equipe de SI', assignee: 'Claudia', priority: 'Medium', dueDate: '2026-09-22', completed: false }
        ],
        raci: [
          { role: 'Sponsor Executivo', person: 'Diretor de Operações', code: 'A' },
          { role: 'Gerente do Projeto', person: 'Claudia', code: 'R' },
          { role: 'Analista de Processos', person: 'Bruno', code: 'C' }
        ],
        risks: [
          { id: 'rk1', category: 'Recursos', description: 'Conflito de agenda de consultores seniores', impact: 'Alto', mitigation: 'Alocação dedicada por contrato' }
        ],
        changeMatrix: [
          {
            id: 'cm_1',
            date: '15/09/2026 14:22',
            author: 'Claudia (GERENTE)',
            field: 'Go Live Esperado',
            oldValue: '10/10/2026',
            newValue: '17/10/2026',
            description: 'Ajuste no prazo final de entrega homologado com comitê executivo.'
          },
          {
            id: 'cm_2',
            date: '12/09/2026 10:15',
            author: 'Bruno (ANALISTA)',
            field: 'Highlights',
            oldValue: 'Diagnóstico em 80%',
            newValue: 'Concluído diagnóstico inicial da maturidade dos projetos em 90%',
            description: 'Atualização do percentual de avanço do diagnóstico inicial.'
          },
          {
            id: 'cm_3',
            date: '10/09/2026 16:45',
            author: 'Claudia (GERENTE)',
            field: 'Red Flags',
            oldValue: 'Sem alertas',
            newValue: 'Atraso na validação da proposta com diretoria financeira',
            description: 'Inclusão de Red Flag referente à pendência de validação financeira.'
          }
        ],
        files: [
          { id: 'f1', name: 'Termo_de_Abertura_AGGB_Consultoria.pdf', size: '2.4 MB', date: '2026-09-14' }
        ],
        emailLogs: [
          { id: 'em1', subject: 'Solicitação de Aprovação do Projetos AGGB', to: 'diretoria@empresa.com', date: '2026-09-14 14:30' }
        ]
      },
      {
        id: 'p_2',
        title: 'Web Site',
        groupName: 'AGGB',
        status: 'Em andamento',
        responsible: 'Daniela',
        deadlineAlert: 'yellow',
        progress: 10.0,
        effortAlert: 'yellow',
        estimatedEnd: '17/10',
        implementationType: 'eCommerce / Frontend',
        startDate: '2026-07-15',
        goLiveDate: '2026-10-17',
        phase: 'Desenvolvimento Frontend & UI',
        area: 'Ecomm',
        capex: 120000,
        opex: 25000,
        realizedGain: 210000,
        summary: 'Reformulação total do portal web com design system moderno, internacionalização e checkout otimizado.',
        expectedGains: 'Conversão +25%, tempo de carregamento < 1.2s, suporte a PT/EN/ES.',
        metrics: 'Taxa de conversão web, tempo de permanência, pontuação Lighthouse.',
        drivers: 'Crescimento de Receita Digital, Expansão Internacional.',
        outOfScope: 'Desenvolvimento de aplicativo nativo iOS/Android.',
        redFlags: [],
        highlights: [
          { id: 'h2', text: 'Layouts e protótipo interativo homologados pela equipe de marca', date: '2026-09-11' }
        ],
        requirements: [
          { id: 'r3', text: 'Integração nativa com Gateway de Pagamentos e Checkout Transparente', isRedLine: true }
        ],
        openPoints: [
          { id: 'op2', title: 'Definir credenciais do gateway em homologação', owner: 'Daniela', status: 'Em andamento', dueDate: '2026-09-25' }
        ],
        tasks: [
          { id: 't3', title: 'Implementar seletor de idiomas no header', assignee: 'Daniela', priority: 'Urgent', dueDate: '2026-09-16', completed: true },
          { id: 't4', title: 'Integrar componentes de checkout', assignee: 'Daniela', priority: 'High', dueDate: '2026-09-30', completed: false }
        ],
        raci: [
          { role: 'Liderança de Produto', person: 'Daniela', code: 'R' }
        ],
        risks: [],
        changeMatrix: [],
        files: [],
        emailLogs: []
      }
    ]
  },
  {
    id: 'grp_2',
    title: 'Be-fun',
    progress: 16.0,
    deadlineAlert: 'yellow',
    effortAlert: 'yellow',
    projects: [
      {
        id: 'p_3',
        title: 'Implementação de Software',
        groupName: 'Be-fun',
        status: 'Pendente',
        responsible: 'Pedro',
        deadlineAlert: 'yellow',
        progress: 0.0,
        effortAlert: 'green',
        estimatedEnd: '30/04',
        implementationType: 'Nova Operação / SaaS',
        startDate: '2026-09-01',
        goLiveDate: '2027-04-30',
        phase: 'Análise de Requisitos & SI',
        area: 'Lab',
        capex: 80000,
        opex: 18000,
        realizedGain: 150000,
        summary: 'Implantação da nova plataforma ERP e integração de laboratórios de controle de qualidade.',
        expectedGains: 'Rastreabilidade 100% automatizada de amostras e laudos técnicos.',
        metrics: 'Acurácia de estoque, tempo de emissão de laudos.',
        drivers: 'Conformidade Regulatória, Automação de Laboratórios.',
        outOfScope: 'Customizações fora do padrão da API oficial da plataforma.',
        redFlags: [],
        highlights: [],
        requirements: [
          { id: 'r4', text: 'Validação de fornecedor pela área de Segurança da Informação (SI)', isRedLine: true }
        ],
        openPoints: [],
        tasks: [],
        raci: [],
        risks: [],
        changeMatrix: [],
        files: [],
        emailLogs: []
      },
      {
        id: 'p_4',
        title: 'Projeto Implantação',
        groupName: 'Be-fun',
        status: 'Pendente',
        responsible: 'Bruno',
        deadlineAlert: 'yellow',
        progress: 41.0,
        effortAlert: 'red',
        estimatedEnd: '15/11',
        implementationType: 'CTI / Telefonia Genesys',
        startDate: '2026-05-10',
        goLiveDate: '2026-11-15',
        phase: 'Integração de APIs',
        area: 'CTI',
        capex: 210000,
        opex: 42000,
        realizedGain: 340000,
        summary: 'Migração de central de atendimento telefônico para Genesys Cloud com suporte a omnicanalidade.',
        expectedGains: 'Redução do tempo médio de atendimento (TMA) em 20%.',
        metrics: 'TMA, TME, First Contact Resolution (FCR).',
        drivers: 'Satisfação do Cliente, Modernização Tecnológica.',
        outOfScope: 'Atendimento via WhatsApp não oficial.',
        redFlags: [
          { id: 'rf2', severity: 'Critical', description: 'Prazo estourado para solicitação de Forecast MIS', date: '2026-09-14' }
        ],
        highlights: [],
        requirements: [],
        openPoints: [],
        tasks: [],
        raci: [],
        risks: [],
        changeMatrix: [],
        files: [],
        emailLogs: []
      },
      {
        id: 'p_5',
        title: 'Consultoria em Gestão de Processos',
        groupName: 'Be-fun',
        status: 'Pendente Cliente',
        responsible: 'Julia',
        deadlineAlert: 'red',
        progress: 85.33,
        effortAlert: 'red',
        estimatedEnd: '25/10',
        implementationType: 'Processos & Qualidade',
        startDate: '2026-04-01',
        goLiveDate: '2026-10-25',
        phase: 'Homologação pelo Cliente',
        area: 'LatAm',
        capex: 65000,
        opex: 9000,
        realizedGain: 110000,
        summary: 'Revisão dos fluxos de suprimento e logística para operação América Latina.',
        expectedGains: 'Padronização dos processos operacionais nos hubs regionais.',
        metrics: 'Lead time de despacho internacional.',
        drivers: 'Otimização Logística Latin America.',
        outOfScope: 'Logística reversa corporativa global.',
        redFlags: [],
        highlights: [],
        requirements: [],
        openPoints: [],
        tasks: [],
        raci: [],
        risks: [],
        changeMatrix: [],
        files: [],
        emailLogs: []
      }
    ]
  }
];

export const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    groups: initialGroups,
    selectedProjectId: 'p_1'
  },
  reducers: {
    selectProject: (state, action) => {
      state.selectedProjectId = action.payload;
    },
    addProject: (state, action) => {
      const newProj = action.payload;
      let grp = state.groups.find(g => g.title === newProj.groupName);
      if (!grp) {
        grp = {
          id: 'grp_' + Date.now(),
          title: newProj.groupName || 'Geral',
          progress: 0,
          deadlineAlert: 'green',
          effortAlert: 'green',
          projects: []
        };
        state.groups.push(grp);
      }
      grp.projects.push(newProj);
    },
    updateProject: (state, action) => {
      const updated = action.payload;
      for (const grp of state.groups) {
        const idx = grp.projects.findIndex(p => p.id === updated.id);
        if (idx !== -1) {
          grp.projects[idx] = { ...grp.projects[idx], ...updated };
          break;
        }
      }
    },
    addTaskToProject: (state, action) => {
      const { projectId, task } = action.payload;
      for (const grp of state.groups) {
        const p = grp.projects.find(proj => proj.id === projectId);
        if (p) {
          if (!p.tasks) p.tasks = [];
          p.tasks.push({
            id: 't_' + Date.now(),
            completed: false,
            ...task
          });
          break;
        }
      }
    },
    toggleTaskCompleted: (state, action) => {
      const { projectId, taskId } = action.payload;
      for (const grp of state.groups) {
        const p = grp.projects.find(proj => proj.id === projectId);
        if (p && p.tasks) {
          const t = p.tasks.find(tk => tk.id === taskId);
          if (t) t.completed = !t.completed;
          break;
        }
      }
    },
    addOpenPoint: (state, action) => {
      const { projectId, openPoint } = action.payload;
      for (const grp of state.groups) {
        const p = grp.projects.find(proj => proj.id === projectId);
        if (p) {
          if (!p.openPoints) p.openPoints = [];
          p.openPoints.push({
            id: 'op_' + Date.now(),
            status: 'Em aberto',
            ...openPoint
          });
          break;
        }
      }
    },
    addRedFlag: (state, action) => {
      const { projectId, redFlag } = action.payload;
      for (const grp of state.groups) {
        const p = grp.projects.find(proj => proj.id === projectId);
        if (p) {
          if (!p.redFlags) p.redFlags = [];
          p.redFlags.push({
            id: 'rf_' + Date.now(),
            date: new Date().toISOString().split('T')[0],
            ...redFlag
          });
          break;
        }
      }
    },
    escalateProjectItem: (state, action) => {
      const { projectId, itemId, itemType, escalationData, author } = action.payload;
      const today = new Date().toISOString().split('T')[0];
      const timeStr = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      for (const grp of state.groups) {
        const p = grp.projects.find(proj => proj.id === projectId);
        if (p) {
          // 1. Mark target item as escalated
          if (itemType === 'openPoint' && p.openPoints) {
            const item = p.openPoints.find(op => op.id === itemId);
            if (item) {
              item.isEscalated = true;
              item.escalationData = escalationData;
            }
          } else if (itemType === 'redFlag' && p.redFlags) {
            const item = p.redFlags.find(rf => rf.id === itemId);
            if (item) {
              item.isEscalated = true;
              item.escalationData = escalationData;
            }
          } else if (itemType === 'task' && p.tasks) {
            const item = p.tasks.find(tk => tk.id === itemId);
            if (item) {
              item.isEscalated = true;
              item.escalationData = escalationData;
            }
          }

          // 2. Append to changeMatrix (Audit Trail)
          if (!p.changeMatrix) p.changeMatrix = [];
          p.changeMatrix.unshift({
            id: 'cm_' + Date.now(),
            date: `${today} ${timeStr}`,
            author: author || 'Analista',
            field: 'Escalação de BO ao Gestor',
            oldValue: 'Operação Normal',
            newValue: `[${escalationData.severity || 'Alta'}] ${escalationData.emailSubject || 'Escalação de BO'}: ${escalationData.details}`,
            reason: escalationData.situation || 'Solicitação de Intervenção do Gestor'
          });

          // 3. Add to files/emails section
          if (!p.files) p.files = [];
          p.files.unshift({
            id: 'email_' + Date.now(),
            name: `[E-mail de Escalação] ${escalationData.emailSubject}`,
            size: 'Draft',
            uploadDate: today,
            type: 'Email',
            sender: author || 'Analista',
            subject: escalationData.emailSubject,
            content: `Prezado Gestor,\n\nEstou escalando o seguinte BO referente ao projeto ${p.title}:\n\n- Situação: ${escalationData.situation}\n- Detalhamento: ${escalationData.details}\n\nSolicito apoio e direcionamento para a resolução.\n\nAtenciosamente,\n${author || 'Analista'}`
          });

          break;
        }
      }
    },
    updateProjectFieldWithAudit: (state, action) => {
      const { projectId, updates, fieldLabel, oldValue, newValue, user } = action.payload;
      const now = new Date();
      const dateStr = now.toLocaleDateString('pt-BR') + ' ' + now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      const authorStr = user?.name ? `${user.name} (${user.role || 'ANALISTA'})` : 'Usuário (ANALISTA)';

      for (const grp of state.groups) {
        const p = grp.projects.find(proj => proj.id === projectId);
        if (p) {
          // Merge updates into project
          Object.assign(p, updates);

          // Audit trail entry
          if (!p.changeMatrix) p.changeMatrix = [];
          p.changeMatrix.unshift({
            id: 'cm_' + Date.now(),
            date: dateStr,
            author: authorStr,
            field: fieldLabel || 'Campo do Projeto',
            oldValue: oldValue ? String(oldValue) : '-',
            newValue: newValue ? String(newValue) : '-',
            description: `Campo "${fieldLabel || 'Projeto'}" alterado por ${authorStr}`
          });
          break;
        }
      }
    }
  }
});

export const {
  selectProject,
  addProject,
  updateProject,
  addTaskToProject,
  toggleTaskCompleted,
  addOpenPoint,
  addRedFlag,
  escalateProjectItem,
  updateProjectFieldWithAudit
} = projectSlice.actions;

export default projectSlice.reducer;
