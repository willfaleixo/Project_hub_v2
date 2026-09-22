import { createSlice } from '@reduxjs/toolkit';

const initialNotifications = [
  {
    id: 'n1',
    title: 'Projeto Solicitado',
    message: 'Novo projeto "Consultoria em Gestão de Projetos" aguardando sua aprovação.',
    type: 'approval',
    read: false,
    timestamp: 'Há 10 minutos'
  },
  {
    id: 'n2',
    title: 'Lembrete de Tarefa',
    message: 'A tarefa "Validar Fornecedor SI" no projeto AGGB vence em 2 dias.',
    type: 'task',
    read: false,
    timestamp: 'Há 1 hora'
  },
  {
    id: 'n3',
    title: 'Aprovação Concluída',
    message: 'A alteração de prazo do projeto "Web Site" foi aprovada por Bruno.',
    type: 'info',
    read: true,
    timestamp: 'Ontem'
  }
];

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: initialNotifications
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift({
        id: 'n_' + Date.now(),
        read: false,
        timestamp: 'Agora',
        ...action.payload
      });
    },
    markAsRead: (state, action) => {
      const item = state.items.find(n => n.id === action.payload);
      if (item) item.read = true;
    },
    markAllAsRead: (state) => {
      state.items.forEach(n => n.read = true);
    },
    removeNotification: (state, action) => {
      state.items = state.items.filter(n => n.id !== action.payload);
    }
  }
});

export const { addNotification, markAsRead, markAllAsRead, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
