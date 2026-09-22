import { createSlice } from '@reduxjs/toolkit';

const initialApprovals = [
  {
    id: 'app_1',
    projectId: 'p_1',
    projectName: 'Consultoria em Gestão de Projetos',
    groupName: 'AGGB',
    requester: 'Claudia',
    requestedDate: '2026-09-14',
    type: 'Termo de Abertura',
    status: 'Pendente',
    comments: 'Solicitação de abertura enviada conforme preenchimento do Termo de Abertura.'
  },
  {
    id: 'app_2',
    projectId: 'p_2',
    projectName: 'Web Site',
    groupName: 'AGGB',
    requester: 'Daniela',
    requestedDate: '2026-09-12',
    type: 'Alteração de Escopo & Custos',
    status: 'Aprovado',
    comments: 'Aumento de 15% no Capex para módulo de e-commerce aprovado pela liderança.'
  }
];

export const approvalSlice = createSlice({
  name: 'approvals',
  initialState: {
    items: initialApprovals
  },
  reducers: {
    addApprovalRequest: (state, action) => {
      state.items.unshift({
        id: 'app_' + Date.now(),
        status: 'Pendente',
        requestedDate: new Date().toISOString().split('T')[0],
        ...action.payload
      });
    },
    updateApprovalStatus: (state, action) => {
      const { id, status, approverNotes } = action.payload;
      const app = state.items.find(a => a.id === id);
      if (app) {
        app.status = status;
        app.approverNotes = approverNotes;
        app.approvedDate = new Date().toISOString().split('T')[0];
      }
    }
  }
});

export const { addApprovalRequest, updateApprovalStatus } = approvalSlice.actions;
export default approvalSlice.reducer;
