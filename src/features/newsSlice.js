import { createSlice } from '@reduxjs/toolkit';

const mockNews = [
  {
    id: 'news_1',
    title: 'Integração Completa com Vercel SPA e Supabase Backend',
    version: 'v2.5.0',
    type: 'RELEASE', // RELEASE, FEATURE, MEHORIA, COMUNICADO, BUGFIX
    pinned: true,
    author: 'Alex Low (Admin)',
    authorRole: 'ADMIN',
    date: '2026-09-22T08:30:00.000Z',
    readBy: [],
    mustHave: [
      'Deploy automatizado na Vercel com rewrites de SPA para rotas limpas',
      'Integração nativa com cliente Supabase (@supabase/supabase-js)',
      'Script SQL de banco de dados (schema.sql) incluso no projeto',
      'Repositório oficial sincronizado no GitHub (willfaleixo/Project_hub_v2)'
    ],
    content: 'Temos o prazer de anunciar a integração oficial com a infraestrutura cloud da Vercel e o banco de dados Supabase! O repositório no GitHub já conta com pipeline de produção configurado e suporte a persistência híbrida (Redux/Local + Cloud).'
  },
  {
    id: 'news_2',
    title: 'Painel Executivo de Gestão de Usuários e Edição de Cards',
    version: 'v2.4.0',
    type: 'FEATURE',
    pinned: true,
    author: 'Alex Low (Admin)',
    authorRole: 'ADMIN',
    date: '2026-09-22T08:00:00.000Z',
    readBy: [],
    mustHave: [
      'Cadastro e edição completa de cards de usuários (nome, e-mail, perfil e senha)',
      'Acessos criados para a equipe de Analistas e Gestores Luxottica',
      'Módulos de presença online/offline em tempo real',
      'Simulador de login para rápida alteração de perfil de teste'
    ],
    content: 'Foi lançado o módulo de Gestão & Presença de Usuários. Administradores e Gestores possuem total controle para alterar qualquer informação nos cards dos colaboradores, redefinir senhas e gerenciar os níveis de acesso (Admin, Gestor, Analista e Viewer).'
  },
  {
    id: 'news_3',
    title: 'Exportador de BBP (Business Blueprint) e Relatórios em PDF',
    version: 'v2.3.0',
    type: 'MEHORIA',
    pinned: false,
    author: 'Claudia (Gestora)',
    authorRole: 'GESTOR',
    date: '2026-09-20T14:15:00.000Z',
    readBy: [],
    mustHave: [
      'Geração automática do documento oficial BBP por projeto',
      'Visão hierárquica em árvore na aba Visão Expandida',
      'Exportação de cronogramas e Matriz RACI para relatórios executivos'
    ],
    content: 'A ferramenta agora suporta a exportação em PDF do Business Blueprint completo de cada projeto, permitindo consolidação de escopo, prazos e entregáveis com apenas um clique.'
  },
  {
    id: 'news_4',
    title: 'Central de Documentos Wiki e Visualizador de PDF Inline',
    version: 'v2.2.0',
    type: 'FEATURE',
    pinned: false,
    author: 'Bruno (Analista)',
    authorRole: 'ANALISTA',
    date: '2026-09-18T10:00:00.000Z',
    readBy: [],
    mustHave: [
      'Visualização de manuais e relatórios em PDF dentro da própria aplicação',
      'Organização de artigos técnicos por categorias',
      'Filtros de busca rápida por palavras-chave na base de conhecimento'
    ],
    content: 'A aba Wiki de Projetos foi ativada. Agora é possível anexar documentos normativos, relatórios e arquivos PDF com abertura inline em modal sem necessidade de download prévio.'
  }
];

const getInitialNews = () => {
  try {
    const saved = JSON.parse(localStorage.getItem('hub_news_items'));
    if (!saved || !Array.isArray(saved) || saved.length === 0) {
      return mockNews;
    }
    // Merge mock items if missing
    const merged = [...saved];
    mockNews.forEach(item => {
      if (!merged.some(n => n.id === item.id)) {
        merged.push(item);
      }
    });
    localStorage.setItem('hub_news_items', JSON.stringify(merged));
    return merged;
  } catch (e) {
    return mockNews;
  }
};

const initialItems = getInitialNews();

const initialState = {
  items: initialItems,
  filterType: 'ALL', // ALL, COMUNICADO, RELEASE, FEATURE, MEHORIA, BUGFIX, PINNED
  searchTerm: ''
};

export const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    addNewsItem: (state, action) => {
      const newItem = {
        id: 'news_' + Date.now(),
        date: new Date().toISOString(),
        readBy: [],
        pinned: false,
        ...action.payload
      };
      state.items.unshift(newItem);
      localStorage.setItem('hub_news_items', JSON.stringify(state.items));
    },
    updateNewsItem: (state, action) => {
      const updated = action.payload;
      const index = state.items.findIndex(n => n.id === updated.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updated };
        localStorage.setItem('hub_news_items', JSON.stringify(state.items));
      }
    },
    deleteNewsItem: (state, action) => {
      state.items = state.items.filter(n => n.id !== action.payload);
      localStorage.setItem('hub_news_items', JSON.stringify(state.items));
    },
    togglePinNews: (state, action) => {
      const target = state.items.find(n => n.id === action.payload);
      if (target) {
        target.pinned = !target.pinned;
        localStorage.setItem('hub_news_items', JSON.stringify(state.items));
      }
    },
    markNewsAsRead: (state, action) => {
      const { newsId, userId } = action.payload;
      const target = state.items.find(n => n.id === newsId);
      if (target && !target.readBy.includes(userId)) {
        target.readBy.push(userId);
        localStorage.setItem('hub_news_items', JSON.stringify(state.items));
      }
    },
    setNewsFilterType: (state, action) => {
      state.filterType = action.payload;
    },
    setNewsSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    }
  }
});

export const {
  addNewsItem,
  updateNewsItem,
  deleteNewsItem,
  togglePinNews,
  markNewsAsRead,
  setNewsFilterType,
  setNewsSearchTerm
} = newsSlice.actions;

export default newsSlice.reducer;
