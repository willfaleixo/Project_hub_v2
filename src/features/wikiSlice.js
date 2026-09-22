import { createSlice } from '@reduxjs/toolkit';

const initialWikiSections = [
  {
    id: 'impl-genres',
    category: 'guias',
    type: 'article',
    title: '📘 Como Implantar Cada Gênero de Projeto',
    content: `• **CTI / Telefonia Genesys:** Requer validação prévia de largura de banda, licenças de agentes, gravação de chamadas, integração via SIP/WebRTC e homologação de fluxos de URA no Genesys AppFoundry.\n• **eCommerce / Digital:** Exige homologação do gateway de pagamento, testes de carga, conformidade LGPD/PCI-DSS e verificação de responsividade em múltiplos navegadores e dispositivos.\n• **Nova Operação / SaaS:** Demanda playbook de onboarding de usuários, parametrização do banco de dados, matriz RACI operacional e plano de transição para o time de sustentação.`,
    isCustom: false
  },
  {
    id: 'basics',
    category: 'metodologias',
    type: 'article',
    title: '🛠️ Explicações Básicas & Metodologias de Projeto',
    content: `• **Ciclo de Vida do Projeto:** Iniciação (Charter) ➔ Planejamento (Gantt & WBS) ➔ Execução & Monitoramento ➔ Encerramento.\n• **Agile vs. Waterfall:** Projetos digitais rápidos adotam Sprints quinzenais no Jira. Projetos de infraestrutura e CTI utilizam modelo híbrido com marcos rígidos de homologação.`,
    isCustom: false
  },
  {
    id: 'capex-opex',
    category: 'financeiro',
    type: 'article',
    title: '💰 Guia Capex vs. Opex',
    content: `• **Capex (Capital Expenditure):** Investimentos em bens de capital de longo prazo (compra de servidores, licenças perpétuas, ativos tangíveis). São depreciados ao longo do tempo.\n• **Opex (Operational Expenditure):** Despesas operacionais recorrentes (assinaturas SaaS mensais, suporte, nuvem, consultoria sob demanda). São dedutíveis no ano corrente.`,
    isCustom: false
  },
  {
    id: 'si-vendor',
    category: 'processos',
    type: 'article',
    title: '🛡️ Como Validar Fornecedor com Segurança da Informação (SI)',
    content: `1. Solicitar o Questionário de Segurança do Fornecedor (VSAQ).\n2. Exigir relatórios de pentest recentes e certificações ISO 27001 / SOC 2 Tipo II.\n3. Abrir chamado na fila de SI com antecedência mínima de 15 dias úteis antes do aceite contratual.`,
    isCustom: false
  },
  {
    id: 'procurement',
    category: 'processos',
    type: 'article',
    title: '⏳ Como Fazer Contratação e Timings Corporativos',
    content: `• **RFP / Cotação (Procurement):** 10 a 15 dias úteis.\n• **Validação Jurídica & SI:** 10 dias úteis.\n• **Aprovação de Alçada Financeira:** 5 dias úteis.\n• **Total Estimado de Lead Time:** 30 a 45 dias antes da data de início planejada.`,
    isCustom: false
  },
  {
    id: 'mis-forecast',
    category: 'processos',
    type: 'article',
    title: '📊 Como Pedir Forecast para MIS (Management Information Systems)',
    content: `• Enviar o modelo estipulado até o dia 20 de cada mês.\n• Informar volume esperado de chamadas, número de licenças de agentes ativas e previsão de pico de tráfego.\n• Anexar o Termo de Abertura aprovado e o código do centro de custo responsável.`,
    isCustom: false
  },
  {
    id: 'stakeholders-list',
    category: 'equipe',
    type: 'article',
    title: '👥 Pessoas de Interesse, Áreas & Responsabilidades',
    content: `• **Segurança da Informação (SI):** Marcos Silva (msilva@empresa.com) — Validação de fornecedores e compliance.\n• **Procurement & Compras:** Ana Paula (compras@empresa.com) — Negociação contratual e emissão de PO.\n• **MIS & Analytics:** Roberto Lima (mis@empresa.com) — Dimensionamento e forecasts operacionais.\n• **PMO Governance:** Claudia & Daniela — Metodologia, acompanhamento de charter e comitê.`,
    isCustom: false
  }
];

const savedCustomArticles = JSON.parse(localStorage.getItem('hub_wiki_custom_articles')) || [];

const initialState = {
  sections: [...initialWikiSections, ...savedCustomArticles]
};

export const wikiSlice = createSlice({
  name: 'wiki',
  initialState,
  reducers: {
    addWikiArticle: (state, action) => {
      const newArticle = {
        id: 'wiki_' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        isCustom: true,
        ...action.payload
      };

      state.sections.unshift(newArticle);

      // Save custom ones in localStorage
      const customArticles = state.sections.filter(s => s.isCustom);
      localStorage.setItem('hub_wiki_custom_articles', JSON.stringify(customArticles));
    },
    deleteWikiArticle: (state, action) => {
      const targetId = action.payload;
      state.sections = state.sections.filter(s => s.id !== targetId);

      const customArticles = state.sections.filter(s => s.isCustom);
      localStorage.setItem('hub_wiki_custom_articles', JSON.stringify(customArticles));
    }
  }
});

export const { addWikiArticle, deleteWikiArticle } = wikiSlice.actions;
export default wikiSlice.reducer;
